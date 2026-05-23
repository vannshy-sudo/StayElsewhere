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

function browseCard(place) {
  const photosAttr = JSON.stringify(place.photos).replace(/"/g, '&quot;');
  const arrows = place.photos.length > 1
    ? `<div class="card-arrows">
          <button class="card-arrow card-arrow-prev">&#8249;</button>
          <button class="card-arrow card-arrow-next">&#8250;</button>
        </div>`
    : '';
  return `<a href="place.html?id=${place.slug}" class="place-card">
      <div class="card-image" style="background-image: url('${place.cover}')" data-photos="${photosAttr}">
        <span class="card-type">${place.type.toUpperCase()}</span>
        ${arrows}
      </div>
      <div class="card-info">
        <p class="card-name">${place.name.toUpperCase()}</p>
        <p class="card-location">${place.location}</p>
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
      <p class="section-label">LATEST PLACES</p>
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

// ---------------------------------------------------------------------------
// Generate place.html
// ---------------------------------------------------------------------------
const placeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stay Elsewhere</title>
  <meta name="description" content="A curated slow travel place on Stay Elsewhere.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400&family=Outfit:wght@300;400;500&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.47.0/tabler-icons.min.css" rel="stylesheet">
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
  </header>

  <div class="back-bar">
    <div class="place-container">
      <a href="browse.html" class="back-link">&#8592; All places</a>
    </div>
  </div>

  <section class="carousel-section">
    <div class="carousel">
      <div class="carousel-panel panel-left"  id="panel-left"></div>
      <div class="carousel-gap">
        <button class="carousel-btn" id="btn-prev">&#8249;</button>
      </div>
      <div class="carousel-panel panel-center" id="panel-center"></div>
      <div class="carousel-gap">
        <button class="carousel-btn" id="btn-next">&#8250;</button>
      </div>
      <div class="carousel-panel panel-right" id="panel-right"></div>
    </div>
  </section>

  <main id="place-content"></main>

  <script>
    window.PLACES_DATA = ${JSON.stringify(places)};
  </script>
  <script src="js/place.js"></script>

</body>
</html>`;

fs.writeFileSync('./place.html', placeHtml, 'utf8');

console.log('✓ place.html built successfully');
console.log('  Places embedded: ' + places.length);
console.log('');

// ---------------------------------------------------------------------------
// Generate about.html
// ---------------------------------------------------------------------------
const aboutHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About — Stay Elsewhere</title>
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
  </header>

  <div class="place-container about-page">

    <p class="about-label">ABOUT</p>

    <div class="about-text">
      <p>StayElsewhere is a curated collection of places to stay — chosen for calm, nature and a slower pace of life, far from the crowd.</p>
      <p>This is not a booking platform. I made this website for the sole purpose of helping people find their next destination.</p>
    </div>

    <hr class="about-divider">

    <p class="about-label">CONTACT</p>

    <div class="contact-text">
      <p>Questions, suggestions, or just found a place that should be here:<br>
      <a href="mailto:stayelsewhere.blog@gmail.com" class="contact-link">stayelsewhere.blog@gmail.com</a></p>
      <p>Instagram: <a href="https://instagram.com/stayelsewhere.blog" class="contact-link" target="_blank" rel="noopener">@stayelsewhere.blog</a></p>
    </div>

  </div>

  <footer class="site-footer">
    <p class="footer-logo"><span class="logo-stay">STAY</span> <span class="logo-elsewhere">ELSEWHERE</span></p>
    <p class="footer-tagline">A collection of calm, slow places to live differently.</p>
  </footer>

</body>
</html>`;

fs.writeFileSync('./about.html', aboutHtml, 'utf8');

console.log('✓ about.html built successfully');
console.log('');

// ---------------------------------------------------------------------------
// Generate browse.html
// ---------------------------------------------------------------------------
const browseHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Places — Stay Elsewhere</title>
  <meta name="description" content="All places on Stay Elsewhere — curated for calm, nature and a slower pace.">
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
  </header>

  <div class="place-container browse-page">

    <h1 class="browse-heading">ALL PLACES</h1>

    <div class="browse-grid">
      ${places.map(browseCard).join('\n      ')}
    </div>

  </div>

  <footer class="site-footer">
    <p class="footer-logo"><span class="logo-stay">STAY</span> <span class="logo-elsewhere">ELSEWHERE</span></p>
    <p class="footer-tagline">A collection of calm, slow places to live differently.</p>
  </footer>

  <script src="js/browse.js"></script>

</body>
</html>`;

fs.writeFileSync('./browse.html', browseHtml, 'utf8');

console.log('✓ browse.html built successfully');
console.log('  Places: ' + places.length);
console.log('');
