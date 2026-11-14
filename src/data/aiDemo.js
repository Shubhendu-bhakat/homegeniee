/**
 * Fixed Q&A set for the "Ask HomeGeniee" demo panel. Nothing here calls a
 * model — it is keyword-matched against this list, which is the point: a
 * cheap, honest stand-in for the real assistant, clearly labelled as a demo
 * everywhere it appears.
 */
export const aiSuggestions = [
  {
    q: "What services do you offer?",
    keywords: ["service", "offer", "what do you do", "vertical", "work"],
    a: "We cover 13 verticals under one roof: interior design, modular kitchens, false ceilings, furniture, wall decor, architecture and civil, uPVC/aluminium, balcony and terrace, shade work, room makeovers, renovation and property consultancy.",
  },
  {
    q: "How much does a modular kitchen cost?",
    keywords: ["kitchen", "cost", "price", "budget", "how much"],
    a: "It depends on layout and finish, but most modular kitchens with us run from around ₹1.5L for a compact L-shape to ₹4L+ for a full island setup. Book a free consultation and we'll quote against your actual dimensions.",
  },
  {
    q: "How long does a full home interior take?",
    keywords: ["long", "time", "duration", "timeline", "how many days", "weeks"],
    a: "A full home interior typically takes 45 to 75 days from confirmed design to handover, depending on size and how many trades run in parallel. We commit to a timeline in writing before work starts.",
  },
  {
    q: "Is the consultation really free?",
    keywords: ["free", "consultation", "charge", "cost of consultation"],
    a: "Yes — the first consultation, site visit and initial concept are free, with no obligation to proceed. You only pay once you approve a design and estimate.",
  },
  {
    q: "Which areas in Kolkata do you serve?",
    keywords: ["area", "location", "kolkata", "serve", "where", "cover"],
    a: "We're based on Serpentine Lane and work across Kolkata and the surrounding areas. Tell us your locality when you book and we'll confirm coverage.",
  },
  {
    q: "Do you offer any warranty?",
    keywords: ["warranty", "guarantee", "after service", "support"],
    a: "Yes — up to 10 years warranty depending on the product line, plus support after handover if anything needs adjusting.",
  },
];

export const aiFallback =
  "That's outside this demo's fixed answer set — the real assistant isn't wired up yet. Try one of the suggestions below, or book a free consultation and a designer will answer directly.";

export function matchAiAnswer(input) {
  const q = input.toLowerCase();
  const hit = aiSuggestions.find((s) => s.keywords.some((k) => q.includes(k)));
  return hit ? hit.a : aiFallback;
}
