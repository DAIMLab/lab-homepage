/* Projects date shortener. Super Code editor > Body tab (Projects page), in <script>.

   Notion emits the Period range as 2018/03/01 → 2025/01/01 and has no year-month
   format to pick; CSS cannot cut text, so this rewrites it to 2018.03 – 2025.01.
   Re-runs under an observer because Super swaps .notion-root on client-side
   navigation. Why not a text property: docs/super.md, "Projects Page". */

(() => {
  const SELECTOR = '.page__projects .property-475c4c48 .date';

  const shorten = (text) =>
    text
      .replace(/(\d{4})\/(\d{2})\/\d{2}/g, '$1.$2')
      .replace(/\s*→\s*/, ' – ');

  const run = () =>
    document.querySelectorAll(SELECTOR).forEach((el) => {
      const next = shorten(el.textContent);
      if (next !== el.textContent) el.textContent = next;
    });

  let queued = false;
  run();
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      run();
    });
  }).observe(document.body, { childList: true, subtree: true });
})();
