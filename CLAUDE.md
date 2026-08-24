# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

Source assets for the DAIM lab homepage as it moves off IMweb hosting onto **Notion + Super.so**.

This repo holds only what Super cannot store: custom CSS, custom JS, images, and video. The page content, structure, and navigation live in Notion. Nothing here is imported by a bundler; the files are pasted or linked into Super's code-injection fields and referenced by public URL.

As of this writing the repo contains only `README.md`. Everything below is the target shape, not a description of existing files.

## Deployment Pipeline

```
Notion page (source of truth for content)
  → Super.so site settings (custom code + theme)
    → daim.super.site  (later: daim.kaist.ac.kr)
```

| Endpoint | URL |
| --- | --- |
| Notion source page | https://app.notion.com/p/DAIM-Homepage-3c611c7b703c809fb685f773804f1684 |
| Super deploy target | https://daim.super.site (live, HTTP 200) |
| Legacy IMweb site | https://daim.kaist.ac.kr (design reference) |
| Migration hub page | https://app.notion.com/p/3c611c7b703c81048890e7acbf407ea8 (`랩실 홈페이지 Super.so 이전`) |

There is no build, lint, or test step. Do not add `npm` scaffolding unless the user asks; a preprocessor breaks the "paste this file into Super" workflow.

Verify a change by loading https://daim.super.site with a hard refresh. Super serves injected code from its CDN, so an edit can lag a few seconds. Check the legacy site's rendered output with browser tools, not `curl`: its markup is client-rendered and returns almost nothing useful as static HTML.

## Notion Structure

The Notion page is built on Super's **Ascent** template and still carries template lorem ipsum in several sections. A collapsed `🎛 Control panel` toggle at the top holds every link below and is hidden from the published site.

Site pages (fetch with the `notion-fetch` MCP tool using these IDs):

| Page | ID |
| --- | --- |
| Home | `fd211c7b703c8315b76b81c4858d6152` |
| About DAIM | `21f11c7b703c83f399ea01c297c4d409` |
| Team DAIM | `dfc11c7b703c83fd8dcb01007f12d3c0` |
| Publications | `11211c7b703c8253a3208121bec822f3` |
| Projects | `63e11c7b703c8246a3e681a2d19a3ac0` |
| Lab News | `49611c7b703c83698d1001e8650efcdc` |

Team DAIM splits into `Professor` (`3c611c7b703c80768b7fd009d6c075ed`), `Students` (`3c611c7b703c80549898c426d40729cc`), and `Alumni` (`3c611c7b703c805d942dca6661c145dc`). Four content databases (case studies, careers, and two unnamed) back the list views.

Content edits belong in Notion, not here. Only reach for CSS when Notion's block options cannot express the design.

## Design Reference

Extracted from the live IMweb site. Match these unless the user overrides.

| Token | Value | Use |
| --- | --- | --- |
| Accent | `#00B8FF`, `#05b2f5` | Links, highlights, brand cyan |
| Ink | `#212121`, `#1c1c1e` | Body and heading text |
| Surface | `#ffffff`, `#f8f8f8` | Page and card backgrounds |
| Rule | `#dadada`, `#e5e5e5` | Borders and dividers |
| Alert | `#ff2552` | Sparingly, on the legacy site only |
| Display font | Montserrat | Latin headings |
| Korean font | NanumSquare | Korean text |

The template ships a green accent throughout (`<span color="green">` in Notion). Replacing that green with the DAIM cyan is a recurring task; Notion colors are set per block, so some of it can only be overridden in CSS.

Site identity: title `DAIM`, description `DAIM LABS 홈페이지`, part of KAIST Industrial & Systems Engineering. Legacy logo/OG image: `https://cdn.imweb.me/upload/S20240718af4b4371a8c5a/e847603f005eb.png`.

## CSS and JS Conventions

Super injects whatever you give it into every page, so the code here is global by definition.

- Target Super's rendered DOM, not Notion's editor DOM. Confirm each selector against the live site with browser devtools before writing a rule; Super's class names change between template versions and guessing produces silently dead CSS.
- Scope rules to a page by its Super path (`body[class*="..."]`, or a wrapper selector Super emits) rather than restyling a block type globally, unless the change is deliberately site-wide.
- Keep the design tokens above in CSS custom properties at `:root` and reference them everywhere else. Super's theme settings and injected CSS both set colors; one source of truth in the injected file avoids fighting the panel.
- Prefer Super's built-in theme settings (fonts, nav, footer) over CSS that duplicates them. Write CSS only for what the settings panel cannot reach.
- Expect to compromise on the IMweb design. Notion's block model has no arbitrary positioning. When a legacy layout cannot be reproduced, pick the closest Notion-native structure and note the difference for the user instead of building a JS layout hack.

## Asset Hosting

Images and video in this repo need a public URL before Notion or CSS can reference them. The hosting route is not yet decided; ask the user before committing large binaries or wiring a specific CDN path.

## Legacy Site Inventory

The IMweb sitemap lists `/home`, `/Team`, and fourteen numeric paths (`/21`–`/38`, `/122325403`) with no readable labels. Use it as a checklist of pages to account for during migration, and open each in a browser to identify it.
