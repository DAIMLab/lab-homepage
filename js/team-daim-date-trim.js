/* People, /team-daim. Joined renders as YYYY/MM/DD and Notion has no
   year-month format to pick (the Projects trap), so the day is cut here.
   The .page__team-daim scope is load-bearing, not decoration: Super navigates
   client-side, a per-page head script stays alive on the next page, and an
   unscoped trim would eat the day off Projects' Period dates before
   js/projects-date-format.js can match them. Head- and defer-safe: the
   observer hangs off documentElement. */

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
