'use strict';
/* Bodeneinbrueche */

const holeWarn = () => Math.max(0.45, 0.7 - 0.05 * Math.min(S.level, 5)) * [1, 0.8, 0.65][MODE];

function makePoly() {
  const n = 11 + ri(3), pts = [];
  for (let k = 0; k < n; k++) { const a = k / n * 6.283 + rnd(-0.2, 0.2), rr = rnd(0.36, 0.5); pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
  return pts;
}

function addHole(c, r) {
  if (!inb(c, r)) return false;
  const i = idx(c, r);
  if (S.holes.has(i) || (c === G.c && r === G.r) || (c === S.startC && r === S.startR) || S.cores.some(k => k.c === c && k.r === r) || S.items.some(k => !k.got && k.c === c && k.r === r) || S.portals.some(k => k.c === c && k.r === r) || (S.door && S.door.c === c && S.door.r === r)) return false;
  if (S.holes.size >= Math.min(9, 4 + Math.min(S.level, 5) + MODE * 2) - (S.fails >= 3 ? 2 : 0)) return false;
  S.holes.set(i, { st: 'warn', t: 0, wt: holeWarn(), life: rnd(5, 11), poly: makePoly() });
  ensureConnected(null);
  if (!connectedOK()) { S.holes.delete(i); return false; }
  sfx.crack(); return true;
}

function holeEvent() {
  const L = Math.min(S.level, 5), kinds = ['path', 'ahead', 'scatter']; if (L >= 2) kinds.push('ring');
  const kind = pick(kinds);
  if (kind === 'path') {
    const cells = pathEdges(6).map(e => [e[0] + DX[e[2]], e[1] + DY[e[2]]]);
    const n = 1 + (Math.random() < 0.5 ? 1 : 0) + (L >= 4 ? 1 : 0);
    for (let k = 0; k < n && k < cells.length; k++) { const c = cells[Math.min(cells.length - 1, 1 + k)]; addHole(c[0], c[1]); }
  } else if (kind === 'ahead') {
    let c = P.c, r = P.r; const cells = [];
    for (let k = 0; k < 4; k++) { const d = P.face; if (!inb(c + DX[d], r + DY[d]) || wallAt(c, r, d)) break; c += DX[d]; r += DY[d]; cells.push([c, r]); }
    for (const x of cells) if (Math.random() < 0.7) addHole(x[0], x[1]);
  } else if (kind === 'scatter') {
    const dp = bfs(P.c, P.r).d, n = 3 + Math.floor(L / 2);
    for (let k = 0, a = 0; k < 60 && a < n; k++) { const c = ri(cols), r = ri(rows); if (dp[idx(c, r)] >= 2 && dp[idx(c, r)] <= 9 && addHole(c, r)) a++; }
  } else {
    const nb = DIRS.filter(d => !blocked(P.c, P.r, d) && inb(P.c + DX[d], P.r + DY[d]));
    const keep = nb.slice().sort(() => Math.random() - 0.5).slice(0, nb.length > 2 ? 2 : 1);
    for (const d of nb) if (!keep.includes(d)) addHole(P.c + DX[d], P.r + DY[d]);
  }
  say(T.hole, true);
}
