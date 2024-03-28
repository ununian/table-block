import {
  CellPosition,
  IDGeneratorFunc,
  TableCell,
  TableData,
  TableChangedResult,
} from '../type';
import {
  getCellIntersectColumn,
  getCellIntersectRow,
  getCellSumRange,
  getCellsMatchRange,
  isPosIntersect,
} from '../utils/cell';
import { printTable } from '../utils/print';
import { mergeResult, toResult } from '../utils/result';

export const addColumn = (
  tableData: TableData,
  columnIndex: number,
  iDGeneratorFunc: IDGeneratorFunc
): TableChangedResult => {
  const result = { ...tableData };

  const newColumn = { attrs: {} };
  result.columns = [
    ...result.columns.slice(0, columnIndex),
    newColumn,
    ...result.columns.slice(columnIndex),
  ];

  const changedCellIds: string[] = [];
  const cells = tableData.cells.map((cell) => {
    const [x1, y1, x2, y2] = cell.pos;
    if (x1 >= columnIndex) {
      changedCellIds.push(cell.id);
      return {
        ...cell,
        pos: [x1 + 1, y1, x2 + 1, y2],
      } satisfies TableCell;
    } else if (x2 > columnIndex) {
      changedCellIds.push(cell.id);
      return {
        ...cell,
        pos: [x1, y1, x2 + 1, y2],
      } satisfies TableCell;
    }
    return cell;
  });

  result.cells = cells;

  const columnCells = getCellIntersectColumn(cells, columnIndex).map(
    (c) => c.pos
  );
  const addCells = tableData.rows
    .map((_, rowIndex) => {
      const id = iDGeneratorFunc();
      const newPos: CellPosition = [
        columnIndex,
        rowIndex,
        columnIndex + 1,
        rowIndex + 1,
      ];
      if (columnCells.some((pos) => isPosIntersect(newPos, pos))) {
        return null;
      }

      return {
        id,
        pos: [columnIndex, rowIndex, columnIndex + 1, rowIndex + 1],
      } satisfies TableCell;
    })
    .filter(Boolean) as TableCell[];

  result.cells.push(...addCells);

  console.log(printTable(result));

  return toResult(result, {
    change: cells.filter((cell) => changedCellIds.includes(cell.id)),
    add: addCells,
  });
};

export const addRow = (
  tableData: TableData,
  rowIndex: number,
  iDGeneratorFunc: IDGeneratorFunc
): TableChangedResult => {
  const result = { ...tableData };

  const newRow = { attrs: {} };
  result.rows = [
    ...result.rows.slice(0, rowIndex),
    newRow,
    ...result.rows.slice(rowIndex),
  ];

  const changedCellIds: string[] = [];
  const cells = tableData.cells.map((cell) => {
    const [x1, y1, x2, y2] = cell.pos;
    if (y1 >= rowIndex) {
      changedCellIds.push(cell.id);
      return {
        ...cell,
        pos: [x1, y1 + 1, x2, y2 + 1],
      } satisfies TableCell;
    } else if (y2 > rowIndex) {
      changedCellIds.push(cell.id);
      return {
        ...cell,
        pos: [x1, y1, x2, y2 + 1],
      } satisfies TableCell;
    }
    return cell;
  });

  result.cells = cells;

  const rowCells = getCellIntersectRow(cells, rowIndex).map((c) => c.pos);
  const addCells = tableData.columns
    .map((_, columnIndex) => {
      const id = iDGeneratorFunc();
      const newPos: CellPosition = [
        columnIndex,
        rowIndex,
        columnIndex + 1,
        rowIndex + 1,
      ];
      if (rowCells.some((pos) => isPosIntersect(newPos, pos))) {
        return null;
      }

      return {
        id,
        pos: newPos,
      } satisfies TableCell;
    })
    .filter(Boolean) as TableCell[];

  result.cells.push(...addCells);

  console.log(printTable(result));

  return toResult(result, {
    change: cells.filter((cell) => changedCellIds.includes(cell.id)),
    add: addCells,
  });
};
