'use strict';
/* Zeichnen: Ausgangstuer und Licht */

function exitXf() {
  const d = S.door, c = d.c, r = d.r;
  return { [N]: [(c + 0.5) * cs, r * cs, 0], [SO]: [(c + 0.5) * cs, (r + 1) * cs, Math.PI], [WE]: [c * cs, (r + 0.5) * cs, -Math.PI / 2], [E]: [(c + 1) * cs, (r + 0.5) * cs, Math.PI / 2] }[d.dir];
}

function drawExitDoor() {
  if (!S.door) return;
  const m = exitXf(), w = cs * 0.7, t = cs * 0.28, o = S.door.open;
  g.save(); g.translate(m[0], m[1]); g.rotate(m[2]);
  g.fillStyle = '#050607'; g.fillRect(-w / 2 - t * 0.7, -t / 2, w + t * 1.4, t);
  g.strokeStyle = '#3a4248'; g.lineWidth = Math.max(1, cs * 0.03); g.strokeRect(-w / 2 - t * 0.7 + 0.5, -t / 2 + 0.5, w + t * 1.4 - 1, t - 1);
  const hw = (w / 2) * (1 - o);
  if (hw > 0.5) {
    g.fillStyle = '#343a40'; g.fillRect(-w / 2, -t / 2 + 2, hw, t - 4); g.fillRect(w / 2 - hw, -t / 2 + 2, hw, t - 4);
    g.strokeStyle = '#1b1f22'; g.lineWidth = 1; g.beginPath(); g.moveTo(-w / 2, 0); g.lineTo(-w / 2 + hw, 0); g.moveTo(w / 2 - hw, 0); g.lineTo(w / 2, 0); g.stroke();
  }
  if (!S.doorOpen) { g.fillStyle = '#7a2822'; g.fillRect(-2, -t / 2 + 3, 4, 3); }
  g.restore();
}

function drawExitLight() {
  const d = S.door; if (!d || d.open <= 0) return;
  const m = exitXf(), w = cs * 0.7, t = cs * 0.28, o = d.open, pulse = S.inSafe ? 1 : 0.93 + 0.07 * Math.sin(S.T * 1.7);
  g.save(); g.translate(m[0], m[1]); g.rotate(m[2]); g.globalCompositeOperation = 'lighter';
  const L = cs * 4.6, bw = w * 0.5 * o;
  const gr = g.createLinearGradient(0, 0, 0, L); gr.addColorStop(0, `rgba(255,240,200,${0.7 * o * pulse})`); gr.addColorStop(0.35, `rgba(255,236,190,${0.28 * o * pulse})`); gr.addColorStop(1, 'rgba(255,236,190,0)');
  g.fillStyle = gr; g.beginPath(); g.moveTo(-bw, 0); g.lineTo(bw, 0); g.lineTo(bw * 2.6, L); g.lineTo(-bw * 2.6, L); g.closePath(); g.fill();
  const g2 = g.createLinearGradient(0, -t / 2, 0, t / 2 + cs * 0.3); g2.addColorStop(0, `rgba(255,252,235,${o})`); g2.addColorStop(1, `rgba(255,240,200,${0.6 * o})`);
  g.fillStyle = g2; g.fillRect(-bw, -t / 2, bw * 2, t + cs * 0.1);
  const bl = g.createRadialGradient(0, t * 0.3, 0, 0, t * 0.3, cs * 2); bl.addColorStop(0, `rgba(255,240,205,${0.5 * o * pulse})`); bl.addColorStop(1, 'rgba(255,240,205,0)');
  g.fillStyle = bl; g.fillRect(-cs * 2, -cs * 2, cs * 4, cs * 4.2);
  for (let k = -2; k <= 2; k++) {
    const ang = k * 0.16 + (S.inSafe ? 0 : Math.sin(S.T * 0.6 + k) * 0.02);
    g.fillStyle = `rgba(255,240,205,${0.07 * o})`; g.beginPath(); g.moveTo(-3, 0); g.lineTo(3, 0);
    g.lineTo(Math.sin(ang) * cs * 5 + 12, Math.cos(ang) * cs * 5); g.lineTo(Math.sin(ang) * cs * 5 - 12, Math.cos(ang) * cs * 5); g.closePath(); g.fill();
  }
  g.restore();
}
