import { SpanningCellConfig, table } from 'table';
import { TableData } from '../type';
import { modelToDomAst } from './table';

export const printTableAst = (data: TableData, columnWidth = 10): string => {
  const ast = modelToDomAst(data);

  const spanningCells: SpanningCellConfig[] = [];
  data.cells.forEach((cell) => {
    const colSpan = cell.pos[2] - cell.pos[0];
    const rowSpan = cell.pos[3] - cell.pos[1];

    if (colSpan > 1 || rowSpan > 1) {
      const option = {
        row: cell.pos[1],
        col: cell.pos[0],
      } as any;
      if (colSpan > 1) {
        option.colSpan = colSpan;
      }
      if (rowSpan > 1) {
        option.rowSpan = rowSpan;
      }
      spanningCells.push(option);
    }
  });

  const rowData = ast.rows.map((row) => {
    return row.cells.flatMap((cell) => {
      if (cell.colSpan) {
        return [cell.id, ...Array(cell.colSpan - 1).fill('rowData')];
      }
      return [cell.id];
    });
  });

  ast.rows.forEach((row, rowIndex) => {
    row.cells.forEach((cell, cellIndex) => {
      if (cell.rowSpan) {
        for (let i = 1; i < cell.rowSpan; i++) {
          rowData[rowIndex + i] = [
            ...rowData[rowIndex + i].slice(0, cellIndex),
            '',
            ...rowData[rowIndex + i].slice(cellIndex),
          ];
        }
      }
    });
  });

  return table(rowData, {
    columns: ast.columns.map((col) => ({ width: columnWidth })),
    spanningCells: spanningCells,
  });
};
