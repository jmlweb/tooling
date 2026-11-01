---
id: LRN-002
title: Format check in this repo needs the oxfmt and oxlint config packages built first
status: active
tags: [oxfmt, formatting, build, ci]
task: TSK-001
created: 2026-11-01
---

`oxfmt.config.ts` imports `@jmlweb/oxfmt-config-base` from its `dist/`, so `pnpm format:check` fails with "Cannot find module .../dist/index.js" on a fresh clone. CI builds it first (`pnpm build --filter='@jmlweb/oxfmt-config-base'`). On the hustle mini PC, `turbo run build` failed with "Exec format error (os error 8)" spawning tasks; `pnpm -r --filter './packages/*' run build` builds all packages in topological order as a workaround.
