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
| Fonts | Design → Typography → Primary / Secondary, from Google Fonts or an upload (`/upload-fonts`) | a Head-tab `<link>` to Google Fonts and a NanumSquare CDN stylesheet |
| Palette | Design → Colors, manual or a preset | per-color CSS |
| Pretty URLs, SEO, redirects, password, hiding a page via 404 | per-page settings (`/site-pages`) | none |

Font upload is included on Personal, so both faces go in Design → Typography and the
Head tab carries no font code. Measured on the live site: Super serves Montserrat and
Inter from `assets-v2.super.so/global/fonts/`, and no external font request is made.

Two things that are **not** native, checked so nobody re-checks them:

- No per-page setting hides the page title or icon, so `.notion-header { display: none }`
  stays CSS.
- Site Files (`/site-files`) is Pro-only and accepts only `.txt` in `root` or
  `.well-known`, so it cannot host assets. jsDelivr stays. See `hosting.md`.

## Fonts

Design → Typography is the loader, `css/super-custom.css` decides what paints what.

Both faces are uploaded on the Personal plan and named in Typography, currently
Primary NanumSquare and Secondary Montserrat. That selection is what ships their
`@font-face`; measured on the live site, Super serves four NanumSquare faces from
`assets-v2.super.so/sites/…` and Montserrat from `…/global/fonts/`, and
`document.fonts` reports NanumSquare 400 and 700 plus Montserrat 400, 600 and 700
loaded.

Which face paints which character is not Typography's decision here. Super's two
slots split by role, primary against secondary, and a role cannot know whether a
run is Latin or Korean. `css/super-custom.css` overrides both variables with one
stack, `Montserrat, NanumSquare, …`, and lets the browser fall through per
character. Measured with a canvas: "Lab News Conference" through that stack renders
at Montserrat's 174.53px rather than NanumSquare's 157.68px, and
"대한산업공학회 춘계공동학술대회" renders at NanumSquare's 222.4px rather than
Montserrat's 224.99px.

The trap: because the override wins, changing Typography no longer changes the
site's look, but it does change what loads. Drop Montserrat from either slot and
the stack keeps naming a face the browser can no longer fetch, so Latin silently
falls back. Keep both faces named in Typography whatever roles they sit in.

The other site-wide rule hides `.notion-toggle.bg-brown`, which is how the
`🎛 Control panel` stays off the published site. It comes from the Ascent template
(`reference/ascent-template.css:46`) and matches any brown-background toggle, so
brown stays reserved for hidden blocks.

## The Navbar Over the Hero

On Home the navbar is transparent with white links, sitting over the video. Nothing
else: no background, no chip, no blur.

The menu was hard to read, and the cause is the hero's own scrim. It runs
`linear-gradient(100deg, rgb(0 0 0 / 0.55), rgb(0 0 0 / 0.08))`, dark at the
bottom-left where the headings are and almost clear at the top-right. Measured, the
menu occupies x 936 to 1553, which is exactly the 8% end. The headings were always
legible; the menu never was.

The fix adds a second layer to that same `::after`, a top-down scrim over the first
170px, so the top strip darkens whatever the horizontal position:

```css
background:
  linear-gradient(to bottom, rgb(0 0 0 / 0.50) 0, rgb(0 0 0 / 0) 170px),
  linear-gradient(100deg, rgb(0 0 0 / 0.55), rgb(0 0 0 / 0.08));
```

The menu also carries `text-shadow: 0 1px 2px rgb(0 0 0 / 0.55), 0 0 14px
rgb(0 0 0 / 0.40)`, with the same shadow as a `drop-shadow` filter on the icons,
which are SVG and ignore `text-shadow`. The scrim does the bulk of the work; the
shadow covers the bright pixels that still punch through it.

Measured by screenshotting the page and reading the luminance of the menu's own
bounding box, x 936 to 1553 by 88px tall, parked on a bright frame:

| | mean | p90 | pixels above 180 | contrast against white text |
| --- | --- | --- | --- | --- |
| before | 250.1 | 255 | 96.9% | about 1.04:1 |
| after | 67.7 | 101 | 1.2% | about 9.2:1 |

WCAG AAA asks 7:1 for body text. Before, white on near-white, the menu was not
readable at all on a bright frame.

No new element, no navbar chrome, and the video still reads through everywhere else.

Home also sets `position: static` on the navbar. It is `sticky` by default, and past
the hero a transparent bar with white links leaves the menu invisible against white
page background. Static lets it scroll away on Home while every other page keeps a
pinned navbar, which is why this is not Super's site-wide Navbar → Visible on Scroll
setting.

### The chip that was tried and dropped

A rounded translucent pill with `backdrop-filter` and a sliding gradient was built
and then removed. Recorded so nobody rebuilds it: it read as extra chrome the design
does not want, and the sheen looked like a rendering artefact on a bar that wide.
Two things learned there are still worth knowing.

`.super-navbar__content` is sized to the full navbar by Super, so a margin alone
leaves it overflowing; `width: auto` is needed to inset it. And `.super-navbar` sits
outside `main`, as a sibling that precedes it, so `page__<slug>` cannot reach it by
descent. `.super-root:has(main.page__index) .super-navbar` can, which is the way to
style the navbar per page from site-wide CSS. The same trap applies to
`--padding-left` and `--padding-right`: a page overriding them on `main` leaves the
navbar on the root value.

### Label weight

Super has no navbar weight variable; `--text-weight` is the site body weight and
would move every paragraph with it. `css/super-custom.css` sets
`.super-navbar__item { font-weight: 600 }` instead.

600 rather than 500 or 700 because it has to be a real face, not a synthesised
bold. Measured what is actually declared: Montserrat ships 400, 500, 600 and 700,
NanumSquare only 400 and 700. Every current label is Latin, so Montserrat answers
them, and the item list grew 517px to 528px on the change, the small step a genuine
face swap gives. Add a Korean menu item and 600 would synthesise on it; 700 is the
weight both faces share if that ever matters.

### Full-opacity labels

Super dims its navbar links: `.super-navbar__item` carries `opacity: 0.7`, lifted
to 1 by `.super-navbar__item:hover, .super-navbar__item.active`. The colour is a
true `#fff`, but 0.7 of it over the hero measured as grey 199 rather than 255, which
is what made the menu look thin. `css/super-custom.css` sets `opacity: 1`.

Composited against the scrim behind the menu, luminance 68:

| opacity | rendered grey | contrast against the scrim |
| --- | --- | --- |
| 0.7, Super's default | 199 | 5.8:1 |
| 1 | 255 | 9.7:1 |

That costs Super's hover affordance, since hover also just set opacity to 1, so
hover gets an underline instead. The active item is still obvious without it: it is
the one keeping its icon.

### Icons on the active item only

Super puts `active` on the current page's link, so
`.super-navbar__item:not(.active) svg { display: none }` leaves one icon in the bar.
The item is a flex box with `gap: 4px`, and `display: none` collapses the gap too,
so nothing is left behind: the item list measured 617px before and 537px after,
exactly the four hidden icons at 16px plus their gaps. The logo is
`.super-navbar__logo`, a different element, so it is untouched.

Home shows no icon at all, because Home is not one of the navbar items and nothing
is marked active there. Verified on `/`: five items, none with `active`.

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

### How the band is layered

The callout is the positioned ancestor and the photo goes absolute inside it, which
is why `.notion-callout__content` is deliberately left unpositioned: that box sits
inside the callout's vertical padding, and anchoring there left the callout's blue
showing in a strip above and below the photo. Everything that is not the photo is
then positioned back on top of it. Document order alone puts the text over the
image, so no `z-index` is involved. The band is full-bleed, so that text takes a
fluid inset rather than `--layout-max-width`, which had left it stranded mid-screen
on wide monitors; the clamp matches the hero's.

`css/footer.css` carries four `!important` declarations, each against something a
selector cannot outrank: Super's 30vh bottom padding on `.notion-root`, which it
applies because its own footer is off and which would float the band above a gap;
the `.border` variant of the callout class, which ties on specificity; Notion's
inline `style="height:auto"` on the image; and Super's own text colours.

The photo is a Notion image block rather than a CSS background, so swapping it is a
drag-and-drop in Notion and the stylesheet never names a host. That costs about ten
declarations over the background-image version. `#14161a` stands in until it loads,
because the callout's blue would flash first.

`js/footer-inject.js` starts its fetch immediately and defers the DOM work to
`DOMContentLoaded`, so it is safe in the Head tab where `document.body` does not
exist yet. It clones with `importNode`, and re-places under a `MutationObserver`
because Super routes between pages on the client and React swaps `.notion-root` out
without a reload. If JS is off there is no band; Super's own footer would be the
fallback and it is switched off, so the page simply ends after its content.

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

## Home Page

`css/home.css` is the whole Home CSS tab and covers two sections.

The hero is a top-level gray callout (`bg-gray-light`, not `bg-gray`) holding the
video and two headings, broken full-bleed and pulled up under the navbar. Its bare
`.notion-header` / `.super-content` / `.super-navbar` rules only ever reach Home
because the file is per-page; do not move it site-wide. `--navbar-text-color` is set
rather than a colour rule, because super.css reads that variable for links and icons
alike, and `overflow-x` on body answers the sideways scroll the -50vw break-out
causes. Its `!important` declarations answer Notion and Super rather than a
specificity guess: Notion emits its own width attribute on `<video>`, and Super's
uploaded face tops out at weight 700.

Below it sits a second linked gallery view of `Lab News Posts`, cut to the three
newest posts.

**`auto-fill` versus `auto-fit` is the whole layout.** Super ships
`repeat(auto-fill, minmax(var(--collection-card-cover-size-<size>), 1fr))`, and
`auto-fill` keeps every track it can fit whether or not anything lands in it. Once
the page went Full width, a 1393px row held five 240px tracks, three cards filled
the first three, and 567px sat empty on the right, which reads as a left-aligned
strip. `auto-fit` collapses the empty tracks to zero and the surviving `1fr` tracks
absorb the space: measured `448px 448px 448px 0px 0px`, flush to both edges. Cards
then grow with the page instead of staying at their minimum, so no width is
hard-coded anywhere. A `max-width` plus `margin-inline: auto` keeps it from running
away on a very wide monitor.

The heading is an H1 and a direct child of `.notion-root`, so
`.notion-root > h1.notion-heading` reaches it without touching the hero's H1, which
is nested inside the callout. Notion cannot centre a heading, so that stays CSS.

An earlier pass made this a horizontal scroll-snap carousel with a peeking fourth
card. It was replaced: the legacy design is three cards filling the width, and a
cut-off fourth reads as a rendering fault rather than an affordance.

Notion cannot say "top 3". The view DSL has no `LIMIT` and a gallery has no page
size, so the cap is `:nth-child(n + 4)`. Every row of the database still reaches the
browser; the rule only hides them.

A view created with `notion-create-view` starts with **Card preview: None**, so the
strip renders as text until someone sets it to Page cover in Notion. The DSL cannot
do it: `COVER "Page cover"` is rejected with "Could not find property with name or
id", because the page cover is not a property. Cards with no cover at all get an
unclassed spacer div, the same one Lab News handles, so the ratio rule names both.

All three `--collection-card-cover-size-*` variables are set to the same value on
purpose. Super scopes them per card size, so setting only the one the view uses
today would go silent the moment someone switches it in Notion. Prefer that to the
size-class selector Lab News still uses.

## Lab News Page

`css/lab-news.css` styles a linked gallery view showing Title, Date, Location and
Summary. Super renders the grid and drives every card dimension from a custom
property, so most of the file is a variable block; the column count falls out of
Super's `repeat(auto-fill, …)` from the minimum card width, which is why there are
no media queries. The `large` suffix has to match the card size set on the view in
Notion. Super's 96px side padding is overridden, because the legacy page ran much
nearer the edge.

The `property-*` classes are Notion property ids, and the only stable handle on a
card row: `:nth-child()` shifts the moment a post leaves a field empty, because
Notion drops the element rather than rendering it blank.

| Class | Field |
| --- | --- |
| `property-4856717d` | Date |
| `property-6e756d61` | Location |
| `property-686f7844` | Summary |

Cards line up only when every row is a fixed height, so each row is given one and
the property list is a flex column, which keeps those heights exact: in block flow
the reserved Location row collapses against the summary's top margin and lands 8px
short of a real one. Half the posts carry no Location, so the date stands that row
in for them, selected with `:not(:has(…))`.

Covers are pinned by `aspect-ratio` rather than by Super's height variable, which
takes a length and would letterbox a phone showing one card across. A post with no
cover gets an unclassed spacer div carrying an inline height, and only `!important`
reaches past that.

The post count is a CSS counter over the rendered cards, printed by the gallery's
own `::after` because counters read in document order.

## Hero Video Autoplay

`js/home-video-play.js` is the Home Body tab, pasted inside `<script>`. Notion emits `<video controls>` and
Super adds only `autoPlay`; no browser honours autoplay without `muted`, so the clip
never starts on its own, and loop and controls are not covered either.

Playback is re-asserted rather than kicked off once. Super is a React app, so
hydration re-renders the `<video>`, reloads the source, and aborts any `play()`
already in flight. Retrying on `canplay` and on every mutation tick survives that,
and the paused check keeps it from fighting a real pause. The rejection handler
warns once per element rather than staying silent: silence there once cost an
afternoon, because the console looked clean while playback was being refused.

Its HERO selector has to stay in step with `css/home.css`.

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
