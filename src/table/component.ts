import { LitElement, css, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { goTo, resizeColumn, resizeRow } from './command';
import './render';
import { TableRender } from './render';
import { TableCell, TableCellRenderFunction, TableData } from './type';
import { getCellsFromId } from './utils/cell';
import { DisposableGroup } from '@blocksuite/global/utils';
import './widgets/example';
@customElement('table-component')
export class TableComponent extends LitElement {
  private readonly disposeGroup = new DisposableGroup();

  @property({ type: Object })
  data: TableData = { rows: [], columns: [], cells: [] };

  @property({ attribute: false })
  contentRender?: TableCellRenderFunction;

  @state()
  private selections: string[] = [];

  @query('table-render')
  public tableRender!: TableRender;

  private _requestUpdateData(data: TableData) {
    this.dispatchEvent(new CustomEvent('data-change', { detail: data }));
  }

  public updateSelections(selection: string[]) {
    this.selections = selection;
    this.dispatchEvent(
      new CustomEvent('selection-change', { detail: selection })
    );
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
          this.data,
          getCellsFromId(this.data, this.selections),
          map[e.key as keyof typeof map]
        );
        if (id) {
          this.updateSelections([id]);
        } else {
          this.updateSelections([]);
        }
      }
    });
  }

  renderWidgets() {
    return html`
      <table-widget-example
        .data=${this.data}
        .selections=${this.selections}
        .tableComponent=${this}
      ></table-widget-example>
    `;
  }

  render() {
    return html`
      <div style="margin-bottom: 20px">
        <table-render
          .data=${this.data}
          .contentRender=${this.contentRender}
          .selections=${this.selections}
          @selection-change=${(e: CustomEvent<string[]>) => {
            this.updateSelections(e.detail);
          }}
          @resize-column=${(
            e: CustomEvent<{ index: number; width: number }>
          ) => {
            const { index, width } = e.detail;
            this._requestUpdateData(
              resizeColumn(this.data, index, width).tableData
            );
          }}
          @resize-row=${(e: CustomEvent<{ index: number; height: number }>) => {
            const { index, height } = e.detail;
            this._requestUpdateData(
              resizeRow(this.data, index, height).tableData
            );
          }}
        ></table-render>

        ${this.renderWidgets()}
      </div>
    `;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.disposeGroup.dispose();
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'table-component': TableComponent;
  }
}
