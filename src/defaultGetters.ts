import { Key } from './interface'

export function defaultGetKey(node: unknown): Key {
  return (node as any).key
}

export function defaultGetChildren<R, G, I>(
  node: R | G | I
): Array<R | G | I> | unknown {
  return (node as any).children
}
