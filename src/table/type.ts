import { TemplateResult } from 'lit';

export type CellPosition = [x1: number, y1: number, x2: number, y2: number];

export type DefaultCellAttrs = {
  background: string;
};

export interface TableCell<
  TCellAttrs extends Record<string, string | number> = DefaultCellAttrs
> {
  id: string;
  pos: CellPosition;
  attrs?: Partial<TCellAttrs>;
}

export interface TableRow {
  attrs?: {
    isHeader?: boolean; // 也有横向表格的需求
    height?: number | string; // 只有调整过的才记录
  };
}

export interface TableColumn {
  attrs?: {
    isHeader?: boolean;
    width?: number | string; // 只有调整过的才记录
  };
}

export interface TableData {
  rows: TableRow[];
  columns: TableColumn[];
  cells: TableCell[];
}

// #region Selection
export type TableSelectionRange = CellPosition;
export interface TableSelection {
  range: TableSelectionRange;
}
// #endregion

// #region DOM
export type TableCellRenderFunction = (cell: TableCell) => TemplateResult<1>;

export interface TableCellDomAst {
  id: string;
  attrs?: Record<string, string>;
  colSpan?: number;
  rowSpan?: number;

  inHeader?: boolean;

  originalCell: TableCell;
}

export interface TableRowDomAst {
  height?: number | string;
  isHeader?: boolean;
  cells: TableCellDomAst[];
}

export interface TableColumnDomAst {
  width?: number | string;
}

export interface TableDomAst {
  attrs?: Record<string, string | undefined | number>;
  rows: TableRowDomAst[];
  columns: TableColumnDomAst[];
}
// #endregion

// #region Command
export type IDGeneratorFunc = () => string;

export interface TableChangedResult {
  tableData: TableData;

  removedCells: TableCell[];
  addedCells: TableCell[];
  changedCells: TableCell[];
}
// #endregion
