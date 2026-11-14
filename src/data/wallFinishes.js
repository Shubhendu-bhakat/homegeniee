// Wall Decor finishes, grouped the way the page presents them: three
// categories, each with its own finishes and colour options. `calcTier` is the
// matching option in the cost calculator's "Wall finish" question.
const c = (label, color) => ({ label, color });

export const WALL_CATS = [
  {
    id: "paint", title: "Wall Paint", tag: "3 finishes", calcTier: 0,
    plan: "M8 14h26M8 26h32M8 38h20",
  },
  {
    id: "wallpaper", title: "Wallpaper", tag: "3 finishes", calcTier: 1,
    plan: "M10 8v32M24 8v32M38 8v32",
  },
  {
    id: "panel", title: "Panels", tag: "6 finishes", calcTier: 2,
    plan: "M10 10h12v28H10zM26 10h12v28H26z",
  },
];

export const WALL_FINISHES = [
  // ---- Wall paint ---------------------------------------------------------
  {
    id: "wall-paint", cat: "paint", label: "Normal Wall Paint",
    body: "Emulsion and texture finishes, surface-prepped and applied to a clean, even coat.",
    best: ["Every room, every budget", "Quick refresh before a move-in", "Easy to touch up later"],
    colorLabel: "Paint colour",
    options: [c("Warm white", "#efe8dc"), c("Sage", "#a9b7a0"), c("Terracotta", "#c98763"), c("Powder blue", "#a9c1d6"),
      c("Mustard", "#d6b25a"), c("Blush", "#e2b7b0"), c("Charcoal", "#4a4f55"), c("Navy", "#2c3e5c")],
  },
  {
    id: "mural", cat: "paint", label: "Wall Mural / Art Painting",
    body: "Hand-painted murals scaled to the wall and the room's light.",
    best: ["Feature walls and kids' rooms", "Living-room statement walls", "Anyone wanting a one-off piece"],
    colorLabel: "Mural palette",
    options: [c("Sage hills", "#a9b7a0"), c("Dusk blue", "#6f8fb0"), c("Terracotta sun", "#c98763"),
      c("Blush", "#e2b7b0"), c("Forest night", "#355a4a")],
  },
  {
    id: "painting", cat: "paint", label: "Customised Wall Painting",
    body: "Motifs, colourways and finishes worked out with you before a brush touches the wall.",
    best: ["Pooja rooms and nurseries", "Matching a colour scheme exactly", "Motifs from your own reference"],
    colorLabel: "Motif colour",
    options: [c("Navy", "#2c3e5c"), c("Teal", "#2f8a83"), c("Mustard", "#d6b25a"), c("Blush", "#d9a6a0"), c("Graphite", "#5f6b73")],
  },

  // ---- Wallpaper ----------------------------------------------------------
  {
    id: "wallpaper-normal", cat: "wallpaper", label: "Normal Wallpaper",
    body: "Ready-made textured and striped wallpaper in a wide range of tones, hung seam-matched.",
    best: ["Bedroom headboard walls", "Rooms with an existing colour story", "Fast change with little mess"],
    colorLabel: "Wallpaper colour",
    options: [c("Ivory", "#e9e3d6"), c("Stone grey", "#b9b6b0"), c("Sand", "#cdb99a"), c("Sage", "#a9b7a0"), c("Slate blue", "#7c91a8")],
  },
  {
    id: "wallpaper", cat: "wallpaper", label: "Customised Wallpaper",
    body: "Printed to your artwork and your exact wall dimensions.",
    best: ["A print nobody else has", "Branding or a family motif", "Walls with unusual dimensions"],
    colorLabel: "Print colourway",
    options: [c("Sage garden", "#8fa58a"), c("Navy bloom", "#34486a"), c("Blush", "#d9a6a0"), c("Mustard", "#d1a24a"), c("Teal", "#2f8a83")],
  },
  {
    id: "3d", cat: "wallpaper", label: "3D Wallpaper",
    body: "Depth-effect prints that give a flat wall relief without losing floor area.",
    best: ["Small rooms that need depth", "TV and sofa back walls", "Bold, modern interiors"],
    colorLabel: "Wallpaper colour",
    options: [c("Ivory", "#ece7de"), c("Silver grey", "#a8aaad"), c("Gold", "#c4a265"), c("Charcoal", "#44474c"), c("Teal", "#3a7f7a")],
  },

  // ---- Panels -------------------------------------------------------------
  {
    id: "pop", cat: "panel", label: "POP Panel",
    body: "Moulded plaster panelling for classical profiles and recessed detail.",
    best: ["Classical or ornate interiors", "Recessed niches and cornices", "Walls that need clean mouldings"],
    colorLabel: "Paint colour",
    options: [c("White", "#f4f1ea"), c("Cream", "#e6dcc8"), c("Greige", "#cfc6b8"), c("Sage", "#b9c5b0"), c("Powder blue", "#c3d1de")],
  },
  {
    id: "wood", cat: "panel", label: "Wood / Plywood Panel",
    body: "Veneered and laminated ply panelling, the warmest of the wall treatments.",
    best: ["Warm living and bedroom walls", "TV units and headboards", "Hiding uneven walls"],
    colorLabel: "Veneer",
    options: [c("Natural oak", "#d2b48a"), c("Teak", "#b07a45"), c("Walnut", "#7a5236"), c("Whitewash", "#e6dfd2"), c("Ebony", "#3b2d25")],
  },
  {
    id: "pvc", cat: "panel", label: "PVC Panel",
    body: "Low-maintenance, moisture-tolerant panelling for high-traffic walls.",
    best: ["Kitchens, bathrooms, balconies", "Damp-prone or high-traffic walls", "Low-maintenance homes"],
    colorLabel: "Panel finish",
    options: [c("White marble", "#f2f1ee"), c("Grey stone", "#b3aea7"), c("Beige", "#d6c7ae"), c("Black marble", "#2e2e30"), c("Blue", "#4f6f94")],
  },
  {
    id: "louver", cat: "panel", label: "Louver Panel",
    body: "Vertical slat panelling that adds rhythm and hides services behind it.",
    best: ["Entryways and room dividers", "Hiding switch boards and pipes", "Modern, rhythmic feature walls"],
    colorLabel: "Slat finish",
    options: [c("Oak", "#c9a26e"), c("Walnut", "#7a5236"), c("Black", "#26272a"), c("White", "#f2f1ee"), c("Sage", "#8fa58a")],
  },
  {
    id: "glass", cat: "panel", label: "Glass Panel",
    body: "Back-painted and textured glass that bounces light into darker rooms.",
    best: ["Dark rooms that need light", "Pooja and dining feature walls", "Premium, polished interiors"],
    colorLabel: "Glass colour",
    options: [c("Champagne", "#cdb894"), c("Black", "#1c1d20"), c("Navy", "#26405f"), c("Sage", "#8fa58a"), c("Frosted white", "#eceff1")],
  },
  {
    id: "fabric", cat: "panel", label: "Fabric Panel",
    body: "Upholstered panels that soften both the look and the acoustics of a room.",
    best: ["Bedrooms and home theatres", "Better room acoustics", "Soft, upholstered luxury"],
    colorLabel: "Fabric",
    options: [c("Beige", "#cdbfa8"), c("Grey", "#8e9298"), c("Teal", "#2f6f6b"), c("Mauve", "#9a7b86"), c("Navy", "#34486a")],
  },
];

export const getFinish = (id) => WALL_FINISHES.find((f) => f.id === id);
export const finishesIn = (cat) => WALL_FINISHES.filter((f) => f.cat === cat);
