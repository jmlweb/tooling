---
id: LRN-004
title: pnpm 12 shebang-less .tools shim breaks turbo task spawning on this host
status: active
tags: [pnpm, turborepo, tooling]
task: TSK-002
created: 2026-11-04
---

On the hustle mini PC, `pnpm build` (turbo) fails with "Exec format error (os error 8)": pnpm 12 prepends ~/.local/share/pnpm/.tools/pnpm/12.14.0/bin to PATH, and that `pnpm` is a shebang-less sh script turbo cannot exec. Workaround: run `./node_modules/.bin/turbo run <task>` directly; for integration tests, warm the turbo cache with a direct turbo build first so the inner `pnpm build` is all cache hits. Not a repo problem; CI is unaffected.
