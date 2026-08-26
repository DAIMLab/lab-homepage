/* Hides the Lab News tail behind a 더 보기 button; CSS makes the first cut
   until data-total hands it to .is-beyond. Loaded by code/lab-news.html; on a
   client-side entry it never runs, so the tail stays hidden until a reload. */

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
