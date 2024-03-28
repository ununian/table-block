import { TableCell, TableData } from '../type';
import {
  getCellsIncludeRange,
  getCellsInsideRange,
  getCellsMatchRange,
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
