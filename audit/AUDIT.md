# vtslr.com Site Audit

Crawled 2026-11-07 from the public sitemaps. Data: `inventory.csv` (per-URL), `urls.tsv`, `sm-*.xml`.

**Limits:** no Search Console, analytics or backlink data. Every keep/merge/cut call below is structural (overlap, thinness, nav placement) and should be checked against traffic before redirects go live. Page-similarity figures are word-set overlap on main content, not a plagiarism check.

## 1. Summary

- 40 indexable URLs. WordPress (WordPress.com hosting), Slim SEO plugin, custom post types: `service`, `industry`, `location`.
- The bloat is concentrated in **14 service pages**, **5 industry pages** and **7 near-duplicate "Benton AR" blog posts**.
- Service pages are all 760–950 words and share about 44–47% of their vocabulary with each other, which is a template-driven pattern. Several are near-synonyms (see 3).
- The header nav is fine (5 items plus industries and services menus). The **footer links 26 URLs**, which is the sitewide-link-farm pattern and probably what makes the site feel huge.
- Hub pages `/service/` (56 words), `/industry/` (31), `/location/` (17) are essentially empty and are not linked from page bodies.
- `/category/uncategorized/` is an empty archive in the sitemap.
- Titles have no consistent pattern: "– Vital Technology Solutions", "| VTS", "| Vital Technology Solutions".

## 2. Current inventory

| Type | URLs | Words |
|---|---|---|
| Core pages | `/`, `/about/`, `/about/why-choose-us/`, `/contact/`, `/blog/`, `/privacy-policy/` | 53–769 |
| Services | `/service/` hub + 14 | 760–950 |
| Industries | `/industry/` hub + 5 | 750–970 |
| Locations | `/location/` hub + `/arkansas/` + `/arkansas/benton/` | 796–893 |
| Blog | 9 posts | 1,170–1,740 |
| Other | `/category/uncategorized/` | 385 |

Full per-URL detail is in `inventory.csv`.

## 3. Recommendations

### Services: 14 pages to 6

| Proposed page | Absorbs | Why |
|---|---|---|
| **Managed IT Support** | `it-support-services`, `remote-it-support`, `maintenance-renewals`, `hardware-management`, `hardware-and-software-management` | Same buyer intent: "someone to run my IT". Hardware, renewals and remote help are features, not separate products |
| **Cybersecurity** | `cybersecurity`, `cybersecurity-services`, `network-security` | Three pages for one topic; `cybersecurity` and `cybersecurity-services` are direct duplicates in intent |
| **Backup & Disaster Recovery** | `data-backup-disaster-recovery-services` | Distinct, keep as is |
| **Cloud Computing** | `cloud-computing` | Distinct, keep as is |
| **Networking** | `network-support`, `computer-networking` | Near-synonyms |
| **IT Consulting** | `it-consulting` | Keep. Doubles as the "vCIO / planning" offer |
| *(optional)* Website Management | `website-management` | Off-core and not in nav. Keep as a short section on Managed IT unless it sells |

Keep `/service/` as a real hub page (about 300 words plus cards) instead of 56 words.

### Industries: 5 pages to 1 (or 2)

- `nonprofits` and `foundations` overlap 47%, and `manufacturing-construction` and `lumber-and-wood-products` overlap 46%. Merge into **Who We Serve**, with a section per vertical (Manufacturing & Construction, Lumber, Nonprofits & Foundations, Camps).
- If Search Console shows one vertical drawing real traffic, keep that one as its own page.
- Redirect the old URLs to the matching anchor on the merged page.

### Locations: 3 to 1

- `/location/arkansas/` and `/location/arkansas/benton/` cover the same ground. Merge into one "Benton & Arkansas" section on About or Contact, or keep a single `/locations/benton-ar/` page.
- Only keep a location page if it has real local content (address, map, service area, local proof).

### Blog: 9 posts to about 4

Seven posts chase nearly the same query ("IT services Benton AR"). Group and merge:

| Keep (merged) | Merge in |
|---|---|
| **IT Services in Benton, AR: Small Business Guide** | `small-business-it-support-benton-ar`, `it-services-benton-ar-small-business-guide`, `outsourced-it-services-benton-ar` |
| **Managed Cybersecurity in Benton, AR** | `managed-cybersecurity-benton-ar`, `it-security-services-benton-ar-questions` |
| **Backup, Recovery & Cloud Migration** | `backup-disaster-recovery-benton-ar`, `cloud-migration-services-benton-ar` (or keep as two) |
| **Arkansas Managed IT Services Cost Guide** | keep (distinct, strong lead-gen topic) |
| `it-services-arkansas-manufacturers` | keep, or fold into the manufacturing section of Who We Serve |

These are the longest and most linkable pages on the site, so redirect them, don't delete them.

### Housekeeping

- Remove or `noindex` `/category/uncategorized/`.
- Standardize titles: `Page Topic | Vital Technology Solutions`.
- Trim the footer to about 10 links (Services hub, Who We Serve, About, Blog, Contact, Privacy, plus the core services).
- `/about/why-choose-us/` is not linked from page bodies. Fold it into About, as the new design already does.
- Body-content "orphans" (only linked from nav/footer): `/about/why-choose-us/`, `/blog/`, `/privacy-policy/`, hubs, `website-management`, `maintenance-renewals`. Fine for legal pages, a flag for the rest.

## 4. Target sitemap (about 17 URLs, down from 40)

```
/                          Home
/services/                 Hub
  /services/managed-it-support/
  /services/cybersecurity/
  /services/backup-disaster-recovery/
  /services/cloud/
  /services/networking/
  /services/it-consulting/
/who-we-serve/             Industries (anchored sections)
/about/                    About + Why Choose Us + Benton location
/blog/                     Index
  4 merged posts
/contact/
/privacy-policy/
```

## 5. Redirect map (301)

| Old | New |
|---|---|
| `/service/it-support-services/`, `/service/remote-it-support/`, `/service/maintenance-renewals/`, `/service/hardware-management/`, `/service/hardware-and-software-management/` | `/services/managed-it-support/` |
| `/service/cybersecurity/`, `/service/cybersecurity-services/`, `/service/network-security/` | `/services/cybersecurity/` |
| `/service/data-backup-disaster-recovery-services/` | `/services/backup-disaster-recovery/` |
| `/service/cloud-computing/` | `/services/cloud/` |
| `/service/network-support/`, `/service/computer-networking/` | `/services/networking/` |
| `/service/it-consulting/` | `/services/it-consulting/` |
| `/service/website-management/` | `/services/managed-it-support/` |
| `/service/` | `/services/` |
| `/industry/`, `/industry/nonprofits/`, `/industry/foundations/`, `/industry/camps/`, `/industry/manufacturing-construction/`, `/industry/lumber-and-wood-products/` | `/who-we-serve/` (with `#anchor` where useful) |
| `/location/`, `/location/arkansas/`, `/location/arkansas/benton/` | `/about/#benton` |
| `/about/why-choose-us/` | `/about/` |
| Blog posts | per the merge table in section 3 |
| `/category/uncategorized/` | `/blog/` |

Implementation depends on the host. WordPress.com can do this with the Redirection plugin, or in the new site's host config.

## 6. Mapping to the new design

Existing design files in this folder: `VTS Home`, `VTS About`, `VTS Cybersecurity`, `VTS Redesign`, `VTS Redesign v2`.

| Target page | Design status |
|---|---|
| Home | `VTS Home.dc.html` exists |
| About (absorbs Why Choose Us, Benton) | `VTS About.dc.html` exists; add the Benton section |
| Cybersecurity | `VTS Cybersecurity.dc.html` exists |
| Services hub, Managed IT, Backup/DR, Cloud, Networking, IT Consulting | **Missing.** Can reuse the Cybersecurity layout as the service template |
| Who We Serve | **Missing** |
| Blog index + post template | **Missing** |
| Contact | **Missing** (the current page is only 53 words, probably an embedded form) |
| Privacy policy | **Missing** (copy over the existing text) |

Open question: what are `VTS Redesign.dc.html` and `v2`? They are the largest files and may be full-site concepts. Worth checking before building the missing pages.

## 7. Content to carry over

The homepage lead magnet, the "Business Owners' Guide to IT Support Services and Fees", is the main conversion asset and should stay prominent, along with the Schedule A Call CTA and the three-step process. Support hours (Mon–Fri 8–5 CST, 24/7 monitoring) and the Benton address should be consistent sitewide.

## 8. Next steps

1. Export Search Console Pages data (12–16 months) into this folder to confirm merge and cut decisions, especially industry and blog pages.
2. Confirm the target sitemap in section 4.
3. Build the missing pages from the existing design system.
4. Draft merged copy for each consolidated page. Pull the best material from the old pages rather than starting blank.
5. Implement the redirects at launch and submit the new sitemap.
