import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TableData } from './table/type';
import { astToDom, modelToDomAst } from './table/utils/table';

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
      pos: [0, 0, 4, 1],
    },
    {
      pos: [0, 1, 1, 3],
    },
    {
      pos: [1, 1, 2, 2],
    },
    {
      pos: [2, 1, 3, 2],
    },
    {
      pos: [3, 1, 4, 2],
    },
    {
      pos: [1, 2, 2, 3],
    },
    {
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
  /**
   * Copy for the read the docs hint.
   */
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more';

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0;

  render() {
    console.log(modelToDomAst(table));
    return html` <div>${astToDom(modelToDomAst(table))}</div> `;
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 2em #325cffaa);
    }

    .card {
      padding: 2em;
    }

    .read-the-docs {
      color: #888;
    }

    ::slotted(h1) {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
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
