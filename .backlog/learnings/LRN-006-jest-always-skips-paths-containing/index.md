---
id: LRN-006
title: Jest always skips paths containing /.git/, whatever testPathIgnorePatterns says
status: active
tags: [jest, jest-config, testing]
task: TSK-003
created: 2026-11-07
---

jest-haste-map appends VCS_DIRECTORIES (`/.git/`, `/.hg/`, `/.sl/`) to its ignorePattern and matches it against absolute paths. A project inside an ancestor directory named `.git` finds no tests even with fully anchored testPathIgnorePatterns. Regression tests for ancestor-directory names must cover `.git` at the pattern level only, not with a real Jest run.
