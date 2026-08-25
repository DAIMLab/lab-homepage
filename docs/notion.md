# Notion Workspace

Page content, structure, and navigation live here, not in the repo. Read and edit
with the `notion-fetch` / `notion-update-page` MCP tools.

Built on Super's **Ascent** template; several sections still hold template lorem
ipsum. A collapsed `🎛 Control panel` toggle at the top of the root page holds every
link below and is hidden from the published site.

Root page: <https://app.notion.com/p/DAIM-Homepage-3c611c7b703c809fb685f773804f1684>

## Pages

| Page | Slug | Notion ID |
| --- | --- | --- |
| Home | `/` | `3c611c7b703c809fb685f773804f1684` |
| About DAIM | `/about-daim` | `21f11c7b703c83f399ea01c297c4d409` |
| Team DAIM | none | `dfc11c7b703c83fd8dcb01007f12d3c0` |
| Publications | `/publications` | `11211c7b703c8253a3208121bec822f3` |
| Projects | `/projects` | `63e11c7b703c8246a3e681a2d19a3ac0` |
| Lab News | `/lab-news` | `49611c7b703c83698d1001e8650efcdc` |
| Footer | `/footer` | `3c711c7b703c80ef8ef7c71f06352789` |
| Ascent leftover | `/home` | `fd211c7b703c8315b76b81c4858d6152` |

Team DAIM splits into `Professor` (`3c611c7b703c80768b7fd009d6c075ed`), `Students`
(`3c611c7b703c80549898c426d40729cc`), and `Alumni`
(`3c611c7b703c805d942dca6661c145dc`).

`Footer` is not a content page. It holds the footer band so exactly one copy exists;
`js/footer-inject.js` clones it onto the rest. It sits under the Control panel and is
absent from the navbar, but it must stay published, so exclude it from the sitemap
under Site Pages rather than hiding it with the 404 setting. Mechanics are in
[`super.md`](super.md#site-wide-footer).

`Lab News Posts` is shown twice. The Lab News page carries the full gallery; Home
carries a second linked view, `3c711c7b703c817f9adaed9272c9ce71`, named `Latest`,
sorted `Date` DESC and showing only `Title` and `Date`. `css/home.css` turns that
one into a horizontal strip. Both are linked views over the same data source, so
neither owns the database and neither shows a view switcher.

## Collections

Databases live away from the page that shows them; the page carries a **linked view**
instead. That split is Ascent's own pattern and it is what keeps a view switcher off
a page: Super renders `.notion-dropdown` only when a collection block holds more than
one view, so a linked block with a single view emits no switcher markup at all.
Verified: `/publications` has 1 view and no dropdown. `/projects` had 4 and a
dropdown while it still carried the Ascent template's Blog posts view; that block is
gone and its single `All` view emits no switcher.

| Database | Notion ID | Data source | Shown on |
| --- | --- | --- | --- |
| Blog posts database | `35011c7b703c824cb3d7013957fdcc51` | `53b11c7b-703c-828c-8b6f-07108ff65286` | Publications |
| Lab News Posts | `01b3904e64264c8d8126367a121b079e` | `9d77a8a6-1aec-46ba-9cdd-0e65238a31b9` | Lab News, Home |
| Projects DB | `36470995bdcb42588b866eb5b59d45a4` | `16204f18-52d4-4c73-82f4-31a8c63bf2df` | Projects |

Four more content databases (case studies, careers, and two unnamed) back the
template's remaining list and gallery views.

`Lab News Posts` schema: `Title`, `Date`, `Location`, `Summary`, `Category` (select:
Activity / Conference). The gallery shows the first four; `Category` is carried for
filtered views someone may add later. Card thumbnails come from each post's **page
cover**, not a files property.

`Projects DB` schema: `Title` (프로젝트명 only), `Partner` (협력 기관), `Period` (date
range), `Status` (select: Ongoing / Completed), `Summary`. The legacy board wrote the
partner into the title as a `(LG 전자)` prefix; here it is its own property so a card
can show it as a separate line. `Period` carries month precision only, so every date
is the first of its month. Covers are page covers, as in Lab News.

All 16 rows are `Completed`, which is what the legacy board says, so the page carries
one view and no switcher. The legacy All / 진행중 / 완료 tabs come back as extra views
the day a project is `Ongoing`; that is what makes Super emit a dropdown.

### Limits worth not re-deriving

- The view DSL cannot set the page cover as the card preview. `COVER` takes a
  property name, and the page cover is not one: `COVER "Page cover"` comes back
  `Could not find property with name or id`. Omitting `COVER` does not fall back to
  it either, measured on Projects 2026-08-25: 16 cards, 0 covers, while Lab News with
  the setting on renders 60 covers over 63 cards. Every new gallery needs the same
  click in Notion, `⋯` → Properties → Card preview → Page cover.
- `notion-update-view` cannot change a view's type, so a table view cannot be turned
  into a gallery. Create the gallery as a linked view instead.
- The MCP move tool cannot target a toggle, so moving a database into the Control
  panel is a manual drag in Notion.

### Keep the source database off the page that shows it

While `Lab News Posts` still sat under the Lab News page, Super rendered it there as
a child-page link (`a.notion-link.notion-page`) that only CSS could hide. Moving it
out retires that rule, and the linked view's own header collapses to an empty `h3`
once it is gone.
