---
id: TSK-005
title: Fix: createJestConfig default transform drops babel-jest for the .js/.jsx tests it matches
status: pending
priority: P3
tags: []
created: 2026-11-11
source: report/RPT-005
depends-on: []
---

# Fix: createJestConfig default transform drops babel-jest for the .js/.jsx tests it matches

## Description

Source: RPT-005.

`createJestConfig()` matches `.js`/`.jsx` tests (`packages/jest-config/src/index.ts:105-106`) but its default `transform` (`:138-148`) only maps TypeScript to ts-jest. Any explicit `transform` replaces Jest's implicit babel-jest default, so JS tests lose `jest.mock` hoisting and Babel config. Reproduced: a hoisting test passes under plain Jest and fails under `createJestConfig()` (`Expected: "mocked"`, `Received: "real"`).

Approach: add a `'^.+\\.jsx?$': 'babel-jest'` entry to the default transform (babel-jest ships with jest, verify it resolves from consumers or declare it as needed), add a regression test following LRN-005 and LRN-007, update README and JSDoc.

## Acceptance Criteria

- [ ] Default createJestConfig() transform also handles .js/.jsx files with babel-jest
- [ ] A node:test regression test in packages/jest-config/test/ runs a .js test that relies on jest.mock hoisting and passes
- [ ] Passing a custom transform still replaces the default entirely
- [ ] packages/jest-config/README.md transform row and JSDoc @default describe the JS entry
- [ ] Changeset added for @jmlweb/jest-config

## Notes

## Learnings

## Progress Log

- [2026-11-11] Created