/* Cuts Joined to YYYY/MM on /team-daim; Notion has no year-month format. The
   .page__team-daim scope is load-bearing: head scripts survive client-side
   navigation (docs/super.md). Loaded by code/team-daim.html. */

(() => {
  const run = () =>
    document.querySelectorAll('.page__team-daim .notion-property__date .date')
      .forEach((el) => {
        const next = el.textContent.replace(/(\d{4}\/\d{2})\/\d{2}/, '$1');
        if (next !== el.textContent) el.textContent = next;
      });

  run();
  new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
})();
