# Package README Documentation for AI Agents

> **Note for Cursor**: Cursor automatically reads this `AGENTS.md` file. All guidelines in this document are automatically applied when creating or updating package READMEs.

This document describes the standardized README structure used across all packages in this monorepo. When creating or updating package READMEs, follow this structure to ensure consistency and maintainability.

## Overview

All package READMEs follow a standardized structure with consistent section ordering, formatting, and content organization. This ensures a uniform developer experience across all `@jmlweb` packages.

## Standard README Structure

All package READMEs must follow this exact section order:

1. **Title and Badges**
2. **Description**
3. **Features**
4. **Installation**
5. **Quick Start**
6. **Examples**
7. **Configuration Details** (or **Configuration**)
8. **When to Use**
9. **Extending the Configuration**
10. **Usage with Scripts**
11. **Requirements**
12. **Peer Dependencies**
13. **Related Packages**
14. **Migration Guide** (optional, only when needed)
15. **License**

## Section Guidelines

### 1. Title and Badges

**Format:**

```markdown
# @jmlweb/package-name

[![npm version](https://img.shields.io/npm/v/@jmlweb/package-name)](https://www.npmjs.com/package/@jmlweb/package-name)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg)](https://nodejs.org/)
```

**Guidelines:**

- Always include npm version badge
- Always include MIT license badge
- Include Node.js version badge with the minimum required version
- Add additional badges for major dependencies (ESLint, TypeScript, React, etc.) if applicable
- Use consistent badge URLs and formatting

### 2. Description

**Format:**

```markdown
> Brief description of what the package does and its main purpose.
```

**Guidelines:**

- Use a single-line description in blockquote format
- Be concise but descriptive
- Mention if the package extends another package
- Focus on the primary use case

### 3. Features

**Format:**

```markdown
## ✨ Features

- 🎯 **Feature Name**: Description of feature
- 🔧 **Feature Name**: Description of feature
- 📦 **Feature Name**: Description of feature
```

**Guidelines:**

- Use emoji prefixes for visual consistency
- Use bold for feature names
- Keep descriptions concise (one sentence per feature)
- List 3-6 key features
- Focus on benefits, not just technical details

### 4. Installation

**Format:**

````markdown
## 📦 Installation

```bash
npm install --save-dev @jmlweb/package-name [peer-dependencies]
```
````

````

**Guidelines:**
- Always use `--save-dev` flag
- Include all required peer dependencies in the command
- List peer dependencies explicitly, don't use `...` or `etc.`
- Use `npm` as the package manager (users can adapt to pnpm/yarn)

### 5. Quick Start

**Format:**
```markdown
## 🚀 Quick Start

### Basic Setup

```javascript
// Configuration example
````

### Advanced Setup (optional)

```javascript
// Advanced configuration example
```

````

**Guidelines:**
- Provide the most common setup method first
- Include multiple setup options if applicable (e.g., package.json, config file)
- Show complete, working examples
- Use appropriate code language (javascript, json, typescript, etc.)
- Keep examples simple and focused

### 6. Examples

**Format:**
```markdown
## 💡 Examples

### Example 1: Basic Usage

```javascript
// Code example
````

### Example 2: Advanced Usage

```javascript
// Advanced code example
```

````

**Guidelines:**
- Provide 2-4 practical examples
- Start with basic usage, progress to advanced
- Show real-world use cases
- Include "Before/After" examples when demonstrating transformations
- Use descriptive example titles

### 7. Configuration Details

**Format:**
```markdown
## 📋 Configuration Details

### Configuration Options

| Option | Value | Description |
|--------|-------|-------------|
| `option1` | `value1` | Description |

### Default Settings

- Setting 1: Description
- Setting 2: Description
````

**Guidelines:**

- Use tables for configuration options when appropriate
- Document all important configuration options
- Explain what each option does
- List default values clearly
- For complex configs, break into subsections

### 8. When to Use

**Format:**

```markdown
## 🎯 When to Use

Use this package when you want:

- ✅ Use case 1
- ✅ Use case 2
- ✅ Use case 3

**For alternative use cases**, use [`@jmlweb/alternative-package`](../alternative-package) instead.
```

**Guidelines:**

- List 3-6 specific use cases
- Use checkmark emoji (✅) for consistency
- Include guidance on when NOT to use the package
- Reference alternative packages when appropriate
- Help users choose the right package

### 9. Extending the Configuration

**Format:**

````markdown
## 🔧 Extending the Configuration

You can extend or override the configuration for your specific needs:

```javascript
// Extension example
```
````

````

**Guidelines:**
- Show how to extend/override the base configuration
- Provide practical examples
- Explain common customization scenarios
- Show both simple and advanced extension patterns

### 10. Usage with Scripts

**Format:**
```markdown
## 📝 Usage with Scripts

Add scripts to your `package.json`:

```json
{
  "scripts": {
    "script-name": "command"
  }
}
````

Then run:

```bash
npm run script-name
```

````

**Guidelines:**
- Provide common npm scripts for the tool
- Include both the JSON and command-line examples
- Show the most useful scripts first
- Explain what each script does in comments or descriptions

### 11. Requirements

**Format:**
```markdown
## 📋 Requirements

- **Node.js** >= 18.0.0
- **Dependency** >= 1.0.0
````

**Guidelines:**

- List minimum versions for runtime dependencies
- Use bold for dependency names
- Use `>=` for version requirements
- Include Node.js version requirement
- List major dependencies (not all peer dependencies)

### 12. Peer Dependencies

**Format:**

```markdown
## 📦 Peer Dependencies

This package requires the following peer dependencies:

- `dependency1` (^1.0.0)
- `dependency2` (^2.0.0)

**Note**: Optional note about installation or usage.
```

**Guidelines:**

- List all peer dependencies with version ranges
- Use caret (^) for version ranges
- Include installation notes if needed
- Explain why dependencies are peer dependencies if non-obvious

### 13. Related Packages

**Format:**

```markdown
## 🔗 Related Packages

- [`@jmlweb/related-package-1`](../related-package-1) - Description
- [`@jmlweb/related-package-2`](../related-package-2) - Description
```

**Guidelines:**

- Link to related packages in the monorepo
- Use relative paths (`../package-name`)
- Provide brief descriptions
- Include packages that are commonly used together
- Include packages that extend or are extended by this one

### 14. Migration Guide (Optional)

**Format:**

```markdown
## 🔄 Migration Guide

### From Version X to Version Y

**Breaking Changes:**

- Change 1: Description and migration steps
- Change 2: Description and migration steps

**Migration Steps:**

1. Step 1
2. Step 2
3. Step 3
```

**Guidelines:**

- Only include when there are breaking changes
- Document breaking changes clearly
- Provide step-by-step migration instructions
- Include code examples showing before/after
- Link to changelog if available

### 15. License

**Format:**

```markdown
## 📄 License

MIT
```

**Guidelines:**

- Always end with the license section
- Use "MIT" for all packages
- Keep it simple and consistent

## Special Sections

Some packages may include additional sections between the standard sections:

### Import Sorting (ESLint packages)

````markdown
## 🔄 Import Sorting

The configuration automatically sorts imports...

**Before:**

```typescript
// Example
```
````

**After auto-fix:**

```typescript
// Example
```

````

### Configuration Details Subsections

For complex packages, break configuration into logical subsections:

```markdown
## 📋 Configuration Details

### TypeScript Files
### Key Rules Enforced
### What's Included
````

## Formatting Guidelines

### Emoji Usage

Use emojis consistently:

- ✨ Features
- 📦 Installation
- 🚀 Quick Start
- 💡 Examples
- 📋 Configuration/Requirements
- 🎯 When to Use
- 🔧 Extending
- 📝 Usage with Scripts
- 📦 Peer Dependencies
- 🔗 Related Packages
- 🔄 Migration Guide
- 📄 License

### Code Blocks

- Always specify the language for code blocks
- Use appropriate language tags: `javascript`, `json`, `typescript`, `bash`, `markdown`
- Keep code examples complete and runnable
- Include comments to explain non-obvious parts

### Links

- Use relative paths for monorepo packages: `[package](../package-name)`
- Use absolute URLs for external resources
- Make link text descriptive

### Tables

- Use tables for configuration options
- Align columns consistently
- Include clear headers
- Use code formatting for option names and values

## Creating a New README

When creating a README for a new package:

1. **Copy the template** from `docs/README-TEMPLATE.md`
2. **Fill in package-specific content** following the guidelines above
3. **Include all required sections** - don't skip any
4. **Verify consistency** with existing READMEs
5. **Test all code examples** to ensure they work
6. **Check links** to ensure they're correct

## Updating an Existing README

When updating an existing README:

1. **Maintain the standard structure** - don't reorder sections
2. **Follow existing formatting** - match the style of other packages
3. **Update all relevant sections** - don't leave outdated information
4. **Add migration guides** when making breaking changes
5. **Keep examples current** - update code examples if APIs change

## Examples

See existing package READMEs for reference:

- `prettier-config-base/README.md` - Simple configuration package
- `eslint-config-base/README.md` - Complex configuration with many options
- `tsconfig-base/README.md` - TypeScript configuration package
- `vitest-config/README.md` - Testing configuration package

## Consistency Checklist

Before finalizing a README, verify:

- [ ] All standard sections are present and in order
- [ ] Emojis are used consistently
- [ ] Code examples are complete and runnable
- [ ] Links use relative paths for monorepo packages
- [ ] Version numbers match package.json
- [ ] Peer dependencies are listed correctly
- [ ] Related packages are linked
- [ ] Requirements match actual dependencies
- [ ] Examples demonstrate real-world usage
- [ ] Formatting matches other package READMEs

## Questions?

If you're unsure about README structure or content:

1. Check existing package READMEs for similar patterns
2. Refer to `docs/README-TEMPLATE.md` for the base structure
3. Follow the guidelines in this document
4. Maintain consistency with the rest of the monorepo
