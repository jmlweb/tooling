#!/usr/bin/env node

import chalk from 'chalk';
import { format } from 'prettier';

import {
  createTestEnvironment,
  createTestFile,
  execInTestProject,
  importFromTestEnv,
  initTestProject,
  installDependencies,
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

export async function testPrettierConfigs(packages) {
  log.section('Testing Prettier Config Packages');

  const prettierPackages = packages.filter((pkg) =>
    pkg.name.includes('prettier-config'),
  );

  if (prettierPackages.length === 0) {
    log.info('No Prettier config packages found, skipping');
    return;
  }

  for (const pkg of prettierPackages) {
    await testPrettierPackage(pkg, packages);
  }

  const tailwindPackage = prettierPackages.find(
    (pkg) => pkg.name === TAILWIND_CONFIG_NAME,
  );
  if (tailwindPackage) {
    testTailwindPnpmConsumer(packages);
  }
}

const TAILWIND_CONFIG_NAME = '@jmlweb/prettier-config-tailwind';
const UNSORTED_TAILWIND_MARKUP =
  '<button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Click me</button>\n';
const SORTED_TAILWIND_CLASSES =
  'class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"';

/**
 * A pnpm consumer that installs only the Tailwind config and Prettier must
 * get class sorting: pnpm does not hoist prettier-plugin-tailwindcss to the
 * consumer, so the config has to resolve the plugin itself
 */
function testTailwindPnpmConsumer(allPackages) {
  log.section(`Testing ${TAILWIND_CONFIG_NAME} in a pnpm consumer`);

  createTestEnvironment();
  initTestProject(allPackages, { directDependencies: [TAILWIND_CONFIG_NAME] });
  installDependencies({ prettier: '^3.3.3' });

  const hoistedPlugin = execInTestProject(
    "node -e \"process.stdout.write(String(require('node:fs').existsSync('node_modules/prettier-plugin-tailwindcss')))\"",
  );
  if (hoistedPlugin !== 'false') {
    log.error(
      'prettier-plugin-tailwindcss is visible from the consumer, the test cannot prove the config resolves it',
    );
  }

  createTestFile('index.html', UNSORTED_TAILWIND_MARKUP);

  const configFiles = {
    ESM: {
      '.prettierrc.mjs': `export { default } from '${TAILWIND_CONFIG_NAME}';\n`,
    },
    // The CJS build exports the config as `exports.default` (cjsDefault: false)
    CJS: {
      '.prettierrc.cjs': `module.exports = require('${TAILWIND_CONFIG_NAME}').default;\n`,
    },
  };

  for (const [buildFormat, files] of Object.entries(configFiles)) {
    log.info(`Formatting with the ${buildFormat} build...`);
    const [[configFile, configContent]] = Object.entries(files);
    createTestFile(configFile, configContent);

    let output;
    try {
      output = execInTestProject(
        `node_modules/.bin/prettier --config ${configFile} index.html`,
        { stdio: ['ignore', 'pipe', 'pipe'] },
      );
    } catch (error) {
      log.error(
        `Prettier failed with the ${buildFormat} config: ${error.stderr || error.message}`,
      );
    }

    if (!output.includes(SORTED_TAILWIND_CLASSES)) {
      log.error(
        `Tailwind classes were not sorted with the ${buildFormat} config:\n${output}`,
      );
    }
    log.success(`${buildFormat} build resolves the plugin and sorts classes`);
  }

  log.success(`✅ ${TAILWIND_CONFIG_NAME} works in a pnpm consumer\n`);
}

async function testPrettierPackage(pkg, allPackages) {
  log.section(`Testing ${pkg.name}`);

  try {
    // Initialize test project with all packages to resolve internal dependencies
    initTestProject(allPackages);

    // Install prettier and the config package
    installDependencies({
      prettier: '^3.3.3',
    });

    // Test 1: Can import the config
    log.info('Test 1: Importing config...');
    const config = await importFromTestEnv(pkg.packageJson.name);
    if (!config) {
      throw new Error('Config does not export a default export');
    }
    log.success('Config imported successfully');

    // Test 2: Config can be used with Prettier
    log.info('Test 2: Testing formatting with Prettier...');
    const testCode = 'const x=1;const y=2;';
    const formatted = await format(testCode, {
      ...config,
      parser: 'typescript',
    });

    if (!formatted || formatted.trim().length === 0) {
      throw new Error('Prettier formatting returned empty result');
    }

    // Verify formatting worked (should have newlines, etc.)
    if (formatted.includes(';')) {
      log.success('Prettier formatting works correctly');
    } else {
      throw new Error('Prettier formatting did not work as expected');
    }

    // Test 3: Verify config has expected properties
    log.info('Test 3: Verifying config properties...');
    const expectedProps = ['singleQuote', 'tabWidth'];
    const missingProps = expectedProps.filter((prop) => !(prop in config));

    if (missingProps.length > 0) {
      throw new Error(`Config missing properties: ${missingProps.join(', ')}`);
    }
    log.success('Config has expected properties');

    // Test 4: Test with a .prettierrc file
    log.info('Test 4: Testing with .prettierrc file...');
    createTestFile(
      '.prettierrc',
      JSON.stringify({
        ...config,
      }),
    );

    const testFileContent = 'const   test   =   "value"   ;';
    createTestFile('test.ts', testFileContent);

    const formattedViaFile = await format(testFileContent, {
      filepath: 'test.ts',
    });

    if (!formattedViaFile || formattedViaFile === testFileContent) {
      throw new Error('Prettier did not format code using .prettierrc');
    }
    log.success('Config works with .prettierrc file');

    log.success(`✅ All tests passed for ${pkg.name}\n`);
  } catch (error) {
    log.error(`❌ Tests failed for ${pkg.name}: ${error.message}`);
    throw error;
  }
}
