---
name: complete-idea
description: Mark an idea as completed when all its derived tasks are done. Use when you've finished implementing all tasks from an accepted idea.
---

# Complete Idea

Mark an accepted idea as completed after all its tasks are done.

## Instructions

When the user runs `/complete-idea #N`:

### Step 1 - Fetch the Idea

```bash
gh issue view N --repo jmlweb/tooling --json number,title,body,labels,state
```

Verify:

- Has `idea:accepted` label
- Is still open

If not accepted or already closed, inform user.

### Step 2 - Find Related Tasks

Search for tasks that reference this idea:

```bash
gh issue list --repo jmlweb/tooling --search "idea #N in:body" --state all --json number,title,state
```

Also check the idea's body for task references (e.g., "Converted to #X, #Y").

### Step 3 - Verify Task Completion

For each related task:

- Check if closed
- List any still open

```text
Related tasks for idea #12:

| Task | Title                        | Status |
|------|------------------------------|--------|
| #25  | Implement schema validation  | ✅ Closed |
| #26  | Add validation tests         | ✅ Closed |

All tasks completed!
```

If any tasks are still open:

```text
Cannot complete idea #12. Open tasks remain:

| Task | Title                   | Status |
|------|-------------------------|--------|
| #27  | Add documentation       | ❌ Open |

Close remaining tasks first, or use --force to complete anyway.
```

### Step 4 - Mark as Completed

If all tasks done (or --force used):

```bash
# Update labels
gh issue edit N --repo jmlweb/tooling \
  --remove-label "idea:accepted" \
  --add-label "idea:completed"

# Add completion comment
gh issue comment N --repo jmlweb/tooling --body "$(cat <<'EOF'
## Idea Completed ✅

All tasks derived from this idea have been implemented:
- #25: Implement schema validation
- #26: Add validation tests

**Completed on:** $(date +%Y-%m-%d)

This idea is now closed.
EOF
)"

# Close the issue
gh issue close N --repo jmlweb/tooling
```

### Step 5 - Confirm

```text
Idea #12 marked as completed!

Title: JSON schema validation
Tasks completed: 2
Closed on: 2025-12-25

The idea lifecycle is now complete.
```

## Edge Cases

**No related tasks found:**

- Warn user that no tasks were found
- Ask if they want to complete anyway (idea may have been implemented directly)

**Idea already completed:**

- Inform user it's already done

**Force completion:**

- `/complete-idea #N --force` skips task verification
- Useful when tasks were completed but not properly linked

## Idea Lifecycle Summary

```text
/new-idea       → Creates idea (idea:pending)
/validate-idea  → Accepts or rejects (idea:accepted | idea:rejected)
/feed-backlog   → Creates tasks from accepted ideas
/next-task      → Implements tasks
/complete-idea  → Closes the cycle (idea:completed)
```

## Example

```text
/complete-idea #12

Checking idea #12: JSON schema validation

Related tasks:
- #25: Implement schema validation ✅
- #26: Add validation tests ✅

All 2 tasks completed!

Marking idea #12 as completed...

Done! Idea #12 is now completed and closed.
```
