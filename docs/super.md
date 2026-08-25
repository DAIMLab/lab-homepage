# Super Platform Reference

Everything measured about how Super renders this site. Docs are at
<https://docs.super.so/>: `/super-css-classes` for the class list, `/custom-code`
for injection, `/code-snippets` for worked examples. Check the docs first; fall
back to devtools or `curl` only for what they do not cover.

This site is on Super's **Personal** plan.

## Code Injection

Three tabs in Super's Code editor: **CSS**, **Head** (analytics, embeds,
`<script>`), **Body** (HTML at the top of the page). Apply site-wide from the site
editor's Code page, or per-page via the code icon on an individual page.

## Classes

`notion-*` for rendered Notion blocks, `super-*` for Super's own chrome (navbar,
footer, sidebar, password page). Confirmed present here:

`super-root`, `super-content-wrapper`,
`super-navbar__{content,item-list,item,logo,actions,viewport-wrapper}`,
`notion-root`,
`notion-{header,heading,text,link,callout,toggle,quote,divider,image,column-list,column,page}`,
`notion-collection-{card,list}__*`, `notion-property__*`.

Super's own footer is off, so no `super-footer` markup exists on this site.

### Per-page scoping

Every page carries its slug on `<main>`, plus its parent. Verified across all five
content pages:

| Page | `<main>` classes |
| --- | --- |
| Home | `super-content page__index` |
| About DAIM | `super-content page__about-daim parent-page__index` |
| Publications | `super-content page__publications parent-page__index` |
| Projects | `super-content page__projects parent-page__index` |
| Lab News | `super-content page__lab-news parent-page__index` |

Scope with `.page__projects .notion-collection-card { … }` rather than restyling a
block type site-wide. `<main>` also has `id="page-<slug>"`, and the root article has
`id="block-<slug>"`.

## Native Paths

Confirmed against the docs. Each of these replaced code this repo used to carry:

| Need | Native path | Replaced |
| --- | --- | --- |
| Video autoplay | `super:{{ autoplay }}` at the end of the video block's caption (`/additional-features`) | a Body-tab script |
| Image eager load | `super:{{ eager }}` in the image caption | none |
| Image links to a URL | put the URL in the image caption; Super hides the caption | an `<a>` wrapper |
| Fonts | Design → Typography → Primary / Secondary, from Google Fonts or an upload (`/upload-fonts`) | a Head-tab `<link>` plus a `--primary-font` override |
| Palette | Design → Colors, manual or a preset | per-color CSS |
| Pretty URLs, SEO, redirects, password, hiding a page via 404 | per-page settings (`/site-pages`) | none |

Font upload is included on Personal, so NanumSquare goes in Design → Typography.

Two things that are **not** native, checked so nobody re-checks them:

- No per-page setting hides the page title or icon, so `.notion-header { display: none }`
  stays CSS.
- Site Files (`/site-files`) is Pro-only and accepts only `.txt` in `root` or
  `.well-known`, so it cannot host assets. jsDelivr stays. See `hosting.md`.

## Theming Through CSS Variables

Super defines its whole palette and layout as custom properties on
`html.theme-light` and `:root`. Override the variable instead of writing per-block
rules; that is the shortest path from the Ascent template's look to the DAIM design.

Worth knowing: `--color-{text,bg,pill,pill-text}-<color>` and `--<color>-h/-s/-l`
(each Notion color is built from HSL parts, so shifting `--green-h` retints every
green block at once), `--navbar-*`, `--footer-*`, `--sidebar-*`, `--primary-font` /
`--secondary-font`, `--text-weight` / `--heading-weight`, `--heading{1..5}-size`,
`--layout-max-width` (currently 1100px), `--padding-left` / `--padding-right`,
`--navbar-height` (60px), and the per-block `--*-border-radii` / `--*-padding` /
`--*-shadow` set.

### Collections

A gallery looks like it needs layout CSS and does not. Super already renders one as
`grid-template-columns: repeat(auto-fill, minmax(var(--collection-card-cover-size-<size>), 1fr))`,
so setting that one variable changes the column count at every width, no media query
needed. Measured defaults on this site:

| Variable | Default | What it drives |
| --- | --- | --- |
| `--collection-card-cover-size-{small,medium,large}` | 172 / 260 / 320px | minimum card width, hence the column count |
| `--collection-card-cover-height-{small,medium,large}` | 128 / 200 / 200px | cover height; `large` is no taller than `medium`, so switching a view to Large widens the columns and nothing else |
| `--collection-card-gap` | 10px | grid gap; takes a two-value pair |
| `--collection-card-padding` | 0px | card padding |
| `--collection-card-border-radii` | `var(--border-radii-layout)` | card corners |
| `--collection-card-shadow` | 1px hairline + 2px drop | the card's border look; there is no `border` |
| `--collection-card-content-padding` | `var(--padding-layout)` | gap between cover and text |
| `--collection-header-border` | `var(--border-layout)` | rule above the grid; switching off Notion's database title puts `no-border-top` on the gallery and clears it natively |
| `--color-card-bg` | `#ffffff` | card background |

Four traps, all hit while building Lab News:

1. A card size class beats a single page scope on specificity.
   `.notion-collection-card__cover.medium` ties
   `.page__lab-news .notion-collection-card__cover` and wins on order, so reach for
   the variable rather than a longer selector.
2. A row with no cover gets an unclassed spacer `div` carrying an inline `height`,
   which no variable and no selector can reach. That one needs `!important`.
3. A percentage inside the minimum, e.g. `minmax(clamp(260px, 30%, 420px), 1fr)`,
   does not work: the auto-fill repetition count ignores the `clamp` floor and holds
   the column count constant, so a 340px viewport still renders three 97px cards.
   Use a plain length.
4. Every variable above is scoped to the card size the view is set to, so a rule
   naming `medium` goes silent the moment someone switches the gallery to Large in
   Notion. Where a cover has to hold a shape rather than a height, skip the height
   variable and set `aspect-ratio` on
   `.page__lab-news .notion-collection-card__cover.<size>`; a length cannot keep a
   ratio across changing column counts. Reframing a photo inside that ratio is
   native: drag the cover in Notion and it writes `object-position`.

## Design Tokens

Extracted from the live IMweb site. Match these unless overridden.

| Token | Value | Use |
| --- | --- | --- |
| Accent | `#00B8FF`, `#05b2f5` | Links, highlights, brand cyan |
| Ink | `#212121`, `#1c1c1e` | Body and heading text |
| Surface | `#ffffff`, `#f8f8f8` | Page and card backgrounds |
| Rule | `#dadada`, `#e5e5e5` | Borders and dividers |
| Display font | Montserrat | Latin headings |
| Korean font | NanumSquare | Korean text |

Super ships Inter as both `--primary-font` and `--secondary-font`.

The Ascent template applies green (`<span color="green">`) throughout as its accent.
Notion colors are per-block, so retinting is a CSS job: override `--green-h/-s/-l`
to the DAIM cyan rather than editing every block in Notion.

Site identity: title `DAIM`, description `DAIM LABS 홈페이지`, part of KAIST
Industrial & Systems Engineering. Legacy logo and OG image:
`https://cdn.imweb.me/upload/S20240718af4b4371a8c5a/e847603f005eb.png`.

## Site-Wide Footer

Super's own footer (Navigation → Footer) works on every page but renders a fixed
shape: a logo, menu items, social icons, and a footnote in one of three layouts. It
cannot express the legacy design, a full-bleed photo band with a scrim and two text
columns, so it is set to **Footer Type: None** and the band is a Notion callout.
`css/footer.css` styles it.

The callout lives on one page, `/footer`, and `js/footer-inject.js` clones it onto
every other page at runtime. The earlier arrangement was a synced reference pasted
onto all five pages; editing stayed in one place, but every new page needed the
block pasted again.

The clone reads from `/footer` rather than from Notion because `app.notion.com`
sends no CORS headers and the Notion API needs a secret that cannot sit in
client-side JS. Super server-renders every page, so `/footer` is a same-origin
document whose HTML already holds the band. Confirmed with `curl`: the callout
appears as real markup carrying block id `1f2896f7d7a7493898f8c777372b600d`, the
same id on every page, which is how a synced block renders. CSS cannot do this at
all; it has no way to fetch content.

Cost is one extra same-origin request per page:

| Source page | gzip | uncompressed |
| --- | --- | --- |
| `/footer` | 29 KB | 213 KB |
| `/` | 38 KB | 294 KB |
| `/lab-news` | 50 KB | 402 KB |

`/footer` is the smallest page Super will serve; the floor is the navbar plus the
Next.js payload every page carries.

Three things to keep true:

1. `/footer` stays published and stays out of the sitemap. The 404 setting would
   break the fetch.
2. Ordinary callouts get a colour other than blue. `.notion-callout.bg-blue-light`
   is the footer's selector in both the CSS and the script.
3. The clone is appended to `.notion-root`, and Super routes between pages on the
   client, so the script re-places it under a `MutationObserver`.

The band is absent from the served HTML everywhere except `/footer`, so crawlers
miss it. Footer links carry little SEO weight and the band sits below the fold, so
nothing visible shifts.

## Known Console Noise

`GET https://daim.super.site/fit=scale-down 404` and `.../quality=90 404` are
Super's bug, cosmetic. Diagnosed 2026-08-25, recorded so nobody re-derives it.

Super mirrors Notion-uploaded images to `images.spr.so` behind Cloudflare Images,
whose options are comma-separated:
`…/logo-kaist-daim-labs/w=1920,quality=90,fit=scale-down`. `srcset` also separates
its candidates with commas, and Super emits the URL without encoding them, so the
browser splits one URL into three candidates. Two of them (`quality=90`,
`fit=scale-down`) are not URLs, resolve relative to the origin, and 404.

The `src` attribute is a single well-formed URL, so the image renders. Nothing in
CSS can help; `srcset` is parsed regardless of `display: none`. Expect it for any
raster image uploaded into Notion. Images referenced by external URL are not proxied
and do not trigger it.

The one on Home comes from the leftover Ascent logo image inside the hidden
`🎛 Control panel` toggle. Deleting that image block in Notion removes both 404s.

## Open Question: Rows Past 100

Whether Super renders every row of a database past 100 is untested. Notion pages its
own collection queries at that size, and Super's behaviour is undocumented:
`/compatible-blocks` and the rest of the docs set no limit, and a rendered gallery
carries no load-more, cursor, or `hasMore` markup.

It matters for the Lab News post count, a CSS counter over the rendered cards
(`css/lab-news.css`), which reports the database total only while every row is
rendered. Check it against Notion now that the 58 legacy posts are migrated. If
Super truncates, the fallback is a number typed into the Notion page by hand.
