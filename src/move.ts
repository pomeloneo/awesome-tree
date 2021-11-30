import { AwsTreeNode, GetPrevNextTargetOptions } from './interface'

export function getFirstAvailableNode<R, G, S>(
  nodes: Array<AwsTreeNode<R, G, S>>
): AwsTreeNode<R> | null {
  if (nodes.length === 0) return null
  const node = nodes[0]
  if (node.isGroup || node.isSpectre || node.disabled) return node.getNext()
  return node as any as AwsTreeNode<R>
}

function _getNext(node: AwsTreeNode, loop: boolean): AwsTreeNode | null {
  const siblings = node.siblings

  const len = siblings.length
  const index = node.index
  if (loop) return siblings[(index + 1) % len]
  if (index === len - 1) return null
  return siblings[index + 1]
}

function _getPrev(node: AwsTreeNode, loop: boolean): AwsTreeNode | null {
  const siblings = node.siblings

  const len = siblings.length
  const index = node.index
  if (loop) return siblings[(index - 1) % len]
  if (index === 0) return null
  return siblings[index - 1]
}

function _getParent(node: AwsTreeNode): AwsTreeNode | null {
  return node.parent
}

function _getChild(
  node: AwsTreeNode,
  options: { reverse?: boolean } = {}
): AwsTreeNode | null {
  const { reverse = false } = options
  const children = node.children
  if (children) {
    const len = children.length
    const start = reverse ? len - 1 : 0
    const end = reverse ? -1 : len
    const step = reverse ? -1 : 1

    for (let i = start; reverse ? i > end : i < end; i += step) {
      const child = children[i]
      if (!child.disabled && !child.isSpectre) {
        if (child.isGroup) {
          return _getChild(child, options)
        }
        {
          return child
        }
      }
    }
  }
  return null
}

function getTarget(
  startNode: AwsTreeNode,
  options: GetPrevNextTargetOptions
): AwsTreeNode | null {
  const { loop = false, skipDisabled = false, dir } = options
  const iterator = dir === 'prev' ? _getPrev : _getNext
  let isFirstMeet = false
  let targetNode = null
  function visitor(node: AwsTreeNode): void {
    if (node === null) return
    if (node === startNode) {
      if (!isFirstMeet) {
        // record first meet，in order to distinguish whether it is because of loop mode
        isFirstMeet = true
      } else if (!startNode.disabled && !startNode.isGroup) {
        // loop mode && loop back
        targetNode = startNode
        return
      }
    } else {
      // basic logic process
      if (
        !node.isSpectre &&
        !node.isGroup &&
        (!node.disabled || skipDisabled === false)
      ) {
        targetNode = node
        return
      }
    }

    // the startNode is group, so visit it's child
    if (node.isGroup) {
      const child = _getChild(node, { reverse: dir === 'prev' })
      if (child != null) {
        targetNode = child
        return
      } else {
        // if child is null, wo need to visit groupNode's siblings
        visitor(iterator(node, loop))
      }
    } else {
      const nextNode = iterator(node, loop)
      if (nextNode != null) {
        visitor(nextNode)
      } else {
        const parent = _getParent(node)
        if (parent?.isGroup) {
          visitor(iterator(parent, loop))
        }
        return
      }
    }
  }
  visitor(startNode)
  return targetNode
}

export const moveMethods: Pick<
  AwsTreeNode,
  'getPrev' | 'getNext' | 'getParent' | 'getChild'
> = {
  getPrev(this: AwsTreeNode, options: GetPrevNextTargetOptions = {dir: 'prev'}) {
    return getTarget(this, options)
  },
  getNext(this: AwsTreeNode, options: GetPrevNextTargetOptions = {dir: 'next'}) {
    return getTarget(this, options)
  },
  getParent(this: AwsTreeNode) {
    if (this.isSpectre) return null
    const parent = this.parent
    if (parent?.isGroup) {
      return this.getParent()
    }
    return parent
  },
  getChild(this: AwsTreeNode) {
    if (this.isSpectre) return null
    return _getChild(this)
  }
}
