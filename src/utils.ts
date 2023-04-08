import { GetChildren, RawNode } from './interface'

export function isDisabled(rawNode: RawNode): boolean {
  return !!rawNode?.disabled
}

export function isIgnored(): boolean {
  return false
}

export function isGroup(rawNode: RawNode): boolean {
  return rawNode?.type === 'group'
}

export function isLeaf<R = RawNode, G = R, I = R>(
  rawNode: R | G | I,
  getChildren: GetChildren<R, G, I>
): boolean {
  const { isLeaf: _isLeaf } = rawNode as any
  if (_isLeaf !== undefined) {
    return _isLeaf
  } else if (!getChildren(rawNode)) {
    return true
  }

  return false
}
// shallowLoaded: 节点是叶子节点  或者  节点存在children
export function isShallowLoaded<R = RawNode, G = R, I = R>(
  rawNode: R,
  getChildren: GetChildren<R, G, I>
): boolean {
  if ((rawNode as any).isLeaf || Array.isArray(getChildren(rawNode))) {
    return true
  }

  return false
}
