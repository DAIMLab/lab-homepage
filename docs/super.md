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

That is how the People page CSS was measured, and it caught a `minmax()` overflow
that would otherwise have shipped.

## Per-Page Scripts Do Not Run on Client-Side Entry

Super navigates client-side (a `window` marker set on one page survives a
navbar click to the next), and on entry it re-injects a page's custom `<link>`
tags — duplicated, harmlessly — but does **not** execute its `<script>` tags.
Measured 2026-08-27 on `/team-daim`: loaded directly, the page's scripts had
stamped 63 `data-email` attributes and trimmed the dates; entered from Home
through the navbar, zero attributes and untrimmed dates, with the stylesheet
link applied both ways.

So per-page injection is for CSS and `<link>` tags only. A script belongs in
the **site-wide** Head or Body (`code/global.html`), where it runs on
whatever page the visitor lands on first and its listeners and observers
follow the client-side navigation. The flip side: a site-wide script keeps
running on every page, so it must guard itself by selector — a page-scoped one
like `.page__team-daim`, or a markup hook that only its target pages emit.

The asymmetry cuts the other way for styles: **per-page CSS cannot leak onto
the next page.** Super deactivates a page's injected styles on leaving it,
even though the tags stay in the head. Measured 2026-08-27 twice: Home's bare
`.notion-header` hide and transparent navbar did not apply to About after a
navbar hop, and a test style in About's Head hiding the page icon left the
People icon alone. So per-page CSS may use bare selectors safely; only
scripts outlive their page and must self-guard.

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

Design → Typography is the loader, `css/global.css` decides what paints what.

Both faces are uploaded on the Personal plan and named in Typography, currently
Primary NanumSquare and Secondary Montserrat. That selection is what ships their
`@font-face`; measured on the live site, Super serves four NanumSquare faces from
`assets-v2.super.so/sites/…` and Montserrat from `…/global/fonts/`, and
`document.fonts` reports NanumSquare 400 and 700 plus Montserrat 400, 600 and 700
loaded.

Which face paints which character is not Typography's decision here. Super's two
slots split by role, primary against secondary, and a role cannot know whether a
run is Latin or Korean. `css/global.css` overrides both variables with one
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
would move every paragraph with it. `css/global.css` sets
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
is what made the menu look thin. `css/global.css` sets `opacity: 1`.

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
4. The Head tab takes HTML, not JS. Scripts enter as pinned `<script src>`
   lines in `code/` files; bare JS pasted into a Head tab becomes a text
   node — no execution, no error, nothing in the console.

The band is absent from the served HTML everywhere except `/footer`, so crawlers
miss it. Footer links carry little SEO weight and the band sits below the fold, so
nothing visible shifts.

## Home Page

`css/home.css`, linked from `code/home.html`, covers two sections.

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

`css/projects.css` loads from `code/projects.html`; the Period formatting is
a rule in the site-wide `js/date-format.js`. Three columns of figure-topped cards, chosen over a coverless index and a
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
cannot cut text out of a string. A rule in `js/date-format.js` rewrites it to
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

`js/lab-news-load-more.js`, site-wide in `code/global.html` and guarded by
`.page__lab-news`, shows 18 of the 57 cards and adds 18 per click on any entry
path. This is
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

Two injection targets. The page's Head tab is `code/people.html`, links
only: Font Awesome (only this page uses it) and `css/people.css` pinned to
a commit SHA; the page's CSS and Body tabs stay empty. The behavior is
site-wide in `code/global.html`: `js/email-copy.js` is deliberately generic
with no page scoping, so any database's email property, on any page, gets
click-to-copy and the `data-email` tooltip mirror, and a `.page__team-daim`
rule in `js/date-format.js` cuts Joined to year-month (Notion has no such
date format). Swapping design or behavior is swapping the matching URL for
another pinned ref (rules in [`hosting.md`](hosting.md#jsdelivr)); a change
is two commits, the file first, then the head file pointing at its new SHA.
The scripts observe `documentElement`, not `body`, so they survive head
placement, and `defer` keeps them off the parser's critical path. The cards are the five member views styled into vertical profile
cards; which views and what they show is in [`notion.md`](notion.md#collections).

**A leftover paste in the CSS tab fights the linked file.** Both apply at once,
equal-specificity ties resolve by an order nobody controls, and the cards
shatter; that is what a half-updated Code editor looks like. A design change is
a URL change, with the tab kept empty.

### Scoping by collection class

Super stamps every collection wrapper with `collection-<data-source-id>`. All five
member views share `collection-2d2152b853b942359c0f0b1a2225fb85`, the alumni
database is `collection-ba0889c2963a4d1389e411420c4bf2b0`, so one class scopes the
card styling to members and leaves Alumni alone. No per-block selectors needed.

### The card Super emits

```html
<div class="notion-collection-card gallery no-click">
  <a class="notion-collection-card__anchor" …>Name</a>
  <span style="display:contents">
    <img class="notion-collection-card__cover large"
         style="object-fit:contain;object-position:center 50%">
  </span>
  <div class="notion-collection-card__content notion-collection-card__property-list">
    <div class="notion-property notion-property__title …">Name</div>
    <div class="notion-property notion-property__select wrap property-61796943 …">…pills…</div>
    …one div per shown property, in SHOW order…
  </div>
</div>
```

Four traps live in that markup. The cover's `object-fit` and `object-position` are
**inline styles**, so the square-crop override needs `!important`. The email
property renders as plain text with no anchor, so the property div itself is styled
into the icon button and the Body-tab script supplies the click. On a `no-click`
card Super turns pointer-events off for the whole property list and only anchors
win them back, so that email div also needs `pointer-events: auto` or it can be
neither hovered nor clicked. And Super's `.notion-pill` is nowrap, so a long
research option clips at the card edge without `white-space: normal`.

### Layout: three a row, centered

`.notion-collection-gallery` becomes `flex` + `space-evenly` with fixed 320px cards
and `max-width: 1060px; margin-inline: auto`; the page's article is `full-width`, so
the column runs to `--layout-max-width`, 1100px. Four cards cannot fit, so three is
the natural cap; a two-card row spreads wider on its own, which is the requested
behavior, and a phone gets one centered column. No media query does the counting.

The photo is not an edge-to-edge cover: it sits inset at a fixed `--photo-w`, 260px,
centered. That is what lets the card widen for the text without scaling the
portraits, which are low-resolution ID photos; `object-fit: cover` over a wider
full-bleed box has no choice but to zoom them.

Cards in a row are equal height by stretch, not by reserving space: Super's own
`.notion-collection-card { height: 100% }` blocks the flex stretch, and
`height: auto` restores it. Inside the card the property list is `flex: 1` with
`grid-template-rows: auto 1fr auto auto`, so the research track absorbs the slack
and the Joined divider and icon row sit on the card bottom whatever wrapped above.
The select's `min-height` keeps a one-line research block from pulling shorter
rows tighter than two lines.

### The icon row without a wrapper

The property list is a grid, `repeat(5, 34px) 1fr`. Every property spans `1 / -1`
except Email and the URL properties, which auto-place into the five 34px tracks and
land side by side on one row, Email first because SHOW order is render order. The
`1fr` tail exists because without it the spanning rows would be as narrow as the
icon tracks. Email on every card is also what keeps the bottom row present
everywhere, so the cards in a row end alike; fill Email when adding a member.

### Font Awesome instead of inline SVG

Email and each URL property carry `--glyph` and `--glyph-font`; one `::before` rule
renders them. The button must not be a grid that centers its own content: the hidden
address or URL text node is a grid item too, takes a row of its own, and the glyph
rides ~9px above center. The `::before` is instead an absolute layer over the whole
circle and centers the glyph with its own grid; measured on a local repro
2026-08-26, the offset went from (+0.0, -9.1)px to (+0.0, -0.1)px. Codepoints: house `\f015`, GitHub `\f09b`, LinkedIn `\f0e1`, file-lines
`\f15c`, calendar `\f133`, envelope `\f0e0`, chain-link `\f0c1` as the fallback
for a URL property added later, and check `\f00c` for the copied state. The
`--fa-font-*` shorthands come from the FA stylesheet itself. FA Free carries
most icons only in the solid face: the check does not exist in regular and
renders as tofu there, which is why `.copied` swaps `--glyph-font` to solid
instead of only swapping the codepoint.

The email button also carries a CSS tooltip: the Body-tab script mirrors the
hidden address into `data-email`, an `::after` bubble shows it via `attr()` on
hover and switches to `Copied!` while `.copied` holds. No attribute, no bubble,
so the tooltip degrades away if the script is missing.

The `property-<id>` hooks, matched by href off the rendered page, not by SHOW
order:

| Property | Hook |
| --- | --- |
| Research | `property-61796943` |
| Email | `property-3a50566e` |
| Homepage | `property-6e4c7e43` |
| GitHub | `property-5a4c6b3d` |
| LinkedIn | `property-7956403c` |
| CV | `property-45444558` |
| Joined | `property-75566065` |

The CSS still targets Joined through the generic `.notion-property__date`, which
is enough while no other date property is shown.

## Hero Video Autoplay

`js/home-video-play.js` is site-wide in `code/global.html`, guarded by
`.page__index`, so the hero plays on any entry path. Notion emits `<video controls>` and
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
