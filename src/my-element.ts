import { LitElement, css, html, nothing } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { nanoid } from 'nanoid';
import { addColumn, addRow, margeCell, splitCells } from './table/command';
import {
  setCellsAttrs,
  toggleColumnHeader,
  toggleRowHeader,
} from './table/command/attrs';
import { removeColumn, removeRow } from './table/command/remove';
import {
  getColumnCells,
  getIndexRangeIfCellSameColumn,
  getIndexRangeIfCellSameRow,
  getRowCells,
  isSelectionWholeTable,
} from './table/command/selection';
import './table/component';
import { TableComponent } from './table/component';
import './table/render';
import { TableCell, TableData } from './table/type';
import { getCellSumRange, getCellsFromId } from './table/utils/cell';
import { printTable } from './table/utils/print';
import {
  createTable,
  getVisibleColumnIndex,
  getVisibleRowIndex,
  isValidTableData,
} from './table/utils/table';
import {
  dragColumnRangeTo,
  dragRowRangeTo,
  getColumnAllowDragTarget,
  getRowAllowDragTarget,
} from './table/command/drag';
import { repeat } from 'lit/directives/repeat.js';

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

  getSelectionRowOrColumnIndexText(type: 'row' | 'column') {
    if (this.selections.length === 0) {
      return '';
    }

    const mode = ['inside', 'include', 'match'] as const;
    const cells = getCellsFromId(this.tableData, this.selections);

    for (const m of mode) {
      const index =
        type === 'row'
          ? getIndexRangeIfCellSameRow(this.tableData, cells, m)
          : getIndexRangeIfCellSameColumn(this.tableData, cells, m);
      if (index?.length) {
        return `选中了整${type === 'row' ? '行' : '列'}: ${index}，模式: ${m}`;
      }
    }
  }

  getMatchSelectionRowOrColumnRange(
    type: 'row' | 'column'
  ): null | [number, number] {
    if (this.selections.length === 0) {
      return null;
    }

    const cells = getCellsFromId(this.tableData, this.selections);

    return type === 'row'
      ? getIndexRangeIfCellSameRow(this.tableData, cells, 'match')
      : getIndexRangeIfCellSameColumn(this.tableData, cells, 'match');
  }

  render() {
    const selectionColumns = this.getMatchSelectionRowOrColumnRange('column');
    const columnsAllowTarget = selectionColumns
      ? getColumnAllowDragTarget(this.tableData, selectionColumns)
      : [];

    const selectionRows = this.getMatchSelectionRowOrColumnRange('row');
    const rowsAllowTarget = selectionRows
      ? getRowAllowDragTarget(this.tableData, selectionRows)
      : [];

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
        Is Valid: ${isValidTableData(this.tableData)} <br />
        ${this.getSelectionRowOrColumnIndexText('row')} <br />
        ${this.getSelectionRowOrColumnIndexText('column')} <br />
        ${isSelectionWholeTable(
          this.tableData,
          getCellSumRange(getCellsFromId(this.tableData, this.selections))
        )
          ? '选中了整个表格'
          : ''} <br />
      </div>

      <div style="margin-top: 10px">
        ${selectionColumns && columnsAllowTarget.length > 0
          ? html`
              列${selectionColumns}
              可以拖动到下面列（坐标系）：${columnsAllowTarget.join(',')}
              ${repeat(
                columnsAllowTarget,
                (index) => index,
                (index) => html` <button
                  @click=${() => {
                    const result = dragColumnRangeTo(
                      this.tableData,
                      selectionColumns,
                      index
                    );
                    this.tableData = result.tableData;
                  }}
                >
                  移动到 ${index}
                </button>`
              )}
            `
          : nothing}
      </div>

      <div style="margin-top: 10px">
        ${selectionRows && rowsAllowTarget.length > 0
          ? html`
              行${selectionRows}
              可以拖动到下面行（坐标系）：${rowsAllowTarget.join(',')}
              ${repeat(
                rowsAllowTarget,
                (index) => index,
                (index) => html` <button
                  @click=${() => {
                    const result = dragRowRangeTo(
                      this.tableData,
                      selectionRows,
                      index
                    );
                    this.tableData = result.tableData;
                  }}
                >
                  移动到 ${index}
                </button>`
              )}
            `
          : nothing}
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
