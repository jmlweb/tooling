# Rules Index

Which file governs what. Agents read `AGENTS.md` files first; they hold directives and link here for depth.

## Rule files

| File                                          | Scope                                             |
| --------------------------------------------- | ------------------------------------------------- |
| [`AGENTS.md`](../AGENTS.md)                   | Project-wide rules, tooling, commands             |
| [`packages/AGENTS.md`](../packages/AGENTS.md) | Package README section order and rules            |
| [`.cursor/rules/`](../.cursor/rules/)         | Cursor metadata (`alwaysApply`), pointers to docs |

## By task

| Task                              | Read                                                                                         |
| --------------------------------- | -------------------------------------------------------------------------------------------- |
| Create or change a package        | [`PACKAGE-GUIDELINES.md`](./PACKAGE-GUIDELINES.md)                                           |
| Write a package README            | [`README-STANDARDS.md`](./README-STANDARDS.md), [`README-TEMPLATE.md`](./README-TEMPLATE.md) |
| Write or maintain any doc         | [`DOCUMENTATION-GUIDELINES.md`](./DOCUMENTATION-GUIDELINES.md)                               |
| Update dependencies, Node support | [`DEPENDENCIES.md`](./DEPENDENCIES.md)                                                       |
| Version and publish               | [`PUBLISHING-GUIDELINES.md`](./PUBLISHING-GUIDELINES.md)                                     |
| Understand or debug CI            | [`CI.md`](./CI.md), [`CI-TROUBLESHOOTING.md`](./CI-TROUBLESHOOTING.md)                       |
| Package catalog, structure        | [`SPECS.md`](./SPECS.md)                                                                     |
| Migrate to Oxfmt/Oxlint           | [`migrate-to-oxc.mdx`](../apps/docs/src/content/docs/guides/migrate-to-oxc.mdx)              |

## By file type

| File                   | Read                                                                        |
| ---------------------- | --------------------------------------------------------------------------- |
| `packages/*/README.md` | [`README-STANDARDS.md`](./README-STANDARDS.md)                              |
| `package.json`         | [`PACKAGE-GUIDELINES.md`](./PACKAGE-GUIDELINES.md#packagejson-structure)    |
| `tsconfig.json`        | [`PACKAGE-GUIDELINES.md`](./PACKAGE-GUIDELINES.md#typescript-configuration) |
| `.changeset/*.md`      | [`PUBLISHING-GUIDELINES.md`](./PUBLISHING-GUIDELINES.md)                    |
| `.github/workflows/*`  | [`CI.md`](./CI.md#workflow-files)                                           |

## How rules reach agents

- Cursor: reads `AGENTS.md` files and `.cursor/rules/*.mdc`
- Claude Code and others: read `AGENTS.md`, follow its pointers

## Validation

- `pnpm validate:docs`: [`scripts/validate-docs.mjs`](../scripts/validate-docs.mjs)
- `pnpm validate:packages`: [`scripts/validate-all-packages.mjs`](../scripts/validate-all-packages.mjs)
- `node scripts/validate-package.mjs packages/<name>`: single package

## Adding a rule

1. Put the directive in the matching `AGENTS.md` (keep it under 100 lines); put detail in `docs/`
2. Cursor-specific metadata: add a pointer-only `.cursor/rules/*.mdc`
3. Add the doc to [`README.md`](./README.md) and this index
