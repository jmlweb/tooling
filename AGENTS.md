# Agent Guidelines

Rules for all AI agents (Claude Code, Cursor, others). Project-specific rules here override global ones. Depth lives in [`docs/`](docs/README.md); this file is directives and pointers only.

## Project

Turborepo monorepo of publishable `@jmlweb/*` config packages (formatting, linting, TypeScript, build, test, commits). Goal: consistent tooling across projects.

```text
packages/   publishable packages (one npm package each)
apps/       docs site, example apps, test-app, integration-tests
docs/       technical docs, index at docs/README.md
scripts/    validation and release helpers
```

Package names: `@jmlweb/{tool}-config-{variant}` (e.g. `@jmlweb/oxlint-config-react`).

## Rules

- Documentation in English; source comments English preferred
- Doc file names uppercase and descriptive (`SPECS.md`, not `specs.md`)
- Single source of truth: link, never duplicate
- Update docs in the same change as code
- Latest stable versions only; never hand-set ranges, run `pnpm syncpack:fix`
- Published packages: set `engines.node` to the oldest upstream-supported Node.js
- Extend base configs, do not duplicate them
- Check existing packages before creating one
- Do not override shared formatting or lint rules unless asked

## Tiers and caps

| Tier   | Files                                                | Cap              |
| ------ | ---------------------------------------------------- | ---------------- |
| Rules  | `AGENTS.md`, `packages/AGENTS.md`, `.cursor/rules/*` | < 100 lines      |
| README | `README.md` (root, packages)                         | none             |
| Docs   | `docs/**`                                            | < 300 lines/file |

Over the cap: move detail to `docs/`, leave a one-line pointer.

## Tooling

- Format: Oxfmt via `@jmlweb/oxfmt-config-base` (`oxfmt.config.ts`)
- Lint: Oxlint, type-aware, via `@jmlweb/oxlint-config-{base,react,node}` (`oxlint.config.ts`)
- Prettier and ESLint packages: maintained for existing projects; Astro keeps `@jmlweb/eslint-config-astro`
- Build: tsdown via `@jmlweb/tsdown-config-base`; TypeScript extends `@jmlweb/tsconfig-internal`
- Migration: [`apps/docs/src/content/docs/guides/migrate-to-oxc.mdx`](apps/docs/src/content/docs/guides/migrate-to-oxc.mdx)

## Commands

| Command                  | Purpose                            |
| ------------------------ | ---------------------------------- |
| `pnpm build` / `test`    | Build / test via Turborepo         |
| `pnpm validate`          | Format check, lint, syncpack       |
| `pnpm validate:docs`     | Docs structure and language        |
| `pnpm validate:packages` | package.json validation            |
| `pnpm check:exports`     | publint and attw on built packages |
| `pnpm changeset`         | Record a version bump              |

## Where to look

| Topic                                | Doc                                                                                                |
| ------------------------------------ | -------------------------------------------------------------------------------------------------- |
| All docs, index                      | [`docs/README.md`](docs/README.md)                                                                 |
| Which rule governs what              | [`docs/RULES-INDEX.md`](docs/RULES-INDEX.md)                                                       |
| Writing and maintaining docs         | [`docs/DOCUMENTATION-GUIDELINES.md`](docs/DOCUMENTATION-GUIDELINES.md)                             |
| Dependency versions, Node.js support | [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md)                                                     |
| Creating and structuring packages    | [`docs/PACKAGE-GUIDELINES.md`](docs/PACKAGE-GUIDELINES.md)                                         |
| Package README structure             | [`packages/AGENTS.md`](packages/AGENTS.md), [`docs/README-STANDARDS.md`](docs/README-STANDARDS.md) |
| Changesets, versioning, commits      | [`docs/PUBLISHING-GUIDELINES.md`](docs/PUBLISHING-GUIDELINES.md)                                   |
| CI workflows, caching, failures      | [`docs/CI.md`](docs/CI.md), [`docs/CI-TROUBLESHOOTING.md`](docs/CI-TROUBLESHOOTING.md)             |
| Package catalog and roadmap          | [`docs/SPECS.md`](docs/SPECS.md)                                                                   |

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
