# NanumSquare

Korean typeface for the site, matching the legacy IMweb design (`montserrat,
NanumSquare` was the legacy CSS stack).

These files exist to be **uploaded into Super** (Design → Typography → Primary
Font → Upload font), not to be served from this repo. Nothing links to them.

## Super slot mapping

Super's uploader offers exactly four slots: 400, 500, 600, 700.

| Super slot | File | Notes |
| --- | --- | --- |
| Regular (400) | `NanumSquareR.woff2` | |
| Medium (500) | — | remove the chip |
| Semibold (600) | — | remove the chip |
| Bold (700) | `NanumSquareB.woff2` | matches the legacy `<strong>` weight |

`NanumSquareEB` is weight 800 and has no slot. Put it in the 700 slot instead of
`NanumSquareB` if the hero headline should be heavier — a file swap, no CSS
change, but every bold on the site becomes ExtraBold.

Try `.woff2` first; `.woff` and `.ttf` are kept as fallbacks since the accepted
formats are not documented.

| File | Weight | woff2 | woff | ttf |
| --- | --- | --- | --- | --- |
| `NanumSquareR` | 400 | 191K | 274K | 707K |
| `NanumSquareB` | 700 | 193K | 274K | 716K |
| `NanumSquareEB` | 800 | 193K | 273K | 710K |

## Provenance

`.woff` and `.ttf` pulled from the `moonspam/NanumSquare` webfont mirror on
2026-08-25; verified genuine by their internal name records (`나눔스퀘어`,
`나눔스퀘어 Bold`, `나눔스퀘어 ExtraBold`) and `usWeightClass` 400 / 700 / 800.
The `.woff2` files were converted from those `.ttf` here with fontTools.

NanumSquare is Naver's typeface, published free for use and redistribution
including commercial use. That mirror carries no LICENSE file; for an
authoritative copy and the current license text, go to Naver's own font page
rather than the mirror.
