# Asset Hosting

Assets live in this repo and are served from GitHub. The repo is public, so no token
is involved. **The URL host depends on file type**, because `raw.githubusercontent.com`
sends `X-Content-Type-Options: nosniff` with a wrong or generic MIME type for
everything except images:

| Asset | Host | Verified `Content-Type` |
| --- | --- | --- |
| Images (png/jpg/svg/webp) | `https://raw.githubusercontent.com/DAIMLab/lab-homepage/main/assets/…` | `image/png`, works |
| Video (mp4) | Notion upload, or jsDelivr | raw returns `application/octet-stream`, which `<video>` will not play |
| CSS / JS files | jsDelivr, or paste into Super's Code editor | raw returns `text/plain`, which `nosniff` blocks for `<link>` and `<script>` |
| Font Awesome | `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css` | third-party icon font for the People cards, version pinned in the URL |

## Video Does Not Have to Live Here

Dragging an mp4 into Notion is the route the site actually uses, and it is the one
asset type with a working path outside this repo. Measured on the live Home hero:

```
https://assets.super.so/<site-id>/videos/<file-id>/hero-oht-720p.mp4
Content-Type: video/mp4        5,589,688 bytes
```

Super mirrors Notion-uploaded files to `assets.super.so` with the right MIME type, so
there is no 20 MB ceiling and no commit involved, and `super:{{ autoplay }}` in the
block's caption is what starts playback (`super.md`, *Native Paths*). The cost is that
the file is then not version-controlled here, so a clip worth keeping belongs in the
repo too even when the site serves the Notion copy.

A YouTube embed is the third route and suits a clip that is already published there,
including an unlisted one. It is the wrong choice for short ambient b-roll: the player
chrome and related-videos panel outweigh the clip, and a muted autoplay loop does not
come out clean.

The CSS row is measured on this site, not inferred. A `<link rel="stylesheet">`
pointing at a raw URL was injected into Super's Head tab on 2026-08-25: devtools
showed the request completing `200 OK` while none of the file's rules took effect. Do
not re-test this; a stylesheet that loads but does nothing is the expected raw
behavior, not a broken file.

Two traps when checking a raw URL by hand:

1. GitHub caches the branch-ref lookup for about five minutes, so a freshly pushed
   file 404s on `…/main/…` while already resolving on `…/<commit-sha>/…`. A 404 read
   as "blocked" is a false positive.
2. `curl -I` on a raw URL returns `text/plain` for both the 200 and the 404, so check
   the status line, not just the type.

## jsDelivr

Serves the same repo with correct MIME types and a CDN in front. No upload or
registration step: it fetches from GitHub on the first request for a path and caches
the result.

```
https://cdn.jsdelivr.net/gh/DAIMLab/lab-homepage@<ref>/<path>
```

`<ref>` is a branch, tag, or full commit SHA. Measured `Cache-Control` differs
sharply between them:

| Ref form | Browser `max-age` | CDN `s-maxage` |
| --- | --- | --- |
| `@main` (or no ref) | 604800 (7 days) | 43200 (12 hours) |
| `@<full-sha>` or tag | 31536000 (1 year), `immutable` | same |

The 7-day browser cache is the trap. Purging the CDN does nothing for a visitor who
already loaded the file, so **never point the live site at `@main`**. Pin a full SHA
or tag and change the URL when the asset changes; a new URL is the only reliable
cache bust.

Purging a branch URL works without an access request, confirmed against this repo:

```bash
curl -s "https://purge.jsdelivr.net/gh/DAIMLab/lab-homepage@main/<path>"   # → status: finished
```

Limits: 20 MB per file (GitHub-sourced), well under GitHub's own 100 MB. Video above
20 MB goes through Notion instead, per the section above, or onto YouTube or Vimeo as
a Notion embed. HTML files are served as
`text/plain` deliberately, so jsDelivr cannot host a page, only assets.

For CSS under iteration, pasting into Super's CSS tab stays the quick route: it
applies instantly and avoids a render-blocking external request. A settled design
graduates to a pinned jsDelivr `<link>` instead, which is how `css/team-daim.css`
and `js/team-daim-cards.js` ship: the page's Head tab (`js/team-daim-head.html`)
names one pinned URL per file, and swapping the design or behavior is swapping
that URL for another pinned ref. The commit has to be
pushed before jsDelivr can see it, and merging the branch keeps the SHA reachable
for good.
