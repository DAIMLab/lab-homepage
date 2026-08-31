# CLAUDE.md

Source assets for the DAIM lab homepage on **Notion + Super.so**. Page content,
structure, and navigation live in Notion. This repo holds only what Super cannot
store as content: CSS, JS, images, video. Nothing is bundled; files are pasted into
Super's Code editor or linked by public URL.

```
Notion page  →  Super.so Code editor  →  daim.super.site
```

## Where Facts Live

This file holds rules that do not change. Everything that does change lives in
`docs/`, and those files are the source of truth. Read the relevant one before
guessing, and update it in the same commit that makes it stale.

| Question | File |
| --- | --- |
| Which pages and databases exist, their slugs and Notion IDs | `docs/notion.md` |
| Super classes, CSS variables, native settings, design tokens, the footer band | `docs/super.md` |
| Which host an asset URL uses and how it caches | `docs/hosting.md` |
| What the old IMweb site holds and what has been migrated | `docs/legacy.md` |

`README.md` is the human entry point and links the same set.

## Repository Rules

```
code/       what gets pasted into a Head tab, one file per injection target:
            <page>.html per page, global.html site-wide
css/        stylesheet sources: linked from code/ by pinned URL, or pasted
            into a CSS tab
js/         script sources: linked from code/ by pinned URL, or pasted into a
            Body tab inside <script>
assets/     images and video referenced by URL
docs/       the reference above; docs/mockups/ holds standalone design
            proposals, kept for the record and served nowhere
reference/  vendored third-party CSS, read-only
```

- No build, lint, or test step. Do not add `npm` scaffolding unless asked; a
  preprocessor breaks the paste-into-Super workflow.
- One file per Super injection target. Head-tab paste files live in `code/`,
  named for the page (`code/people.html`, `code/global.html`). Pasted CSS and
  Body scripts keep `<scope>-<action>.<ext>` names in `css/` and `js/`.
- A **pasted** file is a mirror, not a source: Super does not read this repo, so
  paste after editing, and pull back edits made in Super. A **linked** file is
  the source itself: the live site fetches it from jsDelivr at a pinned SHA, so
  a change is a commit, a push, and a URL bump in `code/`.

Re-extract the live site-wide CSS with:

```bash
curl -sL https://daim.super.site/ | sed -n 's/.*@charset/@charset/p' | head -c 4000
```

## Build Rules

- **Native before custom.** Check <https://docs.super.so/> first; custom code is the
  last resort. `docs/super.md` lists the native paths already confirmed.
- **Content edits belong in Notion.** Reach for CSS only when Notion's block options
  cannot express the design.
- **Override a Super CSS variable** before writing a per-block rule.
- **Never write the site's own URL into Notion or code.** Link a site page with a
  Notion page mention; Super rewrites it to a relative path that survives a domain
  change. A pasted `https://<host>/...` freezes the host.
- **Prefer per-page injection** over CSS selector gymnastics when a rule concerns one
  page.
- **Expect to compromise on the IMweb design.** Notion's block model has no arbitrary
  positioning. When a legacy layout cannot be reproduced, choose the closest
  Notion-native structure and say what differs instead of building a JS layout hack.

## Asset Rules

- Images load from `raw.githubusercontent.com`. CSS, JS, and video load from
  jsDelivr; raw sends a MIME type that `nosniff` rejects.
- **Never point the live site at `@main`.** Pin a full commit SHA or a tag. A branch
  URL caches in the browser for seven days and no purge reaches it.

## Inspecting the Live Site

Super server-renders every page, so `curl` returns the real DOM with classes intact.
Use it to check a selector before opening a browser.

```bash
curl -sL https://daim.super.site/<slug>
```
