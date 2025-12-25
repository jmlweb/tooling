---
name: next-task
description: Pick the highest-priority open GitHub Issue and work on it. Use when you want to work on the next task in the queue automatically.
---

# Next Task

Pick the next highest-priority task, work on it, and close it.

## Instructions

When the user runs `/next-task`:

### Step 1 - Find the Next Task

Get open issues sorted by priority:

```bash
gh issue list --repo jmlweb/tooling --state open --json number,title,labels,body --limit 50
```

Priority order (pick the first available):

1. `priority:critical` - Do these first
2. `priority:high` - Important tasks
3. `priority:medium` - Normal tasks
4. `priority:low` - When nothing else is available

If multiple issues share the same priority, pick the oldest one (lowest issue number).

### Step 2 - Assign and Start

Assign the issue to yourself and show what you're working on:

```bash
gh issue edit <number> --repo jmlweb/tooling --add-assignee @me
```

Display:

- Issue number and title
- Priority and type labels
- Full description/body

### Step 3 - Implement the Task

- Read the issue description carefully
- Understand what needs to be done
- Implement the changes following project conventions
- Create commits as needed

### Step 4 - Complete and Close

After implementation:

1. Show a summary of changes made
2. Close the issue with a comment:

```bash
gh issue close <number> --repo jmlweb/tooling --comment "Completed: <brief summary of what was done>"
```

3. Display confirmation that the task is done

## Edge Cases

- **No open issues**: Inform the user there are no pending tasks
- **Implementation blocked**: Ask the user for clarification, don't close the issue
- **Task too complex**: Break it down into subtasks if needed, create new issues

## Example Output

```text
Next Task: #42 - Add validation to config parser

Priority: high | Type: feature

Description:
Add schema validation for the configuration file...

---

Working on this now...

[Implementation happens]

---

Task #42 completed!

Changes:
- Added Zod schema for config validation
- Updated parser to validate on load
- Added tests for validation errors

Issue closed.
```
