# Manual npm Security Setup Guide

This guide lists the one-time steps to perform on GitHub and npmjs.com
to complete the supply-chain hardening of pix-galaxy. The CI workflows and
`pnpm` configuration are already updated — these actions require
administrative access to the web settings.

---

## 1. GitHub — Tag protection (admins only)

Prevents anyone except repository admins from creating tags. pix-galaxy
releases start from a tag (`@pix-galaxy/<pkg>@<version>`), so protecting
tags is critical to prevent unauthorized releases.

**Direct URL:**
https://github.com/pixu1980/pix-galaxy/settings/rules

**Steps:**

1. Click **New ruleset** → select **New tag ruleset**
2. Fill in the fields:

   | Field | Value |
   |---|---|
   | Ruleset Name | `Tags only by admins` |
   | Enforcement status | `Active` |
   | Bypass list | `Repository admins` |
   | Target tags | `Include all tags` |

3. Under **Tag rules**, enable **Restrict creations**
4. Click **Create**

Verify: try creating a tag from a non-admin account — it should be blocked.

---

## 2. GitHub — Immutable Releases

Prevents published releases from being modified or deleted.

**Direct URL:**
https://github.com/pixu1980/pix-galaxy/settings

(scroll down to the **Releases** section)

**Steps:**

1. On the repo's General Settings page (make sure you're on the
   _General_ tab at the top-left, not the sidebar menu)
2. Scroll down to the **Releases** section
3. Toggle on **Immutable Releases**

---

## 3. GitHub Organization — Mandatory 2FA

Requires all organization members to have two-factor authentication enabled.

**Direct URL:**
https://github.com/organizations/pixu1980/settings/security

**Steps:**

1. Go to the **Authentication security** section
2. Enable **Require two-factor authentication for everyone**
3. GitHub will notify members who haven't set up 2FA yet

Note: even if you're the only member and already have 2FA, this option
is still recommended as enforcement for future contributors.

---

## 4. npm — Publishing access for each public package

For every published `@pix-galaxy/*` package:

1. Revoke all existing publish tokens (so no stolen token can be used
   to publish)
2. Require 2FA for publishing (local publish with interactive `npm login`
   already satisfies this)

### Public package list

| Package | Settings URL |
|---|---|
| `@pix-galaxy/pix-a11y-panel` | https://www.npmjs.com/package/@pix-galaxy/pix-a11y-panel/settings |
| `@pix-galaxy/pix-accent-color-selector` | https://www.npmjs.com/package/@pix-galaxy/pix-accent-color-selector/settings |
| `@pix-galaxy/pix-color` | https://www.npmjs.com/package/@pix-galaxy/pix-color/settings |
| `@pix-galaxy/pix-color-scheme-selector` | https://www.npmjs.com/package/@pix-galaxy/pix-color-scheme-selector/settings |
| `@pix-galaxy/pix-command` | https://www.npmjs.com/package/@pix-galaxy/pix-command/settings |
| `@pix-galaxy/pix-highlighter` | https://www.npmjs.com/package/@pix-galaxy/pix-highlighter/settings |
| `@pix-galaxy/pix-recorder` | https://www.npmjs.com/package/@pix-galaxy/pix-recorder/settings |
| `@pix-galaxy/pix-sortable` | https://www.npmjs.com/package/@pix-galaxy/pix-sortable/settings |
| `@pix-galaxy/pix-splitter` | https://www.npmjs.com/package/@pix-galaxy/pix-splitter/settings |
| `@pix-galaxy/pix-toast` | https://www.npmjs.com/package/@pix-galaxy/pix-toast/settings |
| `@pix-galaxy/pix-vanilla-reactive` | https://www.npmjs.com/package/@pix-galaxy/pix-vanilla-reactive/settings |

### Steps (same for every package):

1. Open the package settings URL
2. In the **Publishing access** section:
   - Disable any existing tokens (if there's a token list,
     revoke them manually)
   - Enable **Require two-factor authentication or automation tokens
     for publish**
3. Do **not** enable Trusted Publishing — releases continue locally
   via `pnpm release`

---

## 5. Final verification

After completing the 4 steps above, run a dry-run to confirm the
pipeline works:

```bash
# Test the release mechanism (without publishing)
pnpm release:dry

# Test the CI quality gate (push a dummy tag, then delete it)
git tag @pix-galaxy/pix-toast@0.0.0-test
git push origin @pix-galaxy/pix-toast@0.0.0-test
# check that the release.yml workflow runs on GitHub Actions
git push origin --delete @pix-galaxy/pix-toast@0.0.0-test
```

---

## References

- [The secure way to release an npm package in 2026](https://evilmartians.com/chronicles/the-secure-way-to-release-an-npm-package-in-2026) — Evil Martians
- [npm Trusted Publishing docs](https://docs.npmjs.com/generating-provenance-statements)
- [npm Staged Publishing docs](https://docs.npmjs.com/managing-packages/staged-publishing)
- [GitHub Immutable Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases#immutable-releases)
