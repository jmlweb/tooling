---
id: RPT-007
title: createReactViteConfig types reactPlugin as Plugin, so the documented react() call fails type-checking
type: bug
severity: medium
status: triaged
created: 2026-11-15
triaged: 2026-11-15
task-id: TSK-007
---

## Summary

`createReactViteConfig` declares `reactPlugin: Plugin` (`packages/vite-config/src/index.ts:244`), but `@vitejs/plugin-react` 6.x declares `viteReact(opts?: Options): Plugin[]` (`node_modules/@vitejs/plugin-react/dist/index.d.ts:64`). The usage documented in the README (`packages/vite-config/README.md:47`, `createReactViteConfig({ reactPlugin: react() })`) and in the JSDoc examples (`packages/vite-config/src/index.ts:216`, `:232`) therefore does not type-check in a TypeScript `vite.config.ts`. At runtime Vite flattens the nested array in `plugins: [reactPlugin, ...plugins]` (`:250`), so the bug is type-level only, but every TypeScript consumer following the docs hits a compile error.

## Reproduction

Add `packages/vite-config/src/__probe.ts`:

```ts
import react from '@vitejs/plugin-react';
import { createReactViteConfig } from './index';
export default createReactViteConfig({ reactPlugin: react() });
```

Run `npx tsc --noEmit -p .` in `packages/vite-config`:

```
src/__probe.ts(3,40): error TS2741: Property 'name' is missing in type 'Plugin<any>[]' but required in type 'Plugin<any>'.
```

## Suggested fix

Type `reactPlugin` as `PluginOption` (or `Plugin | Plugin[]`) from `vite`, and add a type-level test that `createReactViteConfig({ reactPlugin: react() })` compiles.
