const U = "https://homegeniee.com/wp-content/uploads/2024/09";

// `video` is a YouTube URL (any watch/share format — ProjectPage extracts the
// id) and `details` is the material/spec breakdown shown on the project's own
// page. Both are optional: a project with neither still gets a normal page,
// just without those two blocks.
export const projects = [
  {
    slug: "urban-nest",
    title: "Urban Nest",
    image: `${U}/DSF2402-scaled.jpg`,
    scope: "Full home interior",
    video: "https://www.youtube.com/watch?v=hGoD3zdzRlo",
    details: {
      heading: "Project material details",
      items: [
        "Modular wardrobes and kitchen cabinetry in 18mm BWP plywood (Greenply, Century make) with laminate finish.",
        "False ceiling in gypsum board on GI channel frame, with cove lighting along the living room perimeter.",
        "Walls in Asian Paints Royale emulsion, feature wall in textured finish.",
        "Vitrified tile flooring, 800x800mm, throughout the living and dining areas.",
      ],
    },
  },
  {
    slug: "the-luxe-layer",
    title: "The Luxe Layer",
    image: `${U}/IMG_20230829_164307053-scaled.jpg`,
    scope: "Living + dining",
    details: {
      heading: "Project material details",
      items: [
        "TV unit and dining storage in 19mm MDF with high-gloss PU finish.",
        "Suspended grid false ceiling with recessed spotlights and a profile light channel over the dining table.",
        "Upholstered seating in premium fabric, brass-finish hardware throughout.",
        "Italian marble-finish vitrified flooring in the living and dining zone.",
      ],
    },
  },
  {
    slug: "marvelous-makeover",
    title: "Marvelous Makeover",
    image: `${U}/IMG_20230508_164541973-scaled.jpg`,
    scope: "Renovation",
    video: "https://www.youtube.com/watch?v=Pq_fc-ndy9c",
    details: {
      heading: "Project material details",
      items: [
        "Furniture structure made with 19mm/12mm solid ply (Century, Austin, Green company) make.",
        "Palla or shutter make with 19mm block board (Century, Austin, Green company) make, as it is lighter and easy to handle.",
        "Cabinet/furniture back make with 6mm solid ply (Century, Austin, Green company) make.",
      ],
    },
  },
  {
    slug: "warm-whispers",
    title: "Warm Whispers",
    image: `${U}/WhatsApp-Image-2022-04-01-at-13.48.45-1.jpg`,
    scope: "Bedroom makeover",
    details: {
      heading: "Project material details",
      items: [
        "Bed back panelling in veneered 12mm ply with warm wood-tone finish.",
        "Wardrobe shutters in 19mm block board with soft-close hinges and matte laminate.",
        "Walls in a soft warm emulsion shade, curtains and soft furnishing in matching tones.",
        "Cove and profile lighting for a layered, low-glare night ambience.",
      ],
    },
  },
  {
    slug: "minimal-muse",
    title: "Minimal Muse",
    image: `${U}/ps1-scaled.jpg`,
    scope: "Modular + storage",
    details: {
      heading: "Project material details",
      items: [
        "Modular storage units in 18mm pre-laminated particle board, handle-less push-open shutters.",
        "Open shelving in matte-finish MDF for a clean, minimal display line.",
        "Neutral matte-white and greige colour palette across cabinetry and walls.",
        "Concealed lighting under and above units to keep the storage wall visually light.",
      ],
    },
  },
  {
    slug: "muted-modernity",
    title: "Muted Modernity",
    image: `${U}/IMG_20230216_191148912-scaled.jpg`,
    scope: "Full home interior",
    details: {
      heading: "Project material details",
      items: [
        "Furniture carcass in 18mm BWR plywood, shutters in matte laminate finish.",
        "False ceiling in gypsum with a muted, low-contrast colour scheme across rooms.",
        "Flooring in matte-finish vitrified tiles, 600x1200mm.",
        "Curtains, upholstery and accents kept to a restrained, tonal palette throughout.",
      ],
    },
  },
];

// Projects for the other headline verticals. Kept out of `projects` so the
// gallery, homepage and other pages keep showing interior work only; the
// service pages read them through `projectsFor`.
//   - Modular kitchen: design renders from homegeniee.com/modular-kitchen.
//     Many of those are one camera shot recoloured; each shot is used once.
//   - Architecture & civil: images from homegeniee.com's architecture page.
//   - Green scape: homegeniee.com has no photos for it yet, so these are
//     Unsplash stock placeholders until real project photos are supplied.
const K = "https://homegeniee.com/wp-content/uploads";
const UNS = (id) => `https://images.unsplash.com/photo-${id}?w=1400&q=80&auto=format&fit=crop`;

const kitchen = (slug, title, scope, files, items) => ({
  slug, title, scope, service: "modular-kitchen",
  image: `${K}/${files[0]}`,
  gallery: files.map((f) => `${K}/${f}`),
  details: { heading: "Kitchen highlights", items },
});

const civil = [
  ["architectural-survey", "Architectural Survey", "Site survey", `${K}/2024/11/Survey-e1730485571768.png`, ["Total-station survey of plot boundaries and levels.", "Survey drawing prepared as the base for design."]],
  ["civil-construction-drawing", "Civil Construction Drawing", "Architectural drawing", `${K}/2024/07/1003664_OIU9I70.jpg`, ["Floor plans, elevations and sections drawn to scale.", "Drawing set prepared for approval and construction."]],
  ["estimation-boq", "Estimation and BOQ", "Estimation", `${K}/2024/11/estimation-e1750949293662.png`, ["Itemised bill of quantities from the approved drawings.", "Material and labour estimate before work starts."]],
  ["lbs-certification", "LBS Certification", "Certification", `${K}/2024/11/LBS-e1750949346462.png`, ["Licensed building surveyor drawings and certification.", "Paperwork prepared for municipal submission."]],
  ["soil-testing", "Soil Testing", "Soil test", `${K}/2024/11/Soil-test.png`, ["On-site soil sampling for bearing capacity.", "Report used to design the foundation."]],
  ["civil-consultancy", "Civil Consultancy", "Consultancy", `${K}/2024/11/consultation-e1750949594633.png`, ["On-site consultation with an experienced civil engineer.", "Advice on structure, materials and sequencing."]],
  ["civil-contracting", "Civil Contracting", "Construction", `${K}/2025/05/person-doing-their-construction-job-scaled.jpg`, ["Construction executed against the approved drawings.", "Site supervision through to handover."]],
];

const green = [
  ["balcony-bloom", "Balcony Bloom", "Balcony gardening", "1486484290742-0ce4eb743a34", ["Potted plants layered at different heights.", "Compact bistro seating for a city balcony."]],
  ["sky-terrace-retreat", "Sky Terrace Retreat", "Terrace gardening", "1631193645836-7c0a50257618", ["Planter beds along the terrace parapet.", "Shade umbrella over a seating corner."]],
  ["evergreen-lawn", "Evergreen Lawn", "Artificial grass + hedge wall", "1633330948542-0b3bdeefcdb3", ["All-weather artificial lawn.", "Green hedge wall for privacy and colour."]],
  ["garden-lounge", "Garden Lounge", "Seating + greenery", "1646083329522-f2dce8ed4063", ["Cushioned lounge seating set into planting.", "Dense tropical planting around the seating area."]],
  ["raised-bed-deck", "Raised-Bed Deck", "Terrace planters", "1656646549569-e3ad3ff8f9f9", ["Timber deck with built-in raised planter beds.", "Gravel border for drainage."]],
  ["courtyard-canopy", "Courtyard Canopy", "Planting + seating", "1765097732474-973a92d6fb4c", ["Large-leaf planting around a paved courtyard.", "Metal garden furniture set."]],
];

export const serviceProjects = [
  kitchen("graphite-u-kitchen", "Graphite U-Kitchen", "U-shaped kitchen",
    ["2024/08/U-2-GREY-1.jpg", "2024/08/GREY-3.jpg"],
    ["U-shaped layout using three walls for maximum counter and storage.", "Graphite-grey base shutters with white wall cabinets.", "Open wooden display shelves above the counter.", "Hob and chimney on the main run, sink under the window."]),
  kitchen("teal-u-kitchen", "Teal U-Kitchen", "U-shaped kitchen",
    ["2024/08/u2-side-1.jpg"],
    ["U-shaped layout with continuous counter on three sides.", "Teal base shutters paired with teal and wood-finish wall units.", "Open shelving for everyday jars and utensils.", "Stone-finish backsplash tiles."]),
  kitchen("olive-u-kitchen", "Olive U-Kitchen", "U-shaped kitchen",
    ["2024/08/F11.jpg", "2024/08/SIDE-1.jpg"],
    ["U-shaped layout with a breakfast counter return.", "Olive-gold shutters with handle-less profiles.", "Under-cabinet lighting along the wall units.", "Wood-finish open shelves to break up the wall run."]),
  kitchen("powder-blue-l-kitchen", "Powder Blue L-Kitchen", "L-shaped kitchen",
    ["2025/03/MODEL-1.jpg"],
    ["L-shaped layout that keeps the corner fully usable.", "Powder-blue shutters with white wall units.", "Tall unit with built-in oven and microwave.", "Patterned backsplash tiles."]),
  kitchen("blush-l-kitchen", "Blush L-Kitchen", "L-shaped kitchen",
    ["2025/03/L-44.jpg"],
    ["L-shaped layout beside a full-height refrigerator.", "Blush-pink shutters on base and wall units.", "Open wooden shelves at the end of the wall run."]),
  kitchen("sage-l-kitchen", "Sage L-Kitchen", "L-shaped kitchen",
    ["2025/03/l2ff-final.jpg"],
    ["L-shaped layout with tall appliance column.", "Sage-green base shutters with white wall cabinets.", "Herringbone backsplash tiles."]),
  kitchen("ivory-l-kitchen", "Ivory L-Kitchen", "L-shaped kitchen",
    ["2025/03/F-3.jpg"],
    ["L-shaped layout under the window.", "Ivory and white shutters for a bright, open feel.", "Dark countertop for contrast and easy upkeep."]),
  kitchen("walnut-straight-kitchen", "Walnut Straight Kitchen", "Straight kitchen",
    ["2024/08/STRAIGHT-KIT-33-final.jpg"],
    ["Single-wall straight layout for compact flats.", "Walnut-tone and white base shutters.", "Wall units with open display niches."]),
  kitchen("taupe-straight-kitchen", "Taupe Straight Kitchen", "Straight kitchen",
    ["2024/08/F11-1.jpg"],
    ["Straight layout with tall refrigerator alongside.", "Taupe-grey shutters with wood-finish open shelves.", "Under-cabinet lighting over the counter."]),
  kitchen("mint-straight-kitchen", "Mint Straight Kitchen", "Straight kitchen",
    ["2024/08/STRAIGHT-KIT-4-T.jpg"],
    ["Straight layout with full-height wall storage.", "Mint and white shutters.", "Open shelves for spices and everyday items."]),
  ...civil.map(([slug, title, scope, image, items]) => ({
    slug, title, scope, image, service: "architectural-civil",
    details: { heading: "Scope of work", items },
  })),
  ...green.map(([slug, title, scope, id, items]) => ({
    slug, title, scope, image: UNS(id), service: "green-scape",
    details: { heading: "Project highlights", items },
  })),
];

// Interior design uses the original list; the other verticals their own.
export const projectsFor = (service) =>
  service === "interior-design" ? projects : serviceProjects.filter((p) => p.service === service);

export const getProject = (slug) =>
  projects.find((p) => p.slug === slug) ?? serviceProjects.find((p) => p.slug === slug);

// Accepts watch?v=, youtu.be/, and shorts/ URLs.
export const youtubeId = (url) => {
  if (!url) return null;
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
};
