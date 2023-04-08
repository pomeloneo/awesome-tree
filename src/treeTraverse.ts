import type { GetPrevNextOptions, TreeNode } from './interface';

function getChild(
  node: TreeNode,
  options: {
    reverse?: boolean;
  } = {}
): TreeNode | null {
  const { reverse = false } = options;
  const { children } = node;
  if (children) {
    const length = children.length;
    const start = reverse ? length - 1 : 0;
    const end = reverse ? -1 : 0;
    const delta = reverse ? -1 : 1;
    for (let i = start; i !== end; i += delta) {
      const child = children[i];
      if (!child.disabled && !child.ignored) {
        if (child.isGroup) {
          const childInGroup = getChild(child, options);
          if (childInGroup !== null) {
            return childInGroup;
          }
        } else {
          return child;
        }
      }
    }
  }

  return null;
}

export function getFirstUsefulNode<R, G, I>(nodes: Array<TreeNode<R, G, I>>): TreeNode<R> | null {
  if (nodes.length === 0) {
    return null;
  }

  const node = nodes[0];
  if (node.isGroup || node.ignored || node.disabled) {
    return node.getNext();
  }
  return node as unknown as TreeNode<R>;
}

function rawGetPrev(node: TreeNode, loop: boolean): TreeNode | null {
  const { siblings } = node;
  const len = siblings.length;
  const { index } = node;
  if (loop) {
    return siblings[(index - 1 + len) % len];
  } else {
    if (index === 0) return null;
    return siblings[index - 1];
  }
}

function rawGetNext(node: TreeNode, loop: boolean): TreeNode | null {
  const { siblings } = node;
  const len = siblings.length;
  const { index } = node;
  if (loop) {
    return siblings[(index + 1 + len) % len];
  } else {
    if (index === len - 1) {
      return null;
    }
    return siblings[index + 1];
  }
}

function rawGetParent(node: TreeNode): TreeNode | null {
  return node.parent;
}

function walk(fromNode: TreeNode, dir: 'prev' | 'next', options: GetPrevNextOptions = {}): TreeNode | null {
  const { includeDisabled = false, loop = false } = options;
  const iterate = dir === 'prev' ? rawGetPrev : rawGetNext;
  const getChildOptions = {
    reverse: dir === 'prev',
  };
  let meet = false;
  let endNode: TreeNode | null = null;
  function t(node: TreeNode | null): void {
    if (node === null) return;

    if (node === fromNode) {
      if (!meet) {
        meet = true;
      } else if (!fromNode.disabled && !fromNode.isGroup) {
        endNode = fromNode;
        return;
      }
    } else {
      if (!node.disabled || (includeDisabled && !node.isGroup && !node.ignored)) {
        endNode = node;
        return;
      }
    }

    if (node.isGroup) {
      const child = getChild(node, getChildOptions);
      if (child !== null) {
        endNode = child;
      } else {
        t(iterate(node, loop));
      }
    } else {
      const nextNode = iterate(node, false);
      if (nextNode !== null) {
        t(nextNode);
      } else {
        const parent = rawGetParent(node);
        if (parent?.isGroup) {
          t(iterate(parent, loop));
        } else if (loop) {
          t(iterate(node, true));
        }
      }
    }
  }

  t(fromNode);
  return endNode;
}

export const traverseMethods: Pick<TreeNode, 'getChild' | 'getParent' | 'getNext' | 'getPrev'> = {
  getChild(this: TreeNode) {
    if (this.ignored) return null;
    return getChild(this);
  },
  getParent(this: TreeNode) {
    const { parent } = this;
    if (parent?.isGroup) {
      return parent.getParent();
    }
    return parent;
  },
  getNext(this: TreeNode, options: GetPrevNextOptions = {}) {
    return walk(this, 'next', options);
  },
  getPrev(this: TreeNode, options: GetPrevNextOptions = {}) {
    return walk(this, 'prev', options);
  },
};
