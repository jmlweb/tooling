---
'@jmlweb/jest-config': patch
---

The default `testPathIgnorePatterns` and `coveragePathIgnorePatterns` anchor `dist`, `build`, `.git`, `.cache` and `coverage` to `<rootDir>`. Before, a project inside any directory with one of those names found no tests ("No tests found, exiting with code 1") and collected no coverage. Nested `node_modules` stay ignored.
