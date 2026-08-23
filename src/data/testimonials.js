/**
 * Client photos are placeholder headshots (i.pravatar.cc) — the live site
 * never collected real customer photos, and "random photos" beats blank
 * initials circles for six people who don't have one on file yet.
 */
const AVATAR = (n) => `https://i.pravatar.cc/160?img=${n}`;

export const testimonials = [
  {
    name: "Sarborup Sarkar",
    location: "Salt Lake, Kolkata",
    service: "Modular Kitchen",
    rating: 5,
    avatar: AVATAR(12),
    quote:
      "Our kitchen went from a cramped galley to something I actually enjoy cooking in. The team measured everything twice before quoting, so there were zero surprises on the final bill.",
  },
  {
    name: "Ananya Chatterjee",
    location: "New Town, Kolkata",
    service: "Full Home Interior",
    rating: 5,
    avatar: AVATAR(47),
    quote:
      "We handed over a 3BHK and got back a home. What stood out was the timeline — they said 60 days and handed the keys back on day 58, with a warranty card for every fitting.",
  },
  {
    name: "Gautam Sarkar",
    location: "Behala, Kolkata",
    service: "False Ceiling",
    rating: 4.5,
    avatar: AVATAR(33),
    quote:
      "Wanted a false ceiling that hid the AC ducting without dropping the room height too much. Their site engineer worked out a cove design that solved it in one visit.",
  },
  {
    name: "Priya Bose",
    location: "Ballygunge, Kolkata",
    service: "Wall Decor",
    rating: 5,
    avatar: AVATAR(45),
    quote:
      "Got a CNC-cut jali panel done for our living room wall — exactly the reference photo I sent them, down to the pattern spacing. Neighbours keep asking who did it.",
  },
  {
    name: "Ajoy Das",
    location: "Garia, Kolkata",
    service: "Room Makeover",
    rating: 4.5,
    avatar: AVATAR(14),
    quote:
      "My father's room needed a redo after 20 years — better lighting, storage that didn't eat floor space. They worked around his schedule and finished while he was away for a week.",
  },
  {
    name: "Tuhin Saha",
    location: "Rajarhat, Kolkata",
    service: "Balcony & Terrace",
    rating: 5,
    avatar: AVATAR(53),
    quote:
      "Turned an unused balcony into a proper little garden with vertical planters and artificial turf. Low maintenance was the brief and that's exactly what we got.",
  },
];
