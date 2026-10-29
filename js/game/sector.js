'use strict';
/* Sektor-Ablauf: Uebertragung, Ausgang, Abschluss */

function startUplink() {
  const dur = [8, 10, 12][MODE];
  S.uplink = { t: 0, dur, tick: dur };
  banner('Übertragung gestartet', 'Überleben Sie ' + dur + ' Sekunden.', '#7fe3ff', 3.2, true, 4);
  sfx.unlock(); sfx.uplink(); say(T.uplink, true);
  S.evT = Math.min(S.evT, 0.5); S.gasCd = 0; if (S.gasMode === 'off') startGas();
  for (const ch of S.chasers) ch.spCd = 0;
  if (!S.chasers.length) S.chaserT = Math.min(S.chaserT, 0.5);
}

function updateUplink(dt) {
  const u = S.uplink; if (!u) return;
  u.t += dt;
  const left = Math.ceil(u.dur - u.t);
  if (left !== u.tick && left > 0) { u.tick = left; sfx.tick(); }
  if (u.t >= u.dur) { S.uplink = null; unlockDoor(); }
}

function placeExit() {
  const dp = bfs(P.c, P.r).d, cand = []; let mx = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (c !== 0 && r !== 0 && c !== cols - 1 && r !== rows - 1) continue;
    const i = idx(c, r); if (dp[i] < 0 || (c === S.startC && r === S.startR)) continue;
    if (S.portals.some(pt => pt.c === c && pt.r === r)) continue;
    cand.push({ c, r, d: dp[i] }); if (dp[i] > mx) mx = dp[i];
  }
  const far = cand.filter(x => x.d >= mx * 0.6), ch = far.length ? pick(far) : pick(cand), dirs = [];
  if (ch.r === 0) dirs.push(N); if (ch.r === rows - 1) dirs.push(SO); if (ch.c === 0) dirs.push(WE); if (ch.c === cols - 1) dirs.push(E);
  S.door = { c: ch.c, r: ch.r, dir: pick(dirs), open: 0 }; S.doorOpen = false;
}

function unlockDoor() {
  S.doorOpen = true; S.doorD0 = Math.max(1, bfs(S.door.c, S.door.r).d[idx(P.c, P.r)]);
  addScore(1000, 'ÜBERTRAGUNG +1000', '#7fe3ff');
  S.levelT = Math.min(S.levelMax * 1.4, S.levelT + 15);
  banner('Tür öffnet sich', 'Übertragung abgeschlossen. Laufen Sie zum Licht. +15 s', '#fff1c9', 3.6, true, 4);
  sfx.win(); sfx.doorOpen(); say(T.door, true); updateCoreHint();
}

function completeSector() {
  S.phase = 'reveal'; S.revT = 1.8; S.cleared++; S.sectorDone = true; S.jam = null; S.held = []; S.touchDir = 0;
  const base = 2000 + Math.max(0, Math.floor(S.levelT)) * 20, m = mult(), bonus = Math.round(base * m);
  const ratio = S.levelT / S.levelMax, d0 = S.sectDeaths, rank = d0 === 0 && ratio >= 0.5 ? 'S' : (d0 === 0 || (d0 <= 1 && ratio >= 0.4)) ? 'A' : d0 <= 2 ? 'B' : 'C';
  S.lastStats = { level: S.level, name: sectName(S.level), time: Math.max(0, S.time - S.secStart), near: S.secNear, deaths: d0, rank, bonus, mult: m };
  addScore(bonus, 'SEKTOR ABGESCHLOSSEN +' + bonus, '#6ee7a0', true);
  if (d0 === 0) S.streak++;
  banner('Sektor abgeschlossen · Rang ' + rank, '+' + bonus + ' Punkte' + (m > 1 ? ' (×' + m.toFixed(2).replace(/0$/, '') + ')' : '') + ' · weiter zum nächsten Sektor', '#6ee7a0', 2.2, false, 4);
  const pp = playerPos(); sfx.win(); sparks(pp.x + 0.5, pp.y + 0.5, 30, '#fff1c9', 4); say(T.real, true); saveBest(); submitRun(); checkRank();
}

function updateCoreHint() {
  let best = null, bd = 1e9; const dp = bfs(P.c, P.r).d;
  if (S.doorOpen && S.door) { best = S.door; bd = Math.max(0, dp[idx(S.door.c, S.door.r)]); }
  else for (const co of S.cores) if (!co.got) { const v = dp[idx(co.c, co.r)]; if (v >= 0 && v < bd) { bd = v; best = co; } }
  if (!best) { S.coreDist = 0; S.coreArrow = ''; return; }
  S.coreDist = bd; const dg = bfs(best.c, best.r).d, me = dg[idx(P.c, P.r)]; let arrow = '';
  for (const dir of DIRS) {
    if (wallAt(P.c, P.r, dir)) continue;
    const nc = P.c + DX[dir], nr = P.r + DY[dir]; if (!inb(nc, nr)) continue;
    if (dg[idx(nc, nr)] >= 0 && dg[idx(nc, nr)] < me) { arrow = { 1: '↑', 2: '→', 4: '↓', 8: '←' }[dir]; break; }
  }
  S.coreArrow = arrow;
}

function onStep() {
  if (S.phase !== 'play') return;
  S.steps++;
  if (S.portalCd <= 0 && S.portals.some(p => p.c === P.c && p.r === P.r)) usePortal();
  pickups();
  if (S.doorOpen && S.door && P.c === S.door.c && P.r === S.door.r) completeSector();
}
