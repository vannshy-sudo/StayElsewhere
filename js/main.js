(function () {
  var photos = window.CAROUSEL_PHOTOS || [];
  if (photos.length === 0) return;

  var panelLeft   = document.getElementById('panel-left');
  var panelCenter = document.getElementById('panel-center');
  var panelRight  = document.getElementById('panel-right');
  var btnPrev     = document.getElementById('btn-prev');
  var btnNext     = document.getElementById('btn-next');

  var current = 0;

  function update() {
    var prev = (current - 1 + photos.length) % photos.length;
    var next = (current + 1) % photos.length;
    panelLeft.style.backgroundImage   = "url('" + photos[prev]    + "')";
    panelCenter.style.backgroundImage = "url('" + photos[current] + "')";
    panelRight.style.backgroundImage  = "url('" + photos[next]    + "')";
  }

  btnPrev.addEventListener('click', function () {
    current = (current - 1 + photos.length) % photos.length;
    update();
  });

  btnNext.addEventListener('click', function () {
    current = (current + 1) % photos.length;
    update();
  });

  // Hide controls if only one photo
  if (photos.length <= 1) {
    btnPrev.style.display = 'none';
    btnNext.style.display = 'none';
  }

  update();
})();
