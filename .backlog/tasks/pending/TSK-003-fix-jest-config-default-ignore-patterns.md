---
id: TSK-003
title: Fix: jest-config default ignore patterns skip every test when an ancestor directory is named build, dist or .cache
status: pending
priority: P3
tags: []
created: 2026-11-04
source: report/RPT-003
depends-on: []
---

# Fix: jest-config default ignore patterns skip every test when an ancestor directory is named build, dist or .cache

## Description

### Context

RPT-003: the default `testPathIgnorePatterns` (`packages/jest-config/src/index.ts:107-113`) and `coveragePathIgnorePatterns` (`:123-132`) are unanchored regexes. Jest matches them against absolute paths, so a project under any directory named `build`, `dist`, `.git` or `.cache` gets "No tests found, exiting with code 1" and empty coverage. Reproduced with jest 30 in `/tmp/build/jt-proj`; the same project passes in `/tmp/jt-plain`.

### Approach

Prefix the default patterns with `<rootDir>` (e.g. `'<rootDir>/build/'`). Keep nested `node_modules` ignored. Update the README defaults table (`packages/jest-config/README.md:87`).

## Acceptance Criteria

- [ ] Default testPathIgnorePatterns and coveragePathIgnorePatterns are anchored to <rootDir> so ancestor directories named build, dist, .git, .cache or coverage do not exclude project files
- [ ] A regression test runs the default config from a project inside an ancestor directory named build and finds its tests
- [ ] packages/jest-config/README.md documents the new default patterns
- [ ] Changeset recorded for @jmlweb/jest-config

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created