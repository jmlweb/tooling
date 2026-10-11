# 🦋 Changesets

Version bumps and changelogs for `@jmlweb/*` packages. Full workflow: [`docs/PUBLISHING-GUIDELINES.md`](../docs/PUBLISHING-GUIDELINES.md).

## 🚀 Usage

```bash
pnpm changeset
```

Pick the packages, the bump type and write a summary. Commit the generated file with your code. On merge to `main`, CI versions, updates changelogs and publishes.

## 🔢 Bump types

| Type    | When                                              |
| ------- | ------------------------------------------------- |
| `patch` | Fixes, no behavior change                         |
| `minor` | Backward-compatible feature                       |
| `major` | Breaking change; explain migration in the summary |

## ⚙️ Config

[`config.json`](./config.json): base branch `main`, public access, `commit: false`, internal dependents bumped as `patch`.
