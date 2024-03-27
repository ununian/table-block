import { CellPosition, IDGeneratorFunc, TableCell, TableData } from '../type';
import { getCellSumRange } from './cell';

export const margeCell = (
  tableData: TableData,
  targetCell: TableCell[],
  iDGeneratorFunc: IDGeneratorFunc
): TableData => {
  const range = getCellSumRange(targetCell);

  const result = tableData.cells.filter((cell) => {
    return !targetCell.includes(cell);
  });

  result.push({
    id: iDGeneratorFunc(),
    pos: range,
  });

  return {
    ...tableData,
    cells: result,
  };
};
