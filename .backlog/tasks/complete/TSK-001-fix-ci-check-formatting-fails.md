---
id: TSK-001
title: Fix: CI Check Formatting fails on main because flowstate index files under .backlog are not oxfmt-formatted
status: complete
priority: P2
tags: [ci, formatting]
created: 2026-10-29
source: report/RPT-001
depends-on: []
started: 2026-11-01
completed: 2026-11-01
---

# Fix: CI Check Formatting fails on main because flowstate index files under .backlog are not oxfmt-formatted

## Description

### Context

RPT-001: the `pnpm format:check` glob `**/*.{js,ts,tsx,json,md}` (`package.json:17`) checks the flowstate-generated `.backlog/tasks/index.md` and `.backlog/learnings/index.md`. Their unpadded tables fail oxfmt, so the CI `Check Formatting` job fails on `main` since e980df6.

### Approach

Exclude `.backlog/**` from formatting. Use an oxfmt ignore in `oxfmt.config.ts` or an ignore file, or narrow the glob. Then exclude the same path from the lint-staged `*.md` entry. Do not reformat the files by hand: the CLI rewrites them on every mutation.

## Acceptance Criteria

- [x] pnpm format:check passes on main with the current .backlog/ files
- [x] The CI Check Formatting job and CI Status Check gate are green on main
- [x] A flowstate CLI mutation that rewrites .backlog/ index files does not make pnpm format:check fail again
- [x] The lint-staged *.md entry does not rewrite files under .backlog/

## Notes

## Learnings

- LRN-001: oxfmt exits 2 when every explicit path is ignored; lint-staged needs --no-error-on-unmatched-pattern
- LRN-002: Format check in this repo needs the oxfmt and oxlint config packages built first
## Progress Log

- [2026-10-29] Created
- [2026-11-01] Started
- [2026-11-01] criterion 1 — evidence: pnpm format:check → before: 'Format issues found' in .backlog/tasks/index.md (exit 1); after ignorePatterns ['.backlog/**']: 'All matched files use the correct format' on 200 files (exit 0) (2026-11-01)
- [2026-11-01] criterion 4 — evidence: git add .backlog && pnpm exec lint-staged → exit 0, .backlog/tasks/index.md md5 unchanged (16b912be…); oxfmt --no-error-on-unmatched-pattern on an ignored path → 'No files found', exit 0 (2026-11-01)
- [2026-11-01] criterion 3 — evidence: flowstate task-move, task-update and learning-create rewrote .backlog/ (tasks/index.md, task file, LRN-001/002) → pnpm format:check still 'All matched files use the correct format' (exit 0) (2026-11-01)
- [2026-11-01] criterion 2 — evidence: PR #243 CI run 41268183784 on the merge ref (main + fix) → Check Formatting pass, CI Status Check pass, all 11 checks pass; post-merge run on main not yet observed (2026-11-01)
- [2026-11-01] Completed
