'use strict';
/* Boden-Cache und Filmkorn */

let floorCache = null, grainCv = null;

function buildFloor() {
  const w = cols * cs, h = rows * cs, cnv = document.createElement('canvas');
  cnv.width = Math.round(w * DPR); cnv.height = Math.round(h * DPR);
  const f = cnv.getContext('2d'); f.scale(DPR, DPR);
  const pal = PALS[S.pal || 0];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const v = hash(c, r, S.level) * 16 - 8;
    f.fillStyle = `rgb(${pal[0] + v},${pal[1] + v},${pal[2] + v})`; f.fillRect(c * cs, r * cs, cs, cs);
  }
  for (let i = 0; i < cols * rows * 30; i++) {
    const a = Math.random() * 0.14; f.fillStyle = Math.random() < 0.5 ? `rgba(0,0,0,${a})` : `rgba(255,255,255,${a * 0.6})`;
    f.fillRect(Math.random() * w, Math.random() * h, 1.3, 1.3);
  }
  for (let k = 0; k < cols * rows * 0.4; k++) {
    const x = Math.random() * w, y = Math.random() * h, rr = cs * rnd(0.3, 0.95), gr = f.createRadialGradient(x, y, 0, x, y, rr);
    gr.addColorStop(0, 'rgba(0,0,0,0.22)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); f.fillStyle = gr; f.fillRect(x - rr, y - rr, rr * 2, rr * 2);
  }
  f.lineWidth = 1;
  for (let c = 0; c <= cols; c++) { f.strokeStyle = 'rgba(0,0,0,0.38)'; f.beginPath(); f.moveTo(c * cs + 0.5, 0); f.lineTo(c * cs + 0.5, h); f.stroke(); f.strokeStyle = 'rgba(255,255,255,0.045)'; f.beginPath(); f.moveTo(c * cs + 1.5, 0); f.lineTo(c * cs + 1.5, h); f.stroke(); }
  for (let r = 0; r <= rows; r++) { f.strokeStyle = 'rgba(0,0,0,0.38)'; f.beginPath(); f.moveTo(0, r * cs + 0.5); f.lineTo(w, r * cs + 0.5); f.stroke(); f.strokeStyle = 'rgba(255,255,255,0.045)'; f.beginPath(); f.moveTo(0, r * cs + 1.5); f.lineTo(w, r * cs + 1.5); f.stroke(); }
  f.strokeStyle = 'rgba(0,0,0,0.42)'; f.lineWidth = 1; f.lineJoin = 'round';
  for (let k = 0; k < cols * rows * 0.3; k++) {
    let x = Math.random() * w, y = Math.random() * h; f.beginPath(); f.moveTo(x, y);
    for (let j = 0; j < 4; j++) { x += rnd(-1, 1) * cs * 0.22; y += rnd(-1, 1) * cs * 0.22; f.lineTo(x, y); }
    f.stroke();
  }
  // Startmarkierung
  const sx = (S.startC + 0.5) * cs, sy = (S.startR + 0.5) * cs;
  if (SAFE) {
    f.fillStyle = 'rgba(70,190,160,0.22)'; f.fillRect(S.startC * cs + 2, S.startR * cs + 2, cs - 4, cs - 4);
    f.strokeStyle = 'rgba(110,230,195,0.75)'; f.lineWidth = Math.max(1.5, cs * 0.05); f.beginPath(); f.arc(sx, sy, cs * 0.4, 0, 6.283); f.stroke();
    f.fillStyle = 'rgba(150,245,215,0.85)'; f.font = `bold ${Math.max(8, Math.round(cs * 0.17))}px Consolas,monospace`; f.textAlign = 'center'; f.fillText('SAFE', sx, S.startR * cs + cs * 0.22);
  } else {
    f.strokeStyle = 'rgba(217,164,65,0.5)'; f.lineWidth = Math.max(1.5, cs * 0.04); f.setLineDash([cs * 0.1, cs * 0.08]);
    f.beginPath(); f.arc(sx, sy, cs * 0.38, 0, 6.283); f.stroke(); f.setLineDash([]);
  }
  return cnv;
}

function makeGrain() {
  const c = document.createElement('canvas'); c.width = c.height = 192; const x = c.getContext('2d'), im = x.createImageData(192, 192);
  for (let i = 0; i < im.data.length; i += 4) { const v = Math.random() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  x.putImageData(im, 0, 0); return c;
}
