const IMG = "https://homegeniee.com/wp-content/uploads";

// Every vertical from the homepage, with its exact eyebrow + heading + copy.
// `sections` power the anchor sub-navigation carried over from the WordPress URLs.
export const services = [
  {
    slug: "interior-design",
    short: "Interior design",
    eyebrow: "Elevate Your Living Space",
    title: "Interior Design and Stylish Accessories",
    body: "Transform your home with curated interior design elements that blend elegance and functionality. From modern minimalism to timeless classics, our collection enhances every room with smart organization and sophisticated aesthetics. Redesign your living space with premium accessories that bring harmony, style, and inspiration.",
    image: `${IMG}/2025/08/WhatsApp-Image-2025-07-22-at-15.06.13-4.jpeg`,
    video: "/videos/services/interior-design.mp4",
    videoPoster: "/videos/services/interior-design-poster.jpg",
    // The three real sub-services that sit under Interior Design in the
    // nav — each links out to its own full page rather than an enquiry
    // modal, same href pattern Furniture already uses for the Collection.
    sections: [
      { id: "wall-decor", label: "Wall Decor", body: "Panels, murals, wallpaper and painted finishes — the wall treatments that carry most of a room's character.", href: "/services/wall-decor", image: "/img/services/wall-decor.jpg" },
      { id: "false-ceiling", label: "False Ceiling", body: "POP, gypsum, grid and CNC-cut ceiling designs that hide wiring and shape the room's lighting.", href: "/services/false-ceiling", image: "/img/services/false-ceiling.jpg" },
      { id: "furniture", label: "Furniture", body: "Made-to-fit seating, storage and case goods, plus the ready-to-order HomeGeniee Collection.", href: "/services/furniture", image: "/img/services/furniture.jpg" },
    ],
  },
  {
    slug: "modular-kitchen",
    short: "Modular kitchen",
    eyebrow: "Modular Perfection",
    title: "Modular Kitchen Design",
    body: "Transform your kitchen with modular designs that blend elegance, functionality, and smart storage solutions. From modern minimalism to timeless classics, our premium collection enhances your space with efficiency and style. Upgrade to a sophisticated, well-organized kitchen that perfectly complements your lifestyle.",
    image: "/img/services/modular-kitchen.jpg",
    video: "/videos/services/modular-kitchen.mp4",
    videoPoster: "/videos/services/modular-kitchen-poster.jpg",
    // Full-HD cut for the page hero; `video` stays the light card version.
    heroVideo: "/videos/services/modular-kitchen-hero.mp4",
    heroPoster: "/videos/services/modular-kitchen-hero-poster.jpg",
    sections: [],
  },
  {
    slug: "false-ceiling",
    eyebrow: "Transform Your Ceiling With Style",
    title: "Home Geniee False Ceiling Collection",
    body: "Add style and function with Home Geniee's false ceiling designs. Perfect for modern homes, our ceilings enhance lighting, hide wiring, and elevate your room's look with elegance and comfort.",
    image: "/img/services/false-ceiling.jpg",
    sections: [
      { id: "pop", label: "POP Ceiling", body: "Plaster-of-Paris ceilings shaped on site, ideal for coves, curves and recessed lighting profiles.", image: "/img/services/false-ceiling.jpg"},
      { id: "gypsum", label: "Gypsum Ceiling", body: "Factory-finished gypsum board on a metal grid — flat, fast to install and easy to service.", image: "/img/services/false-ceiling.jpg"},
      { id: "grid", label: "Grid Ceiling", body: "Modular lay-in tiles on an exposed T-grid, giving full access to the plenum above.", image: "/img/services/false-ceiling.jpg"},
      { id: "wooden", label: "Wooden Ceiling", body: "Warm timber and veneer battens that add texture and soften acoustics.", image: "/img/services/false-ceiling.jpg"},
      { id: "metal", label: "Metal Ceiling", body: "Powder-coated metal panels for durability in kitchens, balconies and commercial spaces.", image: "/img/services/false-ceiling.jpg"},
      { id: "pvc", label: "PVC Panel Ceiling", body: "Moisture-resistant panels suited to bathrooms, utility areas and humid Kolkata summers.", image: "/img/services/false-ceiling.jpg"},
      { id: "jafri", label: "Jafri / CNC Ceiling", body: "CNC-cut jali screens that filter light and carry pattern across the whole ceiling plane.", image: "/img/services/false-ceiling.jpg"},
    ],
  },
  {
    slug: "furniture",
    eyebrow: "Style Meets Comfort",
    title: "Modern Furniture",
    body: "Upgrade your home with sleek, contemporary furniture designed for elegance and functionality. Our curated collection combines premium materials, smart designs, and timeless aesthetics to create spaces that inspire.",
    image: "/img/services/furniture.jpg",
    sections: [
      { id: "collection", label: "HomeGeniee Collection", body: "Our ready-to-order utility line — puja units, kitchen and study storage, wall shelving — the pre-order catalogue that started as furniture, now its own showcase.", href: "/collection", image: "/img/services/furniture.jpg" },
    ],
  },
  {
    slug: "wall-decor",
    eyebrow: "Transform Your Walls With Style",
    title: "Home Geniee Wall Decor Collection",
    body: "Discover unique wall decor that brings character and style to your home. From modern panels to artistic finishes, our designs turn empty walls into elegant statements.",
    image: "/img/services/wall-decor.jpg",
    sections: [
      { id: "wall-paint", label: "Normal Wall Paint", body: "Emulsion and texture finishes, surface-prepped and applied to a clean, even coat.", image: "https://images.unsplash.com/photo-1514942456527-c0bc52b69013?w=800&q=80&auto=format&fit=crop"},
      { id: "mural", label: "Wall Mural / Art Painting", body: "Hand-painted murals scaled to the wall and the room's light.", image: "https://images.unsplash.com/photo-1724131498859-197e92aefb4b?w=800&q=80&auto=format&fit=crop"},
      { id: "painting", label: "Customised Wall Painting", body: "Motifs, colourways and finishes worked out with you before a brush touches the wall.", image: "https://images.unsplash.com/photo-1633614027197-44f01c3ba7c7?w=800&q=80&auto=format&fit=crop"},
      { id: "wallpaper", label: "Customised Wallpaper", body: "Printed to your artwork and your exact wall dimensions.", image: "https://images.unsplash.com/photo-1644180892282-038d799663dd?w=800&q=80&auto=format&fit=crop"},
      { id: "3d", label: "3D Wallpaper", body: "Depth-effect prints that give a flat wall relief without losing floor area.", image: "https://images.unsplash.com/photo-1491183672482-d0af0e44929d?w=800&q=80&auto=format&fit=crop"},
      { id: "pop", label: "POP Panel", body: "Moulded plaster panelling for classical profiles and recessed detail.", image: "https://images.unsplash.com/photo-1780123942992-bb7a449452c4?w=800&q=80&auto=format&fit=crop"},
      { id: "wood", label: "Wood / Plywood Panel", body: "Veneered and laminated ply panelling, the warmest of the wall treatments.", image: "https://images.unsplash.com/photo-1543751416-705d3e34d02a?w=800&q=80&auto=format&fit=crop"},
      { id: "pvc", label: "PVC Panel", body: "Low-maintenance, moisture-tolerant panelling for high-traffic walls.", image: "https://images.unsplash.com/photo-1612538498488-226257115cc4?w=800&q=80&auto=format&fit=crop"},
      { id: "louver", label: "Louver Panel", body: "Vertical slat panelling that adds rhythm and hides services behind it.", image: "https://images.unsplash.com/photo-1675528030748-d463ab87e8d5?w=800&q=80&auto=format&fit=crop"},
      { id: "glass", label: "Glass Panel", body: "Back-painted and textured glass that bounces light into darker rooms.", image: "https://images.unsplash.com/photo-1776671183498-72570903b06c?w=800&q=80&auto=format&fit=crop"},
      { id: "fabric", label: "Fabric Panel", body: "Upholstered panels that soften both the look and the acoustics of a room.", image: "https://images.unsplash.com/photo-1643313262988-cdc5f50c6019?w=800&q=80&auto=format&fit=crop"},
    ],
  },
  {
    slug: "architectural-civil",
    short: "Architecture and civil",
    eyebrow: "Building The Future",
    title: "Architecture and Civil",
    body: "Experience innovative architecture and civil engineering solutions that blend functionality, aesthetics, and durability. From modern structures to timeless designs, we craft spaces that inspire and endure.",
    image: "/img/services/architectural-civil.jpg",
    video: "/videos/services/architectural-civil.mp4",
    videoPoster: "/videos/services/architectural-civil-poster.jpg",
    sections: [
      { id: "fabricator", label: "HomeGeniee Fabricator", body: "Our in-house fabrication team turns a design into fitted carpentry and metalwork — one contractor, not three, for anything built to order.", image: "/img/services/architectural-civil.jpg"},
    ],
  },
  {
    slug: "aluminium-upvc",
    eyebrow: "Seamless Design, Lasting Performance",
    title: "uPVC and Aluminium Windows and Doors",
    body: "Upgrade your space with high-performance uPVC and aluminium fittings—offering sleek aesthetics, superior insulation, and long-lasting durability for both modern and traditional homes.",
    image: "/img/services/aluminium-upvc.jpg",
    sections: [
      { id: "sliding", label: "Sliding Window", body: "Space-saving sliding sashes for balconies and tight reveals.", image: "/img/services/aluminium-upvc.jpg"},
      { id: "casement", label: "Casement Window", body: "Side-hung sashes that open fully for maximum ventilation.", image: "/img/services/aluminium-upvc.jpg"},
      { id: "louvers", label: "Louvers Window", body: "Adjustable slats for airflow with privacy retained.", image: "/img/services/aluminium-upvc.jpg"},
    ],
  },
  {
    slug: "green-scape",
    short: "Green scape",
    eyebrow: "Stylish Outdoor Spaces, Relaxed Living",
    title: "Balcony and Terrace Decor",
    body: "Transform your balcony or terrace with elegant decor, featuring cozy seating, lush greenery, and modern accents to create a serene and stylish outdoor retreat.",
    image: "/img/services/green-scape.jpg",
    video: "/videos/services/green-scape.mp4",
    videoPoster: "/videos/services/green-scape-poster.jpg",
    // No sub-modules, by request — the page runs the shared featured layout only.
    sections: [],
  },
  {
    slug: "shade-work",
    eyebrow: "Style Meets Shade, Comfort Meets Craft",
    title: "Premium Shade Work Solutions",
    body: "Create cool, comfortable spaces with stylish shade structures—perfect for terraces, balconies, gardens, or commercial areas. Designed to elevate aesthetics while offering protection from heat, rain, and glare.",
    image: "/img/services/shade-work.jpg",
    sections: [
      { id: "shade", label: "Shade Work", body: "Fixed and retractable shade structures sized to the sun path on your site.", image: "/img/services/shade-work.jpg"},
      { id: "grill", label: "MS Grill for Window / Balcony / Terrace", body: "Fabricated steel grills that secure an opening without closing off the view.", image: "/img/services/shade-work.jpg"},
      { id: "collapsible", label: "Collapsible Gate", body: "Folding gates for entrances that need to open wide and lock tight.", image: "/img/services/shade-work.jpg"},
      { id: "shutter", label: "Shutter Gate", body: "Rolling shutters for garages, shopfronts and service entries.", image: "/img/services/shade-work.jpg"},
    ],
  },
  {
    slug: "home-makeover",
    eyebrow: "Personalized Interiors, Inspired Living",
    title: "Room Makeover",
    body: "Give your room a fresh new look with stylish designs tailored to your taste. From smart storage solutions to vibrant color themes, we transform your space into a cozy, functional, and stunning haven.",
    image: `${IMG}/2024/09/ps1-scaled.jpg`,
    sections: [],
  },
  {
    slug: "renovation",
    eyebrow: "Transform Your Space With Expert Renovation Services",
    title: "Renovation",
    body: "Give your old room a fresh, modern look with our professional renovation solutions. From flooring upgrades to wall treatments, lighting enhancements, and complete interior redesigns, we ensure your space is functional, stylish, and perfectly aligned with your lifestyle.",
    image: `${IMG}/2024/09/IMG_20230508_164541973-scaled.jpg`,
    sections: [],
  },
  {
    slug: "property-consultancy",
    eyebrow: "Paperwork, Handled",
    title: "Property Consultancy",
    body: "Mutation and property documentation handled end to end, so ownership records match reality before you build on them.",
    image: `${IMG}/2025/08/wood-layout-img-1.jpg`,
    sections: [
      { id: "kmc", label: "KMC Mutation", body: "Kolkata Municipal Corporation mutation filed and followed through to record update.", image: `${IMG}/2025/08/wood-layout-img-1.jpg`},
      { id: "thika", label: "THIKA Mutation", body: "THIKA tenancy mutation prepared and processed with the relevant authority.", image: `${IMG}/2025/08/wood-layout-img-1.jpg`},
    ],
  },
];

export const getService = (slug) => services.find((s) => s.slug === slug);

// The four verticals fronted on the homepage and in the nav — the rest of
// the catalogue still lives at its own /services/:slug, just not headlined.
export const FEATURED_SLUGS = ["interior-design", "modular-kitchen", "architectural-civil", "green-scape"];
export const featuredServices = FEATURED_SLUGS.map(getService);
