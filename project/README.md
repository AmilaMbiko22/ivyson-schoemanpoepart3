# Ivyson & Schoeman Home Security — Website (WEDE5020 POE)

**Student:** Amila Mbiko (ST10531465, GR01)
**Module:** Web Development (Introduction) — WEDE5020
**Live site:** https://ivyson-schoeman-security.netlify.app
**Repository:** https://github.com/AmilaMbiko22/POEWEBDEVPART1

## Project Title
Ivyson & Schoeman Home Security — Business Website

## Project Description
Ivyson & Schoeman Home Security was formed through a partnership between
Samuel Ivyson and Du-Plessis Schoeman to combat and thwart criminal activity
directed at personal households. It supplies and installs affordable, reliable
home protection equipment (cameras, sensors and smart locks) for middle-class
families. The website aims to:
- Build a credible, accessible digital presence
- Increase quotation requests submitted through online forms by 25%
- Boost local search traffic through educational home safety content

## Pages
| Page | File | Description |
|---|---|---|
| Home | `index.html` | Hero, feature cards, **dynamic home-safety tips with topic filter**, call to action |
| About Us | `about.html` | History, mission, vision, team |
| Products & Services | `services.html` | **Dynamic catalog (search, tabs, sort, details modal)**, services, pricing, **gallery lightbox**, **FAQ accordion** |
| Enquiry | `enquiry.html` | **Validated form that returns a cost estimate and availability** |
| Contact | `contact.html` | **Interactive Leaflet map of both branches**, **validated form that compiles an email** |

## File & Folder Structure
```
project/
├── index.html  about.html  services.html  enquiry.html  contact.html  404.html
├── css/style.css
├── js/
│   ├── script.js     shared: active nav, scroll reveal, accordion, back-to-top, helpers
│   ├── tips.js       home page: loads data/tips.json, topic filter
│   ├── catalog.js    services page: loads data/products.json, search/sort/tabs, modal
│   ├── lightbox.js   services page: gallery lightbox
│   ├── forms.js      enquiry + contact: validation, cost estimate, email compiler
│   └── map.js        contact page: Leaflet map
├── data/             products.json, tips.json (loaded with fetch)
├── images/           descriptively named, responsive (400w/738w, 350w/547w) variants
├── docs/screenshots/ responsive testing and feature evidence
├── robots.txt  sitemap.xml  _headers
└── README.md
```

## Site Map
```
Home (index.html)
├── Products & Services (services.html)
│   ├── Product catalog: cameras, sensors, smart locks (search, sort, details)
│   ├── Services and indicative pricing
│   ├── Photo gallery (lightbox)
│   └── FAQ
├── About Us (about.html): history, mission, vision, goals, team
├── Contact (contact.html): two branches, interactive map, contact form
└── Get a Free Quote / Enquiry (enquiry.html): cost-estimate form
```
Every page links to every other page through the top navigation and the footer.
The machine-readable version for search engines is `sitemap.xml`.

## Design
- **Colour palette:** Navy Blue (`#0b1f3a`), Slate Gray (`#6b7684`), Alert Yellow (`#ffc107`)
- **Typography:** clean sans-serif (Segoe UI / Arial / Helvetica), `rem` based
- **Layout:** card-based sections with a simple top navigation bar

## Part 3 — Functionality (JavaScript)
| Feature | Where | How it works |
|---|---|---|
| Interactive elements | Services | **Tabs** (category filter, arrow-key support), **accordion** (FAQ, one open at a time), **modal** (product details), all with ARIA attributes |
| Dynamic content | Home, Services | `fetch()` loads `data/tips.json` and `data/products.json`; cards are built with DOM methods |
| Search / filter / sort | Services | Live search over name, summary, specs and category; category tabs; sort by price or name; result count; "no results" state |
| Gallery lightbox | Services | Native `<dialog>`; click to open, ← → keys / buttons to navigate, Esc or backdrop to close, focus returns to the thumbnail |
| Interactive map | Contact | Leaflet + OpenStreetMap: two branch markers with popups, "Show both / Cape Town / Johannesburg" buttons that fly to a branch |
| Animations | All | CSS scroll-reveal and hero fade-in (respects `prefers-reduced-motion`) |
| DOM manipulation | All | Dynamic cards, validation messages, result panels, back-to-top button |

## Part 3 — Forms
**Enquiry (`enquiry.html`)** — controls: text, email, tel, select, checkbox group,
single checkbox, date, textarea with character counter, consent checkbox.
After validation the page calls `fetch('data/products.json')` (AJAX, no reload) and
shows an **estimated cost range** (house size × recommended devices × cheapest/most
expensive product, plus installation), a reference number and **availability**
(the chosen weekday is provisionally reserved, otherwise the earliest slot two
business days ahead). The visitor can also email the request to the team.

**Contact (`contact.html`)** — name, email, optional phone, branch, message type,
subject, message (counter), consent. After validation the data is **compiled into
an email** shown in a preview, and a button opens it in the visitor's email app
addressed to the recipient set in `js/forms.js` (`CONTACT_EMAIL`). If a form
service URL is put in `FORM_ENDPOINT`, the same data is also sent with `fetch` (AJAX).

**Validation (JavaScript on top of HTML5 attributes):** required fields, name
pattern, email pattern, South African phone numbers (`082 123 4567` / `+27…`),
length limits (message 10–500, subject 3–80), at least one product ticked,
evaluation date must be a future weekday within 60 days, consent. Errors show next
to the field (`aria-invalid` / `aria-describedby`), an error summary appears, and
focus moves to the first problem. Checks run on blur and while typing.

## Part 3 — SEO
- **Title tags:** unique, keyword-led, under ~60 characters on every page
- **Meta descriptions:** unique, ~150 characters, on every page
- **Meta keywords:** page-specific (listed below)
- **Header tags:** exactly one `<h1>` per page, then `<h2>` / `<h3>` in order
- **Images:** descriptive file names (e.g. `wireless-security-camera.jpeg`), meaningful `alt` text, `width`/`height` set, `loading="lazy"` below the fold, `srcset` for large images
- **URLs / internal linking:** short descriptive file names; navigation, footer and in-content links between pages
- **Mobile-friendly:** responsive layout (Part 2) + viewport meta tag
- **Extras:** canonical link, Open Graph tags, JSON-LD structured data (business, founders, both branches), `robots.txt`, `sitemap.xml`, custom `404.html`
- **Off-page SEO plan (not implemented in code):** Google Business Profile for each branch (local SEO), listings in local directories, share educational tips on Facebook/Instagram/WhatsApp groups, request links from local estate/neighbourhood-watch websites.

| Page | Meta keywords |
|---|---|
| Home | home security, home security South Africa, security cameras, CCTV installation, smart locks, door sensors, burglar alarm, free security quote, Cape Town, Johannesburg |
| Products & Services | security cameras, wireless CCTV, door window sensors, motion sensors, smart door locks, keypad lock, home security installation, security prices South Africa |
| About | about Ivyson and Schoeman, home security company, security installers, Samuel Ivyson, Du-Plessis Schoeman, home protection South Africa |
| Enquiry | free security quote, home security cost estimate, security installation quote, on-site security evaluation, CCTV quote, smart lock price |
| Contact | contact home security, security company Cape Town, security company Johannesburg, Bellville, Randburg, home security branch, security enquiry |

## Part 3 — Page Speed & Security
**Page speed:** all scripts use `defer`; images are small, sized and lazy-loaded
below the fold; responsive `srcset` images; Leaflet only loads on the contact
page; no frameworks or large libraries; long-term cache headers for images,
CSS and JS in `_headers`; `prefers-reduced-motion` respected.

**Security:** Content-Security-Policy (meta tag and `_headers`) allowing only
this site, Leaflet from cdnjs and OpenStreetMap tiles; all inline `style`
attributes were moved into the stylesheet so inline styles are not needed;
no `innerHTML` — all dynamic text is inserted with `textContent` (prevents XSS);
`X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`,
`Permissions-Policy` and HSTS in `_headers` (Netlify); external links use
`rel="noopener noreferrer"`; forms validate on the client, and because there is
no server the data is only sent by the visitor's own email app. *Client-side
validation improves usability but is not a security control; a real back-end
would need to validate again.*

## Responsive Design & Testing Evidence
**Breakpoints:** Desktop ≥ 993px; Tablet 701–992px; Mobile ≤ 700px (single column, CSS-only hamburger menu); Small mobile ≤ 420px.

Screenshots of every page except Contact at each size were captured in Chromium
at 1280 × 900, 800 × 1000 and 375 × 800 (full page). Feature screenshots show the
modal, lightbox, accordion, validation errors and cost estimate.

| Page | Desktop (1280px) | Tablet (800px) | Mobile (375px) |
|---|---|---|---|
| Home | [view](docs/screenshots/index-desktop-1280.png) | [view](docs/screenshots/index-tablet-800.png) | [view](docs/screenshots/index-mobile-375.png) |
| Products & Services | [view](docs/screenshots/services-desktop-1280.png) | [view](docs/screenshots/services-tablet-800.png) | [view](docs/screenshots/services-mobile-375.png) |
| About Us | [view](docs/screenshots/about-desktop-1280.png) | [view](docs/screenshots/about-tablet-800.png) | [view](docs/screenshots/about-mobile-375.png) |
| Enquiry | [view](docs/screenshots/enquiry-desktop-1280.png) | [view](docs/screenshots/enquiry-tablet-800.png) | [view](docs/screenshots/enquiry-mobile-375.png) |

Feature evidence: [product modal](docs/screenshots/feature-product-modal.png),
[gallery lightbox](docs/screenshots/feature-gallery-lightbox.png),
[FAQ accordion](docs/screenshots/feature-faq-accordion.png),
[form validation errors](docs/screenshots/feature-enquiry-validation.png),
[cost estimate response](docs/screenshots/feature-enquiry-estimate.png).

**Automated functional checks run:** every page has one `<h1>`, title, description and keywords; all images have `alt`; tips filter; catalog search, sort, tabs (keyboard), modal, lightbox (next/previous/wrap/Esc), accordion; enquiry validation (empty, bad name/email/phone, weekend date), correct estimate (e.g. small home, cameras + installation = R 2 448 – R 5 248); contact validation and compiled email link; no console errors or CSP violations; no horizontal scrolling at 375px on any page.

## Technologies Used
HTML5, CSS3 (custom properties, Flexbox, Grid, media queries), JavaScript (ES5-style, no framework), `fetch` / JSON, [Leaflet](https://leafletjs.com/) 1.9.4 with OpenStreetMap tiles, Git & GitHub, Netlify.

## How to Run
1. Open the `project` folder in Visual Studio Code and install **Live Server**.
2. Right-click `index.html` → **Open with Live Server**. A local server is needed because `fetch()` cannot read JSON from `file://` URLs.
3. Use the top navigation bar to move between pages.

## Deployment (Netlify)
1. Push the repository to GitHub.
2. In Netlify choose **Add new site → Import an existing project**, select the repository and set the **publish directory to `project`** (or drag the `project` folder onto Netlify Drop).
3. The site is deployed at https://ivyson-schoeman-security.netlify.app. If the address ever changes, update it in `robots.txt`, `sitemap.xml`, the `canonical`/`og:url` tags in each page and the JSON-LD block in `index.html`.

## Notes
- The forms have no server: the estimate is calculated in the browser from `data/products.json`, and emails are sent through the visitor's own email app. Change `CONTACT_EMAIL` in `js/forms.js` to change the recipient.
- Prices in `data/products.json` are indicative figures for the assignment and are not a real price list.
- Estimated project costs (from the brief): quote tool/CMS/custom design R15 000–R35 000, hosting R1 200–R3 500/year, maintenance R4 000–R8 000/year, totalling R20 000–R46 500 for the first year.
- Image credits: product photos show QVI, Sonoff and Hikvision products; the home and installation-planning photos are illustrative stock images. All are used for educational purposes only in this assessment.

## Changelog

### Part 3 — Enhancing Functionality and SEO

**Changes made in response to Part 1 feedback (72/100)**
- **Added (feedback: sitemap only 2/5):** a page-hierarchy site map in this README and a search-engine `sitemap.xml` listing all five pages.
- **Improved (feedback: GitHub commits 3/5):** the Part 3 work was committed in separate, descriptive commits (SEO, styles, home page, services page, contact page, forms, docs, README) instead of a single commit.
- **Improved (feedback: references 3/5):** the reference list was expanded from five general sources to sixteen Harvard-style references covering SEO, JavaScript, forms, mapping, security and accessibility, each with an access date.

**Changes made in response to Part 2 feedback (90/100)**
- **Added (feedback: no screenshot evidence of responsive testing):** captured full-page screenshots of the Home, Products & Services, About Us and Enquiry pages at desktop (1280px), tablet (800px) and mobile (375px) and saved them in `docs/screenshots/`. They are linked from the *Responsive Design & Testing Evidence* section above, together with a list of the automated checks run. The earlier sentence saying screenshots were "to be added" was removed.
- **Fixed (feedback: unfinished README notes):** removed the "replace `hero-placeholder.jpg` and `about-placeholder.jpg`" note. The images were renamed to `home-security-hero-*.jpeg` and `security-installation-planning-*.jpeg`, the two unused full-size duplicates were deleted, and an image-credits note was added under *Notes*.
- **Fixed (feedback: unfinished README notes):** removed the "add any additional sources" instruction from References and completed the reference list in Harvard style, including every source used for Part 3.
- **Fixed (feedback: changelog instruction left in place):** removed the "Add further entries here…" placeholder from the changelog; this section replaces it.

**Functionality**
- **Added** `js/script.js` helpers (Rand formatter, safe element builder, `fetch` JSON loader) and kept the active-navigation highlight from Part 1; the mobile menu now also closes after a link is chosen.
- **Added** home-safety tips loaded from `data/tips.json` with topic filter buttons (`js/tips.js`) — supports the brief's goal of educational content.
- **Replaced** the three static product cards on `services.html` with nine products loaded from `data/products.json`, with live search, sortable list, keyboard-accessible category tabs, result count and a "no results" state (`js/catalog.js`). A `<noscript>` fallback keeps the original three categories.
- **Added** product details modal using the native `<dialog>` element, with a "Get a quote for this" link that pre-selects the product type on the enquiry form.
- **Added** photo gallery with lightbox (`js/lightbox.js`): next/previous, wrap-around, captions, Esc/backdrop to close, focus returned to the thumbnail.
- **Added** FAQ accordion (ARIA, one panel open at a time, arrow/Home/End keys).
- **Replaced** the two Google Maps iframes on `contact.html` with one interactive Leaflet map (`js/map.js`) showing both branches with popups and fly-to buttons; kept "Get directions" links.
- **Added** scroll-reveal and hero animations in CSS/JS, a back-to-top button, and `prefers-reduced-motion` support.

**Forms**
- **Changed** `enquiry.html`: radio buttons became product checkboxes; added placeholder option for house size, installation checkbox, optional evaluation date, required message and consent checkbox, character counter, required-field markers and hints.
- **Added** JavaScript validation to both forms (patterns, South African phone numbers, length limits, date rules, at least one product, consent) with inline error messages, a summary banner, `aria-invalid`/`aria-describedby` and focus on the first error.
- **Added** the enquiry response: estimated cost range with itemised table, reference number, availability message and an "Email this request" button, calculated after an AJAX request for current prices.
- **Added** the contact email workflow: compiled message preview, "Open in my email app" button addressed to `CONTACT_EMAIL`, "Copy message" button and optional AJAX submit through `FORM_ENDPOINT`.
- **Changed** form `action` attributes from the placeholder `#` to `mailto:` so the forms still do something when JavaScript is unavailable. Added `contact.html` fields: phone, message type, subject and consent; changed the branch dropdown to include a placeholder option.

**SEO, speed and security**
- **Changed** all five `<title>` tags and meta descriptions to unique, keyword-led versions; **added** meta keywords, canonical links, Open Graph tags, `robots` and theme-colour meta tags.
- **Fixed** heading structure: the page titles on About, Products & Services, Enquiry and Contact were `<h2>` with no `<h1>`; each page now has exactly one `<h1>`.
- **Renamed** images to descriptive names (`logo.jpeg` → `ivyson-schoeman-logo.jpeg`, `camera-product.jpeg` → `wireless-security-camera.jpeg`, etc.), updated every reference, added width/height and `loading="lazy"`.
- **Added** JSON-LD structured data for the business, `robots.txt`, `sitemap.xml`, `404.html`, a skip-to-content link and `id="main"` landmarks.
- **Added** a Content-Security-Policy, security headers and cache headers (`_headers`); moved every inline `style="…"` attribute into `css/style.css` as utility classes; scripts now use `defer`.
- **Changed** `css/style.css`: new component styles (tabs, chips, modal, lightbox, accordion, validation states, result panels, map), responsive rules for the new components, and `.page-section h1` shares the former `h2` styling.

**Repository**
- **Fixed (found after deployment):** Netlify serves pages without `.html` (e.g. `/services`), which stopped the active-menu highlight working; `js/script.js` now ignores the `.html` ending. Canonical, `og:url` and `sitemap.xml` addresses were changed to the same clean URLs.
- Regular, descriptive commits were made for each of the groups above.

## References
- Google (2025) *SEO Starter Guide*. Available at: https://developers.google.com/search/docs/fundamentals/seo-starter-guide (Accessed: 2 November 2026).
- Google (2025) *Introduction to robots.txt*. Available at: https://developers.google.com/search/docs/crawling-indexing/robots/intro (Accessed: 2 November 2026).
- Sitemaps.org (2008) *Sitemaps XML format*. Available at: https://www.sitemaps.org/protocol.html (Accessed: 2 November 2026).
- Schema.org (2025) *LocalBusiness*. Available at: https://schema.org/LocalBusiness (Accessed: 2 November 2026).
- Agafonkin, V. (2023) *Leaflet: an open-source JavaScript library for interactive maps*, version 1.9.4. Available at: https://leafletjs.com/ (Accessed: 2 November 2026).
- OpenStreetMap contributors (2026) *Copyright and License*. Available at: https://www.openstreetmap.org/copyright (Accessed: 2 November 2026).
- Mozilla Developer Network (MDN) (2026) *Using the Fetch API*. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch (Accessed: 2 November 2026).
- Mozilla Developer Network (MDN) (2026) *The Dialog element*. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog (Accessed: 2 November 2026).
- Mozilla Developer Network (MDN) (2026) *Client-side form validation*. Available at: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation (Accessed: 2 November 2026).
- Mozilla Developer Network (MDN) (2026) *Content Security Policy (CSP)*. Available at: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP (Accessed: 2 November 2026).
- W3C Web Accessibility Initiative (2025) *ARIA Authoring Practices Guide: Accordion and Tabs patterns*. Available at: https://www.w3.org/WAI/ARIA/apg/patterns/ (Accessed: 2 November 2026).
- Netlify (2026) *Custom headers*. Available at: https://docs.netlify.com/manage/routing/headers/ (Accessed: 2 November 2026).
- Mozilla Developer Network (MDN) (2026) *CSS: Cascading Style Sheets*. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS (Accessed: 2 November 2026).
- Mozilla Developer Network (MDN) (2026) *Responsive images*. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images (Accessed: 2 November 2026).
- Mozilla Developer Network (MDN) (2026) *CSS Grid Layout* and *Flexbox*. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout (Accessed: 2 November 2026).
- W3Schools (2026) *How To – Responsive Top Navigation Menu*. Available at: https://www.w3schools.com/howto/howto_js_topnav_responsive.asp (Accessed: 2 November 2026).
