import { AwsTreeNode } from './interface'

export function nested<R, G, S>(
  ancestor: AwsTreeNode<R, G, S>,
  child: AwsTreeNode<R, G, S> | null | undefined,
  isDirect: boolean = false
): boolean {
  const aKey = ancestor.key
  
  if (isDirect) {
    return child.key === aKey
  }
  
  while (child) {
    if (child.key === aKey) return true
    child = child.parent as any
  }
  return false
}
