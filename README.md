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
| `css/super-custom.css` | site-wide CSS tab |
| `css/footer.css` | site-wide CSS tab, the footer band |
| `css/home.css` | Home per-page CSS tab |
| `css/lab-news.css` | Lab News per-page CSS tab |
| `js/footer-inject.js` | site-wide Head tab, wrapped in `<script>` |
| `html/home-hero-body.html` | Home per-page Body tab |
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
