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

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        current = (current - 1 + photos.length) % photos.length;
        imageEl.style.backgroundImage = "url('" + photos[current] + "')";
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        current = (current + 1) % photos.length;
        imageEl.style.backgroundImage = "url('" + photos[current] + "')";
      });
    }
  });

})();
