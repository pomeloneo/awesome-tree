import { GetChildren, Key, RawNode } from './interface'

export function defaultGetChildren<R, G, S>(node: R | G | S): Array<R | G | S> | unknown {
  return (node as any).children
}

export function defaultIsDisabled(rawNode: RawNode): boolean {
  return rawNode.disabled === true
}

export function defaultGetKey(rawNode: RawNode): Key {
  return rawNode.key
}

export function defaultIsGroup(rawNode: RawNode): boolean {
  return rawNode.type === 'group'
}

export function defaultIsSpectre(rawNode: RawNode): boolean {
  return rawNode.type === 'spectre'
}

export function defaultIsLeaf<R = RawNode, G = R, S = R>(
  rawNode: R | G | S,
  getChildren: GetChildren<R, G, S> = defaultGetChildren
): boolean {
  const { isLeaf } = rawNode as any
  if (isLeaf !== undefined) {
    return isLeaf
  }
  return !getChildren(rawNode)
}
