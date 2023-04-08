import { AwesomeTree, GetPathOptions, Key, MergedPath, TreeNode } from './interface';

export function getPath<R, G, I, T extends boolean>(
  key: Key | null | undefined,
  options: GetPathOptions<T>,
  asTree: AwesomeTree<R, G, I>
): T extends true ? MergedPath<R, G> : MergedPath<R> {
  const { includeGroup = true, includeSelf = true } = options;
  const treeNodeMap = asTree.treeNodeMap;
  let treeNode = key === null || key === undefined ? null : treeNodeMap.get(key) ?? null;
  const mergedPath: MergedPath<R, G> = {
    keyPath: [],
    treeNodePath: [],
    treeNode: treeNode as TreeNode<R, G> | null,
  };
  // 忽略首个ignored tree节点
  if (treeNode?.ignored) {
    mergedPath.treeNode = null;
    return mergedPath as any;
  }

  while (treeNode) {
    if (!treeNode.ignored && (includeGroup || !treeNode.isGroup)) {
      mergedPath.treeNodePath.push(treeNode as any);
      mergedPath.keyPath.push(treeNode.key);
    }
    treeNode = treeNode.parent as any;
  }
  mergedPath.treeNodePath.reverse();
  mergedPath.keyPath.reverse();
  if (!includeSelf) {
    mergedPath.treeNodePath.pop();
    mergedPath.keyPath.pop();
  }

  return mergedPath as any;
}
