'use strict';
/* Route und Pfadkanten zum naechsten Ziel */

function routeTarget() {
  if (S.doorOpen && S.door) return S.door;
  let best = null, bd = 1e9; const dp = bfs(P.c, P.r).d;
  for (const co of S.cores) if (!co.got) { const v = dp[idx(co.c, co.r)]; if (v >= 0 && v < bd) { bd = v; best = co; } }
  return best || G;
}

function pathEdges(limit) {
  const tg = routeTarget(), dg = bfs(tg.c, tg.r).d, out = [];
  let c = P.c, r = P.r;
  for (let k = 0; k < limit; k++) {
    const cur = dg[idx(c, r)]; if (cur <= 0) break;
    let moved = false;
    for (const dir of DIRS) {
      if (wallAt(c, r, dir)) continue;
      const nc = c + DX[dir], nr = r + DY[dir];
      if (inb(nc, nr) && dg[idx(nc, nr)] === cur - 1) { out.push([c, r, dir]); c = nc; r = nr; moved = true; break; }
    }
    if (!moved) break;
  }
  return out;
}
