// Hero footage per page. Stock clips in /videos/stock are from Mixkit
// (free licence, no attribution needed); see scripts/optimize-stock-videos.mjs.
// Hero footage per page. Every header now plays video instead of a photo slider.
// Clips chain in order (HeroVideoBackground advances on `ended`), so listing
// several gives a longer, varied loop. Swap in page-specific footage by
// editing these paths; no component changes needed.
const V = "/videos";
const S = "/videos/services";

const interior = [
  { src: `${V}/hero-2.mp4`, poster: `${V}/hero-2-poster.jpg` },
  { src: `${V}/hero-1.mp4`, poster: `${V}/hero-1-poster.jpg` },
  { src: `${V}/hero-3.mp4`, poster: `${V}/hero-3-poster.jpg` },
];
const build = [
  { src: `${S}/facade-elevational.mp4`, poster: `${S}/facade-elevational-poster.jpg` },
];
const kitchen = [
  { src: `${S}/modular-kitchen-hero.mp4`, poster: `${S}/modular-kitchen-hero-poster.jpg` },
  { src: `${S}/modular-kitchen.mp4`, poster: `${S}/modular-kitchen-poster.jpg` },
];
const st = (id) => ({ src: `${V}/stock/${id}.mp4`, poster: `${V}/stock/${id}.jpg` });
const green = [{ src: `${S}/green-scape.mp4`, poster: `${S}/green-scape-poster.jpg` }];

export const serviceClips = {
  // Own footage only: the home page already plays hero-1 and hero-3.
  "interior-design": [interior[0]],
  "modular-kitchen": [kitchen[0], st(43033), kitchen[1]],
  "false-ceiling": [st(4046), st(26757), st(4196), st(3112), st(4198), st(4029)],
  furniture: [st(3090), st(3091), st(15853)],
  "wall-decor": [st(2296), st(21219), st(15847), st(3090)],
  "architectural-civil": [st(4010), st(23511), st(1439), st(21230), st(25480), st(24049)],
  "aluminium-upvc": [st(49845), build[0], st(4010)],
  "green-scape": [st(47286), st(6773), st(4030), green[0]],
  "shade-work": [st(25480), st(14729), st(49192)],
  "home-makeover": [st(15853), st(15847), st(21219), interior[0]],
  renovation: [st(25480), st(15853), st(14729), st(49192)],
};

export const pageClips = {
  about: [st(12877), st(15847), st(21226), st(3090), interior[0]],
  gallery: [st(3090), st(43033), st(3091), interior[2]],
  contact: [st(12878), st(12877), interior[0]],
};
