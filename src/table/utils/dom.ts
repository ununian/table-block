import { TemplateResult, html } from 'lit';

import { ifDefined } from 'lit/directives/if-defined.js';
import {
  TableCell,
  TableCellDomAst,
  TableCellRenderFunction,
  TableColumnDomAst,
  TableData,
  TableDomAst,
  TableRowDomAst,
} from '../type';

export const astToDom = (
  ast: TableDomAst,
  contentRender: TableCellRenderFunction,
  classFn?: {
    td?: (cell: TableCell) => string;
  }
): TemplateResult => {
  return html`
    <colgroup>
      ${ast.columns.map((column) => {
        return html`<col width=${ifDefined(column.width)} />`;
      })}
    </colgroup>
    ${ast.rows.map((row) => {
      return html`
        <tr>
          ${row.cells.map((cell) => {
            return html`<td
              class="${classFn?.td ? classFn.td(cell.originalCell) : ''}"
              data-cell-id=${cell.id}
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
      cells,
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
