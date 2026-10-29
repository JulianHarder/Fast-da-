'use strict';
/* Zeichnen: Jaeger, Spawn-Warnung, Gas, Geister */

function drawSpawnWarn() {
  if (!S.spawnPlan || S.inSafe) return;
  for (const p of S.spawnPlan) {
    const cx = (p.c + 0.5) * cs, cy = (p.r + 0.5) * cs, k = clamp(1 - S.chaserT, 0, 1), a = 0.35 + 0.5 * Math.abs(Math.sin(S.T * 9));
    g.save(); g.globalCompositeOperation = 'lighter';
    const gr = g.createRadialGradient(cx, cy, 0, cx, cy, cs * (0.6 + 0.8 * k)); gr.addColorStop(0, `rgba(255,60,45,${0.5 * a})`); gr.addColorStop(1, 'rgba(255,60,45,0)');
    g.fillStyle = gr; g.fillRect(cx - cs * 1.5, cy - cs * 1.5, cs * 3, cs * 3);
    g.strokeStyle = `rgba(255,120,100,${a})`; g.lineWidth = Math.max(1.5, cs * 0.05); g.beginPath(); g.arc(cx, cy, cs * (0.5 - 0.25 * k), 0, 6.283); g.stroke(); g.restore();
  }
}

function drawChaser(ch) {
  const e = 1 - Math.pow(1 - ch.t, 2), x = (ch.fc + (ch.c - ch.fc) * e + 0.5) * cs, y = (ch.fr + (ch.r - ch.fr) * e + 0.5) * cs;
  const k = ch.kind, R = cs * 0.3 * (k === 'splitter' ? 1.2 : k === 'shard' ? 0.55 : k === 'lurker' ? 0.85 : 1);
  const pp = playerPosPx(), ang = Math.atan2(pp.y - y, pp.x - x);
  const cold = k === 'lurker', col = cold ? '120,170,255' : '170,25,20', eye = cold ? '#bfe0ff' : '#ff4a38', glow = cold ? '#7fb0ff' : '#ff2a1c';
  const wait = cold && ch.st === 'wait', ea = wait ? (Math.sin(S.T * 1.7 + ch.c) > 0.55 ? 0.95 : 0.22) : 1;
  g.save(); g.translate(x, y);
  g.save(); g.globalCompositeOperation = 'lighter';
  const au = g.createRadialGradient(0, 0, 0, 0, 0, R * 2.6); au.addColorStop(0, `rgba(${col},${wait ? 0.12 : 0.28})`); au.addColorStop(1, `rgba(${col},0)`); g.fillStyle = au; g.fillRect(-R * 2.6, -R * 2.6, R * 5.2, R * 5.2); g.restore();
  const bl = g.createRadialGradient(0, 0, 0, 0, 0, R * 1.5); bl.addColorStop(0, 'rgba(0,0,0,.95)'); bl.addColorStop(0.65, 'rgba(0,0,0,.85)'); bl.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = bl; g.beginPath(); g.arc(0, 0, R * 1.5, 0, 6.283); g.fill();
  const nt = k === 'splitter' ? 9 : k === 'shard' ? 3 : k === 'lurker' ? 5 : 7;
  g.strokeStyle = 'rgba(0,0,0,.92)'; g.lineWidth = cs * (k === 'shard' ? 0.03 : 0.05); g.lineCap = 'round';
  for (let q = 0; q < nt; q++) {
    const a = q * 6.283 / nt + S.T * 0.5, w1 = Math.sin(S.T * 3 + q * 1.7) * 0.5;
    g.beginPath(); g.moveTo(Math.cos(a) * R * 0.5, Math.sin(a) * R * 0.5);
    g.quadraticCurveTo(Math.cos(a + w1) * R * 1.5, Math.sin(a + w1) * R * 1.5, Math.cos(a + w1 * 1.6) * R * 2.0, Math.sin(a + w1 * 1.6) * R * 2.0); g.stroke();
  }
  g.rotate(ang);
  if (k === 'blind') {
    g.strokeStyle = `rgba(215,225,230,${ch.tgt ? 0.9 : 0.4})`; g.lineWidth = Math.max(1.5, cs * 0.04);
    for (const s2 of [-1, 1]) { g.beginPath(); g.arc(R * 0.25, s2 * R * 0.55, R * 0.38, -1.1 + (s2 > 0 ? 0 : 0.4), 1.1 + (s2 > 0 ? 0 : -0.4)); g.stroke(); }
    if (ch.tgt) { g.strokeStyle = `rgba(215,225,230,${0.5 + 0.4 * Math.sin(S.T * 10)})`; g.beginPath(); g.arc(0, 0, R * 1.6, 0, 6.283); g.stroke(); }
  } else {
    g.globalAlpha = ea; g.shadowColor = glow; g.shadowBlur = reduced ? 0 : cs * 0.35; g.fillStyle = eye;
    const eyes = k === 'splitter' ? [[0.45, -0.4], [0.45, 0.4], [0.72, 0]] : [[0.45, -0.34], [0.45, 0.34]], sz = k === 'shard' ? 0.7 : 1;
    for (const q of eyes) { g.beginPath(); g.ellipse(R * q[0], R * q[1], R * 0.2 * sz, R * 0.1 * sz, 0, 0, 6.283); g.fill(); }
  }
  g.restore();
}

function drawGas() {
  if (!S.gas.size) return;
  let dk = 0; if (S.darkT > 0 && S.phase === 'play') { const tot = S.darkMax || 4.5; dk = clamp(Math.min(tot - S.darkT, S.darkT) / 0.5, 0, 1); }
  const pp = playerPosPx();
  g.save(); g.globalCompositeOperation = 'lighter';
  for (const [i, o] of S.gas) {
    const cx = ((i % cols) + 0.5) * cs, cy = (((i / cols) | 0) + 0.5) * cs;
    let vis = 1; if (dk > 0) { const d = Math.hypot(cx - pp.x, cy - pp.y) / cs; vis = 1 - dk * clamp((d - 1.2) / 2.2, 0, 1); if (vis <= 0.01) continue; }
    const a = o.v * vis * (0.28 + 0.07 * Math.sin(S.T * 2.2 + i));
    const gr = g.createRadialGradient(cx, cy, 0, cx, cy, cs * 0.95); gr.addColorStop(0, `rgba(170,210,70,${a})`); gr.addColorStop(1, 'rgba(170,210,70,0)');
    g.fillStyle = gr; g.fillRect(cx - cs, cy - cs, cs * 2, cs * 2);
  }
  g.restore();
}

function drawGhosts() {
  for (const gh of S.ghosts) {
    const x = (gh.c + 0.5) * cs, y = (gh.r + 0.5) * cs, k = gh.t / gh.life, a = (k < 0.2 ? k / 0.2 : (k > 0.7 ? (1 - k) / 0.3 : 1)) * (Math.sin(S.T * 17 + gh.c) > -0.5 ? 1 : 0.3);
    g.save(); g.globalAlpha = clamp(a, 0, 1); g.shadowColor = '#ff2a1c'; g.shadowBlur = reduced ? 0 : cs * 0.3; g.fillStyle = '#ff4a38';
    for (const s2 of [-1, 1]) { g.beginPath(); g.ellipse(x + s2 * cs * 0.1, y, cs * 0.06, cs * 0.035, 0, 0, 6.283); g.fill(); }
    g.restore();
  }
}
