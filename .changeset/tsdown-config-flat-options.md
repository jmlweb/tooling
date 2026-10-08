---
'@jmlweb/tsdown-config-base': minor
---

Accept every tsdown option at the top level of `createTsdownConfig` and `createTsdownCliConfig`, so a config reads like a plain tsdown config (`deps`, `sourcemap`, `target`, ...). The `options` field keeps working but is deprecated; setting the same key both at the top level and in `options` throws a `TsdownConfigError`.
