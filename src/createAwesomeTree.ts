import { getCheckedKeys } from './check'

import {
  toArray,
  unwrapCheckedKeys,
  unwrapIndeterminateKeys
} from './check-utils'
import { contains } from './contains'
import { createTreeNodes } from './createTreeNodes'
import { defaultGetChildren, defaultGetKey } from './defaultGetters'
import { flatten } from './flatten'
import { getNonLeafKeys } from './getNonLeafKeys'
import {
  AwesomeTree,
  AwesomeTreeOptions,
  CheckOptions,
  GetPrevNextOptions,
  InputMergedKeys,
  Key,
  LevelTreeNodeMap,
  RawNode,
  TreeNode,
  TreeNodeMap
} from './interface'
import { getPath } from './path'
import { getFirstUsefulNode, traverseMethods } from './treeTraverse'
import {
  isDisabled,
  isGroup,
  isIgnored,
  isLeaf,
  isShallowLoaded
} from './utils'

export function createAwesomeTree<R = RawNode, G = R, I = R>(
  rawNodes: Array<R | G | I>,
  options: AwesomeTreeOptions<R, G, I> = {}
): AwesomeTree<R, G, I> {
  const treeNodeMap: TreeNodeMap<R, G, I> = new Map()
  const levelTreeNodeMap: LevelTreeNodeMap<R, G, I> = new Map()
  const {
    getDisabled = isDisabled,
    getIgnored = isIgnored,
    getIsGroup = isGroup,
    getKey = defaultGetKey,
    customGetters = {},
    isShallowLoaded: customShallowLoaded
  } = options

  const _getChildren = options.getChildren ?? defaultGetChildren

  const getChildren = options.ignoreEmptyChildren
    ? (node: R | I | G) => {
        const children = _getChildren(node)
        if (Array.isArray(children)) {
          if (!children.length) {
            return null
          }
        }
        return children
      }
    : _getChildren

  const getNodeStatusMethods = {
    get key(): Key {
      return getKey((this as any).rawNode)
    },
    get disabled(): boolean {
      return getDisabled((this as any).rawNode)
    },
    get isGroup(): boolean {
      return getIsGroup((this as any).rawNode)
    },
    get isLeaf(): boolean {
      return isLeaf((this as any).rawNode, getChildren)
    },
    get shallowLoaded(): boolean {
      if (customShallowLoaded) {
        return customShallowLoaded((this as any).rawNode)
      }
      return isShallowLoaded((this as any).rawNode, getChildren)
    },
    get ignored(): boolean {
      return getIgnored((this as any).rawNode)
    }
  }

  const nodeTraverseMethods = {
    ...traverseMethods
  }

  const otherMethods = {
    contains<Row, Group, Ignore>(
      this: TreeNode<Row, Group, Ignore>,
      node: TreeNode<Row, Group, Ignore>
    ): boolean {
      return contains(this, node)
    }
  }
  const nodeProto = Object.assign(
    getNodeStatusMethods,
    nodeTraverseMethods,
    otherMethods
  )

  const treeNodes: Array<TreeNode<R, G, I>> = createTreeNodes<R, G, I>(
    rawNodes,
    treeNodeMap,
    levelTreeNodeMap,
    nodeProto,
    customGetters,
    getChildren
  )

  // 包括分组节点
  function getNode<T>(
    key: Key | null | undefined
  ): T extends null | undefined ? null : TreeNode<R, G>
  function getNode(key: Key | null | undefined): TreeNode<R, G> | null {
    if (key === null || key === undefined) {
      return null
    }

    const node = treeNodeMap.get(key)
    if (node && !node.ignored) {
      return node as unknown as TreeNode<R, G>
    }
    return null
  }

  function _getNode<T>(
    key: Key | null | undefined
  ): T extends null | undefined ? null : TreeNode<R, G>
  function _getNode(key: Key | null | undefined): TreeNode<R, G> | null {
    if (key === null || key === undefined) {
      return null
    }
    const node = treeNodeMap.get(key)
    if (node && !node.ignored) {
      return node as unknown as TreeNode<R, G>
    }
    return null
  }

  function getParent<T>(
    key: Key | null | undefined
  ): T extends null | undefined ? null : TreeNode<R>
  function getParent(key: Key | null | undefined): TreeNode<R> | null {
    const node = _getNode(key)
    if (!node) {
      return null
    }
    return node.getParent()
  }

  function getChild<T>(
    key: Key | null | undefined
  ): T extends null | undefined ? null : TreeNode<R>
  function getChild(key: Key | null | undefined): TreeNode<R> | null {
    const node = _getNode(key)
    if (!node) {
      return null
    }

    return node.getChild()
  }

  function getPrev<T>(
    key: Key | null | undefined,
    _options?: GetPrevNextOptions
  ): T extends null | undefined ? null : TreeNode<R>
  function getPrev(
    key: Key | null | undefined,
    _options?: GetPrevNextOptions
  ): TreeNode<R> | null {
    const node = _getNode(key)
    if (!node) {
      return null
    }
    return node.getPrev(_options)
  }

  function getNext<T>(
    key: Key | null | undefined,
    _options?: GetPrevNextOptions
  ): T extends null | undefined ? null : TreeNode<R>
  function getNext(
    key: Key | null | undefined,
    _options?: GetPrevNextOptions
  ): TreeNode<R> | null {
    const node = _getNode(key)
    if (!node) {
      return null
    }

    return node.getNext(_options)
  }

  const asTree: AwesomeTree<R, G, I> = {
    treeNodes,
    treeNodeMap,
    levelTreeNodeMap,

    maxLevel: Math.max(...levelTreeNodeMap.keys()),
    getChildren,
    getFlattenedNodes(expandedKeys) {
      return flatten(treeNodes, expandedKeys)
    },
    getPath(key, _options = {}) {
      return getPath(key, _options, asTree)
    },
    getNonLeafKeys(_options) {
      return getNonLeafKeys(treeNodes, _options)
    },
    getNode,
    getParent,
    getChild,
    getPrev,
    getNext,
    getFirstUsefulNode() {
      return getFirstUsefulNode(treeNodes)
    },
    getCheckedKeys(
      checkedKeys: Key[] | InputMergedKeys | null | undefined,
      _options: CheckOptions = {}
    ) {
      const { cascade = true, checkStrategy = 'all' } = _options
      return getCheckedKeys(
        {
          checkedKeys: unwrapCheckedKeys(checkedKeys),
          indeterminateKeys: unwrapIndeterminateKeys(checkedKeys),
          cascade,
          checkStrategy
        },
        asTree
      )
    },
    check(
      keysToCheck: Key | Key[] | null | undefined,
      checkedKeys: Key[] | InputMergedKeys,
      _options: CheckOptions = {}
    ) {
      const { cascade = true, checkStrategy = 'all' } = _options
      return getCheckedKeys(
        {
          checkedKeys: unwrapCheckedKeys(checkedKeys),
          indeterminateKeys: unwrapIndeterminateKeys(checkedKeys),
          keysToCheck:
            keysToCheck === undefined || keysToCheck === null
              ? []
              : toArray(keysToCheck),
          cascade,
          checkStrategy
        },
        asTree
      )
    },
    uncheck(
      keysToUncheck: Key | Key[] | null | undefined,
      checkedKeys: Key[] | InputMergedKeys,
      _options: CheckOptions = {}
    ) {
      const { cascade = true, checkStrategy = 'all' } = _options
      return getCheckedKeys(
        {
          checkedKeys: unwrapCheckedKeys(checkedKeys),
          indeterminateKeys: unwrapIndeterminateKeys(checkedKeys),
          keysToUncheck:
            keysToUncheck === null || keysToUncheck === undefined
              ? []
              : toArray(keysToUncheck),
          cascade,
          checkStrategy
        },
        asTree
      )
    }
  }

  return asTree
}
