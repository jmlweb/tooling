---
id: TSK-008
title: Fix: tsconfig-nextjs @/* path alias resolves inside node_modules, not the project root
status: complete
priority: P2
tags: []
created: 2026-11-17
source: report/RPT-008
depends-on: []
started: 2026-11-19
completed: 2026-11-19
---

# Fix: tsconfig-nextjs @/* path alias resolves inside node_modules, not the project root

## Description

### Context

From RPT-008. The shared `paths` entry `"@/*": ["./*"]` resolves relative to `node_modules/@jmlweb/tsconfig-nextjs/`, so the documented `@/*` alias fails with TS2307 in consumer projects. A repro and the verified `${configDir}` fix are in the report.

## Acceptance Criteria

- [x] packages/tsconfig-nextjs/tsconfig.json maps @/* to ${configDir}/* so it resolves against the consumer config directory — evidence: packages/tsconfig-nextjs/tsconfig.json:13 maps @/* to ${configDir}/* (2026-11-19)
- [x] A scratch consumer extending @jmlweb/tsconfig-nextjs type-checks an @/ import with tsc (exit 0) — evidence: integration Test 6 (npx tsc -p tsconfig.alias.json in packed consumer) → TS2307 before fix, exit 0 after (2026-11-19)
- [x] The TypeScript >=5.5 requirement for ${configDir} is reflected in the peerDependencies range or the README — evidence: peerDependencies typescript >=5.5.0 plus README Requirements note; pnpm syncpack:check → no issues (2026-11-19)
- [x] README Configuration Details table matches the new paths value — evidence: README paths row = { "@/*": ["${configDir}/*"] }; docs regenerated; pnpm format:check → clean (2026-11-19)
- [x] A changeset is added for @jmlweb/tsconfig-nextjs — evidence: .changeset/fix-tsconfig-nextjs-path-alias.md (patch) (2026-11-19)

## Notes

## Learnings

- LRN-012: Shared tsconfig paths resolve against the declaring file; use ${configDir} (TS >=5.5)
- LRN-013: Local verification on hustle: turbo spawn fails and NODE_ENV=production breaks React tests
## Progress Log

- [2026-11-17] Created
- [2026-11-19] Started
- [2026-11-19] criterion 1 — evidence: rg -n configDir packages/tsconfig-nextjs/tsconfig.json → line 13 "@/*": ["${configDir}/*"] (2026-11-19)
- [2026-11-19] criterion 2 — evidence: new integration Test 6 in apps/integration-tests/scripts/test-tsconfig.mjs runs tsc on a packed consumer importing @/lib/answer → TS2307 before fix, "@/* alias resolves against the consumer project root" (exit 0) after (2026-11-19)
- [2026-11-19] criterion 3 — evidence: packages/tsconfig-nextjs/package.json peer typescript ">=5.5.0", README Requirements notes >=5.5.0 for ${configDir}; pnpm syncpack:check → no issues (2026-11-19)
- [2026-11-19] criterion 4 — evidence: README Configuration Details row paths = { "@/*": ["${configDir}/*"] }, docs mdx regenerated via pnpm generate:docs; pnpm format:check → clean (2026-11-19)
- [2026-11-19] criterion 5 — evidence: .changeset/fix-tsconfig-nextjs-path-alias.md bumps @jmlweb/tsconfig-nextjs patch (2026-11-19)
- [2026-11-19] Completed