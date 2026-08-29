const IMG = "https://homegeniee.com/wp-content/uploads";

// Every vertical from the homepage, with its exact eyebrow + heading + copy.
// `sections` power the anchor sub-navigation carried over from the WordPress URLs.
export const services = [
  {
    slug: "interior-design",
    eyebrow: "Elevate Your Living Space",
    title: "Interior Design & Stylish Accessories",
    body: "Transform your home with curated interior design elements that blend elegance and functionality. From modern minimalism to timeless classics, our collection enhances every room with smart organization and sophisticated aesthetics. Redesign your living space with premium accessories that bring harmony, style, and inspiration.",
    image: `${IMG}/2025/08/WhatsApp-Image-2025-07-22-at-15.06.13-4.jpeg`,
    sections: [
      { id: "fabricator", label: "HomeGeniee Fabricator", body: "Our in-house fabrication team turns a design into fitted carpentry and metalwork — one contractor, not three, for anything built to order." },
    ],
  },
  {
    slug: "modular-kitchen",
    eyebrow: "Modular Perfection",
    title: "Modular Kitchen Design",
    body: "Transform your kitchen with modular designs that blend elegance, functionality, and smart storage solutions. From modern minimalism to timeless classics, our premium collection enhances your space with efficiency and style. Upgrade to a sophisticated, well-organized kitchen that perfectly complements your lifestyle.",
    image: "/img/services/modular-kitchen.jpg",
    sections: [],
  },
  {
    slug: "false-ceiling",
    eyebrow: "Transform Your Ceiling With Style",
    title: "Home Geniee False Ceiling Collection",
    body: "Add style and function with Home Geniee's false ceiling designs. Perfect for modern homes, our ceilings enhance lighting, hide wiring, and elevate your room's look with elegance and comfort.",
    image: "/img/services/false-ceiling.jpg",
    sections: [
      { id: "pop", label: "POP Ceiling", body: "Plaster-of-Paris ceilings shaped on site, ideal for coves, curves and recessed lighting profiles." },
      { id: "gypsum", label: "Gypsum Ceiling", body: "Factory-finished gypsum board on a metal grid — flat, fast to install and easy to service." },
      { id: "grid", label: "Grid Ceiling", body: "Modular lay-in tiles on an exposed T-grid, giving full access to the plenum above." },
      { id: "wooden", label: "Wooden Ceiling", body: "Warm timber and veneer battens that add texture and soften acoustics." },
      { id: "metal", label: "Metal Ceiling", body: "Powder-coated metal panels for durability in kitchens, balconies and commercial spaces." },
      { id: "pvc", label: "PVC Panel Ceiling", body: "Moisture-resistant panels suited to bathrooms, utility areas and humid Kolkata summers." },
      { id: "jafri", label: "Jafri / CNC Ceiling", body: "CNC-cut jali screens that filter light and carry pattern across the whole ceiling plane." },
    ],
  },
  {
    slug: "furniture",
    eyebrow: "Style Meets Comfort",
    title: "Modern Furniture",
    body: "Upgrade your home with sleek, contemporary furniture designed for elegance and functionality. Our curated collection combines premium materials, smart designs, and timeless aesthetics to create spaces that inspire.",
    image: "/img/services/furniture.jpg",
    sections: [
      { id: "collection", label: "HomeGeniee Collection", body: "Our ready-to-order utility line — puja units, kitchen and study storage, wall shelving — the pre-order catalogue that started as furniture, now its own showcase.", href: "/collection" },
    ],
  },
  {
    slug: "facade-elevational",
    eyebrow: "Enhance Aesthetics, Elevate Impressions",
    title: "Interior & Exterior Facade Decor",
    body: "Enhance your home's aesthetics with stylish interior and exterior facade décor, featuring elegant textures, modern finishes, and timeless designs for a sophisticated look.",
    image: "/img/services/facade-elevational.jpg",
    sections: [
      { id: "acp", label: "ACP Facade", body: "Aluminium composite panels in a wide finish range, cut and folded to the elevation drawing." },
      { id: "glass", label: "Glass Facade", body: "Structural and semi-structural glazing that opens the elevation up to daylight." },
      { id: "ms", label: "MS Facade", body: "Mild steel framing and cladding for robust, weldable elevation features." },
    ],
  },
  {
    slug: "wall-decor",
    eyebrow: "Transform Your Walls With Style",
    title: "Home Geniee Wall Decor Collection",
    body: "Discover unique wall decor that brings character and style to your home. From modern panels to artistic finishes, our designs turn empty walls into elegant statements.",
    image: "/img/services/wall-decor.jpg",
    sections: [
      { id: "wall-paint", label: "Normal Wall Paint", body: "Emulsion and texture finishes, surface-prepped and applied to a clean, even coat." },
      { id: "mural", label: "Wall Mural / Art Painting", body: "Hand-painted murals scaled to the wall and the room's light." },
      { id: "painting", label: "Customised Wall Painting", body: "Motifs, colourways and finishes worked out with you before a brush touches the wall." },
      { id: "wallpaper", label: "Customised Wallpaper", body: "Printed to your artwork and your exact wall dimensions." },
      { id: "3d", label: "3D Wallpaper", body: "Depth-effect prints that give a flat wall relief without losing floor area." },
      { id: "pop", label: "POP Panel", body: "Moulded plaster panelling for classical profiles and recessed detail." },
      { id: "wood", label: "Wood / Plywood Panel", body: "Veneered and laminated ply panelling, the warmest of the wall treatments." },
      { id: "pvc", label: "PVC Panel", body: "Low-maintenance, moisture-tolerant panelling for high-traffic walls." },
      { id: "louver", label: "Louver Panel", body: "Vertical slat panelling that adds rhythm and hides services behind it." },
      { id: "glass", label: "Glass Panel", body: "Back-painted and textured glass that bounces light into darker rooms." },
      { id: "fabric", label: "Fabric Panel", body: "Upholstered panels that soften both the look and the acoustics of a room." },
    ],
  },
  {
    slug: "architectural-civil",
    eyebrow: "Building The Future",
    title: "Architecture & Civil",
    body: "Experience innovative architecture and civil engineering solutions that blend functionality, aesthetics, and durability. From modern structures to timeless designs, we craft spaces that inspire and endure.",
    image: "/img/services/architectural-civil.jpg",
    sections: [
      { id: "survey", label: "Surveying", body: "Site measurement and levels recorded before any line is drawn." },
      { id: "drawing", label: "Architectural and Civil Construction Drawing", body: "Full drawing sets — plans, sections, elevations and details — ready to build from." },
      { id: "boq", label: "Estimation and BOQ", body: "Itemised bill of quantities so the cost is legible line by line, not a single lump figure." },
      { id: "lbs", label: "LBS Certification", body: "Licensed Building Surveyor certification for sanction and municipal approval." },
      { id: "soil-test", label: "Soil Test", body: "Bearing capacity and soil profile established before foundation design." },
      { id: "consultancy", label: "Civil Consultancy", body: "Advisory across structure, compliance and sequencing for the whole build." },
      { id: "contractor", label: "Civil Work Execution Contractor", body: "Execution on site against the approved drawing set and BOQ." },
      { id: "mep", label: "MEP Drawing", body: "Mechanical, electrical and plumbing layouts coordinated with the architecture." },
    ],
  },
  {
    slug: "aluminium-upvc",
    eyebrow: "Seamless Design, Lasting Performance",
    title: "uPVC & Aluminium Windows & Doors",
    body: "Upgrade your space with high-performance uPVC and aluminium fittings—offering sleek aesthetics, superior insulation, and long-lasting durability for both modern and traditional homes.",
    image: "/img/services/aluminium-upvc.jpg",
    sections: [
      { id: "sliding", label: "Sliding Window", body: "Space-saving sliding sashes for balconies and tight reveals." },
      { id: "casement", label: "Casement Window", body: "Side-hung sashes that open fully for maximum ventilation." },
      { id: "louvers", label: "Louvers Window", body: "Adjustable slats for airflow with privacy retained." },
    ],
  },
  {
    slug: "green-scape",
    eyebrow: "Stylish Outdoor Spaces, Relaxed Living",
    title: "Balcony & Terrace Decor",
    body: "Transform your balcony or terrace with elegant decor, featuring cozy seating, lush greenery, and modern accents to create a serene and stylish outdoor retreat.",
    image: "/img/services/green-scape.jpg",
    sections: [
      { id: "artificial", label: "Artificial Grass", body: "All-weather turf for terraces and balconies where real lawn will not survive." },
      { id: "vertical", label: "Vertical Gardening", body: "Living wall systems that add green without spending floor area." },
      { id: "terrace", label: "Terrace Gardening", body: "Waterproofed, drained and planted terraces built to last through monsoon." },
      { id: "balcony", label: "Balcony Gardening", body: "Compact planting, seating and screening for city balconies." },
      { id: "swing", label: "Swing Installation", body: "Anchored swings sized and fixed to the structure they hang from." },
    ],
  },
  {
    slug: "shade-work",
    eyebrow: "Style Meets Shade, Comfort Meets Craft",
    title: "Premium Shade Work Solutions",
    body: "Create cool, comfortable spaces with stylish shade structures—perfect for terraces, balconies, gardens, or commercial areas. Designed to elevate aesthetics while offering protection from heat, rain, and glare.",
    image: "/img/services/shade-work.jpg",
    sections: [
      { id: "shade", label: "Shade Work", body: "Fixed and retractable shade structures sized to the sun path on your site." },
      { id: "grill", label: "MS Grill for Window / Balcony / Terrace", body: "Fabricated steel grills that secure an opening without closing off the view." },
      { id: "collapsible", label: "Collapsible Gate", body: "Folding gates for entrances that need to open wide and lock tight." },
      { id: "shutter", label: "Shutter Gate", body: "Rolling shutters for garages, shopfronts and service entries." },
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
      { id: "kmc", label: "KMC Mutation", body: "Kolkata Municipal Corporation mutation filed and followed through to record update." },
      { id: "thika", label: "THIKA Mutation", body: "THIKA tenancy mutation prepared and processed with the relevant authority." },
    ],
  },
];

export const getService = (slug) => services.find((s) => s.slug === slug);

// The five verticals fronted on the homepage and in the nav — the rest of
// the catalogue still lives at its own /services/:slug, just not headlined.
export const FEATURED_SLUGS = ["interior-design", "modular-kitchen", "architectural-civil", "facade-elevational", "green-scape"];
export const featuredServices = FEATURED_SLUGS.map(getService);
