# Rules Index

> **Note for Cursor**: This document provides an overview of all rules and guidelines in this project. Cursor automatically reads `AGENTS.md` files, which contain the detailed rules.

This document serves as a navigation guide to all rules, guidelines, and documentation standards in this monorepo. Use this index to quickly find the information you need.

## Quick Navigation

- [Main Agent Guidelines](#main-agent-guidelines) - Core rules for AI agents
- [Package README Standards](#package-readme-standards) - Documentation structure for packages
- [Cursor-Specific Rules](#cursor-specific-rules) - Rules in `.cursor/rules/` directory
- [Project Documentation](#project-documentation) - Other documentation files

## Main Agent Guidelines

**Location**: [`AGENTS.md`](../AGENTS.md)

The main agent guidelines file contains comprehensive rules for AI agents working on this project. This file is automatically read by Cursor.

### Key Sections

1. **General Rules**
   - Documentation Language (English only)
   - Use Latest Stable Versions
   - Node.js Compatibility Requirements

2. **File Organization Rules**
   - Descriptive File Names (uppercase convention)
   - File Size Management (split large files)
   - Avoid Duplicate Content

3. **Code Style and Formatting**
   - Prettier configuration usage
   - ESLint configuration usage

4. **Project Structure**
   - Monorepo organization
   - Package naming conventions

5. **Package Development**
   - Creating New Packages
   - Package.json Structure
   - Build System (tsup)
   - Dependency Management
   - TypeScript Configuration
   - Pre-publish Validation

6. **Documentation Standards**
   - README Standards (see also [`packages/AGENTS.md`](#package-readme-standards))
   - Documentation Maintenance requirements

7. **Publishing Workflow**
   - Versioning Process (Changesets)
   - Changelog Management
   - Commit Conventions

## Package README Standards

**Location**: [`packages/AGENTS.md`](../packages/AGENTS.md)

This file contains detailed guidelines for creating and maintaining package README files. It defines the standardized structure that all package READMEs must follow.

### Key Sections

1. **Standard README Structure** - Required section order
2. **Section Guidelines** - Detailed formatting for each section
3. **Formatting Guidelines** - Emoji usage, code blocks, links, tables
4. **Creating/Updating READMEs** - Step-by-step processes
5. **Consistency Checklist** - Verification checklist

### Required Sections (in order)

1. Title and Badges
2. Description
3. Features
4. Installation
5. Quick Start
6. Examples
7. Configuration Details
8. When to Use
9. Extending the Configuration
10. Usage with Scripts
11. Requirements
12. Peer Dependencies
13. Related Packages
14. Migration Guide (optional)
15. License

## Cursor-Specific Rules

**Location**: [`.cursor/rules/`](../.cursor/rules/)

These files contain Cursor-specific metadata and rules. They reference the main `AGENTS.md` files for complete details.

### Available Rules

1. **Documentation Language Rule** (`.cursor/rules/documentation-english.mdc`)
   - Ensures all documentation is in English
   - References: [`AGENTS.md`](../AGENTS.md#documentation-language)

2. **Use Latest Stable Versions Rule** (`.cursor/rules/use-latest-stable-versions.mdc`)
   - Enforces using latest stable versions
   - References: [`AGENTS.md`](../AGENTS.md#use-latest-stable-versions)

## Project Documentation

### Specification Document

**Location**: [`docs/SPECS.md`](../docs/SPECS.md)

Contains project specifications, objectives, package descriptions, and future considerations.

### README Template

**Location**: [`docs/README-TEMPLATE.md`](../docs/README-TEMPLATE.md)

Template for creating new package READMEs following the standard structure.

### Main Project README

**Location**: [`README.md`](../README.md)

Main project documentation with package overview, quick start guides, compatibility matrix, and development instructions.

## Rule Categories

### Documentation Rules

- **Language**: All documentation must be in English (see [`AGENTS.md`](../AGENTS.md#documentation-language))
- **File Names**: Must be descriptive and uppercase (see [`AGENTS.md`](../AGENTS.md#descriptive-file-names))
- **Structure**: READMEs must follow standard structure (see [`packages/AGENTS.md`](../packages/AGENTS.md))
- **Maintenance**: Documentation must be kept up to date (see [`AGENTS.md`](../AGENTS.md#documentation-maintenance))

### Package Development Rules

- **Naming**: Follow `@jmlweb/{tool}-config-{variant}` pattern (see [`AGENTS.md`](../AGENTS.md#package-naming-convention))
- **Structure**: Follow package.json structure guidelines (see [`AGENTS.md`](../AGENTS.md#packagejson-structure))
- **Dependencies**: Understand dependencies vs devDependencies vs peerDependencies (see [`AGENTS.md`](../AGENTS.md#dependency-management))
- **Build**: Use tsup for TypeScript packages (see [`AGENTS.md`](../AGENTS.md#build-system))
- **TypeScript**: Extend `@jmlweb/tsconfig-internal` (see [`AGENTS.md`](../AGENTS.md#typescript-configuration))

### Versioning and Publishing Rules

- **Versioning**: Follow semantic versioning (see [`AGENTS.md`](../AGENTS.md#versioning))
- **Changesets**: Use Changesets for versioning (see [`AGENTS.md`](../AGENTS.md#publishing-workflow))
- **Commits**: Follow Conventional Commits (see [`AGENTS.md`](../AGENTS.md#commit-conventions))
- **Changelogs**: Automatically generated via Changesets (see [`AGENTS.md`](../AGENTS.md#changelog-management))

### Code Style Rules

- **Prettier**: Use `@jmlweb/prettier-config-base` or `@jmlweb/prettier-config-tailwind` (see [`AGENTS.md`](../AGENTS.md#code-style-and-formatting))
- **ESLint**: Use `@jmlweb/eslint-config-base` or `@jmlweb/eslint-config-base-js` (see [`AGENTS.md`](../AGENTS.md#code-style-and-formatting))

### Version Management Rules

- **Latest Stable**: Always use latest stable versions (see [`AGENTS.md`](../AGENTS.md#use-latest-stable-versions))
- **Node.js Compatibility**: Support all supported Node.js versions (see [`AGENTS.md`](../AGENTS.md#published-packages-nodejs-compatibility))

## How Rules Are Applied

### Cursor

Cursor automatically reads:

- `AGENTS.md` files (root and `packages/`)
- `.cursor/rules/*.mdc` files

Rules in `.cursor/rules/` have metadata (like `alwaysApply: true`) and reference `AGENTS.md` for complete details.

### Other AI Agents

Other AI agents (like Claude Code) should read:

- `AGENTS.md` files directly
- This rules index for navigation

## Finding the Right Rule

### By Task

- **Creating a new package**: See [`AGENTS.md`](../AGENTS.md#creating-new-packages) and [`packages/AGENTS.md`](../packages/AGENTS.md)
- **Writing documentation**: See [`AGENTS.md`](../AGENTS.md#documentation-maintenance) and [`packages/AGENTS.md`](../packages/AGENTS.md)
- **Updating dependencies**: See [`AGENTS.md`](../AGENTS.md#use-latest-stable-versions)
- **Publishing a package**: See [`AGENTS.md`](../AGENTS.md#publishing-workflow)
- **Formatting code**: See [`AGENTS.md`](../AGENTS.md#code-style-and-formatting)

### By File Type

- **README files**: See [`packages/AGENTS.md`](../packages/AGENTS.md)
- **AGENTS.md files**: See this index and [`AGENTS.md`](../AGENTS.md)
- **package.json**: See [`AGENTS.md`](../AGENTS.md#packagejson-structure)
- **TypeScript configs**: See [`AGENTS.md`](../AGENTS.md#typescript-configuration)

## Validation

Use the validation scripts to ensure compliance:

- **Package validation**: `node scripts/validate-package.mjs packages/package-name`
- **Documentation validation**: `node scripts/validate-docs.mjs` (see [`scripts/validate-docs.mjs`](../scripts/validate-docs.mjs))

## Contributing

When adding new rules:

1. Add the rule to the appropriate `AGENTS.md` file
2. If Cursor-specific, create a `.cursor/rules/*.mdc` file
3. Update this index to reference the new rule
4. Ensure the rule follows existing patterns and structure

## Questions?

If you're unsure which rule applies:

1. Check this index for the relevant category
2. Read the referenced `AGENTS.md` section
3. Check existing examples in the codebase
4. Review similar packages or documentation
