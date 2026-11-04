---
id: LRN-003
title: tsdown applies a string banner to js, css and dts outputs alike
status: active
tags: [tsdown, tsdown-config-base, banner]
task: TSK-002
created: 2026-11-04
---

tsdown's resolveChunkAddon (dist/build-*.mjs) returns a string banner, or a string returned by a banner function, as is for every chunk: js, css and dts. Only the object form is split per output type. So a composed banner must never return a bare string that contains a shebang: with `shebang: true` the `.d.ts` chunk is also a "target" and would get `#!/usr/bin/env node`. Normalize strings to `{ js, css, dts }` before prepending to `js`.
