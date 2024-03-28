import { TableRender } from '../render';
import { DisposableGroup, Slot, isEqual } from '@blocksuite/global/utils';
import {
  getCellSumRange,
  getCellsFromId,
  getCellsIncludeRange,
  getCellsInsideRange,
  getCellsMatchRange,
} from '../utils/cell';

export class TableSelectionController {
  private readonly disposeGroup = new DisposableGroup();

  public slots = {
    cellClick: new Slot<string>(),
    selectionChange: new Slot<string[]>(),
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
      this.tableRender,
      'pointermove',
      this.onPointerMove.bind(this)
    );

    this.disposeGroup.addFromEvent(
      this.tableRender,
      'pointerup',
      this.onPointerUp.bind(this)
    );

    // this.updateCellRectMap();
  }

  private _isPointerDown = false;
  private _cellOnPointerDown: string | null = null;
  private onPointerDown(e: MouseEvent) {
    this.setSelection([]);

    const [targetCell, isInPadding] = this.getPointCell(e.clientX, e.clientY);

    if (!targetCell) return;

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

    this._isPointerDown = false;

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
