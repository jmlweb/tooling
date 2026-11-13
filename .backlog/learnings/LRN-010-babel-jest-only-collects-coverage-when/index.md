---
id: LRN-010
title: babel-jest only collects coverage when Jest runs from the project directory
status: active
tags: [jest, jest-config, babel-jest, coverage, testing]
task: TSK-005
created: 2026-11-13
---

With babel-jest as the transform (explicit or Jest's implicit default), runCLI on a temp project returned an empty coverageMap while process.cwd() was the repo package; ts-jest and `transform: {}` (Jest's own instrumenter) covered the file. babel-jest delegates instrumentation to babel-plugin-istanbul, which only instrumented once `process.chdir(projectDir)` ran before runCLI. Real projects run Jest from their root, so only test harnesses hit this: chdir into the temp project and restore it in `finally`. Also: the existing transform helper destructured `[, options]`, which silently breaks for string transformers like `'babel-jest'`; resolve each transformer by its own name.
