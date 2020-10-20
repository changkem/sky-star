import { createRBTree, RedBlackTree } from 'functional-red-black-tree2/rbtree';

type Line = {
  /**标识线段 */
  id: string;
  /**标识所属 DragResizer 实例 */
  instanceId: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type PartialOne<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 缓存所有组件边界线
 * 空间换时间，以便更好找到可以对齐的线
 */
const cacheLines: Record<string, Line> = {};

export class LineTools {
  private verticalTree: RedBlackTree<Line>;
  private horizontalTree: RedBlackTree<Line>;
  constructor() {
    this.verticalTree = createRBTree();
    this.horizontalTree = createRBTree();
  }

  update = (lines: Line[], line: Line): void => {
    const index = lines.findIndex(({ id }) => id === line.id);
    if (index !== -1) {
      lines[index] = line;
    } else {
      lines.push(line);
    }
  };

  insertLine(line: PartialOne<Line, 'id'>): void {
    // FIXME: 暂时不清楚为啥上边界及左边界的线少1px
    const ht = { ...line, y: line.y + 1, id: line.instanceId + 'ht' },
      hm = { ...line, y: line.y + line.height / 2, id: line.instanceId + 'hm' },
      hb = { ...line, y: line.y + line.height, id: line.instanceId + 'hb' },
      vl = { ...line, x: line.x + 1, id: line.instanceId + 'vl' },
      vm = { ...line, x: line.x + line.width / 2, id: line.instanceId + 'vm' },
      vr = { ...line, x: line.x + line.width, id: line.instanceId + 'vr' };

    if (cacheLines[vl.id]) {
      this.verticalTree = this.verticalTree
        .remove(cacheLines[vl.id]?.x)
        .remove(cacheLines[vm.id]?.x)
        .remove(cacheLines[vr.id]?.x);
      this.horizontalTree = this.horizontalTree
        .remove(cacheLines[ht.id]?.y)
        .remove(cacheLines[hm.id]?.y)
        .remove(cacheLines[hb.id]?.y);
    }

    cacheLines[vl.id] = vl;
    cacheLines[vm.id] = vm;
    cacheLines[vr.id] = vr;
    cacheLines[ht.id] = ht;
    cacheLines[hm.id] = hm;
    cacheLines[hb.id] = hb;

    this.verticalTree = this.verticalTree.insert(vl.x, vl).insert(vm.x, vm).insert(vr.x, vr);
    this.horizontalTree = this.horizontalTree.insert(ht.y, ht).insert(hm.y, hm).insert(hb.y, hb);
  }

  getNearlyLine(id: string): [Line, Line] {
    return [
      this.verticalTree.lt(cacheLines[id + 'vl'].x).node.value,
      this.horizontalTree.lt(cacheLines[id + 'ht'].y).node.value,
    ];
  }
}
