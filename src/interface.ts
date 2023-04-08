export type Key = string | number
export type CheckStrategy = 'all' | 'child' | 'parent'

export interface RawNode {
  key?: Key
  children?: RawNode[]
  isLeaf?: boolean
  disabled?: boolean
  type?: 'group' | 'ignore'
  [key: string]: unknown
}

export interface KeyedRawNode extends RawNode {
  key: Key
}

// R: RawNode
// G: GroupNode => {type: 'group}
// I: IgnoredNode => {type: 'ignore'}
export interface TreeNode<R = RawNode, G = R, I = R> {
  key: Key
  rawNode: R | G | I
  level: number
  index: number
  isFirstChild: boolean
  isLastChild: boolean
  parent: TreeNode<R, G> | null
  isLeaf: boolean
  isGroup: boolean
  ignored: boolean
  shallowLoaded: boolean
  disabled: boolean
  siblings: Array<TreeNode<R, G, I>>
  children?: Array<TreeNode<R, G, I>>
  getChild: () => TreeNode<R> | null
  getParent: () => TreeNode<R> | null
  getPrev: (options?: GetPrevNextOptions) => TreeNode<R> | null
  getNext: (options?: GetPrevNextOptions) => TreeNode<R> | null
  contains: (treeNode: TreeNode<R, G, I> | null | undefined) => boolean
}

export type TreeNodeMap<R, G, I> = Map<Key, TreeNode<R, G, I>>

export type LevelTreeNodeMap<R, G, I> = Map<number, Array<TreeNode<R, G, I>>>

export interface MergedKeys {
  checkedKeys: Key[]
  indeterminateKeys: Key[]
}
export interface InputMergedKeys {
  checkedKeys?: Key[] | null
  indeterminateKeys?: Key[] | null
}

export type GetChildren<R, G, I> = (
  node: R | G | I
) => Array<R | G | I> | unknown

export type KeyToNode<R, G> = <T extends Key | null | undefined>(
  key: T
) => T extends null | undefined ? null : TreeNode<R, G> | null

export type KeyToNonGroupNode<R> = <T extends Key | null | undefined>(
  key: T
) => T extends null | undefined ? null : TreeNode<R, R> | null

export type KeyToNonGroupNodeWithOption<R> = <T extends Key | null | undefined>(
  key: T,
  options: GetPrevNextOptions
) => T extends null | undefined ? null : TreeNode<R> | null

export type CustomGetters<R, G, I> = {
  [key: string]: (node: TreeNode<R, G, I>) => unknown
}

export interface AwesomeTreeOptions<R, G, I> {
  ignoreEmptyChildren?: boolean
  getChildren?: GetChildren<R, G, I>
  getKey?: (node: R | G | I) => Key
  getDisabled?: (node: R | G | I) => boolean
  getIsGroup?: (node: R | G | I) => boolean
  getIgnored?: (node: R | G | I) => boolean
  customGetters?: CustomGetters<R, G, I>
  isShallowLoaded?: (node: R | G | I) => boolean
}

export interface GetPathOptions<T extends boolean> {
  includeGroup?: T
  includeSelf?: boolean
}

export interface GetPrevNextOptions {
  loop?: boolean
  includeDisabled?: boolean
}

export interface GetNonLeafKeysOptions {
  preserveGroup?: boolean
}

export type GetSpreadedCheckedKeySetAfterCheckOptions = {
  checkedKeys: Key[]
  indeterminateKeys: Key[]
  keysToCheck?: Key[]
  keysToUncheck?: Key[]
  cascade: boolean
  checkStrategy: string
  // skipDisabled?: boolean
}
export interface CheckOptions {
  cascade?: boolean
  checkStrategy?: CheckStrategy
}

export interface MergedPath<R, G = R> {
  keyPath: Key[]
  treeNodePath: Array<TreeNode<R, G>>
  treeNode: TreeNode<R, G> | null
}

export interface AwesomeTree<R = RawNode, G = R, I = R> {
  treeNodes: Array<TreeNode<R, G, I>>
  treeNodeMap: TreeNodeMap<R, G, I>
  levelTreeNodeMap: LevelTreeNodeMap<R, G, I>

  maxLevel: number
  getFlattenedNodes: (expandedKey: Key[]) => Array<TreeNode<R, G, I>>
  getChildren: GetChildren<R, G, I>
  getPath: <T extends boolean>(
    key: Key | null | undefined,
    options?: GetPathOptions<T>
  ) => T extends true ? MergedPath<R, G> : MergedPath<R>
  getNonLeafKeys: (options?: GetNonLeafKeysOptions) => Key[]
  getNode: KeyToNode<R, G>
  getChild: KeyToNonGroupNode<R>
  getParent: KeyToNonGroupNode<R>
  getPrev: KeyToNonGroupNodeWithOption<R>
  getNext: KeyToNonGroupNodeWithOption<R>
  getFirstUsefulNode: () => TreeNode<R> | null

  getCheckedKeys: (
    checkedKeys: Key[] | InputMergedKeys | null | undefined,
    options?: CheckOptions
  ) => MergedKeys
  check: (
    keysToCheck: Key | Key[] | null | undefined,
    checkedKeys: Key[] | InputMergedKeys,
    options?: CheckOptions
  ) => MergedKeys
  uncheck: (
    keysToUncheck: Key | Key[] | null | undefined,
    checkedKeys: Key[] | InputMergedKeys,
    options?: CheckOptions
  ) => MergedKeys
}
