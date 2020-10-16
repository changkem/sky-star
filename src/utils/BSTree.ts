// interface Node<T> {
//   data: T | null;
//   left: Node<T> | null;
//   right: Node<T> | null;
// }

type WithId = { id: string };

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
    if (this.root === null) {
      this.root = new Node(el);
      this.size++;
    }
  }

  find(): T | null {
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
