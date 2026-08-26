/* Footer band injector. Loaded by code/site.html through a pinned jsDelivr
   <script src defer>, not pasted.

   Clones the blue callout from /footer, a same-origin page Super server-renders;
   Notion itself is unreadable from the browser. Appending before React hydrates
   throws #418, so the first placement waits for an idle frame. docs/super.md. */

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
