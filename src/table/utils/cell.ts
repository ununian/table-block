import { isEqual } from '@blocksuite/global/utils';
import { CellPosition, TableCell, TableData } from '../type';

export const getCellSumRange = (cells: TableCell[]): CellPosition => {
  return cells.reduce(
    (acc, cell) => {
      acc[0] = Math.min(acc[0], cell.pos[0]);
      acc[1] = Math.min(acc[1], cell.pos[1]);
      acc[2] = Math.max(acc[2], cell.pos[2]);
      acc[3] = Math.max(acc[3], cell.pos[3]);
      return acc;
    },
    [Infinity, Infinity, -Infinity, -Infinity] as CellPosition
  );
};

/**
 * 获取一个区域全包含的cell，**不包括** 一部分在区域外一部分在区域内的 cell
 * @example 对于下面的表格
 * ╔═══════════════════╗
 * ║ 1                 ║
 * ╟────┬────┬────┬────╢
 * ║ 2  │ 3  │ 4  │ 5  ║
 * ║    ├────┼────┴────╢
 * ║    │ 6  │ 7       ║
 * ╚════╧════╧═════════╝
 *  getCellsInsideRange(table, [0, 0, 3, 2]) => [3, 4]
 *  getCellsInsideRange(table, [0, 0, 2, 3]) => [2, 3, 6]
 */
export const getCellsInsideRange = (
  data: TableData | undefined,
  range: CellPosition
): TableCell[] => {
  return (
    data?.cells.filter((cell) => {
      return (
        cell.pos[0] >= range[0] &&
        cell.pos[1] >= range[1] &&
        cell.pos[2] <= range[2] &&
        cell.pos[3] <= range[3]
      );
    }) || []
  );
};

/**
 * 获取一个区域包含的cell，**包括** 一部分在区域外一部分在区域内的 cell
 * @example 对于下面的表格
 * ╔═══════════════════╗
 * ║ 1                 ║
 * ╟────┬────┬────┬────╢
 * ║ 2  │ 3  │ 4  │ 5  ║
 * ║    ├────┼────┴────╢
 * ║    │ 6  │ 7       ║
 * ╚════╧════╧═════════╝
 *  getCellsIncludeRange(table, [0, 0, 3, 2]) => [1, 2 , 3, 4]
 *  getCellsIncludeRange(table, [0, 0, 2, 3]) => [1, 2 , 3, 6]
 */
export const getCellsIncludeRange = (
  data: TableData | undefined,
  range: CellPosition
): TableCell[] => {
  return (
    data?.cells.filter((cell) => {
      const [startRow, startCol, endRow, endCol] = range;
      const cellStartRow = cell.pos[0];
      const cellStartCol = cell.pos[1];
      const cellEndRow = cell.pos[2];
      const cellEndCol = cell.pos[3];

      // 检查单元格是否与给定范围重叠
      const isOverlap =
        cellEndRow > startRow &&
        cellEndCol > startCol &&
        cellStartRow < endRow &&
        cellStartCol < endCol;

      return isOverlap;
    }) || []
  );
};

/**
 * 递归获取区域中的所有 Cell，如果 Cell 扩展了区域，则继续递归
 * 和飞书的表格一样，目标是保证选中的 cell 组成一个矩形区域
 * @example 对于下面的表格
 * ╔═══════════════════╗
 * ║ 1                 ║
 * ╟────┬────┬────┬────╢
 * ║ 2  │ 3  │ 4  │ 5  ║
 * ║    ├────┼────┴────╢
 * ║    │ 6  │ 7       ║
 * ╚════╧════╧═════════╝
 *  getCellsMatchRange(table, [1, 1, 3, 2]) => [3, 4]
 *  getCellsMatchRange(table, [0, 0, 1, 1]) => [1]
 *  getCellsMatchRange(table, [1, 0, 2, 2]) => [1, 2, 3, 4, 5, 6, 7]
 *  getCellsMatchRange(table, [0, 1, 2, 2]) => [2, 3, 6]
 *  getCellsMatchRange(table, [2, 1, 3, 3]) => [4, 5, 7]
 */
export const getCellsMatchRange = (
  data: TableData | undefined,
  range: CellPosition
): TableCell[] => {
  const cells = getCellsIncludeRange(data, range);
  const sumRange = getCellSumRange(cells);

  if (isEqual(sumRange, range)) {
    return cells;
  }

  return getCellsMatchRange(data, sumRange);
};

export const getCellsFromId = (
  data: TableData | undefined,
  ids: string[]
): TableCell[] => {
  return data?.cells.filter((cell) => ids.includes(cell.id)) || [];
};
