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
// Model recommendations (in order of accuracy, best to good):
// - codellama:7b or codellama:13b - Best for code, slower but very accurate (default)
// - qwen2.5-coder:7b - Excellent for code tasks, good balance
// - deepseek-coder:6.7b - Great for code understanding
// - gemma2:9b - Better than gemma3:4b, good balance
// - gemma3:4b - Fast but less accurate
const MODEL = process.env.OLLAMA_MODEL || 'codellama:7b';

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

console.log(
  `${colors.bright}${colors.blue}🔍 Markdown Code Block Validator${colors.reset}`,
);
if (shouldFix) {
  console.log(`${colors.cyan}   Mode: Fix mode enabled${colors.reset}`);
}
console.log(
  `${colors.cyan}   Model: ${selectedModel}${colors.reset} (use --model <name> to change)`,
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
  if (!ollamaAvailable || skipOllama) {
    return detectLanguageFallback(content);
  }

  const prompt = `You are a code language classifier. Analyze the code block below and identify its programming language.

TASK: Return ONLY the language identifier (one word) for a markdown code fence.

CLASSIFICATION RULES (check in this order - be strict about what is actual code vs text):

1. BASH/SHELL - Return "bash" if ANY of these are true:
   - Contains shell commands (even after comments): gh, git, npm, pnpm, curl, wget, cd, ls, mkdir, echo, cat, grep, sed, awk, find, chmod, sudo, docker, kubectl, etc.
   - Contains shell syntax: line continuation (\\), command substitution ($(...)), variable expansion ($VAR or $VARIABLE), heredoc (<<EOF, <<'EOF', <<"EOF"), shebang (#!/bin/bash), pipes (|), redirects (>, >>, <)
   - Has shell operators: &&, ||, ;, |, >, <
   - Has command flags/options: --repo, --label, --state, --json, --limit, etc. (common in gh, git, npm commands)
   - CRITICAL: Even if the block starts with comments (#) or contains markdown/text inside heredocs, quotes, or command arguments, it's still bash if it has shell commands or syntax
   - IMPORTANT: Blocks with multiple shell commands (even with comments between them) are bash, not text

2. JSON - Return "json" if:
   - Starts with { or [
   - Contains valid JSON structure with "key": "value" pairs
   - Looks like package.json, tsconfig.json, etc.
   - IMPORTANT: Even if JSON contains command strings in "scripts" fields, it's still JSON, not bash
   - JSON with npm/pnpm commands in scripts is still JSON

3. TYPESCRIPT - Return "typescript" if it contains TypeScript code:
   - Type annotations: variable: string, param: number, etc.
   - TypeScript keywords: interface Name { }, type Name =, enum Name { }
   - Generic syntax: <T>, Array<T>, Promise<T>
   - TypeScript operators: as, satisfies, !
   - TypeScript config files: defineConfig, createCommitlintConfig, vitest/config, vite.config, tsup, tsconfig patterns
   - Import/export statements with TypeScript tooling (vitest, vite, tsup, @vitejs, @jmlweb/commitlint-config, etc.) are TypeScript
   - IMPORTANT: Config files like vitest.config.ts, vite.config.ts, tsup.config.ts, commitlint.config.ts are TypeScript even without visible type annotations
   - IMPORTANT: Just mentioning "TypeScript" as a word does NOT make it TypeScript code
   - Must have executable TypeScript syntax, not just text describing TypeScript
   - TSX/JSX: If it contains JSX syntax (<Component />), it's typescript/tsx (both are equivalent)

4. JAVASCRIPT - Return "javascript" if:
   - Has require(), module.exports, import/export statements
   - Contains executable code: const, let, var, function, class, async/await
   - Code blocks with comments (// or /* */) that indicate code structure
   - NO type annotations (if types present, it's TypeScript)
   - IMPORTANT: Even short code blocks with just comments are javascript if marked as such
   - Must be actual code, not text describing JavaScript

5. TEXT - Return "text" if:
   - Directory tree structure (├──, └──, │)
   - Plain text output, terminal output, error messages
   - Descriptive text, documentation, or examples (even if they mention code languages)
   - No executable code syntax detected
   - Text that describes code but isn't code itself

6. MARKDOWN - Return "markdown" if:
   - Contains markdown syntax: [links], ![links](url), ![images](url), **bold**, *italic*, inline code, # headers
   - Has markdown link syntax: [text](#anchor) or [text](url)
   - Pure markdown content without executable code
   - Examples or documentation showing markdown syntax

7. DEFAULT - Return "text" if uncertain

EXAMPLES:
Input: "gh issue create --title 'Test'"
Output: bash

Input: "const x: string = 'test';"
Output: typescript

Input: "const x = 'test';"
Output: javascript

Input: "{ 'name': 'test' }"
Output: json

Input: "## Header\n\nSome text"
Output: markdown

Input: "├── src\n└── dist"
Output: text

Input: "Issue #15: Generate TypeScript types from JSON schemas\n\nDescription:\nAdd a CLI command that reads JSON Schema files and generates\ncorresponding TypeScript type definitions..."
Output: text

Input: "This is a text description that mentions TypeScript, JavaScript, and other programming languages but contains no actual code."
Output: text

Input: "# All ideas\ngh issue list --repo jmlweb/tooling --label 'idea' --state all --json number,title\n\n# Pending only\ngh issue list --repo jmlweb/tooling --label 'idea:pending' --json number,title"
Output: bash

Input: "# Install dependencies\npnpm install\n\n# Format code\npnpm format\n\n# Run linting\npnpm lint"
Output: bash

Input: "For details, see [File Organization Rules](#file-organization-rules)"
Output: markdown

Input: "[text](#anchor) or [text](url)"
Output: markdown

Input: "Issue #15: 💡 [IDEA] Generate TypeScript types\n\nLabels: idea, idea:pending\n\nDescription:\nAdd a CLI command..."
Output: text

Input: "/suggest-idea\n\nAnalyzing jmlweb-tooling project...\n\nChecked:\n- 5 existing packages\n\n## Suggested Idea: Add shared Vitest configuration\n\n**Category:** feature\n\n**Description:**\nCreate a new package..."
Output: text

Input: "import { defineConfig } from 'vitest/config';\nexport default defineConfig({ plugins: [react()] });"
Output: typescript

Input: "<button className='rounded-lg bg-blue-500'>Click me</button>"
Output: typescript

Input: "// Configuration example"
Output: javascript

Input: "{ 'scripts': { 'build': 'tsup', 'clean': 'rm -rf dist' } }"
Output: json

Now classify this code block:

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
      return detectLanguageFallback(content);
    }

    // Normalize sh to bash
    if (language === 'sh') language = 'bash';

    // Validate against fallback - if they disagree, prefer fallback in certain cases
    // This helps catch cases where Ollama misclassifies content
    const fallbackLanguage = detectLanguageFallback(content);

    // If fallback says bash but Ollama says text - trust fallback for shell commands
    // This catches cases where bash blocks start with comments or have mixed content
    if (fallbackLanguage === 'bash' && language === 'text') {
      return 'bash';
    }

    // If fallback says json but Ollama says bash - trust fallback for JSON
    // JSON with commands in scripts is still JSON, not bash
    if (fallbackLanguage === 'json' && language === 'bash') {
      return 'json';
    }

    // If fallback says javascript but Ollama says text - trust fallback for short code blocks
    // Short blocks with just comments are still javascript
    if (
      fallbackLanguage === 'javascript' &&
      language === 'text' &&
      content.length < 100
    ) {
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
      return 'text';
    }

    // If fallback says markdown but Ollama says text - trust fallback for markdown
    // This catches simple markdown blocks with just links
    if (fallbackLanguage === 'markdown' && language === 'text') {
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
      return 'text';
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

  // Shell commands anywhere in the content (even after comments)
  // Look for command patterns: command --flag value or command subcommand
  const shellCommandPattern =
    /\b(gh|git|npm|pnpm|curl|wget|cd|ls|mkdir|echo|cat|grep|sed|awk|find|chmod|chown|sudo|docker|kubectl)\s+(issue|list|create|add|install|run|exec|build|test|syncpack|outdated|audit|check|fix)/i;
  if (trimmed.match(shellCommandPattern)) {
    return 'bash';
  }

  // Check for command flags (--repo, --label, --state, --json, etc.) which indicate shell commands
  if (
    trimmed.match(
      /--(repo|label|state|json|limit|title|body|fix|check|update|outdated|audit)/,
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
    // Check if it's followed by command-like syntax (flags, subcommands, etc.)
    if (
      trimmed.match(/\b(gh|git|npm|pnpm)\s+\w+/) ||
      trimmed.match(/--\w+/) ||
      trimmed.match(/\$\w+/) ||
      trimmed.match(/`[^`]+`/) // Backticks often indicate commands
    ) {
      return 'bash';
    }
  }

  // Check for JSON - prioritize JSON detection even if it contains command strings
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch (e) {
      // Not valid JSON, continue
    }
  }
  // JSON indicators (even if scripts contain commands like "tsup", "rm -rf dist", etc.)
  if (
    trimmed.includes('"scripts"') ||
    trimmed.includes('"dependencies"') ||
    trimmed.includes('"devDependencies"') ||
    (trimmed.includes('"name"') && trimmed.includes('"version"')) ||
    (trimmed.includes('"build"') &&
      trimmed.includes('"clean"') &&
      trimmed.match(/["{]/))
  ) {
    // Make sure it's not just text mentioning these words - must have JSON structure
    if (
      trimmed.match(/["{]/) &&
      (trimmed.startsWith('{') || trimmed.match(/\{[^}]*"scripts"/))
    ) {
      return 'json';
    }
  }

  // Check for TypeScript config files and patterns BEFORE JavaScript
  // TypeScript files often don't have visible type annotations but are still TypeScript
  // IMPORTANT: Only detect if it's actual code, not text describing TypeScript
  const hasTypeScriptConfigPatterns =
    trimmed.includes('defineConfig') || // Vite/Vitest/tsup config
    trimmed.includes('createCommitlintConfig') || // Commitlint config
    trimmed.match(/from\s+['"]vitest\/config['"]/) || // Vitest imports
    trimmed.match(/from\s+['"]vite\.config['"]/) || // Vite config
    trimmed.match(/from\s+['"]tsup['"]/) || // tsup imports
    trimmed.match(/from\s+['"]@jmlweb\/commitlint-config['"]/) || // Commitlint imports
    (trimmed.match(/from\s+['"]@vitejs|from\s+['"]vitest|from\s+['"]vite/) &&
      trimmed.match(/import.*from/)); // Vite/Vitest imports

  // Only classify as TypeScript if it has actual code syntax (import/export, function calls, etc.)
  // Not just text mentioning these words
  if (
    hasTypeScriptConfigPatterns &&
    (trimmed.match(/^(import|export)/) || // Has import/export statements
      trimmed.match(/defineConfig\(|createCommitlintConfig\(/) || // Has function calls
      trimmed.match(/export\s+default/)) // Has export default
  ) {
    // These are TypeScript config files, even without visible type annotations
    return 'typescript';
  }

  // Additional check: if it mentions TypeScript-related words but looks like descriptive text, it's text
  if (
    (trimmed.includes('tsconfig') ||
      trimmed.includes('vitest-config') ||
      trimmed.includes('tsup')) &&
    !trimmed.match(/^(import|export|const|let|var|function)/) &&
    (trimmed.match(
      /^(Issue|Description|Labels|Created|This|Add|Generate|Reads|Corresponding|Analyzing|Checked|Suggested|Category|Motivation|Proposed|Estimated|Create this)/i,
    ) ||
      trimmed.match(/^[A-Z][^:]*:\s/) || // Lines starting with capital and colon
      (trimmed.split('\n').length > 3 && !trimmed.match(/[{}();=]/))) // Multiple lines without code syntax
  ) {
    // Text describing TypeScript/configs, not actual TypeScript code
    return 'text';
  }

  // Check for JavaScript - even short blocks with just comments are javascript
  if (trimmed.includes('require(') || trimmed.includes('module.exports'))
    return 'javascript';
  if (trimmed.match(/^(import|export|const|let|var|function)/m))
    return 'javascript';
  // JavaScript comments indicate code blocks
  if (trimmed.match(/^\/\/.*/) && trimmed.length < 100) {
    // Short block with just a comment - likely javascript if specified
    return 'javascript';
  }

  // Check for TypeScript - must have actual TypeScript syntax, not just the word
  // Look for type annotations in actual code context
  const hasTypeAnnotation = trimmed.match(
    /:\s*(string|number|boolean|any|void|object|Array|Promise|Record|Map|Set)\b/,
  );
  const hasInterfaceKeyword = trimmed.match(/\binterface\s+\w+\s*[<{]/);
  const hasTypeKeyword = trimmed.match(/\btype\s+\w+\s*=/);
  const hasEnumKeyword = trimmed.match(/\benum\s+\w+\s*{/);
  const hasGenericSyntax = trimmed.match(/<[A-Z]\w*>/);

  // Check for TSX/JSX syntax
  const hasJSX =
    trimmed.match(/<[A-Z]\w+[^>]*>/) || trimmed.match(/<[a-z]+\s+[^>]*>/);

  // Only classify as TypeScript if it has actual code syntax, not just mentions
  if (
    hasTypeAnnotation ||
    hasInterfaceKeyword ||
    hasTypeKeyword ||
    hasEnumKeyword ||
    hasGenericSyntax ||
    hasJSX
  ) {
    // Additional check: make sure it's not just text describing TypeScript
    // If it looks like prose/description, prefer text
    if (
      trimmed.match(
        /^(Issue|Description|Labels|Created|This|Add|Generate|Reads|Corresponding)/i,
      ) ||
      (trimmed.split('\n').length > 3 && !trimmed.match(/[{}();=<>]/))
    ) {
      // Looks like descriptive text, not code
      return 'text';
    }
    // If it has JSX and TypeScript features, it's typescript/tsx
    if (hasJSX) {
      return 'typescript';
    }
    return 'typescript';
  }

  // Check for JSX/TSX even without TypeScript features
  if (hasJSX && trimmed.match(/className|onClick|import.*from/)) {
    return 'typescript'; // TSX
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
  if (normalized === 'ts') return 'typescript';
  if (normalized === 'tsx') return 'typescript'; // TSX is TypeScript
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

  let processed = 0;
  for (const block of allBlocks) {
    processed++;
    process.stdout.write(
      `  [${processed}/${allBlocks.length}] Validating blocks...\r`,
    );

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
      languageIssues.push(issue);
      totalIssues++;

      // Show immediately
      if (!filesWithIssues.has(block.file)) {
        filesWithIssues.set(block.file, []);
        console.log(`\n${colors.yellow}${block.file}${colors.reset}`);
      }
      console.log(formatIssue(issue));

      if (shouldFix) {
        blocksToFix.push(block);
      }
      continue;
    }

    // Validate language correctness
    const issue = await validateBlockLanguage(block, ollamaAvailable);
    if (issue) {
      languageIssues.push(issue);
      totalIssues++;

      // Show immediately
      if (!filesWithIssues.has(issue.file)) {
        filesWithIssues.set(issue.file, []);
        console.log(`\n${colors.yellow}${issue.file}${colors.reset}`);
      }
      console.log(formatIssue(issue));

      if (shouldFix) {
        blocksToFix.push(block);
      }
    }
  }

  process.stdout.write(' '.repeat(50) + '\r'); // Clear progress line

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
