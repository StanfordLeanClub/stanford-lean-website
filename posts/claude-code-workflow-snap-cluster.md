---
title: "Running Claude Code on Stanford's SNAP Cluster: A Real Research Workflow"
date: "2026-03-17"
description: "How we use Claude Code agents, tmux, and the SNAP cluster filesystem to run formalization research experiments — a live demo walkthrough from the Stanford Lean Club."
---

# Running Claude Code on Stanford's SNAP Cluster: A Real Research Workflow

*From a live Stanford Lean Club session with Brando, William, Sri, Eshaan, and Matt Chen.*

---

Most tutorials show you Claude Code on a toy project on your laptop. That's not how research works. In this post we walk through how we actually use Claude Code on Stanford's SNAP cluster — multiple tmux sessions, persistent agents, AFS/DFS/LFS filesystems, Kerberos surprises and all.

This came out of a live demo session where Brando walked the club through his full setup. No cleanup, no prettifying — just the real workflow.

---

## Why SSH into the Cluster Instead of Working Locally

The first question is: why not just run Claude Code on your laptop and push/pull via git?

The short answer: **you want to see edits as they happen.**

When Claude Code agents are modifying your files, you want those changes reflected in your editor immediately. If you open the project locally while the agent runs remotely, you're stuck doing `git pull` every few minutes just to see what changed. That's friction. Instead, SSH directly into the server and open the project there via Cursor's remote SSH extension — edits appear live.

The second reason is more practical: **which server to use matters**. SNAP has several machine classes:

- `skampere2`, `skampere3` (H200s, B200s) — powerful, but used heavily by the full lab. People will ping you.
- `ampere1`, `ampere8` (A100s) — "loaner" machines. Less traffic, no pings from labmates, GPU free most of the time.

For day-to-day work mixing GPU experiments with API calls, `ampere1` is the sweet spot. Save the B200s for overnight runs of large models.

---

## The `clauded` Shortcut

You'll notice we never type `claude --dangerously-skip-permissions`. Instead we use `clauded`:

```bash
# /dfs/scratch0/brando9/bin/clauded
claude --dangerously-skip-permissions "$@"
```

This lives as a **script** (not a bash alias) on DFS, so it works in every context: interactive shells, tmux panes, cron jobs, everything. Aliases don't load in non-interactive shells — scripts do.

Why `--dangerously-skip-permissions`? Because the permission prompts interrupt long-running agentic workflows. The safety net isn't the prompts — it's **git**. Every repo is git-tracked. If Claude does something you didn't want, `git diff` shows it, `git checkout` reverts it. That's enough.

---

## The CLAUDE.md Hierarchy

Claude Code reads `CLAUDE.md` files to understand its context. We use a three-level hierarchy:

```
~/CLAUDE.md                          # server root — SNAP cluster setup, filesystems, API keys
~/veribench/CLAUDE.md                # repo-level — project-specific instructions
~/veribench/experiments/00_.../      # experiment scripts and prompts
```

The server-level `CLAUDE.md` is shared across **all** SNAP servers via DFS and symlinked from each server's `$HOME`. It never hardcodes server-specific hardware — instead it tells Claude to run discovery commands at the start of each session:

```bash
hostname
nvidia-smi --query-gpu=index,name,memory.total,memory.free --format=csv,noheader
nproc
free -h
```

This way one file works on ampere1 (8× A100-80GB), skampere2 (8× H200-140GB), mercury1 (10× RTX A4000-16GB), and any new server added to the cluster.

---

## SNAP Filesystems: LFS, DFS, AFS

This trips up everyone new to SNAP. There are three filesystems and each has a different role:

| Mount | Scope | Speed | Use for |
|-------|-------|-------|---------|
| `/lfs/<hostname>/0/brando9` | Local to server | Fastest | Active datasets, checkpoints, `$HOME` |
| `/dfs/scratch0/brando9` | All servers | Medium | Repos, shared scripts, CLAUDE.md |
| `/afs/cs.stanford.edu/u/brando9` | All servers | Slow | Backups, important configs |

**The rule:** keep repos on DFS so they're accessible from any server and survive a machine wipe. Use LFS for speed-sensitive data. AFS for anything you can't afford to lose.

DFS uses AutoFS — if a mount looks missing, just `cd /dfs/scratch0` to trigger it.

---

## tmux: The Real Workflow

Here's where it gets interesting. The actual workflow isn't "open one Claude session, wait for it to finish." It's closer to being a principal investigator managing a team:

```
tmux session 0  →  Claude agent on veribench experiment
tmux session 1  →  Claude agent on lean-ebm paper
tmux session 2  →  Claude agent updating CLAUDE.md files
tmux session 3  →  free / monitoring
```

Every agent runs in its own tmux session. When your laptop dies, they keep running. When you come back, you `tmux attach -t 0` and see exactly what happened.

The mental model shift: **you are not the coder anymore, you are the director**. Your job is deciding what each agent should do next, reviewing diffs, and managing context-switching between sessions. The skill is not writing code — it's writing good prompts and knowing when to interrupt an agent before it goes too far.

One practical trick: while one agent is running, use that time to draft the next prompt for the next agent. Don't sit idle waiting.

---

## Sonnet over Opus

A practical note: we use `claude-sonnet-4.6` for almost everything, not Opus.

Opus is slower and during peak hours the congestion is real. Sonnet is fast, surprisingly capable, and fits most research tasks. Save Opus for things that genuinely need it (complex reasoning chains, difficult code rewrites). For day-to-day file edits, README generation, and experiment scaffolding, Sonnet is plenty.

---

## Cursor Workspaces for Multi-Repo Projects

When you're working across several repos simultaneously (veribench, lean-ebm, the club website, harbor), Cursor workspaces let you keep them all open in one window. Set it up once, save the workspace, reopen it any time with zero friction.

This matters more than it sounds. Context-switching overhead is real. Every time you close and reopen a project you lose your mental map of where things are. A saved workspace means all your repos are one click away.

---

## The Kerberos Problem (and Fix)

If you run long jobs on SNAP, you will hit this. Stanford uses Kerberos + AFS authentication. Tokens expire after ~10 hours. When they expire mid-run, Claude Code freezes waiting on filesystem operations that silently fail — no error, just a hung session.

**The right fix: use `krbtmux` instead of plain `tmux`.**

From the [SNAP long-jobs docs](https://ilwiki.stanford.edu/doku.php?id=hints:long-jobs):

```bash
# 1. Start your session with krbtmux (Kerberos-aware tmux wrapper)
/afs/cs/software/bin/krbtmux

# 2. Inside the session, run reauth — this daemon keeps renewing
#    your Kerberos tickets in the background indefinitely
/afs/cs/software/bin/reauth

# 3. Now start your Claude Code agents / experiments as normal
clauded
```

When you detach and re-attach later, use regular `tmux attach` — `krbtmux` is only needed at session creation.

If you already have a plain tmux session that's losing tokens, the emergency fix is:

```bash
# In any pane in the session:
/afs/cs/software/bin/reauth
```

**Why this happens:** When you log out, your Kerberos ticket expires. Plain `tmux` keeps the session alive but does nothing to renew the ticket. `krbtmux` is a wrapper that copies your current tickets into the session and `reauth` is a Perl daemon that keeps renewing them. Without this, long Claude Code runs on SNAP will silently freeze overnight.

Add `krbtmux` + `reauth` to your experiment README as a checklist item before any long run.

---

## LaTeX from Day One

One workflow philosophy worth stealing: **start writing the paper on day one**.

Not a draft, not an outline — actual LaTeX. The repo has a `paper/` folder with a NeurIPS or ICML template from the start. As experiments run and results come in, the paper gets updated alongside the code.

Why? Because now Claude Code can use the paper as context. You can say "update the experiments section with these new numbers" or "write a related work paragraph about X." The paper becomes both documentation and a prompt source. And since it's in the repo (not Overleaf), if LaTeX breaks, you just tell Claude to fix it until it compiles.

---

## Experiment Organization

Each project has an `experiments/` folder with numbered subdirectories:

```
experiments/
  00_initial_baseline/
    scripts/        # runnable code
    prompts/        # .md files with Claude prompts
    results/        # outputs
    README.md       # what this experiment is, status, results summary
```

The `.md` prompt files are the key artifact. They're reproducible, version-controlled, and can be fed directly to Claude Code. Future you (or a labmate) can rerun the exact same agent workflow just by reading the prompt file.

---

## Getting Access

The club is working on getting shared Claude Code credits via Anthropic. In the meantime:

- Claude Max plan ($200/mo) is what Brando runs — sufficient for a full research workflow
- The SNAP cluster access requires a Stanford CS account — contact your advisor or the Infolab admin
- DFS/LFS/AFS setup details are in `~/CLAUDE.md` — copy what's useful for your own setup

Join the Discord for updates on credits and future sessions.

---

## Bonus: @claude in GitHub PRs and Issues

One more trick we set up for this repo: you can mention `@claude` directly in any GitHub PR comment or issue and it will respond automatically.

It uses Anthropic's official [`claude-code-action`](https://github.com/anthropics/claude-code-action), set up as a GitHub Actions workflow:

```yaml
# .github/workflows/claude.yml
name: Claude Code Assistant

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]
  pull_request_review:
    types: [submitted]

jobs:
  claude:
    runs-on: ubuntu-latest
    permissions:
      id-token: write      # required by claude-code-action
      contents: read
      issues: write
      pull-requests: write
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          trigger_phrase: "@claude"
```

Setup:
1. Add your `ANTHROPIC_API_KEY` to the repo's GitHub Secrets
2. Drop the workflow file into `.github/workflows/claude.yml`
3. That's it — `@claude` in any comment triggers a response

This means the same agent that helps you write code on the cluster is also available to your collaborators directly in GitHub. Ask it to review a diff, explain a function, or suggest edits to a blog post draft — right in the PR thread.

---

## What's Next

In the next session we'll cover:
- Running long overnight jobs on skampere (B200s) with tensor parallelism
- Git worktrees for running multiple Claude agents on the same repo without conflicts (Sri is investigating this)
- Harbor framework for structured experiment pipelines

*This post was drafted from the live session transcript using Claude Code. The workflow eats its own cooking.*

---

## TL;DR

- SSH into SNAP (prefer `ampere1`/`ampere8` loaners over the shared `skampere*` boxes) and open the project in Cursor over remote SSH so agent edits show up live.
- Alias `clauded="claude --dangerously-skip-permissions"` and run it inside `tmux` (or `krbtmux`/`reauth`) so agents survive disconnects and Kerberos token expiry.
- Use `claude-sonnet-4.6` for day-to-day work; reserve larger models for hard debugging.
- Know your filesystems: AFS for small/home, DFS for project data, LFS for large scratch — don't let agents write logs to the wrong one.
- Follow the `experiments/NN_<slug>/` structure (README, drafts, prompts, figures, transcripts) so sessions turn cleanly into blog posts.
- `@claude` works in PRs/issues via `anthropics/claude-code-action@v1` — requires `id-token: write` permission and `ANTHROPIC_API_KEY` in secrets.

---

## Citation

```bibtex
@misc{miranda2026claudecode,
  author={Brando Miranda and William Peng and Srivatsava and Eshaan and Matt Chen},
  title={Running {Claude Code} on {Stanford}'s {SNAP} Cluster: A Real Research Workflow},
  year={2026},
  howpublished={Stanford Lean Club Blog},
  url={https://stanfordleanclub.github.io/stanford-lean-website/blog/claude-code-workflow-snap-cluster/},
}
```
