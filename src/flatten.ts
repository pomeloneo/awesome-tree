import { Key, TreeNode } from './interface'

export function flatten<R, G, I>(
  treeNodes: Array<TreeNode<R, G, I>>,
  expandedKeys?: Key[]
): Array<TreeNode<R, G, I>> {
  const expandedKeySet = expandedKeys ? new Set<Key>(expandedKeys) : undefined
  const flattenedNodes: Array<TreeNode<R, G, I>> = []
  function t(nodes: Array<TreeNode<R, G, I>>): void {
    nodes.forEach(treeNode => {
      // node that in 0 level it is default expand
      flattenedNodes.push(treeNode)
      if (treeNode.isLeaf || !treeNode.children || treeNode.ignored) {
        return
      }
      // group node is always expand so should skip
      if (treeNode.isGroup) {
        t(treeNode.children)
      } else if (
        expandedKeySet === undefined ||
        expandedKeySet.has(treeNode.key)
      ) {
        t(treeNode.children)
      }
    })
  }

  t(treeNodes)
  return flattenedNodes
}
