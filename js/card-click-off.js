/* Super hangs a React onClick on the collection card itself, not on the anchor
   it lays over it, so an inert anchor stops the cursor and the native
   navigation but not the route change (measured 2026-08-31: onClick sits on
   .notion-collection-card, the anchor carries none). This eats the click at
   the window, before it can bubble back to React's root where the synthetic
   handler is dispatched from, which covers the anchor's keyboard Enter too.

   Which cards go inert is the stylesheet's call, read off `--card-click: off`,
   so this file names no page and no property. Whatever is genuinely clickable
   inside such a card opts out by selector below.

   Site-wide (docs/super.md); a window listener needs no re-binding when Super
   swaps .notion-root on client-side navigation. code/global.html. */

(() => {
  /* the email copy button, and any real link a URL or file property renders.
     The card's own overlay anchor is not in __content, so it is not spared */
  const KEEP = '.notion-property__email, .notion-collection-card__content a[href]';

  addEventListener('click', (e) => {
    const card = e.target.closest?.('.notion-collection-card');
    if (!card) return;
    if (getComputedStyle(card).getPropertyValue('--card-click').trim() !== 'off') return;
    if (e.target.closest(KEEP)) return;

    e.preventDefault();
    e.stopPropagation();
  }, true);
})();
