#!/usr/bin/env node

import chalk from 'chalk';

import {
  createTestFile,
  execInTestProject,
  importFromTestEnv,
  initTestProject,
  installDependencies,
  testFileExists,
} from './utils.mjs';

const log = {
  info: (msg) => console.log(chalk.blue('ℹ'), msg),
  success: (msg) => console.log(chalk.green('✓'), msg),
  error: (msg) => {
    console.log(chalk.red('✗'), msg);
    throw new Error(msg);
  },
  section: (msg) => console.log(chalk.bold.cyan(`\n${msg}\n`)),
};

export async function testBuildToolConfigs(packages) {
  log.section('Testing Build Tool Config Packages');

  const buildToolPackages = packages.filter(
    (pkg) =>
      pkg.name.includes('tsup-config') ||
      pkg.name.includes('tsdown-config') ||
      pkg.name.includes('vite-config'),
  );

  if (buildToolPackages.length === 0) {
    log.info('No build tool config packages found, skipping');
    return;
  }

  for (const pkg of buildToolPackages) {
    await testBuildToolPackage(pkg, packages);
  }
}

async function testBuildToolPackage(pkg, allPackages) {
  log.section(`Testing ${pkg.name}`);

  try {
    // Initialize test project with all packages to resolve internal dependencies
    initTestProject(allPackages);

    // Determine dependencies based on package type
    const deps = {
      typescript: '^5.9.3',
    };

    if (pkg.name.includes('tsup-config')) {
      deps.tsup = '^8.5.1';
    } else if (pkg.name.includes('tsdown-config')) {
      deps.tsdown = '~0.23.0';
    } else if (pkg.name.includes('vite-config')) {
      deps.vite = '^6.0.0';
    }

    installDependencies(deps);

    // Test 1: Can import the config
    log.info('Test 1: Importing config...');
    const config = await importFromTestEnv(pkg.packageJson.name);
    if (!config) {
      throw new Error('Config does not export a default export');
    }
    log.success('Config imported successfully');

    // Test 2: Config has expected structure
    log.info('Test 2: Verifying config structure...');

    if (pkg.name.includes('tsup-config')) {
      // tsup config can be: a config object, a function, or export factory functions
      // Note: importFromTestEnv serializes functions as '[Function]' strings
      const hasFactoryFunctions =
        config.createTsupConfig === '[Function]' ||
        config.createTsupCliConfig === '[Function]';
      const isConfigObject = config.entry || typeof config.entry === 'object';
      const isFunction = config === '[Function]';

      if (!hasFactoryFunctions && !isConfigObject && !isFunction) {
        throw new Error(
          'tsup config should have entry, be a function, or export factory functions',
        );
      }
      log.success('tsup config structure is valid');
    } else if (pkg.name.includes('tsdown-config')) {
      if (
        config.createTsdownConfig !== '[Function]' ||
        config.createTsdownCliConfig !== '[Function]'
      ) {
        throw new Error(
          'tsdown config should export createTsdownConfig and createTsdownCliConfig',
        );
      }
      log.success('tsdown config structure is valid');
    } else if (pkg.name.includes('vite-config')) {
      // Vite config structure check
      if (typeof config !== 'object' && typeof config !== 'function') {
        throw new Error('Vite config should be an object or function');
      }
      log.success('vite config structure is valid');
    }

    // Test 3: Create a test config file that uses the package
    log.info('Test 3: Testing config file usage...');
    if (pkg.name.includes('tsup-config')) {
      // Check if package exports factory functions (serialized as '[Function]')
      const hasFactoryFunctions =
        config.createTsupConfig === '[Function]' ||
        config.createTsupCliConfig === '[Function]';

      if (hasFactoryFunctions) {
        // For factory function exports, create a config that calls the factory
        createTestFile(
          'tsup.config.ts',
          `import { createTsupConfig } from '${pkg.name}';

export default createTsupConfig({
  entry: ['src/index.ts'],
});
`,
        );
      } else {
        // For direct config exports, spread the config
        createTestFile(
          'tsup.config.ts',
          `import { defineConfig } from 'tsup';
import baseConfig from '${pkg.name}';

export default defineConfig({
  ...baseConfig,
  entry: ['src/index.ts'],
});
`,
        );
      }
    } else if (pkg.name.includes('tsdown-config')) {
      testTsdownBuild(pkg);
    } else if (pkg.name.includes('vite-config')) {
      createTestFile(
        'vite.config.ts',
        `import { defineConfig } from 'vite';
import baseConfig from '${pkg.name}';

export default defineConfig({
  ...baseConfig,
});
`,
      );
    }

    log.success('Config file structure is valid');

    log.success(`✅ All tests passed for ${pkg.name}\n`);
  } catch (error) {
    log.error(`❌ Tests failed for ${pkg.name}: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    throw error;
  }
}

/**
 * Run a real tsdown build and check that the output file names match the
 * `exports` layout our packages publish (.js/.cjs/.d.ts/.d.cts)
 */
function testTsdownBuild(pkg) {
  createTestFile(
    'src/index.ts',
    `export const greet = (name: string): string => \`hello \${name}\`;
`,
  );
  createTestFile(
    'tsconfig.json',
    JSON.stringify({
      compilerOptions: {
        target: 'es2022',
        module: 'preserve',
        moduleResolution: 'bundler',
        strict: true,
        skipLibCheck: true,
      },
      include: ['src'],
    }),
  );
  createTestFile(
    'tsdown.config.ts',
    `import { createTsdownConfig } from '${pkg.name}';

export default createTsdownConfig();
`,
  );

  execInTestProject('pnpm exec tsdown', { stdio: 'inherit' });

  const expectedFiles = [
    'dist/index.js',
    'dist/index.cjs',
    'dist/index.d.ts',
    'dist/index.d.cts',
  ];
  const missingFiles = expectedFiles.filter((file) => !testFileExists(file));
  if (missingFiles.length > 0) {
    throw new Error(`tsdown build is missing: ${missingFiles.join(', ')}`);
  }
  log.success('tsdown build emitted .js, .cjs, .d.ts and .d.cts');
}
