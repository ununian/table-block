import { TableData } from '../type';

import { nanoid } from 'nanoid';

export const createTable = (
  rows: number,
  columns: number,
  totalWidth: number,
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
    table.columns.push({
      attrs: {
        width: Math.floor(totalWidth / columns),
      },
    });
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

// 获取用户可见的列，如果当前列不是一个 Cell 的边，则认为是不可见的
export const getVisibleColumnIndex = (
  table: TableData,
  index: number
): number => {
  let newIndex = index;
  for (let i = index; i < table.columns.length; i++) {
    newIndex = i;

    if (table.cells.some((cell) => cell.pos[0] === i)) {
      break;
    }
  }

  return newIndex;
};

// 获取用户可见的行，如果当前行不是一个 Cell 的边，则认为是不可见的
export const getVisibleRowIndex = (table: TableData, index: number): number => {
  let newIndex = index;

  for (let i = index; i < table.rows.length; i++) {
    newIndex = i;
    if (table.cells.some((cell) => cell.pos[1] === i)) {
      break;
    }
  }

  return newIndex;
};
