import { TableCell, TableChangedResult, TableData } from '../type';
import { getCellSumRange, getCellsMatchRange } from '../utils/cell';
import { toResult } from '../utils/result';

/**
 * 删除列，以飞书
 * @example 对于下面的表格
 * ╔═══════════════════╗
 * ║ 1                 ║
 * ╟────┬────┬────┬────╢
 * ║ 2  │ 3  │ 4  │ 5  ║
 * ║    ├────┼────┴────╢
 * ║    │ 6  │ 7       ║
 * ╚════╧════╧═════════╝
 *  removeColumn(table, 1) =>  删除 [1, 2]
 */
// export const removeColumn = (
//   tableData: TableData,
//   columnIndex: number,
//   mode: 'left' = 'left'
// ): TableChangedResult => {
//   const result = { ...tableData };

//   const columnRange: CellPosition = [
//     columnIndex,
//     0,
//     columnIndex + 1,
//     tableData.rows.length,
//   ];

//   const needRemovedCells = result.cells;

//   const needShrinkColSpanCells = getCellsIncludeRange(
//     tableData,
//     columnRange
//   ).filter((cell) => !needRemovedCells.includes(cell));

//   result.cells = tableData.cells.filter(
//     (cell) => !needRemovedCells.includes(cell)
//   );

//   needShrinkColSpanCells.forEach((cell) => {
//     const [x1, y1, x2, y2] = cell.pos;
//     if (x1 === columnIndex || x2 === columnIndex + 1) {
//       // cell 的左边界或右边界与目标列相邻
//       result.cells.push({
//         ...cell,
//         pos: [x1, y1, x2 - 1, y2],
//       });
//     } else {
//       // 在中间的情况
//       result.cells.push({
//         ...cell,
//         pos: [x1 - 1, y1, x2 - 1, y2],
//       });
//     }
//   });

//   return toResult(tableData);
// };

export const removeCells = (
  tableData: TableData,
  targetCell: TableCell[]
): TableChangedResult => {
  const range = getCellSumRange(targetCell);
  const toRemoveCells = getCellsMatchRange(tableData, range);
  const sumRange = getCellSumRange(toRemoveCells);

  const result = tableData.cells
    .filter((cell) => {
      return !toRemoveCells.includes(cell);
    })
    .map((cell) => {
      const [rx1, ry1, rx2, ry2] = sumRange;
      const dx = rx2 - rx1;
      const dy = ry2 - ry1;
      let [x1, y1, x2, y2] = cell.pos;

      if (x1 >= rx2) {
        x1 -= dx;
      }
      if (x2 > rx2) {
        x2 -= dx;
      }

      if (y1 >= ry2) {
        y1 -= dy;
      }

      if (y2 > ry2) {
        y2 -= dy;
      }

      cell.pos = [x1, y1, x2, y2];
      return cell;
    });

  return toResult(
    {
      ...tableData,
      cells: result,
    },
    {
      remove: toRemoveCells,
    }
  );
};

export const removeColumn = (
  tableData: TableData,
  columnIndex: number
): TableChangedResult => {
  const columnCells = getCellsMatchRange(tableData, [
    columnIndex,
    0,
    columnIndex + 1,
    tableData.rows.length,
  ]);

  const result = removeCells(tableData, columnCells);

  result.tableData.columns = tableData.columns.filter(
    (_, index) => index !== columnIndex
  );

  return result;
};

export const removeRow = (
  tableData: TableData,
  rowIndex: number
): TableChangedResult => {
  console.log('🚀 ~ result.tableData:', tableData);

  const rowCells = getCellsMatchRange(tableData, [
    0,
    rowIndex,
    tableData.columns.length,
    rowIndex + 1,
  ]);

  const result = removeCells(tableData, rowCells);

  result.tableData.rows = tableData.rows.filter(
    (_, index) => index !== rowIndex
  );

  return result;
};
