import { TemplateResult, html } from 'lit';
import {
  TableCellDomAst,
  TableData,
  TableDomAst,
  TableRowDomAst,
} from '../type';
import { directive } from 'lit/async-directive.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export const createTable = (rows: number, columns: number): TableData => {
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
  return table;
};

export const modelToDomAst = (table: TableData): TableDomAst => {
  const result: TableDomAst = { rows: [], columns: [] };

  for (let i = 0; i < table.rows.length; i++) {
    const cells = table.cells
      .filter((cell) => cell.pos[1] === i)
      .map((cell) => {
        const colSpan = cell.pos[2] - cell.pos[0];
        const rowSpan = cell.pos[3] - cell.pos[1];

        const ast: TableCellDomAst = {};
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
    result.columns.push({
      width: column.attrs?.width,
    });
  });

  return result;
};

export const astToDom = (ast: TableDomAst): TemplateResult => {
  return html`
    <table>
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
                colspan=${cell.colSpan || 1}
                rowspan=${cell.rowSpan || 1}
              >
                1
              </td>`;
            })}
          </tr>
        `;
      })}
    </table>
  `;
};
