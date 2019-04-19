// @flow

import test from 'ava';
import sql from '../../../../src/templateTags/sql';
import {
  SqlTokenSymbol
} from '../../../../src/symbols';

test('creates a value list', (t) => {
  const query = sql`SELECT (${sql.valueList([1, 2, 3])})`;

  t.deepEqual(query, {
    sql: 'SELECT ($1, $2, $3)',
    type: SqlTokenSymbol,
    values: [
      1,
      2,
      3
    ]
  });
});

test('expands SQL tokens', (t) => {
  const query = sql`SELECT (${sql.valueList([1, sql.raw('foo'), 3])})`;

  t.deepEqual(query, {
    sql: 'SELECT ($1, foo, $2)',
    type: SqlTokenSymbol,
    values: [
      1,
      3
    ]
  });
});

test('expands SQL tokens (with bound values)', (t) => {
  const query = sql`SELECT (${sql.valueList([1, sql.raw('to_timestamp($1), $2', [2, 3]), 4])})`;

  t.deepEqual(query, {
    sql: 'SELECT ($1, to_timestamp($2), $3, $4)',
    type: SqlTokenSymbol,
    values: [
      1,
      2,
      3,
      4
    ]
  });
});

test('the resulting object is immutable', (t) => {
  const token = sql.valueList([1, 2, 3]);

  t.throws(() => {
    // $FlowFixMe
    token.foo = 'bar';
  });
});

test('creates a value list with Date', (t) => {
  const date = new Date();
  const query = sql`SELECT (${sql.valueList([date])})`;

  t.deepEqual(query, {
    sql: 'SELECT ($1)',
    type: SqlTokenSymbol,
    values: [
      date
    ]
  });
});
