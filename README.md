# ginkoemdon/staging — Experiment staging

Staging previews for `ginkoemdon.github.io` (Ginko's Prototype Playground).
Not the live site. Live at https://ginkoemdon.github.io/staging/

Modelled on Ben Emdon's `BenEmdon/staging` for `benemdon.github.io`, with
one correction: Ben's staging is **not a subdomain**. It is a GitHub Pages
project site, served as a subpath: `benemdon.github.io/staging/`.
Ginko's works the same way: `ginkoemdon.github.io/staging/`.

## Ginko's words

Ginko says **"push to preview"** to put a change on this preview site,
and **"push to main"** when she is happy with it and wants it live.
"Push to preview" = stage it here. "Push to main" = promote it to
`ginkoemdon.github.io`. Always ask her first before pushing to main.

## How it works

- Production is `ginkoemdon/ginkoemdon.github.io`, branch `main`.
  Pages deploys from `main` (legacy branch deploy, verified built).
- An experiment lives as a branch in the production repo:
  `experiment/<name>`, branched off `main`.
- Staging that experiment means copying that branch's whole site
  (full copy, so relative links work) into this repo at `<name>/`,
  plus one line in `index.html` and one entry in `experiments.json`.
  It is then viewable live at `https://ginkoemdon.github.io/staging/<name>/`.
- Nothing here is indexed: `index.html` has `noindex, nofollow` and
  `robots.txt` disallows everything.

## The four operations

### 1. Stage a new experiment

```sh
./scripts/stage.sh <name> "One-line description for the index page"
```

This creates (if needed) `experiment/<name>` in the upstream repo,
copies it into `<name>/` here, updates `experiments.json` and
`index.html`, commits, and pushes to this repo's `main`.

### 2. Sync with upstream

An experiment must stay on top of latest `main`, or it drifts.

```sh
# In the production repo, rebase the experiment branch:
git fetch origin
git checkout experiment/<name>
git rebase origin/main
git push --force-with-lease

# Then re-stage it (re-copy, keeping the experiment's changes):
./scripts/sync.sh <name>
```

`sync.sh` re-exports the experiment branch into `<name>/` and records
the new upstream SHA in `experiments.json`.

There is also automation, ready to enable: `workflows/sync-tenants.yml`
runs daily and on demand. It re-exports every tenant listed in
`experiments.json` from its `experiment/<name>` branch, so a tenant
that was rebased on latest `main` in the production repo picks up
those upstream changes here automatically. It does **not** rebase
branches itself — rebasing writes to the production repo, and that
step stays manual, with Ginko's say-so, so nothing is force-pushed
by a robot.

Note: the workflow file lives in `workflows/`, not
`.github/workflows/`, for now. Pushing a workflow file needs a
GitHub token with the `workflow` scope, and the current `gh` login
does not have it (push was refused for that reason). To enable it,
either move the file to `.github/workflows/` in the GitHub web UI,
or re-authenticate `gh` with the `workflow` scope and push it.

To check which tenants are behind `main` without changing anything:

```sh
./scripts/sync.sh --check
```

### 3. Promote to production

Only on Ginko's ship call.

```sh
# In the production repo:
git checkout main
git merge --no-ff experiment/<name>
git push origin main
# Pages deploys main automatically. Verify https://ginkoemdon.github.io/
```

Then remove the tenant here, so staging does not keep a stale copy:

```sh
./scripts/remove.sh <name> "shipped to production"
```

### 4. Cut an experiment

```sh
./scripts/remove.sh <name> "cut by Ginko"
git push origin --delete experiment/<name>   # in the production repo
```

## Files

- `index.html` — experiments index, Ginko branding, noindex.
- `experiments.json` — manifest: each tenant's name, branch,
  description, upstream SHA, and staged date. The sync workflow
  reads this list.
- `scripts/stage.sh`, `scripts/sync.sh`, `scripts/remove.sh` —
  the local workflow, using the `gh` CLI.
- `workflows/sync-tenants.yml` (enable by moving it to `.github/workflows/`) — daily / on-demand re-export
  of all tenants from their experiment branches.

## Pages setup

This repo is a Pages project site: Pages source is `main`, `/`,
legacy branch deploy. That is the same setup Ben uses for his
staging repo, and the same as Ginko's production site currently uses.

## GitHub Actions vs legacy, for production

Production (`ginkoemdon.github.io`) is currently on legacy branch
deploy from `main`, and it works — status `built`, HTTPS enforced.
Switching it to GitHub Actions would add deploy logs and explicit
control, and it is GitHub's recommended path for new sites, but for
a pure static HTML/CSS/JS site with no build step it adds no
capability, and it changes the thing that serves the live site.
Ben's production site is also still on legacy (`master`).
So: keep production on legacy for now. The Actions automation lives
here in staging, where it does useful work (syncing tenants).
If Ginko wants production on Actions later, that is a one-file
change (`.github/workflows/pages.yml` in the production repo, then
set Pages `build_type` to `workflow`) — do it as its own verified
step, not bundled with staging.
