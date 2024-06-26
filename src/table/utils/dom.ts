import { TemplateResult, html } from 'lit';

import {
  CellPosition,
  TableCell,
  TableCellDomAst,
  TableCellRenderFunction,
  TableColumnDomAst,
  TableData,
  TableDomAst,
  TableRowDomAst,
} from '../type';
import { styleMap } from 'lit/directives/style-map.js';
import { getCellSumRange, isCellInHeader } from './cell';
import { TableRender } from '../render';

export const astToDom = (
  ast: TableDomAst,
  contentRender: TableCellRenderFunction,
  classFn?: {
    td?: (cell: TableCell) => string;
  },
  totalWidth: number = 750
): TemplateResult => {
  let restWidth = totalWidth;
  return html`
    <colgroup>
      ${ast.columns.map((column, index) => {
        const width =
          column.width ||
          (index === ast.columns.length - 1
            ? restWidth
            : restWidth / ast.columns.length - 1);
        restWidth -= width;
        return html`<col width=${width} />`;
      })}
    </colgroup>
    ${ast.rows.map((row) => {
      return html`
        <tr
          style=${styleMap({
            height: row.height ? `${row.height}px` : undefined,
          })}
          ?data-is-header=${row.isHeader}
        >
          ${row.cells.map((cell) => {
            return html`<td
              class="${classFn?.td ? classFn.td(cell.originalCell) : ''}"
              data-cell-id=${cell.id}
              ?data-in-header=${cell.inHeader}
              style=${styleMap({
                backgroundColor: cell.attrs?.background,
              })}
              colspan=${cell.colSpan || 1}
              rowspan=${cell.rowSpan || 1}
            >
              ${contentRender(cell.originalCell)}
            </td>`;
          })}
        </tr>
      `;
    })}
  `;
};

export const dataToDomAst = (table: TableData): TableDomAst => {
  const result: TableDomAst = { rows: [], columns: [] };

  for (let i = 0; i < table.rows.length; i++) {
    const cells = table.cells
      .filter((cell) => cell.pos[1] === i)
      .map((cell) => {
        const colSpan = cell.pos[2] - cell.pos[0];
        const rowSpan = cell.pos[3] - cell.pos[1];

        const ast: TableCellDomAst = {
          id: cell.id,
          originalCell: cell,
          attrs: cell.attrs,
          inHeader: isCellInHeader(table, cell),
        };
        if (colSpan > 1) {
          ast.colSpan = colSpan;
        }

        if (rowSpan > 1) {
          ast.rowSpan = rowSpan;
        }

        return ast;
      });

    const row: TableRowDomAst = {
      height: table.rows[i].attrs?.height,
      cells: cells.sort(
        (a, b) => a.originalCell.pos[0] - b.originalCell.pos[0]
      ),
    };
    if (table.rows[i].attrs?.isHeader) {
      row.isHeader = true;
    }
    result.rows.push(row);
  }

  table.columns.forEach((column) => {
    const col = {} as TableColumnDomAst;
    if (column.attrs?.width) {
      col.width = column.attrs.width;
    }
    result.columns.push(col);
  });

  return result;
};

export const rangeToDomRect = (
  range: CellPosition,
  tableRender: TableRender,
  mode: 'absolute' | 'relative' = 'absolute'
): DOMRect => {
  const columnPos = Array.from<HTMLTableColElement>(
    tableRender.shadowRoot!.querySelectorAll('colgroup col')
  ).reduce((acc, col) => {
    const rect = col.getBoundingClientRect();
    if (acc.length === 0) {
      acc.push(mode === 'relative' ? 0 : rect.left);
    }
    acc.push(rect.width + (acc[acc.length - 1] || 0));
    return acc;
  }, [] as number[]);

  const rowPos = Array.from<HTMLTableRowElement>(
    tableRender.shadowRoot!.querySelectorAll('tr')
  ).reduce((acc, row) => {
    const rect = row.getBoundingClientRect();
    if (acc.length === 0) {
      acc.push(mode === 'relative' ? 0 : rect.top);
    }
    acc.push(rect.height + (acc[acc.length - 1] || 0));
    return acc;
  }, [] as number[]);

  const [x1, y1, x2, y2] = range;

  return new DOMRect(
    columnPos[x1],
    rowPos[y1],
    columnPos[x2] - columnPos[x1],
    rowPos[y2] - rowPos[y1]
  );
};

export const cellsToDomRect = (
  cells: TableCell[],
  tableRender: TableRender,
  mode: 'absolute' | 'relative' = 'absolute'
) => {
  return rangeToDomRect(getCellSumRange(cells), tableRender, mode);
};
