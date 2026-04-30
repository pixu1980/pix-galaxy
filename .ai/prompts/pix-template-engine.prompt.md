---
name: "pix Template Engine Integrate"
description: "Install and integrate the pix template engine for static HTML, SSG, or SSR with sources, tests, and examples included."
argument-hint: "Mode and target (e.g. 'install in src/template-engine and configure SSG')"
agent: "agent"
---
Integrate `pix-template-engine` into the target project following the skill procedure.

References:
- [skill pix-template-engine](../skills/pix-template-engine/SKILL.md)
- [engine entry](../skills/pix-template-engine/assets/template-engine/index.js)

Execute in order:
1. Install sources + tests + examples with command:
   - `node ./.github/skills/pix-template-engine/scripts/install-template-engine.mjs --target "<project-root>" --dest "src/template-engine" --with-examples`
2. Verify required dependencies (`jsdom`) in the target.
3. Implement one concrete flow (`static-html`, `ssg`, or `ssr`).
4. Run engine tests in the target:
   - `node --test ./src/template-engine/tests/*.test.js`

Hard rules:
- Prefer the bundled DOM renderer.
- Keep source structure unchanged when possible.
- Update tests together with behavior changes.

Mandatory final output:
- installed paths
- implemented flow
- test result
- risks/residuals
