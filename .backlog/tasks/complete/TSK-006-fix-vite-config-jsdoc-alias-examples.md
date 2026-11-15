---
id: TSK-006
title: Fix: vite-config JSDoc alias examples use a relative './src' path that Vite cannot resolve
status: complete
priority: P4
tags: []
created: 2026-11-13
source: report/RPT-006
depends-on: []
started: 2026-11-15
completed: 2026-11-15
---

# Fix: vite-config JSDoc alias examples use a relative './src' path that Vite cannot resolve

## Description

### Description

Source: RPT-006.

Two JSDoc examples in `packages/vite-config/src/index.ts` (lines 15 and 219) show `alias: { '@': './src' }`. Vite passes relative alias values through as-is, so `@/util` imported from a nested file resolves relative to that file and the build fails with `[UNLOADABLE_DEPENDENCY] Could not load ./src/util` (reproduced with vite 8.3.6). The README and docs site already use `resolve(import.meta.dirname, 'src')`.

Approach: replace both JSDoc examples with the absolute form used in the README; docs-only change in the published types, so a patch changeset.

## Acceptance Criteria

- [x] ViteConfigOptions.resolve.alias JSDoc example (packages/vite-config/src/index.ts:15) uses an absolute path
- [x] createReactViteConfig JSDoc example (packages/vite-config/src/index.ts:219) uses an absolute path such as resolve(import.meta.dirname, 'src')
- [x] No remaining relative alias example in packages/vite-config/src, README or the docs site
- [x] Changeset added for @jmlweb/vite-config

## Notes

## Learnings

- LRN-010: turbo fails with Exec format error when the pnpm tools cache holds a placeholder binary
## Progress Log

- [2026-11-13] Created
- [2026-11-15] Started
- [2026-11-15] criterion 1 — evidence: rg -n "@example" packages/vite-config/src/index.ts → line 15 now reads @example { '@': resolve(import.meta.dirname, 'src') } (2026-11-15)
- [2026-11-15] criterion 2 — evidence: createReactViteConfig example imports resolve from node:path and uses '@': resolve(import.meta.dirname, 'src'); built dist/index.d.ts line 172 carries it (2026-11-15)
- [2026-11-15] criterion 3 — evidence: rg -n "alias.*['\"]\./|['\"]@['\"]: *['\"]\." packages/vite-config/src packages/vite-config/README.md apps/docs/src → 2 matches before the fix, 0 after (exit 1) (2026-11-15)
- [2026-11-15] criterion 4 — evidence: .changeset/vite-config-absolute-alias-jsdoc.md adds a patch bump for @jmlweb/vite-config (2026-11-15)
- [2026-11-15] Completed