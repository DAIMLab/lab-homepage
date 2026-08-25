# Asset Hosting

Assets live in this repo and are served from GitHub. The repo is public, so no token
is involved. **The URL host depends on file type**, because `raw.githubusercontent.com`
sends `X-Content-Type-Options: nosniff` with a wrong or generic MIME type for
everything except images:

| Asset | Host | Verified `Content-Type` |
| --- | --- | --- |
| Images (png/jpg/svg/webp) | `https://raw.githubusercontent.com/DAIMLab/lab-homepage/main/assets/…` | `image/png`, works |
| Video (mp4) | jsDelivr | raw returns `application/octet-stream`, which `<video>` will not play |
| CSS / JS files | jsDelivr, or paste into Super's Code editor | raw returns `text/plain`, which `nosniff` blocks for `<link>` and `<script>` |

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
20 MB belongs on YouTube or Vimeo as a Notion embed. HTML files are served as
`text/plain` deliberately, so jsDelivr cannot host a page, only assets.

For CSS, pasting into Super's CSS tab stays the primary route: it applies instantly
and avoids a render-blocking external request.
