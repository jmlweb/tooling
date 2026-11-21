---
id: TSK-010
title: Fix: eslint-config-base crashes on every .js/.mjs/.cjs file because type-checked presets are not scoped to TypeScript
status: pending
priority: P2
tags: []
created: 2026-11-21
source: report/RPT-010
depends-on: []
---

# Fix: eslint-config-base crashes on every .js/.mjs/.cjs file because type-checked presets are not scoped to TypeScript

## Description

### Context

From RPT-010. `packages/eslint-config-base/src/index.ts:16-17` spreads `strictTypeChecked` and `stylisticTypeChecked` with no `files` restriction. `projectService` is only set for `**/*.ts` and `**/*.tsx`. ESLint throws "You have used a rule which requires type information" on any JavaScript file, including the consumer's own `eslint.config.js`. eslint-config-node and eslint-config-react inherit the crash.

### Approach

Scope the type-checked presets to `**/*.ts` and `**/*.tsx`, or append `tseslint.configs.disableTypeChecked` for `**/*.{js,mjs,cjs}`. Follow LRN-005 for the test setup.

## Acceptance Criteria

- [ ] Linting a .js, .mjs and .cjs file with @jmlweb/eslint-config-base reports base-js results instead of throwing the missing type information error
- [ ] Type-aware rules still run on .ts and .tsx files
- [ ] A node:test regression test in packages/eslint-config-base lints a .js file with the built config and asserts it does not throw
- [ ] The disableTypeChecked workaround is removed from apps/test-app/eslint.config.mjs and its lint still passes
- [ ] Changeset added for @jmlweb/eslint-config-base

## Notes

## Learnings

## Progress Log

- [2026-11-21] Created