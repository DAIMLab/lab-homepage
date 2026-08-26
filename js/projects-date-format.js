/* Rewrites Period, 2018/03/01 → 2025/01/01, into 2018.03 – 2025.01: Notion
   has no year-month format and CSS cannot cut text. Head-safe observer.
   Loaded by code/projects.html; why not a formula: docs/super.md. */

(() => {
  const shorten = (text) =>
    text
      .replace(/(\d{4})\/(\d{2})\/\d{2}/g, '$1.$2')
      .replace(/\s*→\s*/, ' – ');

  const run = () =>
    document.querySelectorAll('.page__projects .property-475c4c48 .date')
      .forEach((el) => {
        const next = shorten(el.textContent);
        if (next !== el.textContent) el.textContent = next;
      });

  run();
  new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
})();
