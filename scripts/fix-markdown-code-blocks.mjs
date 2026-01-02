#!/usr/bin/env node

/**
 * Auto-fix markdown code blocks missing language specifiers
 * Uses Ollama for intelligent language detection
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const OLLAMA_API = 'http://localhost:11434/api/generate';
const MODEL = 'gemma3:4b';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

console.log(
  `${colors.bright}${colors.blue}🔧 Markdown Code Block Fixer${colors.reset}\n`,
);

// Check if Ollama is running
async function checkOllama() {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    if (!response.ok) throw new Error('Ollama not responding');
    console.log(`${colors.green}✓${colors.reset} Ollama is running`);
    return true;
  } catch (error) {
    console.error(
      `${colors.red}✗${colors.reset} Ollama is not running. Please start it with: ollama serve`,
    );
    process.exit(1);
  }
}

// Get all markdown files
function getMarkdownFiles() {
  const files = execSync('git ls-files "*.md" | grep -v node_modules', {
    encoding: 'utf8',
  })
    .split('\n')
    .filter((f) => f);
  console.log(
    `${colors.green}✓${colors.reset} Found ${files.length} markdown files\n`,
  );
  return files;
}

// Find code blocks without language specifiers
function findCodeBlocksWithoutLanguage(filePath, content) {
  const lines = content.split('\n');
  const blocks = [];

  // We need to track:
  // - Quadruple backticks (````markdown) - these contain examples, ignore their contents
  // - Triple backticks (```) - actual code blocks

  let inQuadBlock = false; // Inside ```` block
  let inTripleBlock = false; // Inside ``` block
  let tripleBlockStart = -1;
  let blockContent = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();

    // Check for quadruple backticks (examples)
    if (trimmed.startsWith('````')) {
      inQuadBlock = !inQuadBlock;
      continue;
    }

    // Skip processing if we're inside a quadruple-backtick example block
    if (inQuadBlock) {
      continue;
    }

    // Now handle triple backticks
    const isPlainFence = trimmed === '```';
    const hasLangFence = trimmed.startsWith('```') && trimmed.length > 3;

    if (!inTripleBlock) {
      // We're outside a code block
      if (isPlainFence) {
        // Opening fence WITHOUT language - needs fixing!
        inTripleBlock = true;
        tripleBlockStart = idx;
        blockContent = [];
      } else if (hasLangFence) {
        // Opening fence WITH language - skip it
        inTripleBlock = true;
        tripleBlockStart = -1; // Mark as "don't fix"
        blockContent = [];
      }
    } else {
      // We're inside a code block
      if (isPlainFence || hasLangFence) {
        // Closing fence
        if (tripleBlockStart >= 0) {
          // We opened with plain ```, so save this block for fixing
          blocks.push({
            file: filePath,
            startLine: tripleBlockStart,
            endLine: idx,
            content: blockContent.join('\n'),
          });
        }
        inTripleBlock = false;
        tripleBlockStart = -1;
        blockContent = [];
      } else {
        // Content line inside code block
        if (tripleBlockStart >= 0) {
          blockContent.push(line);
        }
      }
    }
  }

  return blocks;
}

// Classify code block using Ollama
async function classifyCodeBlock(content) {
  const prompt = `Analyze this code block and respond with ONLY ONE WORD - the language identifier for a markdown code fence.

Rules:
- If it's a shell command (contains $, pnpm, npm, git, etc.) → respond: bash
- If it's JSON (starts with {, contains "key": "value") → respond: json
- If it's JavaScript (has require, module.exports, but NO types) → respond: javascript
- If it's TypeScript (has type annotations, interface, : string, etc.) → respond: typescript
- If it's a directory tree (contains ├──, └──, │) → respond: text
- If it's plain text output (example output, terminal output, error messages) → respond: text
- If it's markdown → respond: markdown
- If uncertain or mixed → respond: text

Code block:
\`\`\`
${content.substring(0, 500)}
\`\`\`

Respond with ONE WORD ONLY:`;

  try {
    const response = await fetch(OLLAMA_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.1, // Low temperature for consistent classification
          num_predict: 10, // We only need one word
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    let language = data.response.trim().toLowerCase();

    // Clean up response - extract just the language
    language = language.split('\n')[0].split(' ')[0];

    // Validate language
    const validLanguages = [
      'bash',
      'json',
      'javascript',
      'typescript',
      'text',
      'markdown',
      'sh',
    ];
    if (!validLanguages.includes(language)) {
      // Fallback to rule-based detection
      return detectLanguageFallback(content);
    }

    // Normalize sh to bash
    if (language === 'sh') language = 'bash';

    return language;
  } catch (error) {
    console.warn(
      `${colors.yellow}⚠${colors.reset} Ollama classification failed, using fallback`,
    );
    return detectLanguageFallback(content);
  }
}

// Fallback rule-based detection
function detectLanguageFallback(content) {
  const trimmed = content.trim();

  // Check for directory tree
  if (trimmed.match(/[├└│]/)) return 'text';

  // Check for bash/shell
  if (trimmed.match(/^(\$|npm|pnpm|git|cd|ls|mkdir|echo|curl|gh)/m))
    return 'bash';
  if (trimmed.includes('#!/bin/')) return 'bash';

  // Check for JSON
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch (e) {
      // Not valid JSON, continue
    }
  }
  if (trimmed.includes('"scripts"') || trimmed.includes('"dependencies"'))
    return 'json';

  // Check for JavaScript
  if (trimmed.includes('require(') || trimmed.includes('module.exports'))
    return 'javascript';
  if (trimmed.match(/^(import|export|const|let|var|function)/m))
    return 'javascript';

  // Check for TypeScript
  if (
    trimmed.includes('interface ') ||
    trimmed.includes(': string') ||
    trimmed.includes(': number')
  ) {
    return 'typescript';
  }

  // Default to text
  return 'text';
}

// Fix code blocks in a file
async function fixFile(filePath, blocks) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let fixed = 0;
  const fixes = [];

  for (const block of blocks) {
    const language = await classifyCodeBlock(block.content);
    fixes.push({
      line: block.startLine,
      language,
    });
  }

  // Apply fixes in reverse order to maintain line numbers
  fixes.reverse().forEach(({ line, language }) => {
    lines[line] = '```' + language;
    fixed++;
  });

  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  return fixed;
}

// Main execution
async function main() {
  console.log(`${colors.blue}Step 1:${colors.reset} Checking Ollama...`);
  await checkOllama();

  console.log(
    `${colors.blue}Step 2:${colors.reset} Scanning markdown files...`,
  );
  const files = getMarkdownFiles();

  console.log(
    `${colors.blue}Step 3:${colors.reset} Finding code blocks without language...\n`,
  );

  let totalBlocks = 0;
  const filesToFix = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const blocks = findCodeBlocksWithoutLanguage(file, content);

    if (blocks.length > 0) {
      totalBlocks += blocks.length;
      filesToFix.push({ file, blocks });
      console.log(
        `  ${colors.yellow}${file}${colors.reset}: ${blocks.length} blocks`,
      );
    }
  }

  if (totalBlocks === 0) {
    console.log(
      `\n${colors.green}✓${colors.reset} No issues found! All code blocks have language specifiers.`,
    );
    return;
  }

  console.log(
    `\n${colors.bright}Found ${totalBlocks} code blocks to fix in ${filesToFix.length} files${colors.reset}\n`,
  );

  console.log(
    `${colors.blue}Step 4:${colors.reset} Classifying and fixing code blocks...\n`,
  );

  let totalFixed = 0;
  let fileCount = 0;

  for (const { file, blocks } of filesToFix) {
    fileCount++;
    process.stdout.write(
      `  [${fileCount}/${filesToFix.length}] Fixing ${file}... `,
    );

    const fixed = await fixFile(file, blocks);
    totalFixed += fixed;

    console.log(`${colors.green}✓${colors.reset} ${fixed} blocks`);
  }

  console.log(`\n${colors.bright}${colors.green}🎉 Complete!${colors.reset}`);
  console.log(
    `${colors.green}✓${colors.reset} Fixed ${totalFixed} code blocks in ${filesToFix.length} files`,
  );
  console.log(`\n${colors.blue}Next steps:${colors.reset}`);
  console.log(`  1. Review changes: git diff`);
  console.log(`  2. Verify fixes: pnpm validate:docs`);
  console.log(
    `  3. Commit: git add . && git commit -m "docs: add language specifiers to code blocks"`,
  );
}

main().catch((error) => {
  console.error(`${colors.red}Error:${colors.reset}`, error.message);
  process.exit(1);
});
