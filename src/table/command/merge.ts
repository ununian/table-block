import {
  CellPosition,
  IDGeneratorFunc,
  TableCell,
  TableData,
  TableChangedResult,
} from '../type';
import { getCellSumRange, getCellsMatchRange } from '../utils/cell';
import { mergeResult, toResult } from '../utils/result';

export const margeCell = (
  tableData: TableData,
  targetCell: TableCell[]
): TableChangedResult => {
  const range = getCellSumRange(targetCell);
  const toRemoveCells = getCellsMatchRange(tableData, range);

  const leftTopCell = targetCell.reduce((acc, cell) => {
    if (cell.pos[0] < acc.pos[0] || cell.pos[1] < acc.pos[1]) {
      return cell;
    }
    return acc;
  }, targetCell[0]);

  const result = tableData.cells.filter((cell) => {
    return !toRemoveCells.includes(cell);
  });

  result.push({
    id: leftTopCell.id,
    pos: range,
  });

  return toResult(
    {
      ...tableData,
      cells: result,
    },
    {
      remove: toRemoveCells.filter((cell) => cell.id !== leftTopCell.id),
      change: [leftTopCell],
    }
  );
};

export const margeCellInRange = (
  tableData: TableData,
  range: CellPosition
): TableChangedResult => {
  return margeCell(tableData, getCellsMatchRange(tableData, range));
};

export const splitCell = (
  tableData: TableData,
  targetCell: TableCell,
  iDGeneratorFunc: IDGeneratorFunc
): TableChangedResult => {
  const result = tableData.cells.filter((cell) => cell !== targetCell);

  const [startRow, startCol, endRow, endCol] = targetCell.pos;
  const addCellIds: string[] = [];

  for (let i = startRow; i < endRow; i++) {
    for (let j = startCol; j < endCol; j++) {
      if (i === startRow && j === startCol) {
        result.push({
          id: targetCell.id,
          pos: [i, j, i + 1, j + 1],
        });
        continue;
      }
      const id = iDGeneratorFunc();
      addCellIds.push(id);
      result.push({
        id,
        pos: [i, j, i + 1, j + 1],
      });
    }
  }

  return toResult(
    {
      ...tableData,
      cells: result,
    },
    {
      add: result.filter(
        (cell) => addCellIds.includes(cell.id) && cell.id !== targetCell.id
      ),
      change: [result.find((cell) => cell.id === targetCell.id)!],
    }
  );
};

export const splitCells = (
  tableData: TableData,
  targetCells: TableCell[],
  iDGeneratorFunc: IDGeneratorFunc
): TableChangedResult => {
  return targetCells.reduce((acc, cell) => {
    let result = splitCell(tableData, cell, iDGeneratorFunc);
    return mergeResult(acc, result);
  }, toResult(tableData));
};
