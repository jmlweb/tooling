---
id: LRN-010
title: turbo fails with Exec format error when the pnpm tools cache holds a placeholder binary
status: active
tags: [turbo, pnpm, local-env]
task: TSK-006
created: 2026-11-15
---

Root `pnpm build`, `pnpm test` and `pnpm validate` run through turbo, which spawns the pnpm binary from ~/.local/share/pnpm/.tools/pnpm/<version>/bin/pnpm (resolved from packageManager), not the one on PATH. On the affected machine that tool install for pnpm 12.18.0 is a placeholder text file ("pnpm's native binary replaces this file during installation"), so every turbo task fails with "Exec format error (os error 8)". Workaround without touching the home dir: `pnpm -r --filter './packages/**' build`, `pnpm -r --if-present test|lint`, and for apps/integration-tests run a temp copy of scripts/run-tests.mjs with the `pnpm build` step stubbed out after building with pnpm -r.
