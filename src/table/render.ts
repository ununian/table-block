import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TableCell, TableData } from './type';
import { isTableDataEqual } from './utils/table';

@customElement('table-render')
export class TableRender extends LitElement {
  @property({ type: Object, hasChanged: isTableDataEqual })
  data?: TableData;

  @property({ attribute: false })
  contentRender?: (cell: TableCell) => TemplateResult;
}
