# SPECS

## INTRODUCTION

This project is a monorepo built with Turborepo to centralize and share personal configuration packages for development tools. The goal is to maintain consistent code formatting, linting, and TypeScript configuration across multiple projects by publishing reusable configuration packages.

By centralizing these configurations, we can:

- Ensure consistency across all projects
- Make updates in one place and propagate them easily
- Share best practices and standards
- Reduce boilerplate configuration in individual projects

The monorepo uses Turborepo for efficient build orchestration and task management across packages.

## OBJECTIVES

The main objectives of this project are:

1. **Centralize Configuration**: Create a single source of truth for development tool configurations
2. **Reusability**: Enable easy reuse of configurations across multiple projects
3. **Maintainability**: Simplify updates and maintenance of shared configurations
4. **Consistency**: Ensure uniform code style and tooling across all projects
5. **Publishing**: Make configurations available as npm packages for easy installation

## PACKAGES

The initial phase focuses on Prettier configuration packages:

### `@jmlweb/prettier-config-base`

Base Prettier configuration package that provides shared formatting rules. This package includes the following configuration:

- `semi: true` - Use semicolons at the end of statements
- `singleQuote: true` - Use single quotes instead of double quotes
- `tabWidth: 2` - Use 2 spaces for indentation
- `trailingComma: 'all'` - Add trailing commas wherever possible
- `useTabs: false` - Use spaces instead of tabs
- `endOfLine: 'lf'` - Use LF line endings
- `proseWrap: 'preserve'` - Preserve prose wrapping in markdown files

This base configuration serves as the foundation for all other Prettier packages.

### `@jmlweb/prettier-config-tailwind`

Extends `@jmlweb/prettier-config-base` by adding the Tailwind CSS Prettier plugin. This package inherits all base configuration options and adds Tailwind-specific formatting capabilities.

**Relationship**: The Tailwind package uses the `extends` mechanism to inherit from the base configuration, ensuring consistency while adding framework-specific functionality.

**Package Naming**: The naming convention (`@jmlweb/prettier-config-*`) allows for future extensibility. Additional packages can be created following the same pattern (e.g., `@jmlweb/prettier-config-react`, `@jmlweb/prettier-config-vue`) that extend either the base or other specific configurations.

### `@jmlweb/eslint-config-base-js`

Base ESLint configuration for JavaScript-only projects. Uses ESLint 9+ flat config format with:

- ESLint recommended rules
- Automatic import/export sorting via `eslint-plugin-simple-import-sort`
- Prettier conflict resolution via `eslint-config-prettier`

This package serves as the foundation that TypeScript configurations extend.

### `@jmlweb/eslint-config-base`

Extends `@jmlweb/eslint-config-base-js` with strict TypeScript support:

- Strict type checking (`strictTypeChecked` + `stylisticTypeChecked`)
- Enforces explicit return types and prevents `any` usage
- Consistent type-only imports with inline style
- Naming conventions (PascalCase for types, camelCase for variables)
- Prevents enum usage (prefer const maps)
- Requires Node.js >= 20.11.0 for `import.meta.dirname` support

**Relationship**: The TypeScript config extends the JavaScript base, ensuring all JavaScript rules apply while adding TypeScript-specific strict rules.

### `@jmlweb/tsconfig-base`

Base TypeScript configuration with strict type checking and modern defaults:

- `strict: true` - Enable all strict type checking options
- `target: ES2022` - Modern JavaScript target
- `module: NodeNext` - Node.js ESM module resolution
- `verbatimModuleSyntax: true` - Enforce explicit type-only imports
- `skipLibCheck: true` - Skip type checking of declaration files
- `noUncheckedIndexedAccess: true` - Require undefined checks for indexed access

This base configuration provides a solid foundation for TypeScript projects with emphasis on type safety.

### `@jmlweb/tsconfig-internal`

Internal TypeScript configuration for building packages within the monorepo. This is a private package (not published to npm) optimized for:

- Building packages with tsup/esbuild
- Dual CJS/ESM output
- Type declaration generation

**Note**: This package is for internal monorepo use only. For consuming projects, use `@jmlweb/tsconfig-base` instead.

### `@jmlweb/tsconfig-node`

TypeScript configuration for Node.js and CLI projects:

- Extends `@jmlweb/tsconfig-base`
- Excludes DOM types (`lib: ["ES2022"]`)
- Optimized for Node.js APIs and environments
- Suitable for backend services, CLI tools, and Node.js libraries

### `@jmlweb/tsconfig-react`

TypeScript configuration for React libraries with JSX support:

- Extends `@jmlweb/tsconfig-base`
- JSX support with `react-jsx` transform
- Suitable for React component libraries

### `@jmlweb/tsconfig-nextjs`

TypeScript configuration for Next.js applications:

- Extends `@jmlweb/tsconfig-react`
- Next.js plugin support
- Path aliases configuration
- SSR-compatible settings

### `@jmlweb/eslint-config-react`

ESLint configuration for React projects with TypeScript:

- Extends `@jmlweb/eslint-config-base`
- React and React Hooks rules
- Accessibility (a11y) rules
- JSX-specific linting

### `@jmlweb/vitest-config`

Base Vitest configuration for testing:

- TypeScript support
- Coverage settings
- Sensible test defaults
- Factory function for customization

### `@jmlweb/tsup-config-base`

Base tsup configuration for building TypeScript packages:

- Dual CJS/ESM output
- Type declaration generation
- External dependency handling
- Clean output directory

### `@jmlweb/vite-config`

Base Vite configuration for frontend projects:

- TypeScript support
- Build optimization
- Development server settings
- Optional React integration via helper function

### `@jmlweb/postcss-config`

PostCSS configuration for Tailwind CSS projects:

- Tailwind CSS plugin
- Autoprefixer for vendor prefixes
- Zero configuration needed

### `@jmlweb/commitlint-config`

Commitlint configuration for enforcing Conventional Commits:

- Predefined commit types and scopes
- Customizable options
- Integration with husky for Git hooks

## PROJECT STRUCTURE

The monorepo follows a standard Turborepo structure:

```text
jmlweb-tooling/
├── packages/
│   ├── prettier-config-base/
│   ├── prettier-config-tailwind/
│   ├── eslint-config-base-js/
│   ├── eslint-config-base/
│   ├── eslint-config-react/
│   ├── tsconfig-base/
│   ├── tsconfig-node/
│   ├── tsconfig-react/
│   ├── tsconfig-nextjs/
│   ├── tsconfig-internal/ (private, internal use only)
│   ├── vitest-config/
│   ├── tsup-config-base/
│   ├── vite-config/
│   ├── postcss-config/
│   └── commitlint-config/
├── apps/
│   ├── test-app/ (testing and validation)
│   ├── example-nodejs-typescript-api/
│   ├── example-react-typescript-app/
│   └── example-nodejs-javascript/
├── turbo.json
├── package.json
└── docs/
    ├── SPECS.md
    └── README-TEMPLATE.md
```

- **packages/**: Contains all publishable configuration packages (and one private internal package)
- **apps/**: Contains test applications for validating packages
- **turbo.json**: Turborepo configuration for task orchestration
- **package.json**: Root package.json for workspace management

Each package in `packages/` is a standalone npm package that can be published independently, except for `tsconfig-internal` which is private and used only within the monorepo.

## STEPS

The project implementation follows these steps:

1. ~~**Create AI rules and documents**: Set up documentation and rules for AI-assisted development~~ ✅
   - ~~Create `AGENTS.md` with general AI guidelines~~
   - ~~Set up `.cursor/rules/` with project-specific rules~~

2. ~~**Polish this document**: Expand and refine the SPECS.md document~~ ✅

3. ~~**Initialize monorepo**: Set up the Turborepo structure~~ ✅
   - ~~Configure Turborepo with `turbo.json`~~
   - ~~Set up workspace configuration in root `package.json`~~
   - ~~Create initial package structure~~

4. ~~**Create Prettier packages**: Implement Prettier configuration packages~~ ✅
   - ~~Set up `@jmlweb/prettier-config-base`~~
   - ~~Set up `@jmlweb/prettier-config-tailwind`~~

5. ~~**Create ESLint packages**: Implement ESLint configuration packages~~ ✅
   - ~~Set up `@jmlweb/eslint-config-base-js` for JavaScript~~
   - ~~Set up `@jmlweb/eslint-config-base` for TypeScript (strict)~~

6. ~~**Testing and validation**: Ensure packages work correctly~~ ✅
   - ~~Test package installation and usage~~
   - ~~Verify configuration inheritance~~
   - ~~Validate formatting and linting behavior~~
   - ~~Create test app in `apps/test-app/` with validation scripts~~

7. **Publishing setup**: Prepare packages for npm publication
   - Configure npm publishing settings
   - Set up versioning strategy
   - Prepare package documentation

## FUTURE CONSIDERATIONS

This monorepo is designed to grow over time. Current progress and future packages:

### TypeScript Configuration

- ~~`@jmlweb/tsconfig-base`: Base TypeScript configuration~~ ✅
- ~~`@jmlweb/tsconfig-node`: TypeScript config for Node.js-specific projects~~ ✅
- ~~`@jmlweb/tsconfig-react`: TypeScript config for React projects~~ ✅
- ~~`@jmlweb/tsconfig-nextjs`: TypeScript config for Next.js applications~~ ✅

### ESLint Configuration

- ~~`@jmlweb/eslint-config-base`: Base ESLint configuration for TypeScript projects (default)~~ ✅
- ~~`@jmlweb/eslint-config-base-js`: Base ESLint configuration for JavaScript-only projects~~ ✅
- ~~`@jmlweb/eslint-config-react`: ESLint config for React projects~~ ✅
- `@jmlweb/eslint-config-node`: ESLint config for Node.js-specific projects
- `@jmlweb/eslint-config-nextjs`: ESLint config for Next.js applications

### Testing Configuration

- ~~`@jmlweb/vitest-config`: Vitest testing configuration~~ ✅

### Build Tools

- ~~`@jmlweb/tsup-config-base`: tsup bundler configuration~~ ✅
- ~~`@jmlweb/vite-config`: Vite build configuration~~ ✅
- ~~`@jmlweb/postcss-config`: PostCSS configuration~~ ✅

### Git & Workflow

- ~~`@jmlweb/commitlint-config`: Commitlint configuration~~ ✅
- `@jmlweb/lint-staged-config`: lint-staged configuration

### Additional Prettier Packages

- Framework-specific configurations (React, Vue, etc.) as needed
- Library-specific configurations as needed

The modular structure allows for easy addition of new packages while maintaining consistency through shared base configurations.

## PUBLISHING

All non-internal packages will be published to npm under the `@jmlweb` scope prefix, which corresponds to the username. This ensures:

- Clear ownership and identification
- Namespace organization
- Easy discovery and installation

**Versioning Strategy**: Packages follow semantic versioning (semver) and use [Changesets](https://github.com/changesets/changesets) for automated versioning and changelog generation. The workflow:

1. Developers create changesets using `pnpm changeset` after making changes
2. When changes are merged to `main`, CI automatically versions packages and generates changelogs
3. Packages with new versions are automatically published to npm

See `AGENTS.md` for detailed publishing workflow documentation.

**Example package names**:

- `@jmlweb/prettier-config-base`
- `@jmlweb/prettier-config-tailwind`
