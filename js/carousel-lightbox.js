/* Lightbox for the Gallery Carousel snippet's cards: clicking a slide opens
   it zoomed instead of navigating to its Notion row. Rides Super's Image
   Lightbox snippet (code/global.html), whose stock script only covers
   .notion-image; the capture phase beats the card's own link. The spr.so
   resize suffix swaps for /public so the overlay gets the full image. */

(() => {
  document.addEventListener(
    'click',
    (e) => {
      const card = e.target.closest(
        '.notion-callout.bg-brown-light .notion-collection-card',
      );
      if (!card) return;
      const img = card.querySelector('img');
      const overlay = document.getElementById('lightbox-overlay');
      const view = document.getElementById('lightbox-image');
      if (!img || !overlay || !view) return;
      e.preventDefault();
      e.stopPropagation();
      const src = img.currentSrc || img.src;
      view.src = src.replace(/\/w=\d+[^/]*$/, '/public');
      overlay.style.display = 'flex';
    },
    true,
  );
})();
