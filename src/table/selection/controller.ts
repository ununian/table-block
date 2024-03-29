import { DisposableGroup, Slot, isEqual } from '@blocksuite/global/utils';
import { TableRender } from '../render';
import {
  getCellSumRange,
  getCellsFromId,
  getCellsMatchRange,
} from '../utils/cell';

export class TableSelectionController {
  private readonly disposeGroup = new DisposableGroup();

  public slots = {
    cellClick: new Slot<string>(),
    selectionChange: new Slot<string[]>(),
    selectionDomRectChange: new Slot<DOMRect | null>(),
  };

  public constructor(public readonly tableRender: TableRender) {}

  get tableData() {
    return this.tableRender.data;
  }

  // private cellRectMap = new Map<string, DOMRect>();

  // public updateCellRectMap() {
  //   this.cellRectMap.clear();
  //   this.tableRender.querySelectorAll('td[data-cell-id]').forEach((cell) => {
  //     this.cellRectMap.set(
  //       cell.getAttribute('data-cell-id')!,
  //       cell.getBoundingClientRect()
  //     );
  //   });
  // }

  public initialize() {
    this.disposeGroup.addFromEvent(
      this.tableRender,
      'pointerdown',
      this.onPointerDown.bind(this)
    );

    this.disposeGroup.addFromEvent(
      document,
      'pointermove',
      this.onPointerMove.bind(this)
    );

    this.disposeGroup.addFromEvent(
      document,
      'pointerup',
      this.onPointerUp.bind(this)
    );

    // this.updateCellRectMap();
  }

  private _isPointerDown = false;
  private _cellOnPointerDown: string | null = null;
  private _startPointer: [number, number] | null = null;
  private onPointerDown(e: MouseEvent) {
    this.setSelection([]);

    const [targetCell, isInPadding] = this.getPointCell(e.clientX, e.clientY);
    if (!targetCell) return;

    this._startPointer = [e.clientX, e.clientY];
    this.slots.selectionDomRectChange.emit(null);

    this._cellOnPointerDown = targetCell.getAttribute('data-cell-id')!;
    this._isPointerDown = true;

    if (isInPadding) {
      this.setSelection([this._cellOnPointerDown]);
    }
  }

  public setSelection(selections: string[]) {
    if (isEqual(this._lastSelection, selections)) return;

    this._lastSelection = selections;
    this.slots.selectionChange.emit(selections);
  }

  private _lastSelection = [] as string[];
  private onPointerMove(e: MouseEvent) {
    if (!this._isPointerDown) return;
    const tableRect = this.tableRender.getBoundingClientRect();

    if (this._startPointer) {
      const [startX, startY] = this._startPointer;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const selectionDomRect = new DOMRect(
        Math.min(startX, e.clientX) - tableRect.left,
        Math.min(startY, e.clientY) - tableRect.top,
        Math.abs(dx),
        Math.abs(dy)
      );

      this.slots.selectionDomRectChange.emit(selectionDomRect);
    }

    const [targetCell, isInPadding] = this.getPointCell(e.clientX, e.clientY);

    if (!targetCell) return;

    const cellId = targetCell.getAttribute('data-cell-id')!;
    if (cellId === this._cellOnPointerDown) {
      if (isInPadding) {
        this.setSelection([this._cellOnPointerDown]);
      } else {
        this.setSelection([]);
      }
      return;
    }

    const selectionCellsId = [this._cellOnPointerDown, cellId] as string[];

    const selectionCell = getCellsMatchRange(
      this.tableData,
      getCellSumRange(getCellsFromId(this.tableData, selectionCellsId))
    );

    const selectionCellId = selectionCell.map((cell) => cell.id);
    this.setSelection(selectionCellId);
  }

  private onPointerUp(e: MouseEvent) {
    if (!this._isPointerDown) return;

    this._startPointer = null;
    this._isPointerDown = false;
    this.slots.selectionDomRectChange.emit(null);

    const [targetCell] = this.getPointCell(e.clientX, e.clientY);
    if (!targetCell) return;

    if (this._cellOnPointerDown) {
      const cellId = targetCell.getAttribute('data-cell-id');
      if (cellId === this._cellOnPointerDown) {
        console.log('click');
      }
    }
  }

  private getPointCell(
    x: number,
    y: number
  ): [HTMLTableCellElement | null, boolean] {
    for (const cell of this.tableRender.shadowRoot!.querySelectorAll(
      'td[data-cell-id]'
    )) {
      const rect = cell.getBoundingClientRect();
      if (
        rect.left <= x &&
        x <= rect.right &&
        rect.top <= y &&
        y <= rect.bottom
      ) {
        const style = getComputedStyle(cell);
        const paddings = [
          style.paddingTop,
          style.paddingRight,
          style.paddingBottom,
          style.paddingLeft,
        ].map((padding) => parseFloat(padding));

        const isInPadding = (
          x: number,
          y: number,
          padding: number[],
          rect: DOMRect
        ) => {
          const rx = x - rect.left;
          const ry = y - rect.top;

          const [top, right, bottom, left] = padding;

          if (rx < left || rx > rect.width - right) return true;
          if (ry < top || ry > rect.height - bottom) return true;
          return false;
        };

        return [
          cell as HTMLTableCellElement,
          isInPadding(x, y, paddings, rect),
        ];
      }
    }
    return [null, false];
  }

  public dispose() {
    this.disposeGroup.dispose();
  }
}
