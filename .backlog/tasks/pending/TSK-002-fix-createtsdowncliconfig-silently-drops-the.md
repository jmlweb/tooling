---
id: TSK-002
title: Fix: createTsdownCliConfig silently drops the shebang when the user sets banner
status: pending
priority: P3
tags: [tsdown-config-base, bug]
created: 2026-11-01
source: report/RPT-002
depends-on: []
---

# Fix: createTsdownCliConfig silently drops the shebang when the user sets banner

## Description

### Context

RPT-002: `createTsdownCliConfig` spreads the user's top-level options after the shebang `banner` (`packages/tsdown-config-base/src/index.ts:401-403`). A user `banner` replaces it and the CLI bin ships without `#!/usr/bin/env node`, with no warning. The README says the presets "only add defaults". `@jmlweb/tsup-config-base` has the same pattern (`packages/tsup-config-base/src/index.ts:312-314`).

### Approach

Take `banner` out of `rest` in `createTsdownCliConfig` and pass it to `resolveShebang`. Compose a banner function that prepends the shebang to the user's `js` banner for targeted entries and returns the user banner unchanged otherwise. Handle the string, object and function forms tsdown accepts. Throwing `TsdownConfigError` is the fallback if composition is not feasible.

## Acceptance Criteria

- [ ] createTsdownCliConfig with shebang enabled and a user banner emits the shebang as the first line of the targeted CLI outputs, or throws TsdownConfigError on the conflict
- [ ] A user banner (string, object or function form) is preserved for all outputs when it is combined
- [ ] Unit test covers createTsdownCliConfig with a user banner
- [ ] README documents how banner interacts with shebang
- [ ] tsup-config-base createTsupCliConfig gets the same fix or its README documents the limitation
- [ ] Changeset recorded for the affected packages

## Notes

## Learnings

## Progress Log

- [2026-11-01] Created
