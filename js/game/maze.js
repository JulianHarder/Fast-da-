'use strict';
/* Labyrinth: Wandbits, Erzeugung, Breitensuche */

const N = 1, E = 2, SO = 4, WE = 8;
const DX = { 1: 0, 2: 1, 4: 0, 8: -1 }, DY = { 1: -1, 2: 0, 4: 1, 8: 0 }, OPP = { 1: 4, 2: 8, 4: 1, 8: 2 };
const DIRS = [N, E, SO, WE];
let cols = 14, rows = 9, walls = new Uint8Array(cols * rows);
const idx = (c, r) => r * cols + c;
const inb = (c, r) => c >= 0 && r >= 0 && c < cols && r < rows;
const wallAt = (c, r, d) => (walls[idx(c, r)] & d) !== 0;

function setWall(c, r, d, v) {
  const i = idx(c, r); if (v) walls[i] |= d; else walls[i] &= ~d;
  const nc = c + DX[d], nr = r + DY[d];
  if (inb(nc, nr)) { const j = idx(nc, nr); if (v) walls[j] |= OPP[d]; else walls[j] &= ~OPP[d]; }
}

function canon(c, r, d) { if (d === N) return [c, r - 1, SO]; if (d === WE) return [c - 1, r, E]; return [c, r, d]; }
function sameEdge(a, c, r, d) { const x = canon(a[0], a[1], a[2]), y = canon(c, r, d); return x[0] === y[0] && x[1] === y[1] && x[2] === y[2]; }

function generate() {
  walls = new Uint8Array(cols * rows).fill(15);
  const seen = new Uint8Array(cols * rows), st = [];
  const c0 = ri(cols), r0 = ri(rows); seen[idx(c0, r0)] = 1; st.push([c0, r0]);
  while (st.length) {
    const [c, r] = st[st.length - 1];
    const opts = DIRS.filter(d => { const nc = c + DX[d], nr = r + DY[d]; return inb(nc, nr) && !seen[idx(nc, nr)]; });
    if (!opts.length) { st.pop(); continue; }
    const d = pick(opts), nc = c + DX[d], nr = r + DY[d];
    setWall(c, r, d, false); seen[idx(nc, nr)] = 1; st.push([nc, nr]);
  }
  let extra = Math.floor(cols * rows * 0.1);
  while (extra-- > 0) {
    const c = ri(cols), r = ri(rows), d = pick([E, SO]);
    if (inb(c + DX[d], r + DY[d]) && wallAt(c, r, d)) setWall(c, r, d, false);
  }
}

function bfs(sc, sr, useDoors, avoidHoles) {
  const d = new Int16Array(cols * rows).fill(-1), q = [idx(sc, sr)]; d[q[0]] = 0;
  for (let h = 0; h < q.length; h++) {
    const i = q[h], c = i % cols, r = (i / cols) | 0;
    for (const dir of DIRS) {
      if (walls[i] & dir) continue;
      if (useDoors && closedDoor(c, r, dir)) continue;
      const nc = c + DX[dir], nr = r + DY[dir]; if (!inb(nc, nr)) continue;
      const j = idx(nc, nr);
      if (avoidHoles && S.holes.has(j)) continue;
      if (d[j] < 0) { d[j] = d[i] + 1; q.push(j); }
    }
  }
  return { d, count: q.length };
}
