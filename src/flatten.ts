import { AwsTreeNode, Key } from './interface'

function hasChildren<R, G, S>(node: AwsTreeNode<R, G, S>) {
  return node.children && node.children.length > 0
}

export function flatten<R, G, S>(
  treeNodes: Array<AwsTreeNode<R, G, S>> | AwsTreeNode<R, G, S>,
  skipGroupNode: boolean = true
): Array<AwsTreeNode<R, G, S>> {
  const flattenedNodes: Array<AwsTreeNode<R, G, S>> = []

  function dfs(treeNodes: Array<AwsTreeNode<R, G, S>>) {
    if (treeNodes && treeNodes.length) {
      treeNodes.forEach((node) => {
        if (node.isSpectre) return
        
        if (hasChildren(node)) {
          dfs(node.children)
        }
        
        if(skipGroupNode && node.isGroup) return
        flattenedNodes.push(node)
      })
    }
  }
  if (Array.isArray(treeNodes)) {
    dfs(treeNodes)
  } else if (hasChildren(treeNodes)) {
    dfs(treeNodes.children)
    flattenedNodes.push(treeNodes)
  }

  return flattenedNodes
}

export function flattenExpandedKeys<R, G, S>(
  expandedKeys: Key[],
  skipGroupNode: boolean = true,
  treeNodes: Array<AwsTreeNode<R, G, S>>
): Array<AwsTreeNode<R, G, S>> {
  const flattenedNodes: Array<AwsTreeNode<R, G, S>> = []
  const expandedKeySet = new Set<Key>(expandedKeys)

  function dfs(treeNodes: Array<AwsTreeNode<R, G, S>>) {
    if (treeNodes && treeNodes.length) {
      treeNodes.forEach((node) => {
        if (node.isSpectre) return
        
        //  group node always expand
        if (node.isGroup && hasChildren(node)) {
          dfs(node.children)
          if(!skipGroupNode && node.isGroup) {
            flattenedNodes.push(node)
          }
          return
        }
        
        if (expandedKeySet.has(node.key) && hasChildren(node)) {
          dfs(node.children)
        }
        
        flattenedNodes.push(node)
      })
    }
  }

  dfs(treeNodes)
  return flattenedNodes
}
