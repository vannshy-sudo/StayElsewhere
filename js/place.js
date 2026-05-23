(function () {

  var params = new URLSearchParams(window.location.search);
  var slug   = params.get('id');
  var places = window.PLACES_DATA || [];
  var place  = places.find(function (p) { return p.slug === slug; });

  var content = document.getElementById('place-content');

  if (!place) {
    content.innerHTML = '<div style="padding:60px 20px;color:#888;font-family:sans-serif;">Place not found.</div>';
    return;
  }

  document.title = place.name + ' — Stay Elsewhere';

  initCarousel(place.photos);
  content.innerHTML = renderAll(place, places);

  // -------------------------------------------------------------------------
  // Carousel
  // -------------------------------------------------------------------------
  function initCarousel(photos) {
    var left    = document.getElementById('panel-left');
    var center  = document.getElementById('panel-center');
    var right   = document.getElementById('panel-right');
    var btnPrev = document.getElementById('btn-prev');
    var btnNext = document.getElementById('btn-next');
    var current = 0;

    function update() {
      var p = (current - 1 + photos.length) % photos.length;
      var n = (current + 1) % photos.length;
      left.style.backgroundImage   = "url('" + photos[p]       + "')";
      center.style.backgroundImage = "url('" + photos[current] + "')";
      right.style.backgroundImage  = "url('" + photos[n]       + "')";
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

    if (photos.length > 0) update();
  }

  // -------------------------------------------------------------------------
  // Render helpers
  // -------------------------------------------------------------------------
  function tag(t) {
    return '<span class="tag">' + t + '</span>';
  }

  function sectionLabel(text) {
    return '<p class="place-section-label">' + text + '</p>';
  }

  // -------------------------------------------------------------------------
  // Main render
  // -------------------------------------------------------------------------
  function renderAll(place, allPlaces) {
    return '<div class="place-container">' +
        renderPlaceHeader(place) +
        renderBody(place) +
      '</div>' +
      renderSimilar(place, allPlaces);
  }

  function renderPlaceHeader(place) {
    return '<div class="place-header">' +
      '<h1 class="place-name">' + place.name.toUpperCase() + '</h1>' +
      '<p class="place-location">' + place.location + '</p>' +
      '<div class="place-tags">' + place.tags.map(tag).join('') + '</div>' +
    '</div>';
  }

  // -------------------------------------------------------------------------
  // Two-column body
  // -------------------------------------------------------------------------
  function renderBody(place) {
    return '<div class="place-body">' +
      '<div class="left-col">' +
        renderWhy(place) +
        renderGettingThere(place) +
        renderAmenities(place) +
        renderActivities(place) +
      '</div>' +
      '<div class="right-col">' +
        renderSidebar(place) +
      '</div>' +
    '</div>';
  }

  function renderWhy(place) {
    return '<div class="place-section">' +
      sectionLabel('WHY I CHOSE THIS PLACE') +
      '<div class="why-box"><p>' + place.why + '</p></div>' +
    '</div>';
  }

  function renderGettingThere(place) {
    var gt  = place.getting_there;
    var src = 'https://maps.google.com/maps?q=' +
              place.coordinates.lat + ',' + place.coordinates.lng +
              '&z=10&output=embed';

    function row(icon, name, dist) {
      return '<div class="distance-row">' +
        '<span class="distance-icon"><i class="ti ' + icon + '"></i></span>' +
        '<span class="distance-name">' + name + '</span>' +
        '<span class="distance-time">' + dist + '</span>' +
      '</div>';
    }

    return '<div class="place-section">' +
      sectionLabel('GETTING THERE') +
      '<div class="getting-there-layout">' +
        '<div class="getting-there-distances">' +
          row('ti-plane-departure',    gt.airport.name, gt.airport.distance) +
          row('ti-building',           gt.town.name,    gt.town.distance) +
          row('ti-building-skyscraper', gt.city.name,   gt.city.distance) +
        '</div>' +
        '<iframe class="place-map" src="' + src + '" loading="lazy" allowfullscreen></iframe>' +
      '</div>' +
    '</div>';
  }

  function renderAmenities(place) {
    var items = place.amenities.map(function (a) {
      return '<div class="amenity-item">' +
        '<i class="ti ' + a.icon + '"></i>' +
        '<span>' + a.label + '</span>' +
      '</div>';
    }).join('');
    return '<div class="place-section">' +
      sectionLabel('AMENITIES') +
      '<div class="amenities-grid">' + items + '</div>' +
    '</div>';
  }

  function renderActivities(place) {
    var items = place.activities.map(function (a) {
      return '<div class="activity-item">' +
        '<span class="activity-dash">—</span>' +
        '<span>' + a + '</span>' +
      '</div>';
    }).join('');
    return '<div class="place-section">' +
      sectionLabel('ACTIVITIES NEARBY') +
      '<div class="activities-list">' + items + '</div>' +
    '</div>';
  }

  // -------------------------------------------------------------------------
  // Sidebar
  // -------------------------------------------------------------------------
  function renderSidebar(place) {
    var rows = [
      {label: 'TYPE',     value: place.type},
      {label: 'COUNTRY',  value: place.country},
      {label: 'REGION',   value: place.region},
      {label: 'SLEEPS',   value: place.sleeps},
      {label: 'INTERNET', value: place.internet},
      {label: 'LANGUAGE', value: place.language},
      {label: 'PETS',     value: place.pets}
    ].map(function (r) {
      return '<div class="info-row">' +
        '<span class="info-label">' + r.label + '</span>' +
        '<span class="info-value">' + r.value + '</span>' +
      '</div>';
    }).join('');

    var months   = ['J','F','M','A','M','J','J','A','S','O','N','D'];
    var tempCells = place.temps.map(function (c) {
      return '<div class="temp-cell" style="background:' + c + '"></div>';
    }).join('');
    var tempMons  = months.map(function (m) {
      return '<span>' + m + '</span>';
    }).join('');

    return '<div class="sidebar-card">' +
      '<p class="sidebar-title">PRACTICAL INFO</p>' +
      rows +
      '<div class="temp-section">' +
        '<p class="info-label" style="margin-bottom:4px;">TEMP &deg;C</p>' +
        '<div class="temp-bar">' + tempCells + '</div>' +
        '<div class="temp-months">' + tempMons + '</div>' +
      '</div>' +
      '<a href="' + place.listing_url + '" target="_blank" rel="noopener" class="cta-btn">VIEW ORIGINAL LISTING &rarr;</a>' +
    '</div>';
  }

  // -------------------------------------------------------------------------
  // Similar places
  // -------------------------------------------------------------------------
  function renderSimilar(place, allPlaces) {
    if (!place.similar || place.similar.length === 0) return '';

    var cards = place.similar.map(function (s) {
      var p = allPlaces.find(function (x) { return x.slug === s; });
      if (!p) return '';
      return '<a href="place.html?id=' + p.slug + '" class="similar-card">' +
        '<div class="similar-image" style="background-image:url(\'' + p.cover + '\')"></div>' +
        '<p class="similar-name">' + p.name.toUpperCase() + '</p>' +
        '<p class="similar-location">' + p.location + '</p>' +
      '</a>';
    }).join('');

    return '<section class="similar-section">' +
      '<div class="place-container">' +
        sectionLabel('SIMILAR PLACES') +
        '<div class="similar-grid">' + cards + '</div>' +
      '</div>' +
    '</section>';
  }

})();
