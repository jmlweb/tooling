---
id: LRN-011
title: @vitejs/plugin-react 6 react() returns Plugin[] and has no babel option
status: active
tags: [vite, typescript, react]
task: TSK-007
created: 2026-11-17
---

@vitejs/plugin-react 6.x declares `viteReact(opts?: Options): Plugin[]`, not `Plugin`, so any wrapper API that accepts the plugin must use vite's `PluginOption` (which allows nested arrays) for both a dedicated slot and `plugins` arrays (`plugins: [react()]` is `Plugin[][]`). Vite flattens nested arrays at runtime, so the mismatch is type-only and runtime tests cannot catch it; use a tsc-checked fixture (packages/vite-config/test/types). Version 6 also removed the `babel` option (Oxc-based); examples using `react({ babel: ... })` no longer type-check.
