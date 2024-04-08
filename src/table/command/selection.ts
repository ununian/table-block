import { CellPosition, TableCell, TableData } from '../type';
import {
  getCellSumRange,
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

export const getColumnRangeCells = (
  tableData: TableData,
  columnRange: [number, number],
  mode: 'include' | 'inside' | 'match' = 'inside'
): TableCell[] => {
  if (mode === 'include') {
    return getCellsIncludeRange(tableData, [
      columnRange[0],
      0,
      columnRange[1],
      tableData.rows.length,
    ]);
  }

  if (mode === 'match') {
    return getCellsMatchRange(tableData, [
      columnRange[0],
      0,
      columnRange[1],
      tableData.rows.length + 1,
    ]);
  }
  return getCellsInsideRange(tableData, [
    columnRange[0],
    0,
    columnRange[1],
    tableData.rows.length + 1,
  ]);
};

export const getRowRangeCells = (
  tableData: TableData,
  rowRange: [number, number],
  mode: 'include' | 'inside' | 'match' = 'inside'
): TableCell[] => {
  if (mode === 'include') {
    return getCellsIncludeRange(tableData, [
      0,
      rowRange[0],
      tableData.columns.length + 1,
      rowRange[1],
    ]);
  }

  if (mode === 'match') {
    return getCellsMatchRange(tableData, [
      0,
      rowRange[0],
      tableData.columns.length + 1,
      rowRange[1],
    ]);
  }

  return getCellsInsideRange(tableData, [
    0,
    rowRange[0],
    tableData.columns.length + 1,
    rowRange[1],
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

export const getIndexRangeIfCellSameColumn = (
  tableData: TableData,
  cells: TableCell[],
  mode: 'include' | 'inside' | 'match' = 'inside'
) => {
  const range = getCellSumRange(cells);
  console.log('🚀 ~ range:', range);
  const columnCells = getColumnRangeCells(
    tableData,
    [range[0], range[2]],
    mode
  );
  console.log('🚀 ~ columnCells:', columnCells);
  return isCellsEqual(columnCells, cells) ? [range[0], range[2]] : [];
};

export const getIndexRangeIfCellSameRow = (
  tableData: TableData,
  cells: TableCell[],
  mode: 'include' | 'inside' | 'match' = 'inside'
) => {
  const range = getCellSumRange(cells);
  const rowCells = getRowRangeCells(tableData, [range[1], range[3]], mode);

  return isCellsEqual(rowCells, cells) ? [range[1], range[3]] : [];
};
