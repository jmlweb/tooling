---
id: LRN-018
title: TypeScript 6 defaults types to [], node: imports need types [node]
status: active
tags: [typescript, oxlint, tsdown]
task: TSK-011
created: 2026-11-25
---

With TypeScript 6 the default compilerOptions.types is [], so installing @types/node is not enough: importing node:module gave error-typed values and type-aware oxlint failed with no-unsafe-call. Add "types": ["node"] to the package tsconfig. tsdown shims import.meta.url in the CJS build automatically (require("url").pathToFileURL(__filename)), so createRequire(import.meta.url) works in both ESM and CJS outputs.
