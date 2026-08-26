/* Click-to-copy for any .notion-property__email, unscoped on purpose, plus a
   data-email mirror the page CSS shows as a tooltip. Survives hydration and
   client-side navigation. Loaded by code/site.html; docs/super.md. */

document.addEventListener('click', (e) => {
  const email = e.target.closest('.notion-property__email');
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
  const run = () =>
    document.querySelectorAll('.notion-property__email:not([data-email])')
      .forEach((el) => {
        const address = el.textContent.trim();
        if (address) el.dataset.email = address;
      });

  run();
  new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
})();
