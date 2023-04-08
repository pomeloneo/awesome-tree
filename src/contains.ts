import { TreeNode } from './interface';

export function contains<R, G, I>(parent: TreeNode<R, G, I>, child: TreeNode<R, G, I>): boolean {
  const parentKey = parent.key;
  while (child) {
    if (child.key === parentKey) return true;

    child = child.parent as any;
  }
  return false;
}
