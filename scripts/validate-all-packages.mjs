#!/usr/bin/env node

/**
 * Root-level validation script
 * Validates all packages in the monorepo
 */

import { execSync } from 'child_process';
import { readdirSync, readFileSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packagesDir = join(__dirname, '..', 'packages');
const validateScript = join(__dirname, 'validate-package.mjs');

console.log('Validating all packages...\n');

// Get all package directories
const packages = readdirSync(packagesDir).filter((item) => {
  const itemPath = join(packagesDir, item);
  return statSync(itemPath).isDirectory();
});

let failed = 0;
const results = [];

// Validate each package
for (const pkg of packages) {
  const packagePath = join(packagesDir, pkg);

  // Skip private packages (they shouldn't be published)
  try {
    const pkgJsonPath = join(packagePath, 'package.json');
    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
    if (pkgJson.private === true) {
      results.push({ package: pkg, status: '⏭️ ' });
      continue;
    }
  } catch (error) {
    // If we can't read package.json, try to validate anyway
  }

  try {
    execSync(`node "${validateScript}" "${packagePath}"`, {
      stdio: 'inherit',
      cwd: packagePath,
    });
    results.push({ package: pkg, status: '✅' });
  } catch (error) {
    results.push({ package: pkg, status: '❌' });
    failed++;
  }
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('Validation Summary:');
console.log('='.repeat(50));

results.forEach(({ package: pkg, status }) => {
  console.log(`${status} ${pkg}`);
});

console.log('='.repeat(50));
console.log(`Total: ${packages.length} packages`);
console.log(`Passed: ${packages.length - failed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  console.log('\n❌ Some packages failed validation');
  process.exit(1);
} else {
  console.log('\n✅ All packages passed validation');
}
