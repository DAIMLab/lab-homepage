/* Footer band injector. Super Code editor > Head tab (site-wide), wrapped in <script>.

   The band is one Notion callout living on /footer alone. Super server-renders every
   page, so /footer is a same-origin document that already holds the band's markup:
   fetch it once, clone the node onto whatever page the visitor is on. Reading Notion
   directly is impossible, since app.notion.com sends no CORS headers and the API
   needs a secret that cannot sit in client-side JS.

   Two things this depends on. /footer stays published and out of the sitemap; the
   404 setting would break the fetch. And a top-level blue callout IS the footer
   band, the convention css/footer.css also relies on, so ordinary callouts need
   another colour.

   Rationale, measured costs, and what it gives up: docs/super.md, "Site-Wide Footer".
*/

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
