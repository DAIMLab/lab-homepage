# Legacy IMweb Site

<https://daim.kaist.ac.kr> is the site being replaced. Keep it as the design
reference until the DNS cutover.

## Migration Checklist

The IMweb sitemap lists `/home`, `/Team`, and fifteen numeric paths (`/21`–`/38`,
`/122325403`) with no readable labels. Opening each in a browser is not necessary:
the nav markup carries the labels as link text on every page, so one fetch names
them all.

```bash
curl -sL https://daim.kaist.ac.kr/23 | python3 -c '
import sys, re
html = sys.stdin.read()
pat = r"<a[^>]+href=\"(/\d+|/home|/Team)\"[^>]*>\s*<span class=\"plain_name\"[^>]*>([^<]+)"
for path, label in sorted(set(re.findall(pat, html))):
    print(f"{path:<14} {label.strip()}")
'
```

The label is not the anchor's own text; it sits in a nested
`<span class="plain_name">`, and the anchor is split across lines, so a line-based
`grep` finds nothing. Each path also appears several times per page, once per menu
copy, which is what the `set` is for.

Everything the navigation reaches is below. Paths that are in the sitemap but not in
the nav are still unidentified.

| Legacy path | What it is | Status |
| --- | --- | --- |
| `/home` | Home | migrated |
| `/21` | Professor | migrated, see below |
| `/22` | Projects | migrated, see below |
| `/23` | Research Area | slide deck, see below |
| `/24` | Accomplishment › Industry | slide deck, see below |
| `/29` | Lab News | migrated, see below |
| `/30` | About DAIM | slide deck, see below |
| `/36` | Alumni, by graduation year | migrated, see below |
| `/37` | Accomplishment | tab bar only, no content of its own |
| `/38` | Accomplishment › Academic | open. A board under four tabs: International Journals, International Conferences, Domestic Conferences, Patents |
| `/Team` | Team DAIM, the roster with photos | migrated, see below |
| `/122325403` | Students, the roster with contact details | migrated, see below |

`/21`, `/122325403` and `/36` are one three-tab set, `Professor` / `Students` /
`Alumni`. The tabs are plain links, so each is its own path and there is no state to
drive. `/Team` is a fourth, separate page: same people, photos instead of details.

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

## The Three Slide-Deck Pages

`/23`, `/24` and `/30` are neither boards nor rosters. Each is a page-builder page
whose entire body is a column of exported PowerPoint slides, one `<img>` per slide.

**`curl` reads them as empty, and that is a false negative.** This checklist recorded
`/23` as *empty on the legacy site, nothing to migrate*; it holds five slides. The
body text is pixels, so a fetch returns the navigation and the footer and nothing
else. The slide URLs are in the served HTML even though the rendered text is not:

```bash
curl -sL https://daim.kaist.ac.kr/23 | grep -o 'cdn\.imweb\.me/[a-zA-Z0-9/_.-]*\.png' | sort -u
```

The slides are the `/thumbnail/<date>/` entries, all sharing one date. The two
`/upload/` hits on every page are the site logo and the OG image, not content.

| Page | Slides | What they hold |
| --- | --- | --- |
| `/30` About DAIM | cover + 4 | Labs & DAIM Research Corp., Research Mission, Key Know-How, R&D Competencies. Plus a Target Journal list, a link to DAIM Research, and a 26-second video |
| `/23` Research Area | 5 | MFRA, Research Topics, AI + digital twin, Industry Domains & Partners, the hardware testbed |
| `/24` Industry | 5 | Case 1 to Case 5, one opening slide each |

Four things to know before reusing any of it:

1. **Every slide but the `/30` cover carries a `Confidential . N` stamp** and its page
   number from the source deck. `/30` runs 3 to 6, `/23` runs 8 to 12, `/24` reaches
   14. Crop that corner, and the `DAIM RESEARCH` watermark opposite it.
2. **The slides are 886px wide**, 980px on `/24`. Body glyphs measure 10px and the
   smallest bullets 6px, so a 390px phone renders them at 4.4px and 2.6px. They are
   unreadable on a phone and cannot be enlarged past the source resolution.
3. **`/24` publishes only the first slide of each case.** Case 1 is titled `(1/4)` and
   Case 2 `(1/3)`; the other five slides are not on the site and the source deck has
   not been located.
4. **The content is dated.** The slide files are from July and August 2024, and the
   headcount on `/30` carries a `2023년 2월 기준` footnote. `/23`'s testbed slide has
   been superseded by KAIROS, announced 2026-03-23 and already covered in `Lab News`.

All three are destined for one page, the new `/about`, replacing the Ascent template
content still sitting there.

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

20 people, six role groups, and 20 photos now live in the `People` database. It takes
**two** legacy pages to fill a row, which is the thing to know before reading either:
`/Team` has the photos and no contact details, `/122325403` has the contact details
and no photos. They are joined on the name, and the names do not match exactly.
`/122325403` writes `WonSeok Jang`, `SahngJin Ban` and `MinGyu SUH` where `/Team`
writes `Wonseok Jang`, `Sahngjin Ban` and `MinGyu Suh`; the rows keep the `/Team`
spellings.

| Notion property | Source |
| --- | --- |
| `Name` | `/Team`, the `<span>` beside each photo |
| `Role` | `/Team`, the group heading above it, `Researcher` / `Ph.D. course` / `Master course` / `Intern` / `Staff` |
| page cover | `/Team`, the `<img>` beside the name |
| `Email` | `/122325403`, one per person |
| `Research` | `/122325403`, the `Research Areas:` line |
| `Homepage`, `LinkedIn`, `GitHub`, `CV` | `/122325403`, the `Personal page:` line, four people have one |
| `Admitted` | nothing to migrate; neither page carries an admission date |

`Research Areas:` is where the lab's own vocabulary comes from, and it is narrower
and more specific than the project titles suggest: `AMHS Simulation` on eight people,
`AMHS Operations` on four, then one-offs like `Deadlock Avoidance` and `Layout
Generation`. The `Research` multi-select was seeded from `Projects DB` first and that
guess was wrong; the option list is now this line, verbatim.

The two Staff, `HyeMin Kim` and `HyunSuk Jung`, appear on `/Team` only. They have no
email or research area anywhere on the legacy site.

`B.S` / `M.S` / `Ph.D` lines were deliberately not migrated for students.

One `Personal page:` href is broken at the source. Wonseok Jang's GitHub is written
`github.com/Cotidie` with no scheme, so IMweb resolved it relative and served
`daim.kaist.ac.kr/github.com/Cotidie`. The row carries `https://github.com/Cotidie`.
Two others labelled `Github` point at `*.github.io` pages, so they are `Homepage`, not
`GitHub`; Gookhee Shin's `Github` and `CV` are the same URL, recorded once.

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

Every other name on `/Team` links to `/122325403`, one shared page carrying all of
them, which is why no student has a page of their own to migrate and why the new page
ends at the card for a student.

## Alumni, Migrated

`/36` is the third tab: 49 entries grouped by graduation year, 2013 through 2026,
each with a degree, an email and a thesis title. No photos. 48 rows are in `People`
with `Status = Alumni`.

The page is client-rendered like `/Team`, and it has no per-person container either,
so it parses as a flat line stream: a bare four-digit line opens a year, a
`Name (Ph.D.)` line opens a person, and `E-Mail :` and `<degree> thesis :` lines
attach to whoever is open.

| Notion property | Source |
| --- | --- |
| `Name` | the line before the degree parenthesis |
| `Degree` | that parenthesis, `(Ph.D.)` or `(M.S.)` |
| `Role` | derived from `Degree`, so an alumnus keeps a section to return to |
| `Graduated` | the year heading above the group |
| `Email` | `E-Mail :`, and `E-Mail:` without the space on one row |
| `Thesis` | `Ph.D. thesis :` or `M.S. thesis :`, unwrapped from its curly quotes |

Five things the source got wrong or ambiguous, and what each row does about it:

1. **49 entries, 48 rows.** `ChangHyun Chung` is on both the Students tab and the
   2026 alumni list, a fresh Ph.D. who stayed on as a researcher. He is one row,
   `Researcher` / `Current`, and is not repeated under Alumni.
2. **Two people are listed twice, legitimately.** `Jaeung Lee` and `Sungwook Jang`
   each took an M.S. and then a Ph.D. here, so each has two entries under two years,
   sharing an email. Both are kept, because the alumni list is a list of degrees
   awarded, not of people. Their casing differs between the two entries at the
   source, `JaeUng`/`Jaeung` and `SungWook`/`Sungwook`, and is left as found.
3. **Two degree labels contradict their thesis label.** `SangPyo Hong (Ph.D.)` has an
   `M.S. thesis :`, `DongMin Kim (M.S.)` has a `Ph.D. thesis :`. The parenthesis wins,
   being the thing the page prints as the person's degree.
4. **One email has a comma for a dot**, `kyoungmin,cho@kaist.ac.kr`. Corrected.
5. **One row has no email at all**, `Japhne Ferdinandz`. Left empty.

Thesis titles arrive wrapped in curly quotes that are not consistently paired: some
close with `”`, some with `“`, some with a straight `"`, several trail a full stop
outside the quote, and one is never closed. All of it is stripped, and the last row
also carried a stray `DAIM` from the footer running into the text.
