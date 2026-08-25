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

## Notion Edits Need a Sync

**Editing Notion does not change the live site. Someone has to press Sync in the
Super dashboard.** Measured 2026-08-25 while building People: the page was rewritten
in Notion, six linked views added, and `/team-daim` served the old lorem ipsum for
ten minutes across 62 requests. Cache-busting query strings and
`Cache-Control: no-cache` change nothing, because the staleness is Super's build,
not a cache in front of it.

This is worth knowing before reaching for devtools. A gallery that renders empty, a
heading that will not appear, a card with no cover: check the sync first, because an
unsynced page is indistinguishable from broken CSS.

It also means CSS can be built before the page exists. Super's own stylesheets are
four public files, so the markup can be reproduced locally and the CSS checked
against it:

```bash
for f in notion static super; do curl -sO "https://daim.super.site/styles/$f.css"; done
```

That is how `css/team-daim.css` was measured, and it caught a `minmax()` overflow
that would otherwise have shipped.

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

Korean has no weight between Regular and Bold in classic NanumSquare, so Super's
500 and 600 upload slots had nothing to fill them and those weights synthesised.
`assets/fonts/` now carries four cuts of NanumSquare Neo, instanced from its
variable font at 400, 500, 600 and 700, with the mapping and the axis trap written
up in `assets/fonts/README.md`.

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

### The mobile drawer takes the white back off

Home's `--navbar-text-color: #fff` reached the mobile drawer, which is a white panel,
so its links were white on white. Reported 2026-08-25 from a phone; contrast measured
at 1.0:1 against the panel and 1.14:1 against the active item's `#f0f0f0` pill.

The drawer is a third child of `.super-navbar`, beside `__content` and
`__viewport-wrapper`, and its links are `.super-navigation-menu__item`, a different
class from the bar's `.super-navbar__item`. It inherits the colour rather than
setting one: Super declares `color: var(--navbar-text-color)` on `.super-navbar`
itself, so the white is already computed by the time it reaches the drawer.

That rules out two obvious fixes. Redefining the variable deeper does nothing,
because no descendant re-reads it. Setting `color` on `.super-navigation-menu__item`
does nothing either, because `.notion-link:not(.color-default, …)` wins on
specificity with `color: inherit`. What works is `color` on a wrapper the links
inherit through:

```css
.super-navbar__menu-wrapper {
  color: #000;
}
```

`#000` is Super's own value from `html.theme-light`, so the drawer matches every
other page. The bar keeps white: `__content` holds the logo and the close button,
both still over the video.

Verified at 390x844: links and icons `rgb(0, 0, 0)`, 21:1 on the panel and 18.4:1 on
the pill, with the logo and desktop items still white at 1600px.

Two traps for anyone testing this. Patching the served HTML does not work for CSS:
Super's stylesheet text also rides in the React flight payload, so hydration restores
the original and the edit vanishes. Inject at runtime instead — but **append the test
`<style>` to `document.body`, not `document.head`**. Super drops a page's CSS tab into
a `<style>` near the end of the body, so a tag added to the head loses every
specificity tie against it and the test silently reads as "my CSS does not work".

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

`js/footer-inject.js` starts its fetch immediately and defers the DOM work until
after React has hydrated, so it is safe in the Head tab where `document.body` does
not exist yet. It clones with `importNode`, and re-places under a
`MutationObserver` because Super routes between pages on the client and React swaps
`.notion-root` out without a reload. If JS is off there is no band; Super's own
footer would be the fallback and it is switched off, so the page simply ends after
its content.

### Why the first placement waits for idle

Appending to `.notion-root` before hydration finishes throws React #418, *hydration
failed because the server rendered HTML didn't match the client*. Measured on Home,
2026-08-25: `DOMContentLoaded` 351 ms, `load` 657 ms, hydration done ~785 ms. So
`load` is too early; appending there still threw. Isolated by serving the page three
ways under Playwright route interception, with `pageerror` counted per load:

| Head tab contents | Band placed | #418 |
| --- | --- | --- |
| script tag present, body a no-op | no | 0 |
| script runs, `SOURCE` 404s so nothing appends | no | 0 |
| append on `DOMContentLoaded` | yes | 1, at 785 ms |
| append on `load` | yes | 1 |
| append at a fixed 3000 ms or 7000 ms | yes | 0 |

The append is the trigger, not the script tag and not the fetch. A fixed delay fixes
it but guesses at a number, so the script waits for `load` and then one
`requestIdleCallback`: React hydrates in MessageChannel tasks, which outrank idle
callbacks, so the first idle frame after `load` is a signal that hydration has
drained. The `{ timeout: 2000 }` keeps it bounded on a page that never goes idle,
and a `setTimeout` covers Safari before 16.4. Band appears at 673-970 ms, #418 gone
on Home and Lab News.

The error was console-only; the `MutationObserver` re-placed the band and nothing
was visibly wrong. React may discard a client-side subtree after a mismatch, so it
was worth removing rather than documenting as noise.

Three things to keep true:

1. `/footer` stays published and stays out of the sitemap. The 404 setting would
   break the fetch.
2. Ordinary callouts get a colour other than blue. `.notion-callout.bg-blue-light`
   is the footer's selector in both the CSS and the script.
3. The clone is appended to `.notion-root`, and Super routes between pages on the
   client, so the script re-places it under a `MutationObserver`.
4. The Head tab takes HTML, not JS. Paste the file inside `<script>` tags or the
   browser treats it as a text node: no execution, no error, nothing in the console.
   Same for `js/home-video-play.js` in the Home Body tab.

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

## Projects Page

`css/projects.css` is the whole Projects CSS tab; `js/projects-date-format.js` is its
Body tab. Three columns of figure-topped cards, chosen over a coverless index and a
split card after seeing all three rendered with the real 16 rows.

| Property | Class | On the card |
| --- | --- | --- |
| Title | `.title` | wraps freely, no cap |
| Partner | `property-75626b3b` | under the date |
| Period | `property-475c4c48` | monospaced, above the partner |
| Summary | `property-45774b6f` | clamped at two lines, no fixed height |
| Status | `property-46414376` | a chip trailing the date |

The chip took two moves to place. On the cover it washed out: the figures are dense
with no quiet corner. In front of the title it was legible but a wrapped title
indented past it, which looked worse than the problem it solved. It now trails the
date.

That needs the property list to be a wrapping flex **row** rather than a column.
Every property is `width: 100%` and claims a line of its own; the date and the chip
are the two exceptions at `width: auto`, so they share one line and the title keeps a
full line to itself.

Sizing the chip needs `line-height: 1` explicitly. Super hands the pill an 18px line
box whatever its font size, so at 10px the chip stood 27.6px tall against a 19.2px
date line. With the line box collapsed it measures 19.6px, within a pixel of the text
it sits beside.

`Status` is a Notion `status` property, not a select: Planned / In progress / Done in
the to-do / in-progress / complete groups. Super renders it as
`notion-property__select` all the same, and the property id survived the conversion,
so nothing in the CSS is keyed differently. Notion's colour per option arrives as a
`pill-*` class, and the CSS keeps each state's own colour: grey waiting, blue running,
green finished.

The grid is capped at three columns by the floor inside `minmax()`:

```css
grid-template-columns: repeat(auto-fill, minmax(max(268px, 30%), 1fr));
```

Four tracks would need 120% of the row, so `auto-fill` can never place a fourth. Below
about 900px the 268px half of the `max()` wins instead and the grid steps down to two,
then one. Measured: 3 at 1600px and 1440px, 2 at 860px, 1 at 390px. No media query.

### What the card is made of

Worth knowing before writing any rule that changes the card's own layout, because it
is not what the class names suggest:

```
div.notion-collection-card          position: relative
├─ a.notion-collection-card__anchor position: absolute, covers the whole card
├─ span                             display: contents  ← the cover lives in here
│   └─ img.notion-collection-card__cover
└─ div.notion-collection-card__content.notion-collection-card__property-list
```

Two consequences. Setting `display: grid` on the card gives exactly two grid items,
the cover and the property list, because the anchor is out of flow and the `span`
around the cover is `display: contents`. And the card is already `position: relative`,
so `position: absolute` on the status property lands on the cover with no extra rule;
it needs `z-index: 3` only to clear the anchor.

The property list is a flex column here, and `order` puts Period back above Partner,
which is not the order the view emits. Nothing carries a fixed height: an earlier
version locked the title to two lines so the date rows would align across a row, and
that left a visible gap under every one-line title. Cards now size to their own
content and rows no longer line up, which is the trade that was wanted.

The summary keeps a two-line `-webkit-line-clamp`, which is a ceiling and never a
floor. It is worth keeping: without it the longest excerpt here runs to four lines.
Chrome reports the clamped element's `display` as `flow-root` rather than
`-webkit-box`, so that computed value is not evidence the clamp has failed — measure
the rendered height instead.

### Status tabs are a restyled dropdown

Super emits a `.notion-dropdown` for any collection with more than one view; it has no
tab rendering at all. The tabs on Ascent's own blog are that same dropdown restyled,
and `reference/ascent-template.css:386` is the recipe this page follows: hide
`__button`, pin `__menu` open with `position: relative; opacity: 1; transform: none;
animation: none`, and lay `__option-list` out as a flex row. Below 576px the dropdown
is left alone, because four tabs do not fit a phone.

The four views live on the linked block, not on the source database, and
`notion-create-view` reaches them by passing the linked block's id as `database_id`.
Each new view needs its own **Card preview → Page cover** click in Notion; the DSL
cannot set it, so a new tab renders coverless until someone does.

Two of the four tabs are empty, every project being `Done`. That was accepted
deliberately, to have the scaffolding in place before the data needs it.

Wrapping is a view setting, not CSS. Super marks a property `no-wrap` unless the view
wraps cells, and that class beat every `white-space: normal` written against it.
`WRAP CELLS true` on the view removes the class and the CSS override with it.

Covers are `aspect-ratio: 16 / 10` against sources that average 1.87:1, so roughly 7%
of the figure's height is cropped. The legacy board ran the same figures at a similar
crop.

### The date needs JavaScript

Notion emits `2018/03/01 → 2025/01/01` and offers no year-month date format; CSS
cannot cut text out of a string. `js/projects-date-format.js` rewrites it to
`2018.03 – 2025.01` and re-runs under a `MutationObserver`, because Super swaps
`.notion-root` on client-side navigation and the original format comes back otherwise.

Two projects have no end date, and Notion emits those as a bare start, so they read
`2019.01` with no dash.

Two alternatives were tried first and both lost:

- **A formula property does not render.** `Term`, a formula building the same string
  from `Period`, computes correctly in Notion and never appears on a Super card. Its
  `notion-property__formula` class is absent from the served HTML while every other
  property in the same view renders. Simplifying it to a bare
  `formatDate(dateStart(prop("Period")), "YYYY.MM")` changed nothing, so this is not
  the complexity limit Super's `/compatible-blocks` lists under unsupported blocks as
  *Complex formulas* — Super appears to skip formula properties on collection cards
  outright. The property was deleted once that was settled; do not rebuild it.
- **Retyping the period into a text property** keeps sorting, since a zero-padded
  `YYYY.MM` string sorts the same as the date it came from, but gives up date filters
  and puts 16 values under manual upkeep.

### Load More is on Lab News, not here

Sixteen projects fit one screen and a button would be decoration. The mechanism is
built for Lab News and written up under that page; the measurements that decided it
are there too.

### Load More

`js/lab-news-load-more.js` shows 18 of the 57 cards and adds 18 per click. This is
display control, not paging: Super server-renders every card into the initial HTML,
with no cursor, no `hasMore`, and no load-more markup, so nothing here shrinks the
document. What it buys is a first screen that ends after six rows, and covers that are
never fetched until asked for, the images carrying `loading="lazy"`. Measured with the
cap in place, 12 covers load against 18 uncapped. Crawlers still see all 57.

Three things had to line up.

**CSS makes the first cut, not the script.** The rule keys on the grid *not* having a
`data-total` attribute yet, so the page paints capped with no JavaScript involved. The
script sets `data-total` once React has hydrated, which switches the cut over to
`.is-beyond` and reveals the button. Letting the script make the first cut instead
costs a React #418: measured 1 against a control of 0, the same hydration mismatch
`footer-inject.js` hit, and it is deferred the same way.

**The post count needs the attribute.** `css/lab-news.css` prints the count from a CSS
counter over the cards, and a `display: none` card does not increment it, so the
heading would have read `18 posts`. The script writes the true total into
`data-total` and a second rule reads it back with `attr()`.

**The observer has to settle.** `paint()` runs on every mutation and mutates the DOM
itself, so every write is guarded by a compare-first helper; without it the button's
own label rewrites the text node forever.

Testing this needs care. Patching the served HTML to inject the CSS throws #418 on its
own, script or no script, because React restores the stylesheet from the flight
payload. Inject the script by patching the HTML, and the CSS at runtime — never both
at once, or the harness's own error is read as the code's.

## People Page

`css/team-daim.css` is the page's own CSS tab. Six linked gallery views of `People`,
one per `Role`, each under an H2. Which properties each view shows and which block id
belongs to which section are in [`notion.md`](notion.md#collections).

A gallery card is a column: cover on top, properties below. Here it is a row, square
portrait on the left and text on the right, two to a line on desktop and one on a
phone. The reference is <https://hcil.snu.ac.kr/people>, measured at 1440px: a 176px
portrait, a 24px gutter, a 440px row, two columns, and research interests one per
line under the name. <https://ecl.snu.ac.kr/members> groups the same way and puts the
principal investigator's full CV inline instead of behind a link.

### The card is a div, not an anchor

This is the fact the page is built on, and it is not what the markup looks like from
the outside. Super emits:

```html
<div class="notion-collection-card gallery">
  <a class="notion-collection-card__anchor" href="…">Name</a>
  <span style="display:contents"><img class="notion-collection-card__cover small"></span>
  <div class="notion-collection-card__content notion-collection-card__property-list">…</div>
</div>
```

The anchor is a sibling, absolutely positioned over the whole card at `z-index: 10`
with `color: transparent`. Two things follow.

Flipping the card to `display: flex` gives exactly two in-flow children, the portrait
and the content, because the anchor is out of flow and the lightbox span is
`display: contents`. The cover class is on the `img` itself, so the portrait is a
direct flex child and needs no wrapper rule.

And a card can be made inert without touching what sits on it. Super already carries

```css
.notion-collection-card__content .notion-property__url { pointer-events: auto; z-index: 20 }
```

so `pointer-events: none` on the anchor leaves the email and link icons clickable and
takes nothing else with it. That is what lets every student card be a dead end while
the professor's card, the only one with a page behind it, keeps its link. No nested
anchor is involved and no JavaScript.

### Turning properties into icons

Four properties share `notion-property__url`, so the icons need `property-<id>`
hooks, and a URL property has no select option to leak its id through. Read them off
the rendered page:

```bash
curl -sL https://daim.super.site/team-daim | grep -oE 'notion-property__url property-[0-9a-f]+'
```

They come back in `SHOW` order. The class is the property id hex-encoded, which is
not a guess from the examples but what the bundle does:

```js
E = x => [...x].map(c => Number(c.charCodeAt(0)).toString(16)).join("")
W = "title" === type ? null : E(id)
className = cn(`property-${W}`, …)
```

So Lab News `property-6e756d61` is `numa` and `property-686f7844` is `hoxD`, and the
title property is the one that never gets a `property-` class. Knowing the encoding
does not shortcut the lookup, because nothing over MCP exposes a Notion property id
for a type that has no select options to leak one.

The label would otherwise be the raw URL, five of them per card. The anchor keeps its
box and its href and loses only its text, `text-indent: 110%` rather than
`display: none`, so the hit area and the screen reader survive. Icons are inline SVG
data URIs; recolouring is `opacity`, since the stroke is baked in.

### Why six views and not one grouped one

The obvious simplification is one gallery grouped by `Role`, which would trade six
card-preview clicks for one and make a new role a new select option rather than a new
view, a new heading and a new CSS hook. It was measured rather than assumed, and it
loses on one point that matters.

Super does render grouped collections. From the bundle:

```js
({collectionComponent, isBoard, index, children}) => {
  const [open, setOpen] = useState(true)
  return <div className={cn("notion-collection-group__section", open ? "open" : "", …)}>
    <div onClick={() => setOpen(!open)}
         className={cn("notion-collection-group__section-header", …, index > 0 ? "not-first" : "")}>
      {children}
    </div>
    {open ? collectionComponent : null}
  </div>
}
```

and the caller passes the header its content:

```js
children: [<ToggleTrigger className="notion-collection-group__section-toggle"/>,
           <Property type={group.title.type} value={group.title.value}/>]
```

Four things follow. Groups open by default, so nothing renders collapsed. A hidden
group is skipped entirely, so an empty role costs nothing. The section carries **no
class or id naming its group**, so per-section CSS has only `not-first` to work with,
which does happen to reach the professor because `Professor` is the first `Role`
option. And the section heading is a `Property`, so for a select group-by it renders
as a **pill inside a `div`**: no heading element anywhere.

That last one decides it, and it decides it alone. On a People page the section
labels are the page's structure, the thing a screen reader tabs through and a search
engine reads, and six `<h2>` blocks are worth more than six one-time clicks. The pill
could be restyled into something that looks like a heading; it would still not be one.
The collapse is the other cost, an accidental one: the header is a click target with
no affordance, so a visitor clicking the words "Ph.D. Students" makes them vanish.

The obvious third objection is not real, so nobody should re-derive it. One view means
one set of display properties for all six groups, but a property with no value renders
nothing, so giving the professor the same set as a student costs an empty `Admitted`
and four empty links, which is to say nothing at all.

Worth keeping in view, because nothing about the data would move: the seven views are
a display choice over one unchanged table, and switching is deleting views and
rewriting a CSS block. Alumni stays its own view either way, filtered on `Status`
rather than `Role` and showing a different set of properties.

### The Alumni section has no portraits

48 rows, none with a cover, which turns two of the rules above inside out.

Every one of them hits the no-cover spacer, the unclassed `div` carrying an inline
height. Elsewhere it is drawn as a placeholder so a row without a photo still lines
up; here it is `display: none !important`, the `!important` fighting the inline style
rather than a variable.

The card then keeps its flex row and loses its left column, so it reads as a text
block: name, degree and year on one line with the mail icon, thesis on the next. The
mail icon shares the first line on purpose. On a card this short its own line is a
quarter of the height, and 48 of those is most of a screen.

Two type selectors carry it, and both are only unambiguous inside this block:
`notion-property__number` is the year, `notion-property__text` the thesis. In the
member sections the same `__text` is `Admitted`, which is why the rules are scoped to
the block id rather than the page.

### Two traps

The portrait needs its size class named. `.notion-collection-card__cover.small` sets
`height` from a variable and ties a bare page scope, winning on order, so the rule
names all three sizes. It sets `aspect-ratio` rather than a height, because a length
cannot hold a square across a changing column count.

`--collection-card-cover-size-*` carries the same value in all three sizes. Every one
of those variables is scoped to the card size its view is set to, and the view DSL
cannot set card size without also setting a cover property, so the size a view lands
on is whatever Notion defaults to and whatever someone clicks later.

That value is `min(420px, 100%)`, not a bare `420px`, and the difference is a bug that
shipped for about an hour. Super feeds the variable straight into
`minmax(var(…), 1fr)`, where a bare length wider than the container still wins as the
track minimum: a 390px phone rendered a 420px grid and scrolled sideways, measured at
`scrollWidth` 420 against a 390 viewport. This is not the percentage trap above, which
is about a percentage as `clamp`'s preferred value. `min()` resolves against a definite
container and auto-fill counts it correctly: two tracks at 1100px, one at 390px, no
overflow.

Two smaller things the CSS no longer explains itself, both measured. The professor's
card is capped at 660px inside its single full-width track, because a card stretched
across 1100px is mostly empty air to the right of a name, and capping it makes his row
the same shape as a student's, one to a line and a size larger. And a member row with
no cover keeps the spacer `div` and draws it as a grey placeholder, so a person added
without a photo still lines up; only the Alumni section hides it, having no photos at
all.

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

Whether Super renders every row of a database past 100 is still untested. Notion pages
its own collection queries at that size, and Super's behaviour is undocumented:
`/compatible-blocks` and the rest of the docs set no limit, and a rendered gallery
carries no load-more, cursor, or `hasMore` markup.

What is settled is the Lab News count that raised the question. The gallery rendered
57 cards against a write-up that said 58 posts, which looked like truncation. It was
not: `SELECT COUNT(*)` on the data source returns **57**, so every row renders and the
CSS counter in `css/lab-news.css` is accurate. The 58 was a wrong figure in
`legacy.md`, measured 2026-08-25.

The sitemap is not a second opinion here. It lists 58 rows under `/lab-news`, one more
than the database holds, because a database's page **template** gets a URL of its own
while never appearing as a card. Count cards or query the data source, not sitemap
entries.

Both collections are far short of 100, so the original question stands until one
crosses it.
