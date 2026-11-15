---
id: TSK-007
title: Fix: createReactViteConfig types reactPlugin as Plugin, so the documented react() call fails type-checking
status: pending
priority: P3
tags: []
created: 2026-11-15
source: report/RPT-007
depends-on: []
---

# Fix: createReactViteConfig types reactPlugin as Plugin, so the documented react() call fails type-checking

## Description

`createReactViteConfig` declares `reactPlugin: Plugin` (`packages/vite-config/src/index.ts:244`) while `@vitejs/plugin-react` 6.x returns `Plugin[]`, so the README usage `createReactViteConfig({ reactPlugin: react() })` fails with TS2741. Widen the type to `PluginOption` from `vite` and add a type-level test. See RPT-007 for the reproduction.

## Acceptance Criteria

- [ ] createReactViteConfig accepts the return value of @vitejs/plugin-react react() without a type error (reactPlugin typed as vite PluginOption or Plugin | Plugin[])
- [ ] A test proves createReactViteConfig({ reactPlugin: react() }) type-checks and places the React plugins first in plugins
- [ ] README and JSDoc examples remain valid; changeset added for @jmlweb/vite-config

## Notes

## Learnings

## Progress Log

- [2026-11-15] Created