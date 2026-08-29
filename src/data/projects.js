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

export const getProject = (slug) => projects.find((p) => p.slug === slug);

// Accepts watch?v=, youtu.be/, and shorts/ URLs.
export const youtubeId = (url) => {
  if (!url) return null;
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
};
