'use strict';
/* Haupt-Update pro Frame */

function update(dt) {
  S.T += dt;
  if (S.phase === 'menu' || S.phase === 'paused' || S.phase === 'brief') return;
  S.time += dt;
  S.flash = Math.max(0, S.flash - dt);
  S.tauntT = Math.max(0, S.tauntT - dt); S.nearT = Math.max(0, S.nearT - dt); S.lockMsgCd = Math.max(0, S.lockMsgCd - dt);
  S.cdSlam = Math.max(0, S.cdSlam - dt); S.cdFlee = Math.max(0, S.cdFlee - dt); S.noiseCd = Math.max(0, S.noiseCd - dt);
  if (S.buf) { S.buf.t -= dt; if (S.buf.t <= 0) S.buf = null; }
  if (S.mapT > 0) S.mapT -= dt; if (S.mapCd > 0 && !S.inSafe) S.mapCd -= dt;
  if (P.exprT > 0) { P.exprT -= dt; if (P.exprT <= 0) P.expr = 'idle'; }
  if (S.banner) { S.banner.t += dt; if (S.banner.t > S.banner.dur) S.banner = null; }
  if (S.log) { S.log.t += dt; if (S.log.t > S.log.dur) S.log = null; }
  S.respawnT += dt; if (S.fade > 0) S.fade = Math.max(0, S.fade - dt / 1.1);
  if (S.fallFx) { S.fallFx.t += dt; if (S.fallFx.t > 0.8) S.fallFx = null; }
  if (S.door && S.doorOpen && S.door.open < 1) S.door.open = Math.min(1, S.door.open + dt / 1.4);
  for (const a of S.anims) a.age += dt; S.anims = S.anims.filter(a => a.age < 0.7);
  for (const f of S.coreFx) f.t += dt; S.coreFx = S.coreFx.filter(f => f.t < 0.9);
  for (const f of S.flyers) f.t += dt; S.flyers = S.flyers.filter(f => f.t < 1.1);
  for (const pt of S.parts) { pt.age += dt; pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.vy += 2.5 * dt; }
  S.parts = S.parts.filter(pt => pt.age < pt.life);
  for (const pu of S.popups) pu.t += dt; S.popups = S.popups.filter(pu => pu.t < 1.6);
  for (const n of S.noises) n.age += dt; S.noises = S.noises.filter(n => n.age < n.life);

  if (S.phase === 'reveal') {
    S.revT -= dt;
    if (P.t < 1) P.t = Math.min(1, P.t + dt / P.step);
    if (S.revT <= 0) { S.level++; newLevel(); }
    return;
  }
  // Safe Space: Welt eingefroren
  const nowSafe = SAFE && P.c === S.startC && P.r === S.startR;
  if (nowSafe && !S.inSafe) enterSafe();
  S.inSafe = nowSafe;
  if (S.inSafe) {
    S.sprinting = false; S.stam = Math.min(1, S.stam + dt * 0.5);
    if (P.t < 1) { P.t = Math.min(1, P.t + dt / P.step); if (P.t >= 1) onStep(); }
    if (S.phase === 'play' && P.t >= 1) { const d = takeDir(); if (d) tryMove(d); }
    return;
  }
  // play
  S.score += dt * 10;
  S.lbT += dt; if (S.lbT > 0.5) { S.lbT = 0; checkRank(); }
  S.saveT += dt; if (S.saveT > 15) { S.saveT = 0; submitRun(); }
  S.idleT += dt;
  if (S.idleT > 14 && S.tauntT <= 0) say(T.idle, true);
  if (S.darkT > 0) S.darkT -= dt;
  if (S.slowT > 0) S.slowT -= dt;
  if (S.turboT > 0) S.turboT -= dt;
  if (S.inv > 0) S.inv -= dt;
  if (S.lightBoost > 0) S.lightBoost -= dt;
  if (S.portalCd > 0) S.portalCd -= dt;
  S.voiceT -= dt; if (S.voiceT <= 0) { S.voiceT = rnd(25, 50); sfx.voice(); }
  if (S.jam) { S.jam.t -= dt; S.jam.beep -= dt; if (S.jam.beep <= 0) { S.jam.beep = 1; emitNoise(S.jam.c, S.jam.r, 10); sfx.beepJam(); } if (S.jam.t <= 0) S.jam = null; }
  S.evT -= dt; if (S.evT <= 0) doEvent();

  // Zeitlimit
  if (!S.uplink) S.levelT -= dt; // während der Übertragung steht der Kollaps-Timer still
  if (S.levelT < 10 && Math.ceil(S.levelT) !== S.tickLast) { S.tickLast = Math.ceil(S.levelT); if (S.levelT > 0) sfx.tick(); }
  if (S.levelT <= 0) { timeUp(); return; }

  // Türen
  for (const [k, d] of S.doors) {
    if (wallAt(d.c, d.r, d.dir)) { S.doors.delete(k); continue; }
    d.t += dt; const ph = (d.t % d.per) / d.per, was = d.closed;
    d.closed = ph > d.of; d.warn = !d.closed && (d.of - ph) * d.per < 0.3;
    const nx = d.dir === E ? d.c + 1 : d.c, ny = d.dir === E ? d.r : d.r + 1;
    const nearP = (d.c === P.c && d.r === P.r) || (nx === P.c && ny === P.r) || (d.c === P.fc && d.r === P.fr) || (nx === P.fc && ny === P.fr);
    if (nearP) { d.closed = false; d.warn = false; }
    if (!was && d.closed && Math.abs(d.c - P.c) + Math.abs(d.r - P.r) < 5) sfx.door();
  }
  // Löcher
  for (const [i, h] of S.holes) {
    h.t += dt;
    if (h.st === 'warn' && Math.random() < dt * 16) sparks((i % cols) + 0.5 + rnd(-0.3, 0.3), ((i / cols) | 0) + 0.5 + rnd(-0.2, 0.2), 1, 'rgba(190,182,160,0.9)', 0.5);
    if (h.st === 'warn' && h.t >= h.wt) { h.st = 'open'; h.t = 0; sfx.holeOpen(); emitNoise(i % cols, (i / cols) | 0, 6); }
    else if (h.st === 'open' && h.t > h.life) { S.holes.delete(i); ensureConnected(null); }
  }
  updateHazards(dt);
  updateUplink(dt); if (S.phase !== 'play') return;
  // Fluchtweg
  S.cornerCd = Math.max(0, S.cornerCd - dt); S.exitT = (S.exitT || 0) + dt;
  if (S.exitT > 0.3) { S.exitT = 0; ensureExit(); updateNear(); updateCoreHint(); updateSafeHint(); cornerCheck(); }
  // Jäger
  if (!S.chasers.length) { S.chaserT -= dt; if (S.chaserT <= 1.0 && !S.spawnPlan) prepareSpawn(); if (S.chaserT <= 0) spawnChasers(); }
  else updateChasers(dt);
  if (S.phase !== 'play') return;

  updateWallWarn(dt);
  // Sprint / Ausdauer
  const moving = P.t < 1 || !!wantDir();
  if (moving && sprintAny() && !S.stamLock && S.stam > 0) { S.sprinting = true; S.stam = Math.max(0, S.stam - dt * 0.5); S.sprintDelay = 0.8; if (S.stam <= 0) S.stamLock = true; }
  else { S.sprinting = false; if (S.sprintDelay > 0) S.sprintDelay -= dt; else S.stam = Math.min(1, S.stam + dt * 0.28); if (S.stamLock && S.stam >= 0.3) S.stamLock = false; }

  if (P.t < 1) { P.t = Math.min(1, P.t + dt / P.step); if (P.t >= 1) { onStep(); if (S.phase !== 'play') return; } }
  if (P.t >= 1) { const d = takeDir(); if (d) { tryMove(d); if (P.t < 1) P.t = Math.min(1, P.t + 0.0001); } }
  // Sturz ins Loch
  if (S.inv <= 0 && P.t >= 0.5) { const h = S.holes.get(idx(P.c, P.r)); if (h && h.st === 'open') die('fall'); }

  // Frust-Faktor (färbt die Ränder rot)
  S.rage = clamp((S.level - 1) * 0.1 + S.pops * 0.015 + S.deaths * 0.02, 0, 1);
}
