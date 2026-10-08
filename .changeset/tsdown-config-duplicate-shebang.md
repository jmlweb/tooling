---
'@jmlweb/tsdown-config-base': patch
---

Fix `createTsdownCliConfig` emitting two shebang lines (a syntax error) when an entry's source file already starts with one. Such entries now keep their own shebang and the preset no longer adds another.
