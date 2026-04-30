# Markdown Style Guide and Standards

## Purpose

* Markdown is for writing docs that are easy to read in plain text and render consistently.
* Optimize for scalability, stable diffs, and predictable structure.

## Document structure

* Start with exactly one H1 (`# Title`) at the top.
* Follow with a short intro paragraph that states what the document is and who it is for.
* Use headings in order, do not skip levels (`##` then `###`, not `##` to `####`).
* Keep sections focused, split long sections into subheadings.

## Headings

* Use sentence case for headings unless the project uses a different convention.
* Do not include trailing punctuation in headings.
* Prefer meaningful headings over clever ones.

## Lists

* Use `-` for unordered lists, one space after the dash.
* Use `1.` for ordered lists, let the renderer handle numbering.
* Keep list items parallel in grammar.
* For nested lists, indent by 2 spaces per level.

## Code blocks

* Use fenced code blocks with triple backticks.
* Always specify the language when known, for example `js`, `css`, `html`, `json`, `bash`.
* Keep code blocks focused. If a block is long, consider extracting into a file in the repo and link it.
* Do not mix prose and code in the same block.

```js
const example = true;
```

## Inline code

* Use single backticks for identifiers, filenames, commands, and short snippets.
* Avoid wrapping entire sentences in inline code.

## Links

* Prefer descriptive link text, avoid raw URLs in prose.
* Use relative links for repo internal references.
* If a link target is important for long term stability, prefer canonical sources.

## Images

* Use alt text that describes the content and intent.
* Store images in a predictable folder, for example `docs/assets/`.
* Prefer SVG for diagrams when possible.

```md
![Architecture diagram showing data flow](docs/assets/architecture.svg)
```

## Tables

* Use tables only when they improve comprehension.
* Keep tables small and readable. If a table is wide, consider converting to a list or splitting into multiple tables.
* Align pipes consistently.

## Formatting rules

* Use 1 blank line between blocks: headings, paragraphs, lists, and code fences.
* Keep lines reasonably short when it improves diffs, but do not hard wrap in a way that harms readability.
* Use consistent indentation: 2 spaces for nested structures.
* End files with a newline.

## Tone and content conventions

* Prefer clear, direct language.
* Explain "why" for decisions, not only "what".
* Avoid unnecessary fluff. Add examples when they reduce ambiguity.

## Repo conventions

* Use consistent filenames: `kebab-case.md` for docs, unless the repo standard differs.
* For root docs, keep a predictable set: `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`.
* Use a table of contents for long documents, either manual links or an auto generated section if the tooling supports it.

## Validation and maintenance

* Use a Markdown linter if available and keep rules consistent across the repo.
* Check rendered output in the target platform (GitHub, docs site, wiki) when adding complex formatting.

## Example skeleton

````md
# Document title

Short intro that explains what this is and who should read it.

## Goals

- Goal 1
- Goal 2

## Usage

1. Install dependencies
2. Run the project

## Examples

```js
console.log("Hello, docs");
````

## Anti-patterns to avoid

* Avoid heading jumps (`##` to `####`) without structural reason.
* Avoid giant paragraphs with no sectioning.
* Avoid generic link labels like "click here".
* Avoid language-less fenced code blocks when language is known.

## Preferred documentation flow

1. Context: what and why.
2. Prerequisites: dependencies and assumptions.
3. Steps: concrete, ordered procedure.
4. Verification: expected result.
5. Troubleshooting: known failure modes.

## Example: command documentation

```md
## Run accessibility audit

Use this command to generate JSON + HTML report artifacts.

```bash
pnpm run a11y
```

Expected output:
- `reports/a11y/axe.json`
- `reports/a11y/axe-report.html`
```

## Example: table vs list choice

Use table when comparing fixed attributes:

```md
| Script | Purpose | Output |
|---|---|---|
| `a11y:audit` | Run axe scan | `axe.json` |
| `a11y:report` | Build standalone report | `axe-report.html` |
```

Use list when content is narrative or uneven:

```md
- Run scan first
- Verify violations grouped by impact
- Export artifact to CI
```

## Review checklist example

1. Single H1 exists and heading order is valid.
2. Sections are concise and task-oriented.
3. Code blocks have language tags.
4. Links are descriptive and stable.
5. Rendering was checked in target platform.
