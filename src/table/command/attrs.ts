import { TableCell, TableChangedResult, TableData } from '../type';
import { toResult } from '../utils/result';

export const setCellsAttrs = (
  tableData: TableData,
  cells: TableCell[],
  attrs: Partial<TableCell['attrs']>,
  mode: 'merge' | 'replace' = 'merge'
): TableChangedResult => {
  const result = { ...tableData };

  result.cells = tableData.cells.map((cell) => {
    if (cells.includes(cell)) {
      return {
        ...cell,
        attrs:
          mode === 'replace'
            ? attrs
            : {
                ...cell.attrs,
                ...attrs,
              },
      };
    }
    return cell;
  });

  return toResult(result, { change: cells });
};

export const toggleRowHeader = (tableData: TableData): TableChangedResult => {
  const result = { ...tableData };

  const row = result.rows[0];
  if (!row) return toResult(result);
  row.attrs = {
    ...row.attrs,
    isHeader: !row.attrs?.isHeader,
  };

  return toResult(result);
};

export const toggleColumnHeader = (
  tableData: TableData
): TableChangedResult => {
  const result = { ...tableData };

  const column = result.columns[0];
  if (!column) return toResult(result);
  column.attrs = {
    ...column.attrs,
    isHeader: !column.attrs?.isHeader,
  };

  return toResult(result);
};
