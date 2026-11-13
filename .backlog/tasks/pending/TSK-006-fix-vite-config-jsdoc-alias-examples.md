---
id: TSK-006
title: Fix: vite-config JSDoc alias examples use a relative './src' path that Vite cannot resolve
status: pending
priority: P4
tags: []
created: 2026-11-13
source: report/RPT-006
depends-on: []
---

# Fix: vite-config JSDoc alias examples use a relative './src' path that Vite cannot resolve

## Description

### Description

Source: RPT-006.

Two JSDoc examples in `packages/vite-config/src/index.ts` (lines 15 and 219) show `alias: { '@': './src' }`. Vite passes relative alias values through as-is, so `@/util` imported from a nested file resolves relative to that file and the build fails with `[UNLOADABLE_DEPENDENCY] Could not load ./src/util` (reproduced with vite 8.3.6). The README and docs site already use `resolve(import.meta.dirname, 'src')`.

Approach: replace both JSDoc examples with the absolute form used in the README; docs-only change in the published types, so a patch changeset.

## Acceptance Criteria

- [ ] ViteConfigOptions.resolve.alias JSDoc example (packages/vite-config/src/index.ts:15) uses an absolute path
- [ ] createReactViteConfig JSDoc example (packages/vite-config/src/index.ts:219) uses an absolute path such as resolve(import.meta.dirname, 'src')
- [ ] No remaining relative alias example in packages/vite-config/src, README or the docs site
- [ ] Changeset added for @jmlweb/vite-config

## Notes

## Learnings

## Progress Log

- [2026-11-13] Created