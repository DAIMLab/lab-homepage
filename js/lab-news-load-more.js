/* Lab News load more. Loaded by code/site.html through a pinned jsDelivr
   <script src defer>, not pasted. Site-wide on purpose: a per-page script
   never runs on client-side entry (docs/super.md), and without it a visitor
   arriving through the navbar could never reveal the hidden tail. The
   .page__lab-news scope keeps it inert elsewhere.

   Super renders all 57 cards into the HTML, so this hides the tail rather than
   paging it in. What it buys is a shorter first screen and no cover fetched for
   a hidden card, the covers being loading="lazy".

   CSS makes the first cut, keyed on the grid having no data-total yet, so the
   page paints capped and this script mutates nothing until React has hydrated.
   Setting data-total hands the cut over to .is-beyond and reveals the button; it
   also carries the real count, because a display:none card stops incrementing
   the CSS counter that prints it. docs/super.md, "Lab News Page". */

(() => {
  const STEP = 18;
  const GRID = '.page__lab-news .notion-collection-gallery';
  let shown = STEP;

  const set = (node, key, value) => {
    if (node[key] !== value) node[key] = value;
  };

  const paint = () => {
    const grid = document.querySelector(GRID);
    if (!grid) return;

    const cards = [...grid.querySelectorAll(':scope > .notion-collection-card')];
    if (cards.length <= STEP) return;

    shown = Math.min(shown, cards.length);
    set(grid.dataset, 'total', String(cards.length));
    cards.forEach((card, i) => card.classList.toggle('is-beyond', i >= shown));

    let button = grid.nextElementSibling;
    if (!button || !button.classList.contains('lab-news-more')) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'lab-news-more';
      button.addEventListener('click', () => {
        shown += STEP;
        paint();
      });
      grid.after(button);
    }

    set(button, 'textContent', `더 보기 (${cards.length - shown})`);
    set(button, 'hidden', shown >= cards.length);
  };

  const afterHydration = (run) => {
    const go = () =>
      window.requestIdleCallback
        ? requestIdleCallback(run, { timeout: 2000 })
        : setTimeout(run, 1200);
    document.readyState === 'complete'
      ? go()
      : window.addEventListener('load', go, { once: true });
  };

  afterHydration(() => {
    paint();
    new MutationObserver(paint).observe(document.body, { childList: true, subtree: true });
  });
})();
