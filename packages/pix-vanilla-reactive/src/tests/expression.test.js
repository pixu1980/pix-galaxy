/**
 * Expression parser + filter tests — pure, no DOM.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseExpression,
  parseArg,
  getFromPath,
  evaluateExpression,
} from '../core/template-engine/_expression-parser.js';
import { FILTERS, registerFilter, utilSlug } from '../core/template-engine/_filters.js';

describe('parseExpression', () => {
  it('parses a plain variable', () => {
    const parsed = parseExpression('title');
    assert.equal(parsed.variable, 'title');
    assert.deepEqual(parsed.filters, []);
  });

  it('parses filter pipes with colon args', () => {
    const parsed = parseExpression('date | date:YYYY-MM-DD');
    assert.equal(parsed.variable, 'date');
    assert.deepEqual(parsed.filters, [{ name: 'date', args: ['YYYY-MM-DD'] }]);
  });

  it('parses function-call style filters', () => {
    const parsed = parseExpression('s | truncate(10)');
    assert.deepEqual(parsed.filters, [{ name: 'truncate', args: [10] }]);
  });
});

describe('parseArg', () => {
  it('parses literals', () => {
    assert.equal(parseArg('"hi"'), 'hi');
    assert.equal(parseArg("'hi'"), 'hi');
    assert.equal(parseArg('42'), 42);
    assert.equal(parseArg('3.14'), 3.14);
    assert.equal(parseArg('true'), true);
    assert.equal(parseArg('raw'), 'raw');
  });
});

describe('getFromPath', () => {
  it('walks dot-paths and bracket indices', () => {
    const obj = { a: { b: [10, 20] } };
    assert.equal(getFromPath(obj, 'a.b[1]'), 20);
    assert.equal(getFromPath(obj, 'missing'), undefined);
  });
});

describe('built-in filters', () => {
  const ctx = {
    title: 'hello',
    items: [{ label: 'One' }, { label: 'Two' }],
    when: '2026-01-05T10:00:00.000Z',
  };

  it('string filters', () => {
    assert.equal(evaluateExpression(parseExpression('title | upper'), ctx), 'HELLO');
    assert.equal(evaluateExpression(parseExpression('title | capitalize'), ctx), 'Hello');
    assert.equal(evaluateExpression(parseExpression('title | slug'), ctx), 'hello');
    assert.equal(utilSlug('Hello World!'), 'hello-world');
  });

  it('escapeHtml escapes markup', () => {
    assert.equal(
      evaluateExpression(parseExpression('raw | escapeHtml'), { raw: '<b>"x"</b>' }),
      '&lt;b&gt;&quot;x&quot;&lt;/b&gt;'
    );
  });

  it('collection filters', () => {
    assert.equal(evaluateExpression(parseExpression('items | length'), ctx), 2);
    assert.equal(evaluateExpression(parseExpression('items | join:" - "'), ctx), 'One - Two');
    assert.equal(evaluateExpression(parseExpression('items | first | tagLabel'), ctx), 'One');
  });

  it('date filters', () => {
    assert.equal(evaluateExpression(parseExpression('when | date:YYYY-MM-DD'), ctx), '2026-01-05');
    assert.equal(
      evaluateExpression(parseExpression('when | date:DD MMM YYYY'), ctx),
      '05 Jan 2026'
    );
  });

  it('default filter', () => {
    assert.equal(evaluateExpression(parseExpression('missing | default:"n/a"'), ctx), 'n/a');
  });

  it('custom filters via registerFilter', () => {
    registerFilter('shout', (v) => `${String(v).toUpperCase()}!`);
    assert.equal(evaluateExpression(parseExpression('title | shout'), ctx), 'HELLO!');
    assert.ok(FILTERS.shout);
  });
});
