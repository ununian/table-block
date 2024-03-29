import { DisposableGroup } from '@blocksuite/global/utils';
import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { TableComponent } from '../component';

@customElement('table-widget-selection-rect')
export class TableWidgetSelectionRect extends LitElement {
  @property({ type: Object })
  tableComponent!: TableComponent;

  private readonly disposeGroup = new DisposableGroup();

  static styles = css`
    :host {
      display: block;
    }
  `;

  @state()
  private selectionRect: DOMRect | null = null;

  connectedCallback() {
    super.connectedCallback();

    this.disposeGroup.add(
      this.tableComponent.tableRender.selectionCtrl.slots.selectionDomRectChange.on(
        (rect) => {
          this.selectionRect = rect;
        }
      )
    );
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.disposeGroup.dispose();
  }

  render(): TemplateResult {
    const rect = this.selectionRect;

    if (!rect) {
      return html``;
    }

    const style = {
      position: 'absolute',
      left: `${rect.x}px`,
      top: `${rect.y}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      pointerEvents: 'none',
      boxSizing: 'border-box',
      borcer: '1px solid ##01BAEF',
      backgroundColor: '#01BAEF50',
    };

    return html` <div style=${styleMap(style)}></div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'table-widget-selection-rect': TableWidgetSelectionRect;
  }
}
