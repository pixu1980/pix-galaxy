/**
 * Lexer coverage sweep — feeds each language lexer a syntax-rich sample so
 * every scanner rule (strings/escapes, numbers, comments, operators) is
 * exercised. This is the main lever for the >=95% lines/branch quality bar
 * (ADR-026).
 *
 * Each case asserts the lexer returns a valid token stream and that the
 * sample produced at least one token of each expected category.
 */

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  lexBash,
  lexC,
  lexCPP,
  lexCSharp,
  lexCSS,
  lexGo,
  lexHTML,
  lexJS,
  lexJSON,
  lexMarkdown,
  lexPHP,
  lexPython,
  lexRust,
  lexTS,
  lexYAML,
} from '../components/PixHighlighter/lexers/index.js';

/**
 * Assert a lexer produces well-formed tokens and that the sample hits
 * every expected token type.
 *
 * @param {(text: string) => import('../components/PixHighlighter/lexers/_Utils.js').PixHighlighterToken[]} lexer
 * @param {string} code
 * @param {string[]} expectedTypes Rough token type names to expect.
 */
function lexerCase(lexer, code, expectedTypes) {
  const tokens = lexer(code);
  assert.ok(tokens.length > 0, `expected tokens for sample`);

  for (const token of tokens) {
    assert.equal(typeof token.type, 'string');
    assert.ok(Number.isInteger(token.start), 'start must be integer');
    assert.ok(Number.isInteger(token.end), 'end must be integer');
    assert.ok(token.end >= token.start, 'end must be >= start');
    assert.ok(token.start >= 0 && token.end <= code.length + 1, 'token within bounds');
  }

  for (const type of expectedTypes) {
    assert.ok(
      tokens.some((t) => t.type.includes(type)),
      `expected a token of type "${type}" but got [${[...new Set(tokens.map((t) => t.type))].join(', ')}]`
    );
  }

  return tokens.length;
}

describe('Lexer coverage sweep', () => {
  test('Bash', () => {
    lexerCase(
      lexBash,
      [
        '#!/usr/bin/env bash',
        'set -euo pipefail',
        'NAME="world $HOME \\"quoted\\""',
        'count=42',
        'readonly FILE=/tmp/x.txt',
        'if [[ -n "$NAME" && "$count" -gt 1 ]]; then',
        '  echo "Hello, $NAME!" >&2',
        '  for i in {1..5}; do printf "%s " "$i"; done',
        '  case "$count" in 1) echo one;; *) echo many;; esac',
        'fi',
        'cp src/*.txt dest/ 2>/dev/null || exit 1',
        '# trailing comment',
      ].join('\n'),
      ['str', 'com', 'op']
    );
  });

  test('C', () => {
    lexerCase(
      lexC,
      `#include <stdio.h>
#define MAX 100
typedef unsigned long size_t;
static const float RATIO = 3.14e-2;
enum Color { RED = 1, GREEN };

int main(int argc, char **argv) {
    int *p = malloc(MAX * sizeof(int));
    for (size_t i = 0; i < MAX; i++) {
        p[i] = (int)(i * RATIO);
    }
    // line comment
    /* block
       comment */
    printf("%d \\n", p[0] & 0xFF);
    free(p);
    return 0;
}`,
      ['num', 'com', 'str', 'op']
    );
  });

  test('C++', () => {
    lexerCase(
      lexCPP,
      `#include <vector>
#include <string>
template <typename T>
class Box {
public:
    explicit Box(T v) : value(v) {}
    T get() const { return value; }
private:
    T value;
};
auto main() -> int {
    std::vector<std::string> v{"a", "b"};
    v.push_back("c\\td");
    auto [it, ok] = (std::pair{v.begin(), true});
    Box<int> b{42};
    auto fn = [&b](int x) -> int { return b.get() + x; };
    return fn(1) ^ 0;
}
// end`,
      ['str', 'com', 'op']
    );
  });

  test('C#', () => {
    lexerCase(
      lexCSharp,
      `using System;
using System.Collections.Generic;
namespace Demo {
    public interface IDrive { void Start(); }
    public sealed class Car : IDrive {
        public string Brand { get; set; } = "Tesla";
        public int Speed { get; private set; }
        public Car() { Speed = 0; }
        public void Start() => Speed = 10;
    }
    class Program {
        static void Main(string[] args) {
            var car = new Car();
            car.Start();
            var list = new List<int> { 1, 2, 3 };
            int total = 0;
            foreach (var n in list) { total += n; }
            Console.WriteLine($"{car.Brand}: {total}");
            // comment
            /* block */
            string raw = @"verbatim \n string";
            char ch = 'x';
        }
    }
}`,
      ['str', 'com', 'op']
    );
  });

  test('CSS', () => {
    lexerCase(
      lexCSS,
      `@layer base {
  :root {
    --space-1: 0.25rem;
    color-scheme: light dark;
    --accent: oklch(0.72 0.13 34);
  }
  body > main#app:not(.hidden) {
    margin: calc(1rem + 2px);
    padding: var(--space-1) 2em;
    background: url("bg.png") no-repeat center;
    font-family: ui-monospace, "Cascadia Code", monospace;
    transition: color 140ms ease-in-out;
  }
  .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 48rem) {
  .grid { grid-template-columns: 1fr; }
}
/* trailing */`,
      ['str', 'num', 'com']
    );
  });

  test('Go', () => {
    lexerCase(
      lexGo,
      `package main

import (
    "fmt"
    "strings"
)

type point struct{ x, y int }

func (p point) sum() int { return p.x + p.y }

func main() {
    p := point{1, 2}
    var s string = fmt.Sprintf("pt(%d,%d)", p.x, p.y)
    parts := strings.Split(s, ",")
    total := 0
    for _, part := range parts {
        switch part {
        case "pt(1":
            total += 1
        default:
            total += len(part)
        }
        if total > 10 {
            break
        }
    }
    ch := make(chan int, 1)
    ch <- total
    val := <-ch
    fmt.Println(val)
    // comment
    /* block */
}
`,
      ['str', 'com', 'op']
    );
  });

  test('HTML', () => {
    lexerCase(
      lexHTML,
      `<!DOCTYPE html>
<html lang="en" data-x="1">
<head>
  <meta charset="UTF-8">
  <title>Demo</title>
  <style>a { color: red; }</style>
</head>
<body>
  <!-- a comment -->
  <div id="app" class="row" aria-label="Hello &amp; bye">
    <p>Some <strong>bold</strong> text</p>
    <button disabled>OK</button>
    <script>const x = 1 + 2;</script>
  </div>
</body>
</html>`,
      ['str', 'com']
    );
  });

  test('JavaScript', () => {
    lexerCase(
      lexJS,
      `"use strict";
import { a as b } from 'mod.js';
const pi = 3.14159;
const hex = 0x1F;
const big = 123456789n;
let s = 'single \\"escaped\\"';
let t = \`template \${pi} literal\`;
const re = /ab+c/gi;
class Widget extends Base {
  #priv = 42;
  static make() { return new Widget(); }
  async run(...args) {
    try {
      for (const x of args) {
        if (x == null) continue;
        await this.render(x ?? pi);
      }
      return this.#priv & 0b1010;
    } catch (err) {
      console.error(err?.message);
      throw err;
    } finally {
      cleanup &&= false;
    }
  }
}
export default Widget;
// trailing`,
      ['str', 'num', 'com', 'op']
    );
  });

  test('JSON', () => {
    lexerCase(
      lexJSON,
      `{
  "name": "demo",
  "version": "1.0.0-alpha",
  "count": 42,
  "ratio": 3.5e-2,
  "ok": true,
  "no": false,
  "none": null,
  "arr": [1, "two", {"nested": [true]}],
  "esc": "line\\nfeed and \\"quote\\" and \\\\ backslash"
}`,
      ['str', 'num']
    );
  });

  test('Markdown', () => {
    lexerCase(
      lexMarkdown,
      `# Title

Some **bold**, *italic*, and \`inline code\`.

- list item one
- list item two

1. ordered one
2. ordered two

> blockquote line

\`\`\`js
const x = 1;
\`\`\`

[link text](https://example.com "title") and ![alt](img.png)

| col1 | col2 |
| ---- | ---- |
|   1  |   2  |

~~strikethrough~~ and __underline__.
`,
      ['mdh', 'mdc']
    );
  });

  test('PHP', () => {
    lexerCase(
      lexPHP,
      `<?php
declare(strict_types=1);
namespace App;

use function array_map;
use const PHP_EOL;

final class Demo {
    private array $items = [];
    public function __construct(public string $name = "x") {}

    public function total(array $xs): int {
        $sum = 0;
        foreach ($xs as $v) {
            $sum += $v;
        }
        $fn = fn(int $n): int => $n * 2;
        return $sum + $fn(1);
    }
}

$d = new Demo('yo');
echo $d->total([1, 2, 3]) . PHP_EOL;
// comment
# hash comment
/* block */`,
      ['str', 'com', 'op']
    );
  });

  test('Python', () => {
    lexerCase(
      lexPython,
      `import os
from typing import Optional

class Shape:
    sides = 4
    def __init__(self, name: str) -> None:
        self.name = name

    def area(self) -> float:
        if self.name == "square":
            return 1.5e2
        return 0.0

def main() -> None:
    s = Shape("square")
    total = s.area() + 0.25
    txt = f"area={total:.2f} / raw: {total!r}"
    raw = r"regex \\d+ pattern"
    multi = """triple
    quoted"""
    comp = [x * 2 for x in range(5) if x % 2 == 0]
    with open("f.txt", "w") as fh:
        fh.write(txt)
    for item in comp:
        match item:
            case 0:
                break
            case _:
                continue
    # comment
    # indented  # nested

main()
`,
      ['str', 'num', 'com', 'op']
    );
  });

  test('Rust', () => {
    lexerCase(
      lexRust,
      `use std::collections::HashMap;

#[derive(Debug)]
pub struct Point {
    x: f64,
    y: f64,
}

impl Point {
    pub fn new(x: f64, y: f64) -> Self {
        Self { x, y }
    }
    pub fn dist(&self, other: &Point) -> f64 {
        ((self.x - other.x).powi(2) + (self.y - other.y).powi(2)).sqrt()
    }
}

fn main() {
    let a = Point::new(0.0, 0.0);
    let b = Point::new(3.0, 4.0);
    let mut map: HashMap<&str, f64> = HashMap::new();
    map.insert("d", a.dist(&b));
    for (k, v) in &map {
        println!("{k}: {v}");
    }
    let r = 0xFFu8;
    let bin = 0b1010i32;
    let s = r#"raw "string""#;
    // comment
    /* multiline
       comment */
    let _ = match r { 0 => "zero", _ => "other" };
}
`,
      ['str', 'com', 'num']
    );
  });

  test('TypeScript', () => {
    lexerCase(
      lexTS,
      `interface Grid<T> {
  cells: T[];
  size: [number, number];
  get(index: number): T | undefined;
}
type Maybe<T> = T | null | undefined;
enum Dir { Up = "up", Down = "down" }
class Board<T> implements Grid<T> {
  cells: T[] = [];
  size: [number, number] = [0, 0];
  constructor(cells: T[]) { this.cells = cells; }
  get(index: number): T | undefined { return this.cells[index]; }
}
const b = new Board<number>([1, 2, 3]);
const d: Dir = Dir.Up;
function id<T>(x: T): T { return x; }
const gen: <T>(x: T) => T = id;
export { b, d, gen };
// comment`,
      ['str', 'com', 'op']
    );
  });

  test('YAML', () => {
    lexerCase(
      lexYAML,
      `version: "1.0"
name: demo
count: 42
ratio: 3.14
flag: true
map:
  nested:
    - item1
    - item2
  key: value
multi: |
  line one
  line two
single: 'literal \\n text'
anchor: &base
  foo: bar
alias: *base
# comment`,
      ['str', 'num', 'com']
    );
  });
});
