(function () {

  document.querySelectorAll('.place-card').forEach(function (card) {
    var imageEl = card.querySelector('.card-image');
    if (!imageEl) return;

    var photosRaw = imageEl.getAttribute('data-photos');
    if (!photosRaw) return;

    var photos;
    try { photos = JSON.parse(photosRaw); } catch (e) { return; }
    if (!photos || photos.length <= 1) return;

    var current = 0;
    var prevBtn = card.querySelector('.card-arrow-prev');
    var nextBtn = card.querySelector('.card-arrow-next');

    function goTo(index) {
      current = (index + photos.length) % photos.length;
      imageEl.style.backgroundImage = "url('" + photos[current] + "')";
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        goTo(current - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        goTo(current + 1);
      });
    }

    // Touch swipe
    var touchStartX = 0;
    imageEl.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    imageEl.addEventListener('touchend', function (e) {
      var diff = e.changedTouches[0].clientX - touchStartX;
      if (diff > 40) {
        e.preventDefault();
        goTo(current - 1);
      } else if (diff < -40) {
        e.preventDefault();
        goTo(current + 1);
      }
    });

  });

})();
