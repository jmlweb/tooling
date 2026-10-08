import type { DepsConfig, UserConfig } from 'tsdown';

/**
 * Entry points configuration - can be an array of paths or an object mapping names to paths
 */
export type EntryConfig = string[] | Record<string, string>;

/**
 * Node.js target version for CLI builds
 */
export type NodeTarget =
  'node16' | 'node18' | 'node20' | 'node22' | 'node24' | `node${number}`;

/**
 * Output formats supported by tsdown
 */
export type OutputFormat = 'cjs' | 'esm' | 'iife' | 'umd';

/**
 * tsdown's dependency options, passed through `options.deps`
 */
export type DepsOptions = DepsConfig;

/**
 * Keys of tsdown's `UserConfig` controlled by the helpers' top-level options
 */
type ManagedKeys = 'entry' | 'format' | 'dts' | 'clean' | 'outDir';

/**
 * Additional tsdown options accepted by `createTsdownConfig`
 */
export type AdditionalOptions = Omit<UserConfig, ManagedKeys>;

/**
 * Additional tsdown options accepted by `createTsdownCliConfig`
 */
export type AdditionalCliOptions = Omit<UserConfig, ManagedKeys | 'target'>;

/**
 * Thrown when the helpers receive options that cannot be combined
 */
export class TsdownConfigError extends Error {
  override name = 'TsdownConfigError';
}

/**
 * Options for creating a base tsdown configuration
 */
export interface TsdownConfigOptions {
  /**
   * Entry points for the build
   * Can be an array of paths or an object mapping output names to source paths
   * @default ['src/index.ts']
   * @example
   * ```typescript
   * // Array format
   * entry: ['src/index.ts', 'src/cli.ts']
   *
   * // Object format (named entries)
   * entry: { index: 'src/index.ts', cli: 'src/cli.ts' }
   * ```
   */
  entry?: EntryConfig;

  /**
   * Output formats
   * @default ['cjs', 'esm']
   */
  format?: OutputFormat[];

  /**
   * Generate TypeScript declaration files
   * Accepts tsdown's declaration options too, e.g. `{ generator: 'oxc' }`
   * @default true
   */
  dts?: UserConfig['dts'];

  /**
   * Clean output directory before build
   * @default true
   */
  clean?: boolean;

  /**
   * Output directory
   * @default 'dist'
   */
  outDir?: string;

  /**
   * External packages to exclude from the bundle
   * Mapped to tsdown's `deps.neverBundle`. Cannot be combined with
   * `options.deps.neverBundle`.
   * @deprecated Use `options.deps.neverBundle`, tsdown's own option.
   * @default []
   */
  external?: (string | RegExp)[];

  /**
   * Additional tsdown options to merge with the base configuration
   */
  options?: AdditionalOptions;
}

/**
 * Options for creating a CLI-specific tsdown configuration
 */
export interface TsdownCliConfigOptions {
  /**
   * Entry points for the build
   * Can be an array of paths or an object mapping output names to source paths
   * @default { cli: 'src/cli.ts' }
   * @example
   * ```typescript
   * // Single CLI entry
   * entry: { cli: 'src/cli.ts' }
   *
   * // CLI with library API
   * entry: { cli: 'src/cli.ts', index: 'src/index.ts' }
   *
   * // Array format
   * entry: ['src/cli.ts', 'src/index.ts']
   * ```
   */
  entry?: EntryConfig;

  /**
   * Output formats
   * @default ['esm']
   */
  format?: OutputFormat[];

  /**
   * Generate TypeScript declaration files
   * Accepts tsdown's declaration options too, e.g. `{ generator: 'oxc' }`
   * @default true
   */
  dts?: UserConfig['dts'];

  /**
   * Clean output directory before build
   * @default true
   */
  clean?: boolean;

  /**
   * Output directory
   * @default 'dist'
   */
  outDir?: string;

  /**
   * External packages to exclude from the bundle
   * Mapped to tsdown's `deps.neverBundle`. Cannot be combined with
   * `options.deps.neverBundle`.
   * @deprecated Use `options.deps.neverBundle`, tsdown's own option.
   * @default []
   */
  external?: (string | RegExp)[];

  /**
   * Node.js target version for the build
   * When omitted, tsdown infers it from `engines.node` in `package.json`
   */
  target?: NodeTarget;

  /**
   * Add shebang (#!/usr/bin/env node) to the output
   * When true, adds shebang to all entry points
   * When a string or array, only adds shebang to matching entry names
   * @default true
   * @example
   * ```typescript
   * // Add shebang to all entries
   * shebang: true
   *
   * // Add shebang only to 'cli' entry
   * shebang: 'cli'
   *
   * // Add shebang to specific entries
   * shebang: ['cli', 'bin']
   * ```
   */
  shebang?: boolean | string | string[];

  /**
   * Additional tsdown options to merge with the base configuration
   */
  options?: AdditionalCliOptions;
}

/**
 * Base tsdown configuration defaults used across all @jmlweb packages
 */
const BASE_DEFAULTS = {
  entry: ['src/index.ts'] as EntryConfig,
  format: ['cjs', 'esm'] as OutputFormat[],
  dts: true as UserConfig['dts'],
  clean: true,
  outDir: 'dist',
  // tsdown defaults to `.mjs`/`.cjs` on the node platform; keep tsup's
  // package-type-based extensions so existing `exports` maps keep working
  fixedExtension: false,
} satisfies Partial<UserConfig>;

/**
 * CLI-specific tsdown configuration defaults
 */
const CLI_DEFAULTS = {
  entry: { cli: 'src/cli.ts' } as EntryConfig,
  format: ['esm'] as OutputFormat[],
  dts: true as UserConfig['dts'],
  clean: true,
  outDir: 'dist',
  fixedExtension: false,
  shebang: true as boolean | string | string[],
} satisfies Partial<UserConfig> & {
  shebang: boolean | string | string[];
};

/**
 * Builds the `deps` option, mapping the deprecated `external` to
 * `deps.neverBundle`. Like tsdown with its own `external`, refuses to merge
 * both sources silently.
 */
const resolveDeps = (
  external: (string | RegExp)[],
  deps: DepsOptions | undefined,
): Pick<UserConfig, 'deps'> => {
  if (external.length === 0) {
    return deps ? { deps } : {};
  }
  if (deps?.neverBundle !== undefined) {
    throw new TsdownConfigError(
      '`external` and `options.deps.neverBundle` cannot be used together. Move the `external` entries to `options.deps.neverBundle`.',
    );
  }
  return { deps: { ...deps, neverBundle: external } };
};

/**
 * Builds the `checks` option. Dual CJS/ESM output is a deliberate choice of
 * these presets, so tsdown's `legacyCjs` warning (emitted whenever the target
 * supports `require(esm)`, i.e. every supported Node.js version) is noise
 */
const resolveChecks = (
  checks: UserConfig['checks'],
): Pick<UserConfig, 'checks'> => ({
  checks: { legacyCjs: false, ...checks },
});

/**
 * Creates a base tsdown configuration with sensible defaults
 *
 * @example
 * ```typescript
 * // Simple usage without externals
 * import { createTsdownConfig } from '@jmlweb/tsdown-config-base';
 * export default createTsdownConfig();
 * ```
 *
 * @example
 * ```typescript
 * // With external dependencies
 * import { createTsdownConfig } from '@jmlweb/tsdown-config-base';
 * export default createTsdownConfig({
 *   options: {
 *     deps: { neverBundle: ['eslint', 'typescript-eslint', '@eslint/js'] },
 *   },
 * });
 * ```
 *
 * @example
 * ```typescript
 * // With additional options
 * import { createTsdownConfig } from '@jmlweb/tsdown-config-base';
 * export default createTsdownConfig({
 *   options: {
 *     deps: { neverBundle: ['vitest'] },
 *     minify: true,
 *     sourcemap: true,
 *   },
 * });
 * ```
 */
export const createTsdownConfig = (
  config: TsdownConfigOptions = {},
): UserConfig => {
  const {
    entry = BASE_DEFAULTS.entry,
    format = BASE_DEFAULTS.format,
    dts = BASE_DEFAULTS.dts,
    clean = BASE_DEFAULTS.clean,
    outDir = BASE_DEFAULTS.outDir,
    external = [],
    options = {},
  } = config;
  const { deps, checks, ...rest } = options;

  return {
    entry,
    format,
    dts,
    clean,
    outDir,
    fixedExtension: BASE_DEFAULTS.fixedExtension,
    ...resolveChecks(checks),
    ...resolveDeps(external, deps),
    ...rest,
  };
};

/**
 * Shebang line for Node.js CLI executables
 */
const SHEBANG = '#!/usr/bin/env node';

/**
 * Creates a CLI-specific tsdown configuration with shebang support
 *
 * This preset is optimized for CLI packages with:
 * - ESM-only output by default
 * - Automatic shebang injection
 * - Node.js target inferred from `engines.node` (override with `target`)
 * - Support for object-style entry points
 *
 * @example
 * ```typescript
 * // Simple CLI with shebang
 * import { createTsdownCliConfig } from '@jmlweb/tsdown-config-base';
 * export default createTsdownCliConfig();
 * ```
 *
 * @example
 * ```typescript
 * // CLI with library API (shebang only on cli entry)
 * import { createTsdownCliConfig } from '@jmlweb/tsdown-config-base';
 * export default createTsdownCliConfig({
 *   entry: { cli: 'src/cli.ts', index: 'src/index.ts' },
 *   shebang: 'cli', // Only add shebang to cli entry
 * });
 * ```
 *
 * @example
 * ```typescript
 * // CLI targeting Node.js 22
 * import { createTsdownCliConfig } from '@jmlweb/tsdown-config-base';
 * export default createTsdownCliConfig({
 *   target: 'node22',
 *   options: { deps: { neverBundle: ['commander'] } },
 * });
 * ```
 */
export const createTsdownCliConfig = (
  config: TsdownCliConfigOptions = {},
): UserConfig => {
  const {
    entry = CLI_DEFAULTS.entry,
    format = CLI_DEFAULTS.format,
    dts = CLI_DEFAULTS.dts,
    clean = CLI_DEFAULTS.clean,
    outDir = CLI_DEFAULTS.outDir,
    external = [],
    target,
    shebang = CLI_DEFAULTS.shebang,
    options = {},
  } = config;
  const { deps, checks, ...rest } = options;

  return {
    entry,
    format,
    dts,
    clean,
    outDir,
    fixedExtension: CLI_DEFAULTS.fixedExtension,
    ...(target ? { target } : {}),
    ...resolveChecks(checks),
    ...resolveBanner(shebang),
    ...resolveDeps(external, deps),
    ...rest,
  };
};

/**
 * Builds the `banner` option for the requested shebang entries.
 * tsdown passes each chunk's file name to banner functions, so selective
 * shebangs fit in a single config instead of tsup's split configs.
 */
const resolveBanner = (
  shebang: boolean | string | string[],
): Pick<UserConfig, 'banner'> => {
  const shebangEntries = normalizeShebangConfig(shebang);

  if (shebangEntries === 'all') {
    return { banner: { js: SHEBANG } };
  }

  if (shebangEntries.length === 0) {
    return {};
  }

  const shebangSet = new Set(shebangEntries);

  return {
    banner: ({ fileName }) =>
      shebangSet.has(toEntryName(fileName)) ? { js: SHEBANG } : undefined,
  };
};

/**
 * Strip the JS extension from an output file name (e.g., 'bin/cli.js' -> 'bin/cli')
 */
const toEntryName = (fileName: string): string =>
  fileName.replace(/\.[cm]?js$/, '');

/**
 * Normalize shebang config to determine which entries need shebang
 * Returns 'all' if all entries need shebang, or array of entry names
 */
const normalizeShebangConfig = (
  shebang: boolean | string | string[],
): 'all' | string[] => {
  if (shebang === true) {
    return 'all';
  }
  if (shebang === false) {
    return [];
  }
  if (typeof shebang === 'string') {
    return [shebang];
  }
  return shebang;
};

/**
 * Re-export the base defaults for reference
 */
export { BASE_DEFAULTS, CLI_DEFAULTS };

/**
 * Re-export tsdown's config type for convenience.
 * `Options` mirrors the name exported by `@jmlweb/tsup-config-base`.
 */
export type { UserConfig, UserConfig as Options } from 'tsdown';
