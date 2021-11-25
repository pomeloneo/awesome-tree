export type Key = number | string

export interface RawNode {
  key?: Key
  children?: RawNode[]
  isLeaf?: boolean
  disabled?: boolean
  [key: string]: unknown
}

export interface AwsTreeNode<R = RawNode> {
  key: Key
  rawNode: R
  level: number
  index: number
  children: Array<AwsTreeNode<R>>
  siblings: Array<AwsTreeNode<R>>
  parent: AwsTreeNode<R> | null
  isLeaf: boolean
  disabled: boolean
}

export interface AwsTreeNodeOperators<R> {
  getChildren?: (node: R) => Array<R> | unknown
  getKey?: (node: R) => Key
  getIsDisabled?: (node: R) => boolean
}

export interface GetPathOptions {
  includeSelf?: boolean
}

export type AwsTreeNodeMap<R> = Map<Key, AwsTreeNode<R>>
export type LeveledAwsTreeNodeMap<R> = Map<number, Array<AwsTreeNode<R>>>

type KeyToAwsTreeNode<R> = <T extends Key>(
  key: T
) => T extends null | undefined ? null : AwsTreeNode<R> | null

export interface AwesomeTree<R> {
  awsTreeNodes: Array<AwsTreeNode<R>>
  awsTreeNodeMap: AwsTreeNodeMap<R>
  leveledAwsTreeNodeMap: LeveledAwsTreeNodeMap<R>
  getNode: KeyToAwsTreeNode<R>
  getPath: (
    key: Key | null | undefined,
    options?: GetPathOptions
  ) => AwsTreePath<R>
}

export interface AwsTreePath<R> {
  keyPath: Key[]
  awsTreeNodePath: Array<AwsTreeNode<R>>
  awsTreeNode: AwsTreeNode<R> | null
}
