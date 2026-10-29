'use strict';
/* Zeichnen: Beleuchtung, Kurz-Karte, Safe Space */

function drawMapRoute(k) {
  const t = routeTarget(); if (!t) return;
  let dd = bfs(t.c, t.r, false, true).d; if (dd[idx(P.c, P.r)] < 0) dd = bfs(t.c, t.r, false, false).d;
  let c = P.c, r = P.r; const pts = [[c, r]];
  for (let n = 0; n < 200; n++) {
    const me = dd[idx(c, r)]; if (me <= 0) break; let nx = null;
    for (const d of DIRS) { if (wallAt(c, r, d)) continue; const nc = c + DX[d], nr = r + DY[d]; if (!inb(nc, nr)) continue; if (dd[idx(nc, nr)] >= 0 && dd[idx(nc, nr)] < me) { nx = [nc, nr]; break; } }
    if (!nx) break; c = nx[0]; r = nx[1]; pts.push(nx);
  }
  g.save(); g.strokeStyle = `rgba(127,227,255,${0.75 * k})`; g.lineWidth = Math.max(2, cs * 0.09); g.setLineDash([cs * 0.16, cs * 0.14]); g.lineDashOffset = -S.T * cs * 0.8; g.lineCap = 'round';
  g.beginPath(); pts.forEach((p, i) => { const x = (p[0] + 0.5) * cs, y = (p[1] + 0.5) * cs; if (i) g.lineTo(x, y); else g.moveTo(x, y); }); g.stroke(); g.setLineDash([]); g.restore();
}

function drawSafe() {
  if (!SAFE) return;
  const cx = (S.startC + 0.5) * cs, cy = (S.startR + 0.5) * cs, br = 0.5 + 0.5 * Math.sin(S.T * 1.1), a = S.inSafe ? 0.5 : 0.28;
  g.save(); g.globalCompositeOperation = 'lighter';
  const gr = g.createRadialGradient(cx, cy, 0, cx, cy, cs * (S.inSafe ? 2.4 : 1.8)); gr.addColorStop(0, `rgba(90,210,175,${a * (0.7 + 0.3 * br)})`); gr.addColorStop(1, 'rgba(90,210,175,0)');
  g.fillStyle = gr; g.fillRect(cx - cs * 2.5, cy - cs * 2.5, cs * 5, cs * 5); g.restore();
  if (S.inSafe) { g.strokeStyle = `rgba(140,240,210,${0.35 + 0.3 * br})`; g.lineWidth = Math.max(2, cs * 0.05); g.beginPath(); g.arc(cx, cy, cs * (0.55 + 0.18 * br), 0, 6.283); g.stroke(); }
}

function drawLighting() {
  const pp = playerPosPx(), px = ox + pp.x, py = oy + pp.y;
  let k = 0;
  if (S.darkT > 0 && S.phase === 'play') { const tot = S.darkMax || 4.5; k = clamp(Math.min(tot - S.darkT, S.darkT) / 0.5, 0, 1); }
  let amb = 0.4 + 0.5 * k; if (S.flickT > 0 && !reduced && Math.sin(S.T * 13) > 0.55) amb = Math.min(0.97, amb + 0.3);
  const lb = S.lightBoost > 0 ? 1.35 : 1, outer = cs * (9.5 - 5.0 * k) * lb, inner = cs * (3.2 - 1.2 * k) * lb;
  const fl = reduced ? 0 : 0.02 * Math.sin(S.T * 17) + 0.015 * Math.sin(S.T * 31 + 1);
  const mk = S.mapT > 0 ? clamp(Math.min(S.mapT, 2.2 - S.mapT + 0.0) / 0.35, 0, 1) : 0;
  const fx = DX[P.face] * cs * 0.6, fy = DY[P.face] * cs * 0.6;
  const gr = g.createRadialGradient(px + fx, py + fy, inner, px + fx, py + fy, outer * (1 + fl));
  gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(0.55, `rgba(0,0,0,${amb * 0.35})`); gr.addColorStop(1, `rgba(0,0,0,${amb})`);
  g.save(); g.globalAlpha = 1 - 0.92 * mk; g.fillStyle = gr; g.fillRect(0, 0, VW, VH); g.restore();
  if (mk > 0 && S.phase === 'play') { g.save(); g.translate(ox, oy); drawMapRoute(mk); g.restore(); }
}
