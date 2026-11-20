---
id: TSK-009
title: Fix: tsconfig-internal outDir resolves to the shared config package, not each consuming package
status: pending
priority: P4
tags: []
created: 2026-11-19
source: report/RPT-009
depends-on: []
---

# Fix: tsconfig-internal outDir resolves to the shared config package, not each consuming package

## Description

### Context

From RPT-009. `outDir: "dist"` in `packages/tsconfig-internal/tsconfig.json:17` resolves against the tsconfig-internal package itself. As a result, every extending package points at `packages/tsconfig-internal/dist`. This contradicts the README claim that `outDir` resolves per package. Use `${configDir}` as `rootDir` already does.

## Acceptance Criteria

- [ ] packages/tsconfig-internal/tsconfig.json sets outDir to ${configDir}/dist
- [ ] tsc --showConfig -p packages/vitest-config/tsconfig.json reports outDir ./dist
- [ ] packages/tsconfig-internal/README.md configuration table shows the new outDir value
- [ ] pnpm -r --filter ./packages/** build still succeeds and each package writes its own dist/

## Notes

## Learnings

## Progress Log

- [2026-11-19] Created