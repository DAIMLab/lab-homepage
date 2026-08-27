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
    /* Professor media: Date 2023/06/20 or June 20, 2023 -> 2023.06 */
    { sel: '.page__people-professor .notion-property__date .date',
      fix: (t) => t
        .replace(/(\d{4})\/(\d{2})\/\d{2}/, '$1.$2')
        .replace(/^([A-Z][a-z]+) \d{1,2}, (\d{4})$/, (m, mon, y) => {
          const i = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ].indexOf(mon);
          return i < 0 ? m : `${y}.${String(i + 1).padStart(2, '0')}`;
        }) },
    /* Publications: year group header 2027 to 2028 -> 2027. Year is a number,
       and Notion groups numbers into ranges, so even an interval of 1 labels
       the bucket by both bounds. Keeps the text when no year is found. */
    { sel: '.page__publications .notion-collection-group__section-header .notion-property__number',
      fix: (t) => (t.match(/\d{4}/) || [t])[0] },
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
