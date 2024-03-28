import { DisposableGroup } from '@blocksuite/global/utils';
import { TableRender } from '../render';
import { html } from 'lit';
import './resize-handler';
import { repeat } from 'lit/directives/repeat.js';

export class TableResizeController {
  private readonly disposeGroup = new DisposableGroup();

  public slots = {};

  public constructor(public readonly tableRender: TableRender) {}

  get tableData() {
    return this.tableRender.data;
  }

  private columnPos: number[] = [];
  private columnWidth: number[] = [];

  private rowPos: number[] = [];
  private rowHeight: number[] = [];

  public initialize() {
    const resizeObserver = new ResizeObserver(() => {
      this.updateColumnPos();
    });

    resizeObserver.observe(
      this.tableRender.shadowRoot!.querySelector('table colgroup')!
    );

    requestAnimationFrame(() => {
      this.updateColumnPos();
    });

    this.disposeGroup.add(() => {
      resizeObserver.disconnect();
    });
  }

  public updateColumnPos() {
    this.columnWidth = [];
    this.columnPos = Array.from<HTMLTableColElement>(
      this.tableRender.shadowRoot!.querySelectorAll('colgroup col')
    ).reduce((acc, col) => {
      const rect = col.getBoundingClientRect();
      this.columnWidth.push(Number(col.getAttribute('width')));
      acc.push(rect.width + (acc[acc.length - 1] || 0));
      return acc;
    }, [] as number[]);

    this.rowHeight = [];
    this.rowPos = Array.from<HTMLTableRowElement>(
      this.tableRender.shadowRoot!.querySelectorAll('tr')
    ).reduce((acc, row) => {
      const rect = row.getBoundingClientRect();
      this.rowHeight.push(rect.height);
      acc.push(rect.height + (acc[acc.length - 1] || 0));
      return acc;
    }, [] as number[]);

    this.tableRender.requestUpdate();
  }

  public resizeColumn(index: number, dx: number) {
    const width = this.columnWidth[index] + dx;
    this.tableRender.dispatchEvent(
      new CustomEvent('resize-column', { detail: { index, width } })
    );
  }

  public resizeRow(index: number, dy: number) {
    const height = this.rowHeight[index] + dy;
    this.tableRender.dispatchEvent(
      new CustomEvent('resize-row', { detail: { index, height } })
    );
  }

  public renderResizeHandle() {
    return html` <div>
      ${repeat(this.columnPos, (pos, index) => {
        return html`<table-resize-handler
          pos=${pos}
          index=${index}
          ?isFirst=${index === 0}
          ?isLast=${index === this.columnPos.length - 1}
          .ctrl=${this}
        ></table-resize-handler>`;
      })}
      ${repeat(this.rowPos, (pos, index) => {
        return html`<table-resize-handler
          pos=${pos}
          index=${index}
          mode="row"
          ?isFirst=${index === 0}
          ?isLast=${index === this.rowPos.length - 1}
          .ctrl=${this}
        ></table-resize-handler>`;
      })}
    </div>`;
  }

  public dispose() {
    this.disposeGroup.dispose();
  }
}
