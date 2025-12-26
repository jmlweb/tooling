# Validate Ideas (Batch)

Review and validate all pending ideas in a single session.

## Instructions

When the user runs `/validate-ideas`:

### Step 1 - Fetch All Pending Ideas

```bash
gh issue list --repo jmlweb/tooling --label "idea:pending" --json number,title,body --limit 50
```

If no pending ideas, inform the user and exit.

### Step 2 - Analyze Each Idea

For each pending idea:

1. Read the issue content
2. Evaluate effort and impact
3. Determine recommendation (accept/reject)
4. Note reasoning

### Step 3 - Present Summary Table

Display all ideas with recommendations:

```text
Pending Ideas Analysis:

| #   | Title                          | Effort | Impact | Recommendation |
|-----|--------------------------------|--------|--------|----------------|
| #12 | Add JSON schema validation     | Low    | High   | Accept         |
| #15 | Generate TS types from schemas | Medium | High   | Accept         |
| #18 | Dark mode for docs             | High   | Low    | Reject         |
| #20 | Add logging utility            | Low    | Medium | Accept         |

Details:
- #12: Quick win, improves data integrity
- #15: Significant DX improvement, worth the effort
- #18: High effort for cosmetic change, out of scope
- #20: Useful utility, easy to implement
```

### Step 4 - Ask for Confirmation

Options:

1. **Apply all** - Accept/reject all as recommended
2. **Select** - Let user choose which to apply
3. **Cancel** - Make no changes

### Step 5 - Apply Decisions

For each confirmed decision, execute the same logic as `/validate-idea`:

- Add appropriate labels (effort, impact, accepted/rejected)
- Add validation comment
- Close rejected issues

### Step 6 - Offer Task Creation

If there are accepted ideas, ask:

```text
Create tasks for accepted ideas now? [Yes/No]
```

**If Yes**: For each accepted idea, apply `/feed-backlog` logic:

1. Map effort/impact to priority:

   | Effort | Impact | Priority |
   | ------ | ------ | -------- |
   | Low    | High   | critical |
   | Low    | Medium | high     |
   | Medium | High   | high     |
   | Medium | Medium | medium   |
   | High   | High   | high     |
   | \*     | Low    | low      |

2. Create task issue:

   ```bash
   gh issue create \
     --repo jmlweb/tooling \
     --title "Task title derived from idea" \
     --body "$(cat <<'EOF'
   ## Description

   [Description from idea]

   ## Acceptance Criteria

   - [ ] Criteria from idea

   ## Source

   Derived from idea #N: [Idea title]

   ---
   *Created via /validate-ideas*
   EOF
   )" \
     --label "type:feature,priority:high"
   ```

3. Close the idea with a comment referencing the created task(s):

   ```bash
   gh issue close N --repo jmlweb/tooling --comment "$(cat <<'EOF'
   ## Converted to Backlog

   This idea has been converted to actionable task(s) and is now closed:

   - #X: Task title

   The idea is considered "resolved" as it has been broken down into work items. Track progress through the individual task(s) above.

   ---
   *Closed automatically via /validate-ideas*
   EOF
   )"
   ```

**If No**: Skip task creation, ideas remain as `idea:accepted` for later `/feed-backlog`.

### Step 7 - Show Summary

```text
Validation complete:

Accepted: #12, #15, #20
Rejected: #18

Tasks created: #25, #26, #27
3 ideas converted to tasks and closed
1 idea rejected and closed
```

Or if user skipped task creation:

```text
Validation complete:

Accepted: #12, #15, #20
Rejected: #18

3 ideas ready for /feed-backlog
1 idea rejected and closed
```

## Efficiency Tips

- Process ideas in priority order (quick wins first)
- Group similar ideas for consistent evaluation
- Note dependencies between ideas
- Flag potential duplicates

## Example

```text
/validate-ideas

Found 4 pending ideas. Analyzing...

| #   | Title                      | Effort | Impact | Rec.   |
|-----|----------------------------|--------|--------|--------|
| #12 | JSON schema validation     | Low    | High   | Accept |
| #15 | Generate TS types          | Medium | High   | Accept |
| #18 | Dark mode for docs         | High   | Low    | Reject |
| #20 | Add logging utility        | Low    | Medium | Accept |

Apply all recommendations? [Yes/Select/Cancel]
> Yes

Create tasks for accepted ideas now? [Yes/No]
> Yes

Done! 3 accepted, 1 rejected.
Tasks created: #25 (from #12), #26 (from #15), #27 (from #20)
```
