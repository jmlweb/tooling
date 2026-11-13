---
id: LRN-011
title: pnpm consumers cannot resolve an explicit 'babel-jest' transform unless they depend on it
status: active
tags: [jest, jest-config, pnpm, peer-dependencies]
task: TSK-005
created: 2026-11-13
---

babel-jest ships inside jest (jest -> @jest/core -> jest-config -> babel-jest), but under pnpm's strict layout it is not linked into the consumer's or the package's node_modules. Jest resolves every transform path eagerly from rootDir at config normalization, so a config naming 'babel-jest' fails ("Module babel-jest in the transform option was not found") even with no JS tests. Declare it as a peer dependency (like ts-jest) and a devDependency for local tests.
