# Changesets

This folder contains changeset files that describe changes made to packages in this monorepo. Changesets are used to automatically version packages and generate changelogs.

## How It Works

1. **Create a changeset**: After making changes, run `pnpm changeset` to create a changeset file in this directory
2. **Describe your changes**: Write a clear description of what changed
3. **Choose version bump**: Select patch, minor, or major based on the type of change
4. **Commit**: Commit both your code changes and the changeset file
5. **Auto-versioning**: When merged to `main`, CI automatically:
   - Versions packages based on changesets
   - Generates CHANGELOG.md files for each package
   - Publishes updated packages

## Version Bump Types

- **Patch**: Bug fixes that don't change behavior (1.0.0 → 1.0.1)
- **Minor**: New features, backward compatible (1.0.0 → 1.1.0)
- **Major**: Breaking changes (1.0.0 → 2.0.0)

## Breaking Changes

When making breaking changes:

1. Select **Major** version bump when creating the changeset
2. Clearly explain in the changeset description:
   - What changed and why
   - How users should migrate their code
   - Any temporary workarounds

## Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Common Questions](https://github.com/changesets/changesets/blob/main/docs/common-questions.md)
- Project-specific changelog documentation: See `AGENTS.md` in the root directory
