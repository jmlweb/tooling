#!/usr/bin/env node

/* eslint-disable no-undef */

/**
 * Generate MDX documentation files from package READMEs
 * This script converts package READMEs to MDX format with proper frontmatter
 */

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '../../..');
const DOCS_CONTENT_DIR = join(__dirname, '../src/content/docs');

/**
 * Extract metadata from package.json
 */
function extractMetadata(packagePath) {
  const packageJsonPath = join(packagePath, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  return {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    repository: packageJson.repository?.url || packageJson.repository,
  };
}

/**
 * Transform relative links to absolute GitHub links or internal docs links
 */
function transformLinks(content, packageName) {
  let transformed = content;

  // Transform all CHANGELOG links to GitHub (both ./CHANGELOG.md and CHANGELOG.md)
  const pkgName = packageName.replace('@jmlweb/', '');
  transformed = transformed.replace(
    /\[([^\]]*CHANGELOG[^\]]*)\]\(\.\/CHANGELOG\.md\)/gi,
    `[$1](https://github.com/jmlweb/tooling/blob/main/packages/${pkgName}/CHANGELOG.md)`,
  );
  transformed = transformed.replace(
    /\[([^\]]*Changelog[^\]]*)\]\(\.\/CHANGELOG\.md\)/gi,
    `[$1](https://github.com/jmlweb/tooling/blob/main/packages/${pkgName}/CHANGELOG.md)`,
  );

  // Transform example app links (../../apps/example-*)
  transformed = transformed.replace(
    /\[([^\]]+)\]\(\.\.\/\.\.\/apps\/([^)]+)\)/g,
    (match, text, path) => {
      return `[${text}](https://github.com/jmlweb/tooling/tree/main/apps/${path})`;
    },
  );

  // Transform links to other packages (e.g., ../prettier-config-tailwind)
  // Pattern: [text](../package-name) -> [text](/category/simplified-name)
  transformed = transformed.replace(
    /\[([^\]]+)\]\(\.\.\/([^)]+)\)/g,
    (match, text, path) => {
      // Extract just the package name (e.g., "prettier-config-tailwind")
      const fullPackageName = path.replace(/^.*\//, '');

      // Determine category
      const category = categorizePackage(fullPackageName);

      // Simplify the name (e.g., "prettier-config-tailwind" -> "tailwind")
      let simplifiedName = fullPackageName.replace(
        /^(prettier-config-|eslint-config-|tsconfig-|tsup-config-)/,
        '',
      );

      // Handle special cases where the package name ends with -config
      if (fullPackageName === 'vitest-config') simplifiedName = 'vitest';
      if (fullPackageName === 'jest-config') simplifiedName = 'jest';
      if (fullPackageName === 'vite-config') simplifiedName = 'vite';
      if (fullPackageName === 'commitlint-config')
        simplifiedName = 'commitlint';

      return `[${text}](/${category}/${simplifiedName})`;
    },
  );

  return transformed;
}

/**
 * Determine package category based on package name
 */
function categorizePackage(packageName) {
  const name = packageName.replace('@jmlweb/', '');

  if (name.startsWith('prettier-config-')) return 'prettier';
  if (name.startsWith('eslint-config-')) return 'eslint';
  if (name.startsWith('tsconfig-')) return 'typescript';
  if (name === 'vitest-config') return 'testing';
  if (name === 'jest-config') return 'testing';
  if (name.startsWith('tsup-config-')) return 'build-tools';
  if (name === 'vite-config') return 'build-tools';
  if (name === 'commitlint-config') return 'commit';

  return 'other';
}

/**
 * Generate frontmatter for MDX file
 */
function generateFrontmatter(metadata, packageName) {
  const name = packageName.replace('@jmlweb/', '');

  // Create a clean title (e.g., "prettier-config-base" -> "base", "vitest-config" -> "vitest")
  let title = name.replace(
    /^(prettier-config-|eslint-config-|tsconfig-|tsup-config-)/,
    '',
  );

  // Handle special cases where the package name ends with -config
  if (name === 'vitest-config') title = 'vitest';
  if (name === 'jest-config') title = 'jest';
  if (name === 'vite-config') title = 'vite';
  if (name === 'commitlint-config') title = 'commitlint';

  return `---
title: ${title}
description: ${metadata.description}
editUrl: https://github.com/jmlweb/tooling/blob/main/packages/${name}/README.md
sidebar:
  order: 1
---

`;
}

/**
 * Escape angle brackets in text content (but not in code blocks)
 * This prevents MDX from interpreting them as JSX tags
 */
function escapeAngleBrackets(content) {
  // Split content by code blocks (both ``` and ` delimited)
  const parts = [];
  let currentPos = 0;
  let inCodeBlock = false;
  let inInlineCode = false;
  let codeBlockDelimiter = '';

  for (let i = 0; i < content.length; i++) {
    // Check for triple backticks (code blocks)
    if (content.substr(i, 3) === '```') {
      if (!inCodeBlock) {
        // Entering code block
        parts.push({ type: 'text', content: content.substring(currentPos, i) });
        inCodeBlock = true;
        codeBlockDelimiter = '```';
        currentPos = i;
      } else if (codeBlockDelimiter === '```') {
        // Exiting code block
        i += 2; // Move past the ```
        parts.push({
          type: 'code',
          content: content.substring(currentPos, i + 1),
        });
        inCodeBlock = false;
        currentPos = i + 1;
      }
      continue;
    }

    // Check for single backtick (inline code)
    if (content[i] === '`' && !inCodeBlock) {
      if (!inInlineCode) {
        parts.push({ type: 'text', content: content.substring(currentPos, i) });
        inInlineCode = true;
        currentPos = i;
      } else {
        parts.push({
          type: 'code',
          content: content.substring(currentPos, i + 1),
        });
        inInlineCode = false;
        currentPos = i + 1;
      }
    }
  }

  // Add remaining content
  if (currentPos < content.length) {
    parts.push({
      type: inCodeBlock || inInlineCode ? 'code' : 'text',
      content: content.substring(currentPos),
    });
  }

  // Escape angle brackets in text parts only
  return parts
    .map((part) => {
      if (part.type === 'text') {
        return part.content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
      return part.content;
    })
    .join('');
}

/**
 * Convert README to MDX
 */
function readmeToMdx(readmePath, metadata, packageName) {
  let content = readFileSync(readmePath, 'utf-8');

  // Remove the first H1 heading (package name) as it's redundant with the title
  content = content.replace(/^#\s+@jmlweb\/[^\n]+\n\n?/, '');

  // Transform links
  content = transformLinks(content, packageName);

  // Escape angle brackets in text content (not in code blocks)
  content = escapeAngleBrackets(content);

  // Add frontmatter
  const frontmatter = generateFrontmatter(metadata, packageName);

  return frontmatter + content;
}

/**
 * Generate documentation for a single package
 */
function generatePackageDoc(packageName) {
  const name = packageName.replace('@jmlweb/', '');
  const packagePath = join(ROOT_DIR, 'packages', name);
  const readmePath = join(packagePath, 'README.md');

  console.log(`📦 Processing ${packageName}...`);

  try {
    // Extract metadata
    const metadata = extractMetadata(packagePath);

    // Convert README to MDX
    const mdxContent = readmeToMdx(readmePath, metadata, packageName);

    // Determine output path
    const category = categorizePackage(packageName);
    let fileName = name.replace(
      /^(prettier-config-|eslint-config-|tsconfig-|tsup-config-)/,
      '',
    );

    // Handle special cases where the package name ends with -config
    if (name === 'vitest-config') fileName = 'vitest';
    if (name === 'jest-config') fileName = 'jest';
    if (name === 'vite-config') fileName = 'vite';
    if (name === 'commitlint-config') fileName = 'commitlint';

    const outputDir = join(DOCS_CONTENT_DIR, category);
    const outputPath = join(outputDir, `${fileName}.mdx`);

    // Create output directory if it doesn't exist
    mkdirSync(outputDir, { recursive: true });

    // Write MDX file
    writeFileSync(outputPath, mdxContent, 'utf-8');

    console.log(`✅ Generated ${category}/${fileName}.mdx`);
    return true;
  } catch (error) {
    console.error(
      `❌ Failed to generate docs for ${packageName}:`,
      error.message,
    );
    return false;
  }
}

/**
 * Discover all published packages in the monorepo
 */
function discoverPackages() {
  const packagesDir = join(ROOT_DIR, 'packages');
  const packageDirs = readdirSync(packagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const packages = [];

  for (const dir of packageDirs) {
    // Skip non-package directories (like AGENTS.md)
    if (!dir.match(/^[a-z]/)) {
      continue;
    }

    const packageJsonPath = join(packagesDir, dir, 'package.json');

    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

      // Skip private packages
      if (packageJson.private) {
        console.log(`⏭️  Skipping ${packageJson.name} (private package)`);
        continue;
      }

      // Skip packages without a name
      if (!packageJson.name) {
        console.log(`⏭️  Skipping ${dir} (no package name)`);
        continue;
      }

      packages.push({
        name: packageJson.name,
        dir,
      });
    } catch (error) {
      console.warn(
        `⚠️  Could not read package.json for ${dir}: ${error.message}`,
      );
    }
  }

  return packages;
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Generating documentation...\n');

  // Discover all published packages
  const packages = discoverPackages();
  console.log(`\n📦 Found ${packages.length} published packages\n`);

  // Generate docs for each package
  const results = {
    success: [],
    failed: [],
  };

  for (const pkg of packages) {
    const success = generatePackageDoc(pkg.name);

    if (success) {
      results.success.push(pkg.name);
    } else {
      results.failed.push(pkg.name);
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Generation Summary');
  console.log('='.repeat(50));
  console.log(`✅ Successful: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log('='.repeat(50));

  if (results.failed.length > 0) {
    console.error('\n❌ Failed packages:');
    results.failed.forEach((name) => console.error(`   - ${name}`));
    process.exit(1);
  } else {
    console.log('\n✨ All documentation generated successfully!');
    process.exit(0);
  }
}

main();
