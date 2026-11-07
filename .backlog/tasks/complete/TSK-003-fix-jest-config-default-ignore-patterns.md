---
id: TSK-003
title: Fix: jest-config default ignore patterns skip every test when an ancestor directory is named build, dist or .cache
status: complete
priority: P3
tags: []
created: 2026-11-04
source: report/RPT-003
depends-on: []
started: 2026-11-07
completed: 2026-11-07
---

# Fix: jest-config default ignore patterns skip every test when an ancestor directory is named build, dist or .cache

## Description

### Context

RPT-003: the default `testPathIgnorePatterns` (`packages/jest-config/src/index.ts:107-113`) and `coveragePathIgnorePatterns` (`:123-132`) are unanchored regexes. Jest matches them against absolute paths, so a project under any directory named `build`, `dist`, `.git` or `.cache` gets "No tests found, exiting with code 1" and empty coverage. Reproduced with jest 30 in `/tmp/build/jt-proj`; the same project passes in `/tmp/jt-plain`.

### Approach

Prefix the default patterns with `<rootDir>` (e.g. `'<rootDir>/build/'`). Keep nested `node_modules` ignored. Update the README defaults table (`packages/jest-config/README.md:87`).

## Acceptance Criteria

- [x] Default testPathIgnorePatterns and coveragePathIgnorePatterns are anchored to <rootDir> so ancestor directories named build, dist, .git, .cache or coverage do not exclude project files
- [x] A regression test runs the default config from a project inside an ancestor directory named build and finds its tests
- [x] packages/jest-config/README.md documents the new default patterns
- [x] Changeset recorded for @jmlweb/jest-config

## Notes

## Learnings

- LRN-006: Jest always skips paths containing /.git/, whatever testPathIgnorePatterns says
- LRN-007: Running jest runCLI on a temp project: resolve ts-jest absolutely and drop global-only options
## Progress Log

- [2026-11-04] Created
- [2026-11-07] Started
- [2026-11-07] criterion 1 — evidence: node --test packages/jest-config/test/index.test.mjs → 'default ignore patterns are anchored to rootDir' passes for build, dist, .git, .cache, coverage ancestors (pre-fix: 17 of 20 fail) (2026-11-07)
- [2026-11-07] criterion 2 — evidence: node --test packages/jest-config/test/index.test.mjs → real jest runCLI inside <tmp>/build/project finds and runs 1 test and collects coverage (also dist, .cache, coverage); 20 pass, 0 fail (2026-11-07)
- [2026-11-07] criterion 3 — evidence: packages/jest-config/README.md defaults table lists <rootDir>-anchored patterns; pnpm docs:generate synced apps/docs jest.mdx; pnpm validate:docs → passed (2026-11-07)
- [2026-11-07] criterion 4 — evidence: .changeset/anchor-jest-ignore-patterns.md → '@jmlweb/jest-config': patch (2026-11-07)
- [2026-11-07] Completed