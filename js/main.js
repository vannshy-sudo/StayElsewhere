(function () {
  var photos = window.CAROUSEL_PHOTOS || [];
  if (photos.length === 0) return;

  var panelLeft   = document.getElementById('panel-left');
  var panelCenter = document.getElementById('panel-center');
  var panelRight  = document.getElementById('panel-right');
  var btnPrev     = document.getElementById('btn-prev');
  var btnNext     = document.getElementById('btn-next');
  var dots        = document.querySelectorAll('.carousel-dot');

  var current = 0;

  function updateDots() {
    for (var i = 0; i < dots.length; i++) {
      if (i === current) dots[i].classList.add('carousel-dot--active');
      else dots[i].classList.remove('carousel-dot--active');
    }
  }

  function update() {
    var prev = (current - 1 + photos.length) % photos.length;
    var next = (current + 1) % photos.length;
    panelLeft.style.backgroundImage   = "url('" + photos[prev]    + "')";
    panelCenter.style.backgroundImage = "url('" + photos[current] + "')";
    panelRight.style.backgroundImage  = "url('" + photos[next]    + "')";
    updateDots();
  }

  btnPrev.addEventListener('click', function () {
    current = (current - 1 + photos.length) % photos.length;
    update();
  });

  btnNext.addEventListener('click', function () {
    current = (current + 1) % photos.length;
    update();
  });

  if (photos.length <= 1) {
    btnPrev.style.display = 'none';
    btnNext.style.display = 'none';
  }

  // Touch swipe
  var touchStartX = 0;
  var carouselEl = document.querySelector('.carousel');
  if (carouselEl) {
    carouselEl.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    carouselEl.addEventListener('touchend', function (e) {
      var diff = e.changedTouches[0].clientX - touchStartX;
      if (diff > 40) {
        current = (current - 1 + photos.length) % photos.length;
        update();
      } else if (diff < -40) {
        current = (current + 1) % photos.length;
        update();
      }
    });
  }

  update();
})();

// Hamburger menu toggle — runs on all pages
(function () {
  var btn      = document.querySelector('.hamburger-btn');
  var dropdown = document.getElementById('mobile-nav');
  if (!btn || !dropdown) return;

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    dropdown.classList.toggle('is-open');
  });

  var links = dropdown.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function () {
      dropdown.classList.remove('is-open');
    });
  }

  document.addEventListener('click', function () {
    dropdown.classList.remove('is-open');
  });
})();
