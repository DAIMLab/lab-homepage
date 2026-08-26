/* Site-wide: external links leave in a new tab. Deliberately generic, like
   js/email-copy.js: any anchor whose host differs from the site's gets
   target="_blank" and rel="noopener", so media cards, member icons, and
   footer links all behave alike. Relative internal links and mailto:/tel:
   anchors carry no http host and are left alone. Setting target removes the
   anchor from the selector, so the observer cannot loop. code/global.html. */

(() => {
  const run = () => {
    document.querySelectorAll('a[href^="http"]:not([target])').forEach((a) => {
      if (a.host === location.host) return;
      a.target = '_blank';
      a.rel = 'noopener';
    });
  };

  run();
  new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
})();
