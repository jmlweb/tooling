# Dependencies

Rules for dependency versions, update cadence and Node.js support. Summary rules: [`AGENTS.md`](../AGENTS.md).

## Rule

Use the latest **stable** version of every tool, package and runtime. No alpha, beta or RC unless required, and then document why.

Scope: Node.js, `package.json` dependencies, dev tools (Turborepo, Oxc, TypeScript, …), build tools, test frameworks.

## Version syntax

Enforced by syncpack (`.syncpackrc.json`). Do not hand-pick ranges; run `pnpm syncpack:fix`.

| Kind               | Syntax          | Notes                                             |
| ------------------ | --------------- | ------------------------------------------------- |
| dependencies, dev  | `^1.2.3`        | Same range in every workspace package             |
| Internal packages  | `workspace:*`   | Ignored by syncpack checks                        |
| `peerDependencies` | `^1.2.3` (wide) | Intentionally broad for consumers; syncpack skips |

## Update cadence

| Cadence     | Scope               | Action                                           |
| ----------- | ------------------- | ------------------------------------------------ |
| Immediately | Security advisories | `pnpm audit`, `pnpm audit --fix`                 |
| Monthly     | Patch updates       | `pnpm outdated`, update, validate                |
| Quarterly   | Minor updates       | Test thoroughly before merge                     |
| As needed   | Major updates       | Read changelog and migration guide; dedicated PR |

## Update workflow

1. `pnpm outdated`
2. Read changelogs for majors
3. Edit `package.json` files, or `pnpm exec syncpack update`
4. `pnpm syncpack:fix`
5. `pnpm build && pnpm test`
6. `pnpm validate`
7. Commit as `chore(deps): …`

## Commands

| Command                     | Purpose                                  |
| --------------------------- | ---------------------------------------- |
| `pnpm syncpack:check`       | Detect mismatches (runs in CI)           |
| `pnpm syncpack:fix`         | Fix mismatches and format `package.json` |
| `pnpm exec syncpack list`   | List dependencies and status             |
| `pnpm exec syncpack update` | Bump to latest                           |
| `pnpm outdated`             | Show outdated packages                   |
| `pnpm audit` / `--fix`      | Check / fix vulnerabilities              |

Transitive vulnerabilities without an upstream fix go in the root `pnpm` overrides or the audit ignore list; see [`CI.md`](./CI.md#workflow-files) for the security workflow.

## Node.js support

- Root `engines.node` (`>=24.16.0`) is the development toolchain; `.nvmrc` pins the CI version.
- Each published package sets its own `engines.node` to the oldest Node.js version still supported upstream (currently `>=22.12.0`).
- Support at least all Active LTS versions, ideally Maintenance LTS too.
- Document the requirement in the package README (**Requirements** section).
- Raise the minimum only when a Node.js version reaches end-of-life.

| Node.js status  | Support level                    |
| --------------- | -------------------------------- |
| Active LTS      | Full, regular updates            |
| Maintenance LTS | Security updates only            |
| Current         | Latest features, may be unstable |

## Exceptions

- Pinned older version for compatibility: document the reason next to the pin.
- Newer major needs a large refactor: weigh the trade-off, record the decision.
- Published packages: check consumer impact before a major bump.

### Current pins

- **TypeScript 6.x** (`^6.0.3`, not 7): `@eslint-react/eslint-plugin` and `eslint-plugin-perfectionist` load `@typescript-eslint/utils`, which supports TypeScript `<6.1.0`. TypeScript 7 has no classic JS API, so Oxlint crashes in those JS plugins when linting React code. Dependabot skips majors; when running `pnpm exec syncpack update`, revert any TypeScript 7 bump. Lift the pin when typescript-eslint supports TypeScript 7.
