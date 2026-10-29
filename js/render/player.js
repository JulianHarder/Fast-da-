'use strict';
/* Zeichnen: Spieler, Kern-Orbit, Sturz, Respawn */

function playerPosPx() { const pp = playerPos(); return { x: (pp.x + 0.5) * cs, y: (pp.y + 0.5) * cs }; }
function drawPlayer() { const pp = playerPosPx(); drawPlayerAt(pp.x, pp.y, Math.atan2(DY[P.face], DX[P.face]), 1, 1); }

function drawPlayerAt(x, y, ang, sc, al) {
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.scale(sc, sc);
  g.save(); g.globalCompositeOperation = 'lighter';
  const hg = g.createRadialGradient(0, 0, cs * 0.1, 0, 0, cs * 1.05); hg.addColorStop(0, 'rgba(255,205,130,.55)'); hg.addColorStop(1, 'rgba(255,205,130,0)');
  g.fillStyle = hg; g.fillRect(-cs * 1.1, -cs * 1.1, cs * 2.2, cs * 2.2); g.restore();
  g.strokeStyle = 'rgba(255,228,175,.8)'; g.lineWidth = Math.max(2, cs * 0.05); g.beginPath(); g.arc(0, 0, cs * 0.38, 0, 6.283); g.stroke();
  g.fillStyle = 'rgba(0,0,0,.4)'; g.beginPath(); g.ellipse(0, cs * 0.05, cs * 0.3, cs * 0.24, 0, 0, 6.283); g.fill();
  g.rotate(ang);
  const ol = Math.max(2, cs * 0.06);
  g.lineJoin = 'round';
  g.fillStyle = '#ff8a1f'; g.strokeStyle = '#1d0c02'; g.lineWidth = ol;
  g.beginPath(); g.ellipse(0, 0, cs * 0.16, cs * 0.3, 0, 0, 6.283); g.fill(); g.stroke();
  g.strokeStyle = 'rgba(255,214,160,.8)'; g.lineWidth = Math.max(1, cs * 0.025);
  g.beginPath(); g.ellipse(0, 0, cs * 0.12, cs * 0.25, 0, 0, 6.283); g.stroke();
  g.fillStyle = '#f2dec2'; g.strokeStyle = '#1d0c02'; g.lineWidth = ol;
  g.beginPath(); g.arc(cs * 0.03, 0, cs * 0.14, 0, 6.283); g.fill(); g.stroke();
  g.fillStyle = '#2f2418'; g.beginPath(); g.arc(cs * 0.03, 0, cs * 0.14, Math.PI * 0.6, Math.PI * 1.4); g.fill();
  g.fillStyle = '#fff3d6'; g.beginPath(); g.moveTo(cs * 0.24, 0); g.lineTo(cs * 0.15, -cs * 0.055); g.lineTo(cs * 0.15, cs * 0.055); g.closePath(); g.fill();
  g.restore();
}

function drawCoreOrbit() {
  const n = S.cores.length; if (!n) return;
  const pp = playerPosPx(), up = S.uplink; let k = 0;
  for (const co of S.cores) {
    if (!co.got) continue;
    const a = S.T * (up ? 4 : 2) + k * 6.283 / n, rr = cs * (up ? 0.5 + 0.05 * Math.sin(S.T * 8) : 0.46), x = pp.x + Math.cos(a) * rr, y = pp.y + Math.sin(a) * rr; k++;
    g.save(); g.globalCompositeOperation = 'lighter';
    const gr = g.createRadialGradient(x, y, 0, x, y, cs * 0.35); gr.addColorStop(0, 'rgba(110,220,255,.5)'); gr.addColorStop(1, 'rgba(110,220,255,0)');
    g.fillStyle = gr; g.fillRect(x - cs * 0.4, y - cs * 0.4, cs * 0.8, cs * 0.8); g.restore();
    g.fillStyle = 'rgba(160,238,255,.95)'; g.strokeStyle = '#eafcff'; g.lineWidth = Math.max(1, cs * 0.02);
    g.beginPath(); for (let q = 0; q < 6; q++) { const t = q * Math.PI / 3 + S.T * 2; g.lineTo(x + Math.cos(t) * cs * 0.08, y + Math.sin(t) * cs * 0.08); } g.closePath(); g.fill(); g.stroke();
  }
  if (up) {
    g.strokeStyle = 'rgba(127,227,255,.22)'; g.lineWidth = Math.max(2, cs * 0.05); g.beginPath(); g.arc(pp.x, pp.y, cs * 0.66, 0, 6.283); g.stroke();
    g.strokeStyle = 'rgba(127,227,255,.95)'; g.lineWidth = Math.max(2.5, cs * 0.07); g.beginPath(); g.arc(pp.x, pp.y, cs * 0.66, -Math.PI / 2, -Math.PI / 2 + 6.283 * Math.min(1, up.t / up.dur)); g.stroke();
  }
}

function drawFallFx() {
  const f = S.fallFx; if (!f) return;
  const k = f.t / 0.8, e = 1 - Math.pow(1 - k, 2), x = (f.x + 0.5) * cs, y = (f.y + 0.5) * cs;
  if (f.kind === 'fall') {
    g.fillStyle = `rgba(0,0,0,${0.55 * (1 - k)})`; g.beginPath(); g.arc(x, y, cs * (0.2 + 0.35 * e), 0, 6.283); g.fill();
  }
  drawPlayerAt(x, y, f.ang + e * 4, Math.max(0.02, 1 - e), 1 - k);
}

function drawRespawn() {
  const k = S.respawnT / 1.4; if (k >= 1) return;
  const pp = playerPosPx();
  g.save(); g.lineWidth = Math.max(2, cs * 0.05);
  for (let q = 0; q < 2; q++) { const kk = clamp(k - q * 0.18, 0, 1); if (kk <= 0) continue; g.strokeStyle = `rgba(150,235,255,${0.75 * (1 - kk)})`; g.beginPath(); g.arc(pp.x, pp.y, cs * (0.25 + 1.0 * kk), 0, 6.283); g.stroke(); }
  g.restore();
}
