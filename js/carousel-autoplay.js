/* Autoplay for Super's Gallery Carousel snippet, People hero only: every few
   seconds that carousel's next arrow is clicked, unless the pointer sits on it
   or the tab is hidden. The About page runs the same snippet over slide decks,
   which need reading time, so the selector pins the page. Loaded by
   code/global.html. */

(() => {
  const EVERY = 5000;

  setInterval(() => {
    if (document.hidden) return;
    document.querySelectorAll(
      '.page__people .notion-callout.bg-brown-light .notion-collection-gallery[data-carousel-initialized="true"]',
    ).forEach((gallery) => {
      if (gallery.matches(':hover')) return;
      gallery.querySelector('.carousel-button.right')?.click();
    });
  }, EVERY);
})();
