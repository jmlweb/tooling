---
id: TSK-007
title: Fix: createReactViteConfig types reactPlugin as Plugin, so the documented react() call fails type-checking
status: complete
priority: P3
tags: []
created: 2026-11-15
source: report/RPT-007
depends-on: []
started: 2026-11-17
completed: 2026-11-17
---

# Fix: createReactViteConfig types reactPlugin as Plugin, so the documented react() call fails type-checking

## Description

`createReactViteConfig` declares `reactPlugin: Plugin` (`packages/vite-config/src/index.ts:244`) while `@vitejs/plugin-react` 6.x returns `Plugin[]`, so the README usage `createReactViteConfig({ reactPlugin: react() })` fails with TS2741. Widen the type to `PluginOption` from `vite` and add a type-level test. See RPT-007 for the reproduction.

## Acceptance Criteria

- [x] createReactViteConfig accepts the return value of @vitejs/plugin-react react() without a type error (reactPlugin typed as vite PluginOption or Plugin | Plugin[])
- [x] A test proves createReactViteConfig({ reactPlugin: react() }) type-checks and places the React plugins first in plugins
- [x] README and JSDoc examples remain valid; changeset added for @jmlweb/vite-config

## Notes

## Learnings

- LRN-011: @vitejs/plugin-react 6 react() returns Plugin[] and has no babel option
## Progress Log

- [2026-11-15] Created
- [2026-11-17] Started
- [2026-11-17] criterion 1 — evidence: reactPlugin and plugins typed as vite PluginOption; pnpm --filter @jmlweb/vite-config exec tsc -p test/tsconfig.json → 3x TS2741 before fix, exit 0 after (2026-11-17)
- [2026-11-17] criterion 2 — evidence: test/types/react-plugin.ts (type-level, run by tsc in pnpm test) + test/index.test.mjs asserts plugins === [react(), extra]; pnpm --filter @jmlweb/vite-config test → tsc exit 0, node --test pass 1 fail 0 (2026-11-17)
- [2026-11-17] criterion 3 — evidence: README/JSDoc examples (react(), react({...}), plugins: [react()]) mirrored in type test → tsc exit 0; babel JSDoc example replaced with jsxImportSource; .changeset/vite-config-react-plugin-option.md patch; pnpm validate:docs → passed (2026-11-17)
- [2026-11-17] Completed