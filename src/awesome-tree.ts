import {
  AwesomeTree,
  AwsTreeNode,
  AwsTreeNodeOperators,
  GetPathOptions,
  Key,
  RawNode
} from './interface'
import { warn } from './logger'
import {
  defaultGetChildren,
  defaultGetKey,
  defaultIsDisabled
} from './internal'

import { getPath } from './path'

function generateTreeNodes<R = RawNode>(
  rawNodes: Array<R>,
  awsTreeNodeMap,
  leveledAwsTreeNodeMap,
  awsTreeNodePrototype,
  getChildren,
  parent = null,
  level: number = 0
) {
  const awsTreeNodes: Array<AwsTreeNode<R>> = []
  rawNodes.forEach((rawNode, index) => {
    const awsTreeNode: AwsTreeNode<R> = Object.create(awsTreeNodePrototype)
    awsTreeNode.rawNode = rawNode
    awsTreeNode.parent = parent
    awsTreeNode.siblings = awsTreeNodes
    awsTreeNode.index = index
    awsTreeNode.level = level

    const rawChildren = getChildren(rawNode as R)

    if (Array.isArray(rawChildren)) {
      awsTreeNode.children = generateTreeNodes<R>(
        rawChildren,
        awsTreeNodeMap,
        leveledAwsTreeNodeMap,
        awsTreeNodePrototype,
        getChildren,
        awsTreeNode,
        level + 1
      )
    } else {
      warn(`the key is ${awsTreeNode.key}'s children must be array`)
    }

    awsTreeNodes.push(awsTreeNode)
    awsTreeNodeMap.set((rawNode as any).key, awsTreeNode)

    if (!leveledAwsTreeNodeMap.has(level)) {
      leveledAwsTreeNodeMap.set(level, [])
    }
    leveledAwsTreeNodeMap.get(level)?.push(awsTreeNode)
  })

  return awsTreeNodes
}

export function createAwesomeTree<R = RawNode>(
  rawNodes: Array<R>,
  options: AwsTreeNodeOperators<R> = {}
) {
  const {
    getIsDisabled = defaultIsDisabled,
    getKey = defaultGetKey,
    getChildren = defaultGetChildren
  } = options

  const awsTreeNodeMap = new Map()
  const leveledAwsTreeNodeMap = new Map()

  const awsTreeNodePrototype = Object.assign({
    get key(): Key {
      return getKey((this as any).rawNode)
    },
    get disabled(): boolean {
      return getIsDisabled((this as any).rawNode)
    }
  })

  const awsTreeNodes: Array<AwsTreeNode<R>> = generateTreeNodes<R>(
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

  const awesomeTree: AwesomeTree<R> = {
    awsTreeNodes,
    awsTreeNodeMap,
    leveledAwsTreeNodeMap,
    getNode,
    getPath(key: Key | null | undefined, options: GetPathOptions = {}) {
      return getPath<R>(key, options, awesomeTree)
    }
  }

  return awesomeTree
}
