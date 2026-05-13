# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## References for initializing / evolving this file

Before making structural changes to this file (or `AGENTS.md`), read:
<https://github.com/brando90/agents-config>

That repo documents a three-layer architecture for agent config (entry points → shared rules/routing → domain docs) and is the recommended reference for how CLAUDE.md / AGENTS.md should be organized as the codebase grows. Prefer linking into new rule files there over letting this file balloon past a single page.

## Commands

```bash
npm run dev       # Dev server at localhost:3000 (hot reload)
npm run build     # Production build
npm start         # Serve production build
npm run lint      # ESLint
```

No test suite configured yet.

## Tech Stack

- **Next.js** (App Router) + **React 19** + **TypeScript** (strict, path alias `@/*` → `./src/*`)
- **Tailwind CSS v4** via PostCSS
- **Framer Motion** for animations; **Lucide React** for icons
- **gray-matter** + **remark** for Markdown → HTML blog pipeline

## Architecture

### Routing (App Router)
```
src/app/
├── page.tsx           # Home — animated hero with typewriter Lean code demo
├── about/page.tsx     # Team & mission
├── blog/page.tsx      # Blog listing (sorted by date)
├── blog/[slug]/page.tsx  # Dynamic blog posts (static generation)
└── layout.tsx         # Root layout: Navbar + Footer + fonts
```

### Content System
Markdown files in `/posts/` with YAML frontmatter (`title`, `date`, `description`).
`src/lib/posts.ts` owns the full pipeline: read files → parse frontmatter → convert to HTML → return sorted list.
Blog `[slug]/page.tsx` uses `generateStaticParams()` + `generateMetadata()` for static generation and SEO.

### Components
- `Background` — animated gradient blobs + grid overlay (purely decorative, always Server Component)
- `Navbar` — scroll-triggered transparency (requires `"use client"`)
- `Button` — `primary` / `outline` variants
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)

### Client vs Server boundary
Framer Motion animations and scroll listeners are isolated in `"use client"` components. Pages and the blog pipeline are Server Components by default.

## Blog Post Workflow

Posts are written through an **experiments → posts** pipeline. Do not skip this — raw transcripts are private.

```
experiments/NN_<slug>/
  README.md                          # topic, status, key angles
  drafts/                            # v1.md, v2.md, final.md
  prompts/                           # LLM prompts used to draft/refine
  figures/                           # images, diagrams
  scripts/                           # automation
  transcripts/
    transcript_raw.txt               # gitignored — informal/unedited
    transcript_zoom_companion.txt    # tracked — Zoom auto-generated summary
    transcript_summary_notes.txt     # tracked — curated technical notes for drafting
```

Steps: draft → PR review → copy `drafts/final.md` → `posts/<slug>.md` with frontmatter (`title`, `date`, `description`) → Twitter post (required) → YouTube link (optional, if session was recorded).

Every post must end with a **TL;DR** section followed by a BibTeX citation block.

- **TL;DR:** 3–6 bullet points that summarize the concrete takeaways (commands, tools, decisions) a reader should walk away with. Placed immediately before the citation block, under an `## TL;DR` heading.
- **Citation:** BibTeX block listing all authors (full names). Key format: `firstauthorYYYYslug`. Use `howpublished={Stanford Lean Club Blog}`. Fill in the real `url={...}` once the post is live (replace any `TODO` placeholder).

**When drafting:** always read all 3 transcripts — `transcript_raw.txt`, `transcript_zoom_companion.txt`, and `transcript_summary_notes.txt`. The raw transcript contains technical details (exact commands, live problems encountered) that the summary will miss.

**Numbering:** `00_`, `01_`, `02_` ... in creation order under `experiments/`.

### Styling conventions
- Stone color palette (`stone-50` … `stone-900`)
- Merriweather serif for headings, Inter sans-serif for body (loaded via `next/font/google`)
- `@tailwindcss/typography` prose classes for rendered Markdown
