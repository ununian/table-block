import { LitElement, css, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { nanoid } from 'nanoid';
import { addColumn, addRow, margeCell, splitCells } from './table/command';
import {
  setCellsAttrs,
  toggleColumnHeader,
  toggleRowHeader,
} from './table/command/attrs';
import { removeColumn, removeRow } from './table/command/remove';
import { getColumnCells, getRowCells } from './table/command/selection';
import './table/component';
import { TableComponent } from './table/component';
import './table/render';
import { TableCell, TableData } from './table/type';
import { getCellsFromId } from './table/utils/cell';
import { printTable } from './table/utils/print';
import {
  createTable,
  getVisibleColumnIndex,
  getVisibleRowIndex,
  isValidTableData,
} from './table/utils/table';

const table: TableData = {
  rows: [{ attrs: { isHeader: true } }, {}, {}],
  columns: [
    { attrs: { width: 50 } },
    { attrs: { width: 100 } },
    { attrs: { width: 100 } },
    { attrs: { width: 100 } },
  ],
  cells: [
    {
      id: '1',
      pos: [0, 0, 4, 1],
    },
    {
      id: '2',
      pos: [0, 1, 1, 3],
    },
    {
      id: '3',
      pos: [1, 1, 2, 2],
    },
    {
      id: '4',
      pos: [2, 1, 3, 2],
    },
    {
      id: '5',
      pos: [3, 1, 4, 2],
    },
    {
      id: '6',
      pos: [1, 2, 2, 3],
    },
    {
      id: '7',
      pos: [2, 2, 4, 3],
    },
  ],
};

console.log(printTable(table, 2));

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  @state()
  tableData = table;

  renderChildren(cell: TableCell) {
    return html`<div>${cell.id}</div>`;
  }

  @state()
  private selections: string[] = [];

  @query('table-component')
  private tableComponent!: TableComponent;

  connectedCallback(): void {
    super.connectedCallback();
  }

  render() {
    return html`
      <div style="margin-bottom: 20px">
        <button
          @click=${() => {
            this.tableData = createTable(3, 4, 750, () => nanoid(5));
          }}
        >
          Create
        </button>
      </div>
      <div style="margin-bottom: 20px">
        <button
          @click=${() => {
            const result = margeCell(
              this.tableData,
              getCellsFromId(this.tableData, this.selections)
            );
            this.tableData = result.tableData;
          }}
        >
          Merge
        </button>

        <button
          @click=${() => {
            const result = splitCells(
              this.tableData,
              getCellsFromId(this.tableData, this.selections),
              nanoid
            );

            this.tableData = result.tableData;
          }}
        >
          Split
        </button>

        <button
          @click=${() => {
            const result = addColumn(
              this.tableData,
              getVisibleColumnIndex(this.tableData, 1),
              nanoid
            );

            this.tableData = result.tableData;
          }}
        >
          Add Column At 1
        </button>

        <button
          @click=${() => {
            const result = addRow(
              this.tableData,
              getVisibleRowIndex(this.tableData, 2),
              nanoid
            );

            this.tableData = result.tableData;
          }}
        >
          Add Row At 2
        </button>

        <button
          @click=${() => {
            this.tableData = toggleColumnHeader(
              toggleRowHeader(this.tableData).tableData
            ).tableData;
          }}
        >
          Toggle Column Row Header
        </button>

        <button
          @click=${() => {
            const result = setCellsAttrs(
              this.tableData,
              getCellsFromId(this.tableData, this.selections),
              {
                background: 'red',
              }
            );

            this.tableData = result.tableData;
          }}
        >
          Set Selection Cell Background
        </button>
      </div>

      <div style="margin-bottom: 20px">
        Selection
        <button
          @click=${() => {
            const cells = getColumnCells(this.tableData, 1, 'inside');
            this.tableComponent.updateSelections(cells.map((cell) => cell.id));
          }}
        >
          Column 1 Inside
        </button>

        <button
          @click=${() => {
            const cells = getColumnCells(this.tableData, 1, 'include');
            this.tableComponent.updateSelections(cells.map((cell) => cell.id));
          }}
        >
          Column 1 Include
        </button>

        <button
          @click=${() => {
            const cells = getColumnCells(this.tableData, 1, 'match');
            this.tableComponent.updateSelections(cells.map((cell) => cell.id));
          }}
        >
          Column 1 Match
        </button>

        <button
          @click=${() => {
            const cells = getRowCells(this.tableData, 1, 'inside');
            this.tableComponent.updateSelections(cells.map((cell) => cell.id));
          }}
        >
          Row 1 Inside
        </button>

        <button
          @click=${() => {
            const cells = getRowCells(this.tableData, 1, 'include');
            this.tableComponent.updateSelections(cells.map((cell) => cell.id));
          }}
        >
          Row 1 Include
        </button>

        <button
          @click=${() => {
            const cells = getRowCells(this.tableData, 1, 'match');
            this.tableComponent.updateSelections(cells.map((cell) => cell.id));
          }}
        >
          Row 1 Match
        </button>
      </div>

      <div style="margin-bottom: 20px">
        Remove
        <button
          @click=${() => {
            const result = removeColumn(
              this.tableData,
              getVisibleColumnIndex(this.tableData, 1)
            );

            this.tableData = result.tableData;
          }}
        >
          Column 1
        </button>

        <button
          @click=${() => {
            const result = removeRow(
              this.tableData,
              getVisibleRowIndex(this.tableData, 1)
            );

            this.tableData = result.tableData;
          }}
        >
          Row 1
        </button>
      </div>

      <table-component
        .data=${this.tableData}
        .contentRender=${this.renderChildren}
        @selection-change=${(e: CustomEvent<string[]>) => {
          this.selections = e.detail;
        }}
        @data-change=${(e: CustomEvent<TableData>) => {
          this.tableData = e.detail;
        }}
      ></table-component>

      <div style="margin-top: 10px">
        Is Valid: ${isValidTableData(this.tableData)}
      </div>
    `;
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    button {
      border-radius: 4px;
      border: 1px solid transparent;
      padding: 4px 12px;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: border-color 0.25s;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
