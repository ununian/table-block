import { LitElement, css, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { nanoid } from 'nanoid';
import {
  addColumn,
  addRow,
  goTo,
  margeCell,
  resizeColumn,
  resizeRow,
  splitCells,
} from './table/command';
import {
  setCellsAttrs,
  toggleColumnHeader,
  toggleRowHeader,
} from './table/command/attrs';
import { removeColumn, removeRow } from './table/command/remove';
import { getColumnCells, getRowCells } from './table/command/selection';
import './table/render';
import { TableCell, TableData } from './table/type';
import { getCellsFromId } from './table/utils/cell';
import { printTable } from './table/utils/print';
import {
  getVisibleColumnIndex,
  getVisibleRowIndex,
  isValidTableData,
} from './table/utils/table';
import { cellsToDomRect } from './table/utils/dom';
import { TableRender } from './table/render';

const table: TableData = {
  rows: [{ attrs: { isHeader: true } }, {}, {}],
  columns: [
    { attrs: { width: 50 } },
    { attrs: { width: 100 } },
    { attrs: {} },
    { attrs: {} },
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

  @query('table-render')
  private tableRender!: TableRender;

  formatDomRect(rect: DOMRect): string {
    return `[x: ${rect.x}, y: ${rect.y}, w: ${rect.width}, h: ${rect.height}]`;
  }

  connectedCallback(): void {
    super.connectedCallback();

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.selections = [];
      }

      const map = {
        ArrowLeft: 'previous',
        ArrowRight: 'next',
        ArrowUp: 'up',
        ArrowDown: 'down',
      } as const;
      if (Object.keys(map).includes(e.key)) {
        const id = goTo(
          this.tableData,
          getCellsFromId(this.tableData, this.selections),
          map[e.key as keyof typeof map]
        );
        if (id) {
          this.selections = [id];
        } else {
          this.selections = [];
        }
      }
    });
  }

  render() {
    return html`
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
            this.selections = cells.map((cell) => cell.id);
          }}
        >
          Column 1 Inside
        </button>

        <button
          @click=${() => {
            const cells = getColumnCells(this.tableData, 1, 'include');
            this.selections = cells.map((cell) => cell.id);
          }}
        >
          Column 1 Include
        </button>

        <button
          @click=${() => {
            const cells = getColumnCells(this.tableData, 1, 'match');
            this.selections = cells.map((cell) => cell.id);
          }}
        >
          Column 1 Match
        </button>

        <button
          @click=${() => {
            const cells = getRowCells(this.tableData, 1, 'inside');
            this.selections = cells.map((cell) => cell.id);
          }}
        >
          Row 1 Inside
        </button>

        <button
          @click=${() => {
            const cells = getRowCells(this.tableData, 1, 'include');
            this.selections = cells.map((cell) => cell.id);
          }}
        >
          Row 1 Include
        </button>

        <button
          @click=${() => {
            const cells = getRowCells(this.tableData, 1, 'match');
            this.selections = cells.map((cell) => cell.id);
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

      <table-render
        .data=${this.tableData}
        .contentRender=${this.renderChildren}
        .selections=${this.selections}
        @selection-change=${(e: CustomEvent<string[]>) => {
          this.selections = e.detail;
        }}
        @resize-column=${(e: CustomEvent<{ index: number; width: number }>) => {
          const { index, width } = e.detail;
          this.tableData = resizeColumn(this.tableData, index, width).tableData;
          requestAnimationFrame(() => {
            this.requestUpdate();
          });
        }}
        @resize-row=${(e: CustomEvent<{ index: number; height: number }>) => {
          const { index, height } = e.detail;
          this.tableData = resizeRow(this.tableData, index, height).tableData;
          requestAnimationFrame(() => {
            this.requestUpdate();
          });
        }}
      ></table-render>

      <div style="margin-top: 10px">
        Is Valid: ${isValidTableData(this.tableData)} ||| Selection Dom:
        ${this.selections.length
          ? this.formatDomRect(
              cellsToDomRect(
                getCellsFromId(this.tableData, this.selections),
                this.tableRender,
                'absolute'
              )
            ) +
            '  ' +
            this.formatDomRect(
              cellsToDomRect(
                getCellsFromId(this.tableData, this.selections),
                this.tableRender,
                'relative'
              )
            )
          : 'None'}
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

    table {
      font-family: arial, sans-serif;
      border-collapse: collapse;
      width: 100%;
    }

    td,
    th {
      border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;
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
