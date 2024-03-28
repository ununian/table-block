import { TableChangedResult, TableData } from '../type';
import { toResult } from '../utils/result';

export const resizeColumn = (
  tableData: TableData,
  columnIndex: number,
  width: number
): TableChangedResult => {
  const result = { ...tableData };

  result.columns[columnIndex].attrs = {
    ...result.columns[columnIndex].attrs,
    width,
  };
  return toResult(result);
};

export const resizeRow = (
  tableData: TableData,
  rowIndex: number,
  height: number
): TableChangedResult => {
  const result = { ...tableData };

  result.rows[rowIndex].attrs = {
    ...result.rows[rowIndex].attrs,
    height,
  };
  return toResult(result);
};
