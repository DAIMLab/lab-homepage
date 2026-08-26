/* Hero video autoplay: no browser honours it without muted, and hydration
   reloads the source, so playback is re-asserted on every mutation tick.
   Scoped .page__index; loaded by code/home.html. docs/super.md. */

(function () {
  var HERO = '.page__index .notion-root > .notion-callout.bg-gray-light';

  function play(video) {
    if (!video.paused) return;
    var started = video.play();
    if (started && started.catch) {
      started.catch(function (err) {
        if (video.dataset.daimWarned) return;
        video.dataset.daimWarned = '1';
        console.warn('[daim] hero video did not start:', err.name, err.message);
      });
    }
  }

  function fix(video) {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    if (video.controls) {
      video.controls = false;
      video.removeAttribute('controls');
    }
    if (!video.dataset.daimHero) {
      video.dataset.daimHero = '1';
      video.preload = 'auto';
      video.addEventListener('canplay', function () { play(video); });
      video.addEventListener('loadeddata', function () { play(video); });
    }
    play(video);
  }

  function scan() {
    document.querySelectorAll(HERO + ' video').forEach(fix);
  }

  scan();
  new MutationObserver(scan).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
