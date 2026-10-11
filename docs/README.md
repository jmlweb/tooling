# 📚 Docs Index

Monorepo-wide docs. Package docs live in `packages/<name>/README.md`; the published site is `apps/docs/`.

| File                                                         | Read when                                       |
| ------------------------------------------------------------ | ----------------------------------------------- |
| [RULES-INDEX.md](./RULES-INDEX.md)                           | Finding which rule file governs what            |
| [SPECS.md](./SPECS.md)                                       | Package catalog, repo structure, roadmap        |
| [DOCUMENTATION-GUIDELINES.md](./DOCUMENTATION-GUIDELINES.md) | Writing docs, tiers, caps, checklist            |
| [DEPENDENCIES.md](./DEPENDENCIES.md)                         | Version syntax, update cadence, Node.js support |
| [PACKAGE-GUIDELINES.md](./PACKAGE-GUIDELINES.md)             | Creating or changing a package                  |
| [README-STANDARDS.md](./README-STANDARDS.md)                 | Package README structure and style              |
| [README-TEMPLATE.md](./README-TEMPLATE.md)                   | Writing a package README                        |
| [PUBLISHING-GUIDELINES.md](./PUBLISHING-GUIDELINES.md)       | Changesets, versioning, commits, release        |
| [CI.md](./CI.md)                                             | Workflows and Turborepo caching                 |
| [CI-TROUBLESHOOTING.md](./CI-TROUBLESHOOTING.md)             | Fixing red CI, cache, publish failures          |

## 🔗 Related

- Agent rules: [`AGENTS.md`](../AGENTS.md), [`packages/AGENTS.md`](../packages/AGENTS.md)
- Validation: `pnpm validate:docs`, `pnpm validate:code-blocks`
- Docs site: `pnpm dev:docs`, `pnpm docs:build`
