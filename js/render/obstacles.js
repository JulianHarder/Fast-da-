'use strict';
/* Zeichnen: Waende, Loecher, Tore, Portale, Laser */

function drawWallWarn() {
  if (!S.wwarn.length) return;
  g.save(); g.lineCap = 'butt';
  for (const w of S.wwarn) {
    const x = w.c * cs, y = w.r * cs, k = w.t / w.dur, on = !reduced ? (Math.sin(w.t * 38) > -0.2 ? 1 : 0.35) : 0.9;
    g.strokeStyle = `rgba(255,170,60,${(0.35 + 0.6 * k) * on})`; g.lineWidth = Math.max(3, cs * 0.12); g.setLineDash([cs * 0.14, cs * 0.1]);
    g.beginPath(); if (w.dir === E) { g.moveTo(x + cs, y + cs * 0.06); g.lineTo(x + cs, y + cs * 0.94); } else { g.moveTo(x + cs * 0.06, y + cs); g.lineTo(x + cs * 0.94, y + cs); } g.stroke();
  }
  g.setLineDash([]); g.restore();
}

let wallCache = null, wallKey = null, wallSnap = null;

// Die Waende (mit weichem Schatten) aendern sich selten: nur bei Aenderung neu zeichnen, sonst fertiges Bild kopieren
function drawWalls() {
  const pad = Math.ceil(cs * 0.7), key = cols + 'x' + rows + '@' + cs + '/' + DPR + (reduced ? 'r' : '');
  let same = wallCache && wallKey === key && wallSnap && wallSnap.length === walls.length;
  if (same) for (let i = 0; i < walls.length; i++) if (wallSnap[i] !== walls[i]) { same = false; break; }
  if (!same) {
    if (!wallCache) wallCache = document.createElement('canvas');
    wallCache.width = Math.round((cols * cs + pad * 2) * DPR); wallCache.height = Math.round((rows * cs + pad * 2) * DPR);
    const gm = g; g = wallCache.getContext('2d'); g.setTransform(DPR, 0, 0, DPR, pad * DPR, pad * DPR);
    try { paintWalls(); } finally { g = gm; }
    wallKey = key; wallSnap = Array.from(walls);
  }
  g.drawImage(wallCache, -pad, -pad, cols * cs + pad * 2, rows * cs + pad * 2);
  g.lineCap = 'square'; g.lineJoin = 'miter'; // wie zuvor: gilt fuer alles, was danach gezeichnet wird
  paintWallAnims();
}

function paintWalls() {
  const lw = Math.max(5, cs * 0.22);
  g.lineCap = 'square'; g.lineJoin = 'miter';
  const path = () => {
    g.beginPath();
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const w = walls[idx(c, r)], x = c * cs, y = r * cs;
      if (w & E) { g.moveTo(x + cs, y); g.lineTo(x + cs, y + cs); }
      if (w & SO) { g.moveTo(x, y + cs); g.lineTo(x + cs, y + cs); }
      if (r === 0 && (w & N)) { g.moveTo(x, y); g.lineTo(x + cs, y); }
      if (c === 0 && (w & WE)) { g.moveTo(x, y); g.lineTo(x, y + cs); }
    }
  };
  path(); g.lineWidth = lw; g.strokeStyle = '#050607';
  if (!reduced) { g.shadowColor = 'rgba(0,0,0,.75)'; g.shadowBlur = cs * 0.3; g.shadowOffsetX = cs * 0.06; g.shadowOffsetY = cs * 0.08; }
  g.stroke(); g.shadowColor = 'transparent'; g.shadowBlur = 0; g.shadowOffsetX = 0; g.shadowOffsetY = 0;
  path(); g.lineWidth = lw * 0.5; g.strokeStyle = '#111416'; g.stroke();
}

function paintWallAnims() {
  const lw = Math.max(5, cs * 0.22);
  for (const a of S.anims) {
    const x = a.c * cs, y = a.r * cs;
    g.beginPath();
    if (a.dir === E) { g.moveTo(x + cs, y); g.lineTo(x + cs, y + cs); } else { g.moveTo(x, y + cs); g.lineTo(x + cs, y + cs); }
    if (a.kind === 'pop') { const al = clamp(1 - a.age / 0.5, 0, 1); g.strokeStyle = `rgba(255,214,160,${al * 0.9})`; g.lineWidth = lw * 0.55; g.stroke(); }
    else { const al = clamp(1 - a.age / 0.5, 0, 1) * 0.7; g.strokeStyle = `rgba(210,220,225,${al})`; g.lineWidth = Math.max(1.5, lw * 0.3); g.setLineDash([cs * 0.12, cs * 0.14]); g.stroke(); g.setLineDash([]); }
  }
}

function holePath(h, cx, cy, k) { g.beginPath(); h.poly.forEach((p, j) => { const x = cx + p[0] * cs * k, y = cy + p[1] * cs * k; j ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath(); }

function drawHoles() {
  for (const [i, h] of S.holes) {
    const c = i % cols, r = (i / cols) | 0, cx = (c + 0.5) * cs, cy = (r + 0.5) * cs;
    if (h.st === 'warn') {
      const pr = clamp(h.t / h.wt, 0, 1);
      holePath(h, cx, cy, 0.25 + 0.75 * pr); g.fillStyle = `rgba(0,0,0,${0.5 * pr})`; g.fill();
      g.strokeStyle = `rgba(228,218,194,${(0.35 + 0.4 * pr) * ((S.inSafe || Math.sin(S.T * 30) > 0) ? 1 : 0.65)})`;
      g.lineWidth = Math.max(1, cs * 0.032); g.lineJoin = 'round'; g.beginPath();
      h.poly.forEach((p, j) => {
        if (j % 2) return;
        g.moveTo(cx, cy);
        g.lineTo(cx + p[0] * cs * 0.45 + ((j % 4) ? 0.05 : -0.05) * cs, cy + p[1] * cs * 0.45);
        g.lineTo(cx + p[0] * cs * (0.7 + 0.3 * pr), cy + p[1] * cs * (0.7 + 0.3 * pr));
      });
      g.stroke();
    } else {
      const left = h.life - h.t, ks = left < 0.9 ? clamp(left / 0.9, 0.4, 1) : 1;
      holePath(h, cx, cy, 1.08 * ks); g.fillStyle = 'rgba(14,15,17,.92)'; g.fill();
      holePath(h, cx, cy, 1.0 * ks); g.strokeStyle = 'rgba(150,145,130,.5)'; g.lineWidth = Math.max(1.5, cs * 0.04); g.stroke();
      const gr = g.createRadialGradient(cx, cy, 0, cx, cy, cs * 0.52 * ks);
      gr.addColorStop(0, '#000'); gr.addColorStop(0.62, '#020203'); gr.addColorStop(1, '#14161a');
      holePath(h, cx, cy, 0.98 * ks); g.fillStyle = gr; g.fill();
      g.save(); holePath(h, cx, cy, 0.98 * ks); g.clip();
      holePath(h, cx, cy, 0.98 * ks); g.strokeStyle = 'rgba(125,130,136,.28)'; g.lineWidth = cs * 0.08; g.stroke(); g.restore();
      g.fillStyle = '#383d41';
      h.poly.forEach((p, j) => { if (j % 3 === 0) g.fillRect(cx + p[0] * cs * 1.07 * ks - 1.5, cy + p[1] * cs * 1.07 * ks - 1.5, 3, 3); });
    }
  }
}

function drawDoors() {
  for (const d of S.doors.values()) {
    const x = d.c * cs, y = d.r * cs, horiz = d.dir === SO;
    const mx = d.dir === E ? x + cs : x + cs / 2, my = d.dir === E ? y + cs / 2 : y + cs;
    const len = cs * 0.92, th = Math.max(8, cs * 0.27);
    g.save(); g.translate(mx, my); if (horiz) g.rotate(Math.PI / 2);
    g.fillStyle = '#0b0c0d'; g.fillRect(-th * 0.65, -len / 2 - 3, th * 1.3, 5); g.fillRect(-th * 0.65, len / 2 - 2, th * 1.3, 5);
    if (d.closed) {
      g.fillStyle = '#1a1c1e'; g.fillRect(-th / 2, -len / 2, th, len);
      g.save(); g.beginPath(); g.rect(-th / 2, -len / 2, th, len); g.clip(); g.fillStyle = '#b8891a';
      for (let k = -len / 2 - th; k < len / 2 + th; k += th * 1.15) { g.beginPath(); g.moveTo(-th / 2, k); g.lineTo(th / 2, k - th); g.lineTo(th / 2, k - th * 0.45); g.lineTo(-th / 2, k + th * 0.55); g.closePath(); g.fill(); }
      g.restore(); g.strokeStyle = '#5a6268'; g.lineWidth = 1; g.strokeRect(-th / 2 + 0.5, -len / 2 + 0.5, th - 1, len - 1);
    } else { g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(-th * 0.16, -len / 2, th * 0.32, len); }
    g.restore();
  }
}

function drawDoorLamps() {
  for (const d of S.doors.values()) {
    const x = d.c * cs, y = d.r * cs, mx = d.dir === E ? x + cs : x + cs / 2, my = d.dir === E ? y + cs / 2 : y + cs;
    let col, a = 1;
    if (d.closed) col = '230,70,55'; else if (d.warn) { col = '255,190,60'; a = Math.sin(S.T * 36) > 0 ? 1 : 0.15; } else { col = '110,200,140'; a = 0.55; }
    g.save(); g.globalCompositeOperation = 'lighter';
    const gr = g.createRadialGradient(mx, my, 0, mx, my, cs * 0.5); gr.addColorStop(0, `rgba(${col},${0.5 * a})`); gr.addColorStop(1, `rgba(${col},0)`);
    g.fillStyle = gr; g.fillRect(mx - cs * 0.5, my - cs * 0.5, cs, cs); g.restore();
    g.fillStyle = `rgba(${col},${a})`; g.beginPath(); g.arc(mx, my, Math.max(2, cs * 0.05), 0, 6.283); g.fill();
  }
}

function drawPortals() {
  for (const p of S.portals) {
    const cx = (p.c + 0.5) * cs, cy = (p.r + 0.5) * cs;
    g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.arc(cx, cy, cs * 0.34, 0, 6.283); g.fill();
    g.save(); g.translate(cx, cy); g.rotate(S.T * 1.6); g.strokeStyle = 'rgba(200,225,235,.55)'; g.lineWidth = Math.max(1.5, cs * 0.04); g.setLineDash([cs * 0.12, cs * 0.1]);
    g.beginPath(); g.arc(0, 0, cs * 0.3, 0, 6.283); g.stroke(); g.setLineDash([]);
    g.rotate(-S.T * 3.2); g.beginPath(); g.arc(0, 0, cs * 0.18, 0.3, 4.4); g.stroke(); g.restore();
    const pc = ['#9fe8ff', '#ffd27a', '#a6f0a0'][p.id % 3];
    g.save(); g.strokeStyle = pc; g.globalAlpha = 0.8; g.lineWidth = Math.max(1.5, cs * 0.05); g.beginPath(); g.arc(cx, cy, cs * 0.36, 0, 6.283); g.stroke();
    g.globalAlpha = 1; g.fillStyle = pc; g.font = `bold ${Math.round(cs * 0.3)}px ui-monospace,Menlo,Consolas,monospace`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('ABC'[p.id % 3], cx, cy + 1); g.restore();
  }
}

function drawLaserPosts() {
  for (const l of S.lasers) {
    const x = l.c * cs, y = l.r * cs, p1 = l.dir === E ? [x + cs, y] : [x, y + cs], p2 = l.dir === E ? [x + cs, y + cs] : [x + cs, y + cs];
    g.fillStyle = '#0c0d0f'; g.strokeStyle = '#3b4348'; g.lineWidth = 1;
    for (const q of [p1, p2]) { g.fillRect(q[0] - cs * 0.07, q[1] - cs * 0.07, cs * 0.14, cs * 0.14); g.strokeRect(q[0] - cs * 0.07 + 0.5, q[1] - cs * 0.07 + 0.5, cs * 0.14 - 1, cs * 0.14 - 1); }
  }
}

function drawLaserBeams() {
  for (const l of S.lasers) {
    const x = l.c * cs, y = l.r * cs, ax = l.dir === E ? x + cs : x + cs * 0.1, ay = l.dir === E ? y + cs * 0.1 : y + cs, bx = l.dir === E ? x + cs : x + cs * 0.9, by = l.dir === E ? y + cs * 0.9 : y + cs;
    const mx = (ax + bx) / 2, my = (ay + by) / 2;
    if (l.st === 'off') { g.fillStyle = 'rgba(120,200,140,.55)'; g.beginPath(); g.arc(ax, ay, Math.max(1.5, cs * 0.03), 0, 6.283); g.arc(bx, by, Math.max(1.5, cs * 0.03), 0, 6.283); g.fill(); continue; }
    const fire = l.st === 'fire', a = fire ? 1 : (Math.sin(S.T * 40) > 0 ? 0.55 : 0.12);
    g.save(); g.globalCompositeOperation = 'lighter';
    const gr = g.createRadialGradient(mx, my, 0, mx, my, cs * 0.7); gr.addColorStop(0, `rgba(255,60,45,${(fire ? 0.35 : 0.1) * a})`); gr.addColorStop(1, 'rgba(255,60,45,0)');
    g.fillStyle = gr; g.fillRect(mx - cs, my - cs, cs * 2, cs * 2); g.restore();
    g.strokeStyle = fire ? 'rgba(255,230,225,.95)' : `rgba(255,70,55,${a})`; g.lineWidth = fire ? Math.max(3, cs * 0.1) : Math.max(1, cs * 0.03); g.lineCap = 'butt';
    g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke();
    if (fire) { g.strokeStyle = 'rgba(255,60,45,.8)'; g.lineWidth = Math.max(6, cs * 0.2); g.globalAlpha = 0.35; g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke(); g.globalAlpha = 1; }
  }
}
