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
css/super-custom.css   mirror of the site-wide CSS tab
css/home-hero.css      Home page per-page CSS tab
css/lab-news.css       Lab News page per-page CSS tab
html/home-hero.html    Home page per-page Body tab
html/head-fonts.html   site-wide Head tab
js/                    scripts for the Head/Body tabs
assets/                images and video referenced by URL
reference/             vendored third-party CSS, read-only
```

One file per Super injection target, named `<scope>-<purpose>`. Anything named for a page belongs in that page's per-page Code editor, not the site-wide one.

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

## Native Before Custom

Custom code is the last resort, not the first. These native paths are confirmed against the docs and replace code this repo used to carry:

| Need | Native path | Replaces |
| --- | --- | --- |
| Video autoplay | `super:{{ autoplay }}` at the end of the video block's caption (`/additional-features`) | a Body-tab script |
| Image eager load | `super:{{ eager }}` in the image caption | — |
| Image links to a URL | put the URL in the image caption; Super hides the caption | an `<a>` wrapper |
| Fonts | Design → Typography → Primary / Secondary, from Google Fonts or an upload (`/upload-fonts`) | a Head-tab `<link>` plus a `--primary-font` override |
| Palette | Design → Colors, manual or a preset | per-color CSS |
| Pretty URLs, SEO, redirects, password, hiding a page via 404 | per-page settings (`/site-pages`) | — |

This site is on Super's **Personal** plan. Font upload is included, so NanumSquare goes in Design → Typography rather than a Head-tab `<link>`. Site Files is Pro-only and out of reach; it would not help anyway (see below).

Two things that are **not** native, checked so nobody re-checks them: there is no per-page setting to hide the page title or icon, so `.notion-header { display: none }` stays CSS; and Site Files (`/site-files`) accepts only `.txt` in `root` or `.well-known`, so it cannot host assets — jsDelivr stays.

## Known Console Noise

`GET https://daim.super.site/fit=scale-down 404` and `.../quality=90 404` are Super's bug, not ours, and they are cosmetic. Diagnosed 2026-08-25, recorded so nobody re-derives it.

Super mirrors Notion-uploaded images to `images.spr.so` behind Cloudflare Images, whose options are comma-separated: `…/logo-kaist-daim-labs/w=1920,quality=90,fit=scale-down`. `srcset` also separates its candidates with commas, and Super emits the URL without encoding them, so the browser splits one URL into three candidates. Two of them (`quality=90`, `fit=scale-down`) are not URLs, resolve relative to the origin, and 404.

The `src` attribute is a single well-formed URL, so the image itself renders. Nothing in CSS can help — `srcset` is parsed regardless of `display: none`. Expect it to reappear for any raster image uploaded into Notion; images referenced by external URL are not proxied and do not trigger it.

The one on Home comes from the leftover Ascent logo image inside the hidden `🎛 Control panel` toggle. Deleting that image block in Notion removes both 404s.

## Theming Through CSS Variables

Super defines its whole palette and layout as custom properties on `html.theme-light` and `:root`. Override the variable instead of writing per-block rules; that is the shortest path from the Ascent template's look to the DAIM design.

Variables worth knowing: `--color-{text,bg,pill,pill-text}-<color>` and `--<color>-h/-s/-l` (each Notion color is built from HSL parts, so shifting `--green-h` retints every green block at once), `--navbar-*`, `--footer-*`, `--sidebar-*`, `--primary-font` / `--secondary-font`, `--text-weight` / `--heading-weight`, `--heading{1..5}-size`, `--layout-max-width` (currently 1100px), `--padding-left` / `--padding-right`, `--navbar-height` (60px), and the per-block `--*-border-radii` / `--*-padding` / `--*-shadow` set.

Collections are worth calling out, because a gallery looks like it needs
layout CSS and does not. Super already renders one as
`grid-template-columns: repeat(auto-fill, minmax(var(--collection-card-cover-size-<size>), 1fr))`,
so setting that one variable changes the column count at every width and no
media query is needed. Measured defaults on this site:

| Variable | Default | What it drives |
| --- | --- | --- |
| `--collection-card-cover-size-{small,medium,large}` | 260px (medium) | minimum card width, hence the column count |
| `--collection-card-cover-height-{small,medium,large}` | 200px (medium) | cover height |
| `--collection-card-gap` | 10px | grid gap; takes a two-value pair |
| `--collection-card-padding` | 0px | card padding |
| `--collection-card-border-radii` | `var(--border-radii-layout)` | card corners |
| `--collection-card-shadow` | 1px hairline + 2px drop | the card's border look; there is no `border` |
| `--collection-card-content-padding` | `var(--padding-layout)` | gap between cover and text |
| `--collection-header-border` | `var(--border-layout)` | rule above the grid |
| `--color-card-bg` | `#ffffff` | card background |

Two places the variables run out, both hit while building Lab News. A card
size class beats a single page scope on specificity — `.notion-collection-card__cover.medium`
ties `.page__lab-news .notion-collection-card__cover` and wins on order — so
reach for the variable rather than a longer selector. And a row with no cover
gets an unclassed spacer `div` carrying an inline `height`, which no variable
and no selector can reach; that one needs `!important`.

A percentage inside the minimum, e.g. `minmax(clamp(260px, 30%, 420px), 1fr)`,
does not work: the auto-fill repetition count ignores the `clamp` floor and
holds the column count constant, so a 340px viewport still renders three
97px cards. Use a plain length.

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

The CSS row is measured on this site, not inferred. A `<link rel="stylesheet">` pointing at a raw URL was injected into Super's Head tab on 2026-08-25: devtools showed the request completing `200 OK` while none of the file's rules took effect. Do not re-test this; a stylesheet that "loads but does nothing" is the expected raw behavior, not a broken file.

Two traps when checking a raw URL by hand. GitHub caches the branch-ref lookup for about five minutes, so a freshly pushed file 404s on `…/main/…` while already resolving on `…/<commit-sha>/…` — a 404 read as "blocked" is a false positive. And `curl -I` on a raw URL returns `text/plain` for both the 200 and the 404, so check the status line, not just the type.

jsDelivr serves the same repo with correct MIME types and a CDN in front. There is no upload or registration step: it fetches from GitHub on the first request for a path and caches the result.

```
https://cdn.jsdelivr.net/gh/DAIMLab/lab-homepage@<ref>/<path>
```

`<ref>` is a branch, tag, or full commit SHA. Measured `Cache-Control` differs sharply between them:

| Ref form | Browser `max-age` | CDN `s-maxage` |
| --- | --- | --- |
| `@main` (or no ref) | 604800 (7 days) | 43200 (12 hours) |
| `@<full-sha>` or tag | 31536000 (1 year), `immutable` | same |

The 7-day browser cache is the trap. Purging the CDN does nothing for a visitor who already loaded the file, so **never point the live site at `@main`**. Pin a full SHA or tag and change the URL when the asset changes — a new URL is the only reliable cache bust.

Purging a branch URL does work without an access request, confirmed against this repo:

```bash
curl -s "https://purge.jsdelivr.net/gh/DAIMLab/lab-homepage@main/<path>"   # → status: finished
```

Limits: 20 MB per file (GitHub-sourced), well under GitHub's own 100 MB. Video above 20 MB belongs on YouTube or Vimeo as a Notion embed. HTML files are served as `text/plain` deliberately, so jsDelivr cannot host a page — only assets. For CSS, pasting into Super's CSS tab stays the primary route: it applies instantly and avoids a render-blocking external request.

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

### Collections

Databases live away from the page that shows them; the page carries a **linked
view** instead. That split is Ascent's own pattern and it is what keeps a view
switcher off a page: Super renders `.notion-dropdown` only when a collection
block holds more than one view, so a linked block with a single view emits no
switcher markup at all. Verified: `/projects` has 4 views and a dropdown,
`/publications` has 1 and none.

| Database | Notion ID | Data source | Shown on |
| --- | --- | --- | --- |
| Blog posts database | `35011c7b703c824cb3d7013957fdcc51` | `53b11c7b-703c-828c-8b6f-07108ff65286` | Projects, Publications |
| Lab News Posts | `01b3904e64264c8d8126367a121b079e` | `9d77a8a6-1aec-46ba-9cdd-0e65238a31b9` | Lab News |

`Lab News Posts` schema: `Title`, `Date`, `Location`, `Summary`, `Category`
(select: Activity / Conference). The gallery shows the first four; `Category`
is carried for filtered views someone may add later. Card thumbnails come from
each post's **page cover**, not a files property.

Two limits worth not re-deriving. The view DSL has no directive for the page
cover, so `COVER "Page cover"` is rejected — omit `COVER` and Notion's default
card preview already is the page cover. And `notion-update-view` cannot change
a view's type, so a table view cannot be turned into a gallery; create the
gallery as a linked view instead.

Keep the source database off the page that shows it. While `Lab News Posts`
still sat under the Lab News page, Super rendered it there as a child-page
link (`a.notion-link.notion-page`) that only CSS could hide. Moving it out
retires that rule, and the linked view's own header collapses to an empty
`h3` once it is gone. The MCP move tool cannot target a toggle, so the move
into the Control panel is a manual drag in Notion.

Read and edit these with the `notion-fetch` / `notion-update-page` MCP tools. Content edits belong in Notion; reach for CSS only when Notion's block options cannot express the design.

## Legacy Site Inventory

The IMweb sitemap lists `/home`, `/Team`, and fifteen numeric paths (`/21`–`/38`, `/122325403`) with no readable labels. Use it as a migration checklist and open each in a browser to identify it.
