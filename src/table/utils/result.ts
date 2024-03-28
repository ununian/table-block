import { TableCell, TableChangedResult, TableData } from '../type';

export const toResult = (
  tableData: TableData,
  cells?: {
    remove?: TableCell[];
    add?: TableCell[];
    change?: TableCell[];
  }
): TableChangedResult => {
  return {
    tableData,
    addedCells: cells?.add || [],
    removedCells: cells?.remove || [],
    changedCells: cells?.change || [],
  };
};

export const mergeResult = (
  result1: TableChangedResult,
  result2: TableChangedResult
) => {
  return toResult(result2.tableData, {
    add: [...result1.addedCells, ...result2.addedCells],
    change: [...result1.changedCells, ...result2.changedCells],
    remove: [...result1.removedCells, ...result2.removedCells],
  });
};
