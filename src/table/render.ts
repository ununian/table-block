import { DisposableGroup, isEqual } from '@blocksuite/global/utils';
import { LitElement, PropertyValueMap, TemplateResult, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TableSelectionController } from './selection/controller';
import { TableCellRenderFunction, TableData } from './type';
import { astToDom, dataToDomAst } from './utils/dom';
import { TableResizeController } from './resize/controller';

@customElement('table-render')
export class TableRender extends LitElement {
  @property({ type: Object })
  data?: TableData;

  @property({ attribute: false })
  contentRender?: TableCellRenderFunction;

  @property({ type: Array, hasChanged: (a, b) => !isEqual(a, b) })
  selections: string[] = [];

  private readonly disposeGroup = new DisposableGroup();
  public selectionCtrl = new TableSelectionController(this);
  public resizeCtrl = new TableResizeController(this);

  static styles = css`
    :host {
      display: block;
    }
    table {
      border-collapse: collapse;
      position: relative;
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

    this.disposeGroup.add(this.resizeCtrl);

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

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);
    this.resizeCtrl.initialize();
  }

  protected shouldUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): boolean {
    if (_changedProperties.has('data')) {
      requestAnimationFrame(() => {
        this.resizeCtrl.updateColumnPos();
      });
    }

    return super.shouldUpdate(_changedProperties);
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
        ${this.renderChildren()} ${this.resizeCtrl.renderResizeHandle()}
      </table>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'table-render': TableRender;
  }
}
