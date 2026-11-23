---
id: LRN-016
title: turbo run cannot spawn tasks on the hustle box; build with pnpm -r
status: active
tags: [turbo, build, environment, testing]
task: TSK-010
created: 2026-11-23
---

On the hustle mini PC, `pnpm turbo run build` fails with "unable to spawn child process: Exec format error (os error 8)" for every task, so `pnpm build`, `pnpm test` and `pnpm validate` (all turbo) do not work locally. Workaround: `pnpm -r --filter "./packages/*" run build` (topological), then run per-package `pnpm lint`/`pnpm test` and the non-turbo root scripts (`format:check`, `lint:root`, `syncpack:check`, `validate:packages`, `check:exports`) directly. Package tests importing `../src/index.ts` still need sibling packages' `dist` built first.
