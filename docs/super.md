# Super Platform Reference

Measured facts about how Super renders this site (plan: **Personal**). Docs at <https://docs.super.so/>:
`/super-css-classes`, `/custom-code`, `/code-snippets`; check them first, devtools and `curl` for the rest.

## Injection Model

- Super's Code editor has three tabs, **CSS**, **Head**, **Body**, each site-wide and per page.
  **Notion edits need a Sync** in the Super dashboard: an unsynced page is indistinguishable from
  broken CSS, and no cache is involved (it is Super's build), so check sync before devtools.
- **Per-page `<script>` tags do not run on client-side entry**: Super re-injects a page's `<link>` tags on
  navigation but never executes its scripts. Scripts go site-wide (`code/global.html`), guard themselves
  by selector (`.page__people`), observe `documentElement` rather than `body`, and carry `defer`.
  **Per-page CSS cannot leak**: Super deactivates a page's styles on leaving it, so bare selectors are
  safe there.
- The Head tab takes HTML, not JS: bare JS pasted there becomes an inert text node. A leftover paste in a
  CSS tab fights the linked file on cascade order; a design change is a URL change with the tab kept
  empty.
- Super's stylesheets are public (`curl -sO https://daim.super.site/styles/{notion,static,super}.css`), so
  markup can be reproduced locally and CSS checked before the page exists.
- Test traps: patching served HTML does not stick (the stylesheet also rides in the React flight payload
  and hydration restores it, which reads as phantom styling), and a test `<style>` must append to
  `document.body`, not head: Super's CSS tab lands late in body and wins ties.

## Classes and Scoping

- `notion-*` for rendered blocks, `super-*` for Super chrome; the full list is the docs'
  `/super-css-classes`. Super's footer is off, so no `super-footer` markup exists here.
- `<main>` carries `super-content page__<slug> parent-page__<parent>` and `id="page-<slug>"`; Home is
  `page__index`. Scope rules per page (`.page__projects .notion-collection-card`). Collection wrappers
  carry `collection-<data-source-id>`; the five member views share one class, the alumni database has
  another.
- `.super-navbar` is a sibling before `main`, so page scopes cannot reach it by descent; use
  `.super-root:has(main.page__index) .super-navbar`. Page overrides of `--padding-left/right` on `main` do
  not reach the navbar either.

## Native Paths

Confirmed against the docs, each replacing custom code: video autoplay is `super:{{ autoplay }}` at the
end of the video caption, eager image load `super:{{ eager }}`, and an image links to a URL via its
caption (Super hides it); fonts are Design → Typography (upload included on Personal), the palette Design
→ Colors; pretty URLs, SEO, redirects, password, and hide-via-404 are per-page settings; the image
carousel is the Gallery Carousel snippet, a gallery view inside a brown callout. Not native, checked:
nothing hides a page title or icon (`.notion-header { display: none }` stays CSS); Site Files is Pro-only
and `.txt`-only, so jsDelivr stays ([`hosting.md`](hosting.md)).

## Fonts

- Design → Typography loads the faces (Primary NanumSquare, Secondary Montserrat); `css/global.css` paints
  through one stack, `Montserrat, NanumSquare, …`, falling through per character. Trap: Typography now
  changes what loads, not the look, and dropping either face there makes Latin silently fall back.
- Classic NanumSquare has no 500/600 (they synthesised); `assets/fonts/` carries NanumSquare Neo instanced
  at 400/500/600/700, mapping and axis trap in `assets/fonts/README.md`.
- A site-wide rule hides `.notion-toggle.bg-brown` (from the Ascent template), which keeps the `🎛 Control
  panel` off the site; brown toggles stay reserved for hidden blocks.

## Theming Variables

Override a variable before writing per-block rules. Notable: `--color-{text,bg,pill,pill-text}-<color>`,
`--<color>-h/-s/-l` (retints every block of that Notion color), `--navbar-*`, `--footer-*`,
`--{primary,secondary}-font`, `--{text,heading}-weight`, `--heading{1..5}-size`, `--layout-max-width`
(1100px), `--padding-left/right`, `--navbar-height` (60px), per-block `--*-border-radii/-padding/-shadow`.

Collection cards are variable-driven. `--collection-card-cover-size-{small,medium,large}` (172/260/320px)
is the min card width and hence the column count; also `-cover-height-*` (128/200/200px), `-gap` (10px,
two-value), `-padding` (0), `-border-radii`, `-content-padding`, `--collection-header-border`,
`--color-card-bg` (#fff). There is no card `border`; `--collection-card-shadow` (hairline + drop) is the
border look. Traps: a size class (`__cover.medium`) beats a page scope, so prefer the variable; a
coverless row emits an unclassed spacer div with an inline height that only `!important` reaches; a
percentage inside `minmax()`'s minimum breaks `auto-fill`'s count, use plain lengths; the variables are
scoped per card size, so set all three sizes (a Notion view switch silences a single-size rule) and hold
cover shapes with `aspect-ratio`, not a height.

## Design Tokens

From the live IMweb site; match unless overridden. Accent `#00B8FF`/`#05b2f5`, ink `#212121`/`#1c1c1e`,
surface `#ffffff`/`#f8f8f8`, rule `#dadada`/`#e5e5e5`, Montserrat for Latin, NanumSquare for Korean.
The working palette (`--ink --sub --muted --rule --accent --accent-deep --kaist-blue`) and the identity
metrics (`--icon-w --photo-radius`) sit on `:root` in `css/global.css`; a page overrides locally where
its design departs (Projects keeps its own `--sub`).
Ascent's accent is Notion green; retint via `--green-h/-s/-l` rather than editing blocks. Site identity:
title `DAIM`, description `DAIM LABS 홈페이지`, legacy logo/OG `https://cdn.imweb.me/upload/S20240718af4b4371a8c5a/e847603f005eb.png`.

## Navbar

- On Home the navbar is transparent with white links over the hero, and `position: static` so it scrolls
  away; other pages keep Super's sticky bar (the site-wide Visible-on-Scroll setting stays untouched).
  Legibility: a second top-down scrim (first 170px) on the hero's own `::after`, `text-shadow` on labels,
  `drop-shadow` on the SVG icons.
- `css/global.css` sets `.super-navbar__item { font-weight: 600; opacity: 1 }`: 600 is a real Montserrat
  face (NanumSquare has only 400/700), and Super's default 0.7 opacity greyed the links; hover gets an
  underline instead. `:not(.active) svg { display: none }` leaves the icon on the active item only; Home
  marks nothing active and shows none.
- Mobile drawer: Home's white `--navbar-text-color` reached the white drawer panel; redefining the
  variable deeper or coloring the links directly both fail (no descendant re-reads it; `.notion-link` wins
  with `color: inherit`), while `color: #000` on `.super-navbar__menu-wrapper` works.
  `.super-navbar__content` is sized to the full bar; insetting it needs `width: auto`.

## Site-Wide Footer

- Super's footer shapes cannot express the legacy band, so Footer Type is **None**; the band is a blue
  callout living only on `/footer`, styled by `css/footer.css`, cloned onto every page by
  `js/footer-inject.js`. The clone fetches `/footer` (same-origin, server-rendered) because app.notion.com
  sends no CORS headers and the API needs a secret.
- Layering: the callout is the positioned ancestor, the photo (a Notion image block, swap by
  drag-and-drop) absolute inside it, text on top by document order; `__content` stays unpositioned on
  purpose, and full-bleed text uses a fluid inset, not `--layout-max-width`. The four `!important`s answer
  Super's 30vh root padding, the `.border` tie, Notion's inline `height:auto`, and Super's text colors.
- Appending before React finishes hydrating throws error #418, so the script fetches immediately but
  places after `load` plus one `requestIdleCallback` (`{timeout: 2000}`, `setTimeout` fallback),
  re-placing under a `MutationObserver` because Super swaps `.notion-root` on client-side routing.
- Keep true: `/footer` stays published and out of the sitemap (the 404 setting breaks the fetch); blue
  callouts stay the footer's (`bg-blue-light` in CSS and script); crawlers never see the band, accepted.

## Home Page

- `css/home.css`, per-page, but every rule still guards itself with `.page__index` (navbar rules via
  `.super-root:has(.page__index)`, the navbar being a sibling of the page container): an injected head
  outlives its page across client-side navigation, and Home's bare hero selector would otherwise restyle
  the professor card, another `bg-gray-light` callout, on /people. Hero: a top-level `bg-gray-light`
  callout with the video, broken full-bleed under the navbar; `--navbar-text-color: #fff` is set as a
  variable so super.css recolors links and icons alike, and `overflow-x` answers the break-out scroll.
- Latest strip: a second linked view of Lab News Posts, wearing the card look from `css/news-card.css`
  (shared with /lab-news, scope `:is(.page__index, .page__lab-news)`; both views render the same database,
  so the property ids match). `auto-fit` replaces Super's `auto-fill` so empty tracks collapse and three
  cards fill the row; the cap is `:nth-child(n + 4)` because the view DSL has no LIMIT. All three
  cover-size variables are set alike. The heading centers via
  `.notion-root > h1.notion-heading` (the hero's H1 is nested, unaffected).
- A view created by `notion-create-view` starts with Card preview: None; setting Page cover is a manual
  Notion click on every new view (the DSL cannot: the page cover is not a property).
- Hero autoplay is `js/home-video-play.js`, site-wide, guarded by `.page__index`: no browser autoplays
  unmuted, so it mutes, loops, and re-asserts `play()` on `canplay` and every mutation tick (hydration
  reloads the source and aborts in-flight plays). Its HERO selector stays in step with `css/home.css`.

## Lab News Page

- The card look (title, meta, and summary type, the square covers) lives in `css/news-card.css`, shared
  with Home's strip; `css/lab-news.css` keeps the page frame. Hooks: Date `property-4856717d`, Location
  `property-6e756d61`, Summary `property-686f7844` (`:nth-child` shifts when a field is empty; Notion
  drops the element). Cards align by fixed per-row heights in a flex-column property list; the date
  stands in for a missing Location via `:not(:has(…))`; the post count is a CSS counter printed by the
  gallery's `::after`.
- Load More (`js/lab-news-load-more.js`, site-wide, guarded `.page__lab-news`): shows 18 cards, +18 per
  click. Display control, not paging: every card is in the served HTML; the win is lazy covers. CSS makes
  the first cut, keyed on the grid lacking `data-total`; the script stamps `data-total` after hydration
  (earlier throws #418), the counter reads it via `attr()`, and every observer write is compare-first.

## Projects Page

- `css/projects.css`. Hooks: Partner `property-75626b3b`, Period `property-475c4c48`, Summary
  `property-45774b6f`, Status `property-46414376`. The property list is a wrapping flex row: every
  property `width: 100%` except the date and the status chip (`auto`), which share a line; the chip needs
  `line-height: 1` against Super's 18px pill line box. Status renders as `notion-property__select`, id
  preserved, pill colors per state.
- The grid caps at three columns, `repeat(auto-fill, minmax(max(268px, 30%), 1fr))`; below ~900px the
  268px floor steps it down without a media query.
- Card anatomy: the anchor is absolute over the whole card, the cover's span is `display: contents`, the
  card is already `position: relative`, so an absolute status pill needs only `z-index: 3`. The summary
  keeps a two-line clamp (Chrome reports it as `flow-root`; measure the height).
- The status tabs are Super's `.notion-dropdown` restyled per `reference/ascent-template.css:386`; left
  alone below 576px. The four views live on the linked block (its id is the `notion-create-view`
  `database_id`). Cell wrapping is the view's `WRAP CELLS`, not CSS.
- Dates: Notion has no year-month format and formula properties never render on Super collection cards (do
  not rebuild the deleted `Term` formula), so `js/date-format.js` rewrites the Period under a
  `MutationObserver`.

## Publications Pages

- Three pages, one stylesheet: `code/publications.html`, `code/publications-papers.html`
  and `code/publications-patents.html` all link `css/publications.css` at the same
  pinned SHA. Scope classes are `page__publications`, `page__publications-papers` and
  `page__publications-patents`; every rule names one of them, even though per-page CSS
  cannot leak, so the designs stay legible apart.
- The navbar entry points at `/publications/papers`, not at `/publications`. A Super
  navbar dropdown would be the obvious way to hold two children, but its markup does
  not take the icon-over-label rules `global.css` puts on `.super-navbar__item`, so
  the item breaks and the site avoids dropdowns. `/publications` stays published,
  carries only the nav, and is excluded from the sitemap.
- Section nav: the two link-to-page blocks at the top of each page. Super renders a
  link-to-page as `a.notion-page` wrapping `.notion-page__icon` and
  `.notion-page__title` (an `alias` block renders its referenced block, so this is the
  page block itself), and they are the only `.notion-page` children of `.notion-root`.
  Which entry is current comes from the page scope class crossed with a test on the
  last path segment (`[href$="/papers"]`, `[href$="/patents"]`), so no script reads
  the URL. On the landing page neither matches, which is the intent.
- Tabs: the three views on the linked block make Super emit `.notion-dropdown`, which
  is a button plus an absolutely positioned menu that JS keeps inert through
  `.initial-state` and `.animate-out`. The conversion to a row of buttons is Ascent's
  own (`reference/ascent-template.css:386`): hide the button, neutralise the inert
  classes, and flex `.notion-dropdown__option-list`. The options keep their handlers.
  `.notion-dropdown__option.active` is the current tab.
- Year rail: each group is a `.notion-collection-group__section` holding its header and
  the rows, so the section becomes a two-column grid. The rule is a `border-left` on the
  non-header child and the node dot is that child's `::before`; neither is an element.
  The header is a collapse toggle by default, so the caret is hidden and
  `pointer-events` are dropped. Measured against POSTECH CVLab, whose rail is the same
  shape: 65px year column, 2.4px rule, 9px dot.
- Patents skip the rail. One ungrouped view, `.notion-collection-list` turned into an
  `auto-fill` card grid. Ascent rules `.notion-collection-list__item` with `!important`
  on border, radius, margin and padding, so the card rules match that weight.

## People Page

- Head tab `code/people.html`: links only (Font Awesome, `css/people.css`, `css/people-identity.css`,
  `css/people-professor.css`, each pinned to a SHA); the CSS and Body tabs stay empty. The identity file
  holds what the card shares with the profile page: the mailto:/tel: contact rows, the domain-marked SNS
  circles, and the blue entry bars, scoped `:is()` over both pages' exact containers. Behavior is site-wide: `js/email-copy.js`
  (deliberately unscoped, any email property on any page gets click-to-copy) and a `.page__people` rule in
  `js/date-format.js` cutting Joined to year-month. A change is two commits: the file, then the head file
  repinned to its new SHA ([`hosting.md`](hosting.md#jsdelivr)).
- Hero carousel: the Gallery Carousel snippet (a gallery view of `Team Photos` inside a brown callout;
  self-guarding, site-wide safe) plus `js/carousel-autoplay.js` clicking the next arrow every 5s, pausing
  under the pointer and in hidden tabs. Manual Notion steps: Card preview to Page cover, and the
  database's drag into the Control panel.
- Professor card: a `gray_bg` callout (blue is the footer's, brown the carousel's) that
  `css/people-professor.css` turns into a full-row white card (`width: 100%`, own `box-sizing:
  border-box`), replacing the columns' inline `calc()` widths with flex (`--column-spacing` does not
  resolve inside a callout) and keeping the photo track on a definite `clamp()` basis (a flexible one goes
  cyclic); the portrait width carries `!important` against Super's `width: 100% !important` on
  `.page-width` images. The left column reads by marker under the portrait: the first text is the blue
  label, bold marks the name, italics the department, then three contact
  rows drawn as FA-glyph grids, identified by their own mailto:/tel: links rather than by position, so
  reordering cannot detach an icon, plus an SNS row of member-card-style
  icon circles keyed the same way on link domains (linkedin.com / scholar.google / facebook.com); the
  right column is the section headings over Notion-bulleted entries whose dots restyle into the blue bars. The name link's `::after` overlay stretches over the card and every other text block sits
  at `z-index: 1` above it, so text stays selectable and only empty space, or the `pointer-events: none`
  portrait, clicks through to the profile (an overlay at `z-index: -1` instead makes Chrome's hover
  hit-test oscillate and the cursor flicker). Reordering the left column's blocks or removing the name
  link breaks the card.
- Motto: one quote block, its attribution a nested bullet the CSS restyles (`“` glyph, muted line);
  un-nesting it, or adding a second, breaks the design.
- Member-card traps: the cover's `object-fit`/`object-position` are inline styles (`!important` needed);
  the email property renders with no anchor and, on a `no-click` card, needs `pointer-events: auto`;
  `.notion-pill` is nowrap. Layout: the gallery becomes flex `space-evenly` with 320px cards and
  `max-width: 1060px`; three per row falls out. Portraits sit inset at `--photo-w` 260px (low-res ID
  photos must not zoom); equal row heights need `height: auto` to undo Super's `height: 100%`.
- Icon row: the property list is a grid `repeat(5, 34px) 1fr`; every property spans `1 / -1` except Email
  and URL properties, which auto-place into the 34px tracks, Email first (fill Email on every member so
  bottom rows match). Icons are Font Awesome glyphs, declared as `--glyph`/`--glyph-font` and drawn by
  one absolute `::before` layer (a centering grid on the button misaligns on the hidden text node); the
  check glyph is solid-only, so `.copied` swaps `--glyph-font`; the tooltip shows `data-email` via `attr()`.
- Property hooks: Research `property-61796943`, Email `property-3a50566e`, Homepage `property-6e4c7e43`,
  GitHub `property-5a4c6b3d`, LinkedIn `property-7956403c`, CV `property-45444558`, Joined
  `property-75566065` (via the generic `.notion-property__date`).

The professor's profile page (`/people/professor`, scope `.page__people-professor`) is the card's
full-page counterpart: Head tab `code/professor.html` links Font Awesome, `css/people-identity.css`
(the shared contact rows, SNS circles, and entry bars), and `css/professor.css`, and the same markers
drive it (mailto:/tel: glyph rows, SNS domains, bulleted entries). Its Media gallery
is a linked view styled after ascent.super.site's team gallery: the card rests as a clean cover
photo, and hover slides a translucent bottom bar in carrying the title over a date-and-outlet line
(date trimmed to `YYYY.MM` by `js/date-format.js`; the bar stays out on touch devices, where hover
does not exist). Every card clicks through its `Source URL` property -- the article or video that
covers the item, or the photo's own raw `main` URL when no coverage exists -- via the property's
anchor stretched over the card (it overshoots the bottom bar upward; the card's overflow clips it).
The row-page anchor loses pointer-events and doubles as the badge layer, and a `media-video-*`
cover filename earns the play badge. The coverless header's 140px spacer trims to 40px.

## Known Quirks

- `/fit=scale-down` and `/quality=90` 404s: Super's `srcset` carries unencoded commas, splitting one
  `images.spr.so` URL into three. Cosmetic; `src` renders fine; deleting the Ascent logo left in the
  Control panel removes Home's copy.
- Rows past 100 are untested (Notion pages its queries at 100; Super emits no load-more markup). Lab
  News is settled at **57** rows, all rendered; the sitemap's extra entry is the database template page.
