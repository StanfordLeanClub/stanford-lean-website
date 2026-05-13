# Stanford Lean Club — Website

Next.js website for the Stanford Lean Club, including the public blog.

## Blog Post Workflow

Blog posts are written through an **experiments → posts** pipeline:

1. **Create an experiment folder** for the post under `experiments/NN_<slug>/`:
   ```
   experiments/
     00_claude_code_workflow_snap_cluster/
       README.md          # topic, status, key angles
       drafts/            # v1.md, v2.md, final.md
       prompts/           # LLM prompts used to draft/refine
       figures/           # images, diagrams
       scripts/           # any automation
       transcripts/
         transcript_raw.txt              # raw/informal — NOT tracked by git (.gitignore)
         transcript_zoom_companion.txt   # Zoom auto-generated summary — tracked
         transcript_summary_notes.txt    # curated technical notes for drafting — tracked
   ```
2. **Draft** in `drafts/` using **all 3 transcripts** as inputs: raw, zoom companion, and summary notes. Do not draft from summary notes alone — the raw and zoom transcripts contain details that don't make it into the summary.
3. **Review** via PR — assign relevant club members to approve before publishing.
4. **Add citation** at the end of every post in BibTeX format:
   ```bibtex
   @misc{firstauthorYYYYslug,
     author={Full Name and Full Name and ...},
     title={Post Title},
     year={YYYY},
     howpublished={Stanford Lean Club Blog},
     url={TODO: add final URL once live},
   }
   ```
5. **Publish** by copying the final `.md` into `posts/` with proper YAML frontmatter (`title`, `date`, `description`).
5. **Promote** once the post is live:
   - **Twitter (required):** post a thread or short announcement linking to the blog post from the club account.
   - **YouTube (optional):** if the session was recorded as a video, upload it and link it from the blog post.

**Numbering:** experiments are prefixed `00_`, `01_`, `02_`, ... in creation order.

**Privacy:** `transcript_raw.txt` files are gitignored (may contain informal/unedited content). Only `transcript_zoom_companion.txt` is committed.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). See the **Deployment** section below for how production pushes reach the live site.

## Deployment

The public site is built as a static Next.js export and deployed by **GitHub Pages** via the `.github/workflows/deploy.yml` workflow. Every push to `main` runs the workflow, which builds `out/` and publishes it. No third-party service is required — if you can push to `main`, the site will update.

**Current URL:** https://stanfordleanclub.github.io/stanford-lean-website/

A custom apex domain is tracked in #3 — once one is chosen and DNS is repointed to GitHub Pages, drop `basePath`/`assetPrefix` from `next.config.ts` and add a `public/CNAME` file with the chosen domain.

### Verify a deploy landed

```bash
# Should print a date within the last few minutes of your push
curl -sI https://stanfordleanclub.github.io/stanford-lean-website/ | grep -i last-modified

# Should print the string if the change is live
curl -s https://stanfordleanclub.github.io/stanford-lean-website/about/ | grep -o "Founder & President"
```

You can also watch the run directly: **Actions** tab → **Deploy to GitHub Pages** → most recent run.

### If a deploy fails or the site is stale

1. **Check the Actions run:** red ❌ on the latest workflow means the build failed — open the log, fix the error, push again.
2. **Manually re-run:** GitHub → **Actions → Deploy to GitHub Pages → Run workflow** (the `workflow_dispatch` trigger is enabled).
3. **Check Pages is enabled:** repo **Settings → Pages** → Source must be **GitHub Actions** (not "Deploy from a branch").
4. **Custom domain (once configured):** `Settings → Pages → Custom domain` should match the chosen domain with a green check. The `public/CNAME` file must contain exactly that domain — GitHub reads it on every deploy and will overwrite the dashboard setting if they disagree.

### One-time setup (required after making the repo public)

1. **Enable Pages:** repo **Settings → Pages → Source = GitHub Actions**.
2. **Point DNS at GitHub** (done at the domain registrar, not on GitHub) — once a custom domain has been chosen:
   - For the apex domain, replace existing A records with these four:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - For the `www` subdomain (optional), add a CNAME record pointing to `stanfordleanclub.github.io`.
3. **Enable HTTPS** in **Settings → Pages** once DNS propagates (a few minutes to an hour).
4. **Push any commit** to trigger the first deploy.

### Local development

```bash
npm install
npm run dev    # http://localhost:3000 (hot reload)
npm run build  # produces ./out — same artifact Pages serves
npm run lint
```
