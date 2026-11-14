import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import {
  canvasTex, rng, M, gloss, box, cyl, sphere, lathe, tallPlant, plant, vase, books, woodTex, rugTex,
  disposeTree, geoCache,
} from "./Kitchen3D";

/**
 * Wall Decor demo: a living room with three walls (back, left, right) whose
 * finish and colour the visitor can change. Every finish is generated in code:
 * paint, mural, wallpaper and 3D wallpaper are painted textures; POP, wood,
 * louver, glass and fabric are real relief geometry so they catch light and
 * cast shadows. Each wall is modelled in a local frame (along +x, wall at
 * z = 0, facing +z) and then rotated into place, like the kitchen runs.
 */
const W = 4.4, D = 3.4, HT = 2.7, SK = 0.1;
const PX = 340; // texture pixels per metre of wall

const VIEW = {
  az: [-0.8, 0.8],
  overview: { cam: [3.1, 2.4, 6.1], target: [2.2, 1.2, 1.1], fov: 36 },
  front: { cam: [2.2, 1.5, 3.9], target: [2.2, 1.4, 0], fov: 52 },
  detail: { cam: [1.7, 1.4, 2.6], target: [1.5, 1.35, 0], fov: 46 },
};

/* ------------------------------------------------------------------ */
/* Colour + texture helpers                                            */
/* ------------------------------------------------------------------ */
// Lighten / darken a colour in sRGB, so finishes can derive their own shades.
function tint(hex, dl, ds = 0) {
  const c = new THREE.Color(hex);
  const o = {};
  c.getHSL(o, THREE.SRGBColorSpace);
  c.setHSL(o.h, THREE.MathUtils.clamp(o.s + ds, 0, 1), THREE.MathUtils.clamp(o.l + dl, 0, 1), THREE.SRGBColorSpace);
  return `#${c.getHexString(THREE.SRGBColorSpace)}`;
}
const dims = (len) => [Math.round(len * PX), Math.round(HT * PX)];

function archPath(g, cx, bottom, w, h) {
  const r = w / 2;
  g.beginPath();
  g.moveTo(cx - r, bottom);
  g.lineTo(cx - r, bottom - h + r);
  g.arc(cx, bottom - h + r, r, Math.PI, 0);
  g.lineTo(cx + r, bottom);
  g.closePath();
}
function tri(g, ax, ay, bx, by, cx, cy, fill) {
  g.fillStyle = fill;
  g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.lineTo(cx, cy); g.closePath(); g.fill();
}

// One painter per flat finish. Each returns a texture sized to the wall.
const PAINTERS = {
  "wall-paint": (color, len) => { const [w, h] = dims(len); return canvasTex(w, h, (g) => {
    const r = rng(11);
    g.fillStyle = color; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) { // roller stipple
      g.fillStyle = `rgba(${r() > 0.5 ? "255,255,255" : "0,0,0"},${r() * 0.03})`;
      g.fillRect(r() * w, r() * h, 1 + r() * 3, 6 + r() * 40);
    }
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "rgba(255,255,255,0.05)"); gr.addColorStop(1, "rgba(0,0,0,0.07)");
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }); },

  mural: (color, len) => { const [w, h] = dims(len); return canvasTex(w, h, (g) => {
    g.fillStyle = tint(color, 0.12); g.fillRect(0, 0, w, h);
    // sun with a soft halo
    const sx = w * 0.3, sy = h * 0.34;
    const halo = g.createRadialGradient(sx, sy, h * 0.05, sx, sy, h * 0.3);
    halo.addColorStop(0, "rgba(255,255,255,0.35)"); halo.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = halo; g.fillRect(0, 0, w, h);
    g.fillStyle = tint(color, 0.27); g.beginPath(); g.arc(sx, sy, h * 0.14, 0, Math.PI * 2); g.fill();
    // layered hills
    for (let k = 0; k < 4; k++) {
      g.fillStyle = tint(color, -0.05 * (k + 1), 0.02 * k);
      g.beginPath(); g.moveTo(0, h);
      for (let x = 0; x <= w; x += 8) g.lineTo(x, h * (0.5 + k * 0.1) + Math.sin((x / w) * Math.PI * (1.3 + k * 0.55) + k * 1.9) * h * 0.045);
      g.lineTo(w, h); g.closePath(); g.fill();
    }
    // a tree on the right
    const tx = w * 0.84;
    g.strokeStyle = tint(color, -0.34); g.lineWidth = 7; g.lineCap = "round";
    g.beginPath(); g.moveTo(tx, h); g.lineTo(tx, h * 0.26); g.stroke();
    for (let i = 0; i < 8; i++) {
      const y = h * (0.36 + i * 0.07), s = i % 2 ? 1 : -1;
      g.lineWidth = 4;
      g.beginPath(); g.moveTo(tx, y); g.lineTo(tx + s * w * 0.04, y - h * 0.04); g.stroke();
      g.fillStyle = tint(color, -0.2 - (i % 3) * 0.04);
      g.beginPath(); g.ellipse(tx + s * w * 0.045, y - h * 0.05, 26, 14, s * 0.6, 0, Math.PI * 2); g.fill();
    }
    g.strokeStyle = tint(color, -0.3); g.lineWidth = 3;
    for (const [bx, by] of [[0.58, 0.18], [0.64, 0.14], [0.7, 0.2]]) { // birds
      g.beginPath(); g.moveTo(bx * w - 14, by * h); g.quadraticCurveTo(bx * w - 7, by * h - 10, bx * w, by * h);
      g.quadraticCurveTo(bx * w + 7, by * h - 10, bx * w + 14, by * h); g.stroke();
    }
  }); },

  painting: (color, len) => { const [w, h] = dims(len); return canvasTex(w, h, (g) => {
    g.fillStyle = "#f2ece3"; g.fillRect(0, 0, w, h);
    g.fillStyle = tint(color, -0.08); g.fillRect(0, h - 0.3 * PX, w, 0.3 * PX); // dado band
    for (const fx of [0.17, 0.83]) { // two small flanking arches
      archPath(g, w * fx, h - 0.3 * PX, 0.9 * PX, 1.5 * PX);
      g.fillStyle = tint(color, 0.22); g.fill();
    }
    archPath(g, w / 2, h - 0.3 * PX, 2.0 * PX, 2.0 * PX); // the big arch
    g.fillStyle = color; g.fill();
    archPath(g, w / 2, h - 0.3 * PX, 1.78 * PX, 1.88 * PX);
    g.strokeStyle = "rgba(242,236,227,0.85)"; g.lineWidth = 5; g.stroke();
    g.fillStyle = tint(color, -0.1); g.fillRect(0, h * 0.04, w, 6); // picture-rail line
  }); },

  "wallpaper-normal": (color, len) => { const [w, h] = dims(len); return canvasTex(w, h, (g) => {
    const r = rng(23);
    g.fillStyle = color; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 92) { // tone-on-tone stripes with a pin line
      g.fillStyle = "rgba(255,255,255,0.07)"; g.fillRect(x, 0, 46, h);
      g.fillStyle = "rgba(0,0,0,0.06)"; g.fillRect(x + 46, 0, 1.5, h);
    }
    for (let i = 0; i < 3200; i++) { // linen weave
      g.fillStyle = `rgba(${r() > 0.5 ? "255,255,255" : "0,0,0"},${r() * 0.04})`;
      g.fillRect(r() * w, r() * h, 6 + r() * 14, 1);
    }
  }); },

  wallpaper: (color, len) => { const [w, h] = dims(len); return canvasTex(w, h, (g) => {
    g.fillStyle = color; g.fillRect(0, 0, w, h);
    const leaf = tint(color, 0.16), dot = tint(color, 0.3), tile = 230;
    for (let j = -1; j * tile * 0.8 < h + tile; j++) for (let i = -1; i * tile < w + tile; i++) {
      const cx = i * tile + (j % 2 ? tile / 2 : 0), cy = j * tile * 0.8;
      g.strokeStyle = leaf; g.lineWidth = 3;
      g.beginPath(); g.moveTo(cx, cy + 70); g.quadraticCurveTo(cx + 10, cy, cx, cy - 70); g.stroke();
      g.fillStyle = leaf;
      for (let k = 0; k < 5; k++) for (const s of [-1, 1]) {
        const ly = cy + 56 - k * 28;
        g.save(); g.translate(cx, ly); g.rotate(s * 0.95);
        g.beginPath(); g.ellipse(s * 15, 0, 17, 7, 0, 0, Math.PI * 2); g.fill();
        g.restore();
      }
      g.beginPath(); g.ellipse(cx, cy - 78, 6, 12, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = dot; // small blossoms between the sprigs
      for (const [dx, dy] of [[tile / 2, tile * 0.4], [tile / 2 - 12, tile * 0.4 + 12], [tile / 2 + 12, tile * 0.4 + 10]]) {
        g.beginPath(); g.arc(cx + dx, cy + dy, 6, 0, Math.PI * 2); g.fill();
      }
    }
  }); },

  "3d": (color, len) => { const [w, h] = dims(len); return canvasTex(w, h, (g) => {
    g.fillStyle = color; g.fillRect(0, 0, w, h);
    const s = 150;
    for (let j = 0, y = 0; y < h; y += s, j++) for (let i = 0, x = 0; x < w; x += s, i++) {
      const cx = x + s / 2, cy = y + s / 2, f = (i + j) % 2 ? -1 : 1; // alternate so the pyramids read as diamonds
      tri(g, x, y, x + s, y, cx, cy, tint(color, 0.1 * f));
      tri(g, x + s, y, x + s, y + s, cx, cy, tint(color, -0.08 * f));
      tri(g, x + s, y + s, x, y + s, cx, cy, tint(color, -0.16 * f));
      tri(g, x, y + s, x, y, cx, cy, tint(color, 0.03 * f));
    }
    g.strokeStyle = "rgba(0,0,0,0.07)"; g.lineWidth = 1;
    for (let y = 0; y < h; y += s) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    for (let x = 0; x < w; x += s) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  }); },

  // Panel strips with fine veining and a groove between each strip.
  pvc: (color, len) => { const [w, h] = dims(len); return canvasTex(w, h, (g) => {
    const r = rng(29);
    g.fillStyle = color; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 46; i++) {
      g.strokeStyle = `rgba(${r() > 0.5 ? "60,60,70" : "255,255,255"},${0.05 + r() * 0.12})`;
      g.lineWidth = 0.6 + r() * 2.2;
      g.beginPath(); let x = r() * w, y = 0; g.moveTo(x, y);
      while (y < h) { y += 40; x += (r() - 0.5) * 60; g.lineTo(x, y); }
      g.stroke();
    }
    const strip = 0.25 * PX;
    for (let x = strip; x < w; x += strip) {
      g.fillStyle = "rgba(0,0,0,0.32)"; g.fillRect(x - 1.5, 0, 3, h);
      g.fillStyle = "rgba(255,255,255,0.4)"; g.fillRect(x + 1.5, 0, 1.5, h);
    }
  }); },
};

// Long wood grain for planks and slats.
const plankTex = (color, seed, w = 128) => canvasTex(w, 1024, (g, cw, ch) => {
  const r = rng(seed);
  g.fillStyle = color; g.fillRect(0, 0, cw, ch);
  for (let i = 0; i < 46; i++) {
    g.strokeStyle = r() > 0.4 ? `rgba(40,22,8,${0.05 + r() * 0.12})` : `rgba(255,240,215,${0.04 + r() * 0.07})`;
    g.lineWidth = 0.6 + r() * 2.2;
    const x = r() * cw;
    g.beginPath(); g.moveTo(x, 0);
    g.bezierCurveTo(x + (r() - 0.5) * 14, ch / 3, x + (r() - 0.5) * 14, (2 * ch) / 3, x + (r() - 0.5) * 8, ch);
    g.stroke();
  }
  for (let k = 0; k < 2; k++) { // a knot or two
    const kx = cw * (0.25 + r() * 0.5), ky = ch * (0.15 + r() * 0.7);
    g.strokeStyle = "rgba(40,22,8,0.18)"; g.lineWidth = 1.4;
    for (let q = 1; q < 4; q++) { g.beginPath(); g.ellipse(kx, ky, 4 * q, 10 * q, 0, 0, Math.PI * 2); g.stroke(); }
  }
});

const weaveTex = (color, repeat) => canvasTex(128, 128, (g, w, h) => {
  const r = rng(5);
  g.fillStyle = color; g.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 2) for (let x = (y / 2) % 2 ? 0 : 2; x < w; x += 4) {
    g.fillStyle = `rgba(0,0,0,${0.05 + r() * 0.05})`; g.fillRect(x, y, 2, 2);
  }
  for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(255,255,255,${r() * 0.05})`; g.fillRect(r() * w, r() * h, 2, 1); }
}, repeat);

const floorTex = () => canvasTex(1024, 1024, (g, w, h) => {
  const r = rng(9), rows = 11, rh = h / rows;
  for (let j = 0; j < rows; j++) {
    let x = -r() * 300;
    while (x < w) {
      const len = 280 + r() * 260;
      g.fillStyle = tint("#cdac80", (r() - 0.5) * 0.09);
      g.fillRect(x, j * rh, len, rh);
      for (let k = 0; k < 7; k++) {
        g.strokeStyle = `rgba(70,40,15,${0.04 + r() * 0.08})`; g.lineWidth = 0.6 + r() * 1.4;
        const yy = j * rh + r() * rh;
        g.beginPath(); g.moveTo(x, yy); g.lineTo(x + len, yy + (r() - 0.5) * 5); g.stroke();
      }
      g.fillStyle = "rgba(40,22,8,0.32)"; g.fillRect(x, j * rh, 1.5, rh);
      x += len;
    }
    g.fillStyle = "rgba(40,22,8,0.3)"; g.fillRect(0, j * rh, w, 1.5);
  }
}, [W / 2.4, D / 2.4]);

/* ------------------------------------------------------------------ */
/* Wall finishes (local frame: along +x, wall at z = 0, facing +z)     */
/* ------------------------------------------------------------------ */
function plane(g, len, mat, z = 0.003) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(len, HT), mat);
  m.position.set(len / 2, HT / 2, z);
  m.receiveShadow = true;
  g.add(m);
  return m;
}
const flat = (map, o = {}) => new THREE.MeshStandardMaterial({ color: "#ffffff", map, roughness: 0.9, ...o });

function frameRect(g, mat, x0, y0, w, h, bar, depth, z) {
  box(g, w, bar, depth, mat, x0 + w / 2, y0 + bar / 2, z);
  box(g, w, bar, depth, mat, x0 + w / 2, y0 + h - bar / 2, z);
  box(g, bar, h - 2 * bar, depth, mat, x0 + bar / 2, y0 + h / 2, z);
  box(g, bar, h - 2 * bar, depth, mat, x0 + w - bar / 2, y0 + h / 2, z);
}

const BUILD = {
  pop(g, color, len) {
    const mat = flat(canvasTex(256, 256, (c, w, h) => {
      const r = rng(41);
      c.fillStyle = color; c.fillRect(0, 0, w, h);
      for (let i = 0; i < 2200; i++) { c.fillStyle = `rgba(${r() > 0.5 ? "255,255,255" : "0,0,0"},${r() * 0.035})`; c.fillRect(r() * w, r() * h, 1 + r() * 5, 1 + r() * 5); }
    }, [len, 2.7]), { roughness: 0.85 });
    plane(g, len, mat);
    const m = 0.16, gap = 0.12, n = Math.max(2, Math.round((len - 2 * m) / 1.05));
    const pw = (len - 2 * m - (n - 1) * gap) / n, y0 = 0.22, ph = 2.08;
    for (let i = 0; i < n; i++) {
      const x0 = m + i * (pw + gap);
      frameRect(g, mat, x0, y0, pw, ph, 0.045, 0.026, 0.013);
      frameRect(g, mat, x0 + 0.1, y0 + 0.1, pw - 0.2, ph - 0.2, 0.022, 0.014, 0.007);
    }
    box(g, len, 0.09, 0.05, mat, len / 2, HT - 0.045, 0.025); // cornice, two steps
    box(g, len, 0.04, 0.1, mat, len / 2, HT - 0.11, 0.05);
  },

  wood(g, color, len) {
    plane(g, len, flat(null, { color: "#1d1713" }));
    const mats = [31, 37, 43, 53].map((s) => new THREE.MeshStandardMaterial({ color: "#ffffff", map: plankTex(color, s), roughness: 0.62 }));
    const pw = 0.14, gap = 0.004, n = Math.floor((len - 0.04) / (pw + gap));
    const x0 = (len - n * (pw + gap) + gap) / 2;
    for (let i = 0; i < n; i++) box(g, pw, HT - 0.12, 0.022, mats[(i * 7) % 4], x0 + pw / 2 + i * (pw + gap), (HT - 0.12) / 2 + 0.1, 0.011);
  },

  louver(g, color, len) {
    plane(g, len, flat(null, { color: tint(color, -0.38) }));
    const mats = [61, 67].map((s) => new THREE.MeshStandardMaterial({ color: "#ffffff", map: plankTex(color, s, 64), roughness: 0.55 }));
    const sw = 0.046, step = 0.088, n = Math.floor((len - 0.1) / step);
    const x0 = (len - n * step + (step - sw)) / 2;
    for (let i = 0; i < n; i++) box(g, sw, HT - 0.14, 0.038, mats[i % 2], x0 + sw / 2 + i * step, (HT - 0.14) / 2 + 0.1, 0.022);
  },

  glass(g, color, len) {
    plane(g, len, flat(null, { color: tint(color, -0.3, 0.02) }));
    const mat = new THREE.MeshPhysicalMaterial({ color, roughness: 0.06, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 2.4 });
    const steel = M("#c3c7cb", { roughness: 0.3, metalness: 0.85 });
    const m = 0.14, gap = 0.016, n = Math.max(2, Math.round(len / 1.15));
    const pw = (len - 2 * m - (n - 1) * gap) / n, y0 = 0.14, ph = 2.36;
    for (let i = 0; i < n; i++) {
      const x0 = m + i * (pw + gap);
      box(g, pw, ph, 0.014, mat, x0 + pw / 2, y0 + ph / 2, 0.035);
      for (const [dx, dy] of [[0.05, 0.05], [pw - 0.05, 0.05], [0.05, ph - 0.05], [pw - 0.05, ph - 0.05]]) {
        const s = cyl(g, 0.011, 0.011, 0.03, steel, x0 + dx, y0 + dy, 0.017, 12);
        s.rotation.x = Math.PI / 2;
        sphere(g, 0.014, steel, x0 + dx, y0 + dy, 0.046);
      }
    }
  },

  fabric(g, color, len) {
    plane(g, len, flat(null, { color: tint(color, -0.3) }));
    const mat = new THREE.MeshStandardMaterial({ color: "#ffffff", map: weaveTex(color, [3, 6]), roughness: 1 });
    const stud = M(tint(color, -0.16), { roughness: 0.7 });
    const gap = 0.014, pw = 0.56, n = Math.floor((len - 0.2) / (pw + gap));
    const x0 = (len - n * (pw + gap) + gap) / 2, ph = 2.3;
    const geo = new RoundedBoxGeometry(pw, ph, 0.07, 5, 0.026);
    for (let i = 0; i < n; i++) {
      const cx = x0 + pw / 2 + i * (pw + gap);
      const p = new THREE.Mesh(geo, mat);
      p.position.set(cx, 0.15 + ph / 2, 0.035); p.castShadow = p.receiveShadow = true;
      g.add(p);
      for (let k = 0; k < 5; k++) sphere(g, 0.013, stud, cx, 0.15 + 0.3 + k * 0.425, 0.073);
    }
  },
};

// Flat finishes are one textured sheet; relief finishes build real geometry.
function finishLayer(finish, color, len) {
  const g = new THREE.Group();
  if (PAINTERS[finish]) {
    const map = PAINTERS[finish](color, len);
    const mat = finish === "pvc" ? gloss("#ffffff", { map, roughness: 0.3, clearcoat: 0.55, clearcoatRoughness: 0.2 })
      : flat(map, { roughness: finish === "3d" ? 0.6 : finish.startsWith("wallpaper") ? 0.78 : 0.92 });
    plane(g, len, mat);
  } else BUILD[finish]?.(g, color, len);
  return g;
}

function skirting(len) {
  const g = new THREE.Group();
  box(g, len, SK, 0.018, M("#f4f1ea", { roughness: 0.5 }), len / 2, SK / 2, 0.009);
  return g;
}

function placeWall(which, node) {
  if (which === "left") { node.position.set(0, 0, D); node.rotation.y = Math.PI / 2; }
  else if (which === "right") { node.position.set(W, 0, 0); node.rotation.y = -Math.PI / 2; }
  return node;
}

function buildWalls(finish, color, target) {
  const walls = new THREE.Group();
  for (const [which, len] of [["back", W], ["left", D], ["right", D]]) {
    const node = new THREE.Group();
    if (target === "all" || which === "back") node.add(finishLayer(finish, color, len));
    node.add(skirting(len));
    walls.add(placeWall(which, node));
  }
  return walls;
}

/* ------------------------------------------------------------------ */
/* The room: floor, wall slabs, furniture (built once)                 */
/* ------------------------------------------------------------------ */
function sbox(g, w, h, d, mat, x, y, z, r = 0.04) {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, Math.min(r, w / 2.2, h / 2.2, d / 2.2)), mat);
  m.position.set(x, y, z); m.castShadow = m.receiveShadow = true;
  g.add(m);
  return m;
}

function armchair(g, fabric, wood) {
  const c = new THREE.Group();
  for (const [dx, dz] of [[-0.3, -0.28], [0.3, -0.28], [-0.3, 0.28], [0.3, 0.28]]) cyl(c, 0.016, 0.012, 0.2, wood, dx, 0.1, dz, 10);
  sbox(c, 0.78, 0.16, 0.72, fabric, 0, 0.28, 0, 0.05);
  sbox(c, 0.64, 0.14, 0.58, fabric, 0, 0.42, 0.05, 0.06);
  sbox(c, 0.78, 0.5, 0.14, fabric, 0, 0.58, -0.3, 0.06).rotation.x = -0.12;
  for (const s of [-1, 1]) sbox(c, 0.12, 0.3, 0.7, fabric, s * 0.36, 0.46, 0, 0.05);
  g.add(c);
  return c;
}

function sideTable(g, x, z, P) {
  cyl(g, 0.2, 0.2, 0.025, P.wood, x, 0.5, z, 36);
  cyl(g, 0.02, 0.02, 0.48, P.dark, x, 0.25, z, 10);
  cyl(g, 0.15, 0.15, 0.02, P.dark, x, 0.01, z, 28);
  // table lamp
  lathe(g, [[0.001, 0], [0.05, 0], [0.07, 0.07], [0.055, 0.16], [0.02, 0.2], [0.001, 0.2]], P.ceramic, x, 0.512, z, 24);
  const shade = cyl(g, 0.1, 0.15, 0.2, P.shade, x, 0.8, z, 28);
  shade.castShadow = false;
}

function buildRoom() {
  const g = new THREE.Group();
  const P = {
    pot: M("#e9e5df", { roughness: 0.6, side: THREE.DoubleSide }),
    soil: M("#2f2418", { roughness: 1 }),
    leaf: M("#3f7a3a", { roughness: 0.55, side: THREE.DoubleSide }),
    trunk: M("#6b4b2f"),
    ceramic: gloss("#f5f4f0", { roughness: 0.25, clearcoat: 0.4, side: THREE.DoubleSide }),
    wood: M("#b88a59", { map: woodTex("#c49a6c", [1, 1]), roughness: 0.7 }),
    dark: M("#2a2623", { roughness: 0.5 }),
    shade: M("#f5ecd9", { emissive: "#ffd9a0", emissiveIntensity: 0.55, roughness: 0.9 }),
    black: M("#1c1d20", { roughness: 0.45 }),
    downlight: M("#ffffff", { emissive: "#fff3dd", emissiveIntensity: 2.2 }),
  };

  // Floor, wall slabs (neutral plaster behind every finish), skirting handled per wall.
  box(g, W, 0.06, D, M("#ffffff", { map: floorTex(), roughness: 0.55 }), W / 2, -0.03, D / 2);
  const plaster = M("#efeae2", { roughness: 0.95 });
  box(g, W + 0.16, HT, 0.08, plaster, W / 2, HT / 2, -0.04);
  box(g, 0.08, HT, D, plaster, -0.04, HT / 2, D / 2);
  box(g, 0.08, HT, D, plaster, W + 0.04, HT / 2, D / 2);

  // Rug
  box(g, 2.5, 0.012, 1.8, M("#ffffff", { map: rugTex("#d9d2c6", "#b8ab98"), roughness: 1 }), 2.2, 0.006, 1.55, { shadow: false });

  // Sofa
  const fab = M("#ffffff", { map: weaveTex("#b9b1a4", [5, 3]), roughness: 1 });
  const sx = W / 2, sz = 0.62;
  for (const [dx, dz] of [[-0.95, -0.34], [0.95, -0.34], [-0.95, 0.34], [0.95, 0.34]]) cyl(g, 0.022, 0.016, 0.14, P.wood, sx + dx, 0.07, sz + dz, 10);
  sbox(g, 2.1, 0.22, 0.9, fab, sx, 0.25, sz, 0.05);
  sbox(g, 2.1, 0.58, 0.2, fab, sx, 0.6, 0.2, 0.06);
  for (const s of [-1, 1]) sbox(g, 0.2, 0.5, 0.9, fab, sx + s * 1.0, 0.52, sz, 0.06);
  for (const dx of [-0.6, 0, 0.6]) {
    sbox(g, 0.58, 0.15, 0.62, fab, sx + dx, 0.45, sz + 0.1, 0.07);
    sbox(g, 0.58, 0.4, 0.17, fab, sx + dx, 0.7, 0.36, 0.08).rotation.x = -0.16;
  }
  const cushion = (c, dx, dy, ry) => { const m = sbox(g, 0.4, 0.4, 0.12, M(c, { roughness: 1 }), sx + dx, dy, 0.46, 0.05); m.rotation.set(-0.25, ry, 0); };
  cushion("#b8745a", -0.75, 0.74, 0.25);
  cushion("#6f8294", -0.42, 0.72, -0.15);
  cushion("#d6c3a0", 0.78, 0.74, -0.2);

  // Coffee table with a few objects
  cyl(g, 0.44, 0.44, 0.035, P.wood, 2.2, 0.4, 1.6, 40);
  cyl(g, 0.045, 0.06, 0.37, P.dark, 2.2, 0.2, 1.6, 12);
  cyl(g, 0.22, 0.22, 0.02, P.dark, 2.2, 0.01, 1.6, 28);
  vase(g, P, 2.35, 0.418, 1.55, 0.2);
  books(g, P, 1.92, 0.418, 1.66, 3);
  plant(g, P, 2.05, 0.418, 1.45, 0.8);

  // Side tables + lamps, plant, armchair, console
  sideTable(g, 0.82, 0.3, P);
  sideTable(g, W - 0.82, 0.3, P);
  tallPlant(g, P, 0.42, 0.45);
  armchair(g, fab, P.wood).position.set(3.35, 0, 2.55);
  g.children[g.children.length - 1].rotation.y = -1.9;
  box(g, 0.38, 0.72, 1.2, P.wood, W - 0.21, 0.36, 1.55);
  box(g, 0.4, 0.03, 1.24, P.dark, W - 0.21, 0.735, 1.55);
  vase(g, P, W - 0.2, 0.75, 1.15, 0.34);
  plant(g, P, W - 0.2, 0.75, 1.75, 1.1);

  // Ceiling + pendant (only shown while the camera is inside the room)
  const ceiling = new THREE.Group();
  ceiling.name = "ceiling";
  ceiling.visible = false;
  box(ceiling, W, 0.06, D, M("#f8f7f4", { roughness: 0.95 }), W / 2, HT + 0.03, D / 2, { shadow: false });
  cyl(ceiling, 0.003, 0.003, 0.95, P.black, 2.2, HT - 0.475, 1.6, 6);
  cyl(ceiling, 0.06, 0.22, 0.18, P.black, 2.2, 1.74, 1.6, 32).castShadow = false;
  cyl(ceiling, 0.21, 0.21, 0.008, P.downlight, 2.2, 1.652, 1.6, 32);
  g.add(ceiling);
  return g;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function Wall3D({ finish = "wall-paint", color = "#efe8dc", target = "feature", shot = "overview" }) {
  const hostRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const useAO = window.innerWidth >= 700;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#eceff3");
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.35;
    const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 100);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false; // off until the visitor clicks in, so page scroll never zooms
    const el = renderer.domElement;
    const zoomOn = () => { controls.enableZoom = true; };
    const zoomOff = () => { controls.enableZoom = false; };
    el.addEventListener("pointerdown", zoomOn);
    el.addEventListener("pointerleave", zoomOff);
    controls.minDistance = 1.2;
    controls.maxDistance = 11;
    controls.minPolarAngle = 0.3;
    controls.maxPolarAngle = 1.5;
    controls.minAzimuthAngle = VIEW.az[0];
    controls.maxAzimuthAngle = VIEW.az[1];

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8ccbc, 0.75));
    const sun = new THREE.DirectionalLight(0xfff1de, 2.3);
    sun.position.set(W / 2 + 3, 5.5, D + 4);
    sun.target.position.set(W / 2, 0.8, 1.2);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.02;
    sun.shadow.radius = 4;
    Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6 });
    scene.add(sun, sun.target);
    const fill = new THREE.DirectionalLight(0xdfe8ff, 0.3);
    scene.add(fill);

    const room = buildRoom();
    scene.add(room);
    const walls = new THREE.Group();
    scene.add(walls);

    let composer = null;
    let gtao = null;
    if (useAO) {
      const rt = new THREE.WebGLRenderTarget(host.clientWidth, host.clientHeight, { type: THREE.HalfFloatType, samples: 2 });
      composer = new EffectComposer(renderer, rt);
      composer.addPass(new RenderPass(scene, camera));
      gtao = new GTAOPass(scene, camera, host.clientWidth, host.clientHeight);
      gtao.updateGtaoMaterial({ radius: 0.35, distanceFallOff: 1, thickness: 1, scale: 1, samples: 16 });
      gtao.blendIntensity = 1;
      composer.addPass(gtao);
      composer.addPass(new OutputPass());
    }

    let sway = !reduce;
    let tween = null;
    const onStart = () => { sway = false; tween = null; };
    controls.addEventListener("start", onStart);
    const sph = new THREE.Spherical();
    let baseAz = 0;

    // Narrow screens zoom out a little so the whole room still fits.
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      if (composer) { composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(w, h); }
      camera.aspect = w / h;
      camera.zoom = Math.min(1, camera.aspect / 1.4);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(host);
    let t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const ceiling = room.getObjectByName("ceiling");
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
      const p = camera.position;
      ceiling.visible = p.x > 0 && p.x < W && p.z > 0 && p.z < D && p.y < HT;
      controls.update();
      if (composer) composer.render(); else renderer.render(scene, camera);
    };
    tick();

    stateRef.current = {
      walls,
      setView: (name, instant) => {
        const s = VIEW[name] ?? VIEW.overview;
        sway = !reduce && name === "overview";
        const toCam = new THREE.Vector3(...s.cam);
        const toTarget = new THREE.Vector3(...s.target);
        if (instant || reduce) {
          tween = null;
          camera.position.copy(toCam);
          controls.target.copy(toTarget);
          camera.fov = s.fov;
          camera.updateProjectionMatrix();
          controls.update();
          baseAz = sph.setFromVector3(camera.position.clone().sub(controls.target)).theta;
          t0 = performance.now();
        } else {
          tween = { fromCam: camera.position.clone(), fromTarget: controls.target.clone(), toCam, toTarget, fromFov: camera.fov, toFov: s.fov, start: performance.now(), ms: 900 };
        }
      },
    };
    stateRef.current.setView("overview", true);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      controls.removeEventListener("start", onStart);
      el.removeEventListener("pointerdown", zoomOn);
      el.removeEventListener("pointerleave", zoomOff);
      controls.dispose();
      disposeTree(scene);
      for (const geo of geoCache.values()) geo.dispose();
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

  // Camera shots glide; the room itself is never rebuilt for them.
  useEffect(() => { stateRef.current?.setView(shot, false); }, [shot]);

  // Only the walls are rebuilt when the finish, colour or target changes.
  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;
    disposeTree(s.walls);
    s.walls.clear();
    s.walls.add(buildWalls(finish, color, target));
  }, [finish, color, target]);

  return <div className="hg-k3d" ref={hostRef} />;
}
