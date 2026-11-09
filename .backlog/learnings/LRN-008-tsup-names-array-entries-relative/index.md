---
id: LRN-008
title: tsup names array entries relative to their common directory
status: active
tags: [tsup, tsup-config-base, shebang]
task: TSK-004
created: 2026-11-09
---

tsup (esbuild) sets the outbase of an array entry to the deepest directory all entries share: ["src/cli.ts","src/admin/cli.ts"] builds dist/cli.js and dist/admin/cli.js, while ["src/cli.ts","lib/x.ts"] builds dist/src/cli.js and dist/lib/x.js. Converting an array to an object entry (as the selective-shebang split must) has to use the same relative-path-without-extension keys, or outputs move and basename clashes drop entries. tsup resolves entries against process.cwd() at build time, and process.chdir after import did not help: run fixture builds in a child process with cwd set.
