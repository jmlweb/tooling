# Agent Guidelines

This document contains additional guidelines and rules for AI agents working on this project. These rules apply to all AI assistants including Claude Code, Cursor, and other development agents.

## File Organization Rules

### Descriptive File Names

File names must be descriptive and written in uppercase.

#### Requirements

- **Descriptive Names**: File names should clearly indicate their purpose and content
- **Uppercase Convention**: Use uppercase letters for file names (e.g., `AGENTS.md`, `SPECS.md`, `README.md`)
- **Clarity**: Avoid abbreviations unless they are widely understood and documented

#### Examples

- ✅ `AGENTS.md` - Clear and descriptive
- ✅ `SPECS.md` - Clear and descriptive
- ✅ `README.md` - Standard convention
- ❌ `agents.md` - Not uppercase
- ❌ `rules.md` - Not descriptive enough
- ❌ `doc.md` - Too generic

### File Size Management

When a file becomes very large, it must be divided into smaller, more manageable files.

#### Guidelines

1. **Size Threshold**: Consider splitting files when they exceed approximately 500-1000 lines or become difficult to navigate
2. **Logical Division**: Split files based on logical sections, topics, or functionality
3. **Maintain Structure**: Ensure the file structure remains organized and easy to navigate
4. **Update References**: Update any references or links to the split content

#### Process

When dividing a large file:

1. Identify logical sections that can be separated
2. Create new files with descriptive, uppercase names
3. Move content to appropriate new files
4. Update the original file to reference the new files
5. Update any cross-references in other files

### Avoid Duplicate Content

Duplicate content must be avoided. Instead, link to the content that needs to be referenced in another file.

#### Principles

1. **Single Source of Truth**: Maintain content in one location only
2. **Use Links**: Reference content using markdown links or file references
3. **Keep Updated**: When content changes, update it in the single source location

#### Best Practices

- **Cross-References**: Use markdown links to reference content in other files

  ```markdown
  For details, see [File Organization Rules](./AGENTS.md#file-organization-rules)
  ```

- **Include Statements**: For code or configuration, use import/export mechanisms rather than duplicating code

- **Documentation Links**: Link to relevant sections rather than copying content

#### Link Examples

- ✅ Link to existing content: `See [Package Naming Convention](../AGENTS.md#package-naming-convention)`
- ✅ Reference a section: `As specified in [General Rules](../AGENTS.md#general-rules)`
- ❌ Copying entire sections into multiple files
- ❌ Duplicating code examples across multiple documentation files

#### Enforcement

When creating or editing files:

- Check if similar content already exists before adding new content
- Use links to reference existing content instead of duplicating it
- If content must be duplicated for context, clearly mark it as a reference and link to the original source
- Regularly review files for duplicate content and consolidate when found
