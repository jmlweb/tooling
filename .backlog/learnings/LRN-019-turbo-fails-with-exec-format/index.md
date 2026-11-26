---
id: LRN-019
title: turbo fails with Exec format error on the hustle box
status: active
tags: [turbo, tooling, environment]
task: TSK-011
created: 2026-11-25
---

On the hustle mini PC (pnpm 12.21 under nvm Node 25.8), turbo run build fails every task with "unable to spawn child process: Exec format error (os error 8)". Workaround for local verification: pnpm -r --filter "./packages/**" build, and run the integration runner with its build step swapped for that command. CI runs turbo on its own runners and was not checked here.
