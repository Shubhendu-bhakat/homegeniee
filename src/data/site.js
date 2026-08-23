export const site = {
  name: "Home Geniee",
  tagline: "Interior Designers in Kolkata",
  since: 2016,
  logo: "/logo.png",
  phonePrimary: "+919831687191",
  phonePrimaryLabel: "+91 98316 87191",
  phoneSecondary: "8777253087",
  phoneSecondaryLabel: "8777253087",
  whatsapp: "919831687191",
  appointment: "+918697015633",
  address: {
    line1: "70, Serpentine Lane, Kolkata - 700014",
    line2: "Fl-4, Beside Koley Market, Opp NRS Hospital",
  },
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/Homegenieedecor/" },
    { label: "Instagram", href: "https://www.instagram.com/homegeniee/" },
    { label: "YouTube", href: "https://www.youtube.com/@homegeniee951" },
  ],
};

// Mega-menu categories, carried over from the Woodmart category sidebar.
export const categoryMenu = [
  {
    label: "Wall Decor",
    to: "/services/wall-decor",
    children: [
      { label: "Normal Wall Paint", to: "/services/wall-decor#wall-paint" },
      { label: "Wall Mural / Art Painting", to: "/services/wall-decor#mural" },
      { label: "Customised Wall Painting", to: "/services/wall-decor#painting" },
      { label: "Customised Wallpaper", to: "/services/wall-decor#wallpaper" },
      { label: "3D Wallpaper", to: "/services/wall-decor#3d" },
      { label: "POP Panel", to: "/services/wall-decor#pop" },
      { label: "Wood / Plywood Panel", to: "/services/wall-decor#wood" },
      { label: "PVC Panel", to: "/services/wall-decor#pvc" },
      { label: "Louver Panel", to: "/services/wall-decor#louver" },
      { label: "Glass Panel", to: "/services/wall-decor#glass" },
      { label: "Fabric Panel", to: "/services/wall-decor#fabric" },
    ],
  },
  { label: "Modular Kitchen", to: "/services/modular-kitchen", children: [] },
  {
    label: "False Ceiling",
    to: "/services/false-ceiling",
    children: [
      { label: "POP Ceiling", to: "/services/false-ceiling#pop" },
      { label: "Gypsum Ceiling", to: "/services/false-ceiling#gypsum" },
      { label: "Grid Ceiling", to: "/services/false-ceiling#grid" },
      { label: "Wooden Ceiling", to: "/services/false-ceiling#wooden" },
      { label: "Metal Ceiling", to: "/services/false-ceiling#metal" },
      { label: "PVC Panel Ceiling", to: "/services/false-ceiling#pvc" },
      { label: "Jafri / CNC Ceiling", to: "/services/false-ceiling#jafri" },
    ],
  },
  { label: "Furniture", to: "/services/furniture", children: [] },
  {
    label: "Green Scape",
    to: "/services/green-scape",
    children: [
      { label: "Artificial Grass", to: "/services/green-scape#artificial" },
      { label: "Vertical Gardening", to: "/services/green-scape#vertical" },
      { label: "Terrace Gardening", to: "/services/green-scape#terrace" },
      { label: "Balcony Gardening", to: "/services/green-scape#balcony" },
      { label: "Swing Installation", to: "/services/green-scape#swing" },
    ],
  },
  {
    label: "Facade Elevational Work",
    to: "/services/facade-elevational",
    children: [
      { label: "ACP Facade", to: "/services/facade-elevational#acp" },
      { label: "Glass Facade", to: "/services/facade-elevational#glass" },
      { label: "MS Facade", to: "/services/facade-elevational#ms" },
    ],
  },
  {
    label: "MS Elevational Work",
    to: "/services/shade-work",
    children: [
      { label: "Shade Work", to: "/services/shade-work#shade" },
      { label: "MS Grill for Window / Balcony / Terrace", to: "/services/shade-work#grill" },
      { label: "Collapsible Gate", to: "/services/shade-work#collapsible" },
      { label: "Shutter Gate", to: "/services/shade-work#shutter" },
    ],
  },
  {
    label: "Aluminium / uPVC Door Window",
    to: "/services/aluminium-upvc",
    children: [
      { label: "Sliding Window", to: "/services/aluminium-upvc#sliding" },
      { label: "Casement Window", to: "/services/aluminium-upvc#casement" },
      { label: "Louvers Window", to: "/services/aluminium-upvc#louvers" },
    ],
  },
];

// Primary navigation, mirroring the WordPress header.
export const mainNav = [
  { label: "Interior Design", to: "/services/interior-design" },
  { label: "HomeGeniee Collection", to: "/collection" },
  {
    label: "Architectural & Civil",
    to: "/services/architectural-civil",
    children: [
      { label: "Surveying", to: "/services/architectural-civil#survey" },
      { label: "Architectural & Civil Construction Drawing", to: "/services/architectural-civil#drawing" },
      { label: "Estimation and BOQ", to: "/services/architectural-civil#boq" },
      { label: "LBS Certification", to: "/services/architectural-civil#lbs" },
      { label: "Soil Test", to: "/services/architectural-civil#soil-test" },
      { label: "Civil Consultancy", to: "/services/architectural-civil#consultancy" },
      { label: "Civil Work Execution Contractor", to: "/services/architectural-civil#contractor" },
      { label: "MEP Drawing", to: "/services/architectural-civil#mep" },
    ],
  },
  {
    label: "Property Consultancy",
    to: "/services/property-consultancy",
    children: [
      { label: "KMC Mutation", to: "/services/property-consultancy#kmc" },
      { label: "THIKA Mutation", to: "/services/property-consultancy#thika" },
    ],
  },
  {
    label: "Green Scape",
    to: "/services/green-scape",
    children: [
      { label: "Artificial Grass", to: "/services/green-scape#artificial" },
      { label: "Vertical Gardening", to: "/services/green-scape#vertical" },
      { label: "Terrace Gardening", to: "/services/green-scape#terrace" },
      { label: "Balcony Gardening", to: "/services/green-scape#balcony" },
      { label: "Swing Installation", to: "/services/green-scape#swing" },
    ],
  },
  { label: "Gallery", to: "/gallery" },
];

export const footerLinks = {
  Categories: [
    { label: "Architectural", to: "/services/architectural-civil" },
    { label: "Property Consultancy", to: "/services/property-consultancy" },
    { label: "Home Decor", to: "/services/interior-design" },
    { label: "Modular Kitchen", to: "/services/modular-kitchen" },
    { label: "Furniture", to: "/services/furniture" },
    { label: "False Ceiling", to: "/services/false-ceiling" },
  ],
  "Policy Links": [
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Terms & Conditions", to: "/terms-conditions" },
  ],
  "Our Links": [
    { label: "About Us", to: "/about" },
    { label: "Contact Us", to: "/contact" },
    { label: "Offer / Promotions", to: "/collection" },
    { label: "Stores", to: "/collection" },
  ],
};

// The 5-step journey from the homepage.
export const journey = [
  { step: "01", title: "Connect with Designers", note: "A call, a visit, or a message. We start by listening." },
  { step: "02", title: "Share Your Vision", note: "Your space, your budget, your taste. We map all three." },
  { step: "03", title: "Confirm Design Plan", note: "Drawings, materials and a transparent estimate. No hidden cost." },
  { step: "04", title: "Watch the Transformation", note: "Execution under one roof, tracked against the promised timeline." },
  { step: "05", title: "Step Into New Space", note: "Handover, warranty and a home that reads as yours." },
];

// The 4 differentiators.
export const differentiators = [
  { title: "Customize Design", note: "Built to your space, not to a catalogue." },
  { title: "On Time Delivery", note: "Delivered within the promised timeline." },
  { title: "No Hidden Cost", note: "One transparent estimate, start to finish." },
  { title: "Upto 10 years Warranty", note: "Backed long after handover." },
];

// The 4 trust pillars in the pre-footer strip.
export const trustPillars = [
  { title: "Best Quality Products", note: "Premium & Trusted." },
  { title: "Personalized Support", note: "Guidance at Every Step." },
  { title: "Complete Solutions", note: "One-Stop Décor Partner." },
  { title: "On-Time Delivery", note: "Commitment You Can Trust." },
];

export const consultationInterests = [
  "Modular Kitchen",
  "Green Scape",
  "HomeGeniee Collections",
  "Interior Design",
  "Architectural & Civil",
  "Property Consultancy",
];

export const consultationPurposes = [
  "Interior", "Civil", "Furniture", "Renovation", "Repair",
  "Wall Painting", "Shade", "PVC", "Modular Kitchen",
];
