# Legacy IMweb Site

<https://daim.kaist.ac.kr> is the site being replaced. Keep it as the design
reference until the DNS cutover.

## Migration Checklist

The IMweb sitemap lists `/home`, `/Team`, and fifteen numeric paths (`/21`–`/38`,
`/122325403`) with no readable labels. Open each in a browser to identify it.

| Legacy path | What it is | Status |
| --- | --- | --- |
| `/21` | Professor | migrated, see below |
| `/22` | Projects | migrated, see below |
| `/23` | Research Area | empty on the legacy site, nothing to migrate |
| `/29` | Lab News | migrated, see below |
| `/Team` | Team DAIM | migrated, see below |
| `/122325403` | where every student name on `/Team` pointed | dead end, see below |
| everything else | unidentified | open |

## Reading a Board Without a Browser

The site is mostly client-rendered, but its **board pages are not**. A post at
`https://daim.kaist.ac.kr/29/?q=<token>&bmode=view&idx=<idx>&t=board` arrives
complete, so `curl` plus BeautifulSoup reads it.

| Wanted | Where |
| --- | --- |
| Post title | `<title>`, suffixed ` : DAIM` |
| Category | `.board_view span.category` |
| Body and images | `.board_txt_area` |

The list at `/29` pages twelve at a time via `&page=N`. The `q` token is a fixed
base64 filter shared by every URL.

What the board does **not** render anywhere is a publish date. The only date is the
one typed into the title.

## Lab News, Migrated

57 posts and 246 photos now live in the `Lab News Posts` database. This write-up
first said 58; the data source returns 57, measured 2026-08-25, and one post is
unaccounted for. The photos were
downscaled to 1600px at JPEG q82, turning 198 MB of originals into 34 MB. They sit in
`assets/lab-news/`, named `<legacy-idx>-<n>.jpg` so any one of them traces back to
its source post, and are served from the `lab-news-assets` tag rather than a branch,
per the caching rule in [`hosting.md`](hosting.md#jsdelivr).

Field mapping, for whoever migrates the next board:

| Notion property | Source |
| --- | --- |
| `Title` | legacy title with its date prefix and any `@Place` suffix stripped |
| `Date` | parsed from that prefix. `2026.06` and `2026.2` both mean the first of the month; only `2026.03.23` is a real day |
| `Location` | the `@Place` suffix |
| `Summary` | first 180 characters of the body |

32 posts carry photos and no text at all, which is why the gallery card CSS cannot
assume a summary row exists.

## Projects, Migrated

16 projects and their 16 figures now live in the `Projects DB` database. `/22` is the
same board software as `/29`, so the same `curl` route reads it: the list pages twelve
at a time via `&page=N`, and each post opens at `?bmode=view&idx=<idx>&t=board`.

Every post follows one template, which is what let the fields split cleanly:

| Notion property | Source line |
| --- | --- |
| `Title` | `프로젝트명:`, not the board title, which prefixes the partner in parentheses |
| `Partner` | `협력 기관:` |
| `Period` | `연구 기간:`, `2018.03 ~ 2025.01`; month precision, and two projects have no end |
| `Status` | the board's own category badge |
| `Summary` | the first bullet under `연구 내용:` |

Page content is the `연구 내용` bullet list with its nesting kept, plus the `관련 논문`
citations where a project has them. Each post carries exactly one figure, a research
diagram rather than a photo, saved to `assets/projects/<legacy-idx>.png` at its source
size of about 660x350 and served from the `projects-assets` tag. They were left as PNG:
they are dense with small text that JPEG would smear, and the largest is 227 KB.

All 16 carry the `완료` badge, so the board's `진행중` tab is empty. Its counterpart on
the new site is a second view, not built yet for that reason.

## Team DAIM, Migrated

`/Team` is not a board, so `curl` returns nothing: the roster is client-rendered and
only a browser sees it. Reading it means walking the rendered DOM in document order
and pairing each `<img>` with the `<span>` that follows it, because the markup carries
no per-person container and no `alt` text to match on.

20 people, six role groups, and 20 photos now live in the `People` database. What the
legacy page held per person was a name, a photo and a group heading. Nothing else:
no email, no research interests, no admission date. Those columns exist and are empty
on purpose, waiting to be filled in Notion.

| Notion property | Source |
| --- | --- |
| `Name` | the `<span>` beside each photo |
| `Role` | the group heading above it, `Researcher` / `Ph.D. course` / `Master course` / `Intern` / `Staff` |
| page cover | the `<img>` beside the name |
| `Email` | only two were anywhere on the legacy site, both in the footer |
| `Research`, `Admitted`, `Homepage`, `LinkedIn`, `GitHub`, `CV` | nothing to migrate |

Photos are in `assets/people/<slug>.jpg`, served from the `people-assets` tag per the
caching rule in [`hosting.md`](hosting.md#jsdelivr). They were EXIF-rotated, flattened
onto white where the source was a PNG with alpha, and downscaled to 800px on the long
side at JPEG q85: 6.8 MB of originals became 768 KB. Aspect ratios were **kept** rather
than square-cropped, so a face can be reframed by dragging the cover in Notion, which
writes `object-position`; a pre-cropped square would have frozen the framing.

Two names carried a suffix the new page drops. `Muhammad Umar Farooq (Ph.D)` marks a
degree already implied by the Researcher group. `Hyunjae Lee (Captain)` is a real lab
role, and the footer confirms it, `E-Mail (Captain): hyunjae.lee@kaist.ac.kr`. There is
no property for it, and adding one for a single row was not worth it; if the title
should show, it needs a column.

## The Professor's Page

`/21` is the only per-person page the legacy site had, and it is server-rendered, so
`curl` reads it. Its content is now the `Young Jae Jang` row's page body: Career,
Education, Awards, Teaching and the 2010 book, plus a Contact list rebuilt from the
page's own obfuscated `yjang (at) kaist (dot) edu`. Its `Media` section was empty and
was dropped.

Every other name on `/Team` linked to `/122325403`, one shared page for all 19 of
them. It is a stub. That is the whole reason the new page ends at the card for a
student: there was never anything behind those links to migrate.
