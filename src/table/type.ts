export type CellPosition = [x1: number, y1: number, x2: number, y2: number];

export interface TableCell<TCellAttrs = any> {
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

// #region DOM
export interface TableCellDomAst {
  attrs?: Record<string, string>;
  colSpan?: number;
  rowSpan?: number;
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
