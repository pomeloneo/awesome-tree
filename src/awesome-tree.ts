import {
  AwesomeTree,
  AwsTreeNode,
  AwsTreeNodeOperators,
  GetPathOptions,
  Key,
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

  const awsTreeNodeMap = new Map()
  const leveledAwsTreeNodeMap = new Map()

  const awsTreeNodePrototype = Object.assign({
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
  })

  const awsTreeNodes: Array<AwsTreeNode<R, G, S>> = generateTreeNodes<R, G, S>(
    rawNodes,
    awsTreeNodeMap,
    leveledAwsTreeNodeMap,
    awsTreeNodePrototype,
    getChildren
  )

  function getNode(key: Key | null | undefined) {
    if (key == null) return null

    const awsTreeNode = awsTreeNodeMap.get(key)

    return awsTreeNode
  }

  const awesomeTree: AwesomeTree<R, G, S> = {
    awsTreeNodes,
    awsTreeNodeMap,
    leveledAwsTreeNodeMap,
    getNode,
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
    flattenExpandedKeys(keys: Key[], skipGroup = true): Array<AwsTreeNode<R, G, S>> {
      return flattenExpandedKeys<R, G, S>(keys, skipGroup, awsTreeNodes)
    }
  }

  return awesomeTree
}
