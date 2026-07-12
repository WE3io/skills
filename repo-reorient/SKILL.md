---
name: repo-reorient
description: Reorient stale coding, Git, branch, PR, or repository work before editing. Use when resuming an old LLM thread, continuing work from prior chat context, switching between repos, after branches may have been merged/deleted, before making code changes, before committing/pushing, or when the user asks to "pick up where we left off", "continue", "check git state", "reorient", or "make sure we are on the right branch".
---

# Repo Reorient

Use this skill to prevent stale branch assumptions, accidental edits on the wrong repo, and confusion after branches are merged or deleted.

## First response

Tell the user you are reorienting before editing. Do not modify files yet.

## Required checks

Run read-only checks in the active repo:

```bash
pwd
git status --short --branch
git branch -avv
git log --oneline --decorate --max-count=10
git remote -v
```

If multiple repos may be involved, inspect each plausible repo separately rather than assuming the current directory is correct.

## Report back

Summarize:

- current repo path
- remote URL
- current branch
- clean/dirty working tree
- ahead/behind status
- relevant local and remote branches
- whether the user’s remembered branch exists, was merged, was deleted, or is stale
- what the safe next action is

## Safety rules

- Do not recreate a missing branch unless the user explicitly asks.
- Do not merge, delete branches, commit, push, or edit files during reorientation.
- If the working tree is dirty, identify changed files before doing anything else.
- If branch context conflicts with chat memory, trust Git state and explain the mismatch.
- If the repo is not clear, ask for the intended repo before editing.

## Recommended handoff prompt for stale threads

When helping the user hand off to another LLM thread, provide this prompt:

```text
Branch/repo context may be stale. Reorient before making changes:
1. Run pwd
2. Run git status --short --branch
3. Run git branch -avv
4. Run git log --oneline --decorate --max-count=10
5. Run git remote -v
Then tell me the repo, branch, clean/dirty state, ahead/behind state, and whether my remembered branch still exists.
Do not edit files until after that.
```
