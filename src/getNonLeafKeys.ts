import { GetNonLeafKeysOptions, Key, TreeNode } from './interface'

export function getNonLeafKeys<R, G, I>(
  treeNodes: Array<TreeNode<R, G, I>>,
  options: GetNonLeafKeysOptions = {}
): Key[] {
  const { preserveGroup = false } = options
  const keys: Key[] = []
  // use cb fn improve perf
  const cb = preserveGroup
    ? (node: TreeNode<R, G, I>) => {
        if (!node.isLeaf) {
          keys.push(node.key)
          t(node.children as Array<TreeNode<R, G, I>>)
        }
      }
    : (node: TreeNode<R, G, I>) => {
        if (!node.isLeaf) {
          if (!node.isGroup) {
            keys.push(node.key)
            t(node.children as Array<TreeNode<R, G, I>>)
          }
        }
      }
  const t = (nodes: Array<TreeNode<R, G, I>>): void => {
    nodes.forEach(cb)
  }

  t(treeNodes)
  return keys
}
