// sum.test.js
import { describe, expect, it } from 'vitest';
import { CellPosition, TableData, TableDomAst } from '../../table/type';
import { dataToDomAst } from '../../table/utils/dom';
import { isValidTableData } from '../../table/utils/table';

const table: TableData = {
  rows: [{ attrs: { isHeader: true } }, {}, {}],
  columns: [{}, {}, {}, {}],
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
  it('dataToDomAst', () => {
    const expectedAst: TableDomAst = {
      rows: [
        {
          isHeader: true,
          cells: [
            {
              colSpan: 4,
              id: '1',
              attrs: undefined,
              inHeader: true,
              originalCell: { id: '1', pos: [0, 0, 4, 1] },
            },
          ],
        },
        {
          cells: [
            {
              rowSpan: 2,
              attrs: undefined,
              inHeader: false,
              id: '2',
              originalCell: { id: '2', pos: [0, 1, 1, 3] },
            },
            {
              id: '3',
              attrs: undefined,
              inHeader: false,
              originalCell: { id: '3', pos: [1, 1, 2, 2] },
            },
            {
              id: '4',
              attrs: undefined,
              inHeader: false,
              originalCell: { id: '4', pos: [2, 1, 3, 2] },
            },
            {
              id: '5',
              attrs: undefined,
              inHeader: false,
              originalCell: { id: '5', pos: [3, 1, 4, 2] },
            },
          ],
        },
        {
          cells: [
            {
              id: '6',
              attrs: undefined,
              inHeader: false,
              originalCell: {
                id: '6',
                pos: [1, 2, 2, 3],
              },
            },
            {
              attrs: undefined,
              inHeader: false,
              colSpan: 2,
              id: '7',
              originalCell: {
                id: '7',
                pos: [2, 2, 4, 3],
              },
            },
          ],
        },
      ],
      columns: [{ width: 50 }, {}, {}, {}],
    };

    const ast = dataToDomAst(table);
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
