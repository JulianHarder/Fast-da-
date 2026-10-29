'use strict';
/* Schleusen-Tore und Transfer-Portale */

const doorKey = (c, r, d) => { const k = canon(c, r, d); return k[0] + ',' + k[1] + ',' + k[2]; };
function closedDoor(c, r, d) { const o = S.doors.get(doorKey(c, r, d)); return !!(o && o.closed); }

function makeDoors() {
  S.doors = new Map();
  const L = Math.min(S.level, 5), n = Math.min(7, 3 + L + MODE * 2), pe = pathEdges(300).slice(2);
  const add = (c, r, d) => {
    if (!inb(c + DX[d], r + DY[d]) || wallAt(c, r, d)) return;
    const k = doorKey(c, r, d); if (S.doors.has(k)) return;
    const cn = canon(c, r, d), per = rnd(1.4, 3.2);
    S.doors.set(k, { c: cn[0], r: cn[1], dir: cn[2], per, t: rnd(0, per), of: rnd(0.45, 0.65), closed: false, warn: false });
  };
  let tries = 0;
  while (S.doors.size < n && tries++ < 300) {
    if (pe.length && Math.random() < 0.6) { const e = pick(pe); add(e[0], e[1], e[2]); } else add(ri(cols), ri(rows), pick([E, SO]));
  }
}

function makePortals() {
  S.portals = []; if (S.level < 2) return;
  const pairs = Math.min(3, 1 + Math.floor(S.level / 3)), taken = (c, r) => (c === G.c && r === G.r) || (c === P.c && r === P.r) || S.portals.some(p => p.c === c && p.r === r);
  for (let k = 0; k < pairs; k++) {
    for (let t = 0; t < 40; t++) {
      const c = ri(cols), r = ri(rows); if (taken(c, r)) continue;
      const dp = bfs(c, r).d, cand = [];
      for (let q = 0; q < dp.length; q++) { const qc = q % cols, qr = (q / cols) | 0; if (dp[q] >= 7 && !taken(qc, qr)) cand.push(q); }
      if (!cand.length) continue;
      const q = pick(cand), a = { c, r, id: k, to: null }, b = { c: q % cols, r: (q / cols) | 0, id: k, to: null };
      a.to = b; b.to = a; S.portals.push(a, b); break;
    }
  }
}

function usePortal() {
  const here = S.portals.find(p => p.c === P.c && p.r === P.r); if (!here || !here.to) return;
  sparks(P.c + 0.5, P.r + 0.5, 16, '#9fd8e8', 3);
  P.c = P.fc = here.to.c; P.r = P.fr = here.to.r; P.t = 1; S.portalCd = 1.5;
  sparks(P.c + 0.5, P.r + 0.5, 16, '#9fd8e8', 3); sfx.portal(); say(T.portal, true);
}
