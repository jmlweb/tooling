---
id: TSK-008
title: Fix: tsconfig-nextjs @/* path alias resolves inside node_modules, not the project root
status: pending
priority: P2
tags: []
created: 2026-11-17
source: report/RPT-008
depends-on: []
---

# Fix: tsconfig-nextjs @/* path alias resolves inside node_modules, not the project root

## Description

### Context

From RPT-008. The shared `paths` entry `"@/*": ["./*"]` resolves relative to `node_modules/@jmlweb/tsconfig-nextjs/`, so the documented `@/*` alias fails with TS2307 in consumer projects. A repro and the verified `${configDir}` fix are in the report.

## Acceptance Criteria

- [ ] packages/tsconfig-nextjs/tsconfig.json maps @/* to ${configDir}/* so it resolves against the consumer config directory
- [ ] A scratch consumer extending @jmlweb/tsconfig-nextjs type-checks an @/ import with tsc (exit 0)
- [ ] The TypeScript >=5.5 requirement for ${configDir} is reflected in the peerDependencies range or the README
- [ ] README Configuration Details table matches the new paths value
- [ ] A changeset is added for @jmlweb/tsconfig-nextjs

## Notes

## Learnings

## Progress Log

- [2026-11-17] Created