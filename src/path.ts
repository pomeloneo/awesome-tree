import {
  AwesomeTree,
  AwsTreeNode,
  AwsTreePath,
  GetPathOptions,
  Key
} from './interface'

export function getPath<R, G, S>(
  key: Key | null | undefined,
  { includeSelf = true }: GetPathOptions,
  awesomeTree: AwesomeTree<R, G, S>
): AwsTreePath<R, G, S> {
  const awsTreeNodeMap = awesomeTree.awsTreeNodeMap

  let awsTreeNode = key == null ? null : awsTreeNodeMap.get(key)

  const awsTreePath: AwsTreePath<R, G, S> = {
    keyPath: [],
    awsTreeNodePath: [],
    awsTreeNode: awsTreeNode as AwsTreeNode<R, G, S> | null
  }

  while (awsTreeNode) {
    awsTreePath.awsTreeNodePath.push(awsTreeNode)
    awsTreeNode = awsTreeNode.parent
  }
  awsTreePath.awsTreeNodePath.reverse()

  if (!includeSelf) awsTreePath.awsTreeNodePath.pop()

  awsTreePath.keyPath = awsTreePath.awsTreeNodePath.map((n) => n.key)

  return awsTreePath
}
