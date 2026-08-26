/* People, /team-daim. Loaded by js/team-daim-head.html through a pinned
   jsDelivr <script src defer>, not pasted. Email click-to-copy, the
   data-email tooltip mirror, and the Joined year-month trim (Notion has no
   year-month format, the Projects trap). Head- and defer-safe: the observer
   hangs off documentElement, and the sweeps no-op until the cards exist. */

document.addEventListener('click', (e) => {
  const email = e.target.closest('.page__team-daim .notion-property__email');
  if (!email) return;
  const address = email.textContent.trim();
  if (!address) return;
  navigator.clipboard.writeText(address).then(() => {
    email.classList.add('copied');
    clearTimeout(email._copiedTimer);
    email._copiedTimer = setTimeout(() => email.classList.remove('copied'), 1400);
  });
});

(() => {
  const run = () => {
    document.querySelectorAll('.page__team-daim .notion-property__date .date')
      .forEach((el) => {
        const next = el.textContent.replace(/(\d{4}\/\d{2})\/\d{2}/, '$1');
        if (next !== el.textContent) el.textContent = next;
      });
    document.querySelectorAll('.page__team-daim .notion-property__email:not([data-email])')
      .forEach((el) => {
        const address = el.textContent.trim();
        if (address) el.dataset.email = address;
      });
  };

  run();
  new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
})();
