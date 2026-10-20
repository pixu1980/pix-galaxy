# Architecture Decision Records

Every decision this project has taken, newest first. The numbered files in
this directory are the source of truth; this index is generated from them by
`pix_tool_process_adr`, so editing it by hand is work the next call throws away.

## Index

| # | Title | Date | Status | Tags |
| - | ----- | ---- | ------ | ---- |

## What each decision says

The opening sentence of each decision and of what it cost, lifted from the
file. Where a line stops short the rest is in the ADR.

| ADR | Decision | Consequence |
| --- | -------- | ----------- |

## By theme

Tags carried by 3 or more decisions. A decision appears under every
theme it carries, and the early ADRs that predate the tag field are listed last.

## Operating rules

- Record a structural decision with `pix_tool_process_adr`, when it is taken.
- Never rewrite an accepted decision. Supersede it with a new one that says why.
- Never edit this file. Edit the ADR and let the next call regenerate it.
