'use strict';
/* Waende dynamisch setzen und oeffnen */

function ensureConnected(av) {
  for (let guard = 0; guard < 80; guard++) {
    const res = bfs(G.c, G.r, false, true);
    if (res.count >= cols * rows - S.holes.size) return;
    const d = res.d, cands = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = idx(c, r); if (d[i] < 0) continue;
      for (const dir of DIRS) {
        if (!(walls[i] & dir)) continue;
        const nc = c + DX[dir], nr = r + DY[dir];
        if (!inb(nc, nr)) continue;
        const j = idx(nc, nr);
        if (d[j] >= 0 || S.holes.has(j)) continue;
        if (av && sameEdge(av, c, r, dir)) continue;
        cands.push({ c, r, dir, dd: d[i] });
      }
    }
    if (!cands.length) return;
    const far = cands.filter(x => x.dd >= 3), ch = pick(far.length ? far : cands);
    setWall(ch.c, ch.r, ch.dir, false); addAnim(ch.c, ch.r, ch.dir, 'open');
  }
}

function connectedOK() { return bfs(G.c, G.r, false, true).count >= cols * rows - S.holes.size; }

function placeWall(c, r, dir, quiet) {
  const nc = c + DX[dir], nr = r + DY[dir];
  if (!inb(nc, nr) || wallAt(c, r, dir)) return false;
  setWall(c, r, dir, true);
  ensureConnected([c, r, dir]);
  if (!connectedOK()) { setWall(c, r, dir, false); return false; }
  addAnim(c, r, dir, 'pop');
  if (!quiet) {
    S.pops++; if (!reduced) S.flash = 0.15; sfx.pop(); emitNoise(c, r, 9);
    sparks(c + 0.5 + DX[dir] * 0.5, r + 0.5 + DY[dir] * 0.5, 10, '#e0a060', 2.5);
  }
  return true;
}

function warnWall(c, r, dir) {
  if (!inb(c + DX[dir], r + DY[dir]) || wallAt(c, r, dir)) return false;
  const k = canon(c, r, dir); if (S.wwarn.some(w => w.c === k[0] && w.r === k[1] && w.dir === k[2])) return true;
  S.wwarn.push({ c: k[0], r: k[1], dir: k[2], t: 0, dur: 0.45 }); sfx.tick && sfx.tick(); return true;
}

function updateWallWarn(dt) {
  for (const w of S.wwarn) w.t += dt;
  const due = S.wwarn.filter(w => w.t >= w.dur); if (!due.length) return;
  S.wwarn = S.wwarn.filter(w => w.t < w.dur);
  for (const w of due) placeWall(w.c, w.r, w.dir);
}

function openWall(c, r, dir) {
  if (!inb(c + DX[dir], r + DY[dir]) || !wallAt(c, r, dir)) return false;
  setWall(c, r, dir, false); addAnim(c, r, dir, 'open'); return true;
}

function popAhead() {
  let c = P.c, r = P.r; const edges = [];
  for (let k = 0; k < 3; k++) {
    const dir = P.face; if (!inb(c + DX[dir], r + DY[dir])) break;
    if (wallAt(c, r, dir)) break;
    edges.push([c, r, dir]); c += DX[dir]; r += DY[dir];
  }
  let e = edges.length ? edges[Math.min(edges.length - 1, ri(2))] : null;
  if (!e) { const pe = pathEdges(3); if (pe.length) e = pe[Math.min(pe.length - 1, ri(2))]; }
  if (!e) { const o = DIRS.filter(d => !wallAt(P.c, P.r, d) && inb(P.c + DX[d], P.r + DY[d])); if (o.length) e = [P.c, P.r, pick(o)]; }
  if (e && warnWall(e[0], e[1], e[2])) { say(T.slam, true); return true; }
  return false;
}
