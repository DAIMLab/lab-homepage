/* Clones the blue footer callout from /footer, a page Super server-renders.
   Appending before React hydrates throws #418, so placement waits for an idle
   frame. Loaded by code/global.html; docs/super.md, "Site-Wide Footer". */

(() => {
  const SOURCE = '/footer';
  const BAND = '.notion-callout.bg-blue-light';

  const fetched = fetch(SOURCE)
    .then((res) => res.text())
    .then((html) =>
      new DOMParser().parseFromString(html, 'text/html').querySelector(BAND))
    .catch(() => null);

  const afterHydration = (run) => {
    const go = () =>
      window.requestIdleCallback
        ? requestIdleCallback(run, { timeout: 2000 })
        : setTimeout(run, 1200);
    document.readyState === 'complete'
      ? go()
      : window.addEventListener('load', go, { once: true });
  };

  afterHydration(() =>
    fetched.then((band) => {
      if (!band) return;

      const place = () => {
        const root = document.querySelector('.notion-root');
        if (root && !root.querySelector(`:scope > ${BAND}`)) {
          root.appendChild(document.importNode(band, true));
        }
      };

      let queued = false;
      place();
      new MutationObserver(() => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          place();
        });
      }).observe(document.body, { childList: true, subtree: true });
    }),
  );
})();
