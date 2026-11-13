---
id: RPT-006
title: vite-config JSDoc alias examples use a relative './src' path that Vite cannot resolve
type: bug
severity: low
status: triaged
created: 2026-11-13
triaged: 2026-11-13
task-id: TSK-006
---

## Summary

The JSDoc on `ViteConfigOptions.resolve.alias` (`packages/vite-config/src/index.ts:15`) and the `createReactViteConfig` example (`packages/vite-config/src/index.ts:219`) both show `alias: { '@': './src' }`. Vite does not resolve relative alias values into file system paths; it substitutes them as-is, so `@/util` imported from `src/components/A.ts` becomes `./src/util` relative to `src/components/`. The README (`packages/vite-config/README.md:59`) and docs site already use the correct absolute form `resolve(import.meta.dirname, 'src')`, so the IDE hover docs contradict the README and lead to a broken build.

## Reproduction

Project: `src/util.ts` (`export const util = 1`), `src/components/A.ts` (`import { util } from "@/util"`), `src/main.ts` importing `./components/A`, `index.html` loading `/src/main.ts`. Build with vite 8.3.6 and the built `@jmlweb/vite-config`:

- `createViteConfig({ resolve: { alias: { '@': './src' } } })` → `Build failed with 1 error: [UNLOADABLE_DEPENDENCY] Could not load ./src/util` (at `src/components/A.ts:1:22`)
- `createViteConfig({ resolve: { alias: { '@': <absolute>/src } } })` → build succeeds

## Suggested fix

Change both JSDoc examples to an absolute path (e.g. `resolve(import.meta.dirname, 'src')`, matching the README), and add a changeset for `@jmlweb/vite-config`.
