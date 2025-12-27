#!/usr/bin/env node

import { execSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');
const rootDir = resolve(__dirname, '../../..');
const packagesDir = join(rootDir, 'packages');
// Use system temp directory to avoid workspace interference
const testDir = join(tmpdir(), 'jmlweb-integration-tests');
const packedDir = join(rootDir, 'packed');

/**
 * Create a temporary test environment
 */
export function createTestEnvironment() {
  if (existsSync(testDir)) {
    rmSync(testDir, { recursive: true, force: true });
  }
  mkdirSync(testDir, { recursive: true });
}

/**
 * Clean up test environment
 */
export function cleanupTestEnvironment() {
  if (existsSync(testDir)) {
    rmSync(testDir, { recursive: true, force: true });
  }
}

/**
 * Pack all packages in the monorepo
 */
export function packPackages() {
  console.log('📦 Packing packages...');

  // Ensure packed directory exists
  if (!existsSync(packedDir)) {
    mkdirSync(packedDir, { recursive: true });
  } else {
    // Clean existing packed files
    rmSync(packedDir, { recursive: true, force: true });
    mkdirSync(packedDir, { recursive: true });
  }

  const packages = getPackageDirectories();
  const packedPackages = [];

  for (const pkgDir of packages) {
    const pkgJsonPath = join(pkgDir, 'package.json');
    if (!existsSync(pkgJsonPath)) continue;

    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
    const pkgName = pkgJson.name;

    // Skip private packages (like tsconfig-internal)
    if (pkgJson.private) {
      console.log(`  ⏭️  Skipping private package: ${pkgName}`);
      continue;
    }

    console.log(`  📦 Packing ${pkgName}...`);
    try {
      execSync(`pnpm pack --pack-destination "${packedDir}"`, {
        cwd: pkgDir,
        stdio: 'inherit',
      });

      // Find the tarball - pnpm pack creates: @scope/package-name -> jmlweb-package-name-version.tgz
      const tarballPattern = pkgName.replace('@jmlweb/', 'jmlweb-');

      // Use find to get tarball files more reliably
      const tarballFiles = execSync(
        `find "${packedDir}" -name "${tarballPattern}-*.tgz" -type f`,
        {
          encoding: 'utf-8',
          shell: true,
        },
      )
        .trim()
        .split('\n')
        .filter((line) => line.trim());

      if (tarballFiles.length > 0) {
        const tarball = tarballFiles[0].trim();
        if (existsSync(tarball)) {
          // Store absolute path for use
          packedPackages.push({
            name: pkgName,
            path: tarball,
            packageJson: pkgJson,
            relativePath: `../../packed/${tarball.split('/').pop()}`,
          });
        } else {
          throw new Error(`Tarball file does not exist: ${tarball}`);
        }
      } else {
        // List files in packed dir for debugging
        const filesInPacked = execSync(`ls -la "${packedDir}"`, {
          encoding: 'utf-8',
          shell: true,
        }).trim();
        throw new Error(
          `Tarball not found for ${pkgName}. Pattern: ${tarballPattern}-*.tgz\nFiles in packed dir:\n${filesInPacked}`,
        );
      }
    } catch (error) {
      console.error(`  ❌ Failed to pack ${pkgName}:`, error.message);
      throw error;
    }
  }

  console.log(`✅ Packed ${packedPackages.length} packages\n`);
  return packedPackages;
}

/**
 * Get all package directories
 */
function getPackageDirectories() {
  const packageDirs = [];

  try {
    const entries = readdirSync(packagesDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        packageDirs.push(join(packagesDir, entry.name));
      }
    }
  } catch (error) {
    throw new Error(`Failed to read packages directory: ${error.message}`);
  }

  return packageDirs;
}

/**
 * Initialize a test project with package.json
 */
export function initTestProject(packages = []) {
  const packageJson = {
    name: 'test-project',
    version: '1.0.0',
    type: 'module',
    private: true,
  };

  // Add dependencies from packed packages
  if (packages.length > 0) {
    packageJson.dependencies = {};
    for (const pkg of packages) {
      // Use absolute path to packed tarball since test dir is in system temp
      packageJson.dependencies[pkg.name] = `file:${pkg.path}`;
    }
  }

  writeFileSync(
    join(testDir, 'package.json'),
    JSON.stringify(packageJson, null, 2),
  );

  // Create pnpm-workspace.yaml to isolate test environment from parent workspace
  // This prevents pnpm from treating test-env as part of the monorepo workspace
  writeFileSync(
    join(testDir, 'pnpm-workspace.yaml'),
    'packages:\n  # No packages - this is an isolated test environment\n',
  );
}

/**
 * Install dependencies in test project
 */
export function installDependencies(additionalDeps = {}) {
  console.log('📥 Installing dependencies...');

  // Read current package.json
  const packageJsonPath = join(testDir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  // Add additional dependencies
  packageJson.dependencies = {
    ...packageJson.dependencies,
    ...additionalDeps,
  };

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  try {
    execSync('pnpm install --no-frozen-lockfile', {
      cwd: testDir,
      stdio: 'inherit',
    });
    console.log('✅ Dependencies installed\n');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    throw error;
  }
}

/**
 * Create a test file
 */
export function createTestFile(filename, content) {
  const filePath = join(testDir, filename);
  const dir = resolve(filePath, '..');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(filePath, content);
  return filePath;
}

/**
 * Import a module from the test environment
 * This runs the import from within the test directory context to resolve from test node_modules
 */
export async function importFromTestEnv(packageName) {
  // Create a temporary script in the test directory that imports and outputs the module
  const scriptPath = join(testDir, '__import-helper.mjs');
  const script = `
import pkg from '${packageName}';

// Custom JSON serializer that handles functions and symbols
function serialize(obj, seen = new WeakSet()) {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'function') {
    return '[Function]';
  }

  if (typeof obj === 'symbol') {
    return obj.toString();
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  if (seen.has(obj)) {
    return '[Circular]';
  }

  seen.add(obj);

  if (Array.isArray(obj)) {
    return obj.map(item => serialize(item, seen));
  }

  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = serialize(obj[key], seen);
    }
  }
  return result;
}

console.log(JSON.stringify(serialize(pkg), null, 2));
  `.trim();

  writeFileSync(scriptPath, script);

  try {
    const output = execSync(`node __import-helper.mjs`, {
      cwd: testDir,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'inherit'], // Show stderr for debugging
    });
    rmSync(scriptPath);
    return JSON.parse(output);
  } catch (error) {
    if (existsSync(scriptPath)) {
      rmSync(scriptPath);
    }
    throw error;
  }
}

/**
 * Execute a command in the test project
 */
export function execInTestProject(command, options = {}) {
  return execSync(command, {
    cwd: testDir,
    encoding: 'utf-8',
    ...options,
  });
}

/**
 * Read a file from the test project
 */
export function readTestFile(filename) {
  return readFileSync(join(testDir, filename), 'utf-8');
}

/**
 * Check if a file exists in the test project
 */
export function testFileExists(filename) {
  return existsSync(join(testDir, filename));
}
