# Legacy IMweb Site

<https://daim.kaist.ac.kr> is the site being replaced. Keep it as the design
reference until the DNS cutover.

## Migration Checklist

The IMweb sitemap lists `/home`, `/Team`, and fifteen numeric paths (`/21`–`/38`,
`/122325403`) with no readable labels. Open each in a browser to identify it.

| Legacy path | What it is | Status |
| --- | --- | --- |
| `/29` | Lab News | migrated, see below |
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

58 posts and 246 photos now live in the `Lab News Posts` database. The photos were
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

32 of the 58 posts carry photos and no text at all, which is why the gallery card CSS
cannot assume a summary row exists.
