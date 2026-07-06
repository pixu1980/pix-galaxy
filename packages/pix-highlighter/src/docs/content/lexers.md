# Lexers

Each of the 15 supported languages has a dedicated lexer. Click on any language below to see its syntax tokenisation in action.

## JavaScript

```js
const fibonacci = (n) => (n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2));

const result = fibonacci(10);
console.log(`fib(10) = ${result}`);
```

## TypeScript

```ts
interface Theme {
  name: string;
  colors: Record<string, string>;
}

const activeTheme: Theme = { name: 'nord', colors: {} };
```

## CSS

```css
.token-panel {
  display: grid;
  gap: 1rem;
  container-type: inline-size;
}
```

## JSON

```json
{
  "name": "@pix-galaxy/pix-highlighter",
  "version": "0.1.0",
  "private": false
}
```

## HTML

```html
<nav aria-label="Documentation">
  <a href="/getting-started">Getting Started</a>
  <a href="/api">API</a>
</nav>
```

## Python

```python
def tokenize(source: str, lang: str) -> list:
    lexer = get_lexer(lang)
    return lexer(source) if lexer else []
```

## Rust

```rust
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let source = "const x: i32 = 42;";
    let tokens = tokenize(source, "rust");
    println!("{:?}", tokens);
    Ok(())
}
```

## C

```c
int main(int argc, char *argv[]) {
    printf("Hello, pix-highlighter!\n");
    return 0;
}
```

## C++

```cpp
template <typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}
```

## PHP

```php
<?php
declare(strict_types=1);

function lexSource(string $source): array {
    return [];
}
```

## C\#

```csharp
public class SyntaxHighlighter {
    public string[] Tokenize(string code) {
        return code.Split(' ');
    }
}
```

## Go

```go
package main

import "fmt"

func main() {
    langs := []string{"go", "rust", "ts"}
    fmt.Println(langs)
}
```

## Markdown

```md
# pix-highlighter

- **Languages:** 15
- **Themes:** 7
- **Deps:** 0
```

## YAML

```yaml
pix-highlighter:
  version: 0.1.0
  languages:
    - javascript
    - typescript
    - rust
```

## Bash

```bash
#!/usr/bin/env bash

pnpm add @pix-galaxy/pix-highlighter
pnpm test
pnpm build
```
