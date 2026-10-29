'use strict';
/* Partikel und Wand-Animationen */

function sparks(cx, cy, n, col, sp = 3) {
  for (let i = 0; i < n; i++) { const a = rnd(0, 6.283), v = rnd(0.4, 1) * sp; S.parts.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rnd(0.4, 0.9), age: 0, col }); }
}

function addAnim(c, r, d, kind) { const k = canon(c, r, d); S.anims.push({ c: k[0], r: k[1], dir: k[2], age: 0, kind }); }
