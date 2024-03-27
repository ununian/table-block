import { TableData } from '../type';

import { nanoid } from 'nanoid';

export const createTable = (
  rows: number,
  columns: number,
  cellIdGenerator: (row: number, columns: number) => string = () => nanoid()
): TableData => {
  const table: TableData = {
    rows: [],
    columns: [],
    cells: [],
  };
  for (let i = 0; i < rows; i++) {
    table.rows.push({ attrs: {} });
  }
  for (let i = 0; i < columns; i++) {
    table.columns.push({ attrs: {} });
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      table.cells.push({
        id: cellIdGenerator(i, j),
        pos: [j, i, j + 1, i + 1],
      });
    }
  }

  return table;
};

export const isValidCellPosition = (pos: number[]): boolean => {
  return (
    pos.length === 4 &&
    pos.every((p) => Number.isInteger(p)) &&
    pos[0] < pos[2] &&
    pos[1] < pos[3]
  );
};

export const isValidTableData = (table: TableData): boolean => {
  const baseValid =
    table.rows.length > 0 &&
    table.columns.length > 0 &&
    table.cells.every((cell) => isValidCellPosition(cell.pos));

  // 判断 cell 中是否有交叉的情况， cell 是先行后列的形式，要考虑性能
  const blackTable = Array.from({ length: table.rows.length }).map(
    () => Array.from({ length: table.columns.length }).fill(0) as number[]
  );
  table.cells.forEach((cell) => {
    const [x1, y1, x2, y2] = cell.pos;
    for (let i = y1; i < y2; i++) {
      for (let j = x1; j < x2; j++) {
        blackTable[i][j] += 1;
      }
    }
  });

  // console.log(blackTable);

  const cellValid = blackTable.every((row) => row.every((cell) => cell <= 1));

  return baseValid && cellValid;
};

export const isCellPositionEqual = (
  pos1: number[],
  pos2: number[]
): boolean => {
  return pos1.every((p, i) => p === pos2[i]);
};

export const isCellPositionIntersect = (
  pos1: number[],
  pos2: number[]
): boolean => {
  return (
    pos1[0] < pos2[2] &&
    pos1[2] > pos2[0] &&
    pos1[1] < pos2[3] &&
    pos1[3] > pos2[1]
  );
};

export const isTableDataEqual = (
  table1?: TableData,
  table2?: TableData
): boolean => {
  if (!table1 || !table2) {
    return false;
  }

  if (table1.rows.length !== table2.rows.length) {
    return false;
  }
  if (table1.columns.length !== table2.columns.length) {
    return false;
  }
  if (table1.cells.length !== table2.cells.length) {
    return false;
  }

  return table1.cells.every((cell, i) => {
    return (
      isCellPositionEqual(cell.pos, table2.cells[i].pos) &&
      cell.attrs === table2.cells[i].attrs
    );
  });
};
