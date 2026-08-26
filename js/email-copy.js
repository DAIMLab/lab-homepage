/* Generic: any .notion-property__email on any page, no page scoping on
   purpose. Notion renders the property as plain text with no anchor; a click
   copies the address, and `copied` is held for a moment for the page's CSS to
   style. The observer mirrors the address into data-email so CSS can show it
   (a tooltip via attr()); it survives Super's hydration and client-side
   navigation. Reuse on another page by linking this same pinned URL from that
   page's Head tab. */

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
