---
'@jmlweb/commitlint-config': minor
---

Add a `subjectCase` option to `createCommitlintConfig`, and default `subject-case` to `@commitlint/config-conventional`'s rule so subjects can cite ids such as `TSK-010`. Pass `subjectCase: ['always', 'lower-case']` to keep the previous behavior.
