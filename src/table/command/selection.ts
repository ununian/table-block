import { CellPosition, TableCell, TableData } from '../type';
import {
  getCellsIncludeRange,
  getCellsInsideRange,
  getCellsMatchRange,
  isCellsEqual,
} from '../utils/cell';

export const getColumnCells = (
  tableData: TableData,
  columnIndex: number,
  mode: 'include' | 'inside' | 'match' = 'inside'
): TableCell[] => {
  if (mode === 'include') {
    return getCellsIncludeRange(tableData, [
      columnIndex,
      0,
      columnIndex + 1,
      tableData.rows.length,
    ]);
  }

  if (mode === 'match') {
    return getCellsMatchRange(tableData, [
      columnIndex,
      0,
      columnIndex + 1,
      tableData.rows.length + 1,
    ]);
  }
  return getCellsInsideRange(tableData, [
    columnIndex,
    0,
    columnIndex + 1,
    tableData.rows.length + 1,
  ]);
};

export const getRowCells = (
  tableData: TableData,
  rowIndex: number,
  mode: 'include' | 'inside' | 'match' = 'inside'
): TableCell[] => {
  if (mode === 'include') {
    return getCellsIncludeRange(tableData, [
      0,
      rowIndex,
      tableData.columns.length,
      rowIndex + 1,
    ]);
  }

  if (mode === 'match') {
    return getCellsMatchRange(tableData, [
      0,
      rowIndex,
      tableData.columns.length + 1,
      rowIndex + 1,
    ]);
  }

  return getCellsInsideRange(tableData, [
    0,
    rowIndex,
    tableData.columns.length + 1,
    rowIndex + 1,
  ]);
};

export const isSelectionWholeTable = (
  tableData: TableData,
  range: CellPosition
) => {
  const [x1, y1, x2, y2] = range;
  return (
    x1 === 0 &&
    y1 === 0 &&
    x2 === tableData.columns.length &&
    y2 === tableData.rows.length
  );
};

export const getIndexIfCellSameColumn = (
  tableData: TableData,
  cells: TableCell[],
  mode: 'include' | 'inside' | 'match' = 'inside'
) => {
  const columnIndex = cells[0].pos[0];
  const columnCells = getColumnCells(tableData, columnIndex, mode);
  return isCellsEqual(columnCells, cells) ? columnIndex : -1;
};

export const getIndexIfCellSameRow = (
  tableData: TableData,
  cells: TableCell[],
  mode: 'include' | 'inside' | 'match' = 'inside'
) => {
  const rowIndex = cells[0].pos[1];
  const rowCells = getRowCells(tableData, rowIndex, mode);
  return isCellsEqual(rowCells, cells) ? rowIndex : -1;
};
