#!/usr/bin/env python3
"""Keep the shared header and footer identical on every page.

The site has no build step, so each .html file carries its own copy of the
header and footer. Edit the HEADER / FOOTER templates below (this is the one
place to change navigation), then run from the repo root:

    python tools/sync_chrome.py

It rewrites <header class="site-header"> and <footer class="site-footer"> in
every top-level .html file and marks the current nav item for each page.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Pages that count as "Services" for highlighting the nav item.
SERVICE_PAGES = {"services.html", "cybersecurity.html", "managed-it-support.html", "backup-recovery.html"}
NAV_SECTION = {
    **{p: "services" for p in SERVICE_PAGES},
    "who-we-serve.html": "industries",
    "about.html": "about",
    "contact.html": "contact",
}

NAV = [
    # key, label, href  (href None = coming soon)
    ("services", "Services", "services.html"),
    ("industries", "Industries", "who-we-serve.html"),
    ("about", "About", "about.html"),
    ("blog", "Blog", None),
    ("contact", "Contact", "contact.html"),
]

FOOTER_COLUMNS = [
    ("Services", [
        ("Managed IT Support", "managed-it-support.html"),
        ("Cybersecurity", "cybersecurity.html"),
        ("Backup &amp; Recovery", "backup-recovery.html"),
        ("Cloud Computing", None),
        ("Computer Networking", None),
        ("IT Consulting", None),
    ]),
    ("Industries", [
        ("Manufacturing &amp; Construction", "who-we-serve.html#manufacturing"),
        ("Lumber And Wood Products", "who-we-serve.html#lumber"),
        ("Nonprofits &amp; Foundations", "who-we-serve.html#nonprofits"),
        ("Camps", "who-we-serve.html#camps"),
    ]),
    ("Resources", [
        ("About", "about.html"),
        ("Blog", None),
        ("Contact", "contact.html"),
        ("Privacy Policy", None),
    ]),
]


def header(page):
    current = NAV_SECTION.get(page)
    items = []
    for key, label, href in NAV:
        if href is None:
            items.append(f'        <span class="coming-soon" title="Coming soon">{label}</span>')
        elif key == current:
            items.append(f'        <a href="{href}" aria-current="page">{label}</a>')
        else:
            items.append(f'        <a href="{href}">{label}</a>')
    nav = "\n".join(items)
    return f'''<header class="site-header">
    <div class="site-header__inner">
      <a class="brand" href="index.html" aria-label="Vital Technology Solutions home">
        <img src="images/logo-mark.png" alt="" width="113" height="46">
        <span class="brand__name"><span>Vital Technology</span><span>Solutions</span></span>
      </a>
      <nav class="site-nav" id="site-nav" aria-label="Main">
{nav}
      </nav>
      <div class="site-header__actions">
        <a class="site-header__phone" href="tel:501-904-8080">501-904-8080</a>
        <a class="site-header__cta" href="contact.html">Schedule A Call</a>
        <button class="nav-toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu"><span></span></button>
      </div>
    </div>
  </header>'''


def footer():
    cols = []
    for heading, links in FOOTER_COLUMNS:
        rows = []
        for label, href in links:
            rows.append(f'          <a href="{href}">{label}</a>' if href else f'          <span class="coming-soon">{label}</span>')
        cols.append(f'        <div class="footer-column">\n          <h2 class="footer-heading">{heading}</h2>\n' + "\n".join(rows) + "\n        </div>")
    cols = "\n".join(cols)
    return f'''<footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__grid">
        <div class="site-footer__contact">
          <img class="site-footer__logo" src="images/logo-full.png" alt="Vital Technology Solutions" width="140" height="52" loading="lazy">
          <h2 class="footer-heading">Get In Touch</h2>
          <address class="site-footer__address">1306 Military Rd STE 7<br>Benton, Arkansas 72015 United States</address>
          <div class="site-footer__links"><a href="tel:501-904-8080">501-904-8080</a><a href="mailto:info@vtslr.com">info@vtslr.com</a></div>
        </div>
{cols}
      </div>
      <div class="site-footer__bottom"><span>Copyright © 2026 Vital Technology Solutions</span><span>Benton, Arkansas</span></div>
    </div>
  </footer>'''


def main():
    for path in sorted(ROOT.glob("*.html")):
        text = path.read_text(encoding="utf-8")
        new = re.sub(r'<header class="site-header">.*?</header>', lambda m: header(path.name), text, flags=re.S)
        new = re.sub(r'<footer class="site-footer">.*?</footer>', lambda m: footer(), new, flags=re.S)
        if new != text:
            path.write_text(new, encoding="utf-8")
            print("updated", path.name)
        else:
            print("unchanged", path.name)


if __name__ == "__main__":
    main()
