---
name: validate-idea
description: Evaluate a single idea and decide to accept or reject it. Use when you want to validate a pending idea by analyzing its feasibility, effort, and impact.
---

# Validate Idea

Evaluate a pending idea and decide whether to accept or reject it.

## Instructions

When the user runs `/validate-idea #N` (where N is the issue number):

### Step 1 - Fetch the Idea

```bash
gh issue view N --repo jmlweb/tooling --json number,title,body,labels
```

Verify it has the `idea:pending` label. If not, inform user.

### Step 2 - Analyze the Idea

Evaluate against project context:

1. Read relevant files:
   - `README.md`, `AGENTS.md` for project goals
   - Existing packages and their purpose
   - Current roadmap or priorities

2. Check for duplicates:
   - Search existing issues for similar concepts
   - Check if functionality already exists in codebase

3. Assess feasibility:
   - Technical complexity
   - Dependencies required
   - Integration with existing architecture

### Step 3 - Estimate Effort and Impact

**Effort levels:**

| Level  | Time     | Scope                            |
| ------ | -------- | -------------------------------- |
| Low    | <2 hours | Single file, minimal testing     |
| Medium | 2-8 hrs  | Multiple files, moderate testing |
| High   | >8 hours | Significant changes, extensive   |

**Impact levels:**

| Level  | Description                              |
| ------ | ---------------------------------------- |
| Low    | Nice to have, minimal user benefit       |
| Medium | Noticeable improvement, moderate benefit |
| High   | Game changer, significant benefit        |

### Step 4 - Present Recommendation

Show:

- Effort estimate with reasoning
- Impact estimate with reasoning
- Recommendation: Accept or Reject
- If reject: specific reason

Ask user to confirm decision.

### Step 5 - Apply Decision

**If ACCEPTED:**

```bash
# Remove pending, add accepted + effort + impact labels
gh issue edit N --repo jmlweb/tooling \
  --remove-label "idea:pending" \
  --add-label "idea:accepted,effort:medium,impact:high"

# Add validation comment
gh issue comment N --repo jmlweb/tooling --body "$(cat <<'EOF'
## Validation Result: ✅ ACCEPTED

**Effort:** Medium (2-4 hours estimated)
**Impact:** High (improves developer experience significantly)

**Reasoning:**
[Why this idea was accepted]

---
*Ready for `/feed-backlog` to convert to task.*
EOF
)"
```

**If REJECTED:**

```bash
# Change to rejected label
gh issue edit N --repo jmlweb/tooling \
  --remove-label "idea:pending" \
  --add-label "idea:rejected"

# Add rejection comment and close
gh issue comment N --repo jmlweb/tooling --body "$(cat <<'EOF'
## Validation Result: ❌ REJECTED

**Reason:** [Specific reason for rejection]

**Details:**
[Explanation of why this idea was not accepted]

---
*This idea has been rejected. The issue will be closed.*
EOF
)"

gh issue close N --repo jmlweb/tooling
```

## Decision Guidelines

**Lean toward ACCEPT when:**

- High impact + low effort (quick wins)
- Aligns with project goals
- Solves real pain point
- Natural extension of existing features

**Lean toward REJECT when:**

- Low impact + high effort (poor ROI)
- Out of project scope
- Already exists or duplicates another idea
- Technical infeasibility
- Security concerns

## Example

```text
/validate-idea #15

Analyzing idea #15: Generate TypeScript types from JSON schemas

Effort: Medium
- Requires new CLI command
- Need to integrate with existing build pipeline
- Some testing required

Impact: High
- Reduces manual type definition work
- Ensures types match schemas
- Improves DX significantly

Recommendation: ✅ ACCEPT

Accept this idea? [Yes/No]
```
