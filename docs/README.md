# Docs Index

Monorepo-wide docs. Package docs: `packages/<name>/README.md`. Published site: `apps/docs/`.

| File                                                         | Read when                                        |
| ------------------------------------------------------------ | ------------------------------------------------ |
| [RULES-INDEX.md](./RULES-INDEX.md)                           | Finding which rule file governs what             |
| [SPECS.md](./SPECS.md)                                       | Package catalog, repo structure, roadmap         |
| [DOCUMENTATION-GUIDELINES.md](./DOCUMENTATION-GUIDELINES.md) | Writing docs, tiers, caps, checklist             |
| [DEPENDENCIES.md](./DEPENDENCIES.md)                         | Version syntax, update cadence, Node.js support  |
| [README-STANDARDS.md](./README-STANDARDS.md)                 | Package README structure and style               |
| [CI-TROUBLESHOOTING.md](./CI-TROUBLESHOOTING.md)             | Fixing red CI, cache, publish failures           |
| [PACKAGE-GUIDELINES.md](./PACKAGE-GUIDELINES.md)             | Creating or changing a package                   |
| [PUBLISHING-GUIDELINES.md](./PUBLISHING-GUIDELINES.md)       | Changesets, versioning, commits, release         |
| [CI.md](./CI.md)                                             | Workflows, Turborepo caching, CI troubleshooting |
| [README-TEMPLATE.md](./README-TEMPLATE.md)                   | Writing a package README                         |

## Related

- Agent rules: [`AGENTS.md`](../AGENTS.md), [`packages/AGENTS.md`](../packages/AGENTS.md)
- Validation: `pnpm validate:docs`, `pnpm validate:code-blocks`
- Docs site: `pnpm dev:docs`, `pnpm docs:build`
