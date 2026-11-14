// Per-vertical settings for the instant cost calculator. Each one asks three
// questions: `size` (gives an area), `scope` (a multiplier) and `tier` (a
// rate per unit of area), then splits the total across `breakdown`.
// ALL RATES ARE ILLUSTRATIVE PLACEHOLDERS until Home Geniee provides real pricing.
export const estimators = {
  "interior-design": {
    subject: "interior",
    formTitle: "Tell us about your space",
    size: { label: "Flat / home size", options: [
      { label: "1 BHK", area: 600 },
      { label: "2 BHK", area: 900 },
      { label: "3 BHK", area: 1300 },
      { label: "4 BHK", area: 1800 },
    ], initial: 1 },
    scope: { label: "Scope of work", options: [
      { label: "Partial (2–3 rooms)", mult: 0.55 },
      { label: "Full home", mult: 1 },
    ], initial: 1 },
    tier: { label: "Finish tier", options: [
      { label: "Standard", rate: 950 },
      { label: "Premium", rate: 1400 },
      { label: "Luxury", rate: 2100 },
    ], initial: 0 },
    breakdown: [
      { label: "Design & space planning", share: 0.28 },
      { label: "Furniture & furnishing", share: 0.34 },
      { label: "Ceiling, walls & finishes", share: 0.2 },
      { label: "Execution & project management", share: 0.18 },
    ],
  },

  "modular-kitchen": {
    subject: "modular kitchen",
    formTitle: "Tell us about your kitchen",
    size: { label: "Kitchen layout", options: [
      { label: "Straight", area: 10 },
      { label: "L-shaped", area: 14 },
      { label: "U-shaped", area: 18 },
      { label: "Parallel / Island", area: 20 },
    ], initial: 1 },
    scope: { label: "Scope of work", options: [
      { label: "Base cabinets only", mult: 0.6 },
      { label: "Base + wall cabinets", mult: 1 },
    ], initial: 1 },
    // rate is per running foot of cabinetry
    tier: { label: "Shutter finish", options: [
      { label: "Laminate", rate: 9000 },
      { label: "Acrylic", rate: 13000 },
      { label: "PU / Glass", rate: 18000 },
    ], initial: 0 },
    breakdown: [
      { label: "Cabinets & shutters", share: 0.5 },
      { label: "Countertop", share: 0.18 },
      { label: "Hardware & accessories", share: 0.2 },
      { label: "Installation", share: 0.12 },
    ],
  },

  "architectural-civil": {
    subject: "construction",
    formTitle: "Tell us about your build",
    size: { label: "Built-up area", options: [
      { label: "1,000 sq ft", area: 1000 },
      { label: "1,500 sq ft", area: 1500 },
      { label: "2,500 sq ft", area: 2500 },
      { label: "4,000 sq ft", area: 4000 },
    ], initial: 1 },
    scope: { label: "Scope of work", options: [
      { label: "Design & drawings", mult: 0.08 },
      { label: "Design + build", mult: 1 },
    ], initial: 1 },
    tier: { label: "Specification", options: [
      { label: "Standard", rate: 1800 },
      { label: "Premium", rate: 2400 },
      { label: "Luxury", rate: 3200 },
    ], initial: 0 },
    breakdown: [
      { label: "Design & approvals", share: 0.08 },
      { label: "Structure & civil work", share: 0.52 },
      { label: "Finishes & fittings", share: 0.3 },
      { label: "Project management", share: 0.1 },
    ],
  },

  "green-scape": {
    subject: "balcony or terrace",
    formTitle: "Tell us about your outdoor space",
    size: { label: "Space type", options: [
      { label: "Balcony", area: 80 },
      { label: "Small terrace", area: 300 },
      { label: "Large terrace", area: 800 },
      { label: "Garden", area: 1500 },
    ], initial: 1 },
    scope: { label: "Scope of work", options: [
      { label: "Greenery only", mult: 0.6 },
      { label: "Greenery + seating & decor", mult: 1 },
    ], initial: 1 },
    tier: { label: "Finish tier", options: [
      { label: "Standard", rate: 250 },
      { label: "Premium", rate: 450 },
      { label: "Luxury", rate: 750 },
    ], initial: 0 },
    breakdown: [
      { label: "Waterproofing & base prep", share: 0.22 },
      { label: "Plants, turf & planters", share: 0.38 },
      { label: "Seating, lighting & decor", share: 0.28 },
      { label: "Installation", share: 0.12 },
    ],
  },
};
