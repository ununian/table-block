// sum.test.js
import { describe, expect, it, test } from 'vitest';

import {
  getCellsInsideRange,
  getCellsIncludeRange,
  getCellsMatchRange,
} from '../../table/utils/cell';
import { TableData } from '../../table/type';

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

describe('cell', () => {
  it('getCellsInsideRange', () => {
    expect(
      getCellsInsideRange(table, [0, 0, 3, 2]).map((cell) => cell.id)
    ).toEqual(['3', '4']);

    expect(
      getCellsInsideRange(table, [0, 0, 2, 3]).map((cell) => cell.id)
    ).toEqual(['2', '3', '6']);
  });

  it('getCellsIncludeRange', () => {
    expect(
      getCellsIncludeRange(table, [0, 0, 3, 2]).map((cell) => cell.id)
    ).toEqual(['1', '2', '3', '4']);

    expect(
      getCellsIncludeRange(table, [0, 0, 2, 3]).map((cell) => cell.id)
    ).toEqual(['1', '2', '3', '6']);

    expect(
      getCellsIncludeRange(table, [1, 0, 2, 2]).map((cell) => cell.id)
    ).toEqual(['1', '3']);
  });

  it('getCellsMatchRange', () => {
    expect(
      getCellsMatchRange(table, [1, 1, 3, 2]).map((cell) => cell.id)
    ).toEqual(['3', '4']);

    expect(
      getCellsMatchRange(table, [0, 0, 1, 1]).map((cell) => cell.id)
    ).toEqual(['1']);

    expect(
      getCellsMatchRange(table, [1, 0, 2, 2]).map((cell) => cell.id)
    ).toEqual(['1', '2', '3', '4', '5', '6', '7']);

    expect(
      getCellsMatchRange(table, [0, 1, 2, 2]).map((cell) => cell.id)
    ).toEqual(['2', '3', '6']);

    expect(
      getCellsMatchRange(table, [2, 1, 3, 3]).map((cell) => cell.id)
    ).toEqual(['4', '5', '7']);
  });
});
