---
id: LRN-009
title: oxlint no-unnecessary-condition rejects undefined checks on Record index
status: active
tags: [oxlint, typescript, tsup-config-base]
task: TSK-004
created: 2026-11-09
---

In packages/tsup-config-base, oxlint type-aware no-unnecessary-condition flags `record[key] !== undefined` on a Record<string, string> because the index type is string, not string | undefined (noUncheckedIndexedAccess is off). Use a Map and .get() for "seen" checks instead.
