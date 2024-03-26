// sum.test.js
import { describe, expect, it, test } from 'vitest';
import { createTable, modelToDomAst } from '../../table/utils/table';
import { TableData, TableDomAst } from '../../table/type';

const table: TableData = {
  rows: [{ attrs: { isHeader: true } }, {}, {}],
  columns: [{ attrs: { width: '50px' } }, {}, {}, {}],
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

describe('table', () => {
  it('modelToDomAst', () => {
    const expected = `<table>
    <tr data-is-header>
      <td  colspan="4">Wide header</td>
    </tr>
    <tr>
      <td rowspan="2">One <br/> Four </td>
      <td>Two</td>
      <td>11</td>
      <td>Three</td>
    </tr>
    <tr>
      <td>Five</td>
      <td colspan="2">333 <br/> Six</td>
    </tr>
  </table>`;

    const expectedAst: TableDomAst = {
      rows: [
        {
          isHeader: true,
          cells: [{ colSpan: 4 }],
        },
        {
          cells: [{ rowSpan: 2 }, {}, {}, {}],
        },
        {
          cells: [{}, { colSpan: 2 }],
        },
      ],
      columns: [{}, {}, {}, {}],
    };
    const ast = modelToDomAst(table);
    expect(ast).toEqual(expectedAst);
  });
});
