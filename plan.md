# HomeGeniee — WordPress → React Frontend Rebuild

**Source:** https://homegeniee.com (WordPress + Woodmart + Elementor + Slider Revolution + WooCommerce)
**Target:** React SPA (frontend only, this phase). Node/Express API is phase 2.
**Content rule:** every heading, paragraph, price, phone number, address and link from the live site is preserved. Nothing invented, nothing dropped.

---

## 1. What the current site actually is

HomeGeniee is a Kolkata interior + civil firm operating since 2016. The site is doing four jobs at once:

| Job | Current implementation |
|---|---|
| Service marketing (12 verticals) | Elementor sections on the homepage |
| Product showcase (~40 SKUs, 6 categories) | WooCommerce, but **no checkout** — it's a pre-order catalogue driven to WhatsApp |
| Project portfolio (6 projects) | Woodmart gallery |
| Lead capture | 3 separate forms + WhatsApp float + tel: links |

The critical insight: **this is not e-commerce.** The About page says it outright — no online checkout, the site is a pre-order showcase and every path terminates in a phone call or WhatsApp. So the React build optimises for *consultation conversion*, not cart conversion. Wishlist and Compare stay (they exist today) but they feed the enquiry, they don't feed a basket.

### Content inventory carried over
- **12 service verticals:** Interior Design, Modular Kitchen, HomeGeniee Collection, False Ceiling, Modern Furniture, Facade Decor, Wall Decor, Architecture & Civil, uPVC & Aluminium, Balcony & Terrace, Shade Work, Room Makeover, Renovation
- **6 product categories:** Puja Utility, Kitchen Utility, Study Utility, Wall Utility, Wall Shelving, Shoe Cabinet
- **5-step design journey:** Connect → Share Vision → Confirm Plan → Watch Transformation → Move In
- **4 differentiators:** Customize Design, On Time Delivery, No Hidden Cost, Upto 10 Years Warranty
- **6 projects:** Urban Nest, The Luxe Layer, Marvelous Makeover, Warm Whispers, Minimal Muse, Muted Modernity
- **4 testimonials, 9 FAQs, 4 trust pillars**
- **Contact:** 70 Serpentine Lane, Kolkata 700014, Fl-4, beside Koley Market, opposite NRS Hospital · +91 98316 87191 · 8777253087

### One content bug to fix
The homepage process section currently reads *"Discover the ease and elegance of **BOSKY Interior's** design magic"* — leftover copy from the theme demo or a previous client. Corrected to HomeGeniee in the rebuild. Flagged rather than silently changed.

---

## 2. Design direction

### The problem to avoid
Interior-design sites converge hard: cream background, high-contrast serif, terracotta accent, full-bleed photo hero. That look is also exactly what an AI-generated design defaults to. HomeGeniee's own catalogue offers something more specific to work from.

### Grounding: the louver
Their product list is full of **Louver Panel, Jafri/CNC Ceiling, Vertical Gardening, Wall Shelving** — vertical slat geometry runs through the whole business. That becomes the site's structural motif, not decoration: section dividers are louver screens whose slats rotate with scroll position, revealing the section behind them the way a real louver opens.

### Grounding: the spec sheet
They sell **Estimation & BOQ, Construction Drawing, MEP Drawing, Soil Test, LBS Certification**. Half the company is a drafting office. So all numerals, prices, measurements and section markers are set in monospace, and sections carry drawing-sheet labels (`SHEET 03 / SERVICES`). The numbering is legitimate here — a drawing set really is numbered.

### Tokens

**Color** — revised to the logo's own palette. The original teak-and-brass
direction was dark; the brand mark is a blue house with a gold genie, so the site
now runs light and every value below is *sampled from `public/logo.png`* by decoding
the PNG and counting pixels, not picked by eye. The mark is a vertical gradient:
```
--accent-sky    #38BCF1   top of the house — glows, gradient stops
--accent-bright #0084DA   the signature azure — fills and graphics
--accent        #0064AB   primary: text, buttons, borders (6.2:1 on white)
--accent-strong #004B87   hover and emphasis
--navy          #003D70   base of the gradient — the footer ground
--gold          #FFE55A   the genie's lamp, straight off the mark
--cream         #FFFBEC   the genie's highlight — the warm section bays
```
The brightest logo blue is only 3.95:1 on white, so small text falls back to the
darker stops of the same gradient; the bright end stays for fills, glows and the
SVG room. The old lacquer red is gone — it is not a logo colour. `New` badges are
now gold with navy text and prices are navy, which is the mark's own pairing.
Every text pair on the built pages clears WCAG AA; the check is a contrast sweep
over the rendered DOM, not eyeballing.

**Type** — three roles, no defaults:
- Display: **Bricolage Grotesque** — variable, architectural, slightly drafted. Deliberately not a high-contrast serif.
- Body: **Karla** — humanist, quirky terminals, holds up at 15–17px.
- Utility: **JetBrains Mono** — prices, dimensions, sheet numbers, step indices.

**Layout:** 12-column, 1240px max, but sections alternate between full-bleed dark (services, 3D) and inset terrazzo (products, FAQ) so scrolling feels like moving between rooms.

### Signature element
A real **WebGL isometric room** in the hero — floor plane, back wall with vertical louver slats, modular counter block, pendant lamp, plant. Camera parallaxes to the pointer, slats breathe. It is the one heavy thing on the page; everything else stays disciplined.

---

## 3. Where the 3D and motion actually live

Not "animate everything." Animation carries meaning at five points:

| Element | Technique | Why it earns its place |
|---|---|---|
| Hero room | React Three Fiber, real WebGL | The product is rooms. Show a room. |
| Louver dividers | `useScroll` → `rotateY` on slats | Section transitions read as opening a screen |
| Service cards | CSS `preserve-3d` + pointer tilt | Depth on hover, no WebGL cost |
| Process journey | Pinned SVG room, scroll-scrubbed | The room decorates itself as the 5 steps scroll: blueprint → paint → louvers + BOQ → furniture → lights on. The journey is the product, so it is shown, not listed |
| Category tabs | `layoutId` shared underline | Continuity between tab states |
| Route changes | `AnimatePresence` fade + rise | Spatial continuity across pages |
| Counters, reveals | `whileInView`, once:true | Draws the eye down the page |

Everything respects `prefers-reduced-motion`. The 3D canvas drops to a static gradient + CSS louvers when reduced motion is on or WebGL is unavailable.

---

## 4. Architecture

```
src/
  main.jsx                 providers + router mount
  App.jsx                  routes, AnimatePresence page transitions
  styles/                  tokens.css, base.css, layout.css, home.css, pages.css
  context/
    UIContext.jsx          modal, mobile nav, mega menu, cookie bar  (useReducer)
    ShopContext.jsx        wishlist + compare, localStorage-backed   (useReducer)
  data/
    site.js  services.js  products.js  projects.js  testimonials.js  faqs.js
  three/
    RoomScene.jsx          the hero WebGL room
  components/              Header, MegaMenu, MobileNav, Footer, Reveal, TiltCard,
                           MagneticButton, LouverDivider, SectionHeading,
                           ConsultationModal, FloatingActions, CookieBar, ScrollProgress
  sections/                Hero, ProcessJourney, ServiceShowcase, WhyUs,
                           UtilityCollection, Projects, Testimonials, TrustStrip
  pages/                   Home, ServicePage, Collection, Gallery, About, Contact
```

### State: Context, not Redux
Two providers, `useReducer` inside each. The global state here is a modal flag, a nav flag, and two arrays of product IDs — that is a Context problem. Redux Toolkit would add a store, slices and a middleware chain to manage four booleans.

Where Redux *would* start paying for itself: once the Node API lands and there's server cache, auth and an enquiry queue to coordinate. The reducers are already written in Redux shape (`{type, payload}`), so the migration is moving each reducer into `createSlice` and swapping `useUI()` for `useSelector`. No component logic changes.

### Routing
12 service verticals share one layout, so they share one route — `/services/:slug` reading from `services.js` — rather than 12 near-identical page files. Anchor sub-navigation (`#boq`, `#mep`, `#vertical`) is preserved from the WordPress URLs so existing inbound links and any indexed deep links still resolve.

---

## 5. Deliberate omissions

| Skipped | Add when |
|---|---|
| Node/Express API | This phase is frontend only, per brief |
| Real form submission | Forms validate + show success state; wire to `POST /api/enquiry` in phase 2 |
| Auth / My Account | No user accounts until orders move online |
| Search backend | Header search is UI-only; needs an index |
| Image optimisation | Currently pointing at existing `wp-content` URLs. Move to WebP/AVIF on a CDN before launch — this is the single biggest performance win available |
| i18n | Site is English-only today |

---

## 6. Build order

1. Tokens + base CSS, fonts, providers
2. Header / MegaMenu / MobileNav / Footer shell
3. Motion primitives — Reveal, TiltCard, MagneticButton, LouverDivider
4. Hero + RoomScene (the risk; validate performance early)
5. Home sections in page order
6. Collection with tabs, wishlist, compare
7. ServicePage, Gallery, About, Contact
8. Modal, floating actions, cookie bar, scroll progress
9. Accessibility + reduced-motion pass, responsive pass
