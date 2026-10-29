'use strict';
/* Zeichnen: Kerne, Items, Stoersender, Laerm */

function drawCoreFx() {
  if (!S.coreFx.length) return;
  g.save(); g.globalCompositeOperation = 'lighter';
  for (const f of S.coreFx) {
    const k = f.t / 0.9, cx = (f.c + 0.5) * cs, cy = (f.r + 0.5) * cs;
    const gr = g.createRadialGradient(cx, cy, 0, cx, cy, cs * (1.2 + 3 * k)); gr.addColorStop(0, `rgba(140,230,255,${0.45 * (1 - k)})`); gr.addColorStop(1, 'rgba(140,230,255,0)');
    g.fillStyle = gr; g.fillRect(cx - cs * 5, cy - cs * 5, cs * 10, cs * 10);
    g.strokeStyle = `rgba(190,240,255,${0.8 * (1 - k)})`; g.lineWidth = Math.max(1.5, cs * 0.05); g.beginPath(); g.arc(cx, cy, cs * (0.2 + 1.6 * k), 0, 6.283); g.stroke();
  }
  g.restore();
}

function drawFlyers() {
  for (const f of S.flyers) {
    const k = clamp(f.t / 1.0, 0, 1), e = k * k * (3 - 2 * k), tx = 215, ty = 22, x = f.x + (tx - f.x) * e, y = f.y + (ty - f.y) * e - Math.sin(k * 3.14) * 30;
    g.save(); g.globalAlpha = 1 - k * k * 0.6; g.font = `700 ${Math.round(14 + 6 * (1 - k))}px ${MONO}`; g.textAlign = 'center'; g.fillStyle = '#9fe8ff'; g.fillText(f.txt, x, y); g.restore();
  }
}

function drawCores() {
  for (const co of S.cores) {
    if (co.got) continue;
    const cx = (co.c + 0.5) * cs, cy = (co.r + 0.5) * cs, pulse = 0.75 + 0.25 * Math.sin(S.T * 4 + co.c);
    g.save(); g.globalCompositeOperation = 'lighter';
    const gr = g.createRadialGradient(cx, cy, 0, cx, cy, cs * 1.3); gr.addColorStop(0, `rgba(110,220,255,${0.4 * pulse})`); gr.addColorStop(1, 'rgba(110,220,255,0)');
    g.fillStyle = gr; g.fillRect(cx - cs * 1.3, cy - cs * 1.3, cs * 2.6, cs * 2.6); g.restore();
    g.save(); g.translate(cx, cy + Math.sin(S.T * 2.4 + co.r) * cs * 0.03); g.rotate(S.T * 0.8);
    g.fillStyle = 'rgba(150,235,255,.92)'; g.strokeStyle = '#e8fbff'; g.lineWidth = Math.max(1, cs * 0.03);
    g.beginPath(); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; g.lineTo(Math.cos(a) * cs * 0.17, Math.sin(a) * cs * 0.17); } g.closePath(); g.fill(); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.arc(0, 0, cs * 0.05, 0, 6.283); g.fill(); g.restore();
  }
}

function drawItems() {
  for (const it of S.items) {
    if (it.got) continue;
    const cx = (it.c + 0.5) * cs, cy = (it.r + 0.5) * cs, bat = it.type === 'battery', col = bat ? '242,193,78' : '127,182,176', pulse = 0.7 + 0.3 * Math.sin(S.T * 3 + it.c);
    g.save(); g.globalCompositeOperation = 'lighter';
    const gr = g.createRadialGradient(cx, cy, 0, cx, cy, cs * 0.8); gr.addColorStop(0, `rgba(${col},${0.3 * pulse})`); gr.addColorStop(1, `rgba(${col},0)`);
    g.fillStyle = gr; g.fillRect(cx - cs, cy - cs, cs * 2, cs * 2); g.restore();
    g.fillStyle = `rgb(${col})`; g.strokeStyle = '#0a0b0c'; g.lineWidth = Math.max(1, cs * 0.025);
    if (bat) { g.fillRect(cx - cs * 0.09, cy - cs * 0.14, cs * 0.18, cs * 0.28); g.strokeRect(cx - cs * 0.09, cy - cs * 0.14, cs * 0.18, cs * 0.28); g.fillRect(cx - cs * 0.04, cy - cs * 0.18, cs * 0.08, cs * 0.04); g.fillStyle = '#0a0b0c'; g.fillRect(cx - cs * 0.03, cy - cs * 0.06, cs * 0.06, cs * 0.12); }
    else { g.beginPath(); g.arc(cx, cy + cs * 0.03, cs * 0.12, 0, 6.283); g.fill(); g.stroke(); g.strokeStyle = `rgb(${col})`; g.lineWidth = Math.max(1.5, cs * 0.035); g.beginPath(); g.moveTo(cx, cy - cs * 0.08); g.lineTo(cx, cy - cs * 0.2); g.stroke(); g.beginPath(); g.arc(cx, cy - cs * 0.2, cs * 0.035, 0, 6.283); g.fill(); }
  }
}

function drawJam() {
  if (!S.jam) return;
  const cx = (S.jam.c + 0.5) * cs, cy = (S.jam.r + 0.5) * cs, k = (S.T * 1.0) % 1;
  g.fillStyle = 'rgba(30,40,42,.95)'; g.beginPath(); g.arc(cx, cy, cs * 0.13, 0, 6.283); g.fill();
  g.strokeStyle = '#7fb6b0'; g.lineWidth = Math.max(1.5, cs * 0.04); g.stroke();
  g.fillStyle = (S.inSafe || Math.sin(S.T * 14) > 0) ? '#9fe8de' : '#2d4a47'; g.beginPath(); g.arc(cx, cy, cs * 0.04, 0, 6.283); g.fill();
  g.strokeStyle = `rgba(127,182,176,${1 - k})`; g.beginPath(); g.arc(cx, cy, cs * (0.2 + k * 0.9), 0, 6.283); g.stroke();
}

function drawNoises() {
  for (const n of S.noises) {
    const k = n.age / n.life, cx = (n.c + 0.5) * cs, cy = (n.r + 0.5) * cs;
    g.strokeStyle = `rgba(205,220,228,${0.5 * (1 - k)})`; g.lineWidth = Math.max(1, cs * 0.025);
    g.beginPath(); g.arc(cx, cy, cs * (0.3 + k * n.rad * 0.5), 0, 6.283); g.stroke();
  }
}
