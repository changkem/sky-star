export interface SerializedState {
  position: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  config: {};
}

export default class Travelling {
  private undoQueue: SerializedState[];
  private redoQueue: SerializedState[];
  constructor() {
    this.undoQueue = [];
    this.redoQueue = [];
  }

  pushState(state: SerializedState): void {
    this.undoQueue.push(state);
  }

  undo(): void {
    if (this.redoQueue.length > 0) {
      this.redoQueue.push(this.undoQueue.pop() as SerializedState);
    }
  }
  redo(): SerializedState | void {
    return this.redoQueue.pop();
  }
}
