/* Site-wide date reformatting; Notion has no year-month date format. Each rule
   guards itself by page scope: a head script outlives its page, while a
   client-side entry skips per-page scripts (docs/super.md). code/global.html. */

(() => {
  const RULES = [
    /* People: Joined 2022/03/01 -> 2022/03 */
    { sel: '.page__people .notion-property__date .date',
      fix: (t) => t.replace(/(\d{4}\/\d{2})\/\d{2}/, '$1') },
    /* Projects: Period 2018/03/01 → 2025/01/01 -> 2018.03 – 2025.01 */
    { sel: '.page__projects .property-475c4c48 .date',
      fix: (t) => t.replace(/(\d{4})\/(\d{2})\/\d{2}/g, '$1.$2').replace(/\s*→\s*/, ' – ') },
  ];

  const run = () =>
    RULES.forEach(({ sel, fix }) =>
      document.querySelectorAll(sel).forEach((el) => {
        const next = fix(el.textContent);
        if (next !== el.textContent) el.textContent = next;
      }));

  run();
  new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
})();
