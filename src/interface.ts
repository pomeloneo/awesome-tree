export type Key = number | string

export interface RawNode {
  key?: Key
  children?: RawNode[]
  isLeaf?: boolean
  disabled?: boolean
  [key: string]: unknown
}

export interface GroupNode {
  key?: Key
  type: 'group'
  [key: string]: unknown
}

export interface SpectreNode {
  key?: Key
  type: 'spectre'
  [key: string]: unknown
}


export interface AwsTreeNode<R = RawNode, G = R, S = R> {
  key: Key
  rawNode: R | G | S
  level: number
  index: number
  children: Array<AwsTreeNode<R, G, S>>
  siblings: Array<AwsTreeNode<R, G, S>>
  parent: AwsTreeNode<R, G, S> | null
  isLeaf: boolean
  disabled: boolean
  isFirstNode: boolean
  isLastNode: boolean
  isGroup: boolean
  isSpectre: boolean
  nested: (
    node: AwsTreeNode<R, G, S>,
    isDirect?: boolean
  ) => boolean
  getPrev: (options?: GetPrevTargetOptions) => MaybeAwsTreeNode<R>
  getNext: (options?: GetNextTargetOptions) => MaybeAwsTreeNode<R>
  getParent: () => MaybeAwsTreeNode<R>
  getChild: () => MaybeAwsTreeNode<R>
}

export type MaybeAwsTreeNode<R> = AwsTreeNode<R> | null

export interface AwsTreeNodeOperators<R = RawNode , G = R , S = R> {
  getChildren?: (node: R | G | S) => Array<R | G |S> | unknown
  getKey?: (node: R | G | S) => Key
  isDisabled?: (node: R | G | S) => boolean
  isSpectre?: (node: R | G | S) => boolean
  isGroup?: (node: R | G | S) => boolean
  isLeaf?: (node: R | G | S, getChildren?: GetChildren<R, G, S>) => boolean
}

export interface GetPathOptions {
  includeSelf?: boolean
}

export interface BaseGetTargetOptions {
  loop?: boolean
  skipDisabled?: boolean
}
export interface GetPrevNextTargetOptions {
  dir: 'prev' | 'next'
  loop?: boolean
  skipDisabled?: boolean
}
export interface GetPrevTargetOptions extends BaseGetTargetOptions {
  dir: 'prev'
}
export interface GetNextTargetOptions extends BaseGetTargetOptions {
  dir: 'next'
}

export type GetChildren<R, G, S> = (node: R | G | S) => Array<R | G | S> | unknown

export type AwsTreeNodeMap<R, G, S> = Map<Key, AwsTreeNode<R, G, S>>
export type LeveledAwsTreeNodeMap<R, G, S> = Map<
  number,
  Array<AwsTreeNode<R, G, S>>
>

export type KeyToAwsTreeNode<R, G> = <T extends Key>(
  key: T
) => T extends null | undefined ? null : AwsTreeNode<R, G> | null

export type KeyToGroupNode<R,G> = <T extends Key>(
  key: T
) => T extends null | undefined ? null : AwsTreeNode<R, G> | null

export interface AwesomeTree<R, G, S> {
  awsTreeNodes: Array<AwsTreeNode<R, G, S>>
  awsTreeNodeMap: AwsTreeNodeMap<R, G, S>
  leveledAwsTreeNodeMap: LeveledAwsTreeNodeMap<R, G, S>
  getNode: KeyToAwsTreeNode<R, R>
  getGroupNode: KeyToGroupNode<G, G>
  getPath: (
    key: Key | null | undefined,
    options?: GetPathOptions
  ) => AwsTreePath<R, G, S>
  nested: (
    ancestor: AwsTreeNode<R, G, S>,
    node: AwsTreeNode<R, G, S>,
    isDirect?: boolean
  ) => boolean
  
  flatten: (nodes: Array<AwsTreeNode<R, G, S>>, skipGroup?: boolean) => Array<AwsTreeNode<R, G, S>>
  
  flattenExpandedKeys: (expandedKeys: Key[], skipGroup?: boolean) => Array<AwsTreeNode<R, G, S>>
  getFirstAvailableNode: () => AwsTreeNode<R>
  
  getPrev: (key: Key | null | undefined, options?: GetPrevTargetOptions) => AwsTreeNode<R> | null
  getNext: (key: Key | null | undefined, options?: GetNextTargetOptions) => AwsTreeNode<R> | null
  getParent: (key: Key | null | undefined) => MaybeAwsTreeNode<R>
  getChild: (key: Key | null | undefined) => MaybeAwsTreeNode<R>
}

export interface AwsTreePath<R, G, S> {
  keyPath: Key[]
  awsTreeNodePath: Array<AwsTreeNode<R, G, S>>
  awsTreeNode: AwsTreeNode<R, G, S> | null
}
