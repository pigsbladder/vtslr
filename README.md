# Vital Technology Solutions website

Static site with no build step: plain HTML, CSS, and JavaScript, hosted on GitHub Pages.

```
index.html            Home
about.html            About
cybersecurity.html    Cybersecurity service page
css/styles.css        All styles
js/main.js            Navigation, scroll animations, home page rotator
js/arkansas-network.js  Animated Arkansas map (<ar-network>)
js/layered-defense.js   Animated security diagram (<layered-defense>)
images/               Optimized images
```

## Preview locally

```
python -m http.server 8000
```

Then open http://localhost:8000.

## Before launching on a real domain

Remove `<meta name="robots" content="noindex">` from each page. It keeps this preview out of search results.
