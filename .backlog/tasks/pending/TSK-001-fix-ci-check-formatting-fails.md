---
id: TSK-001
title: Fix: CI Check Formatting fails on main because flowstate index files under .backlog are not oxfmt-formatted
status: pending
priority: P2
tags: [ci, formatting]
created: 2026-10-29
source: report/RPT-001
depends-on: []
---

# Fix: CI Check Formatting fails on main because flowstate index files under .backlog are not oxfmt-formatted

## Description

### Context

RPT-001: the `pnpm format:check` glob `**/*.{js,ts,tsx,json,md}` (`package.json:17`) checks the flowstate-generated `.backlog/tasks/index.md` and `.backlog/learnings/index.md`. Their unpadded tables fail oxfmt, so the CI `Check Formatting` job fails on `main` since e980df6.

### Approach

Exclude `.backlog/**` from formatting. Use an oxfmt ignore in `oxfmt.config.ts` or an ignore file, or narrow the glob. Then exclude the same path from the lint-staged `*.md` entry. Do not reformat the files by hand: the CLI rewrites them on every mutation.

## Acceptance Criteria

- [ ] pnpm format:check passes on main with the current .backlog/ files
- [ ] The CI Check Formatting job and CI Status Check gate are green on main
- [ ] A flowstate CLI mutation that rewrites .backlog/ index files does not make pnpm format:check fail again
- [ ] The lint-staged *.md entry does not rewrite files under .backlog/

## Notes

## Learnings

## Progress Log

- [2026-10-29] Created