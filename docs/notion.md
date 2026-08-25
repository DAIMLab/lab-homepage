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
| Team DAIM | `/team-daim` | `dfc11c7b703c83fd8dcb01007f12d3c0` |
| Publications | `/publications` | `11211c7b703c8253a3208121bec822f3` |
| Projects | `/projects` | `63e11c7b703c8246a3e681a2d19a3ac0` |
| Lab News | `/lab-news` | `49611c7b703c83698d1001e8650efcdc` |
| Footer | `/footer` | `3c711c7b703c80ef8ef7c71f06352789` |
| Ascent leftover | `/home` | `fd211c7b703c8315b76b81c4858d6152` |

Team DAIM is the People page; the navbar labels it `People` while the Notion title,
and so the `h1`, still reads `Team DAIM`. The slug lives in Super under Site Pages
and a Notion rename does not move it, so renaming the page is safe but has to be
done knowing the slug stays `team-daim`. It once split into `Professor`, `Students`
and `Alumni` sub-pages; all three are in the trash and the `People` database
replaced them.

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
| People | `40333c711338463887e0d21c77e4efa0` | `2d2152b8-53b9-4235-9c0f-0b1a2225fb85` | Team DAIM |

Four more content databases (case studies, careers, and two unnamed) back the
template's remaining list and gallery views.

`People` is the one database that breaks the rule above: it sits **under** the page
that shows it, because nothing in the Control panel subtree can hold a database.
Every candidate parent there is a toggle or a column, and both refuse: `Parent block
type toggle cannot contain databases`, `Parent block type column_list cannot contain
databases`. The move tool reports the same refusal as a 404 on the destination,
which reads like a permissions problem and is not one. Until someone drags it across
in Notion, `css/team-daim.css` hides the child-page link Super prints for it.

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

`People` schema: `Name`, `Role` (select: Professor / Researcher / Ph.D. Student /
M.S. Student / Intern / Staff), `Research` (multi-select), `Admitted`, `Email`,
`Homepage`, `LinkedIn`, `GitHub`, `CV`, `Status` (select: Current / Alumni). Covers
are page covers, as in Lab News and Projects.

`Admitted` is text, not a date, and holds `2024.09`. A date property would print
through Notion's own formatting and month precision would still need a fake day;
text prints exactly and `YYYY.MM` sorts correctly because it is zero-padded.

`Research` is a multi-select rather than free text so the lab shares one vocabulary
instead of fourteen spellings of the same interest. The seeded options come from the
`Projects DB` rows, which are the lab's own evidence of what it works on. Add options
freely. `css/team-daim.css` strips the pill chrome and stacks them one per line.

`Status` exists for the Alumni section nobody has built yet. Every view filters
`Status = Current`, so a graduate keeps their `Role` and drops off the page the
moment they are switched to `Alumni`. The section itself is one more linked view.

Six linked gallery views, one per `Role`, each under its own H2 on the page:

| View | Filter | Collection block |
| --- | --- | --- |
| Professor | `Role = Professor AND Status = Current` | `3c711c7b703c81cb96adcf098a8b3d1c` |
| Researchers | `Role = Researcher AND Status = Current` | `3c711c7b703c8187ace6c37fa9346118` |
| Ph.D. Students | `Role = Ph.D. Student AND Status = Current` | `3c711c7b703c81aa93fec1c673eeaf6e` |
| M.S. Students | `Role = M.S. Student AND Status = Current` | `3c711c7b703c8193980fc3578650f37a` |
| Interns | `Role = Intern AND Status = Current` | `3c711c7b703c81538b25fccbbebf29b0` |
| Staff | `Role = Staff AND Status = Current` | `3c711c7b703c81778100de046ebd0847` |

The block id matters: it is the only handle that tells the professor's gallery from
the students', because the view DSL cannot set card size without also setting a
cover property, so all six views share one size class.

No view carries a sort. Notion falls back to the collection's manual order, which
follows creation, and the rows were created in the order the legacy Team page listed
them. Once `Admitted` is filled, `SORT BY "Admitted" ASC` is the sort each student
section wants; adding it now would only scatter the rows, every value being empty.

### Limits worth not re-deriving

- The view DSL cannot set the page cover as the card preview. `COVER` takes a
  property name, and the page cover is not one: `COVER "Page cover"` comes back
  `Could not find property with name or id`. Omitting `COVER` does not fall back to
  it either, measured on Projects 2026-08-25: 16 cards, 0 covers, while Lab News with
  the setting on renders 60 covers over 63 cards. Every new gallery needs the same
  click in Notion, `⋯` → Properties → Card preview → Page cover.
- **A files property cannot be filled over MCP, so it is not a way around that
  click.** `COVER` does take a files property, which looks like the escape: attach
  the image, name the property, and the DSL sets the preview. `notion-create-attachment`
  with a `source_url` does upload, returning `status: uploaded` and an id. Writing
  that id into the property then fails, `File <id> not found`, for all three forms
  the tool documents: the bare id, `file-upload://<id>`, at creation time through
  `create-pages` and afterwards through `update-page`. Measured on People 2026-08-25,
  20 uploads, every write refused. Page covers plus the manual click are the route;
  the files property was dropped from the schema rather than left dead.
- `notion-update-view` cannot change a view's type, so a table view cannot be turned
  into a gallery. Create the gallery as a linked view instead.
- The MCP move tool cannot target a toggle or a column, so moving a database into the
  Control panel is a manual drag in Notion. It reports the refusal as
  `Could not find block with ID`, a 404 on the destination, which reads like missing
  access and is not: the same tool moves the same database to a plain page fine.
- The schema DDL builds a `status` property but cannot name its options. Both
  `ADD COLUMN "X" STATUS('Planned':gray, …)` and the `ALTER … SET STATUS(…)` form come
  back `Expected ADD, DROP, RENAME, or ALTER keyword, got "("`. A new status property
  always arrives as Notion's default `Not started` / `In progress` / `Done` in the
  `to_do` / `in_progress` / `complete` groups, and renaming them is a Notion UI step.
- **Converting `select` to `status` discards the option names and blanks every row.**
  Measured on a throwaway column before touching the real one: a select holding
  `Completed` came back as a status whose options were the three defaults, with the
  value reset. Rename an option afterwards rather than deleting and re-adding it, and
  the rows assigned to it follow. The property id survives the conversion, so any CSS
  keyed on `property-<id>` keeps working.
- A `formula` property can be created from the DDL, but **its computed values are not
  readable through MCP**: `query_data_sources` lists formula columns under
  `notAvailableInQuerySql`, and `fetch` returns a `formulaResult://` reference it then
  refuses to resolve. The only way to check a formula's output is to read the rendered
  Super page.

### Row URLs carry the database slug

A collection row is served at `/<page>/<database>/<row>`, three segments. The
two-segment form 404s. Verified 2026-08-25 on both collections:

| URL | Status |
| --- | --- |
| `/projects/projects-db/acs-운영-효율화-연구` | 200 |
| `/projects/acs-운영-효율화-연구` | 404 |
| `/lab-news/lab-news-posts/asmc` | 200 |
| `/lab-news/asmc` | 404 |

Every card anchor on a rendered page already carries the three-segment form, so
follow the anchor rather than composing a URL. That is the reliable check: reading
`.notion-collection-card a[href]` from the live page and requesting exactly that.

Two traps came out of building Projects, both of which cost an afternoon:

1. **The sitemap lags a new database and lists URLs that 404.** For a few hours after
   `Projects DB` appeared, `sitemap.xml` carried the two-segment form for all 16 rows
   while the served routes were three-segment. The routes also came alive in stages,
   the database page first and rows afterwards, so a partial count is not evidence of
   a broken build. Trust the anchors, not the sitemap.
2. **The database slug is frozen at creation and ignores a rename.** The database was
   renamed to `Project Database` and its segment stayed `projects-db`.
   `/projects/project-database` 404s. Changing it means editing the slug in Super
   under Settings → Site Pages; nothing in Notion moves it. The segment is not worth
   chasing, since no visitor ever types it.

### Keep the source database off the page that shows it

While `Lab News Posts` still sat under the Lab News page, Super rendered it there as
a child-page link (`a.notion-link.notion-page`) that only CSS could hide. Moving it
out retires that rule, and the linked view's own header collapses to an empty `h3`
once it is gone.
