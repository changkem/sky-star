// interface Node<T> {
//   data: T | null;
//   left: Node<T> | null;
//   right: Node<T> | null;
// }

type WithId = { id: string; instanceId: string };

/**
 * 缓存所有组件边界线
 * 空间换时间，以便更好找到可以对齐的线
 */
const cacheLines: Record<string, unknown> = {};

class Node<T extends WithId> {
  public data: T | null = null;
  public left: Node<T> | null = null;
  public right: Node<T> | null = null;
  constructor(data: T) {
    this.data = data;
  }
}

export class BSTree<T extends WithId> {
  private root: Node<T> | null;
  private size: number;
  constructor() {
    this.root = null;
    this.size = 0;
  }

  insert(el: T): void {
    cacheLines[el.id] = el;
    // align.forEach((key) => {
    //   const val = cacheLines[el.intanceId + key].;
    //   this.remove();
    // });
    if (this.root === null) {
      this.root = new Node(el);
      this.size++;
    }
  }

  findById(): T | null {
    return null;
  }

  remove(): void {
    this.root;
  }

  lowerBound(): T | null {
    this.root;
    return null;
  }

  upperBound(): T | null {
    this.root;
    return null;
  }
}
