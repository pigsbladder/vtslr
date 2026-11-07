# Vital Technology Solutions website

Static site with no build step: plain HTML, CSS, and JavaScript, hosted on GitHub Pages.

```
index.html               Home
about.html               About
services.html            Services hub
cybersecurity.html       Cybersecurity
managed-it-support.html  Managed IT Support
backup-recovery.html     Backup & Disaster Recovery
who-we-serve.html        Industries (anchored sections)
contact.html             Contact (preview form: opens email app)
css/styles.css           All styles
js/main.js               Navigation, scroll animations, home rotator, contact form
js/arkansas-network.js   Animated Arkansas map (<ar-network>)
js/layered-defense.js    Animated security diagram (<layered-defense>)
images/                  Optimized images
tools/sync_chrome.py     Rewrites the shared header/footer on every page
audit/                   Audit of the live vtslr.com (AUDIT.md, inventory.csv)
_design-source/          Original Claude Design handoff files
PROJECT-NOTES.md         Start here: history, decisions, next steps
```

Header and footer are duplicated per page. To change navigation, edit
`tools/sync_chrome.py` and run `python tools/sync_chrome.py`.

## Preview locally

```
python -m http.server 8000
```

Then open http://localhost:8000.

## Before launching on a real domain

Remove `<meta name="robots" content="noindex">` from each page. It keeps this preview out of search results.
