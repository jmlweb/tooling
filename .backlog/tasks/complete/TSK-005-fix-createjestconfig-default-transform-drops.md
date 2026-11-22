---
id: TSK-005
title: Fix: createJestConfig default transform drops babel-jest for the .js/.jsx tests it matches
status: complete
priority: P3
tags: []
created: 2026-11-11
source: report/RPT-005
depends-on: []
started: 2026-11-21
completed: 2026-11-21
---

# Fix: createJestConfig default transform drops babel-jest for the .js/.jsx tests it matches

## Description

Source: RPT-005.

`createJestConfig()` matches `.js`/`.jsx` tests (`packages/jest-config/src/index.ts:105-106`) but its default `transform` (`:138-148`) only maps TypeScript to ts-jest. Any explicit `transform` replaces Jest's implicit babel-jest default, so JS tests lose `jest.mock` hoisting and Babel config. Reproduced: a hoisting test passes under plain Jest and fails under `createJestConfig()` (`Expected: "mocked"`, `Received: "real"`).

Approach: add a `'^.+\\.jsx?$': 'babel-jest'` entry to the default transform (babel-jest ships with jest, verify it resolves from consumers or declare it as needed), add a regression test following LRN-005 and LRN-007, update README and JSDoc.

## Acceptance Criteria

- [x] Default createJestConfig() transform also handles .js/.jsx files with babel-jest — evidence: node --test test/*.test.mjs: default transform maps ^.+\.jsx?$ to babel-jest (failed before fix, passes after) (2026-11-21)
- [x] A node:test regression test in packages/jest-config/test/ runs a .js test that relies on jest.mock hoisting and passes — evidence: node --test test/*.test.mjs: hoists jest.mock above require in .js tests (failed before: Received "real"; passes after, 24/0) (2026-11-21)
- [x] Passing a custom transform still replaces the default entirely — evidence: node --test test/*.test.mjs: a custom transform replaces the default entirely → pass (2026-11-21)
- [x] packages/jest-config/README.md transform row and JSDoc @default describe the JS entry — evidence: README transform row and JSDoc @default name babel-jest; pnpm validate:docs → exit 0 (2026-11-21)
- [x] Changeset added for @jmlweb/jest-config — evidence: .changeset/jest-config-babel-jest-transform.md (minor) (2026-11-21)

## Notes

## Learnings

- LRN-014: babel-jest only instruments files inside process.cwd(): chdir into temp projects for runCLI coverage tests
## Progress Log

- [2026-11-11] Created
- [2026-11-21] Started
- [2026-11-21] criterion 1 — evidence: node --test test/*.test.mjs (packages/jest-config), subtest 'handles .js and .jsx files with babel-jest' asserts transform['^.+\.jsx?$'] === 'babel-jest' → failed before the fix (actual undefined), passes after (2026-11-21)
- [2026-11-21] criterion 2 — evidence: node --test test/*.test.mjs, subtest 'hoists jest.mock above require in .js tests' runs a temp .js test via runCLI → failed before the fix (Expected: "mocked", Received: "real"), passes after; full file 24 pass / 0 fail (2026-11-21)
- [2026-11-21] criterion 3 — evidence: node --test test/*.test.mjs, test 'a custom transform replaces the default entirely' deepEquals the custom transform → pass (regression guard, passed before the fix too) (2026-11-21)
- [2026-11-21] criterion 4 — evidence: git diff packages/jest-config/README.md packages/jest-config/src/index.ts → README transform row, extending note, install and peer list name babel-jest; JSDoc @default includes '^.+\.jsx?$': 'babel-jest'; docs site page mirrored; pnpm validate:docs → exit 0 (2026-11-21)
- [2026-11-21] criterion 5 — evidence: .changeset/jest-config-babel-jest-transform.md ('@jmlweb/jest-config': minor, notes new babel-jest peer) (2026-11-21)
- [2026-11-21] Completed
- [2026-11-21] Attached inline evidence to criteria 1-5; integration suite (test-testing-configs) and docs build pass locally