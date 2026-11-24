---
id: TSK-010
title: Fix: eslint-config-base crashes on every .js/.mjs/.cjs file because type-checked presets are not scoped to TypeScript
status: complete
priority: P2
tags: []
created: 2026-11-21
source: report/RPT-010
depends-on: []
started: 2026-11-23
completed: 2026-11-23
---

# Fix: eslint-config-base crashes on every .js/.mjs/.cjs file because type-checked presets are not scoped to TypeScript

## Description

### Context

From RPT-010. `packages/eslint-config-base/src/index.ts:16-17` spreads `strictTypeChecked` and `stylisticTypeChecked` with no `files` restriction. `projectService` is only set for `**/*.ts` and `**/*.tsx`. ESLint throws "You have used a rule which requires type information" on any JavaScript file, including the consumer's own `eslint.config.js`. eslint-config-node and eslint-config-react inherit the crash.

### Approach

Scope the type-checked presets to `**/*.ts` and `**/*.tsx`, or append `tseslint.configs.disableTypeChecked` for `**/*.{js,mjs,cjs}`. Follow LRN-005 for the test setup.

## Acceptance Criteria

- [x] Linting a .js, .mjs and .cjs file with @jmlweb/eslint-config-base reports base-js results instead of throwing the missing type information error
- [x] Type-aware rules still run on .ts and .tsx files
- [x] A node:test regression test in packages/eslint-config-base lints a .js file with the built config and asserts it does not throw
- [x] The disableTypeChecked workaround is removed from apps/test-app/eslint.config.mjs and its lint still passes
- [x] Changeset added for @jmlweb/eslint-config-base

## Notes

## Learnings

- LRN-015: Scope typescript-eslint type-checked presets with files ?? TS globs
- LRN-016: turbo run cannot spawn tasks on the hustle box; build with pnpm -r
## Progress Log

- [2026-11-21] Created
- [2026-11-23] Started
- [2026-11-23] criterion 1 — evidence: (packages/eslint-config-base) pnpm test → 3 JS subtests (plain.js, module.mjs, common.cjs) pass with fatalErrorCount 0 and no-debugger reported; failed before fix with 'requires type information' (2026-11-23)
- [2026-11-23] criterion 2 — evidence: (packages/eslint-config-base) pnpm test → .ts and .tsx subtests report @typescript-eslint/no-floating-promises (2026-11-23)
- [2026-11-23] criterion 3 — evidence: packages/eslint-config-base/test/index.test.mjs + test script; node --test test/*.test.mjs → pass 7 fail 0 (4 failed before fix) (2026-11-23)
- [2026-11-23] criterion 4 — evidence: workaround removed; apps/test-app npx eslint . --ignore-pattern 'fixtures/**' → exit 0, npx eslint fixtures/valid/javascript.js → exit 0 (crashed on main), pnpm test → All 5 test suites passed (2026-11-23)
- [2026-11-23] criterion 5 — evidence: .changeset/scope-type-checked-presets.md patch for @jmlweb/eslint-config-base (2026-11-23)
- [2026-11-23] Completed