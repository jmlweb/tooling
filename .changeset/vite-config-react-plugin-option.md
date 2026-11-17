---
'@jmlweb/vite-config': patch
---

Type `reactPlugin` and `plugins` as Vite `PluginOption` so `createReactViteConfig({ reactPlugin: react() })` type-checks with `@vitejs/plugin-react` 6, which returns `Plugin[]`. Re-export the `PluginOption` type.
