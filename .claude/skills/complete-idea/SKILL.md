---
name: complete-idea
description: Mark an idea as completed when all its derived tasks are done. Use automatically when detecting all tasks from an idea are closed.
---

# Complete Idea

Mark an accepted idea as completed after all its tasks are done.

## Instructions

When completing idea #N:

### Step 1 - Fetch the Idea

```bash
gh issue view N --repo jmlweb/tooling --json number,title,body,labels,state
```

Verify:

- Has `idea:accepted` label
- Is still open

### Step 2 - Find Related Tasks

```bash
gh issue list --repo jmlweb/tooling --search "idea #N in:body" --state all --json number,title,state
```

Also check the idea's body for task references.

### Step 3 - Verify Task Completion

Check if all related tasks are closed. If any are still open, inform user.

### Step 4 - Mark as Completed

```bash
gh issue edit N --repo jmlweb/tooling \
  --remove-label "idea:accepted" \
  --add-label "idea:completed"

gh issue comment N --repo jmlweb/tooling --body "## Idea Completed

All tasks derived from this idea have been implemented.

**Completed on:** $(date +%Y-%m-%d)"

gh issue close N --repo jmlweb/tooling
```

## Idea Lifecycle

```text
/add-idea       -> Creates idea (idea:pending)
/validate-ideas -> Accepts or rejects (idea:accepted | idea:rejected)
/feed-backlog   -> Creates tasks from accepted ideas
/next-task      -> Implements tasks
complete-idea   -> Closes the cycle (idea:completed)
```
