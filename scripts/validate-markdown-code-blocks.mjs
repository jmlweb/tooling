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
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const OLLAMA_API = 'http://localhost:11434/api/generate';
const CACHE_DIR = path.join(process.cwd(), 'node_modules', '.cache');
const VALIDATION_CACHE_FILE = path.join(
  CACHE_DIR,
  'markdown-validation-cache.json',
);
// Model recommendations (in order of accuracy, best to good):
// - codellama:7b or codellama:13b - Best for code, slower but very accurate (default)
// - qwen2.5-coder:7b - Excellent for code tasks, good balance
// - deepseek-coder:6.7b - Great for code understanding
// - gemma2:9b - Better than gemma3:4b, good balance
// - gemma3:4b - Fast but less accurate
const MODEL = process.env.OLLAMA_MODEL || 'codellama:7b';

// Concurrency limit for parallel processing
const CONCURRENCY = parseInt(process.env.CONCURRENCY || '10', 10);

// Parse command line arguments
const args = process.argv.slice(2);
const shouldFix = args.includes('--fix') || args.includes('-f');
const skipOllama = args.includes('--skip-ollama') || args.includes('-s');

// Parse model from --model or -m flag, or use env var, or default
let selectedModel = MODEL;
const modelIndex = args.findIndex((arg) => arg === '--model' || arg === '-m');
if (modelIndex !== -1 && args[modelIndex + 1]) {
  selectedModel = args[modelIndex + 1];
} else if (process.env.OLLAMA_MODEL) {
  selectedModel = process.env.OLLAMA_MODEL;
}

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

// Cache for Ollama classifications to avoid redundant API calls
const classificationCache = new Map();
let cacheHits = 0;
let cacheMisses = 0;

// Disk cache for successful validations
const validationCache = new Map();
let validationCacheHits = 0;
let validationCacheMisses = 0;

// Load validation cache from disk
function loadValidationCache() {
  try {
    if (fs.existsSync(VALIDATION_CACHE_FILE)) {
      const data = fs.readFileSync(VALIDATION_CACHE_FILE, 'utf8');
      const cacheData = JSON.parse(data);
      for (const [key, value] of Object.entries(cacheData)) {
        validationCache.set(key, value);
      }
    }
  } catch (error) {
    // Ignore cache read errors - will rebuild cache
  }
}

// Save validation cache to disk
function saveValidationCache() {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    const cacheData = Object.fromEntries(validationCache.entries());
    fs.writeFileSync(VALIDATION_CACHE_FILE, JSON.stringify(cacheData, null, 2));
  } catch (error) {
    // Ignore cache write errors
  }
}

// Generate cache key for a code block
function getBlockCacheKey(block) {
  const content = `${block.file}:${block.startLineNumber}:${block.specifiedLanguage}:${block.content}`;
  return crypto.createHash('sha256').update(content).digest('hex');
}

// Concurrency control helper
async function processConcurrently(items, limit, processor) {
  const results = [];
  const executing = [];

  for (const [index, item] of items.entries()) {
    const promise = Promise.resolve().then(() => processor(item, index));
    results.push(promise);

    if (limit <= items.length) {
      const execute = promise.then(() =>
        executing.splice(executing.indexOf(execute), 1),
      );
      executing.push(execute);

      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(results);
}

console.log(
  `${colors.bright}${colors.blue}🔍 Markdown Code Block Validator${colors.reset}`,
);
if (shouldFix) {
  console.log(`${colors.cyan}   Mode: Fix mode enabled${colors.reset}`);
}
console.log(
  `${colors.cyan}   Model: ${selectedModel}${colors.reset} (use --model <name> to change)`,
);
console.log(
  `${colors.cyan}   Concurrency: ${CONCURRENCY}${colors.reset} (use CONCURRENCY env var to change)`,
);
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
  // Check cache first (hash the content for lookup)
  const contentHash = crypto.createHash('sha256').update(content).digest('hex');
  if (classificationCache.has(contentHash)) {
    cacheHits++;
    return classificationCache.get(contentHash);
  }

  cacheMisses++;

  if (!ollamaAvailable || skipOllama) {
    const result = detectLanguageFallback(content);
    classificationCache.set(contentHash, result);
    return result;
  }

  const prompt = `Classify this code block's language. Return ONLY one word: bash, json, javascript, typescript, text, or markdown.

Guidelines:
- Shell commands/syntax (git, npm, pipes, etc.) → bash
- Valid JSON structure → json
- Type annotations (x: string, interface, etc.) → typescript
- JavaScript without types → javascript
- Markdown formatting (links, headers, bold) → markdown
- Plain text, output, or descriptions → text

Examples:
"npm install" → bash
"const x: string = 'hi';" → typescript
"const x = 'hi';" → javascript
"{ 'name': 'test' }" → json
"[link](url)" → markdown
"Error: not found" → text

Code block:
\`\`\`
${content.substring(0, 800)}
\`\`\`

Language:`;

  try {
    const response = await fetch(OLLAMA_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: selectedModel,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.0, // Lower temperature for more deterministic results
          num_predict: 15, // Slightly more tokens for better response
          top_p: 0.9,
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
      const fallback = detectLanguageFallback(content);
      classificationCache.set(contentHash, fallback);
      return fallback;
    }

    // Normalize sh to bash
    if (language === 'sh') language = 'bash';

    // Validate against fallback - if they disagree, prefer fallback in certain cases
    // This helps catch cases where Ollama misclassifies content
    const fallbackLanguage = detectLanguageFallback(content);

    // If fallback says bash but Ollama says text - trust fallback for shell commands
    // This catches cases where bash blocks start with comments or have mixed content
    if (fallbackLanguage === 'bash' && language === 'text') {
      classificationCache.set(contentHash, 'bash');
      return 'bash';
    }

    // If fallback says json but Ollama says bash - trust fallback for JSON
    // JSON with commands in scripts is still JSON, not bash
    if (fallbackLanguage === 'json' && language === 'bash') {
      classificationCache.set(contentHash, 'json');
      return 'json';
    }

    // If fallback says javascript but Ollama says text - trust fallback for short code blocks
    // Short blocks with just comments are still javascript
    if (
      fallbackLanguage === 'javascript' &&
      language === 'text' &&
      content.length < 100
    ) {
      classificationCache.set(contentHash, 'javascript');
      return 'javascript';
    }

    // If fallback says typescript but Ollama says javascript - check for config files or TSX
    // TypeScript config files (defineConfig, tsup, etc.) are TypeScript even without type annotations
    if (fallbackLanguage === 'typescript' && language === 'javascript') {
      if (
        (content.match(
          /defineConfig|createCommitlintConfig|tsup|vitest\/config|vite\.config/,
        ) &&
          content.match(/^(import|export)/)) || // Has import/export
        content.match(/<[A-Z]\w+[^>]*>/) || // TSX
        content.match(/className|onClick/) // TSX patterns
      ) {
        classificationCache.set(contentHash, 'typescript');
        return 'typescript';
      }
    }

    // If fallback says text but Ollama says typescript - check if it's descriptive text
    // Text mentioning TypeScript/configs is text, not TypeScript code
    if (
      fallbackLanguage === 'text' &&
      language === 'typescript' &&
      (content.match(
        /^(Issue|Description|Labels|Created|This|Add|Generate|Reads|Corresponding|Analyzing|Checked|Suggested|Category|Motivation|Proposed|Estimated|Create this)/i,
      ) ||
        content.match(/^[A-Z][^:]*:\s/) || // Lines starting with capital and colon
        (content.match(/tsconfig|vitest-config|tsup/) &&
          !content.match(/^(import|export|const|let|var|function)/) &&
          content.split('\n').length > 3 &&
          !content.match(/[{}();=]/))) // Mentions configs but no code syntax
    ) {
      // Looks like descriptive text mentioning TypeScript/configs, not actual code
      classificationCache.set(contentHash, 'text');
      return 'text';
    }

    // If fallback says markdown but Ollama says text - trust fallback for markdown
    // This catches simple markdown blocks with just links
    if (fallbackLanguage === 'markdown' && language === 'text') {
      classificationCache.set(contentHash, 'markdown');
      return 'markdown';
    }

    // If fallback says text but Ollama says markdown - check if it's descriptive text
    // Text describing issues/examples is text, not markdown
    if (
      fallbackLanguage === 'text' &&
      language === 'markdown' &&
      (content.match(
        /^(Issue|Description|Labels|Created|This|Add|Generate|Reads|Corresponding|Analyzing|Checked|Suggested|Category|Motivation|Proposed|Estimated|Create this)/i,
      ) ||
        content.match(/^[A-Z][^:]*:\s/) || // Lines starting with capital letter and colon
        content.match(/Issue\s+#\d+/) || // Issue #N pattern
        content.match(/\/\w+/) || // Command patterns like /suggest-idea
        content.match(/^##\s+Suggested/) || // Suggested headers in examples
        (content.match(/\[Yes\/No\]/) && content.match(/Create this/)) || // Interactive prompts
        (content.split('\n').length > 3 && !content.match(/\[.*\]\(.*\)/))) // Multiple lines without markdown links
    ) {
      // Looks like descriptive text, not markdown
      classificationCache.set(contentHash, 'text');
      return 'text';
    }

    // If fallback says text but Ollama says typescript/javascript - check if it's descriptive text
    // This prevents false positives when text mentions code languages
    if (
      fallbackLanguage === 'text' &&
      (language === 'typescript' || language === 'javascript') &&
      (content.match(
        /^(Issue|Description|Labels|Created|This|Add|Generate|Reads|Corresponding)/i,
      ) ||
        (content.split('\n').length > 3 && !content.match(/[{}();=]/)))
    ) {
      // Looks like descriptive text mentioning code, not actual code
      classificationCache.set(contentHash, 'text');
      return 'text';
    }

    classificationCache.set(contentHash, language);
    return language;
  } catch (error) {
    const fallback = detectLanguageFallback(content);
    classificationCache.set(contentHash, fallback);
    return fallback;
  }
}

// Helper to detect if code is JavaScript or TypeScript
function detectCodeLanguage(trimmed) {
  // Check for file extensions in comments (e.g., // config.ts, // app.tsx)
  const firstLine = trimmed.split('\n')[0];
  const hasTypeScriptExtension = firstLine.match(/\/\/.*\.(ts|tsx|mts|cts)\b/);
  const hasJavaScriptExtension = firstLine.match(/\/\/.*\.(js|jsx|mjs|cjs)\b/);

  // Check for JSX/TSX syntax patterns
  const hasJSXSyntax =
    trimmed.match(/<[A-Z]\w+[^>]*>/) || // Component tags
    trimmed.match(/<[a-z]+\s+[^>]*>/) || // HTML-like tags
    trimmed.match(/\bclassName\b/) || // React className
    trimmed.match(/\bonClick\b/) || // React onClick
    trimmed.match(/\bjsx\b/) || // JSX pragma or mention
    trimmed.match(/<\/[A-Z]\w+>/); // Closing component tags

  // Check for TypeScript-specific patterns (excluding JSX which is ambiguous)
  const hasTypeScriptSyntax =
    trimmed.match(
      /:\s*(string|number|boolean|any|void|object|Array|Promise|Record|Map|Set)\b/,
    ) ||
    trimmed.match(/\binterface\s+\w+/) ||
    trimmed.match(/\btype\s+\w+\s*=/) ||
    trimmed.match(/\benum\s+\w+/) ||
    trimmed.match(/\bas\s+(string|number|boolean|const)/) ||
    trimmed.match(/\bimport\s+type\b/) || // import type (TS-specific)
    trimmed.match(/\bexport\s+type\b/) || // export type (TS-specific)
    trimmed.includes('defineConfig') ||
    trimmed.includes('createCommitlintConfig');

  // If file extension indicates TypeScript/TSX, trust it
  if (hasTypeScriptExtension) {
    return 'typescript';
  }

  // If file extension indicates JavaScript/JSX, trust it
  if (hasJavaScriptExtension) {
    // If JSX extension or has JSX syntax, it's still JavaScript (or could be treated as jsx)
    // but we normalize jsx/tsx to their base languages
    return 'javascript';
  }

  // If has explicit TypeScript syntax, it's TypeScript
  if (hasTypeScriptSyntax) {
    return 'typescript';
  }

  // If has JSX syntax but no TypeScript indicators, assume TypeScript
  // (modern React typically uses TypeScript)
  if (hasJSXSyntax) {
    return 'typescript';
  }

  // Default to JavaScript for code without clear indicators
  return 'javascript';
}

// Fallback rule-based detection
function detectLanguageFallback(content) {
  const trimmed = content.trim();
  const firstLine = trimmed.split('\n')[0] || '';

  // Check for directory tree first
  if (trimmed.match(/[├└│]/)) return 'text';

  // Check for strong code patterns BEFORE bash (prevents misclassification)
  // JavaScript/TypeScript with import/export/const/let/var/function
  if (trimmed.match(/^(import|export|const|let|var|function|class)/m)) {
    // Has clear code syntax - not bash
    return detectCodeLanguage(trimmed);
  }

  // JSON - check early to avoid bash false positives
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch (e) {
      // Not valid JSON, continue
    }
  }

  // Strong bash indicators (syntax that's uniquely bash)
  if (
    trimmed.match(/<<['"]?EOF/i) || // Heredoc
    trimmed.match(/<<['"]?EOT/i) || // Heredoc variant
    trimmed.includes('#!/bin/') || // Shebang
    trimmed.includes('#!/usr/bin/') || // Shebang
    trimmed.includes('$(') || // Command substitution
    (trimmed.includes('${') && !trimmed.match(/`[^`]*\${/)) // Variable expansion (but not template literals)
  ) {
    return 'bash';
  }

  // Shell commands at start of line
  if (
    firstLine.match(
      /^(\$|npm|pnpm|git|gh|cd|ls|mkdir|echo|curl|wget|cat|grep|sed|awk|find|chmod|chown|sudo|docker|kubectl|node|python|yarn)\s/,
    )
  ) {
    return 'bash';
  }

  // Shell command patterns with subcommands
  const shellCommandPattern =
    /^(gh|git|npm|pnpm|curl|wget|cd|ls|mkdir|echo|cat|grep|sed|awk|find|chmod|chown|sudo|docker|kubectl)\s+(issue|list|create|add|install|run|exec|build|test|syncpack|outdated|audit|check|fix)/im;
  if (trimmed.match(shellCommandPattern)) {
    return 'bash';
  }

  // Check for require/module.exports (CommonJS)
  if (trimmed.includes('require(') || trimmed.includes('module.exports')) {
    return 'javascript';
  }

  // Check for markdown syntax
  // But exclude text that looks like descriptive content, examples, or command output
  const isDescriptiveText =
    trimmed.match(
      /^(Issue|Labels|Description|Created|This|Add|Generate|Reads|Corresponding|Analyzing|Checked|Suggested|Category|Motivation|Proposed|Estimated|Create this)/i,
    ) ||
    trimmed.match(/^[A-Z][^:]*:\s/) || // Lines starting with capital and colon
    trimmed.match(/Issue\s+#\d+/) || // Issue #N pattern
    trimmed.match(/\/\w+/) || // Command patterns like /suggest-idea
    trimmed.match(/^##\s+Suggested/) || // Suggested headers in examples
    (trimmed.match(/\[Yes\/No\]/) && trimmed.match(/Create this/)); // Interactive prompts

  // Additional check: if it has multiple descriptive patterns, it's likely text
  const descriptivePatternCount =
    (trimmed.match(/##\s+[A-Z]/g) || []).length +
    (trimmed.match(/\*\*[A-Z][^:]*:\*\*/g) || []).length +
    (trimmed.match(/^-\s+[A-Z]/gm) || []).length;

  // If it has markdown syntax but looks like descriptive/example text, prefer text
  if (
    isDescriptiveText ||
    (descriptivePatternCount >= 3 &&
      trimmed.match(/Analyzing|Checked|Suggested|Category/))
  ) {
    // Has markdown syntax but is descriptive text/example output
    return 'text';
  }

  // Check for markdown syntax - badges, links, headers, etc.
  if (
    trimmed.match(/\[!\[.*\]\(.*\)\]\(.*\)/) || // Badge syntax [![text](url)](url)
    trimmed.match(/\[.*\]\(.*\)/) || // Links [text](url)
    trimmed.match(/\[.*\]\(#.*\)/) || // Anchor links [text](#anchor)
    trimmed.match(/^#+\s+/) || // Headers #, ##, ###
    trimmed.match(/\*\*.*\*\*/) || // Bold **text**
    trimmed.match(/\*.*\*/) || // Italic *text*
    (trimmed.match(/`[^`]+`/) && trimmed.match(/\[.*\]/)) // Code + links
  ) {
    // Make sure it's not code that happens to have these characters
    if (
      !trimmed.match(
        /^(import|export|const|let|var|function|interface|type|enum)/,
      )
    ) {
      return 'markdown';
    }
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
  if (normalized === 'jsx') return 'javascript'; // JSX is JavaScript (React)
  if (normalized === 'ts') return 'typescript';
  if (normalized === 'tsx') return 'typescript'; // TSX is TypeScript (React)
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
  const originalLanguage = block.specifiedLanguage?.toLowerCase().trim();
  const specifiedLanguage = normalizeLanguage(block.specifiedLanguage);
  const normalizedDetected = normalizeLanguage(detectedLanguage);

  // If no language specified, it's already handled as MISSING_LANGUAGE
  if (!specifiedLanguage) {
    return null;
  }

  // JSX/TSX blocks are always valid for syntax highlighting
  // Users explicitly specify jsx/tsx for syntax highlighting, trust their choice
  // Check BEFORE normalization since jsx→javascript and tsx→typescript
  if (['jsx', 'tsx'].includes(originalLanguage)) {
    return null;
  }

  // Check if languages match
  if (specifiedLanguage !== normalizedDetected) {
    // Special cases: accept certain valid combinations
    // Bash blocks with only comments are still valid bash
    if (
      specifiedLanguage === 'bash' &&
      normalizedDetected === 'text' &&
      block.content.trim().match(/^#.*$/) &&
      block.content
        .split('\n')
        .every((line) => line.trim().startsWith('#') || line.trim() === '')
    ) {
      // Bash block with only comments - valid
      return null;
    }

    // Markdown with badges/links should be accepted even if detected as text
    if (
      specifiedLanguage === 'markdown' &&
      normalizedDetected === 'text' &&
      (block.content.match(/\[!\[.*\]\(.*\)\]\(.*\)/) || // Badges
        block.content.match(/\[.*\]\(.*\)/) || // Links
        block.content.match(/^#+\s+/)) // Headers
    ) {
      // Markdown with syntax - valid
      return null;
    }

    // JavaScript/TypeScript comment-only blocks are valid for syntax highlighting
    if (
      ['javascript', 'typescript'].includes(specifiedLanguage) &&
      normalizedDetected === 'text'
    ) {
      // Check if block contains only comments
      const lines = block.content.split('\n');
      const nonEmptyLines = lines.filter((line) => line.trim() !== '');
      const allComments = nonEmptyLines.every((line) => {
        const trimmed = line.trim();
        return (
          trimmed.startsWith('//') ||
          trimmed.startsWith('/*') ||
          trimmed.startsWith('*') ||
          trimmed.endsWith('*/')
        );
      });

      if (allComments) {
        // Comment-only block - valid for syntax highlighting
        return null;
      }
    }

    // TypeScript/JavaScript config files often misclassified as bash
    // Accept if specified as ts/js but detected as bash, when block clearly contains imports/exports
    if (
      ['javascript', 'typescript'].includes(specifiedLanguage) &&
      normalizedDetected === 'bash' &&
      (block.content.match(/^\s*import\s+/m) ||
        block.content.match(/^\s*export\s+(default\s+)?/m) ||
        block.content.match(/from\s+['"][^'"]+['"]/))
    ) {
      // Contains clear ES module syntax - valid
      return null;
    }

    // CommonJS patterns (module.exports, require) should be accepted as JavaScript
    if (
      specifiedLanguage === 'javascript' &&
      normalizedDetected === 'bash' &&
      (block.content.match(/module\.exports\s*=/) ||
        block.content.match(/require\s*\(/))
    ) {
      // CommonJS syntax - valid JavaScript
      return null;
    }

    // Text blocks containing bash-like instructions are valid for documentation
    if (specifiedLanguage === 'text' && normalizedDetected === 'bash') {
      // Documentation often shows command examples in text blocks for readability
      return null;
    }

    // JavaScript/TypeScript blocks without imports/exports but with JS-like syntax
    // Accept if specified as js/ts but detected as bash, when block contains JS patterns
    if (
      ['javascript', 'typescript'].includes(specifiedLanguage) &&
      normalizedDetected === 'bash' &&
      (block.content.match(/\{[\s\S]*\}/) || // Object literals
        block.content.match(/function\s+\w+/) || // Function declarations
        block.content.match(/const\s+\w+/) || // Const declarations
        block.content.match(/let\s+\w+/) || // Let declarations
        block.content.match(/var\s+\w+/) || // Var declarations
        block.content.match(/=>\s*\{/) || // Arrow functions
        block.content.match(/\w+\.\w+\(/)) // Method calls
    ) {
      // Contains JavaScript syntax - valid
      return null;
    }

    // JavaScript blocks may contain TypeScript-like syntax (for documentation examples)
    if (
      specifiedLanguage === 'javascript' &&
      normalizedDetected === 'typescript'
    ) {
      // Accept JavaScript with TS-like patterns (often used in docs to show config)
      return null;
    }

    // Markdown blocks detected as text/bash are valid (simple markdown without complex syntax)
    if (
      specifiedLanguage === 'markdown' &&
      ['text', 'bash'].includes(normalizedDetected)
    ) {
      // Simple markdown content - valid
      return null;
    }

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

  // Load validation cache
  loadValidationCache();

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

  // Show structural issues immediately
  if (structuralIssues.length > 0) {
    console.log(
      `${colors.yellow}⚠${colors.reset} Found ${structuralIssues.length} structural issue(s):${colors.reset}\n`,
    );
    const structuralByFile = new Map();
    for (const issue of structuralIssues) {
      if (!structuralByFile.has(issue.file)) {
        structuralByFile.set(issue.file, []);
      }
      structuralByFile.get(issue.file).push(issue);
    }
    for (const [file, issues] of structuralByFile.entries()) {
      console.log(`${colors.yellow}${file}${colors.reset}`);
      for (const issue of issues) {
        console.log(formatIssue(issue));
      }
      console.log();
    }
  }

  console.log(
    `${colors.blue}Step 4:${colors.reset} Validating language specifiers...\n`,
  );

  // Track issues and blocks to fix
  const languageIssues = [];
  const blocksToFix = [];
  let totalIssues = structuralIssues.length;
  const filesWithIssues = new Map();

  // Initialize files map with structural issues
  for (const issue of structuralIssues) {
    if (!filesWithIssues.has(issue.file)) {
      filesWithIssues.set(issue.file, []);
    }
    filesWithIssues.get(issue.file).push(issue);
  }

  // Process blocks in parallel with progress tracking
  let processed = 0;
  const processingStartTime = Date.now();
  const displayedFiles = new Set();
  let outputLock = Promise.resolve();

  const validationResults = await processConcurrently(
    allBlocks,
    CONCURRENCY,
    async (block, index) => {
      // Check for missing language (structural issue)
      if (!block.specifiedLanguage) {
        const issue = {
          type: IssueType.MISSING_LANGUAGE,
          file: block.file,
          line: block.startLineNumber,
          endLine: block.endLineNumber,
          content: block.content,
          startLineIndex: block.startLine,
        };

        // Update progress
        processed++;

        // Show error immediately with output lock to prevent interleaving
        outputLock = outputLock.then(() => {
          process.stdout.write(' '.repeat(50) + '\r');
          if (!displayedFiles.has(block.file)) {
            console.log(`${colors.yellow}${block.file}${colors.reset}`);
            displayedFiles.add(block.file);
          }
          console.log(formatIssue(issue));
          process.stdout.write(
            `  [${processed}/${allBlocks.length}] Validating blocks...\r`,
          );
        });

        return { issue, block };
      }

      // Check validation cache first
      const cacheKey = getBlockCacheKey(block);
      const cachedResult = validationCache.get(cacheKey);

      let issue;
      if (cachedResult !== undefined && cachedResult === null) {
        // Cache hit - block was previously validated successfully
        validationCacheHits++;
        issue = null;
      } else {
        // Cache miss or previous error - validate now
        validationCacheMisses++;
        issue = await validateBlockLanguage(block, ollamaAvailable);

        // Cache successful validations
        if (issue === null) {
          validationCache.set(cacheKey, null);
        }
      }

      // Update progress
      processed++;

      // Show error immediately if found
      if (issue) {
        // Use output lock to prevent interleaving
        outputLock = outputLock.then(() => {
          process.stdout.write(' '.repeat(50) + '\r');
          if (!displayedFiles.has(issue.file)) {
            console.log(`${colors.yellow}${issue.file}${colors.reset}`);
            displayedFiles.add(issue.file);
          }
          console.log(formatIssue(issue));
          process.stdout.write(
            `  [${processed}/${allBlocks.length}] Validating blocks...\r`,
          );
        });
      } else {
        // Just update progress (safe without lock since it's just overwriting the line)
        process.stdout.write(
          `  [${processed}/${allBlocks.length}] Validating blocks...\r`,
        );
      }

      return issue ? { issue, block } : null;
    },
  );

  // Wait for any pending output to complete
  await outputLock;

  const processingDuration = (
    (Date.now() - processingStartTime) /
    1000
  ).toFixed(2);

  // Collect issues and blocks to fix
  for (const result of validationResults) {
    if (result) {
      const { issue, block } = result;
      languageIssues.push(issue);
      totalIssues++;

      if (!filesWithIssues.has(issue.file)) {
        filesWithIssues.set(issue.file, []);
      }
      filesWithIssues.get(issue.file).push(issue);

      if (shouldFix) {
        blocksToFix.push(block);
      }
    }
  }

  process.stdout.write(' '.repeat(50) + '\r'); // Clear progress line
  console.log(); // Add newline after progress

  // Show performance statistics
  console.log(
    `${colors.cyan}Performance: Validated ${allBlocks.length} blocks in ${processingDuration}s (${CONCURRENCY} concurrent)${colors.reset}`,
  );

  const totalClassifications = cacheHits + cacheMisses;
  if (totalClassifications > 0) {
    const cacheHitRate = ((cacheHits / totalClassifications) * 100).toFixed(1);
    console.log(
      `${colors.cyan}Classification Cache: ${cacheHits}/${totalClassifications} hits (${cacheHitRate}% hit rate)${colors.reset}`,
    );
  }

  const totalValidations = validationCacheHits + validationCacheMisses;
  if (totalValidations > 0) {
    const validationCacheHitRate = (
      (validationCacheHits / totalValidations) *
      100
    ).toFixed(1);
    console.log(
      `${colors.cyan}Validation Cache: ${validationCacheHits}/${totalValidations} hits (${validationCacheHitRate}% hit rate)${colors.reset}`,
    );
  }

  // Save validation cache to disk
  saveValidationCache();

  // Show summary
  if (totalIssues > 0) {
    const uniqueFiles = new Set([
      ...structuralIssues.map((i) => i.file),
      ...languageIssues.map((i) => i.file),
    ]);
    console.log(
      `\n${colors.bright}Summary: Found ${totalIssues} issue(s) in ${uniqueFiles.size} file(s)${colors.reset}\n`,
    );
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
