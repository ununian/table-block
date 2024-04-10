import { CellPosition, TableCell, TableData } from '../type';
import {
  getCellSumRange,
  getCellsIncludeRange,
  getCellsInsideRange,
  getCellsMatchRange,
  isCellsEqual,
} from '../utils/cell';
import { toResult } from '../utils/result';

// 这里 columnRange 没有考虑自身内部有合并单元格的情况，需要外部用 Match 获取实际需要操作的列
export const getColumnAllowDragTarget = (
  tableData: TableData,
  columnRange: [number, number]
): number[] => {
  const hasMergeCellColumn = new Set<number>();

  tableData.cells.forEach((cell) => {
    if (Math.abs(cell.pos[0] - cell.pos[2]) > 1) {
      for (let i = cell.pos[0] + 1; i < cell.pos[2]; i++) {
        hasMergeCellColumn.add(i);
      }
    }
  });

  const [start, end] = columnRange;

  return Array.from(
    { length: tableData.columns.length + 1 },
    (_, i) => i
  ).filter(
    (index) => (index < start || index > end) && !hasMergeCellColumn.has(index)
  );
};

// 这里 columnRange 没有考虑自身内部有合并单元格的情况，需要外部用 Match 获取实际需要操作的列
export const dragColumnRangeTo = (
  tableData: TableData,
  columnRange: [number, number],
  target: number
) => {
  const [start, end] = columnRange;
  const changeLength = end - start;
  const targetIndex = target;
  const direction = targetIndex > start ? 'right' : 'left';

  const changedCellIds: string[] = [];
  const cells = tableData.cells.map((cell) => {
    const [x1, y1, x2, y2] = cell.pos;
    // 移动在 range 内部的列到目标列
    if (x1 >= start && x2 <= end) {
      changedCellIds.push(cell.id);
      const pos = [targetIndex + x1 - start, y1, targetIndex + x2 - start, y2];

      // 往右移动，需要移动后再往左移，因为要补齐空缺
      // 往左移动不需要处理，后面会将 targetIndex 到 start 之间的列右移
      if (direction === 'right') {
        pos[0] -= changeLength;
        pos[2] -= changeLength;
      }

      return {
        ...cell,
        pos,
      } as TableCell;
    }
    // 下面处理在 range 外部的列
    else {
      // 如果是从左往右移动
      // 在 end ~ target 中的 cell，需要往左移动补齐空缺
      // target + changeLength 之后的不应该移动
      if (direction === 'right') {
        if (x1 >= end && x2 <= targetIndex) {
          changedCellIds.push(cell.id);
          return {
            ...cell,
            pos: [x1 - changeLength, y1, x2 - changeLength, y2],
          } as TableCell;
        }
      }
      // 如果是从右往左移动
      // 在 target ~ start 中的 cell，需要往右移动补齐空缺
      else if (direction === 'left') {
        if (x1 >= targetIndex && x2 <= start) {
          changedCellIds.push(cell.id);
          return {
            ...cell,
            pos: [x1 + changeLength, y1, x2 + changeLength, y2],
          } as TableCell;
        }
      }
    }
    return cell;
  });

  console.log('dragColumnRangeTo', cells);
  return toResult(
    {
      ...tableData,
      cells: cells,
    },
    {
      change: cells.filter((cell) => changedCellIds.includes(cell.id)),
    }
  );
};

// 这里 rowRange 没有考虑自身内部有合并单元格的情况，需要外部用 Match 获取实际需要操作的行
export const getRowAllowDragTarget = (
  tableData: TableData,
  rowRange: [number, number]
): number[] => {
  const hasMergeCellRow = new Set<number>();

  tableData.cells.forEach((cell) => {
    if (Math.abs(cell.pos[1] - cell.pos[3]) > 1) {
      for (let i = cell.pos[1] + 1; i < cell.pos[3]; i++) {
        hasMergeCellRow.add(i);
      }
    }
  });

  const [start, end] = rowRange;

  return Array.from({ length: tableData.rows.length + 1 }, (_, i) => i).filter(
    (index) => (index < start || index > end) && !hasMergeCellRow.has(index)
  );
};

// 这里 rowRange 没有考虑自身内部有合并单元格的情况，需要外部用 Match 获取实际需要操作的行
export const dragRowRangeTo = (
  tableData: TableData,
  rowRange: [number, number],
  target: number
) => {
  const [start, end] = rowRange;
  const changeLength = end - start;
  const targetIndex = target;
  const direction = targetIndex > start ? 'down' : 'up';

  const changedCellIds: string[] = [];
  const cells = tableData.cells.map((cell) => {
    const [x1, y1, x2, y2] = cell.pos;
    // 移动在 range 内部的行到目标行
    if (y1 >= start && y2 <= end) {
      changedCellIds.push(cell.id);
      const pos = [x1, targetIndex + y1 - start, x2, targetIndex + y2 - start];

      // 往下移动，需要移动后再往上移，因为要补齐空缺
      // 往上移动不需要处理，后面会将 targetIndex 到 start 之间的行下移
      if (direction === 'down') {
        pos[1] -= changeLength;
        pos[3] -= changeLength;
      }

      return {
        ...cell,
        pos,
      } as TableCell;
    }
    // 下面处理在 range 外部的行
    else {
      // 如果是从上往下移动
      // 在 end ~ target 中的 cell，需要往上移动补齐空缺
      // target + changeLength 之后的不应该移动
      if (direction === 'down') {
        if (y1 >= end && y2 <= targetIndex) {
          changedCellIds.push(cell.id);
          return {
            ...cell,
            pos: [x1, y1 - changeLength, x2, y2 - changeLength],
          } as TableCell;
        }
      }
      // 如果是从下往上移动
      // 在 target ~ start 中的 cell，需要往下移动补齐空缺
      else if (direction === 'up') {
        if (y1 >= targetIndex && y2 <= start) {
          changedCellIds.push(cell.id);
          return {
            ...cell,
            pos: [x1, y1 + changeLength, x2, y2 + changeLength],
          } as TableCell;
        }
      }
    }
    return cell;
  });

  console.log('dragRowRangeTo', cells);
  return toResult(
    {
      ...tableData,
      cells: cells,
    },
    {
      change: cells.filter((cell) => changedCellIds.includes(cell.id)),
    }
  );
};
