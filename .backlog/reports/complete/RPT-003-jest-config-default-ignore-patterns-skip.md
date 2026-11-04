---
id: RPT-003
title: jest-config default ignore patterns skip every test when an ancestor directory is named build, dist or .cache
type: bug
severity: medium
status: triaged
created: 2026-11-04
triaged: 2026-11-04
task-id: TSK-003
---

## Location

- `packages/jest-config/src/index.ts:107-113`: default `testPathIgnorePatterns` is `['/node_modules/', '/dist/', '/build/', '/.git/', '/.cache/']`
- `packages/jest-config/src/index.ts:123-132`: default `coveragePathIgnorePatterns` has the same unanchored `/node_modules/`, `/dist/`, `/build/`, `/coverage/`
- `packages/jest-config/README.md:87`: documents these defaults

## Problem

Jest matches these regexes against the absolute file path. They are not anchored to `<rootDir>`. When any ancestor directory of the project is named `build`, `dist`, `.git` or `.cache` (for example a Docker `WORKDIR /build`, or a CI workspace under `~/.cache/`), every test file matches an ignore pattern. Jest then reports "No tests found" and exits 1. The coverage patterns exclude every source file in the same situation, so coverage is empty.

## Reproduction

Same project (one passing `src/a.test.js`, `jest.config.cjs` spreading `@jmlweb/jest-config` from `packages/jest-config/dist/index.js`, `transform: {}`), run with jest 30 from two locations:

```text
== /tmp/jt-plain
Tests:       1 passed, 1 total
== /tmp/build/jt-proj
No tests found, exiting with code 1
  testPathIgnorePatterns: /node_modules/, /dist/, /build/, /.git/, /.cache/ - 0 matches
```

## Suggested fix

Prefix the default patterns with `<rootDir>` (e.g. `'<rootDir>/build/'`), as Jest's docs recommend, and keep `/node_modules/` unanchored only if nested node_modules must stay ignored.
