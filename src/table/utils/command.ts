import { CellPosition, IDGeneratorFunc, TableCell, TableData } from '../type';
import { getCellSumRange, getCellsMatchRange } from './cell';

export const margeCell = (
  tableData: TableData,
  targetCell: TableCell[]
): TableData => {
  const range = getCellSumRange(targetCell);
  const toRemoveCell = getCellsMatchRange(tableData, range);

  const leftTopCell = targetCell.reduce((acc, cell) => {
    if (cell.pos[0] < acc.pos[0] || cell.pos[1] < acc.pos[1]) {
      return cell;
    }
    return acc;
  }, targetCell[0]);

  const result = tableData.cells.filter((cell) => {
    return !toRemoveCell.includes(cell);
  });

  result.push({
    id: leftTopCell.id,
    pos: range,
  });

  return {
    ...tableData,
    cells: result,
  };
};

export const margeCellInRange = (
  tableData: TableData,
  range: CellPosition
): TableData => {
  return margeCell(tableData, getCellsMatchRange(tableData, range));
};

export const splitCell = (
  tableData: TableData,
  targetCell: TableCell,
  iDGeneratorFunc: IDGeneratorFunc
): TableData => {
  const result = tableData.cells.filter((cell) => cell !== targetCell);

  const [startRow, startCol, endRow, endCol] = targetCell.pos;

  for (let i = startRow; i < endRow; i++) {
    for (let j = startCol; j < endCol; j++) {
      if (i === startRow && j === startCol) {
        result.push({
          id: targetCell.id,
          pos: [i, j, i + 1, j + 1],
        });
        continue;
      }
      result.push({
        id: iDGeneratorFunc(),
        pos: [i, j, i + 1, j + 1],
      });
    }
  }

  return {
    ...tableData,
    cells: result,
  };
};

export const splitCells = (
  tableData: TableData,
  targetCells: TableCell[],
  iDGeneratorFunc: IDGeneratorFunc
): TableData => {
  let result = tableData.cells;

  targetCells.forEach((cell) => {
    result = splitCell(tableData, cell, iDGeneratorFunc).cells;
  });

  return {
    ...tableData,
    cells: result,
  };
};
