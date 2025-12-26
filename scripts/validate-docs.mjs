#!/usr/bin/env node

/**
 * Documentation Validation Script
 *
 * Validates documentation compliance across the monorepo:
 * - Checks for required AGENTS.md files
 * - Validates README structure in packages
 * - Checks documentation language (basic English check)
 * - Verifies required sections exist
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const errors = [];
const warnings = [];

// Required sections for package READMEs (from packages/AGENTS.md)
const REQUIRED_README_SECTIONS = [
  { name: 'Title and Badges', patterns: [/# @jmlweb\/[\w-]+/] },
  { name: 'Description', patterns: [/^> /m] },
  { name: 'Features', patterns: [/## ✨ Features/i] },
  { name: 'Installation', patterns: [/## 📦 Installation/i] },
  { name: 'Quick Start', patterns: [/## 🚀 Quick Start/i] },
  { name: 'Examples', patterns: [/## 💡 Examples/i] },
  {
    name: 'Configuration',
    patterns: [/## 📋 Configuration/i, /## Configuration/i],
  },
  { name: 'When to Use', patterns: [/## 🎯 When to Use/i] },
  { name: 'Extending', patterns: [/## 🔧 Extending/i] },
  { name: 'Usage with Scripts', patterns: [/## 📝 Usage with Scripts/i] },
  { name: 'Requirements', patterns: [/## 📋 Requirements/i] },
  { name: 'Peer Dependencies', patterns: [/## 📦 Peer Dependencies/i] },
  { name: 'Related Packages', patterns: [/## 🔗 Related Packages/i] },
  { name: 'License', patterns: [/## 📄 License/i, /## License/i] },
];

// Basic English word patterns (simple heuristic)
const NON_ENGLISH_PATTERNS = [
  /[àáâãäåæçèéêëìíîïñòóôõöùúûüýÿ]/i, // Accented characters
];

/**
 * Check if a file exists
 */
function fileExists(path) {
  return existsSync(path);
}

/**
 * Read a file and return its content
 */
function readFile(path) {
  try {
    return readFileSync(path, 'utf-8');
  } catch (error) {
    return null;
  }
}

/**
 * Check if content contains non-English characters (basic check)
 */
function containsNonEnglish(content) {
  return NON_ENGLISH_PATTERNS.some((pattern) => pattern.test(content));
}

/**
 * Validate AGENTS.md file exists and has basic structure
 */
function validateAgentsFile(path, name) {
  if (!fileExists(path)) {
    errors.push(`Missing AGENTS.md file: ${name}`);
    return false;
  }

  const content = readFile(path);
  if (!content) {
    errors.push(`Cannot read AGENTS.md file: ${name}`);
    return false;
  }

  // Check for basic structure
  if (!content.includes('#') || content.trim().length < 100) {
    warnings.push(`AGENTS.md file seems incomplete: ${name}`);
  }

  // Check for non-English content (basic check)
  if (containsNonEnglish(content)) {
    warnings.push(`AGENTS.md may contain non-English content: ${name}`);
  }

  return true;
}

/**
 * Validate package README structure
 */
function validatePackageReadme(packagePath, packageName) {
  const readmePath = join(packagePath, 'README.md');

  if (!fileExists(readmePath)) {
    errors.push(`Missing README.md in package: ${packageName}`);
    return false;
  }

  const content = readFile(readmePath);
  if (!content) {
    errors.push(`Cannot read README.md in package: ${packageName}`);
    return false;
  }

  // Check for non-English content (basic check)
  if (containsNonEnglish(content)) {
    warnings.push(`README.md may contain non-English content: ${packageName}`);
  }

  // Check required sections
  const missingSections = [];
  for (const section of REQUIRED_README_SECTIONS) {
    const hasSection = section.patterns.some((pattern) =>
      pattern.test(content),
    );
    if (!hasSection) {
      missingSections.push(section.name);
    }
  }

  if (missingSections.length > 0) {
    // License is required, others might be optional in some cases
    if (missingSections.includes('License')) {
      errors.push(
        `Missing required 'License' section in README: ${packageName}`,
      );
    } else {
      warnings.push(
        `Missing sections in README (${missingSections.join(', ')}): ${packageName}`,
      );
    }
  }

  // Check for package name in title
  if (!content.match(/# @jmlweb\/[\w-]+/)) {
    warnings.push(
      `README title may not match package naming convention: ${packageName}`,
    );
  }

  return true;
}

/**
 * Validate root AGENTS.md
 */
function validateRootAgents() {
  const agentsPath = join(rootDir, 'AGENTS.md');
  validateAgentsFile(agentsPath, 'root');
}

/**
 * Validate packages/AGENTS.md
 */
function validatePackagesAgents() {
  const agentsPath = join(rootDir, 'packages', 'AGENTS.md');
  validateAgentsFile(agentsPath, 'packages');
}

/**
 * Validate all package READMEs
 */
function validatePackageReadmes() {
  const packagesDir = join(rootDir, 'packages');
  if (!fileExists(packagesDir)) {
    return;
  }

  const packages = readdirSync(packagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const packageName of packages) {
    const packagePath = join(packagesDir, packageName);
    const packageJsonPath = join(packagePath, 'package.json');

    // Only validate packages that have package.json
    if (fileExists(packageJsonPath)) {
      const packageJson = JSON.parse(readFile(packageJsonPath) || '{}');
      // Skip validation for private packages (they may have simpler READMEs)
      if (!packageJson.private) {
        validatePackageReadme(packagePath, packageName);
      } else {
        // For private packages, only check that License section exists
        const readmePath = join(packagePath, 'README.md');
        if (fileExists(readmePath)) {
          const content = readFile(readmePath);
          if (content && !/## 📄 License|## License/i.test(content)) {
            warnings.push(
              `Private package missing License section: ${packageName}`,
            );
          }
        }
      }
    }
  }
}

/**
 * Validate documentation files in docs/ directory
 */
function validateDocsDirectory() {
  const docsDir = join(rootDir, 'docs');
  if (!fileExists(docsDir)) {
    return;
  }

  const docsFiles = readdirSync(docsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith('.md'))
    .map((dirent) => dirent.name);

  for (const docFile of docsFiles) {
    const docPath = join(docsDir, docFile);
    const content = readFile(docPath);

    if (content && containsNonEnglish(content)) {
      warnings.push(
        `Documentation file may contain non-English content: docs/${docFile}`,
      );
    }
  }
}

/**
 * Main validation function
 */
function main() {
  console.log('📚 Validating documentation compliance...\n');

  // Validate AGENTS.md files
  console.log('Checking AGENTS.md files...');
  validateRootAgents();
  validatePackagesAgents();

  // Validate package READMEs
  console.log('Checking package READMEs...');
  validatePackageReadmes();

  // Validate docs directory
  console.log('Checking docs directory...');
  validateDocsDirectory();

  // Report results
  console.log('\n' + '='.repeat(60));
  console.log('Validation Results');
  console.log('='.repeat(60));

  if (errors.length > 0) {
    console.log(`\n❌ Errors (${errors.length}):`);
    errors.forEach((error) => console.log(`  - ${error}`));
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${warnings.length}):`);
    warnings.forEach((warning) => console.log(`  - ${warning}`));
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('\n✅ All documentation checks passed!');
  }

  console.log('');

  // Exit with error code if there are errors
  process.exit(errors.length > 0 ? 1 : 0);
}

// Run validation
main();
