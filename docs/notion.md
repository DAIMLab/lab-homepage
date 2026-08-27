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
| Team DAIM | `/people` | `dfc11c7b703c83fd8dcb01007f12d3c0` |
| Publications | `/publications` | `11211c7b703c8253a3208121bec822f3` |
| Projects | `/projects` | `63e11c7b703c8246a3e681a2d19a3ac0` |
| Lab News | `/lab-news` | `49611c7b703c83698d1001e8650efcdc` |
| Footer | `/footer` | `3c711c7b703c80ef8ef7c71f06352789` |
| Databases | `/databases` | `3c911c7b703c816c9d28dec4774a53b8` |
| Ascent leftover | `/home` | `fd211c7b703c8315b76b81c4858d6152` |

Team DAIM is the People page. The slug lives in Super under Site Pages and a
Notion rename does not move it; on 2026-08-27 it was moved there by hand from
`team-daim` to `people`, and `css/people.css` plus `js/date-format.js` scope by
`.page__people` accordingly (the old path still answers 200). It once split
into `Professor`, `Students` and `Alumni` sub-pages; all three are in the
trash. The page now carries five linked views of the `People` database plus
one view of a separate alumni database, each under its own H1. The Professor
section is plain blocks: a `gray_bg` callout card (anatomy in
[`super.md`](super.md#people-page)) whose name link leads to the full profile
page `Young Jae Jang` (`3c811c7b703c8185bf7dd09096c94e73`), a child of People
kept inside the collapsed `Subpages` toggle, served at `/people/professor`
(scope class `page__people-professor`, Head tab `code/professor.html`). The
profile page holds the identity columns, bulleted sections mirroring the card,
and a `### Media` heading over a gallery linked view of `Professor Media`.

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

Every content database is a child of the **`Databases`** page
(`3c911c7b703c816c9d28dec4774a53b8`), created 2026-08-27 and living inside the
Control panel toggle, so it stays off the navbar and out of the Home page flow.
The nesting is what should give Super `/databases/<database>` and
`/databases/<database>/<row>`; whether Super follows it is the open question in
[Super freezes a path, Notion does not move it](#super-freezes-a-path-notion-does-not-move-it).

Databases live away from the page that shows them; the page carries a **linked view**
instead. That split is Ascent's own pattern and it is what keeps a view switcher off
a page: Super renders `.notion-dropdown` only when a collection block holds more than
one view, so a linked block with a single view emits no switcher markup at all.
Verified: `/projects` had 4 and a dropdown while it still carried the Ascent
template's Blog posts view; that block is gone and its single `All` view emits no
switcher. The Papers block now runs the other way on purpose: it carries three views so the
switcher appears and `css/publications.css` can dress it as a segmented control.
The Patents block keeps one view and stays switcher-free, which is also how the
stylesheet tells the two panels apart: `:has(.notion-dropdown)` is Papers.

| Database | Notion ID | Data source | Shown on |
| --- | --- | --- | --- |
| Blog posts database | `35011c7b703c824cb3d7013957fdcc51` | `53b11c7b-703c-828c-8b6f-07108ff65286` | nowhere |
| Papers | `90abcc7cae564e3bb1bca8c2f24f89e6` | `7f3f7a41-1143-4ea4-99f9-0c451af98b69` | Publications (Papers tab) |
| Patents | `8df6b73555b7455495ab3e50bed1816c` | `e92c829b-0b7e-463c-b9a5-c9697e0a6c84` | Publications (Patents tab) |
| Lab News Posts | `01b3904e64264c8d8126367a121b079e` | `9d77a8a6-1aec-46ba-9cdd-0e65238a31b9` | Lab News, Home |
| Projects DB | `36470995bdcb42588b866eb5b59d45a4` | `16204f18-52d4-4c73-82f4-31a8c63bf2df` | Projects |
| People | `40333c711338463887e0d21c77e4efa0` | `2d2152b8-53b9-4235-9c0f-0b1a2225fb85` | People |
| Team Photos | `b301c409726240c490b33b07eacb0b91` | `8c7e255c-9f06-4566-a8cc-304eb6759dff` | People (hero carousel) |

`Papers` and `Patents` are the Publications rebuild, created 2026-08-27 and still
empty. What they replaced on `/publications` was not the `Blog posts database` this
file used to name but a linked view titled `View of Case studies database`, over
the Ascent data source `79c11c7b-703c-8282-bfc0-87761a3b6b96`; that block and the
lorem ipsum column above it were deleted on 2026-08-28. The source database still
exists elsewhere in the template, and the deleted blocks are in Notion's trash.

The two share one page through a **Notion tabs block**. A single Super view
switcher spans one data source, so `Papers` and `Patents` cannot share the venue
tab bar without merging into one database, which was considered and declined on
2026-08-28. Notion's own tabs block solves it a level up: `/publications` holds one
`<tabs>` with a `Papers` tab over the linked block
`3c911c7b703c81ef91a7cf0f147290a1` and a `Patents` tab over
`3c911c7b703c81008143de44de1bcfbc`. Super renders it natively and the toggle is its
own React state, so no script and no CSS state hack.

Building it takes two steps, not one. `<database data-source-url="...">` inside a
`<tab>` is rejected with `Data source not found`, so create each linked view at the
page's top level with `notion-create-view` first, then wrap both in `<tabs>` with
`update-page`, addressing each by its block `url`. The wrap moves them in.

Three earlier shapes are in the trash: a `Patents` child page, a `Papers` child
page beside it, and before those a single Papers block sitting straight on
`/publications` under an Ascent leftover. Two dead ends drove the moves: Super's
navbar dropdown does not take the icon-over-label rules `css/global.css` puts on
`.super-navbar__item`, so the site keeps every navbar entry flat, and a section nav
built from link-to-page blocks meant a page load per switch.

`Papers` splits the four-quadrant taxonomy across two select properties, `Scope`
(International/Domestic) and `Type` (Journal/Conference/Workshop/Preprint). Three
list views cover the quadrants in use: `International Journal`,
`International Conference`, `Domestic Conference`. A `Domestic Journal` view existed
and was deleted on 2026-08-28; rows filed as Domestic + Journal now appear in no tab
until it comes back. Every view groups by `Year` and orders rows manually inside the
group; there is no date property to sort on, so drag decides the order within a year.

The views exist twice over. The source database carries a set for editing, and the
linked block on `/publications` carries its own, because a linked view never
inherits the source's tabs. A tab added in one place has to be added in the other,
and a new view starts at Notion's default number range, so it needs the range set by
hand like the rest.

`Type` keeps `Workshop` and `Preprint` as options with no view behind them, so a
row set to either shows up in no tab. Drop the two options or add tabs for them
before using either. A fifth view, the `All` table, is the editing surface and
stays ungrouped; it never reaches the site, because the linked view on
`/publications` carries its own views. The Notion API has no delete-view call, so
a view that outlives its purpose needs a right-click in the UI.

`Authors` is a multi-select seeded with the twenty names in the `People` database
plus the professor. Notion keeps per-row option order as entered, so author order
survives, and the option list makes filtering by a lab member possible. Every
external co-author becomes a new option, so the list grows with the paper count.

`Year` is a **number**, chosen on 2026-08-28 over the select it started as, with
the number format left plain so no thousands separator ever reaches the group
label. The cost is that number grouping is range grouping, and the ranges must be
set by hand.

Applying `GROUP BY "Year"` to a number property yields Notion's defaults, and they
are wrong for years:

```
{"property":"Year","propertyType":"number","hideEmptyGroups":true,
 "start":0,"end":1000,"size":100,"sort":{"type":"ascending"}}
```

`end` is 1000, so 2026 falls outside every bucket, and `size` is 100, so a bucket
spans a century. The view DSL cannot fix this: `GROUP BY "Year" RANGE 2010 TO 2027
EVERY 1` is rejected with `Expected directive keyword, got "RANGE"`, and there is
no directive for the group sort direction either. Each of the five views needs
Group Range, Group Every 1, and descending order set in the Notion UI. Until that
is done the grouping renders wrong, not absent.

A one-year bucket labels itself by both bounds. With Range 2000 to 2100 and an
interval of 1, a row with `Year` 2027 lands in a group Notion calls
`2027 to 2028`. So the range label is not avoidable by narrowing the interval, and
CSS cannot rewrite it: Super renders the group label as bare text with no data
attribute holding the raw value. `js/date-format.js` carries the fix, one rule
pulling the first four digits out of
`.page__publications .notion-collection-group__section-header .notion-property__number`.
It is a text swap like every other rule in that file, guarded by the same
`next !== el.textContent` check, so it adds no observer and cannot loop.

Set the range wide, not tight. `2000 to 2100` with `Hide empty groups` on draws
only the years that have papers and never expires; a range ending at the current
year quietly drops next year's work.

`Sort` in the group panel still has to be flipped to descending by hand for each
view. The DSL has no directive for it and Notion defaults to ascending, which puts
the oldest year at the top.

Grouping is Super-native. Super lists `Database grouping` as supported and ships
the selectors already: each group becomes a `.notion-collection-group__section`
holding a `.notion-collection-group__section-header` and the view's rows, which is
the hook `css/publications.css` will use for the POSTECH-style year rail. Notion
sets `hideEmptyGroups` on every one of these views, so a year with no papers in
that quadrant does not render.

`Patents` went its own way on 2026-08-28. The schema was cut back by hand to five
properties, `Title`, `특허권자`, `특허번호`, `Date` and `Link`, so `Year`, `Status`
and `Country` are gone and none of the range setup above applies to it. Filings stay
few enough that a year rail would be noise, so its single `All` view carries no
grouping at all, sorts on `Date` descending, and `css/publications.css` reflows the
rows as cards.

The Papers schema was trimmed further in Notion on 2026-08-28: `Code`, `Topic` and
`Venue Full` are gone, `Venue` is now free text carrying the full citation rather
than a select of abbreviations, and `PDF` holds an uploaded file instead of a URL.
Eight properties remain: `Title`, `Authors`, `Year`, `Type`, `Scope`, `Venue`,
`DOI`, `PDF`. Dropping `Venue` as a select also drops the abbreviation badge
column the al-folio reference supplied, so the page design loses that hook.

`Professor Media` (`f040a63431724614aaf533f8d6046ff6`, data source
`df40c248-2fc0-4c66-aaa5-f5bb22623d65`) holds the professor's media
appearances: one row per item, the cover as the thumbnail (external URLs into
`assets/professor/media/` at a pinned commit) and `Source URL` as where the
card clicks through to. Every row carries a `Source URL`: the videos their
YouTube links, the press photos the articles that ran them (found by reverse
image search), and a photo with no coverage would fall back to its own raw
`main` image URL. The
database was created workspace-private (the MCP cannot create inside toggles)
and now sits under `Databases` with the other four; the gallery view's Card
preview still needs the manual Page cover click.

The alumni records live in their own database, data source
`ba0889c2-963a-4d13-89e4-11420c4bf2b0`, shown on the People page through block
`3c711c7b703c8182b96cc60edf70784f`. It keeps the migrated `/36` rows and waits for
its own design pass.

`Team Photos` holds the People hero carousel: one row per slide, the page
cover as the photo (external URLs into `assets/carousel/` at a pinned commit)
and the title as the caption, shown through a gallery linked view inside a
brown callout (block `3c811c7b703c8129a5aecd3e5e4c7fd7`). It sat under People's
`Subpages` toggle until 2026-08-27 and moved to `Databases` with the other five;
Super was still serving it from `/team-photos` when this was written, which is
the staged propagation described below.

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

`People` schema: `Name`, `Role` (select: PostDoc / Ph.D. Student / M.S. Student /
Intern / Staff), `Research` (multi-select), `Joined` (date, format `YYYY/MM/DD`),
`Email`, and four URLs, `Homepage`, `LinkedIn`, `GitHub`, `CV`, plus `Picture`
(files). Card photos come from `Picture` through the view's `COVER` setting, not
from page covers; the files were attached in the Notion UI, since MCP still cannot
write a files property. `Research` options are the lab's own vocabulary from the
legacy `/122325403` page; add options freely.

Five linked gallery views, one per `Role`, each under its own H2:

| View | Filter | Collection block | View id |
| --- | --- | --- | --- |
| PostDoc | `Role = PostDoc` | `3c711c7b703c8187ace6c37fa9346118` | `3c711c7b-703c-8114-b487-000c10a50b41` |
| Ph.D. Students | `Role = Ph.D. Student` | `3c711c7b703c81aa93fec1c673eeaf6e` | `3c711c7b-703c-81ef-80d2-000ca8e369e5` |
| M.S. Students | `Role = M.S. Student` | `3c711c7b703c8193980fc3578650f37a` | `3c711c7b-703c-81a4-a484-000cacc0b6a5` |
| Interns | `Role = Intern` | `3c711c7b703c81538b25fccbbebf29b0` | `3c711c7b-703c-8131-8e0d-000cb250edae` |
| Staff | `Role = Staff` | `3c711c7b703c81778100de046ebd0847` | `3c711c7b-703c-818d-b03b-000c2ceee7c3` |

Every view shows, in order: `Name`, `Research`, `Joined`, `Email`, `Homepage`,
`GitHub`, `LinkedIn`, `CV`. SHOW order is the render order on the card, and the
card CSS depends on it. The student and intern views sort `Joined` ASC; PostDoc
and Staff keep manual order.

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
- **Replacing a multi-select's whole option list with `ALTER COLUMN … SET MULTI_SELECT(…)`
  keeps the values whose option names survive and drops the rest.** Measured on one
  row: a name present in both lists kept its option id, the four that did not appear
  were dropped. Safe to re-run when an option name is unchanged, destructive when it
  is renamed. It also blanks the property `description`, so put `COMMENT` back in the
  same statement.
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
2. **A rename alone does not move the slug.** The database was renamed to
   `Project Database` and its segment stayed `projects-db`, so `/projects/project-database`
   404d. A *move* does re-derive it, as the section below records: the same database
   now answers at `/databases/projects`. The segment is still not worth chasing, since
   no visitor ever types it.

### Super re-derives a path from the Notion tree, one page at a time

Moving a database in Notion does move its Super URL, and no dashboard edit is
needed, but the rebuild lands page by page over tens of minutes rather than all at
once. Measured while moving the six databases under `Databases` on 2026-08-27:

| Minutes after the move | State |
| --- | --- |
| ~5 | `/databases` 200. Every database still on its old path. |
| ~15 | `/databases/people` and `/databases/people/wonseok-jang` 200, `/people-1/wonseok-jang` 404, the other five still on their old paths. |

Three things follow, all of them worth waiting out rather than fixing:

1. **The old row path 404s before the page that links to it catches up.** `/people`
   was still serving cached HTML full of `/people-1/<row>` anchors after those rows
   had moved to `/databases/people/<row>`. Both ends settle, in their own time.
2. **A database mid-migration is linked by raw id.** `/databases` rendered its
   People child as `href="/40333c711338463887e0d21c77e4efa0"`, which 307s to
   `/databases/people`. The raw id is Super's placeholder while the slug catches up,
   not an error.
3. **Partial propagation is not evidence of a broken build**, the same trap the
   Projects rollout set. Re-read the paths before concluding anything.

The last segment moves too, which retires the frozen-slug rule the Projects
rollout wrote down: `projects-db` came back as `projects` and `lab-news-posts` as
`lab-news`, both shortened without a rename in Notion. Settled paths, all rows 200:

| Database | Path |
| --- | --- |
| People | `/databases/people` |
| Alumni | `/databases/alumni` |
| Projects DB | `/databases/projects` |
| Lab News Posts | `/databases/lab-news` |
| Professor Media | `/databases/professor-media` |
| Team Photos | `/databases/team-photos` |

Every old path 404s, `/people-1` and `/lab-news/lab-news-posts` included, so nothing
outside the site should have been pointed at one.

`/databases` itself publishes and enters the sitemap. Exclude it under Settings →
Site Pages the way `/footer` is: it is an index for editors, not a page anyone should
land on.

Nothing in `css/` or `js/` breaks when those paths change. Super's scope class is
`page__<path with slashes as dashes>` plus `parent-page__<parent path>`, and the
repo only ever scopes by the five site pages, never by a database or row page:

| Used in the repo | Never used |
| --- | --- |
| `page__index`, `page__people`, `page__people-professor`, `page__lab-news`, `page__projects` | `page__people-1`, `page__alumni`, `page__professor-media`, `page__lab-news-lab-news-posts`, `page__projects-projects-db`, every row class, every `parent-page__*` |

Card anchors are relative and Super-generated (`href="/people-1/wonseok-jang"`), so
they follow the new path on the next build with no edit here. `js/date-format.js`
keys `.page__projects .property-475c4c48`, and a property id survives a move.

### Keep the source database off the page that shows it

While `Lab News Posts` still sat under the Lab News page, Super rendered it there as
a child-page link (`a.notion-link.notion-page`) that only CSS could hide. Moving it
out retires that rule, and the linked view's own header collapses to an empty `h3`
once it is gone.
