/* Lightbox for page images and the deck carousels' cards. Super's stock
   lightbox.js builds its overlay at load; a Head-tab script runs before
   React hydration, which then discards the foreign node, so this script
   owns the whole flow instead: the overlay is built on first use and every
   click is delegated. Styling stays the stock snippet's lightbox.css
   (code/global.html). */

(() => {
  const ensureOverlay = () => {
    let overlay = document.getElementById('lightbox-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'lightbox-overlay';

    const view = document.createElement('img');
    view.id = 'lightbox-image';

    const close = document.createElement('button');
    close.id = 'lightbox-close';
    close.setAttribute('aria-label', 'Close');
    close.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">'
      + '<g fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="#fff" stroke-width="2" '
      + 'stroke-linecap="round" stroke-linejoin="round"/></g></svg>';

    const hide = () => {
      overlay.style.display = 'none';
      view.src = '';
    };

    close.addEventListener('click', hide);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) hide();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hide();
    });

    overlay.append(view, close);
    document.body.appendChild(overlay);
    return overlay;
  };

  const show = (src) => {
    const overlay = ensureOverlay();
    overlay.querySelector('#lightbox-image').src = src;
    overlay.style.display = 'flex';
  };

  document.addEventListener(
    'click',
    (e) => {
      /* A carousel card opens its slide instead of navigating to the row's
         page; the spr.so resize suffix swaps for /public so the overlay
         gets the full image. The capture phase beats the card's own link. */
      const card = e.target.closest(
        '.notion-callout.bg-brown-light .notion-collection-card',
      );
      if (card) {
        const img = card.querySelector('img');
        if (!img) return;
        e.preventDefault();
        e.stopPropagation();
        const src = img.currentSrc || img.src;
        show(src.replace(/\/w=\d+[^/]*$/, '/public'));
        return;
      }

      /* Any plain page image zooms; one wrapped in a link (Super's
         caption-link feature) keeps its link instead */
      const hit = e.target.closest('.notion-image img');
      if (hit && !hit.closest('a')) {
        e.stopPropagation();
        show(hit.currentSrc || hit.src);
      }
    },
    true,
  );
})();
