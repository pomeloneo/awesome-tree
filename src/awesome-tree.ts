import {
  AwesomeTree,
  AwsTreeNode,
  AwsTreeNodeMap,
  AwsTreeNodeOperators,
  GetNextTargetOptions,
  GetPathOptions,
  GetPrevTargetOptions,
  Key,
  LeveledAwsTreeNodeMap,
  MaybeAwsTreeNode,
  RawNode
} from './interface'

import {
  defaultGetChildren,
  defaultGetKey,
  defaultIsDisabled,
  defaultIsGroup,
  defaultIsLeaf,
  defaultIsSpectre
} from './internal-utils'

import { getPath } from './path'
import { nested } from './nested'
import { flatten, flattenExpandedKeys } from './flatten'
import { getFirstAvailableNode, moveMethods } from './move'

function generateTreeNodes<R, G, S>(
  rawNodes: Array<R | G | S>,
  awsTreeNodeMap,
  leveledAwsTreeNodeMap,
  awsTreeNodePrototype,
  getChildren,
  parent = null,
  level: number = 0
) {
  const awsTreeNodes: Array<AwsTreeNode<R, G, S>> = []
  rawNodes.forEach((rawNode, index) => {
    const awsTreeNode: AwsTreeNode<R, G, S> =
      Object.create(awsTreeNodePrototype)
    awsTreeNode.rawNode = rawNode
    awsTreeNode.parent = parent
    awsTreeNode.siblings = awsTreeNodes
    awsTreeNode.index = index
    awsTreeNode.level = level
    awsTreeNode.isFirstNode = index === 0
    awsTreeNode.isLastNode = awsTreeNodes.length - 1 === index

    // skip spectre node
    if (!awsTreeNode.isSpectre) {
      const rawChildren = getChildren(rawNode as R)
      if (Array.isArray(rawChildren)) {
        awsTreeNode.children = generateTreeNodes<R, G, S>(
          rawChildren,
          awsTreeNodeMap,
          leveledAwsTreeNodeMap,
          awsTreeNodePrototype,
          getChildren,
          awsTreeNode,
          level + 1
        )
      }
    }

    awsTreeNodes.push(awsTreeNode)
    awsTreeNodeMap.set((awsTreeNode as any).key, awsTreeNode)

    if (!leveledAwsTreeNodeMap.has(level)) {
      leveledAwsTreeNodeMap.set(level, [])
    }
    leveledAwsTreeNodeMap.get(level)?.push(awsTreeNode)
  })

  return awsTreeNodes
}

export function createAwesomeTree<R = RawNode, G = R, S = R>(
  rawNodes: Array<R>,
  options: AwsTreeNodeOperators<R, G, S> = {}
) {
  const {
    isDisabled = defaultIsDisabled,
    getKey = defaultGetKey,
    getChildren = defaultGetChildren,
    isGroup = defaultIsGroup,
    isSpectre = defaultIsSpectre,
    isLeaf = defaultIsLeaf
  } = options

  const awsTreeNodeMap: AwsTreeNodeMap<R, G, S> = new Map()
  const leveledAwsTreeNodeMap: LeveledAwsTreeNodeMap<R, G, S> = new Map()

  const awsTreeNodePrototype = Object.assign(
    {
      get key(): Key {
        return getKey((this as any).rawNode)
      },
      get disabled(): boolean {
        return isDisabled((this as any).rawNode)
      },
      get isGroup(): boolean {
        return isGroup((this as any).rawNode)
      },
      get isSpectre(): boolean {
        return isSpectre((this as any).rawNode)
      },
      get isLeaf(): boolean {
        return isLeaf((this as any).rawNode, getChildren)
      },
      nested<R, G, S>(
        this: AwsTreeNode<R, G, S>,
        node: AwsTreeNode<R, G, S>,
        isDirect: boolean = false
      ): boolean {
        return nested(this, node, isDirect)
      }
    },
    moveMethods
  )

  const awsTreeNodes: Array<AwsTreeNode<R, G, S>> = generateTreeNodes<R, G, S>(
    rawNodes,
    awsTreeNodeMap,
    leveledAwsTreeNodeMap,
    awsTreeNodePrototype,
    getChildren
  )

  // for get normal node
  function getNode<T>(
    key: Key | null | undefined
  ): T extends null | undefined ? null : AwsTreeNode<R> | null
  function getNode(key: Key | null | undefined): AwsTreeNode<R> | null {
    if (key == null) return null
    const node = awsTreeNodeMap.get(key)

    if (node && !node.isGroup && !node.isSpectre)
      return node as unknown as AwsTreeNode<R>

    return null
  }

  // for get group node
  function getGroupNode<T>(
    key: Key | null | undefined
  ): T extends null | undefined ? null : AwsTreeNode<G> | null
  function getGroupNode(key: Key | null | undefined): AwsTreeNode<G> | null {
    if (key == null) return null
    const node = awsTreeNodeMap.get(key)

    if (node && node.isGroup) return node as unknown as AwsTreeNode<G>

    return null
  }

  // get normal node & group node
  function _getNode<T = Key>(
    key: Key | null | undefined
  ): T extends null | undefined ? null : AwsTreeNode<R, G> | null
  function _getNode(
    key: Key | null | undefined
  ): AwsTreeNode<R, G> | null {
    if (key == null) return null
    const node = awsTreeNodeMap.get(key)
    if (node && !node.isSpectre) return node as unknown as AwsTreeNode<R, G>
    return null
  }

  function getPrev<T>(
    key: Key | null | undefined,
    options?: GetPrevTargetOptions
  ): T extends null | undefined ? null : AwsTreeNode<R>
  function getPrev(
    key: Key | null | undefined,
    options?: GetPrevTargetOptions
  ): AwsTreeNode<R> | null {
    if (key == null) return null
    const node = _getNode(key)
    if (!node) return null

    return node.getPrev(options)
  }

  function getNext<T>(
    key: Key | null | undefined,
    options: GetNextTargetOptions
  ): T extends null | undefined ? null : AwsTreeNode<R> | null
  function getNext(
    key: Key | null | undefined,
    options: GetNextTargetOptions
  ): AwsTreeNode<R> | null {
    const node = _getNode(key)
    if (!node) return null
    return node.getNext(options)
  }
  
  function getParent<T>(
    key: Key | null | undefined
  ): T extends null | undefined ? null : AwsTreeNode<R> | null
  function getParent(
    key: Key | null | undefined
  ): AwsTreeNode<R> | null {
    const node = _getNode(key)
    if (!node) return null
    
    return node.getParent()
  }
  
  function getChild<T>(
    key: Key | null | undefined
  ): T extends null | undefined ? null : AwsTreeNode<R> | null
  function getChild(
    key: Key | null | undefined
  ): AwsTreeNode<R> | null {
    const node = _getNode(key)
    if (!node) return null
    
    return node.getChild()
  }
  

  const awesomeTree: AwesomeTree<R, G, S> = {
    awsTreeNodes,
    awsTreeNodeMap,
    leveledAwsTreeNodeMap,
    getNode,
    getGroupNode,
    getPath(key: Key | null | undefined, options: GetPathOptions = {}) {
      return getPath<R, G, S>(key, options, awesomeTree)
    },
    nested,
    flatten(
      nodes: Array<AwsTreeNode<R, G, S>>,
      skipGroup?: boolean
    ): Array<AwsTreeNode<R, G, S>> {
      return flatten(nodes, skipGroup)
    },
    flattenExpandedKeys(
      keys: Key[],
      skipGroup = true
    ): Array<AwsTreeNode<R, G, S>> {
      return flattenExpandedKeys<R, G, S>(keys, skipGroup, awsTreeNodes)
    },
    getFirstAvailableNode(): AwsTreeNode<R> {
      return getFirstAvailableNode(awsTreeNodes)
    },
    getPrev,
    getNext,
    getParent,
    getChild
  }

  return awesomeTree
}
