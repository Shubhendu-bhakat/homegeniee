import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

/**
 * Interactive 3D demo of a modular kitchen layout, modelled in code after the
 * three reference renders on homegeniee.com:
 *   U        — white marble counters, splash and floor; blue-grey peninsula
 *              with a waterfall end; white slab uppers, light-oak cubbies,
 *              angled hood.
 *   L        — beige walls, terracotta tile floor, grey shaker doors with
 *              knobs, sink under a window, floating wood shelves, corner
 *              open shelving, lift-up wall unit.
 *   Straight — dark handle-less units with black groove channels, tall
 *              oven + fridge column, walnut uppers, black LED shelves,
 *              concrete splash, wood dining table with a bar stool.
 * `finish` recolours the main base-unit shutters. Drag to orbit, scroll /
 * pinch to zoom.
 *
 * Every run is modelled in its own local frame — along +x, wall at z = 0,
 * fronts facing +z — and then placed against its wall, so cabinets, doors
 * and appliances are written once and work on any wall.
 */

/* ------------------------------------------------------------------ */
/* Dimensions (metres)                                                 */
/* ------------------------------------------------------------------ */
const H = {
  plinth: 0.1, base: 0.86, top: 0.04, depth: 0.6,
  splashTo: 1.45, upperFrom: 1.45, upperTo: 2.2, upperDepth: 0.34,
  wall: 2.7,
};
const COUNTER_Y = H.base + H.top;

/* ------------------------------------------------------------------ */
/* Procedural textures                                                 */
/* ------------------------------------------------------------------ */
function canvasTex(w, h, draw, repeat = [1, 1]) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(...repeat);
  t.anisotropy = 16;
  return t;
}
// Seeded random so the textures look the same on every visit.
function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646; }

const marbleTex = (repeat, tiles = 0) => canvasTex(1024, 1024, (g, w, h) => {
  const r = rng(7);
  g.fillStyle = "#f6f5f2"; g.fillRect(0, 0, w, h);
  // Soft grey clouding
  for (let i = 0; i < 40; i++) {
    const x = r() * w, y = r() * h, rad = 60 + r() * 180;
    const grd = g.createRadialGradient(x, y, 0, x, y, rad);
    grd.addColorStop(0, "rgba(190,190,196,0.10)");
    grd.addColorStop(1, "rgba(190,190,196,0)");
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
  }
  const vein = (width, alpha, blur) => {
    g.filter = blur ? `blur(${blur}px)` : "none";
    g.strokeStyle = `rgba(120,122,130,${alpha})`;
    g.lineWidth = width;
    g.beginPath();
    let x = r() * w, y = -20;
    g.moveTo(x, y);
    while (y < h + 20) {
      const nx = x + (r() - 0.45) * 90, ny = y + 30 + r() * 60;
      g.quadraticCurveTo(x + (r() - 0.5) * 60, (y + ny) / 2, nx, ny);
      x = nx; y = ny;
    }
    g.stroke();
  };
  for (let i = 0; i < 5; i++) vein(10 + r() * 14, 0.12, 8);  // broad soft veins
  for (let i = 0; i < 9; i++) vein(1.2 + r() * 2, 0.2, 1); // fine crisp veins
  for (let i = 0; i < 12; i++) vein(0.6, 0.12, 0);            // hairlines
  g.filter = "none";
  if (tiles) {
    g.fillStyle = "rgba(170,170,172,0.9)";
    const t = w / tiles;
    for (let i = 0; i <= tiles; i++) { g.fillRect(i * t - 1.5, 0, 3, h); g.fillRect(0, i * t - 1.5, w, 3); }
  }
}, repeat);

const tileTex = (base, grout, n, jitter, repeat) => canvasTex(1024, 1024, (g, w, h) => {
  const r = rng(11);
  const s = w / n;
  g.fillStyle = grout; g.fillRect(0, 0, w, h);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const k = 1 + (r() - 0.5) * jitter;
    const c = new THREE.Color(base).multiplyScalar(k);
    g.fillStyle = `#${c.getHexString()}`;
    g.fillRect(i * s + 3, j * s + 3, s - 6, s - 6);
  }
}, repeat);

const woodTex = (base, repeat) => canvasTex(256, 512, (g, w, h) => {
  const r = rng(3);
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 70; i++) {
    g.strokeStyle = `rgba(60,35,15,${0.04 + r() * 0.1})`;
    g.lineWidth = 0.5 + r() * 2;
    const x = r() * w;
    g.beginPath(); g.moveTo(x, 0);
    g.bezierCurveTo(x + (r() - 0.5) * 20, h / 3, x + (r() - 0.5) * 20, (2 * h) / 3, x + (r() - 0.5) * 10, h);
    g.stroke();
  }
}, repeat);

const concreteTex = (base, repeat) => canvasTex(256, 256, (g, w, h) => {
  const r = rng(5);
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 1600; i++) {
    g.fillStyle = `rgba(${r() > 0.5 ? "255,255,255" : "0,0,0"},${r() * 0.05})`;
    g.fillRect(r() * w, r() * h, 2 + r() * 4, 2 + r() * 4);
  }
}, repeat);

// Speckled granite / engineered quartz: near-white so the chosen colour tints
// it, with fine grain, soft clouds and the odd vein.
const graniteTex = (repeat, seed = 17, grain = 3400) => canvasTex(1024, 1024, (g, w, h) => {
  const r = rng(seed);
  g.fillStyle = "#f4f3f1"; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 26; i++) {
    const x = r() * w, y = r() * h, rad = 40 + r() * 140;
    const grd = g.createRadialGradient(x, y, 0, x, y, rad);
    grd.addColorStop(0, "rgba(170,170,176,0.10)"); grd.addColorStop(1, "rgba(170,170,176,0)");
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
  }
  for (let i = 0; i < grain * 2; i++) {
    const k = r();
    g.fillStyle = k < 0.55 ? `rgba(90,90,96,${0.12 + r() * 0.25})` : k < 0.8 ? `rgba(255,255,255,${0.4 + r() * 0.5})` : `rgba(40,40,44,${0.15 + r() * 0.3})`;
    const s = 1.6 + r() * 4.4;
    g.fillRect(r() * w, r() * h, s, s);
  }
  g.strokeStyle = "rgba(130,132,140,0.16)"; g.lineWidth = 2.8;
  for (let i = 0; i < 4; i++) {
    g.beginPath(); let x = r() * w, y = 0; g.moveTo(x, y);
    while (y < h) { x += (r() - 0.5) * 60; y += 20 + r() * 40; g.lineTo(x, y); }
    g.stroke();
  }
}, repeat);

// Polished terrazzo: pale cement with scattered marble chips.
const terrazzoTex = (repeat) => canvasTex(1024, 1024, (g, w, h) => {
  const r = rng(31);
  g.fillStyle = "#dedbd6"; g.fillRect(0, 0, w, h);
  const cols = ["#8a8987", "#b9b5ae", "#6f6e6d", "#f1efea", "#a29a8e", "#c9c5bd"];
  for (let i = 0; i < 5200; i++) {
    g.fillStyle = cols[(r() * cols.length) | 0];
    const x = r() * w, y = r() * h, s = 3 + r() * r() * 18;
    g.beginPath();
    const n = 5 + ((r() * 3) | 0);
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2, rr = s * (0.6 + r() * 0.5);
      g[k ? "lineTo" : "moveTo"](x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.8);
    }
    g.closePath(); g.fill();
  }
}, repeat);

// Fine plaster / painted wall: barely-there mottling.
const plasterTex = (base, repeat) => canvasTex(256, 256, (g, w, h) => {
  const r = rng(41);
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 2200; i++) {
    g.fillStyle = `rgba(${r() > 0.5 ? "255,255,255" : "0,0,0"},${r() * 0.035})`;
    const s = 1 + r() * 5;
    g.fillRect(r() * w, r() * h, s, s);
  }
}, repeat);

// Woven runner: soft stripes with a plain border.
const rugTex = (a, b) => canvasTex(256, 128, (g, w, h) => {
  const r = rng(21);
  g.fillStyle = a; g.fillRect(0, 0, w, h);
  g.fillStyle = b;
  for (let x = 28; x < w - 20; x += 32) g.fillRect(x, 14, 14, h - 28);
  g.strokeStyle = b; g.lineWidth = 5; g.strokeRect(6, 6, w - 12, h - 12);
  for (let i = 0; i < 900; i++) {
    g.fillStyle = `rgba(0,0,0,${r() * 0.05})`;
    g.fillRect(r() * w, r() * h, 1, 2);
  }
});

/* ------------------------------------------------------------------ */
/* Mesh helpers                                                        */
/* ------------------------------------------------------------------ */
const M = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0, ...o });
// Lacquer / acrylic shutters and polished stone: a clear-coat layer gives the
// sharp reflections that make them read as real finishes.
const gloss = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.12, ...o });

// Geometry is cached by size so repeated modules share one buffer.
const geoCache = new Map();
function boxGeo(w, h, d) {
  const key = `${w.toFixed(4)}|${h.toFixed(4)}|${d.toFixed(4)}`;
  let g = geoCache.get(key);
  if (!g) {
    const r = Math.min(0.006, Math.min(w, h, d) * 0.3);
    // Rounded edges catch highlights the way real board edges do; tiny or
    // huge pieces (trim, floor, walls) stay plain boxes.
    g = r > 0.002 && Math.max(w, h, d) < 3.5 ? new RoundedBoxGeometry(w, h, d, 2, r) : new THREE.BoxGeometry(w, h, d);
    g.userData.cacheKey = key;
    geoCache.set(key, g);
  }
  return g;
}
function box(parent, w, h, d, mat, x, y, z, { shadow = true } = {}) {
  const m = new THREE.Mesh(boxGeo(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = shadow; m.receiveShadow = true;
  parent.add(m);
  return m;
}
function cyl(parent, rt, rb, h, mat, x, y, z, seg = 24) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  m.position.set(x, y, z);
  m.castShadow = true; m.receiveShadow = true;
  parent.add(m);
  return m;
}
// Smooth spheres (not faceted), cached by radius so repeats share a buffer.
function sphere(parent, r, mat, x, y, z) {
  const key = `sph|${r.toFixed(4)}`;
  let geo = geoCache.get(key);
  if (!geo) {
    geo = new THREE.SphereGeometry(r, 24, 16);
    geo.userData.cacheKey = key;
    geoCache.set(key, geo);
  }
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  parent.add(m);
  return m;
}
// Turned objects (bowls, vases, jars, pots) from a [radius, height] profile.
function lathe(parent, pts, mat, x, y, z, seg = 32) {
  const m = new THREE.Mesh(new THREE.LatheGeometry(pts.map(([r, h]) => new THREE.Vector2(r, h)), seg), mat);
  m.position.set(x, y, z);
  m.castShadow = true; m.receiveShadow = true;
  parent.add(m);
  return m;
}

/* ------------------------------------------------------------------ */
/* Door / front styles (local frame: front face at z = zf, facing +z)  */
/* ------------------------------------------------------------------ */
function front(g, P, style, x, y, w, h, zf, mat) {
  const t = 0.02;
  box(g, w - 0.006, h - 0.006, t, mat, x + w / 2, y + h / 2, zf + t / 2);
  if (style === "shaker") {
    const f = 0.055, p = 0.008;
    box(g, w - 0.006, f, p, mat, x + w / 2, y + h - f / 2, zf + t + p / 2);
    box(g, w - 0.006, f, p, mat, x + w / 2, y + f / 2, zf + t + p / 2);
    box(g, f, h - 2 * f, p, mat, x + f / 2, y + h / 2, zf + t + p / 2);
    box(g, f, h - 2 * f, p, mat, x + w - f / 2, y + h / 2, zf + t + p / 2);
  }
  return zf + t;
}
function knob(g, P, x, y, z) { sphere(g, 0.014, P.metal, x, y, z + 0.014); }
function bar(g, P, x, y, z, len, vertical = false) {
  // slim profile handle: a thin rail on two small stand-offs
  box(g, vertical ? 0.008 : len, vertical ? len : 0.008, 0.008, P.metal, x, y, z + 0.02);
  box(g, 0.006, 0.006, 0.018, P.metal, x - (vertical ? 0 : len / 2 - 0.02), y - (vertical ? len / 2 - 0.02 : 0), z + 0.009);
  box(g, 0.006, 0.006, 0.018, P.metal, x + (vertical ? 0 : len / 2 - 0.02), y + (vertical ? len / 2 - 0.02 : 0), z + 0.009);
}

// One base module's fronts. `kind`: doors | drawers | oven | open
function baseFronts(g, P, x, w, kind, style) {
  const y0 = H.plinth, hh = H.base - H.plinth - 0.01, zf = H.depth - 0.02;
  const mat = P.lower;
  if (kind === "open") {
    // Open shelving end unit (U reference: bowls and jars on shelves).
    for (const y of [y0 + hh * 0.33, y0 + hh * 0.66]) box(g, w - 0.04, 0.02, H.depth - 0.06, P.carcass, x + w / 2, y, H.depth / 2);
    return;
  }
  if (kind === "oven") {
    const top = 0.14;
    const z = front(g, P, style, x, y0 + hh - top, w, top, zf, mat);
    handleFor(g, P, style, x, w, y0 + hh - top, top, z);
    oven(g, P, x + 0.02, y0 + 0.02, w - 0.04, hh - top - 0.03, zf);
    return;
  }
  if (style === "groove") {
    // Handle-less two-tier fronts with black J-channel grooves (Straight ref).
    const h1 = hh * 0.5 - 0.02;
    front(g, P, "slab", x, y0, w, h1, zf, mat);
    front(g, P, "slab", x, y0 + h1 + 0.04, w, hh - h1 - 0.06, zf, mat);
    box(g, w, 0.035, 0.03, P.black, x + w / 2, y0 + h1 + 0.02, zf + 0.0);
    box(g, w, 0.035, 0.03, P.black, x + w / 2, y0 + hh - 0.01, zf + 0.0);
    return;
  }
  if (kind === "drawers") {
    const hs = [hh * 0.24, hh * 0.36, hh * 0.4];
    let y = y0 + hh;
    for (const dh of hs) {
      y -= dh;
      const z = front(g, P, style, x, y, w, dh, zf, mat);
      handleFor(g, P, style, x, w, y, dh, z);
    }
    return;
  }
  // doors: one or two leaves
  const leaves = w > 0.55 ? 2 : 1;
  const lw = w / leaves;
  for (let i = 0; i < leaves; i++) {
    const z = front(g, P, style, x + i * lw, y0, lw, hh, zf, mat);
    if (style === "shaker") knob(g, P, x + i * lw + (i === 0 && leaves === 2 ? lw - 0.06 : 0.06), y0 + hh - 0.08, z);
    else if (style === "slab") bar(g, P, x + i * lw + (i === 0 && leaves === 2 ? lw - 0.05 : 0.05), y0 + hh - 0.14, z, 0.16, true);
  }
}
function handleFor(g, P, style, x, w, y, h, z) {
  if (style === "shaker") knob(g, P, x + w / 2, y + h / 2, z);
  else if (style === "slab") {
    // Finger-pull profile: a dark recessed channel along the top edge with a
    // thin brushed-aluminium lip, as on the reference renders.
    box(g, w - 0.02, 0.018, 0.004, P.black, x + w / 2, y + h - 0.016, z + 0.001, { shadow: false });
    box(g, w - 0.02, 0.004, 0.016, P.steel, x + w / 2, y + h - 0.027, z + 0.006, { shadow: false });
  }
}

function oven(g, P, x, y, w, h, zf) {
  box(g, w, h, 0.02, P.black, x + w / 2, y + h / 2, zf + 0.01);
  box(g, w - 0.08, h * 0.55, 0.005, P.glass, x + w / 2, y + h * 0.4, zf + 0.022);
  box(g, w - 0.1, 0.014, 0.014, P.metal, x + w / 2, y + h * 0.78, zf + 0.035);
  box(g, w, h * 0.12, 0.01, P.metal, x + w / 2, y + h - h * 0.06, zf + 0.024);
  for (let i = 0; i < 3; i++) cyl(g, 0.012, 0.012, 0.012, P.black, x + 0.1 + i * 0.07, y + h - h * 0.06, zf + 0.035).rotation.x = Math.PI / 2;
}

/* ------------------------------------------------------------------ */
/* Counter-top fittings                                                */
/* ------------------------------------------------------------------ */
function hob(g, P, cx, cz, w = 0.6) {
  box(g, w, 0.01, 0.52, P.glassBlack, cx, COUNTER_Y + 0.005, cz);
  const top = COUNTER_Y + 0.01;
  for (const [dx, dz, r] of [[-0.17, -0.08, 0.055], [0.17, -0.08, 0.05], [0, 0.07, 0.045]]) {
    const x = cx + dx, z = cz + dz;
    cyl(g, r, r * 1.05, 0.016, P.brass, x, top + 0.008, z, 28);
    cyl(g, r * 0.62, r * 0.62, 0.012, P.black, x, top + 0.022, z, 24);
    // pan support: two crossing cast-iron bars on little feet
    for (const rot of [Math.PI / 4, -Math.PI / 4]) {
      const bar = box(g, r * 2.7, 0.01, 0.01, P.castIron, x, top + 0.038, z);
      bar.rotation.y = rot;
    }
  }
  for (const dx of [-0.16, 0, 0.16]) {
    cyl(g, 0.02, 0.022, 0.02, P.steel, cx + dx, top + 0.01, cz + 0.21, 20);
    box(g, 0.004, 0.006, 0.026, P.black, cx + dx, top + 0.022, cz + 0.21);
  }
}
// Sink basin sits in a real cut-out in the worktop (see sinkCut): a steel
// rim, vertical walls going down, a floor with a drain, and a mixer tap.
const SINK_D = 0.42;
function sinkCut(w, bowls) { return { w: Math.min(w - 0.08, bowls === 2 ? 0.8 : 0.55), d: SINK_D, cz: H.depth / 2 + 0.02 }; }
function sink(g, P, cx, cz, w, bowls = 1) {
  const d = SINK_D, depth = 0.19, t = 0.006, top = COUNTER_Y;
  // rim
  box(g, w + 0.03, 0.006, 0.014, P.steel, cx, top + 0.003, cz - d / 2 - 0.005, { shadow: false });
  box(g, w + 0.03, 0.006, 0.014, P.steel, cx, top + 0.003, cz + d / 2 + 0.005, { shadow: false });
  box(g, 0.014, 0.006, d, P.steel, cx - w / 2 - 0.005, top + 0.003, cz, { shadow: false });
  box(g, 0.014, 0.006, d, P.steel, cx + w / 2 + 0.005, top + 0.003, cz, { shadow: false });
  // walls + floor
  box(g, w, depth, t, P.steel, cx, top - depth / 2, cz - d / 2);
  box(g, w, depth, t, P.steel, cx, top - depth / 2, cz + d / 2);
  box(g, t, depth, d, P.steel, cx - w / 2, top - depth / 2, cz);
  box(g, t, depth, d, P.steel, cx + w / 2, top - depth / 2, cz);
  box(g, w, t, d, P.sinkIn, cx, top - depth, cz, { shadow: false });
  const bw = (w - 0.02 * (bowls - 1)) / bowls;
  for (let i = 0; i < bowls; i++) {
    const bx = cx - w / 2 + bw / 2 + i * (bw + 0.02);
    cyl(g, 0.035, 0.035, 0.004, P.black, bx, top - depth + 0.004, cz, 20);
    cyl(g, 0.028, 0.028, 0.006, P.steel, bx, top - depth + 0.006, cz, 20);
  }
  if (bowls === 2) box(g, 0.02, depth - 0.03, d - 0.02, P.steel, cx, top - depth / 2 - 0.015, cz);
  tap(g, P, cx, cz - d / 2 - 0.045);
}
function tap(g, P, x, z) {
  cyl(g, 0.02, 0.024, 0.04, P.metal, x, COUNTER_Y + 0.02, z);
  cyl(g, 0.011, 0.011, 0.3, P.metal, x, COUNTER_Y + 0.19, z);
  const arc = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.011, 8, 20, Math.PI), P.metal);
  arc.position.set(x, COUNTER_Y + 0.34, z + 0.07);
  arc.rotation.y = Math.PI / 2;
  arc.castShadow = true;
  g.add(arc);
  // spout tip + side lever
  cyl(g, 0.012, 0.009, 0.03, P.metal, x, COUNTER_Y + 0.325, z + 0.14, 10);
  const lever = box(g, 0.012, 0.012, 0.07, P.metal, x + 0.028, COUNTER_Y + 0.12, z + 0.02);
  lever.rotation.x = -0.5;
}

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */
// A leaf blade: a stretched, tilted ellipsoid that reads as foliage.
function leafBlade(g, mat, x, y, z, len, wid, yaw, tilt) {
  const m = sphere(g, 1, mat, x, y, z);
  m.scale.set(wid, len, wid * 0.22);
  m.rotation.order = "YXZ";
  m.rotation.y = yaw; m.rotation.x = tilt;
  m.position.set(x + Math.sin(yaw) * Math.sin(tilt) * len * 0.9, y + Math.cos(tilt) * len * 0.9, z + Math.cos(yaw) * Math.sin(tilt) * len * 0.9);
  return m;
}
function plant(g, P, x, y, z, s = 1) {
  // tapered pot with a rolled rim, dark soil, and a rosette of blades
  lathe(g, [[0.001, 0], [0.042 * s, 0], [0.055 * s, 0.09 * s], [0.062 * s, 0.11 * s], [0.058 * s, 0.112 * s], [0.05 * s, 0.1 * s], [0.001, 0.1 * s]], P.pot, x, y, z, 24);
  cyl(g, 0.05 * s, 0.05 * s, 0.004, P.soil, x, y + 0.098 * s, z, 20);
  for (let i = 0; i < 16; i++) {
    const yaw = i * 2.4, tilt = 0.25 + (i % 4) * 0.2;
    leafBlade(g, P.leaf, x, y + 0.1 * s, z, (0.09 + (i % 3) * 0.035) * s, 0.02 * s, yaw, tilt);
  }
}
function tallPlant(g, P, x, z) {
  lathe(g, [[0.001, 0], [0.1, 0], [0.14, 0.26], [0.15, 0.28], [0.13, 0.28], [0.001, 0.26]], P.pot, x, 0, z, 28);
  cyl(g, 0.13, 0.13, 0.005, P.soil, x, 0.26, z, 20);
  for (let k = 0; k < 3; k++) cyl(g, 0.01, 0.014, 0.55 + k * 0.1, P.trunk, x + (k - 1) * 0.03, 0.55 + k * 0.05, z + ((k % 2) - 0.5) * 0.04, 8);
  for (let i = 0; i < 34; i++) {
    const yaw = i * 2.4, up = 0.55 + (i / 34) * 0.55;
    leafBlade(g, P.leaf, x + Math.cos(yaw) * 0.03, up, z + Math.sin(yaw) * 0.03, 0.13 + (i % 4) * 0.025, 0.05, yaw, 0.7 + (i % 3) * 0.15);
  }
}
function plates(g, P, x, y, z, n = 5) {
  // dished plates, stacked
  for (let i = 0; i < n; i++) lathe(g, [[0.001, 0], [0.06, 0], [0.095, 0.014], [0.1, 0.018], [0.097, 0.019], [0.06, 0.006], [0.001, 0.006]], P.ceramic, x, y + i * 0.015, z, 32);
}
function vase(g, P, x, y, z, h = 0.18, mat) {
  const k = h;
  lathe(g, [[0.001, 0], [0.03, 0], [0.046, 0.22 * k], [0.05, 0.42 * k], [0.04, 0.68 * k], [0.021, 0.88 * k], [0.027, k], [0.02, k], [0.001, 0.9 * k]], mat ?? P.ceramic, x, y, z, 32);
}
function jar(g, P, x, y, z, h = 0.14) {
  // glass jar with spice inside and a wooden lid
  const tints = ["#7a2e1d", "#b8862e", "#4d5a2a", "#d1a24a", "#5b3a25"];
  const c = tints[Math.abs(Math.floor((x * 97 + y * 53 + h * 131) * 10)) % tints.length];
  lathe(g, [[0.001, 0], [0.036, 0], [0.04, 0.012], [0.04, h * 0.85], [0.03, h * 0.94], [0.03, h]], P.glass, x, y, z, 24);
  cyl(g, 0.034, 0.034, h * 0.62, M(c, { roughness: 0.9 }), x, y + h * 0.33, z, 20);
  cyl(g, 0.034, 0.034, 0.022, P.wood, x, y + h + 0.01, z, 20);
}
function books(g, P, x, y, z, n = 5) {
  const cols = ["#c9b79c", "#7b8c99", "#e5e0d6", "#a3604a", "#56606b"];
  for (let i = 0; i < n; i++) box(g, 0.025, 0.2 - (i % 2) * 0.03, 0.15, M(cols[i % cols.length]), x + i * 0.028, y + 0.1 - (i % 2) * 0.015, z);
}
function microwave(g, P, x, y, z) {
  box(g, 0.48, 0.28, 0.36, P.applianceBody, x, y + 0.14, z);
  box(g, 0.34, 0.22, 0.006, P.glassBlack, x - 0.06, y + 0.14, z + 0.181);
  box(g, 0.1, 0.24, 0.006, P.steel, x + 0.18, y + 0.14, z + 0.181);
  for (let i = 0; i < 3; i++) cyl(g, 0.012, 0.012, 0.01, P.black, x + 0.18, y + 0.2 - i * 0.05, z + 0.188).rotation.x = Math.PI / 2;
}
function kettle(g, P, x, y, z) {
  cyl(g, 0.07, 0.085, 0.02, P.black, x, y + 0.01, z, 24);
  cyl(g, 0.065, 0.08, 0.17, P.steel, x, y + 0.105, z, 24);
  sphere(g, 0.03, P.black, x, y + 0.2, z);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.01, 8, 16, Math.PI), P.black);
  handle.position.set(x - 0.075, y + 0.12, z);
  handle.rotation.z = Math.PI / 2;
  g.add(handle);
  const spout = cyl(g, 0.012, 0.02, 0.08, P.steel, x + 0.09, y + 0.15, z, 10);
  spout.rotation.z = -0.8;
}
function fruitBowl(g, P, x, y, z) {
  lathe(g, [[0.001, 0], [0.055, 0], [0.105, 0.035], [0.145, 0.07], [0.15, 0.072], [0.147, 0.075], [0.1, 0.042], [0.05, 0.01], [0.001, 0.01]], P.ceramic, x, y, z, 36);
  const cols = ["#e8892a", "#9cc441", "#c8322b", "#e8892a", "#f1c232", "#c8322b"];
  cols.forEach((c, i) => {
    const a = (i / cols.length) * Math.PI * 2 + 0.4;
    const f = sphere(g, 0.036, M(c, { roughness: 0.4 }), x + Math.cos(a) * 0.065, y + 0.075 + (i % 2) * 0.016, z + Math.sin(a) * 0.065);
    f.scale.set(1, 0.94, 1);
  });
  sphere(g, 0.036, M("#d9372c", { roughness: 0.4 }), x, y + 0.1, z);
}
function knifeBlock(g, P, x, y, z) {
  const b = box(g, 0.09, 0.2, 0.13, P.wood, x, y + 0.1, z);
  b.rotation.x = -0.25;
  for (let i = 0; i < 4; i++) box(g, 0.012, 0.09, 0.02, P.black, x - 0.03 + i * 0.02, y + 0.23, z - 0.03 + i * 0.008);
}
function bottles(g, P, x, y, z) {
  const tints = ["#b5a33c", "#6f8f3e", "#7a3b2b"];
  tints.forEach((c, i) => {
    cyl(g, 0.03, 0.03, 0.2 - i * 0.03, M(c, { roughness: 0.1, transparent: true, opacity: 0.75 }), x + i * 0.07, y + (0.2 - i * 0.03) / 2, z, 16);
    cyl(g, 0.012, 0.012, 0.04, P.black, x + i * 0.07, y + 0.2 - i * 0.03 + 0.02, z, 10);
  });
}
function dishRack(g, P, x, y, z) {
  box(g, 0.42, 0.02, 0.3, P.steel, x, y + 0.01, z);
  for (let i = 0; i < 7; i++) for (const dz of [-0.1, 0.1]) cyl(g, 0.003, 0.003, 0.12, P.steel, x - 0.18 + i * 0.06, y + 0.07, z + dz, 6);
  for (let i = 0; i < 4; i++) {
    const plate = cyl(g, 0.1, 0.1, 0.012, P.ceramic, x - 0.15 + i * 0.07, y + 0.12, z, 24);
    plate.rotation.z = Math.PI / 2;
  }
  for (let i = 0; i < 2; i++) cyl(g, 0.035, 0.03, 0.09, P.glass, x + 0.12 + i * 0.07, y + 0.065, z - 0.08, 14);
}
function ladleRail(g, P, x, y, z, len = 0.5) {
  const rail = cyl(g, 0.007, 0.007, len, P.steel, x, y, z + 0.03, 10);
  rail.rotation.z = Math.PI / 2;
  for (let i = 0; i < 4; i++) {
    const ux = x - len / 2 + 0.08 + i * ((len - 0.16) / 3);
    cyl(g, 0.005, 0.005, 0.22, i % 2 ? P.black : P.steel, ux, y - 0.12, z + 0.035, 8);
    if (i % 2) box(g, 0.05, 0.07, 0.006, P.black, ux, y - 0.26, z + 0.035);
    else sphere(g, 0.03, P.steel, ux, y - 0.25, z + 0.04).scale.set(1, 0.5, 1);
  }
}
// Saucepan with a lid, sitting on a burner's pan support.
function pot(g, P, x, y, z, r = 0.1) {
  cyl(g, r, r, 0.12, P.steel, x, y + 0.06, z, 28);
  cyl(g, r + 0.004, r + 0.004, 0.012, P.steel, x, y + 0.126, z, 28);
  sphere(g, 0.015, P.black, x, y + 0.148, z);
  for (const s of [-1, 1]) box(g, 0.075, 0.012, 0.03, P.black, x + s * (r + 0.035), y + 0.1, z);
}
// Pendant light: braided cord to the ceiling, dome shade, glowing underside.
function pendant(g, P, x, yBottom, z) {
  cyl(g, 0.003, 0.003, H.wall - yBottom - 0.16, P.black, x, yBottom + 0.16 + (H.wall - yBottom - 0.16) / 2, z, 6);
  const dome = cyl(g, 0.045, 0.16, 0.16, P.black, x, yBottom + 0.08, z, 28);
  dome.castShadow = false;
  cyl(g, 0.15, 0.15, 0.008, P.downlight, x, yBottom + 0.004, z, 28);
}
function socket(g, P, x, y) {
  box(g, 0.085, 0.085, 0.008, P.ceramic, x, y, 0.016, { shadow: false });
  box(g, 0.05, 0.05, 0.004, P.carcass, x, y, 0.021, { shadow: false });
  for (const dx of [-0.012, 0.012]) box(g, 0.006, 0.014, 0.004, P.black, x + dx, y, 0.024, { shadow: false });
}
function rug(g, mat, x, z, w, d) {
  box(g, w, 0.012, d, mat, x, 0.006, z, { shadow: false });
}
function board(g, P, x, y, z, w = 0.22, h = 0.34) {
  const b = box(g, w, h, 0.018, P.wood, x, y + h / 2, z);
  b.rotation.x = -0.12;
  return b;
}

/* ------------------------------------------------------------------ */
/* Runs: a line of base modules + uppers, built in local frame         */
/* ------------------------------------------------------------------ */
// base module: { w, kind: doors|drawers|oven|open|sink|hob|tall|fridge|tallOven|corner, style?, bowls? }
// upper module: { w, kind: wall|open|hood|gap|lift|cornerOpen|woodTall }
function buildRun(P, run) {
  const g = new THREE.Group();
  const style = run.style;
  const lowerMat = run.lowerMat ?? P.lower;
  const Pl = { ...P, lower: lowerMat };

  // Base modules
  let x = 0;
  for (const m of run.base) {
    const tall = m.kind === "tall" || m.kind === "fridge" || m.kind === "tallOven";
    if (tall) {
      tallUnit(g, Pl, x, m);
    } else {
      // carcass + plinth + counter
      box(g, m.w - 0.004, H.base - H.plinth, H.depth - 0.02, P.carcass, x + m.w / 2, H.plinth + (H.base - H.plinth) / 2, (H.depth - 0.02) / 2);
      box(g, m.w, H.plinth, H.depth - 0.07, P.plinth, x + m.w / 2, H.plinth / 2, (H.depth - 0.07) / 2);
      if (m.kind !== "corner") {
        const kind = m.kind === "sink" ? "doors" : m.kind === "hob" ? (m.oven ? "oven" : "drawers") : m.kind;
        baseFronts(g, Pl, x, m.w, kind, m.style ?? style);
      } else {
        front(g, Pl, style === "groove" ? "slab" : style, x, H.plinth, m.w, H.base - H.plinth - 0.01, H.depth - 0.02, lowerMat);
      }
      if (m.kind === "sink") {
        // Worktop in four pieces around the basin cut-out.
        const c = sinkCut(m.w, m.bowls ?? 1), cx = x + m.w / 2, ty = H.base + H.top / 2, D = H.depth + 0.02;
        const zb = c.cz - c.d / 2, zf2 = c.cz + c.d / 2, sx = (m.w - c.w) / 2;
        box(g, m.w, H.top, zb, P.counter, cx, ty, zb / 2);
        box(g, m.w, H.top, D - zf2, P.counter, cx, ty, (zf2 + D) / 2);
        box(g, sx, H.top, c.d, P.counter, x + sx / 2, ty, c.cz);
        box(g, sx, H.top, c.d, P.counter, x + m.w - sx / 2, ty, c.cz);
        sink(g, P, cx, c.cz, c.w, m.bowls ?? 1);
      } else {
        box(g, m.w, H.top, H.depth + 0.02, P.counter, x + m.w / 2, H.base + H.top / 2, (H.depth + 0.02) / 2);
      }
      if (m.kind === "hob") hob(g, P, x + m.w / 2, H.depth / 2 + 0.02);
    }
    x += m.w;
  }
  const len = x;

  // Waterfall end (U peninsula)
  if (run.waterfallEnd) box(g, 0.04, COUNTER_Y, H.depth + 0.02, P.counter, len + 0.02, COUNTER_Y / 2, (H.depth + 0.02) / 2);
  if (run.waterfallStart) box(g, 0.04, COUNTER_Y, H.depth + 0.02, P.counter, -0.02, COUNTER_Y / 2, (H.depth + 0.02) / 2);
  // A run with no wall behind it gets a finished stone back panel, so the
  // outside of the kitchen never shows bare carcass or cabinet colour.
  if (run.backPanel) box(g, len, COUNTER_Y, 0.02, P.counter, len / 2, COUNTER_Y / 2, -0.01);

  // Backsplash
  if (run.splash) {
    const sp = run.splash;
    const sw = sp.to - sp.from, sh = H.splashTo - COUNTER_Y + (sp.extra ?? 0);
    let splashMat = P.splash;
    if (P.splash.map && P.splashTile) {
      // Scale the tile texture to this panel so every tile is square and the
      // same real-world size on every run.
      splashMat = P.splash.clone();
      splashMat.map = P.splash.map.clone();
      splashMat.map.repeat.set(sw / (P.splashTile * P.splashN), sh / (P.splashTile * P.splashN));
      splashMat.map.offset.set(0, 0);
      splashMat.map.needsUpdate = true;
    }
    box(g, sw, sh, 0.012, splashMat, (sp.from + sp.to) / 2, COUNTER_Y + sh / 2, 0.006, { shadow: false });
    // Wall socket plate on the splash, clear of the sink and hob.
    if (run.socketX !== false) socket(g, P, run.socketX ?? sp.to - 0.2, 1.12);
  }

  // Uppers
  if (run.upper) {
    let ux = run.upperFrom ?? 0;
    for (const u of run.upper) {
      upperUnit(g, P, run, ux, u);
      ux += u.w;
    }
    if (run.fascia) box(g, ux - (run.upperFrom ?? 0), 0.08, H.upperDepth + 0.02, run.fascia, ((run.upperFrom ?? 0) + ux) / 2, H.upperTo + 0.04, (H.upperDepth + 0.02) / 2);
    // Warm LED strip under the wall units, washing the backsplash.
    if (run.underLight !== false) underLight(g, P, run.upperFrom ?? 0, ux, H.upperFrom - 0.006, H.upperDepth - 0.06);
  }
  if (run.extras) run.extras(g, P, len);
  return g;
}

function underLight(g, P, from, to, y, z, intensity = 9) {
  const span = to - from - 0.04;
  box(g, span, 0.008, 0.02, P.led, (from + to) / 2, y, z, { shadow: false });
  const L = new THREE.RectAreaLight(0xffd29a, intensity, span, 0.06);
  L.position.set((from + to) / 2, y - 0.008, z);
  L.lookAt((from + to) / 2, 0, z + 0.05);
  g.add(L);
}

function tallUnit(g, P, x, m) {
  const h = m.h ?? 2.2, w = m.w, zf = H.depth - 0.02;
  box(g, w - 0.004, h - H.plinth, H.depth - 0.02, P.carcass, x + w / 2, H.plinth + (h - H.plinth) / 2, (H.depth - 0.02) / 2);
  box(g, w, H.plinth, H.depth - 0.07, P.plinth, x + w / 2, H.plinth / 2, (H.depth - 0.07) / 2);
  if (m.kind === "fridge") {
    const mat = m.mat ?? P.fridge;
    front(g, P, "slab", x, H.plinth, w, (h - H.plinth) * 0.62, zf, mat);
    front(g, P, "slab", x, H.plinth + (h - H.plinth) * 0.63, w, (h - H.plinth) * 0.37, zf, mat);
    bar(g, P, x + 0.05, H.plinth + (h - H.plinth) * 0.5, zf + 0.02, 0.5, true);
    if (m.dispenser) box(g, 0.16, 0.24, 0.006, P.black, x + w / 2, 1.15, zf + 0.024);
  } else if (m.kind === "tallOven") {
    const mat = m.mat ?? P.lower;
    front(g, P, "slab", x, H.plinth, w, 0.62, zf, mat);
    oven(g, P, x + 0.02, 0.76, w - 0.04, 0.56, zf);
    front(g, P, "slab", x, 1.36, w, h - 1.36, zf, mat);
  } else {
    front(g, P, "slab", x, H.plinth, w, (h - H.plinth) / 2 - 0.004, zf, m.mat ?? P.lower);
    front(g, P, "slab", x, H.plinth + (h - H.plinth) / 2, w, (h - H.plinth) / 2, zf, m.mat ?? P.lower);
  }
  if (m.soffit) {
    // Wood soffit with a warm LED cove underneath (Straight ref).
    box(g, w + 0.02, 0.36, H.depth, P.walnut, x + w / 2, h + 0.18, H.depth / 2);
    box(g, w - 0.04, 0.01, 0.04, P.led, x + w / 2, h + 0.005, H.depth - 0.05, { shadow: false });
  }
}

function upperUnit(g, P, run, x, u) {
  const y0 = H.upperFrom, h = H.upperTo - H.upperFrom, d = H.upperDepth;
  if (u.kind === "gap") return;
  if (u.kind === "hood") {
    if (run.hood === "angled") {
      const hood = box(g, u.w, 0.05, 0.44, P.steel, x + u.w / 2, y0 + 0.18, 0.24);
      hood.rotation.x = 0.35;
      box(g, u.w * 0.5, h - 0.2, 0.24, P.steel, x + u.w / 2, y0 + 0.25 + (h - 0.2) / 2, 0.12);
    } else if (run.hood === "box") {
      box(g, u.w * 0.9, 0.4, 0.42, P.black, x + u.w / 2, y0 + 0.08, 0.21);
      box(g, u.w * 0.9 - 0.04, 0.01, 0.3, P.led, x + u.w / 2, y0 - 0.12, 0.24, { shadow: false });
    } else {
      box(g, u.w + 0.1, 0.06, 0.48, P.steel, x + u.w / 2, y0, 0.24);
      box(g, 0.26, H.wall - y0, 0.26, P.steel, x + u.w / 2, y0 + (H.wall - y0) / 2, 0.13);
    }
    return;
  }
  if (u.kind === "woodTall") {
    box(g, u.w, H.wall - y0 - 0.05, d, P.walnut, x + u.w / 2, y0 + 0.3 + (H.wall - y0 - 0.35) / 2, d / 2);
    return;
  }
  if (u.kind === "open" || u.kind === "cornerOpen") {
    const mat = u.mat ?? P.oak;
    // Open cubby box: back, sides, top, bottom, mid shelf + divider.
    box(g, u.w, h, 0.012, mat, x + u.w / 2, y0 + h / 2, 0.006);
    for (const sx of [x + 0.009, x + u.w - 0.009]) box(g, 0.018, h, d, mat, sx, y0 + h / 2, d / 2);
    for (const sy of [y0 + 0.009, y0 + h - 0.009, y0 + h / 2]) box(g, u.w, 0.018, d, mat, x + u.w / 2, sy, d / 2);
    if (u.w > 0.5) box(g, 0.018, h, d, mat, x + u.w / 2, y0 + h / 2, d / 2);
    // Fill with props
    const lowY = y0 + 0.018, midY = y0 + h / 2 + 0.009;
    const q = u.w / 4;
    if (u.props !== false) {
      plates(g, P, x + q, lowY, d / 2, 4);
      vase(g, P, x + 3 * q, lowY, d / 2, 0.16);
      if (u.books) books(g, P, x + 0.05, midY, d / 2, 5);
      else { jar(g, P, x + q - 0.04, midY, d / 2, 0.12); jar(g, P, x + q + 0.05, midY, d / 2, 0.1); }
      vase(g, P, x + 3 * q, midY, d / 2, 0.12, P.vase);
    }
    return;
  }
  if (u.kind === "glass") {
    // Glass-front display unit, lit from inside.
    const fm = u.frameMat ?? P.oak;
    box(g, u.w - 0.004, h, 0.012, P.carcass, x + u.w / 2, y0 + h / 2, 0.006);
    for (const sx of [x + 0.009, x + u.w - 0.009]) box(g, 0.018, h, d - 0.02, P.carcass, sx, y0 + h / 2, (d - 0.02) / 2);
    for (const sy of [y0 + 0.009, y0 + h - 0.009]) box(g, u.w, 0.018, d - 0.02, P.carcass, x + u.w / 2, sy, (d - 0.02) / 2);
    box(g, u.w - 0.04, 0.008, d - 0.06, P.glass, x + u.w / 2, y0 + h / 2, (d - 0.02) / 2);
    box(g, u.w - 0.06, 0.006, 0.015, P.led, x + u.w / 2, y0 + h - 0.022, d - 0.06, { shadow: false });
    const leaves = u.w > 0.55 ? 2 : 1, lw = u.w / leaves, fz = d - 0.01;
    for (let i = 0; i < leaves; i++) {
      const lx = x + i * lw, f = 0.035;
      box(g, lw - 0.006, f, 0.02, fm, lx + lw / 2, y0 + h - f / 2, fz);
      box(g, lw - 0.006, f, 0.02, fm, lx + lw / 2, y0 + f / 2, fz);
      box(g, f, h, 0.02, fm, lx + f / 2, y0 + h / 2, fz);
      box(g, f, h, 0.02, fm, lx + lw - f / 2, y0 + h / 2, fz);
      box(g, lw - 2 * f, h - 2 * f, 0.004, P.glassFront, lx + lw / 2, y0 + h / 2, fz, { shadow: false });
    }
    for (let i = 0; i < 4; i++) {
      cyl(g, 0.03, 0.025, 0.1, P.glass, x + 0.1 + i * ((u.w - 0.2) / 3), y0 + 0.068, d / 2 - 0.02, 14);
      cyl(g, 0.035, 0.028, 0.08, P.glass, x + 0.1 + i * ((u.w - 0.2) / 3), y0 + h / 2 + 0.044, d / 2 - 0.02, 14);
    }
    return;
  }
  // Closed wall cabinet
  box(g, u.w - 0.004, h, d - 0.02, P.carcass, x + u.w / 2, y0 + h / 2, (d - 0.02) / 2);
  const mat = u.mat ?? run.upperMat ?? P.upper;
  if (u.kind === "lift") {
    const z = front(g, P, "slab", x, y0, u.w, h, d - 0.02, mat);
    bar(g, P, x + u.w / 2, y0 + 0.05, z, u.w * 0.7);
    return;
  }
  const leaves = u.w > 0.55 ? 2 : 1;
  const lw = u.w / leaves;
  for (let i = 0; i < leaves; i++) {
    const z = front(g, P, run.upperStyle ?? "slab", x + i * lw, y0, lw, h, d - 0.02, mat);
    if (run.upperHandles === "knob") knob(g, P, x + i * lw + (i === 0 && leaves === 2 ? lw - 0.06 : 0.06), y0 + 0.08, z);
  }
}

function place(group, wall, from, to, W) {
  if (wall === "back") group.position.set(from, 0, 0);
  if (wall === "left") { group.position.set(0, 0, to); group.rotation.y = Math.PI / 2; }
  if (wall === "right") { group.position.set(W, 0, from); group.rotation.y = -Math.PI / 2; }
  // Free-standing run along z whose fronts face -x (out of the room).
  if (wall === "peninsula") { group.position.set(H.depth, 0, from); group.rotation.y = -Math.PI / 2; }
  return group;
}

/* ------------------------------------------------------------------ */
/* Layout specs                                                        */
/* ------------------------------------------------------------------ */
function palette(layout, c = {}) {
  const common = {
    carcass: M("#f1efea", { roughness: 0.8 }),
    plinth: M("#2a2b2e", { roughness: 0.6 }),
    metal: M("#c8ccd0", { roughness: 0.25, metalness: 0.9 }),
    steel: M("#c3c7cb", { roughness: 0.3, metalness: 0.85 }),
    sinkIn: M("#8d9196", { roughness: 0.35, metalness: 0.7 }),
    black: M("#1c1d20", { roughness: 0.45 }),
    glassBlack: M("#0d0e10", { roughness: 0.1, metalness: 0.3 }),
    glass: M("#cfe0e6", { roughness: 0.04, metalness: 0.1, transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false }),
    ring: M("#5a5d63", { roughness: 0.4 }),
    // turned objects are open surfaces, so they render from both sides
    ceramic: gloss("#f5f4f0", { roughness: 0.25, clearcoat: 0.4, side: THREE.DoubleSide }),
    vase: M("#d8cfc3", { roughness: 0.5, side: THREE.DoubleSide }),
    pot: M("#e9e5df", { roughness: 0.6, side: THREE.DoubleSide }),
    soil: M("#2f2418", { roughness: 1 }),
    leaf: M("#3f7a3a", { roughness: 0.55, side: THREE.DoubleSide }),
    trunk: M("#6b4b2f"),
    wood: M("#b88a59", { map: woodTex("#c49a6c", [1, 1]), roughness: 0.7 }),
    oak: M("#e3c79c", { map: woodTex("#e4c89e", [1, 1]), roughness: 0.7 }),
    walnut: M("#b08458", { map: woodTex("#a77a52", [1, 2]), roughness: 0.6 }),
    led: M("#ffd9a0", { emissive: "#ffc66b", emissiveIntensity: 1.6 }),
    fridge: M("#c9ccd0", { roughness: 0.3, metalness: 0.7 }),
    brass: M("#b8893b", { roughness: 0.35, metalness: 0.85 }),
    castIron: M("#26272a", { roughness: 0.7, metalness: 0.4 }),
    applianceBody: M("#2d2e31", { roughness: 0.4, metalness: 0.3 }),
    glassFront: M("#dbe7ee", { roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.28 }),
    ceiling: M("#f8f7f4", { roughness: 0.95 }),
    downlight: M("#ffffff", { emissive: "#fff3dd", emissiveIntensity: 2.2 }),
  };
  // Each area falls back to the reference finish when no colour is chosen.
  const stone = (c, o = {}) => gloss(c, { roughness: 0.25, clearcoat: 0.6, ...o });
  if (layout === "u") return {
    ...common,
    lower: gloss(c.base ?? "#93a6ba"),
    upper: gloss(c.wall ?? "#f4f4f2"),
    counter: c.counter ? stone(c.counter, { map: graniteTex([1.4, 0.5], 23) }) : gloss("#ffffff", { map: marbleTex([1.2, 0.4]), roughness: 0.18 }),
    // large stone-look square tiles with varied faces and fine grout
    splash: gloss(c.splash ?? "#ffffff", { map: tileTex("#f2efe9", "#d2cdc4", 6, 0.1, [1, 1]), roughness: 0.4, clearcoat: 0.3 }),
    splashTile: 0.18, splashN: 6,
    floor: gloss("#ffffff", { map: terrazzoTex([2.4, 2]), roughness: 0.3, clearcoat: 0.5 }),
    wallMat: M("#ffffff", { map: plasterTex("#bdb2a5", [3, 3]), roughness: 0.95 }),
    rug: M("#ffffff", { map: rugTex("#e6e1d8", "#8d9db0"), roughness: 1 }),
  };
  if (layout === "l") return {
    ...common,
    lower: M(c.base ?? "#8b8a86", { roughness: 0.55 }),
    upper: M(c.wall ?? "#8b8a86", { roughness: 0.55 }),
    counter: stone(c.counter ?? "#cfcdc8", { map: graniteTex([1.6, 0.6], 29, 4200), roughness: 0.3, clearcoat: 0.5 }),
    // small square marble mosaic, as in the reference
    splash: gloss(c.splash ?? "#ffffff", { map: tileTex("#f3f1ee", "#d6d3cd", 8, 0.1, [1, 1]), roughness: 0.3, clearcoat: 0.5 }),
    splashTile: 0.055, splashN: 8,
    floor: M("#ffffff", { map: tileTex("#e2a06c", "#c98a5a", 8, 0.18, [3, 3]), roughness: 0.7 }),
    rug: M("#ffffff", { map: rugTex("#e9e2d4", "#6f8397"), roughness: 1 }),
    wallMat: M("#ffffff", { map: plasterTex("#e8d9c6", [3, 3]), roughness: 0.95 }),
  };
  return {
    ...common,
    lower: M(c.base ?? "#5a5754", { roughness: 0.62 }), // super-matte (anti-fingerprint) fronts
    upper: c.wall ? M(c.wall, { roughness: 0.5 }) : M("#b08458", { map: woodTex("#a77a52", [1, 1]), roughness: 0.55 }),
    counter: stone(c.counter ?? "#d9d5cf", { map: marbleTex([1.8, 0.6]), roughness: 0.28, clearcoat: 0.5 }),
    // small square matt tiles with dark grout lines, as in the reference
    splash: M(c.splash ?? "#ffffff", { map: tileTex("#c8c2ba", "#6b6560", 8, 0.1, [1, 1]), roughness: 0.65 }),
    splashTile: 0.075, splashN: 8,
    floor: M("#ffffff", { map: tileTex("#d7c9b8", "#c7b8a6", 4, 0.06, [3, 3]), roughness: 0.55 }),
    wallMat: M("#6a6662", { map: concreteTex("#6d6964", [2, 2]), roughness: 0.95 }),
    rug: M("#ffffff", { map: rugTex("#cdbfae", "#8a7664"), roughness: 1 }),
  };
}

// Camera framings per layout. `overview` is the cut-away from outside and
// sways gently until touched; `front` and `detail` stand inside the room at
// eye level (wider lens), where the ceiling and downlights appear.
const VIEWS = {
  u: {
    W: 3.6, D: 3.0, az: [-0.45, 0.6],
    overview: { cam: [1.4, 4.4, 6.6], target: [1.8, 0.8, 1.3], fov: 36 },
    front: { cam: [1.9, 1.6, 2.95], target: [1.9, 1.25, 0], fov: 60 },
    detail: { cam: [1.6, 1.55, 1.9], target: [3.3, 1.0, 0.9], fov: 50 },
  },
  l: {
    W: 3.6, D: 3.0, az: [-0.35, 1.7],
    overview: { cam: [5.6, 4.0, 5.6], target: [1.7, 0.9, 1.2], fov: 36 },
    front: { cam: [2.1, 1.6, 2.95], target: [1.9, 1.25, 0], fov: 60 },
    detail: { cam: [2.1, 1.6, 2.3], target: [0.35, 1.0, 1.3], fov: 50 },
  },
  straight: {
    W: 4.4, D: 3.6, az: [-0.9, 0.9],
    overview: { cam: [5.8, 3.2, 6.3], target: [2.2, 1.1, 1.3], fov: 36 },
    front: { cam: [2.3, 1.6, 3.5], target: [2.3, 1.3, 0], fov: 62 },
    detail: { cam: [3.0, 1.6, 1.5], target: [2.5, 1.05, 0.3], fov: 50 },
  },
};

function buildScene(layout, colors) {
  const P = palette(layout, colors);
  const v = VIEWS[layout];
  const g = new THREE.Group();

  // Floor + walls
  box(g, v.W, 0.06, v.D, P.floor, v.W / 2, -0.03, v.D / 2);
  const walls = { u: ["back", "left", "right"], l: ["back", "left"], straight: ["back"] }[layout];
  if (walls.includes("back")) box(g, v.W, H.wall, 0.08, P.wallMat, v.W / 2, H.wall / 2, -0.04);
  if (walls.includes("left")) box(g, 0.08, H.wall, v.D, P.wallMat, -0.04, H.wall / 2, v.D / 2);
  if (walls.includes("right")) box(g, 0.08, H.wall, v.D, P.wallMat, v.W + 0.04, H.wall / 2, v.D / 2);

  // Skirting boards along each wall, so the wall meets the floor properly
  // wherever no cabinet stands in front of it.
  const skirt = M({ u: "#ffffff", l: "#f4eee5", straight: "#2c2a28" }[layout], { roughness: 0.5 });
  if (walls.includes("back")) box(g, v.W, 0.1, 0.016, skirt, v.W / 2, 0.05, 0.008);
  if (walls.includes("left")) box(g, 0.016, 0.1, v.D, skirt, 0.008, 0.05, v.D / 2);
  if (walls.includes("right")) box(g, 0.016, 0.1, v.D, skirt, v.W - 0.008, 0.05, v.D / 2);

  const ceiling = new THREE.Group();
  ceiling.name = "ceiling";
  ceiling.visible = false;
  box(ceiling, v.W, 0.06, v.D, P.ceiling, v.W / 2, H.wall + 0.03, v.D / 2, { shadow: false });
  for (let ix = 0; ix < 3; ix++) for (let iz = 0; iz < 2; iz++) {
    const lx = (v.W / 3) * (ix + 0.5), lz = (v.D / 2) * (iz + 0.5);
    cyl(ceiling, 0.06, 0.06, 0.012, P.steel, lx, H.wall - 0.004, lz, 24);
    cyl(ceiling, 0.045, 0.045, 0.014, P.downlight, lx, H.wall - 0.006, lz, 24);
  }
  g.add(ceiling);

  const add = (wall, from, to, run) => g.add(place(buildRun(P, run), wall, from, to, v.W));

  if (layout === "u") {
    // Back wall: prep sink, built-in oven, drawers. Uppers: oak cubby at the
    // left end over the peninsula, white slab doors, oak fascia band.
    add("back", 0.6, 3.0, {
      style: "slab",
      base: [{ w: 0.6, kind: "drawers" }, { w: 0.6, kind: "sink" }, { w: 0.6, kind: "oven" }, { w: 0.6, kind: "doors" }],
      splash: { from: -0.6, to: 2.4 },
      upperFrom: -0.6,
      upper: [{ w: 0.6, kind: "open", books: true }, { w: 0.6, kind: "wall" }, { w: 0.6, kind: "glass" }, { w: 0.6, kind: "wall" }, { w: 0.6, kind: "wall" }],
      fascia: P.oak,
      extras: (rg) => {
        board(rg, P, 1.25, COUNTER_Y, 0.04, 0.12, 0.3);
        fruitBowl(rg, P, 0.3, COUNTER_Y, 0.32);
        ladleRail(rg, P, 0.85, 1.3, 0.012, 0.46);
        knifeBlock(rg, P, 1.55, COUNTER_Y, 0.12);
        box(rg, 0.36, 0.05, 0.08, P.oak, 2.05, COUNTER_Y + 0.12, 0.05);
        jar(rg, P, 1.95, COUNTER_Y + 0.145, 0.05, 0.08); jar(rg, P, 2.1, COUNTER_Y + 0.145, 0.05, 0.1);
        plant(rg, P, 2.3, COUNTER_Y, 0.2, 1.1);
      },
    });
    // Right wall: corner, hob over oven, drawers, open end. Uppers: oak
    // cubbies either side of an angled hood.
    add("right", 0.0, 2.4, {
      style: "slab", hood: "angled",
      base: [{ w: 0.6, kind: "corner" }, { w: 0.6, kind: "hob", oven: true }, { w: 0.6, kind: "drawers" }, { w: 0.6, kind: "open" }],
      splash: { from: 0, to: 2.4 },
      upperFrom: 0.6,
      upper: [{ w: 0.6, kind: "hood" }, { w: 0.6, kind: "open" }],
      fascia: P.oak,
      extras: (rg) => {
        kettle(rg, P, 1.5, COUNTER_Y, 0.3);
        bottles(rg, P, 0.2, COUNTER_Y, 0.12);
        plates(rg, P, 2.1, H.plinth + 0.27, 0.3, 4);
        pot(rg, P, 0.73, COUNTER_Y + 0.05, 0.25, 0.095);
        bottles(rg, P, 1.95, COUNTER_Y, 0.1);
      },
    });
    rug(g, P.rug, 2.1, 1.35, 1.7, 0.85);
    for (const z of [0.9, 1.9]) pendant(g, P, 0.3, 1.75, z);
    // Peninsula: fronts and the double-bowl sink face into the kitchen like
    // the other two runs; the outside is a stone back panel with a
    // waterfall end, and an open shelf closes the front end.
    add("left", 0.0, 2.8, {
      style: "slab", waterfallStart: true, backPanel: true,
      base: [{ w: 0.5, kind: "open" }, { w: 0.6, kind: "doors" }, { w: 0.8, kind: "sink", bowls: 2 }, { w: 0.5, kind: "doors" }, { w: 0.4, kind: "corner" }],
      extras: (rg) => {
        plant(rg, P, 0.25, COUNTER_Y, 0.3, 0.9);
        dishRack(rg, P, 0.8, COUNTER_Y, 0.32);
        cyl(rg, 0.06, 0.06, 0.1, P.ceramic, 0.25, H.plinth + 0.3, 0.3);
        cyl(rg, 0.05, 0.05, 0.08, P.ceramic, 0.25, H.plinth + 0.06, 0.3);
      },
    });
    // Oak end panel on the cubbies over the peninsula.
    box(g, 0.03, H.upperTo - H.upperFrom + 0.08, H.upperDepth + 0.02, P.oak, -0.015, (H.upperFrom + H.upperTo + 0.08) / 2, (H.upperDepth + 0.02) / 2);
    tallPlant(g, P, v.W - 0.35, 2.75);
  }

  if (layout === "l") {
    // Left wall: hob over oven, drawers; uppers with a long lift-up unit and
    // open corner shelving with a vase on top.
    add("left", 0.0, 2.2, {
      style: "shaker", upperStyle: "slab", socketX: 1.25,
      base: [{ w: 0.5, kind: "doors" }, { w: 0.6, kind: "hob", oven: true }, { w: 0.5, kind: "doors" }, { w: 0.6, kind: "corner" }],
      splash: { from: 0, to: 2.2 },
      upper: [{ w: 1.0, kind: "lift" }, { w: 0.5, kind: "wall" }, { w: 0.7, kind: "cornerOpen", mat: P.upper }],
      extras: (rg) => {
        vase(rg, P, 1.95, H.upperTo, 0.17, 0.14, P.wood);
        // Utensil rail with boards and a pan under the corner shelves.
        cyl(rg, 0.008, 0.008, 0.6, P.metal, 1.75, 1.3, 0.03).rotation.z = Math.PI / 2;
        board(rg, P, 1.6, COUNTER_Y, 0.05, 0.16, 0.36);
        board(rg, P, 1.82, COUNTER_Y, 0.05, 0.12, 0.3);
        cyl(rg, 0.11, 0.11, 0.015, P.wood, 2.0, 1.12, 0.03).rotation.x = Math.PI / 2;
        jar(rg, P, 1.4, COUNTER_Y, 0.15, 0.16); jar(rg, P, 1.5, COUNTER_Y, 0.15, 0.12);
        microwave(rg, P, 0.25, COUNTER_Y, 0.3);
        kettle(rg, P, 1.3, COUNTER_Y, 0.38);
        pot(rg, P, 0.97, COUNTER_Y + 0.05, 0.25, 0.1);
      },
    });
    rug(g, P.rug, 2.2, 1.35, 1.7, 0.85);
    // Back wall: long run, sink under the window, no uppers.
    add("back", 0.6, 3.6, {
      style: "shaker", splash: { from: 0, to: 3.0 }, socketX: 0.5,
      base: [{ w: 0.6, kind: "drawers" }, { w: 0.6, kind: "doors" }, { w: 0.8, kind: "sink" }, { w: 0.5, kind: "doors" }, { w: 0.5, kind: "doors" }],
      extras: (rg) => {
        // Bread bowl at the end of the counter.
        cyl(rg, 0.16, 0.11, 0.07, P.wood, 2.6, COUNTER_Y + 0.035, 0.32);
        dishRack(rg, P, 2.25, COUNTER_Y, 0.3);
        fruitBowl(rg, P, 0.3, COUNTER_Y, 0.3);
        knifeBlock(rg, P, 0.85, COUNTER_Y, 0.12);
        bottles(rg, P, 0.95, COUNTER_Y, 0.1);
      },
    });
    // Window over the sink + floating wood shelves to its right.
    const wx = 2.2, wy = 1.25, ww = 1.15, wh = 1.05;
    box(g, ww, wh, 0.02, M("#dff0fb", { emissive: "#cfe8fa", emissiveIntensity: 0.6, roughness: 0.1 }), wx, wy + wh / 2, 0.005, { shadow: false });
    for (const [fx, fy, fw, fh] of [[wx, wy, ww + 0.08, 0.05], [wx, wy + wh, ww + 0.08, 0.05], [wx - ww / 2, wy + wh / 2, 0.05, wh], [wx + ww / 2, wy + wh / 2, 0.05, wh], [wx, wy + wh / 2, 0.035, wh], [wx, wy + wh * 0.62, ww, 0.03]])
      box(g, fw, fh, 0.06, M("#ffffff", { roughness: 0.4 }), fx, fy, 0.03);
    // Sill, half-drawn roller blind and a pot plant on the sill.
    box(g, ww + 0.16, 0.03, 0.14, M("#ffffff", { roughness: 0.4 }), wx, wy - 0.015, 0.07);
    box(g, ww - 0.05, 0.3, 0.012, M("#f3ede2", { roughness: 0.95 }), wx, wy + wh - 0.15, 0.045);
    box(g, ww - 0.05, 0.012, 0.016, M("#cfc6b6"), wx, wy + wh - 0.306, 0.045);
    plant(g, P, wx + 0.4, wy, 0.08, 0.9);
    for (const [i, y] of [1.3, 1.62, 1.94].entries()) {
      box(g, 0.5, 0.03, 0.2, P.wood, 3.25, y, 0.1);
      jar(g, P, 3.12, y + 0.015, 0.1, 0.1 + i * 0.02);
      vase(g, P, 3.35, y + 0.015, 0.1, 0.12, i === 1 ? P.wood : P.ceramic);
    }
  }

  if (layout === "straight") {
    // Tall dark column (built-in oven + integrated fridge) under a walnut
    // soffit with a warm LED cove; then the handle-less base run.
    const tallMat = M("#3b3a3a", { roughness: 0.5 });
    add("back", 0.0, 4.4, {
      style: "groove", hood: "box", underLight: false, socketX: 2.35,
      base: [
        { w: 0.6, kind: "tallOven", mat: tallMat, h: 2.2, soffit: true },
        { w: 0.6, kind: "fridge", mat: M("#2b2b2c", { roughness: 0.25, metalness: 0.3 }), h: 2.2, soffit: true, dispenser: true },
        // hob sits at 2.5–3.2 so it lines up with the hood between the shelves
        { w: 0.6, kind: "drawers" }, { w: 0.7, kind: "sink" }, { w: 0.7, kind: "hob" }, { w: 0.6, kind: "drawers" }, { w: 0.6, kind: "drawers" },
      ],
      splash: { from: 1.2, to: 4.4, extra: 0.35 },
      upperFrom: 1.2,
      upper: [{ w: 1.3, kind: "gap" }, { w: 0.7, kind: "hood" }, { w: 1.2, kind: "gap" }],
      extras: (rg) => {
        // Walnut uppers above two black LED shelves, with a tall walnut
        // panel over the hood.
        const y0 = 1.8;
        box(rg, 3.2, H.wall - y0 - 0.05, H.upperDepth, P.upper, 2.8, y0 + (H.wall - y0 - 0.05) / 2, H.upperDepth / 2);
        for (let i = 0; i < 5; i++) box(rg, 0.004, H.wall - y0 - 0.08, 0.004, P.black, 1.2 + 0.64 * (i + 1), y0 + (H.wall - y0) / 2, H.upperDepth + 0.002);
        for (const sy of [1.36, 1.62]) {
          box(rg, 1.25, 0.025, 0.26, P.black, 1.85, sy, 0.13);
          box(rg, 1.15, 0.025, 0.26, P.black, 3.75, sy, 0.13);
          box(rg, 1.15, 0.006, 0.02, P.led, 1.85, sy - 0.016, 0.22, { shadow: false });
          box(rg, 1.05, 0.006, 0.02, P.led, 3.75, sy - 0.016, 0.22, { shadow: false });
        }
        jar(rg, P, 1.45, 1.6 + 0.0125, 0.13, 0.12); jar(rg, P, 1.6, 1.6 + 0.0125, 0.13, 0.1);
        cyl(rg, 0.05, 0.04, 0.12, P.black, 1.95, 1.34 + 0.0125 + 0.06, 0.13);
        cyl(rg, 0.12, 0.1, 0.05, P.black, 2.25, 1.34 + 0.0125 + 0.025, 0.13);
        jar(rg, P, 3.6, 1.6 + 0.0125, 0.13, 0.14); jar(rg, P, 3.9, 1.34 + 0.0125, 0.13, 0.12);
        underLight(rg, P, 1.225, 2.475, 1.335, 0.2, 7);
        underLight(rg, P, 3.175, 4.325, 1.335, 0.2, 7);
        kettle(rg, P, 3.5, COUNTER_Y, 0.35);
        knifeBlock(rg, P, 1.5, COUNTER_Y, 0.12);
        bottles(rg, P, 3.3, COUNTER_Y, 0.1);
        plant(rg, P, 3.95, COUNTER_Y, 0.25, 1.2);
        plant(rg, P, 4.2, COUNTER_Y, 0.2, 0.9);
        pot(rg, P, 2.68, COUNTER_Y + 0.05, 0.25, 0.1);
      },
    });
    // A single-wall kitchen has just the one wall, so a plant stands on
    // the floor beside the fridge column instead of on a side-wall shelf.
    tallPlant(g, P, 0.3, 1.1);
    // Dining table: walnut top, black steel frame, walnut slab leg; bar stool.
    const T = { x: 3.4, z: 2.15, w: 1.6, d: 0.75, h: 0.92 };
    box(g, T.w, 0.045, T.d, P.walnut, T.x, T.h, T.z);
    box(g, 0.06, T.h - 0.02, T.d - 0.05, P.walnut, T.x + T.w / 2 - 0.05, (T.h - 0.02) / 2, T.z);
    for (const dz of [-1, 1]) {
      box(g, 0.03, T.h - 0.02, 0.03, P.black, T.x - T.w / 2 + 0.05, (T.h - 0.02) / 2, T.z + dz * (T.d / 2 - 0.04));
      box(g, T.w - 0.1, 0.03, 0.03, P.black, T.x, T.h - 0.04, T.z + dz * (T.d / 2 - 0.04));
    }
    rug(g, P.rug, T.x - 0.1, T.z + 0.1, 2.4, 1.3);
    for (const dx of [-0.45, 0.45]) pendant(g, P, T.x + dx, 1.8, T.z);
    fruitBowl(g, P, T.x - 0.3, T.h + 0.022, T.z);
    cyl(g, 0.17, 0.15, 0.05, P.black, T.x + 0.2, 0.72, T.z + 0.6, 24);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const leg = cyl(g, 0.012, 0.012, 0.72, P.black, T.x + 0.2 + Math.cos(a) * 0.12, 0.36, T.z + 0.6 + Math.sin(a) * 0.12, 8);
      leg.rotation.z = Math.cos(a) * 0.12; leg.rotation.x = -Math.sin(a) * 0.12;
    }
  }
  return g;
}

/* ------------------------------------------------------------------ */
/* React component                                                     */
/* ------------------------------------------------------------------ */
export default function Kitchen3D({ layout = "u", colors = {}, shot = "overview" }) {
  const hostRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Ambient occlusion is the biggest realism win but costs GPU time, so
    // phones and small screens skip it.
    const useAO = window.innerWidth >= 700;
    RectAreaLightUniformsLib.init();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#eceff3");
    // Soft studio reflections. Without them steel, chrome, glass and
    // lacquer render flat or almost black.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.3;
    const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 100);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    // Wheel zoom stays off until the visitor clicks into the model, so
    // scrolling the page past it never hijacks the camera and zooms in.
    controls.enableZoom = false;
    const el = renderer.domElement;
    const zoomOn = () => { controls.enableZoom = true; };
    const zoomOff = () => { controls.enableZoom = false; };
    el.addEventListener("pointerdown", zoomOn);
    el.addEventListener("pointerleave", zoomOff);
    controls.minDistance = 1.2;
    controls.maxDistance = 11;
    controls.minPolarAngle = 0.3;
    controls.maxPolarAngle = 1.5;

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8ccbc, 0.7));
    const sun = new THREE.DirectionalLight(0xfff1de, 2.4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.02;
    sun.shadow.radius = 4;
    Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5 });
    scene.add(sun, sun.target);
    // Soft fill from the camera side so fronts never go muddy.
    const fill = new THREE.DirectionalLight(0xdfe8ff, 0.3);
    scene.add(fill);

    const kitchen = new THREE.Group();
    scene.add(kitchen);

    let composer = null;
    let gtao = null;
    if (useAO) {
      // Multisampled HDR target: without it the post-processing chain loses
      // the renderer's antialiasing and edges turn jagged.
      const rt = new THREE.WebGLRenderTarget(host.clientWidth, host.clientHeight, { type: THREE.HalfFloatType, samples: 2 });
      composer = new EffectComposer(renderer, rt);
      composer.addPass(new RenderPass(scene, camera));
      gtao = new GTAOPass(scene, camera, host.clientWidth, host.clientHeight);
      gtao.updateGtaoMaterial({ radius: 0.35, distanceFallOff: 1, thickness: 1, scale: 1, samples: 16 });
      gtao.blendIntensity = 1;
      composer.addPass(gtao);
      composer.addPass(new OutputPass());
    }

    // Gentle side-to-side sway on the overview until the visitor grabs it.
    let sway = !reduce;
    let tween = null; // smooth camera move between shots
    const onStart = () => { sway = false; tween = null; };
    controls.addEventListener("start", onStart);
    const sph = new THREE.Spherical();
    let baseAz = 0;

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      renderer.setSize(w, h, false);
      if (composer) { composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(w, h); }
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(host);
    let t0 = performance.now(); // sway clock
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      if (tween) {
        const k = ease(Math.min(1, (performance.now() - tween.start) / tween.ms));
        camera.position.lerpVectors(tween.fromCam, tween.toCam, k);
        camera.fov = tween.fromFov + (tween.toFov - tween.fromFov) * k;
        camera.updateProjectionMatrix();
        controls.target.lerpVectors(tween.fromTarget, tween.toTarget, k);
        if (k >= 1) {
          tween = null;
          baseAz = sph.setFromVector3(camera.position.clone().sub(controls.target)).theta;
          t0 = performance.now();
        }
      } else if (sway) {
        sph.setFromVector3(camera.position.clone().sub(controls.target));
        sph.theta = baseAz + Math.sin(((performance.now() - t0) / 1000) * 0.35) * 0.25;
        camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(sph));
      }
      fill.position.copy(camera.position);
      // Ceiling only when the eye is inside the room; the cut-away stays open.
      const st = stateRef.current;
      if (st?.ceiling) {
        const p = camera.position;
        st.ceiling.visible = p.x > 0 && p.x < st.room.W && p.z > 0 && p.z < st.room.D && p.y < H.wall;
      }
      controls.update();
      if (composer) composer.render(); else renderer.render(scene, camera);
    };
    tick();

    stateRef.current = {
      kitchen,
      setView: (v, name, instant) => {
        const s = v[name] ?? v.overview;
        controls.minAzimuthAngle = v.az[0];
        controls.maxAzimuthAngle = v.az[1];
        sun.position.set(v.overview.target[0] + 3, 6, v.overview.target[2] + 4.5);
        sun.target.position.set(...v.overview.target);
        sway = !reduce && name === "overview";
        const toCam = new THREE.Vector3(...s.cam);
        const toTarget = new THREE.Vector3(...s.target);
        if (instant || reduce) {
          tween = null;
          camera.position.copy(toCam);
          controls.target.copy(toTarget);
          camera.fov = s.fov ?? 36;
          camera.updateProjectionMatrix();
          controls.update();
          baseAz = sph.setFromVector3(camera.position.clone().sub(controls.target)).theta;
          t0 = performance.now();
        } else {
          tween = { fromCam: camera.position.clone(), fromTarget: controls.target.clone(), toCam, toTarget, fromFov: camera.fov, toFov: s.fov ?? 36, start: performance.now(), ms: 900 };
        }
      },
    };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      controls.removeEventListener("start", onStart);
      el.removeEventListener("pointerdown", zoomOn);
      el.removeEventListener("pointerleave", zoomOff);
      controls.dispose();
      disposeTree(scene);
      for (const g of geoCache.values()) g.dispose();
      geoCache.clear();
      gtao?.dispose();
      composer?.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      stateRef.current = null;
    };
  }, []);

  const colorsKey = JSON.stringify(colors);

  // A new layout cuts straight to its overview; a new shot glides there.
  const lastLayout = useRef(null);
  useEffect(() => {
    const v = VIEWS[layout] ?? VIEWS.u;
    const layoutChanged = lastLayout.current !== layout;
    lastLayout.current = layout;
    stateRef.current?.setView(v, layoutChanged ? "overview" : shot, layoutChanged);
  }, [layout, shot]);

  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;
    disposeTree(s.kitchen);
    s.kitchen.clear();
    const key = VIEWS[layout] ? layout : "u";
    const built = buildScene(key, JSON.parse(colorsKey));
    s.kitchen.add(built);
    s.ceiling = built.getObjectByName("ceiling");
    s.room = VIEWS[key];
  }, [layout, colorsKey]);

  return <div className="hg-k3d" ref={hostRef} />;
}

// Box geometry lives in `geoCache` and is shared between rebuilds, so it is
// only released on unmount; everything else is released here.
function disposeTree(root) {
  const seen = new Set();
  root.traverse((o) => {
    if (o.material) for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
      if (seen.has(m)) continue;
      seen.add(m);
      m.map?.dispose();
      m.dispose();
    }
    if (o.geometry && !o.geometry.userData.cacheKey) o.geometry.dispose();
  });
}

// Shared with Wall3D (the Wall Decor room), which uses the same procedural
// textures and mesh helpers.
export { canvasTex, rng, M, gloss, box, cyl, sphere, lathe, plant, tallPlant, vase, books, woodTex, plasterTex, rugTex, disposeTree, geoCache };
