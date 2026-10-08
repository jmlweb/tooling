import type { DepsConfig, Rolldown, UserConfig } from 'tsdown';

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
 * tsdown's dependency options (`deps`)
 */
export type DepsOptions = DepsConfig;

/**
 * Keys of tsdown's `UserConfig` controlled by the helpers' top-level options
 */
type ManagedKeys = 'entry' | 'format' | 'dts' | 'clean' | 'outDir';

/**
 * Additional tsdown options accepted by `createTsdownConfig`
 * @deprecated Pass tsdown options at the top level instead of in `options`.
 */
export type AdditionalOptions = Omit<UserConfig, ManagedKeys>;

/**
 * Additional tsdown options accepted by `createTsdownCliConfig`
 * @deprecated Pass tsdown options at the top level instead of in `options`.
 */
export type AdditionalCliOptions = Omit<UserConfig, ManagedKeys | 'target'>;

/**
 * tsdown options accepted at the top level, besides the ones the helpers
 * document themselves. tsdown's own `external` is replaced by the helpers'
 * deprecated alias
 */
type TopLevelOptions = Omit<UserConfig, ManagedKeys | 'external'>;

/**
 * Thrown when the helpers receive options that cannot be combined
 */
export class TsdownConfigError extends Error {
  override name = 'TsdownConfigError';
}

/**
 * Options for creating a base tsdown configuration.
 * Accepts every tsdown option at the top level; the ones below have preset defaults
 */
export interface TsdownConfigOptions extends TopLevelOptions {
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
   * `deps.neverBundle`.
   * @deprecated Use `deps.neverBundle`, tsdown's own option.
   * @default []
   */
  external?: (string | RegExp)[];

  /**
   * Additional tsdown options to merge with the base configuration.
   * A key cannot be set both here and at the top level.
   * @deprecated Pass tsdown options at the top level instead.
   */
  options?: AdditionalOptions;
}

/**
 * Options for creating a CLI-specific tsdown configuration.
 * Accepts every tsdown option at the top level; the ones below have preset defaults
 */
export interface TsdownCliConfigOptions extends Omit<
  TopLevelOptions,
  'target'
> {
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
   * `deps.neverBundle`.
   * @deprecated Use `deps.neverBundle`, tsdown's own option.
   * @default []
   */
  external?: (string | RegExp)[];

  /**
   * Node.js target version for the build
   * When omitted, tsdown infers it from `engines.node` in `package.json`
   */
  target?: NodeTarget | UserConfig['target'];

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
   * Additional tsdown options to merge with the base configuration.
   * A key cannot be set both here and at the top level.
   * @deprecated Pass tsdown options at the top level instead.
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
      '`external` and `deps.neverBundle` cannot be used together. Move the `external` entries to `deps.neverBundle`.',
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
 * Merges the deprecated `options` bag with the top-level tsdown options.
 * A key set in both places is ambiguous, so it throws instead of picking one.
 * Undefined top-level keys are dropped so they don't override preset defaults
 */
const mergeTopLevel = <T extends object>(
  topLevel: T,
  options: object,
): T & UserConfig => {
  const definedTopLevel = Object.fromEntries(
    Object.entries(topLevel).filter(([, value]) => value !== undefined),
  ) as T;
  const conflicts = Object.keys(options).filter(
    (key) => key in definedTopLevel,
  );
  if (conflicts.length > 0) {
    throw new TsdownConfigError(
      `${conflicts.map((key) => `\`${key}\``).join(', ')} cannot be set both at the top level and in \`options\`. Move them to the top level.`,
    );
  }
  return { ...options, ...definedTopLevel };
};

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
 *   deps: { neverBundle: ['eslint', 'typescript-eslint', '@eslint/js'] },
 * });
 * ```
 *
 * @example
 * ```typescript
 * // With additional options
 * import { createTsdownConfig } from '@jmlweb/tsdown-config-base';
 * export default createTsdownConfig({
 *   deps: { neverBundle: ['vitest'] },
 *   minify: true,
 *   sourcemap: true,
 * });
 * ```
 */
export const createTsdownConfig = (
  config: TsdownConfigOptions = {},
): UserConfig => {
  const { external = [], options = {}, ...topLevel } = config;
  const { deps, checks, ...rest } = mergeTopLevel(topLevel, options);

  return {
    ...BASE_DEFAULTS,
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
 *   deps: { neverBundle: ['commander'] },
 * });
 * ```
 */
export const createTsdownCliConfig = (
  config: TsdownCliConfigOptions = {},
): UserConfig => {
  const {
    external = [],
    shebang = CLI_DEFAULTS.shebang,
    options = {},
    ...topLevel
  } = config;
  const { deps, checks, plugins, ...rest } = mergeTopLevel(topLevel, options);
  const { shebang: _shebang, ...defaults } = CLI_DEFAULTS;

  return {
    ...defaults,
    ...resolveChecks(checks),
    ...resolveShebang(shebang, plugins),
    ...resolveDeps(external, deps),
    ...rest,
  };
};

/**
 * Reads the entry sources in `buildStart` and records which ones already
 * start with a shebang. tsdown computes the banner before `renderChunk`, so
 * the source is the only place to find out in time
 */
const createOwnShebangDetector = (): {
  plugin: Rolldown.Plugin;
  hasOwnShebang: (entryName: string) => boolean;
} => {
  const entriesWithShebang = new Set<string>();

  return {
    plugin: {
      name: 'jmlweb:own-shebang',
      async buildStart({ input }) {
        entriesWithShebang.clear();
        if (Array.isArray(input)) {
          return;
        }
        await Promise.all(
          Object.entries(input).map(async ([entryName, file]) => {
            const resolved = await this.resolve(file, undefined, {
              isEntry: true,
            });
            const source = resolved
              ? await this.fs
                  .readFile(resolved.id, { encoding: 'utf8' })
                  .catch(() => '')
              : '';
            if (source.startsWith('#!')) {
              entriesWithShebang.add(entryName);
            }
          }),
        );
      },
    },
    hasOwnShebang: (entryName) => entriesWithShebang.has(entryName),
  };
};

/**
 * Builds the `banner` option for the requested shebang entries, plus the
 * plugin that detects entries whose source already has one: adding a second
 * shebang would make the output a syntax error. tsdown passes each chunk's
 * file name to banner functions, so selective shebangs fit in a single config
 * instead of tsup's split configs.
 */
const resolveShebang = (
  shebang: boolean | string | string[],
  userPlugins: UserConfig['plugins'],
): Pick<UserConfig, 'banner' | 'plugins'> => {
  const shebangEntries = normalizeShebangConfig(shebang);
  const pluginsOnly = userPlugins === undefined ? {} : { plugins: userPlugins };

  if (shebangEntries !== 'all' && shebangEntries.length === 0) {
    return pluginsOnly;
  }

  const targets =
    shebangEntries === 'all' ? undefined : new Set(shebangEntries);
  const { plugin, hasOwnShebang } = createOwnShebangDetector();

  return {
    banner: ({ fileName }) => {
      const entryName = toEntryName(fileName);
      const isTarget = targets === undefined || targets.has(entryName);
      return isTarget && !hasOwnShebang(entryName)
        ? { js: SHEBANG }
        : undefined;
    },
    plugins: [plugin, userPlugins],
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
