---
'@jmlweb/tsdown-config-base': patch
'@jmlweb/tsup-config-base': patch
---

`createTsdownCliConfig` keeps the shebang when you set `banner`. The shebang goes on the first line of the shebang entries and your banner (string, object or function form) follows it on every output. Before, a user `banner` replaced the shebang without a warning. The `@jmlweb/tsup-config-base` README now states that a `banner` in `options` replaces the shebang in `createTsupCliConfig`.
