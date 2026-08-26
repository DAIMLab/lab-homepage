# DAIM Lab Homepage

Source assets for the [DAIM lab](https://daim.super.site) homepage, moving off IMweb
hosting onto Notion + Super.so.

Page content, structure, and navigation live in Notion. This repo holds only what
Super cannot store as content: custom CSS, custom JS, images, and video. There is no
build step. Files are pasted into Super's Code editor or linked by public URL.

```
Notion page  →  Super.so Code editor (CSS / Head / Body)  →  daim.super.site
```

## Endpoints

| | |
| --- | --- |
| Notion source page | <https://app.notion.com/p/DAIM-Homepage-3c611c7b703c809fb685f773804f1684> |
| Super deploy target | <https://daim.super.site> (later `daim.kaist.ac.kr`) |
| Legacy IMweb site | <https://daim.kaist.ac.kr>, the design reference |
| Migration hub page | <https://app.notion.com/p/3c611c7b703c81048890e7acbf407ea8> (`랩실 홈페이지 Super.so 이전`) |
| Repository | `git@github.com:DAIMLab/lab-homepage.git` (public) |

## Layout

| Path | Goes into |
| --- | --- |
| `code/global.html` | site-wide Head tab, pasted as-is |
| `code/home.html` | Home per-page Head tab, pasted as-is |
| `code/lab-news.html` | Lab News per-page Head tab, pasted as-is |
| `code/projects.html` | Projects per-page Head tab, pasted as-is |
| `code/team-daim.html` | People per-page Head tab, pasted as-is |
| `css/global.css` | linked from `code/global.html`, pinned jsDelivr URL |
| `css/footer.css` | linked from `code/global.html`, pinned jsDelivr URL |
| `css/home.css` | linked from `code/home.html`, pinned jsDelivr URL |
| `css/lab-news.css` | linked from `code/lab-news.html`, pinned jsDelivr URL |
| `css/projects.css` | linked from `code/projects.html`, pinned jsDelivr URL |
| `css/team-daim.css` | linked from `code/team-daim.html`, pinned jsDelivr URL |
| `js/email-copy.js` | linked from `code/global.html`, pinned jsDelivr URL |
| `js/footer-inject.js` | linked from `code/global.html`, pinned jsDelivr URL |
| `js/lab-news-load-more.js` | linked from `code/lab-news.html`, pinned jsDelivr URL |
| `js/home-video-play.js` | linked from `code/home.html`, pinned jsDelivr URL |
| `js/projects-date-format.js` | linked from `code/projects.html`, pinned jsDelivr URL |
| `js/team-daim-date-trim.js` | linked from `code/team-daim.html`, pinned jsDelivr URL |
| `assets/` | referenced by public URL, not pasted |
| `reference/ascent-template.css` | vendored Super template CSS, read-only |

## Documentation

| File | Covers |
| --- | --- |
| [`docs/super.md`](docs/super.md) | Super classes, per-page scoping, CSS variables, native settings, design tokens, the footer band, console noise |
| [`docs/notion.md`](docs/notion.md) | Notion page list, IDs, databases, collection views |
| [`docs/hosting.md`](docs/hosting.md) | raw.githubusercontent vs jsDelivr, MIME types, cache pinning |
| [`docs/legacy.md`](docs/legacy.md) | Legacy IMweb inventory, board scraping, Lab News migration record |
| [`CLAUDE.md`](CLAUDE.md) | Working rules for Claude Code and anyone else editing this repo |
