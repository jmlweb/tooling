---
id: TSK-004
title: Fix: createTsupCliConfig with selective shebang drops array entries that share a basename
status: pending
priority: P4
tags: []
created: 2026-11-04
source: report/RPT-004
depends-on: []
---

# Fix: createTsupCliConfig with selective shebang drops array entries that share a basename

## Description

### Context

RPT-004: `normalizeEntry` (`packages/tsup-config-base/src/index.ts:385-396`) keys array entries by basename. On the selective-shebang path (`:333-345`), `createTsupCliConfig({ entry: ['src/cli.ts', 'src/admin/cli.ts'], shebang: 'cli' })` returns `entry: {"cli":"src/admin/cli.ts"}`. `src/cli.ts` is silently dropped, and nested entries are flattened to `dist/<basename>.js`.

### Approach

Key array entries by their path relative to the common source directory without extension (e.g. `admin/cli`) and throw on any remaining collision. If that is not feasible, throw when an array entry is combined with a selective shebang and point to the object form. Coordinate with TSK-002, which edits the same function.

## Acceptance Criteria

- [ ] createTsupCliConfig with an array entry and a selective shebang keeps every entry, or throws on a name collision instead of dropping one
- [ ] Array entries on the selective-shebang path keep the same output paths tsup produces for the array form
- [ ] Unit test covers entries [src/cli.ts, src/admin/cli.ts] with shebang cli
- [ ] README documents how array entries are named for the shebang option
- [ ] Changeset recorded for @jmlweb/tsup-config-base

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created