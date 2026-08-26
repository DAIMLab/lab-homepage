/* Autoplay for Super's Gallery Carousel snippet: every few seconds each
   initialized carousel's next arrow is clicked, unless the pointer sits on it
   or the tab is hidden. Generic on purpose; loaded by code/global.html. */

(() => {
  const EVERY = 5000;

  setInterval(() => {
    if (document.hidden) return;
    document.querySelectorAll(
      '.notion-callout.bg-brown-light .notion-collection-gallery[data-carousel-initialized="true"]',
    ).forEach((gallery) => {
      if (gallery.matches(':hover')) return;
      gallery.querySelector('.carousel-button.right')?.click();
    });
  }, EVERY);
})();
