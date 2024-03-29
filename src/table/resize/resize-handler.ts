import { DisposableGroup } from '@blocksuite/global/utils';
import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { TableResizeController } from './controller';

@customElement('table-resize-handler')
export class TableResizeHandler extends LitElement {
  static styles = css`
    .table-resize-handler {
      position: absolute;
      transform: translate(0);
    }

    .table-resize-handler:hover {
      background-color: #e0a018;
    }
  `;

  private readonly disposeGroup = new DisposableGroup();

  @property({ type: Number })
  pos = 0;

  @property({ type: Number })
  index = 0;

  @property({ type: String })
  mode: 'column' | 'row' = 'column';

  @property({ type: Object })
  ctrl!: TableResizeController;

  @property({ type: Boolean })
  isFirst = false;

  @property({ type: Boolean })
  isLast = false;

  @state()
  private translateX = 0;

  @state()
  private translateY = 0;

  connectedCallback() {
    super.connectedCallback();
    this.disposeGroup.addFromEvent(
      this,
      'pointerdown',
      this.onPointerDown.bind(this),
      { capture: true }
    );

    this.disposeGroup.addFromEvent(
      document,
      'pointermove',
      this.onTablePointerMove.bind(this)
    );

    this.disposeGroup.addFromEvent(
      document,
      'pointerup',
      this.onTablePointerUp.bind(this)
    );
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.disposeGroup.dispose();
  }

  private _isDragging = false;
  private _startX: number | null = null;
  private _startY: number | null = null;
  private onPointerDown(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this._isDragging = true;
    this._startX = e.clientX;
    this._startY = e.clientY;
  }

  private onTablePointerMove(e: MouseEvent) {
    if (!this._isDragging) return;

    if (this.mode === 'column') {
      const dx = e.clientX - this._startX!;
      this.translateX = dx;
    } else {
      const dy = e.clientY - this._startY!;
      this.translateY = dy;
    }
  }

  private onTablePointerUp(e: MouseEvent) {
    if (!this._isDragging) return;

    const dx = e.clientX - this._startX!;
    const dy = e.clientY - this._startY!;

    this._isDragging = false;
    this._startX = null;
    this.translateX = 0;
    this._startY = null;
    this.translateY = 0;

    if (this.mode === 'column') {
      this.ctrl.resizeColumn(this.index, dx);
    } else {
      this.ctrl.resizeRow(this.index, dy);
    }
  }

  render(): TemplateResult {
    const style: Record<string, any> =
      this.mode === 'column'
        ? {
            top: 0,
            left: `${this.pos}px`,
            transform: `translateX(${this.translateX - 1}px)`,
            width: '3px',
            height: '100%',
            cursor: 'col-resize',
          }
        : {
            left: 0,
            top: `${this.pos}px`,
            transform: `translateY(${this.translateY - 1}px)`,
            width: '100%',
            height: '3px',
            cursor: 'row-resize',
          };
    if (this._isDragging) {
      style.backgroundColor = '#e0a018';
    }

    return html`<div
      class="table-resize-handler"
      style=${styleMap(style)}
    ></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'table-resize-handler': TableResizeHandler;
  }
}
