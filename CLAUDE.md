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
css/        one file per CSS tab, site-wide or per-page
js/         Head- and Body-tab scripts, pasted inside <script>
assets/     images and video referenced by URL
docs/       the reference above
reference/  vendored third-party CSS, read-only
```

- No build, lint, or test step. Do not add `npm` scaffolding unless asked; a
  preprocessor breaks the paste-into-Super workflow.
- One file per Super injection target, named `<scope>-<action>.<ext>`: a page name
  for per-page code (`home-video-play.js`), a feature name site-wide
  (`footer-inject.js`). A file named for a page belongs in that page's Code editor.
- Every file here is a **mirror, not a source**. Super does not read this repo. After
  editing, paste into Super; when someone edits in Super, pull it back so the two
  stay in sync.

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
