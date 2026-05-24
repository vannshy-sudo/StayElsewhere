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
      if (i === current) {
        dots[i].classList.add('carousel-dot--active');
      } else {
        dots[i].classList.remove('carousel-dot--active');
      }
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

  update();
})();
