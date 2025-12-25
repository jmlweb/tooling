# Add Task

Create a new GitHub Issue from a user prompt.

## Instructions

When the user runs `/add-task <prompt>`, analyze the prompt and create a GitHub Issue:

1. **Analyze the prompt** to determine:
   - A clear, concise title (max 80 chars)
   - A detailed description with acceptance criteria if applicable
   - Task type: `type:feature`, `type:bug`, or `type:chore`
   - Priority: `priority:critical`, `priority:high`, `priority:medium`, or `priority:low`

2. **Create the issue** using `gh issue create`:

```bash
gh issue create \
  --repo jmlweb/tooling \
  --title "Title here" \
  --body "Description here" \
  --label "type:feature,priority:medium"
```

3. **Show confirmation** with the issue number and URL.

## Priority Guidelines

- **critical**: Blocks deployments, security issues, production bugs
- **high**: Important feature, significant bug, deadline-driven
- **medium**: Standard work, normal feature requests
- **low**: Nice-to-have, minor improvements, can wait

## Type Guidelines

- **feature**: New functionality, new capability
- **bug**: Something is broken or not working as expected
- **chore**: Refactoring, dependencies, documentation, CI/CD

## Example

User: `/add-task Add dark mode support to the website`

Creates issue:

- Title: "Add dark mode support"
- Type: `type:feature`
- Priority: `priority:medium`
- Body: Detailed description based on prompt
