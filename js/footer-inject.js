/* Footer band injector. Super Code editor > Head tab (site-wide), in <script>.

   Clones the blue callout from /footer, a same-origin page Super server-renders,
   onto every other page. Notion is unreadable from the browser: no CORS headers,
   and the API needs a secret. Costs and caveats: docs/super.md. */

(() => {
  const SOURCE = '/footer';
  const BAND = '.notion-callout.bg-blue-light';

  const fetched = fetch(SOURCE)
    .then((res) => res.text())
    .then((html) =>
      new DOMParser().parseFromString(html, 'text/html').querySelector(BAND))
    .catch(() => null);

  const ready = (run) =>
    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', run, { once: true })
      : run();

  ready(() =>
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
