'use strict';
/* Gesamtbild pro Frame und Menue-Hintergrund */

function draw() {
  g.setTransform(DPR, 0, 0, DPR, 0, 0);
  g.fillStyle = mixc([5, 6, 7], [22, 4, 5], Math.min(S.rage, 0.5) * 0.8); g.fillRect(0, 0, VW, VH);
  if (S.phase === 'menu') { drawMenuBg(); return; }

  g.save(); g.translate(ox, oy);
  if (!floorCache) floorCache = buildFloor();
  g.drawImage(floorCache, 0, 0, cols * cs, rows * cs);
  drawHoles(); drawPortals();
  drawWalls(); drawWallWarn(); drawExitDoor(); drawDoors(); drawLaserPosts();
  g.restore();

  drawLighting();

  g.save(); g.translate(ox, oy);
  if (!S.inSafe) { drawDoorLamps(); drawLaserBeams(); drawGhosts(); }
  drawGas(); drawCoreFx(); drawSpawnWarn(); drawCores(); drawItems(); drawJam(); drawNoises(); drawSafe(); drawExitLight();
  for (const ch of S.chasers) drawChaser(ch);
  { const ra = clamp(S.respawnT / 0.9, 0, 1); g.save(); g.globalAlpha = ra < 1 ? 0.25 + 0.75 * ra * ra : 1; drawPlayer(); g.restore(); }
  drawFallFx(); drawRespawn();
  drawCoreOrbit();
  for (const p of S.parts) { g.globalAlpha = clamp(1 - p.age / p.life, 0, 1); g.fillStyle = p.col; g.beginPath(); g.arc(p.x * cs, p.y * cs, Math.max(1.2, cs * 0.05), 0, 6.283); g.fill(); }
  g.globalAlpha = 1; g.restore();

  if (S.rage > 0.1 && !S.inSafe) {
    const vg = g.createRadialGradient(VW / 2, VH / 2, Math.min(VW, VH) * 0.35, VW / 2, VH / 2, Math.max(VW, VH) * 0.8);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(50,0,6,${0.5 * Math.min(S.rage, 0.5)})`); g.fillStyle = vg; g.fillRect(0, 0, VW, VH);
  }
  if (!reduced && S.pulse > 0 && S.nearDist <= 9 && !S.inSafe) {
    const pv = g.createRadialGradient(VW / 2, VH / 2, Math.min(VW, VH) * 0.3, VW / 2, VH / 2, Math.max(VW, VH) * 0.75);
    pv.addColorStop(0, 'rgba(0,0,0,0)'); pv.addColorStop(1, `rgba(120,0,0,${0.4 * S.pulse * (1 - S.nearDist / 10)})`); g.fillStyle = pv; g.fillRect(0, 0, VW, VH);
  }
  if (!reduced) {
    if (!grainCv) grainCv = makeGrain();
    g.save(); g.globalAlpha = 0.045; g.drawImage(grainCv, -ri(192), -ri(192)); g.restore();
  }
  drawFlyers();
  drawTimerFrame();
  if (S.fade > 0) { g.fillStyle = `rgba(3,4,5,${0.8 * S.fade * S.fade})`; g.fillRect(0, 0, VW, VH); }
  if (S.flash > 0 && !reduced) { g.fillStyle = `rgba(120,10,10,${0.16 * S.flash / 0.15})`; g.fillRect(0, 0, VW, VH); }
  drawHud();
  if (S.sectorDone && S.phase === 'reveal') { const k = clamp(1 - S.revT / 1.8, 0, 1); g.fillStyle = `rgba(3,4,5,${Math.min(1, k * k * 1.15)})`; g.fillRect(0, 0, VW, VH); }
  if (S.banner && S.banner.mid && (S.phase === 'play' || S.phase === 'reveal')) { g.save(); g.translate(ox, oy); drawPlayer(); drawCoreOrbit(); g.restore(); }
}

function drawMenuBg() {
  const t = S.T;
  g.save(); g.strokeStyle = 'rgba(120,135,140,.07)'; g.lineWidth = 1; g.beginPath();
  const sz = 64, off = (t * 6) % sz;
  for (let x = -sz + off; x < VW + sz; x += sz) { g.moveTo(x, 0); g.lineTo(x, VH); }
  for (let y = 0; y < VH + sz; y += sz) { g.moveTo(0, y); g.lineTo(VW, y); }
  g.stroke();
  const lx = VW * (0.5 + 0.35 * Math.sin(t * 0.35)), ly = VH * (0.55 + 0.15 * Math.sin(t * 0.5)), R = Math.max(VW, VH) * 0.5;
  const gr = g.createRadialGradient(lx, ly, 0, lx, ly, R); gr.addColorStop(0, 'rgba(150,170,175,.11)'); gr.addColorStop(1, 'rgba(150,170,175,0)');
  g.fillStyle = gr; g.fillRect(0, 0, VW, VH); g.restore();
}
