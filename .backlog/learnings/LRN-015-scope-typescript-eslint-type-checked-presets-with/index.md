---
id: LRN-015
title: Scope typescript-eslint type-checked presets with files ?? TS globs
status: active
tags: [eslint, typescript-eslint, eslint-config-base, flat-config]
task: TSK-010
created: 2026-11-23
---

`tseslint.configs.strictTypeChecked` / `stylisticTypeChecked` entries have no `files`, so they apply to every file and crash on JS ("requires type information") when `projectService` is only set for .ts/.tsx. Map each entry to `files: entry.files ?? ['**/*.ts','**/*.tsx']`: `?? ` keeps the preset's own eslint-recommended override glob (ts/tsx/mts/cts). The arrays are assignable to `Linter.Config[]` without a cast; oxlint flags the cast as no-unnecessary-type-assertion. The test-app `.mjs`-only disableTypeChecked workaround never covered `fixtures/valid/javascript.js`, so `npx eslint .` there crashed on main.
