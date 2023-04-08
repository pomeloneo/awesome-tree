import {
  mergeKeys,
  rmKeys,
  traverseSignal,
  traverseWithSignalCb
} from './check-utils'
import { AwesomeTree, Key, MergedKeys, TreeNode } from './interface'
import { GetSpreadedCheckedKeySetAfterCheckOptions } from './interface'

/*
 * 本次暂无 disabled 节点，不处理disabled相关
 * 之后如需添加disable节点，需要额外处理
 * */

function getSpreadedCheckedKeySet<R, G, I>(
  checkedKeys: Key[],
  asTree: AwesomeTree<R, G, I>
): Set<Key> {
  const { treeNodeMap } = asTree
  const visitedKeySet: Set<Key> = new Set()
  const spreadedKeys: Set<Key> = new Set(checkedKeys)
  checkedKeys.forEach((checkedKey) => {
    const checkedNode = treeNodeMap.get(checkedKey)
    if (checkedNode !== undefined) {
      traverseWithSignalCb(checkedNode, (treeNode) => {
        const { key } = treeNode
        if (visitedKeySet.has(key)) return traverseSignal.CONTINUE
        visitedKeySet.add(key)

        spreadedKeys.add(key)

        return traverseSignal.CONTINUE
      })
    }
  })
  return spreadedKeys
}

function getAvailableAscendantNodeSet<R, G, I>(
  uncheckedKeys: Key[],
  asTree: AwesomeTree<R, G, I>
): Set<Key> {
  const visitedKeys: Set<Key> = new Set()
  uncheckedKeys.forEach((uncheckedKey) => {
    const uncheckedTreeNode = asTree.treeNodeMap.get(uncheckedKey)
    if (uncheckedTreeNode !== undefined) {
      let node = uncheckedTreeNode.parent
      while (node !== null) {
        if (visitedKeys.has(node.key)) {
          break
        } else {
          visitedKeys.add(node.key)
        }
        node = node.parent
      }
    }
  })
  return visitedKeys
}

function getSpreadedCheckedKeySetAfterUncheck<R, G, I>(
  uncheckedKeys: Key[],
  currentCheckedKeys: Key[],
  asTree: AwesomeTree<R, G, I>
): Set<Key> {
  const spreadedCheckedKeySet = getSpreadedCheckedKeySet(
    currentCheckedKeys,
    asTree
  )
  const spreadedKeySetToUncheck = getSpreadedCheckedKeySet(
    uncheckedKeys,
    asTree
  )
  const ascendantKeySet: Set<Key> = getAvailableAscendantNodeSet(
    uncheckedKeys,
    asTree
  )

  const keysToRemove: Key[] = []
  spreadedCheckedKeySet.forEach((key) => {
    if (spreadedKeySetToUncheck.has(key) || ascendantKeySet.has(key)) {
      keysToRemove.push(key)
    }
  })
  keysToRemove.forEach((key) => spreadedCheckedKeySet.delete(key))
  return spreadedCheckedKeySet
}

function getSpreadedCheckedKeySetAfterCheck<R, G, I>(
  checkKeys: Key[],
  currentCheckedKeys: Key[],
  asTree: AwesomeTree<R, G, I>
): Set<Key> {
  return getSpreadedCheckedKeySet(currentCheckedKeys.concat(checkKeys), asTree)
}

export function getCheckedKeys<R, G, I>(
  options: GetSpreadedCheckedKeySetAfterCheckOptions,
  asTree: AwesomeTree<R, G, I>
): MergedKeys {
  const {
    checkedKeys,
    keysToCheck,
    keysToUncheck,
    indeterminateKeys,
    cascade,
    checkStrategy
  } = options
  if (!cascade) {
    if (keysToCheck !== undefined) {
      return {
        checkedKeys: mergeKeys(checkedKeys, keysToCheck),
        indeterminateKeys: [...indeterminateKeys]
      }
    }
    if (keysToUncheck !== undefined) {
      return {
        checkedKeys: rmKeys(checkedKeys, keysToUncheck),
        indeterminateKeys: [...indeterminateKeys]
      }
    }
    return {
      checkedKeys: [...checkedKeys],
      indeterminateKeys: [...indeterminateKeys]
    }
  }

  const { levelTreeNodeMap } = asTree
  let spreadedCheckedKeySet: Set<Key>
  if (keysToUncheck !== undefined) {
    spreadedCheckedKeySet = getSpreadedCheckedKeySetAfterUncheck(
      keysToUncheck,
      checkedKeys,
      asTree
    )
  } else if (keysToCheck !== undefined) {
    spreadedCheckedKeySet = getSpreadedCheckedKeySetAfterCheck(
      keysToCheck,
      checkedKeys,
      asTree
    )
  } else {
    spreadedCheckedKeySet = getSpreadedCheckedKeySet(checkedKeys, asTree)
  }

  const isParentCheckStrategy = checkStrategy === 'parent'
  const isChildCheckStrategy = checkStrategy === 'child'

  const syntheticCheckedKeySet: Set<Key> = spreadedCheckedKeySet
  const syntheticIndeterminateKeySet: Set<Key> = new Set()
  const maxLevel = Math.max.apply(null, Array.from(levelTreeNodeMap.keys()))
  for (let level = maxLevel; level >= 0; level--) {
    const isZeroLevel = level === 0
    const levelTreeNodes = levelTreeNodeMap.get(level)
    if (levelTreeNodes) {
      for (const levelTreeNode of levelTreeNodes) {
        if (levelTreeNode.isLeaf) continue

        const { key: levelTreeNodeKey, shallowLoaded } = levelTreeNode
        if (isChildCheckStrategy && shallowLoaded) {
          levelTreeNode.children!.forEach((childNode) => {
            if (
              !childNode.isLeaf &&
              childNode.shallowLoaded &&
              syntheticCheckedKeySet.has(childNode.key)
            ) {
              syntheticCheckedKeySet.delete(childNode.key)
            }
          })
        }

        if (!shallowLoaded) {
          continue
        }

        const children = levelTreeNode?.children || []

        let fullyChecked = children.length > 0
        let partialChecked = false

        for (const childNode of children as Array<TreeNode<R, G, I>>) {
          const childKey = childNode.key
          if (syntheticCheckedKeySet.has(childKey)) {
            partialChecked = true
          } else if (syntheticIndeterminateKeySet.has(childKey)) {
            partialChecked = true
            fullyChecked = false
          } else {
            fullyChecked = false
            if (partialChecked) break
          }
        }

        if (fullyChecked) {
          if (isParentCheckStrategy) {
            levelTreeNode.children!.forEach((node) => {
              if (syntheticCheckedKeySet.has(node.key)) {
                syntheticCheckedKeySet.delete(node.key)
              }
            })
          }
          syntheticCheckedKeySet.add(levelTreeNodeKey)
        } else if (partialChecked) {
          syntheticIndeterminateKeySet.add(levelTreeNodeKey)
        }

        if (
          isZeroLevel &&
          isChildCheckStrategy &&
          syntheticCheckedKeySet.has(levelTreeNodeKey)
        ) {
          syntheticCheckedKeySet.delete(levelTreeNodeKey)
        }
      }
    }
  }

  return {
    checkedKeys: Array.from(syntheticCheckedKeySet),
    indeterminateKeys: Array.from(syntheticIndeterminateKeySet)
  }
}
