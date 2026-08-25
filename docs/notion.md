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
| Home | `/` | `fd211c7b703c8315b76b81c4858d6152` |
| About DAIM | `/about-daim` | `21f11c7b703c83f399ea01c297c4d409` |
| Team DAIM | none | `dfc11c7b703c83fd8dcb01007f12d3c0` |
| Publications | `/publications` | `11211c7b703c8253a3208121bec822f3` |
| Projects | `/projects` | `63e11c7b703c8246a3e681a2d19a3ac0` |
| Lab News | `/lab-news` | `49611c7b703c83698d1001e8650efcdc` |
| Footer | `/footer` | `3c711c7b703c80ef8ef7c71f06352789` |

Team DAIM splits into `Professor` (`3c611c7b703c80768b7fd009d6c075ed`), `Students`
(`3c611c7b703c80549898c426d40729cc`), and `Alumni`
(`3c611c7b703c805d942dca6661c145dc`).

`Footer` is not a content page. It holds the footer band so exactly one copy exists;
`js/footer-inject.js` clones it onto the rest. It sits under the Control panel and is
absent from the navbar, but it must stay published, so exclude it from the sitemap
under Site Pages rather than hiding it with the 404 setting. Mechanics are in
[`super.md`](super.md#site-wide-footer).

## Collections

Databases live away from the page that shows them; the page carries a **linked view**
instead. That split is Ascent's own pattern and it is what keeps a view switcher off
a page: Super renders `.notion-dropdown` only when a collection block holds more than
one view, so a linked block with a single view emits no switcher markup at all.
Verified: `/projects` has 4 views and a dropdown, `/publications` has 1 and none.

| Database | Notion ID | Data source | Shown on |
| --- | --- | --- | --- |
| Blog posts database | `35011c7b703c824cb3d7013957fdcc51` | `53b11c7b-703c-828c-8b6f-07108ff65286` | Projects, Publications |
| Lab News Posts | `01b3904e64264c8d8126367a121b079e` | `9d77a8a6-1aec-46ba-9cdd-0e65238a31b9` | Lab News |

Four more content databases (case studies, careers, and two unnamed) back the
template's remaining list and gallery views.

`Lab News Posts` schema: `Title`, `Date`, `Location`, `Summary`, `Category` (select:
Activity / Conference). The gallery shows the first four; `Category` is carried for
filtered views someone may add later. Card thumbnails come from each post's **page
cover**, not a files property.

### Limits worth not re-deriving

- The view DSL has no directive for the page cover, so `COVER "Page cover"` is
  rejected. Omit `COVER` and Notion's default card preview already is the page cover.
- `notion-update-view` cannot change a view's type, so a table view cannot be turned
  into a gallery. Create the gallery as a linked view instead.
- The MCP move tool cannot target a toggle, so moving a database into the Control
  panel is a manual drag in Notion.

### Keep the source database off the page that shows it

While `Lab News Posts` still sat under the Lab News page, Super rendered it there as
a child-page link (`a.notion-link.notion-page`) that only CSS could hide. Moving it
out retires that rule, and the linked view's own header collapses to an empty `h3`
once it is gone.
