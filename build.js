// build.js — StayElsewhere
// Reads data/places.json and generates index.html
// Usage: node build.js

const fs   = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Load data
// ---------------------------------------------------------------------------
const places = JSON.parse(fs.readFileSync('./data/places.json', 'utf8'));

if (places.length === 0) {
  console.error('No places found in data/places.json');
  process.exit(1);
}

const featured   = places[0];
const morePlaces = places.slice(1);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function tags(list) {
  return list.map(t => `<span class="tag">${t}</span>`).join('');
}

function card(place) {
  return `
      <a href="place.html?id=${place.slug}" class="place-card">
        <div class="card-image" style="background-image: url('${place.cover}')">
          <span class="card-type">${place.type.toUpperCase()}</span>
        </div>
        <div class="card-info">
          <p class="card-name">${place.name.toUpperCase()}</p>
          <p class="card-location">${place.location}</p>
          <div class="card-tags">${tags(place.tags)}</div>
        </div>
      </a>`.trim();
}

// ---------------------------------------------------------------------------
// Template
// ---------------------------------------------------------------------------
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stay Elsewhere — Calm places, far from the crowd</title>
  <meta name="description" content="A curated collection of calm, slow places to live differently.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400&family=Outfit:wght@300;400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <header class="site-header">
    <a href="index.html" class="logo-block">
      <span class="logo"><span class="logo-stay">STAY</span> <span class="logo-elsewhere">ELSEWHERE</span></span>
      <span class="logo-tagline">Sharing ideas on where to travel next.<br>A collection of calm, slow places to live differently.</span>
    </a>
    <nav class="site-nav">
      <a href="browse.html">BROWSE</a>
      <a href="about.html">ABOUT</a>
    </nav>
    <button class="mobile-menu-btn" aria-label="Menu">&#9776;</button>
  </header>

  <section class="carousel-section">
    <div class="carousel">
      <a href="place.html?id=${featured.slug}" class="carousel-panel panel-left"  id="panel-left"></a>
      <div class="carousel-gap">
        <button class="carousel-btn" id="btn-prev">&#8249;</button>
      </div>
      <a href="place.html?id=${featured.slug}" class="carousel-panel panel-center" id="panel-center"></a>
      <div class="carousel-gap">
        <button class="carousel-btn" id="btn-next">&#8250;</button>
      </div>
      <a href="place.html?id=${featured.slug}" class="carousel-panel panel-right" id="panel-right"></a>
    </div>
  </section>

  <div class="page-body">

    <section class="featured-section">
      <p class="section-label">LATEST PLACE</p>
      <div class="featured-content">
        <div class="featured-left">
          <a href="place.html?id=${featured.slug}" class="featured-name">${featured.name.toUpperCase()}</a>
          <p class="featured-location">${featured.location}</p>
          <div class="featured-tags">${tags(featured.tags)}</div>
        </div>
        <div class="featured-right">
          <p class="featured-description">${featured.description}</p>
        </div>
      </div>
    </section>

    <section class="more-section">
      <p class="section-label">MORE PLACES</p>
      <div class="places-grid">
        ${morePlaces.map(card).join('\n        ')}
      </div>
    </section>

  </div><!-- /.page-body -->

  <footer class="site-footer">
    <p class="footer-logo"><span class="logo-stay">STAY</span> <span class="logo-elsewhere">ELSEWHERE</span></p>
    <p class="footer-tagline">A collection of calm, slow places to live differently.</p>
  </footer>

  <script>
    window.CAROUSEL_PHOTOS = ${JSON.stringify(featured.photos)};
  </script>
  <script src="js/main.js"></script>

</body>
</html>`;

// ---------------------------------------------------------------------------
// Write output
// ---------------------------------------------------------------------------
fs.writeFileSync('./index.html', html, 'utf8');

console.log('');
console.log('✓ index.html built successfully');
console.log('  Featured : ' + featured.name + ' (' + featured.location + ')');
console.log('  More     : ' + morePlaces.map(p => p.name).join(', '));
console.log('');
