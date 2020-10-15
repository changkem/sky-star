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

export class LineTools {
  private verticalLines: Line[];
  private horizontalLines: Line[];
  constructor() {
    this.verticalLines = [];
    this.horizontalLines = [];
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
    const ht = { ...line, id: line.instanceId + 'ht' },
      hm = { ...line, y: line.y + line.height / 2, id: line.instanceId + 'hm' },
      hb = { ...line, y: line.y + line.height, id: line.instanceId + 'hb' },
      vl = { ...line, id: line.instanceId + 'vl' },
      vm = { ...line, x: line.x + line.width / 2, id: line.instanceId + 'vm' },
      vr = { ...line, y: line.x + line.width, id: line.instanceId + 'vr' };

    this.update(this.horizontalLines, ht);
    this.update(this.horizontalLines, hm);
    this.update(this.horizontalLines, hb);
    this.update(this.verticalLines, vl);
    this.update(this.verticalLines, vm);
    this.update(this.verticalLines, vr);
  }

  getNearlyLine(): [Line, Line] {
    return [this.verticalLines[0], this.horizontalLines[0]];
  }
}
