#!/usr/bin/env node

/**
 * Validate and optionally fix markdown code blocks
 * Checks for:
 * - Missing language specifiers
 * - Incorrect language specifiers (validates content matches language)
 * - Unclosed code blocks
 * - Malformed code fences
 * Uses Ollama for intelligent language detection and validation
 */

import { execSync } from 'child_process';
import fs from 'fs';

const OLLAMA_API = 'http://localhost:11434/api/generate';
const MODEL = 'gemma3:4b';

// Parse command line arguments
const args = process.argv.slice(2);
const shouldFix = args.includes('--fix') || args.includes('-f');
const skipOllama = args.includes('--skip-ollama') || args.includes('-s');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

console.log(
  `${colors.bright}${colors.blue}🔍 Markdown Code Block Validator${colors.reset}`,
);
if (shouldFix) {
  console.log(`${colors.cyan}   Mode: Fix mode enabled${colors.reset}`);
}
console.log();

// Validation issue types
const IssueType = {
  MISSING_LANGUAGE: 'missing-language',
  INCORRECT_LANGUAGE: 'incorrect-language',
  UNCLOSED_BLOCK: 'unclosed-block',
  MALFORMED_FENCE: 'malformed-fence',
};

// Check if Ollama is running (required for validation)
async function checkOllama() {
  if (skipOllama) {
    console.log(
      `${colors.yellow}⚠${colors.reset} Ollama check skipped (using fallback only)`,
    );
    return false;
  }

  try {
    const response = await fetch('http://localhost:11434/api/tags');
    if (!response.ok) throw new Error('Ollama not responding');
    console.log(`${colors.green}✓${colors.reset} Ollama is running`);
    return true;
  } catch (error) {
    console.warn(
      `${colors.yellow}⚠${colors.reset} Ollama is not running. Will use fallback detection only.`,
    );
    console.warn(
      `   Start Ollama with: ${colors.cyan}ollama serve${colors.reset}`,
    );
    console.warn(
      `   Note: Fallback detection may be less accurate for language validation.`,
    );
    return false;
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

// Validate code blocks and find issues
function findCodeBlocks(filePath, content) {
  const lines = content.split('\n');
  const allBlocks = [];
  const issues = [];

  // Track state
  let inQuadBlock = false; // Inside ```` block (examples)
  let inTripleBlock = false; // Inside ``` block
  let tripleBlockStart = -1;
  let tripleBlockStartLine = -1;
  let blockContent = [];
  let blockLanguage = null;

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const trimmed = line.trim();

    // Check for quadruple backticks (examples in documentation)
    if (trimmed.startsWith('````')) {
      inQuadBlock = !inQuadBlock;
      continue;
    }

    // Skip processing if we're inside a quadruple-backtick example block
    if (inQuadBlock) {
      continue;
    }

    // Handle triple backticks
    const isPlainFence = trimmed === '```';
    const hasLangFence =
      trimmed.startsWith('```') &&
      trimmed.length > 3 &&
      !trimmed.startsWith('````');

    if (!inTripleBlock) {
      // We're outside a code block
      if (isPlainFence) {
        // Opening fence WITHOUT language - issue!
        inTripleBlock = true;
        tripleBlockStart = idx;
        tripleBlockStartLine = idx + 1; // 1-indexed for display
        blockContent = [];
        blockLanguage = null;
      } else if (hasLangFence) {
        // Opening fence WITH language
        inTripleBlock = true;
        tripleBlockStart = idx;
        tripleBlockStartLine = idx + 1;
        blockContent = [];
        // Extract language (everything after ```)
        const langMatch = trimmed.match(/^```(\w+)/);
        blockLanguage = langMatch ? langMatch[1] : null;
      } else if (trimmed.includes('```') && !trimmed.match(/^```/)) {
        // Malformed fence (backticks not at start)
        issues.push({
          type: IssueType.MALFORMED_FENCE,
          file: filePath,
          line: idx + 1,
          message: 'Code fence not at start of line',
        });
      }
    } else {
      // We're inside a code block
      if (isPlainFence || hasLangFence) {
        // Closing fence
        if (blockLanguage === null && tripleBlockStart >= 0) {
          // We opened with plain ```, so this is an issue
          issues.push({
            type: IssueType.MISSING_LANGUAGE,
            file: filePath,
            line: tripleBlockStartLine,
            endLine: idx + 1,
            content: blockContent.join('\n'),
            startLineIndex: tripleBlockStart,
          });
        }

        // Save ALL blocks for validation (with and without language)
        if (tripleBlockStart >= 0) {
          allBlocks.push({
            file: filePath,
            startLine: tripleBlockStart,
            endLine: idx,
            startLineNumber: tripleBlockStartLine,
            endLineNumber: idx + 1,
            content: blockContent.join('\n'),
            specifiedLanguage: blockLanguage,
          });
        }

        inTripleBlock = false;
        tripleBlockStart = -1;
        tripleBlockStartLine = -1;
        blockContent = [];
        blockLanguage = null;
      } else {
        // Content line inside code block
        if (tripleBlockStart >= 0) {
          blockContent.push(line);
        }
      }
    }
  }

  // Check for unclosed blocks at end of file
  if (inTripleBlock && tripleBlockStart >= 0) {
    issues.push({
      type: IssueType.UNCLOSED_BLOCK,
      file: filePath,
      line: tripleBlockStartLine,
      message: 'Code block not closed',
      content: blockContent.join('\n'),
      startLineIndex: tripleBlockStart,
    });
  }

  return { issues, blocks: allBlocks };
}

// Classify code block using Ollama
async function classifyCodeBlock(content, ollamaAvailable) {
  if (!ollamaAvailable || skipOllama) {
    return detectLanguageFallback(content);
  }

  const prompt = `Analyze this code block and respond with ONLY ONE WORD - the language identifier for a markdown code fence.

CRITICAL RULES (in priority order):
1. If it starts with a shell command (gh, git, npm, pnpm, curl, cd, ls, etc.) OR contains shell syntax (\\, $(, <<EOF, <<'EOF', $VAR, etc.) → respond: bash
   - Even if it contains markdown/text inside heredocs or quotes, it's still bash
   - Shell commands with embedded content are still bash
2. If it's JSON (starts with { or [, contains "key": "value") → respond: json
3. If it's JavaScript (has require, module.exports, import/export, but NO types) → respond: javascript
4. If it's TypeScript (has type annotations, interface, : string, type, enum) → respond: typescript
5. If it's a directory tree (contains ├──, └──, │) → respond: text
6. If it's plain text output (example output, terminal output, error messages) → respond: text
7. If it's markdown content (starts with #, contains [links], etc.) → respond: markdown
8. If uncertain or mixed → respond: text

IMPORTANT: Shell commands with embedded markdown/text content are still bash, not text!

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
          temperature: 0.1,
          num_predict: 10,
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
      return detectLanguageFallback(content);
    }

    // Normalize sh to bash
    if (language === 'sh') language = 'bash';

    // Validate against fallback - if they disagree on bash vs text, prefer fallback
    // This helps catch cases where Ollama misclassifies shell commands with embedded content
    const fallbackLanguage = detectLanguageFallback(content);
    if (fallbackLanguage === 'bash' && language === 'text') {
      // Fallback detected bash but Ollama said text - trust fallback for shell commands
      return 'bash';
    }

    return language;
  } catch (error) {
    return detectLanguageFallback(content);
  }
}

// Fallback rule-based detection
function detectLanguageFallback(content) {
  const trimmed = content.trim();
  const firstLine = trimmed.split('\n')[0] || '';

  // Check for directory tree
  if (trimmed.match(/[├└│]/)) return 'text';

  // Check for bash/shell - prioritize shell syntax patterns
  // Shell syntax indicators (strong signals)
  if (
    trimmed.includes('\\') || // Line continuation
    trimmed.includes('$(') || // Command substitution
    trimmed.includes('${') || // Variable substitution
    trimmed.match(/<<['"]?EOF/i) || // Heredoc
    trimmed.match(/<<['"]?EOT/i) || // Heredoc variant
    trimmed.includes('#!/bin/') || // Shebang
    trimmed.includes('#!/usr/bin/') // Shebang
  ) {
    return 'bash';
  }

  // Shell commands at start of line (strong signal)
  if (
    firstLine.match(
      /^(\$|npm|pnpm|git|gh|cd|ls|mkdir|echo|curl|wget|cat|grep|sed|awk|find|chmod|chown|sudo|docker|kubectl|node|python|pnpm|yarn)/,
    )
  ) {
    return 'bash';
  }

  // Shell commands anywhere (weaker signal, but still valid)
  if (
    trimmed.match(
      /\b(npm|pnpm|git|gh|cd|ls|mkdir|echo|curl|wget|cat|grep|sed|awk|find|chmod|chown|sudo|docker|kubectl)\b/,
    )
  ) {
    // Only if it looks like a command, not just text mentioning these words
    if (
      trimmed.match(
        /^[a-z]+\s+(run|install|create|add|remove|exec|build|test)/i,
      )
    ) {
      return 'bash';
    }
  }

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
    trimmed.includes(': number') ||
    trimmed.includes('type ') ||
    trimmed.includes('enum ')
  ) {
    return 'typescript';
  }

  // Default to text
  return 'text';
}

// Normalize language for comparison
function normalizeLanguage(lang) {
  if (!lang) return null;
  const normalized = lang.toLowerCase().trim();
  // Normalize common variations
  if (normalized === 'sh') return 'bash';
  if (normalized === 'js') return 'javascript';
  if (normalized === 'ts') return 'typescript';
  return normalized;
}

// Validate that specified language matches detected language
async function validateBlockLanguage(block, ollamaAvailable) {
  if (!block.content || block.content.trim().length === 0) {
    // Empty blocks are valid regardless of language
    return null;
  }

  const detectedLanguage = await classifyCodeBlock(
    block.content,
    ollamaAvailable,
  );
  const specifiedLanguage = normalizeLanguage(block.specifiedLanguage);
  const normalizedDetected = normalizeLanguage(detectedLanguage);

  // If no language specified, it's already handled as MISSING_LANGUAGE
  if (!specifiedLanguage) {
    return null;
  }

  // Check if languages match
  if (specifiedLanguage !== normalizedDetected) {
    return {
      type: IssueType.INCORRECT_LANGUAGE,
      file: block.file,
      line: block.startLineNumber,
      endLine: block.endLineNumber,
      specifiedLanguage: block.specifiedLanguage,
      detectedLanguage: detectedLanguage,
      content: block.content,
      startLineIndex: block.startLine,
    };
  }

  return null;
}

// Fix code blocks in a file
async function fixFile(filePath, blocks, ollamaAvailable) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let fixed = 0;
  const fixes = [];

  for (const block of blocks) {
    const language = await classifyCodeBlock(block.content, ollamaAvailable);
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

// Format issue message
function formatIssue(issue) {
  const typeLabels = {
    [IssueType.MISSING_LANGUAGE]: 'Missing language',
    [IssueType.INCORRECT_LANGUAGE]: 'Incorrect language',
    [IssueType.UNCLOSED_BLOCK]: 'Unclosed block',
    [IssueType.MALFORMED_FENCE]: 'Malformed fence',
  };

  let message = `  ${colors.red}✗${colors.reset} Line ${issue.line}: ${colors.yellow}${typeLabels[issue.type]}${colors.reset}`;
  if (issue.endLine && issue.endLine !== issue.line) {
    message += ` (ends at line ${issue.endLine})`;
  }
  if (issue.message) {
    message += ` - ${issue.message}`;
  }
  if (issue.type === IssueType.INCORRECT_LANGUAGE) {
    message += `\n     Specified: ${colors.cyan}${issue.specifiedLanguage}${colors.reset}, Detected: ${colors.cyan}${issue.detectedLanguage}${colors.reset}`;
  }
  return message;
}

// Main execution
async function main() {
  console.log(`${colors.blue}Step 1:${colors.reset} Checking Ollama...`);
  const ollamaAvailable = await checkOllama();
  console.log();

  console.log(
    `${colors.blue}Step 2:${colors.reset} Scanning markdown files...`,
  );
  const files = getMarkdownFiles();

  console.log(
    `${colors.blue}Step 3:${colors.reset} Finding all code blocks...\n`,
  );

  // First pass: find all code blocks
  const allBlocks = [];
  const structuralIssues = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const { issues, blocks } = findCodeBlocks(file, content);

    structuralIssues.push(...issues);
    allBlocks.push(...blocks);
  }

  console.log(`  Found ${allBlocks.length} code block(s) to validate\n`);

  if (structuralIssues.length > 0) {
    console.log(
      `${colors.yellow}⚠${colors.reset} Found ${structuralIssues.length} structural issue(s) (missing language, unclosed blocks, etc.)\n`,
    );
  }

  console.log(
    `${colors.blue}Step 4:${colors.reset} Validating language specifiers...\n`,
  );

  // Second pass: validate language correctness
  const languageIssues = [];
  const blocksToFix = [];

  let processed = 0;
  for (const block of allBlocks) {
    processed++;
    process.stdout.write(
      `  [${processed}/${allBlocks.length}] Validating blocks...\r`,
    );

    // Check for missing language (structural issue)
    if (!block.specifiedLanguage) {
      languageIssues.push({
        type: IssueType.MISSING_LANGUAGE,
        file: block.file,
        line: block.startLineNumber,
        endLine: block.endLineNumber,
        content: block.content,
        startLineIndex: block.startLine,
      });
      if (shouldFix) {
        blocksToFix.push(block);
      }
      continue;
    }

    // Validate language correctness
    const issue = await validateBlockLanguage(block, ollamaAvailable);
    if (issue) {
      languageIssues.push(issue);
      if (shouldFix) {
        blocksToFix.push(block);
      }
    }
  }

  process.stdout.write(' '.repeat(50) + '\r'); // Clear progress line

  // Combine all issues
  const allIssues = [...structuralIssues, ...languageIssues];
  const filesWithIssues = new Map();

  // Group issues by file
  for (const issue of allIssues) {
    if (!filesWithIssues.has(issue.file)) {
      filesWithIssues.set(issue.file, []);
    }
    filesWithIssues.get(issue.file).push(issue);
  }

  // Report issues
  if (filesWithIssues.size > 0) {
    console.log(
      `\n${colors.bright}Found ${allIssues.length} issue(s) in ${filesWithIssues.size} file(s):${colors.reset}\n`,
    );

    for (const [file, issues] of filesWithIssues.entries()) {
      console.log(`${colors.yellow}${file}${colors.reset}`);
      for (const issue of issues) {
        console.log(formatIssue(issue));
      }
      console.log();
    }
  } else {
    console.log(
      `\n${colors.green}✓${colors.reset} No issues found! All code blocks are valid.`,
    );
    process.exit(0);
  }

  // Fix issues if requested
  if (shouldFix) {
    console.log(`${colors.blue}Step 5:${colors.reset} Fixing code blocks...\n`);

    // Group blocks by file for fixing
    const blocksByFile = new Map();
    for (const block of blocksToFix) {
      if (!blocksByFile.has(block.file)) {
        blocksByFile.set(block.file, []);
      }
      blocksByFile.get(block.file).push(block);
    }

    let totalFixed = 0;
    let fileCount = 0;

    for (const [file, blocks] of blocksByFile.entries()) {
      fileCount++;
      process.stdout.write(
        `  [${fileCount}/${blocksByFile.size}] Fixing ${file}... `,
      );

      const fixed = await fixFile(file, blocks, ollamaAvailable);
      totalFixed += fixed;

      console.log(`${colors.green}✓${colors.reset} ${fixed} blocks`);
    }

    console.log(`\n${colors.bright}${colors.green}🎉 Complete!${colors.reset}`);
    console.log(
      `${colors.green}✓${colors.reset} Fixed ${totalFixed} code blocks in ${fileCount} files`,
    );
    console.log(`\n${colors.blue}Next steps:${colors.reset}`);
    console.log(`  1. Review changes: ${colors.cyan}git diff${colors.reset}`);
    console.log(
      `  2. Verify fixes: ${colors.cyan}pnpm validate:docs${colors.reset}`,
    );
    console.log(
      `  3. Commit: ${colors.cyan}git add . && git commit -m "docs: fix code block issues"${colors.reset}`,
    );
  } else {
    console.log(
      `\n${colors.yellow}⚠${colors.reset} Run with ${colors.cyan}--fix${colors.reset} to automatically fix issues`,
    );
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`${colors.red}Error:${colors.reset}`, error.message);
  process.exit(1);
});
