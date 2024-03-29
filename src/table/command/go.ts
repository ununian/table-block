import { TableCell, TableData } from '../type';
import { getCellSumRange, getCellsIncludeRange } from '../utils/cell';

export const goTo = (
  tableData: TableData,
  selectedCells: TableCell[],
  direction: 'previous' | 'next' | 'up' | 'down'
): string | null => {
  if (selectedCells.length === 0) return null;
  const range = getCellSumRange(selectedCells);
  const [x1, y1, x2, y2] = range;

  switch (direction) {
    case 'previous': {
      let targetX1 = Math.max(0, x1 - 1);
      let targetY1 = y1;

      if (x1 === 0) {
        if (y1 === 0) {
          targetX1 = 0;
          targetY1 = 0;
        } else {
          targetX1 = tableData.columns.length - 1;
          targetY1 = Math.max(0, y1 - 1);
        }
      }

      const cell = getCellsIncludeRange(tableData, [
        targetX1,
        targetY1,
        targetX1 + 1,
        targetY1 + 1,
      ]);

      if (cell.length !== 1) {
        console.error('goTo previous error', cell);
        return null;
      }

      return cell[0].id;
    }
    case 'next': {
      let targetX1 = x2;
      let targetY1 = y1;
      if (x2 === tableData.columns.length) {
        if (y2 === tableData.rows.length) {
          targetX1 = tableData.columns.length - 1;
          targetY1 = tableData.rows.length - 1;
        } else {
          targetX1 = 0;
          targetY1 = Math.min(tableData.rows.length - 1, y1 + 1);
        }
      }

      const cell = getCellsIncludeRange(tableData, [
        targetX1,
        targetY1,
        targetX1 + 1,
        targetY1 + 1,
      ]);

      if (cell.length !== 1) {
        console.error('goTo next error', cell);
        return null;
      }

      return cell[0].id;
    }
    case 'up': {
      let targetX1 = x1;
      let targetY1 = Math.max(0, y1 - 1);

      if (y1 === 0) {
        targetX1 = x1;
        targetY1 = 0;
      }

      const cell = getCellsIncludeRange(tableData, [
        targetX1,
        targetY1,
        targetX1 + 1,
        targetY1 + 1,
      ]);

      if (cell.length !== 1) {
        console.error('goTo up error', cell);
        return null;
      }

      return cell[0].id;
    }
    case 'down': {
      let targetX1 = x1;
      let targetY1 = y2;

      if (y2 === tableData.rows.length) {
        targetX1 = x1;
        targetY1 = y2 - 1;
      }

      const cell = getCellsIncludeRange(tableData, [
        targetX1,
        targetY1,
        targetX1 + 1,
        targetY1 + 1,
      ]);

      if (cell.length !== 1) {
        console.error('goTo down error', cell);
        return null;
      }

      return cell[0].id;
    }
  }
};
