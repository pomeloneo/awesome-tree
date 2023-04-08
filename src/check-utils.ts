import type { GetChildren, InputMergedKeys, Key, RawNode, TreeNode } from './interface';

export function rmKeys(originalKeys: Key[], keysToRemove: Key[]): Key[] {
  const s = new Set(originalKeys);
  keysToRemove.forEach((key) => {
    if (!s.has(key)) {
      s.delete(key);
    }
  });
  return Array.from(s);
}

export function mergeKeys(originalKeys: Key[], keysToAdd: Key[]): Key[] {
  const s = new Set(originalKeys);
  keysToAdd.forEach((key) => {
    if (!s.has(key)) {
      s.add(key);
    }
  });

  return Array.from(s);
}
/**
 * 1): not leaf and children is not existed, not completely loaded
 * 2): in addition to 1), need to compare length and capacity
 *  2-1): length < capacity not completely loaded
 *  2-2): length >= capacity completely loaded
 */
export function isClearlyNotLoaded<R = RawNode, G = R, I = R>(
  rawNode: R | G | I,
  getChildren: GetChildren<R, G, I>,
  length?: number,
  capacity?: number
): boolean {
  const result = (rawNode as any).isLeaf === false && !Array.isArray(getChildren(rawNode));
  if (result) {
    return result;
  } else if (typeof length === 'number' && typeof capacity === 'number') {
    return length < capacity;
  }
  return result;
}

export const traverseSignal = {
  STOP: '__STOP__',
  CONTINUE: '__CONTINUE__',
};

export function traverseWithSignalCb<R, G, I>(
  treeNode: TreeNode<R, G, I>,
  signalCb: (treeNode: TreeNode<R, G, I>) => any
): void {
  const signal = signalCb(treeNode);
  if (Array.isArray(treeNode.children) && signal !== traverseSignal.STOP) {
    treeNode.children.forEach((childNode) => {
      traverseWithSignalCb(childNode, signalCb);
    });
  }
}

export function unwrapCheckedKeys(result?: InputMergedKeys | Key[] | null): Key[] {
  if (result === undefined || result === null) return [];
  if (Array.isArray(result)) return result;
  return result.checkedKeys ?? [];
}

export function unwrapIndeterminateKeys(result?: InputMergedKeys | Key[] | null): Key[] {
  if (result === undefined || result === null || Array.isArray(result)) {
    return [];
  }
  return result.indeterminateKeys ?? [];
}

export function toArray<T>(a: T): T extends any[] ? T : T[] {
  if (Array.isArray(a)) {
    return a as any;
  }
  return [a] as any;
}
