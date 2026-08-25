# NanumSquare

Korean typeface for the site, matching the legacy IMweb design (`montserrat,
NanumSquare` was the legacy CSS stack).

These files exist to be **uploaded into Super** (Design → Typography → Primary
Font → Upload font), not to be served from this repo. Nothing links to them.

## Super slot mapping

Super's uploader offers exactly four slots: 400, 500, 600, 700. Classic
NanumSquare fills two of them; the other two come from NanumSquare Neo, below.

| Super slot | File |
| --- | --- |
| Regular (400) | `NanumSquareNeo-Regular.woff2` |
| Medium (500) | `NanumSquareNeo-Medium.woff2` |
| Semibold (600) | `NanumSquareNeo-SemiBold.woff2` |
| Bold (700) | `NanumSquareNeo-Bold.woff2` |

Use one family or the other across all four slots. Mixing a classic cut with a Neo
cut puts two different drawings of the same letters next to each other.

## NanumSquare Neo, instanced

Classic NanumSquare has nothing between Regular and Bold. Its shipped cuts are
Light 300, Regular 400, Bold 700 and ExtraBold 800, so Super's 500 and 600 slots
had nothing to put in them and a Korean run at those weights was being synthesised
by the browser.

**NanumSquare Neo**, the 2022 redraw of the same family, ships as a variable font,
so any weight between can be cut from it.

| File | CSS weight | Cut from axis |
| --- | --- | --- |
| `NanumSquareNeo-Regular.woff2` | 400 | `wght` 300 |
| `NanumSquareNeo-Medium.woff2` | 500 | `wght` 400 |
| `NanumSquareNeo-SemiBold.woff2` | 600 | `wght` 450 |
| `NanumSquareNeo-Bold.woff2` | 700 | `wght` 500 |

**The axis is not the CSS scale.** This font's named instances are `100 Light`,
`300 Regular`, `500 Bold`, `700 ExtraBold`, `900 Heavy`. Instancing at `wght: 500`
gives Bold, not Medium. `OS/2.usWeightClass` is set to the CSS weight afterwards so
browsers and Super's uploader read the file correctly.

Verified after cutting: 12250 glyphs each, nothing missing across a Korean and
Latin sample, and the `한` bounding box widens monotonically (47 → 44 → 42 → 40 on
the left edge), which is what a real interpolation looks like.

## Classic NanumSquare

Kept for the 400 and 700 slots if the Neo drawing is ever rejected.

| File | Weight | woff2 | woff | ttf |
| --- | --- | --- | --- | --- |
| `NanumSquareR` | 400 | 191K | 274K | 707K |
| `NanumSquareB` | 700 | 193K | 274K | 716K |
| `NanumSquareEB` | 800 | 193K | 273K | 710K |

`NanumSquareEB` is weight 800 and has no slot. Put it in the 700 slot instead of
`NanumSquareB` if the hero headline should be heavier, but every bold on the site
becomes ExtraBold.

Try `.woff2` first; `.woff` and `.ttf` are kept as fallbacks since the accepted
formats are not documented.

## Provenance

Classic `.woff` and `.ttf` pulled from the `moonspam/NanumSquare` webfont mirror on
2026-08-25; verified genuine by their internal name records (`나눔스퀘어`,
`나눔스퀘어 Bold`, `나눔스퀘어 ExtraBold`) and `usWeightClass` 400 / 700 / 800. The
classic `.woff2` files were converted from those `.ttf` here with fontTools.

Neo cut from
<https://cdn.jsdelivr.net/gh/moonspam/NanumSquareNeo@1.0.0/NanumSquareNeo-Variable.woff2>
with `fontTools.varLib.instancer`. Delete the `STAT` table first; the upstream one
is malformed and raises `IndexError` on `AxisIndex`.

NanumSquare is Naver's typeface, published free for use and redistribution
including commercial use. Neither mirror carries a LICENSE file; for an
authoritative copy and the current license text go to Naver's own font pages,
<https://campaign.naver.com/nanumsquare_neo/> for Neo.
