'use strict';
/* Fluchtweg-Garantie (Ausgang, Ecken, Naehe) */

function regionFrom(sc, sr, blockSet) {
  const seen = new Set([idx(sc, sr)]), q = [idx(sc, sr)];
  for (let h = 0; h < q.length; h++) {
    const i = q[h], c = i % cols, r = (i / cols) | 0;
    for (const dir of DIRS) {
      if (blocked(c, r, dir)) continue;
      const nc = c + DX[dir], nr = r + DY[dir]; if (!inb(nc, nr)) continue;
      const j = idx(nc, nr); if (seen.has(j) || S.holes.has(j) || blockSet.has(j)) continue;
      seen.add(j); q.push(j);
    }
  }
  return seen;
}

function ensureExit() {
  const free = d => inb(P.c + DX[d], P.r + DY[d]) && !S.holes.has(idx(P.c + DX[d], P.r + DY[d]));
  if (DIRS.some(d => free(d) && !blocked(P.c, P.r, d))) return;
  const cand = DIRS.filter(free); if (!cand.length) return;
  const d = pick(cand);
  if (wallAt(P.c, P.r, d)) openWall(P.c, P.r, d);
  sfx.open(); say(T.exit, true);
}

function bfsMulti(srcs) {
  const d = new Int16Array(cols * rows).fill(-1), q = [];
  for (const i of srcs) { d[i] = 0; q.push(i); }
  for (let h = 0; h < q.length; h++) {
    const i = q[h], c = i % cols, r = (i / cols) | 0;
    for (const dir of DIRS) {
      if (walls[i] & dir) continue;
      const nc = c + DX[dir], nr = r + DY[dir]; if (!inb(nc, nr)) continue;
      const j = idx(nc, nr); if (d[j] < 0) { d[j] = d[i] + 1; q.push(j); }
    }
  }
  return d;
}

function updateNear() {
  if (!S.chasers.length) { S.nearDist = 99; return; }
  const d = bfsMulti(S.chasers.map(ch => idx(ch.c, ch.r))), v = d[idx(P.c, P.r)];
  S.nearDist = v < 0 ? 99 : v;
}

function cornerCheck() {
  if (S.cornerCd > 0) return;
  const haz = new Set();
  for (const ch of S.chasers) { haz.add(idx(ch.c, ch.r)); haz.add(idx(ch.fc, ch.fr)); }
  for (const [i, o] of S.gas) if (o.v > 0.3) haz.add(i);
  if (!haz.size) return;
  const me = idx(P.c, P.r), dh = bfsMulti(haz);
  if (dh[me] < 0 || dh[me] > 5) return;
  const blockSet = new Set(haz); blockSet.delete(me);
  const region = regionFrom(P.c, P.r, blockSet), limit = Math.max(16, Math.round(cols * rows * 0.09));
  if (region.size > limit) return;
  const cands = [];
  for (const i of region) {
    const c = i % cols, r = (i / cols) | 0;
    for (const dir of DIRS) {
      if (!wallAt(c, r, dir)) continue;
      const nc = c + DX[dir], nr = r + DY[dir]; if (!inb(nc, nr)) continue;
      const j = idx(nc, nr); if (region.has(j) || S.holes.has(j) || blockSet.has(j)) continue;
      cands.push({ c, r, dir, score: dh[j] });
    }
  }
  if (!cands.length) return;
  cands.sort((a, b) => b.score - a.score);
  const ch = cands[0]; openWall(ch.c, ch.r, ch.dir);
  S.cornerCd = 3.5; sfx.open(); say(T.exit, true);
}
