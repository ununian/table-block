import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { TableCellRenderFunction, TableData } from './type';
import { astToDom, dataToDomAst } from './utils/dom';
import { TableSelectionController } from './selection/controller';
import { DisposableGroup, isEqual } from '@blocksuite/global/utils';

@customElement('table-render')
export class TableRender extends LitElement {
  @property({ type: Object })
  data?: TableData;

  @property({ attribute: false })
  contentRender?: TableCellRenderFunction;

  @property({ type: Array, hasChanged: (a, b) => !isEqual(a, b) })
  selections: string[] = [];

  private readonly disposeGroup = new DisposableGroup();
  private selectionCtrl = new TableSelectionController(this);

  static styles = css`
    :host {
      display: block;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    td {
      border: 1px solid #000;
      padding: 8px;

      &[data-in-header] {
        background-color: #16cd93;
      }

      &.is-selected-cell {
        background-color: #f0f0f0;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.disposeGroup.add(this.selectionCtrl);
    this.selectionCtrl.initialize();

    this.disposeGroup.add(
      this.selectionCtrl.slots.selectionChange.on((selectedCellIds) => {
        if (selectedCellIds.length > 0) {
          window.getSelection()?.removeAllRanges();
        }
        this.dispatchEvent(
          new CustomEvent('selection-change', { detail: selectedCellIds })
        );
      })
    );
  }

  renderChildren() {
    if (!this.data || typeof this.contentRender !== 'function') {
      return html``;
    }

    const ast = dataToDomAst(this.data);
    const result = astToDom(ast, this.contentRender, {
      td: (cell) =>
        this.selections.includes(cell.id) ? 'is-selected-cell' : '',
    });
    return result;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.disposeGroup.dispose();
  }

  render(): TemplateResult {
    return html`
      <table>
        ${this.renderChildren()}
      </table>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'table-render': TableRender;
  }
}
