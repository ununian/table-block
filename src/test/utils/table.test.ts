// sum.test.js
import { describe, expect, it, test } from 'vitest';
import {
  createTable,
  isValidTableData,
  modelToDomAst,
} from '../../table/utils/table';
import { printTableAst } from '../../table/utils/print';
import { CellPosition, TableData, TableDomAst } from '../../table/type';

const table: TableData = {
  rows: [{ attrs: { isHeader: true } }, {}, {}],
  columns: [{ attrs: { width: '50px' } }, {}, {}, {}],
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

describe('table', () => {
  it('modelToDomAst', () => {
    const expectedAst: TableDomAst = {
      rows: [
        {
          isHeader: true,
          cells: [{ colSpan: 4, id: '1' }],
        },
        {
          cells: [
            { rowSpan: 2, id: '2' },
            { id: '3' },
            { id: '4' },
            { id: '5' },
          ],
        },
        {
          cells: [{ id: '6' }, { colSpan: 2, id: '7' }],
        },
      ],
      columns: [{ width: '50px' }, {}, {}, {}],
    };

    const ast = modelToDomAst(table);
    expect(ast).toEqual(expectedAst);
  });

  it('isValidTableData', () => {
    expect(isValidTableData(table)).toBe(true);

    const hasEmptyCell = {
      ...table,
      cells: [
        { id: '1', pos: [0, 0, 2, 1] as CellPosition },
        ...table.cells.slice(1),
      ],
    };
    expect(isValidTableData(hasEmptyCell)).toBe(true);

    const hasCrossCell = {
      ...table,
      cells: [
        { id: '1', pos: [0, 0, 2, 2] as CellPosition },
        ...table.cells.slice(1),
      ],
    };
    expect(isValidTableData(hasCrossCell)).toBe(false);
  });
});
