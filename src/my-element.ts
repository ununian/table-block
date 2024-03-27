import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { TableCell, TableData } from './table/type';
import { printTableAst } from './table/utils/print';
import './table/render';

const table: TableData = {
  rows: [{ attrs: { isHeader: true } }, {}, {}],
  columns: [
    { attrs: { width: '50px' } },
    { attrs: { width: '100px' } },
    { attrs: { width: '150px' } },
    { attrs: { width: '200px' } },
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

const a = console.log(printTableAst(table, 2));

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

  render() {
    return html`
      <div style="margin-bottom: 20px">
        <button @click=${() => console.log('clicked')}>Click me</button>
      </div>

      <table-render
        .data=${this.tableData}
        .contentRender=${this.renderChildren}
        @selection-change=${(e: CustomEvent<string[]>) => {
          console.log('selection-changed', e.detail);
        }}
      ></table-render>
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
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
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
