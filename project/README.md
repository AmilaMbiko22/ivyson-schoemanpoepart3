# Ivyson & Schoeman Home Security — Website (WEDE5020 POE)

**Student:** Amila Mbiko (ST10531465, GR01)

## Project Title
Ivyson & Schoeman Home Security — Business Website

## Project Description
A static HTML/CSS website for Ivyson & Schoeman Home Security, a home
security equipment and installation business formed by Samuel Ivyson
and Du-Plessis Schoeman. The site targets middle-class families
looking for affordable, reliable home protection equipment, and aims
to:
- Build a credible, accessible digital presence
- Increase quotation requests submitted through online forms by 25%
- Boost local search traffic through educational home safety content

## Pages
| Page | File | Description |
|---|---|---|
| Home | `index.html` | Hero section, brief intro, call to action, navigation |
| About Us | `about.html` | Organisation history, mission, vision, team members |
| Products & Services | `services.html` | Product catalog (cameras, sensors, smart locks), services, pricing |
| Enquiry | `enquiry.html` | Form for product/service enquiries and quote requests |
| Contact | `contact.html` | Contact info for two branches, embedded maps, contact form |

## File & Folder Structure
```
project/
├── index.html
├── about.html
├── services.html
├── enquiry.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
│   ├── hero-placeholder.jpeg (+ 400w / 738w responsive variants)
│   ├── about-placeholder.jpeg (+ 350w / 547w responsive variants)
│   └── ...
└── README.md
```

## Design
- **Colour palette:** Navy Blue (`#0b1f3a`), Slate Gray (`#6b7684`), Alert Yellow (`#ffc107`)
- **Typography:** Clean sans-serif (Segoe UI / Arial / Helvetica); base size set on
  `html` in `rem` so the whole type scale can be adjusted per breakpoint
- **Layout:** Card-based sections with a simple top navigation bar
  (Home, Products & Services, About Us, Contact, Get a Free Quote)

## Responsive Design
- **Breakpoints:**
  - Desktop: 993px and up (default styles)
  - Tablet: 701px – 992px (tighter spacing, grids stay multi-column)
  - Mobile: ≤ 700px (single-column layout, collapsible navigation)
  - Small mobile: ≤ 420px (extra spacing/sizing tweaks for very small screens)
- **Navigation:** collapses into a CSS-only hamburger menu (checkbox + label,
  no JavaScript) below 700px.
- **Relative units:** `rem`/`em` used for spacing and type; `%`/`fr`/`minmax()`
  used for widths and grid tracks so content reflows instead of overflowing.
- **Responsive images:** hero and about images use `srcset`/`sizes` to serve a
  smaller file on narrow viewports.
- **Testing:** verified in browser dev tools at common breakpoints (desktop
  ~1280px, tablet ~800px, mobile ~375px). *(Screenshot evidence for each
  device size to be added here before submission.)*

## Technologies Used
- HTML5
- CSS3 (custom properties, Flexbox, Grid, media queries)

## How to Run
1. Open the `project` folder in Visual Studio Code.
2. Install the "Live Server" extension (optional but recommended).
3. Right-click `index.html` and choose **Open with Live Server**, or
   simply open `index.html` directly in a browser.
4. Navigate the site using the top navigation bar.

## Notes
- Image placeholders are referenced in `images/` — replace
  `hero-placeholder.jpg` and `about-placeholder.jpg` with real photos
  before final submission.
- Forms (`enquiry.html`, `contact.html`) are front-end only; the
  `action="#"` attributes are placeholders until connected to a
  back-end or form-handling service.
- Estimated project costs (from the brief): quote tool/CMS/custom
  design R15 000–R35 000, hosting R1 200–R3 500/year, maintenance
  R4 000–R8 000/year, totalling R20 000–R46 500 for the first year.

## Changelog

### Part 2 — CSS Styling & Responsive Design
- **Added:** external stylesheet enhancements — `html { font-size: 100%; }`
  base rule so the type scale can be resized per breakpoint using `rem`.
- **Added:** a CSS-only (no JavaScript) collapsible hamburger navigation menu
  for screens ≤ 700px, using a hidden checkbox + label toggle, added to the
  navbar markup on all five pages.
- **Added:** a full set of responsive breakpoints (tablet ≤ 992px, mobile
  ≤ 700px, small mobile ≤ 420px) that: reduce section padding, switch
  `card-grid`, `team-grid`, `locations-grid`, `footer-grid` and `two-col`
  from multi-column to single-column, shrink heading font sizes, stack the
  enquiry/contact form radio groups, and let the pricing table scroll
  horizontally instead of squashing on narrow screens.
- **Changed:** hero heading now uses `clamp()` so its font size scales
  smoothly between mobile and desktop instead of jumping at a fixed
  breakpoint.
- **Added:** `srcset`/`sizes` responsive images for the hero photo
  (`index.html`) and the about photo (`about.html`), each with a smaller
  (400w/350w) and full-size (738w/547w) variant so narrow viewports don't
  download the larger file.
- **Removed:** the old single `@media (max-width: 700px)` rule that only
  handled `.two-col`, replaced by the consolidated breakpoint sections above.
- *(Add further entries here — e.g. Part 1 feedback corrections — dated and
  described, as edits are made.)*

## References
- Mozilla Developer Network (MDN). *CSS: Cascading Style Sheets.*
  https://developer.mozilla.org/en-US/docs/Web/CSS
- Mozilla Developer Network (MDN). *Responsive images.*
  https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images
- Mozilla Developer Network (MDN). *Using CSS custom properties (variables).*
  https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
- Mozilla Developer Network (MDN). *CSS Grid Layout* and *Flexbox.*
  https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
- W3Schools. *How To - CSS/JS Responsive Top Navigation Menu.*
  https://www.w3schools.com/howto/howto_js_topnav_responsive.asp
- *(Add any additional sources consulted while building the CSS/responsive
  layer.)*

