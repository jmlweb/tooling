---
id: LRN-001
title: oxfmt exits 2 when every explicit path is ignored; lint-staged needs --no-error-on-unmatched-pattern
status: active
tags: [oxfmt, lint-staged, formatting, ci]
task: TSK-001
created: 2026-11-01
---

oxfmt `ignorePatterns` (oxfmt.config.ts) also apply to file paths passed explicitly on the CLI, so lint-staged will not rewrite ignored files. But when all passed paths are ignored, oxfmt prints "Expected at least one target file. All matched files may have been excluded by ignore rules." and exits 2, which would abort a commit that stages only ignored files (e.g. `.backlog/**/*.md`). Add `--no-error-on-unmatched-pattern` to the lint-staged oxfmt command: it exits 0 with "No files found matching the given patterns."
