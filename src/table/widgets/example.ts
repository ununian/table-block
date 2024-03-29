import { DisposableGroup, isEqual } from '@blocksuite/global/utils';
import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { TableComponent } from '../component';
import { TableData } from '../type';
import { getCellsFromId } from '../utils/cell';
import { cellsToDomRect } from '../utils/dom';

@customElement('table-widget-example')
export class TableWidgetExample extends LitElement {
  @property({ type: Object })
  data?: TableData;

  @property({ type: Array, hasChanged: (a, b) => !isEqual(a, b) })
  selections: string[] = [];

  @property({ type: Object })
  tableComponent!: TableComponent;

  private readonly disposeGroup = new DisposableGroup();

  static styles = css`
    :host {
      display: block;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.disposeGroup.dispose();
  }

  formatDomRect(rect: DOMRect): string {
    return `[x: ${rect.x}, y: ${rect.y}, w: ${rect.width}, h: ${rect.height}]`;
  }

  render(): TemplateResult {
    if (this.selections.length === 0) {
      return html``;
    }
    const rect = cellsToDomRect(
      getCellsFromId(this.data, this.selections),
      this.tableComponent.tableRender,
      'relative'
    );

    const style = {
      position: 'absolute',
      left: `${rect.x}px`,
      top: `${rect.y}px`,
      pointerEvents: 'none',
      boxSizing: 'border-box',
      opacity: 0.5,
      backgroundColor: '#f0f0f0',
      padding: '4px',
      transform: 'translate(0, -100%)',
    };

    return html`
      <div style=${styleMap(style)}>${this.formatDomRect(rect)}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'table-widget-example': TableWidgetExample;
  }
}
