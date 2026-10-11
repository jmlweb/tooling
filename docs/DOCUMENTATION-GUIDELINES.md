# Documentation Guidelines

Rules for writing and maintaining docs. Summary rules: [`AGENTS.md`](../AGENTS.md).

## Audience

Docs serve humans and machines. Prefer tables, lists and short statements over prose. Keep facts exact: commands, paths, versions, package names.

## Tiers

| Tier   | Files                                                | Cap              | Voice                           |
| ------ | ---------------------------------------------------- | ---------------- | ------------------------------- |
| Rules  | `AGENTS.md`, `packages/AGENTS.md`, `.cursor/rules/*` | < 100 lines      | Terse, directive, pointers only |
| README | Root and package `README.md`                         | none             | Human, emoji-friendly overview  |
| Docs   | `docs/**`                                            | < 300 lines/file | Full technical depth            |

Index of `docs/`: [`README.md`](./README.md). Rule navigation: [`RULES-INDEX.md`](./RULES-INDEX.md).

## Language

- All documentation in English: READMEs, specs, `docs/`, markdown/text files, comments inside docs.
- Source-code comments may use any language; English preferred.

## File naming

- Uppercase, descriptive: `AGENTS.md`, `SPECS.md`, `PACKAGE-GUIDELINES.md`.
- No generic names (`doc.md`, `rules.md`) and no abbreviations unless widely understood.

## Size

- Split a file when it passes the tier cap or becomes hard to navigate.
- Split by topic, name new files descriptively, leave a one-line pointer in the source, update every link.

## Duplication

- One source of truth per fact; link instead of copying.
- Link to sections (`See [Update workflow](./DEPENDENCIES.md#update-workflow)`), reuse code via imports, not pasted blocks.
- Check for existing content before adding.

## Keeping docs current

Update docs in the same change as the code.

| Change                   | Update                                                                        |
| ------------------------ | ----------------------------------------------------------------------------- |
| New package              | Everything in the checklist below                                             |
| Modified package         | Package README, affected example apps, root README if the description changes |
| New example app          | `apps/README.md`                                                              |
| Config or tooling change | Affected docs in `docs/`, `AGENTS.md` pointers                                |
| New or moved doc         | `docs/README.md`, `docs/RULES-INDEX.md`, inbound links                        |

### New package checklist

| File                                      | Update                                                |
| ----------------------------------------- | ----------------------------------------------------- |
| `README.md`                               | Packages table, compatibility matrix, analytics table |
| `docs/SPECS.md`                           | Package description, project structure, roadmap       |
| `packages/commitlint-config/src/index.ts` | Package scope                                         |
| `packages/commitlint-config/README.md`    | Scope in documentation                                |
| `apps/README.md`                          | If used by an example app                             |
| `packages/<name>/README.md`               | Per [`README-STANDARDS.md`](./README-STANDARDS.md)    |

Before marking a package done, verify all rows. Reviewers check that docs accompany code.

## Validation

- `pnpm validate:docs`: AGENTS.md presence, package README sections, language heuristic
- `pnpm validate:code-blocks` (`:fix`): fenced code blocks in markdown
- `pnpm format:check`: markdown formatting

## Generated files

`apps/docs/` generates `llms.txt`, `llms-full.txt` and `llms-small.txt` at build time via `starlight-llms-txt`, configured in `apps/docs/astro.config.mjs`.

- Never hand-write or commit them under `apps/docs/public/` or `src/content/docs/`.
- Change content through `src/content/docs/**` or the plugin options (`projectName`, `description`, `customSets`, `exclude`).
- Output: `apps/docs/dist/` (gitignored), served at `https://jmlweb.github.io/tooling/llms.txt`.
