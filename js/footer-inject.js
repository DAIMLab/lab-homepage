/* Footer band injector. Super Code editor > Head tab (site-wide), wrapped in <script>.

   The band is one Notion callout that lives on a single page, /footer, instead of
   a synced reference pasted onto all five site pages. Super server-renders every
   page, so /footer is a same-origin document that already holds the band's real
   markup; this fetches it once and clones the node into whichever page the
   visitor is on.

   Reading Notion directly is not an option: app.notion.com sends no CORS headers,
   and the Notion API needs a secret that cannot sit in client-side JS. The only
   readable copy of the block is the one Super already published.

   Three consequences, all accepted:
     - the band is absent from the served HTML, so crawlers miss it on every page
       but /footer. Footer links carry little SEO weight and the band sits below
       the fold, so nothing visible shifts.
     - /footer must stay published. Exclude it from the sitemap under Site Pages;
       hiding it via the 404 setting would break this fetch.
     - JS off means no band. Super's own footer is the fallback there, and it is
       switched off, so the page simply ends after its content.

   Selector convention matches css/footer.css: a top-level blue callout IS the
   footer band. Give ordinary callouts another colour.
*/

(() => {
  const SOURCE = '/footer';
  const BAND = '.notion-callout.bg-blue-light';

  const parse = (html) =>
    new DOMParser().parseFromString(html, 'text/html').querySelector(BAND);

  /* Start the request before the DOM is ready; the Head tab runs in <head>, so
     document.body does not exist yet and the network round trip is free time. */
  const fetched = fetch(SOURCE)
    .then((res) => res.text())
    .then(parse)
    .catch(() => null);   /* offline, or /footer lost its callout: leave pages alone */

  const ready = (run) =>
    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', run, { once: true })
      : run();

  ready(() => {
    fetched.then((band) => {
      if (!band) return;
      const markup = band.outerHTML;

      /* .notion-root, not body: css/footer.css matches `.notion-root > BAND`,
         and the full-bleed trick measures from the content column's origin.
         The guard also covers /footer itself, where the band is already there. */
      const place = () => {
        const root = document.querySelector('.notion-root');
        if (!root || root.querySelector(`:scope > ${BAND}`)) return;
        root.appendChild(parse(markup));
      };

      place();

      /* Super routes between pages on the client, so React swaps .notion-root
         out without a reload. Re-place on mutation, coalesced to one frame so a
         busy render does not run the query hundreds of times. */
      let queued = false;
      new MutationObserver(() => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          place();
        });
      }).observe(document.body, { childList: true, subtree: true });
    });
  });
})();
