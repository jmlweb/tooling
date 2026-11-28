---
id: TSK-009
title: Fix: tsconfig-internal outDir resolves to the shared config package, not each consuming package
status: complete
priority: P4
tags: []
created: 2026-11-19
source: report/RPT-009
depends-on: []
started: 2026-11-27
completed: 2026-11-27
---

# Fix: tsconfig-internal outDir resolves to the shared config package, not each consuming package

## Description

### Context

From RPT-009. `outDir: "dist"` in `packages/tsconfig-internal/tsconfig.json:17` resolves against the tsconfig-internal package itself. As a result, every extending package points at `packages/tsconfig-internal/dist`. This contradicts the README claim that `outDir` resolves per package. Use `${configDir}` as `rootDir` already does.

## Acceptance Criteria

- [x] packages/tsconfig-internal/tsconfig.json sets outDir to ${configDir}/dist
- [x] tsc --showConfig -p packages/vitest-config/tsconfig.json reports outDir ./dist
- [x] packages/tsconfig-internal/README.md configuration table shows the new outDir value
- [x] pnpm -r --filter ./packages/** build still succeeds and each package writes its own dist/

## Notes

## Learnings

- LRN-021: Extended tsconfig relative paths resolve to the base file; use ${configDir}
- LRN-022: turbo spawn fails locally with Exec format error; verify via pnpm -r
## Progress Log

- [2026-11-19] Created
- [2026-11-27] Started
- [2026-11-27] criterion 1 — evidence: rg outDir packages/tsconfig-internal/tsconfig.json → "outDir": "${configDir}/dist"; pnpm --filter @jmlweb/tsconfig-internal test → 2 pass, 0 fail (failed with actual ../../dist before fix) (2026-11-27)
- [2026-11-27] criterion 2 — evidence: (cd packages/vitest-config && tsc --showConfig -p tsconfig.json | jq .compilerOptions.outDir) → "./dist" (was "../tsconfig-internal/dist") (2026-11-27)
- [2026-11-27] criterion 3 — evidence: rg outDir packages/tsconfig-internal/README.md → table row `${configDir}/dist` (2026-11-27)
- [2026-11-27] criterion 4 — evidence: pnpm -r --filter "./packages/**" build → exit 0; every package with a build script has its own dist/, packages/tsconfig-internal/dist absent (2026-11-27)
- [2026-11-27] Completed