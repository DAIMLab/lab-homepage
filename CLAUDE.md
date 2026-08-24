# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

Source assets for the DAIM lab homepage as it moves off IMweb hosting onto **Notion + Super.so**.

This repo holds only what Super cannot store as content: custom CSS, custom JS, images, and video. Page content, structure, and navigation live in Notion. Nothing here is bundled; files are pasted into Super's Code editor or linked by public URL.

## Deployment Pipeline

```
Notion page (source of truth for content)
  → Super.so Code editor (CSS / Head / Body tabs)
    → daim.super.site  (later: daim.kaist.ac.kr)
```

| Endpoint | URL |
| --- | --- |
| Notion source page | https://app.notion.com/p/DAIM-Homepage-3c611c7b703c809fb685f773804f1684 |
| Super deploy target | https://daim.super.site |
| Legacy IMweb site | https://daim.kaist.ac.kr (design reference) |
| Migration hub page | https://app.notion.com/p/3c611c7b703c81048890e7acbf407ea8 (`랩실 홈페이지 Super.so 이전`) |
| GitHub repo | `git@github.com:DAIMLab/lab-homepage.git` (public) |

No build, lint, or test step. Do not add `npm` scaffolding unless asked; a preprocessor breaks the paste-into-Super workflow.

Super server-renders every page, so `curl https://daim.super.site/<slug>` returns the real DOM with all classes intact. Use it to check selectors without opening a browser. The legacy IMweb site is the opposite: client-rendered, so `curl` yields almost nothing and it must be inspected in a browser.

## Repository Layout

```
css/super-custom.css   mirror of the CSS currently pasted into Super's CSS tab
js/                    scripts for the Head/Body tabs
assets/                images and video referenced by URL
```

`css/super-custom.css` is a **mirror, not a source**. Super does not read this repo. After editing it, paste the file into the Super Code editor's CSS tab, and when someone edits CSS in Super directly, pull it back here so the two stay in sync. Re-extract the live version with:

```bash
curl -sL https://daim.super.site/ | sed -n 's/.*@charset/@charset/p' | head -c 4000
```

## Super Code Injection

Reference for selectors and custom code is **https://docs.super.so/** — `/super-css-classes` for the class list, `/custom-code` for injection, `/code-snippets` for worked examples. Check the docs first; fall back to browser devtools (or the `curl` above) only for things the docs do not cover.

Three tabs in Super's Code editor: **CSS**, **Head** (analytics, embeds, `<script>`), **Body** (HTML at the top of the page). Code can be applied site-wide from the site editor's Code page, or per-page via the code icon on an individual page. Prefer per-page injection over CSS selector gymnastics when a rule only concerns one page.

Class naming follows a BEM-ish scheme: `notion-*` for rendered Notion blocks, `super-*` for Super's own chrome (navbar, footer, sidebar, password page). Confirmed present on this site: `super-root`, `super-content-wrapper`, `super-navbar__{content,item-list,item,logo,actions,viewport-wrapper}`, `notion-root`, `notion-{header,heading,text,link,callout,toggle,quote,divider,image,column-list,column,page}`, `notion-collection-{card,list}__*`, `notion-property__*`. No footer is enabled yet, so no `super-footer` markup exists.

### Per-Page Scoping

Every page carries its slug on `<main>` and its parent on the same element. Verified across all five site pages:

| Page | `<main>` classes |
| --- | --- |
| Home | `super-content page__index` |
| About DAIM | `super-content page__about-daim parent-page__index` |
| Publications | `super-content page__publications parent-page__index` |
| Projects | `super-content page__projects parent-page__index` |
| Lab News | `super-content page__lab-news parent-page__index` |

Scope with `.page__projects .notion-collection-card { … }` rather than restyling a block type site-wide. `<main>` also has `id="page-<slug>"`, and the root article has `id="block-<slug>"`.

## Theming Through CSS Variables

Super defines its whole palette and layout as custom properties on `html.theme-light` and `:root`. Override the variable instead of writing per-block rules; that is the shortest path from the Ascent template's look to the DAIM design.

Variables worth knowing: `--color-{text,bg,pill,pill-text}-<color>` and `--<color>-h/-s/-l` (each Notion color is built from HSL parts, so shifting `--green-h` retints every green block at once), `--navbar-*`, `--footer-*`, `--sidebar-*`, `--primary-font` / `--secondary-font`, `--text-weight` / `--heading-weight`, `--heading{1..5}-size`, `--layout-max-width` (currently 1100px), `--padding-left` / `--padding-right`, `--navbar-height` (60px), and the per-block `--*-border-radii` / `--*-padding` / `--*-shadow` set.

The Ascent template applies green (`<span color="green">`) throughout as its accent. Notion colors are per-block, so retinting is a CSS job: override `--green-h/-s/-l` to the DAIM cyan rather than editing every block in Notion.

## Design Reference

Extracted from the live IMweb site. Match these unless overridden.

| Token | Value | Use |
| --- | --- | --- |
| Accent | `#00B8FF`, `#05b2f5` | Links, highlights, brand cyan |
| Ink | `#212121`, `#1c1c1e` | Body and heading text |
| Surface | `#ffffff`, `#f8f8f8` | Page and card backgrounds |
| Rule | `#dadada`, `#e5e5e5` | Borders and dividers |
| Display font | Montserrat | Latin headings |
| Korean font | NanumSquare | Korean text |

Super currently ships Inter as both `--primary-font` and `--secondary-font`. Montserrat and NanumSquare need `@font-face` or a Google Fonts `<link>` in the Head tab before the variables can point at them.

Site identity: title `DAIM`, description `DAIM LABS 홈페이지`, part of KAIST Industrial & Systems Engineering. Legacy logo/OG image: `https://cdn.imweb.me/upload/S20240718af4b4371a8c5a/e847603f005eb.png`.

Expect to compromise on the IMweb design. Notion's block model has no arbitrary positioning. When a legacy layout cannot be reproduced, choose the closest Notion-native structure and tell the user what differs instead of building a JS layout hack.

## Asset Hosting

Assets live in this repo and are served from GitHub. The repo is public, so no token is involved. **The URL host depends on file type**, because `raw.githubusercontent.com` sends `X-Content-Type-Options: nosniff` with a wrong or generic MIME type for everything except images:

| Asset | Host | Verified `Content-Type` |
| --- | --- | --- |
| Images (png/jpg/svg/webp) | `https://raw.githubusercontent.com/DAIMLab/lab-homepage/main/assets/…` | `image/png` — works |
| Video (mp4) | jsDelivr | raw returns `application/octet-stream`, which `<video>` will not play |
| CSS / JS files | jsDelivr, or paste into Super's Code editor | raw returns `text/plain`, which `nosniff` blocks for `<link>` and `<script>` |

jsDelivr serves the same repo with correct MIME types and a CDN in front:

```
https://cdn.jsdelivr.net/gh/DAIMLab/lab-homepage@main/<path>
```

Pin a tag or commit instead of `@main` for anything that must not change under the live site; `@main` is cached by jsDelivr for up to 24 hours, so a push is not immediately visible. For CSS, pasting into Super's CSS tab stays the primary route — it applies instantly and avoids the render-blocking external request. Keep video files under GitHub's 100 MB per-file limit; anything larger belongs on YouTube or Vimeo as a Notion embed.

## Notion Structure

Built on Super's **Ascent** template; several sections still hold template lorem ipsum. A collapsed `🎛 Control panel` toggle at the top of the page holds every link below and is hidden from the published site.

| Page | Slug | Notion ID |
| --- | --- | --- |
| Home | `/` | `fd211c7b703c8315b76b81c4858d6152` |
| About DAIM | `/about-daim` | `21f11c7b703c83f399ea01c297c4d409` |
| Team DAIM | — | `dfc11c7b703c83fd8dcb01007f12d3c0` |
| Publications | `/publications` | `11211c7b703c8253a3208121bec822f3` |
| Projects | `/projects` | `63e11c7b703c8246a3e681a2d19a3ac0` |
| Lab News | `/lab-news` | `49611c7b703c83698d1001e8650efcdc` |

Team DAIM splits into `Professor` (`3c611c7b703c80768b7fd009d6c075ed`), `Students` (`3c611c7b703c80549898c426d40729cc`), and `Alumni` (`3c611c7b703c805d942dca6661c145dc`). Four content databases (case studies, careers, and two unnamed) back the list and gallery views.

Read and edit these with the `notion-fetch` / `notion-update-page` MCP tools. Content edits belong in Notion; reach for CSS only when Notion's block options cannot express the design.

## Legacy Site Inventory

The IMweb sitemap lists `/home`, `/Team`, and fifteen numeric paths (`/21`–`/38`, `/122325403`) with no readable labels. Use it as a migration checklist and open each in a browser to identify it.
