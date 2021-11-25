import { Key, RawNode } from './interface'

export function defaultGetChildren<R = RawNode>(node: R): Array<R> | unknown {
  return (node as any).children
}

export function defaultIsDisabled(rawNode: RawNode): boolean {
  return rawNode.disabled === true
}

export function defaultGetKey(rawNode: RawNode): Key {
  return rawNode.key
}
