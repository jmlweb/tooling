---
id: RPT-001
title: CI Check Formatting fails on main because flowstate index files under .backlog are not oxfmt-formatted
type: bug
severity: high
status: triaged
created: 2026-10-29
triaged: 2026-10-29
task-id: TSK-001
---

## Summary

Since commit e980df6 (`chore(backlog): initialize flowstate backlog`), the CI `Check Formatting` job fails on `main`, and so does the `CI Status Check` gate. Every PR now inherits a red CI.

## Location

- `package.json:17`: `"format:check": "oxfmt --check \"**/*.{js,ts,tsx,json,md}\""`. The `**/*.md` glob includes `.backlog/**`.
- `oxfmt.config.ts:11`: the `**/*.md` override only disables `sortImports`. No ignore covers `.backlog/**`.
- `.github/workflows/ci.yml:35-36`: the `Check formatting` step runs `pnpm format:check`.

## Reproduction

```bash
git checkout e980df6
pnpm install --frozen-lockfile
pnpm format:check
```

Observed output (same locally and in CI run https://github.com/jmlweb/tooling/actions/runs/40923801883):

```text
.backlog/learnings/index.md (0ms)
.backlog/tasks/index.md (0ms)

Format issues found in above 2 files. Run without `--check` to fix.
```

The CI jobs `Check Formatting` and `CI Status Check` have conclusion `failure`. Every other job passes.

## Root cause

The flowstate CLI writes markdown tables without column padding, for example `|--------|-------|` and `| Pending | 0 |`. oxfmt wants aligned tables (`| -------- | ----- |`). The CLI rewrites these index files on every mutation, so a one-off `oxfmt` run will break again on the next CLI write.

## Suggested fix

Exclude `.backlog/**` from the format check. Use an oxfmt ignore pattern in `oxfmt.config.ts`, or `--ignore-path`, or narrow the `format:check` glob. Apply the same exclusion to the `*.md` lint-staged entry in `package.json` so the pre-commit hook does not rewrite CLI-owned files.
