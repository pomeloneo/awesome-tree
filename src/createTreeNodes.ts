import {
  GetChildren,
  LevelTreeNodeMap,
  TreeNode,
  TreeNodeMap
} from './interface'
import { CustomGetters } from './interface'

export function createTreeNodes<R, G, I>(
  rawNodes: Array<R | G | I>,
  treeNodeMap: TreeNodeMap<R, G, I>,
  levelTreeNodeMap: LevelTreeNodeMap<R, G, I>,
  nodeProto: any,
  customGetters: CustomGetters<R, G, I>,
  getChildren: GetChildren<R, G, I>,
  parent: TreeNode<R, G> | null = null,
  level = 0
): Array<TreeNode<R, G, I>> {
  const treeNodes: Array<TreeNode<R, G, I>> = []
  rawNodes.forEach((rawNode, index) => {
    const treeNode: TreeNode<R, G, I> = Object.create(nodeProto)
    for (const name of Object.keys(customGetters)) {
      Object.defineProperty(treeNode, name, {
        get() {
          return customGetters[name](treeNode)
        }
      })
    }

    treeNode.rawNode = rawNode
    treeNode.siblings = treeNodes
    treeNode.level = level
    treeNode.index = index
    treeNode.isFirstChild = index === 0
    treeNode.isLastChild = index + 1 === rawNodes.length
    treeNode.parent = parent
    if (!treeNode.ignored) {
      const rawChildren = getChildren(rawNode as R | G)
      if (Array.isArray(rawChildren)) {
        treeNode.children = createTreeNodes<R, G, I>(
          rawChildren,
          treeNodeMap,
          levelTreeNodeMap,
          nodeProto,
          customGetters,
          getChildren,
          (treeNode as unknown) as TreeNode<R, G>,
          level + 1
        )
      }
    }
    treeNodes.push(treeNode)
    treeNodeMap.set(treeNode.key, treeNode)
    if (!levelTreeNodeMap.has(level)) {
      levelTreeNodeMap.set(level, [])
    }
    levelTreeNodeMap.get(level)?.push(treeNode)
  })
  return treeNodes
}
