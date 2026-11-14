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

// Primary navigation, mirroring the WordPress header.
// Trimmed to the four verticals the client wants fronted, per their nav
// diagram. Interior Design carries the sub-dropdown (wall decor, false
// ceiling, furniture) — Furniture in turn is where the HomeGeniee Collection
// now lives, not its own nav item. Architectural & Civil now points to the
// single Fabricator anchor rather than the full drawing-office task list.
// Green Scape is a plain link — no dropdown, by request.
export const mainNav = [
  {
    label: "Interior Design",
    to: "/services/interior-design",
    children: [
      { label: "Wall Decor", to: "/services/wall-decor" },
      { label: "False Ceiling", to: "/services/false-ceiling" },
      { label: "Furniture", to: "/services/furniture" },
    ],
  },
  { label: "Modular Kitchen", to: "/services/modular-kitchen" },
  {
    label: "Architectural and Civil",
    to: "/services/architectural-civil",
    children: [
      { label: "HomeGeniee Fabricator", to: "/services/architectural-civil#fabricator" },
    ],
  },
  { label: "Green Scape", to: "/services/green-scape" },
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
    { label: "Terms and Conditions", to: "/terms-conditions" },
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
  { title: "Best Quality Products", note: "Premium and Trusted." },
  { title: "Personalized Support", note: "Guidance at Every Step." },
  { title: "Complete Solutions", note: "One-Stop Décor Partner." },
  { title: "On-Time Delivery", note: "Commitment You Can Trust." },
];

export const consultationInterests = [
  "Modular Kitchen",
  "Green Scape",
  "HomeGeniee Collections",
  "Interior Design",
  "Architectural and Civil",
  "Property Consultancy",
];

export const consultationPurposes = [
  "Interior", "Civil", "Furniture", "Renovation", "Repair",
  "Wall Painting", "Shade", "PVC", "Modular Kitchen",
];
