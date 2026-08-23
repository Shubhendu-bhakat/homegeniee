# HomeGeniee — React frontend

React rebuild of [homegeniee.com](https://homegeniee.com), currently WordPress
(Woodmart + Elementor + WooCommerce). Frontend only; the Node/Express API is phase 2.

See **[plan.md](./plan.md)** for the design direction, content inventory and architecture rationale.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Stack

| Concern | Choice |
|---|---|
| Build | Vite |
| UI | React 19 |
| Routing | React Router 7 |
| Animation | Motion (formerly Framer Motion) |
| 3D | React Three Fiber + drei + three |
| State | Context API + `useReducer` |
| Styling | Plain CSS with custom properties |

No CSS framework and no state library. The design tokens live in
`src/styles/tokens.css`; every colour, type size and easing curve derives from there.

## State

Two providers, both with Redux-shaped reducers (`{type, payload}`):

- **`UIContext`** — consultation modal, mobile nav, mega menu, cookie bar
- **`ShopContext`** — wishlist and compare, persisted to `localStorage`

There is no cart. HomeGeniee has no online checkout — the site is a pre-order
showcase and every action terminates in a WhatsApp message or a phone call.
Wishlist and Compare exist to be carried into that enquiry.

Migrating to Redux Toolkit later means moving each reducer into `createSlice`
and swapping `useUI()` / `useShop()` for `useSelector`. No component logic changes.

## Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/services/:slug` | All 14 verticals, one layout, data from `src/data/services.js` |
| `/collection` | Product catalogue, wishlist + compare |
| `/gallery` | Portfolio with shared-element lightbox |
| `/about` | Story, promises, FAQ (with FAQPage JSON-LD) |
| `/contact` | Studio details + design upload form |

Anchor deep links from the WordPress URLs are preserved — `#boq`, `#mep`,
`#vertical`, `#jafri` and the rest all still resolve. `/about-us` and
`/contact-us` redirect to their new equivalents.

## Animation

Motion is used where it carries meaning, not everywhere:

- **Hero** — a real WebGL room (React Three Fiber), lazy-loaded so three.js
  stays out of the main bundle
- **Louver dividers** — slats rotate open on scroll, the site's signature motif
- **Service and product cards** — pointer-tracked 3D tilt with real `translateZ`
- **Process journey** — z-depth stack and a rail that fills with scroll
- **Category tabs** — shared `layoutId` underline
- **Routes** — `AnimatePresence` fade and rise

`prefers-reduced-motion` is respected throughout. The hero falls back to a CSS
louver animation when reduced motion is on or WebGL is unavailable.

## Content

Every heading, paragraph, price, phone number and address comes from the live
site. One correction: the homepage process section currently credits
*"BOSKY Interior"* — leftover demo copy. Changed to Home Geniee here.

## Before launch

1. **Images.** Everything points at existing `wp-content` URLs. Move to WebP/AVIF
   on a CDN — the single biggest performance win available.
2. **Forms.** They validate and show success states but do not submit. Wire to
   `POST /api/enquiry`; the payload shape is already what the endpoint should take.
3. **Search.** The header search is UI-only and needs an index behind it.

Deliberate omissions are marked with `ponytail:` comments in the source.
