/* A line-clamped card property loses the end of its text to an ellipsis, and
   CSS cannot read a text node back out to show it. This mirrors the full text
   into data-clamped on the card, where a stylesheet can draw it with attr()
   on hover, and removes it again once the text fits. Which property is clamped
   is the stylesheet's business: this reads the computed clamp rather than
   naming a property, so a design change needs no edit here.

   Site-wide and guarded by page, a head script outliving its page while a
   client-side entry skips per-page scripts (docs/super.md). code/global.html. */

(() => {
  const SCOPE = '.page__people .notion-collection-card';

  const run = () =>
    document.querySelectorAll(SCOPE).forEach((card) => {
      const clamped = [...card.querySelectorAll('.notion-property')].find(
        (el) => getComputedStyle(el).webkitLineClamp !== 'none'
      );
      /* one device pixel of slack: a fractional line box reports a scrollHeight
         a hair over its client height with nothing actually cut off */
      const cut = clamped && clamped.scrollHeight > clamped.clientHeight + 1;
      const full = cut ? clamped.textContent.trim() : '';

      if (full) {
        if (card.dataset.clamped !== full) card.dataset.clamped = full;
      } else if ('clamped' in card.dataset) {
        delete card.dataset.clamped;
      }
    });

  /* The clamp bites at a different word on every column count, so a resize is
     as much a trigger as a mutation. Both coalesce into one frame: run() reads
     layout on every card, and the observer fires in bursts through hydration */
  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      run();
    });
  };

  schedule();
  addEventListener('resize', schedule);
  /* childList only: the writes above are attributes, so they cannot re-enter */
  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
