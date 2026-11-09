---
id: TSK-004
title: Fix: createTsupCliConfig with selective shebang drops array entries that share a basename
status: complete
priority: P4
tags: []
created: 2026-11-04
source: report/RPT-004
depends-on: []
started: 2026-11-09
completed: 2026-11-09
---

# Fix: createTsupCliConfig with selective shebang drops array entries that share a basename

## Description

### Context

RPT-004: `normalizeEntry` (`packages/tsup-config-base/src/index.ts:385-396`) keys array entries by basename. On the selective-shebang path (`:333-345`), `createTsupCliConfig({ entry: ['src/cli.ts', 'src/admin/cli.ts'], shebang: 'cli' })` returns `entry: {"cli":"src/admin/cli.ts"}`. `src/cli.ts` is silently dropped, and nested entries are flattened to `dist/<basename>.js`.

### Approach

Key array entries by their path relative to the common source directory without extension (e.g. `admin/cli`) and throw on any remaining collision. If that is not feasible, throw when an array entry is combined with a selective shebang and point to the object form. Coordinate with TSK-002, which edits the same function.

## Acceptance Criteria

- [x] createTsupCliConfig with an array entry and a selective shebang keeps every entry, or throws on a name collision instead of dropping one
- [x] Array entries on the selective-shebang path keep the same output paths tsup produces for the array form
- [x] Unit test covers entries [src/cli.ts, src/admin/cli.ts] with shebang cli
- [x] README documents how array entries are named for the shebang option
- [x] Changeset recorded for @jmlweb/tsup-config-base

## Notes

## Learnings

- LRN-008: tsup names array entries relative to their common directory
- LRN-009: oxlint no-unnecessary-condition rejects undefined checks on Record index
## Progress Log

- [2026-11-04] Created
- [2026-11-09] Started
- [2026-11-09] criterion 1 — evidence: pnpm --filter @jmlweb/tsup-config-base test → ['src/cli.ts','src/admin/cli.ts'] + shebang 'cli' keeps {cli} and {'admin/cli'}; same-name entries (src/cli.ts + src/cli.js) throw TsupConfigError; unfixed source returned {"cli":"src/admin/cli.ts"} (2026-11-09)
- [2026-11-09] criterion 2 — evidence: test 'produces the same output paths as the array form' runs real tsup builds in a child process → array form and selective-shebang form both emit [admin/cli.js, cli.js] (2026-11-09)
- [2026-11-09] criterion 3 — evidence: packages/tsup-config-base/test/index.test.mjs added with a test script 'node --test test/*.test.mjs' → 10 pass, 0 fail (2026-11-09)
- [2026-11-09] criterion 4 — evidence: packages/tsup-config-base/README.md createTsupCliConfig section documents array entry naming and the errors; pnpm docs:generate updated build-tools/base.mdx; node scripts/validate-docs.mjs → all checks passed (2026-11-09)
- [2026-11-09] criterion 5 — evidence: .changeset/tsup-cli-array-entry-names.md → patch for @jmlweb/tsup-config-base (2026-11-09)
- [2026-11-09] Completed