---
id: TSK-005
title: Fix: createJestConfig default transform drops babel-jest for the .js/.jsx tests it matches
status: complete
priority: P3
tags: []
created: 2026-11-11
source: report/RPT-005
depends-on: []
started: 2026-11-13
completed: 2026-11-13
---

# Fix: createJestConfig default transform drops babel-jest for the .js/.jsx tests it matches

## Description

Source: RPT-005.

`createJestConfig()` matches `.js`/`.jsx` tests (`packages/jest-config/src/index.ts:105-106`) but its default `transform` (`:138-148`) only maps TypeScript to ts-jest. Any explicit `transform` replaces Jest's implicit babel-jest default, so JS tests lose `jest.mock` hoisting and Babel config. Reproduced: a hoisting test passes under plain Jest and fails under `createJestConfig()` (`Expected: "mocked"`, `Received: "real"`).

Approach: add a `'^.+\\.jsx?$': 'babel-jest'` entry to the default transform (babel-jest ships with jest, verify it resolves from consumers or declare it as needed), add a regression test following LRN-005 and LRN-007, update README and JSDoc.

## Acceptance Criteria

- [x] Default createJestConfig() transform also handles .js/.jsx files with babel-jest
- [x] A node:test regression test in packages/jest-config/test/ runs a .js test that relies on jest.mock hoisting and passes
- [x] Passing a custom transform still replaces the default entirely
- [x] packages/jest-config/README.md transform row and JSDoc @default describe the JS entry
- [x] Changeset added for @jmlweb/jest-config

## Notes

## Learnings

- LRN-010: babel-jest only collects coverage when Jest runs from the project directory
- LRN-011: pnpm consumers cannot resolve an explicit 'babel-jest' transform unless they depend on it
## Progress Log

- [2026-11-11] Created
- [2026-11-13] Started
- [2026-11-13] criterion 1 — evidence: pnpm --filter @jmlweb/jest-config test → 'handles .js and .jsx files with babel-jest' passes, transform['^.+\.jsx?$'] === 'babel-jest' (2026-11-13)
- [2026-11-13] criterion 2 — evidence: pnpm --filter @jmlweb/jest-config test → 'hoists jest.mock in .js tests' passes (25/25); against the original src it fails with Expected: "mocked", Received: "real" (2026-11-13)
- [2026-11-13] criterion 3 — evidence: pnpm --filter @jmlweb/jest-config test → 'a custom transform replaces the default entirely' passes (deepEqual to the custom map, no ts-jest or babel-jest keys) (2026-11-13)
- [2026-11-13] criterion 4 — evidence: README transform row, install, peer and extending sections plus JSDoc @default list babel-jest for .js/.jsx; jest.mdx regenerated; pnpm validate:docs → all checks passed (2026-11-13)
- [2026-11-13] criterion 5 — evidence: .changeset/jest-config-babel-jest-transform.md → '@jmlweb/jest-config': minor (new required peer babel-jest) (2026-11-13)
- [2026-11-13] Completed