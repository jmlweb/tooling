---
id: TSK-002
title: Fix: createTsdownCliConfig silently drops the shebang when the user sets banner
status: complete
priority: P3
tags: [tsdown-config-base, bug]
created: 2026-11-01
source: report/RPT-002
depends-on: []
started: 2026-11-04
completed: 2026-11-04
---

# Fix: createTsdownCliConfig silently drops the shebang when the user sets banner

## Description

### Context

RPT-002: `createTsdownCliConfig` spreads the user's top-level options after the shebang `banner` (`packages/tsdown-config-base/src/index.ts:401-403`). A user `banner` replaces it and the CLI bin ships without `#!/usr/bin/env node`, with no warning. The README says the presets "only add defaults". `@jmlweb/tsup-config-base` has the same pattern (`packages/tsup-config-base/src/index.ts:312-314`).

### Approach

Take `banner` out of `rest` in `createTsdownCliConfig` and pass it to `resolveShebang`. Compose a banner function that prepends the shebang to the user's `js` banner for targeted entries and returns the user banner unchanged otherwise. Handle the string, object and function forms tsdown accepts. Throwing `TsdownConfigError` is the fallback if composition is not feasible.

## Acceptance Criteria

- [x] createTsdownCliConfig with shebang enabled and a user banner emits the shebang as the first line of the targeted CLI outputs, or throws TsdownConfigError on the conflict
- [x] A user banner (string, object or function form) is preserved for all outputs when it is combined
- [x] Unit test covers createTsdownCliConfig with a user banner
- [x] README documents how banner interacts with shebang
- [x] tsup-config-base createTsupCliConfig gets the same fix or its README documents the limitation
- [x] Changeset recorded for the affected packages

## Notes

## Learnings

- LRN-003: tsdown applies a string banner to js, css and dts outputs alike
- LRN-004: pnpm 12 shebang-less .tools shim breaks turbo task spawning on this host
- LRN-005: Unit tests in config packages: node:test .mjs under test/, not .ts in src
## Progress Log

- [2026-11-01] Created
- [2026-11-04] Started
- [2026-11-04] criterion 1 — evidence: node --test test/*.test.mjs (packages/tsdown-config-base) → real tsdown build with shebang 'cli' + banner: dist/cli.js line 1 is the shebang, line 2 the user banner; 22/22 pass, 11 fail on the unfixed source (2026-11-04)
- [2026-11-04] criterion 2 — evidence: node --test test/*.test.mjs → string, object, function and function-returning-string banners kept on targeted js, cli.d.ts and non-shebang index.js; also kept with shebang: false and via deprecated options (2026-11-04)
- [2026-11-04] criterion 3 — evidence: packages/tsdown-config-base/test/index.test.mjs added, pnpm test script 'node --test test/*.test.mjs' → 22 pass (2026-11-04)
- [2026-11-04] criterion 4 — evidence: packages/tsdown-config-base/README.md createTsdownCliConfig section documents banner + shebang; docs mdx regenerated; node scripts/validate-docs.mjs → all checks passed (2026-11-04)
- [2026-11-04] criterion 5 — evidence: packages/tsup-config-base/README.md documents that a banner in options replaces the shebang and how to keep both (2026-11-04)
- [2026-11-04] criterion 6 — evidence: .changeset/keep-shebang-with-user-banner.md → patch for @jmlweb/tsdown-config-base and @jmlweb/tsup-config-base (2026-11-04)
- [2026-11-04] Completed
- [2026-11-04] re-verified on clean clone: pnpm --filter @jmlweb/tsdown-config-base test → 22 pass (16 fail on unfixed src/index.ts); turbo build, test, lint, format:check, lint:root → all successful; syncpack, validate:docs, validate:packages → pass (2026-11-04)
