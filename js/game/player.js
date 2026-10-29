'use strict';
/* Spieler: Bewegung, Eingabepuffer, Verlust (die), Zeitablauf */

function blocked(c, r, d) { return wallAt(c, r, d) || closedDoor(c, r, d); }
function playerPos() { const e = 1 - Math.pow(1 - P.t, 2); return { x: P.fc + (P.c - P.fc) * e, y: P.fr + (P.r - P.fr) * e }; }
function stepNow() { return 0.1 * (S.slowT > 0 ? 2.2 : 1) * (S.turboT > 0 ? 0.55 : 1) * (S.sprinting ? 0.62 : 1); }

function die(reason) {
  if (S.inv > 0 || S.phase !== 'play') return;
  S.deaths++; S.sectDeaths++; S.fails++; S.streak = 0; S.inv = 1.6; S.held = []; S.touchDir = 0; submitRun();
  const pp = playerPos();
  S.fallFx = { x: pp.x, y: pp.y, ang: Math.atan2(DY[P.face], DX[P.face]), t: 0, kind: reason }; S.respawnT = 0; S.fade = 1;
  S.levelT = Math.max(6, S.levelT - 7); S.gasExp = 0;
  if (S.fails >= 3 && !S.easeGiven) { S.easeGiven = true; S.levelT = Math.min(S.levelMax * 1.4, S.levelT + 10); }
  const D = {
    fall: ['Bodeneinsturz', TEAL, sfx.fall, T.fall, '#9aa3a8'], caught: ['Kontakt', RED, sfx.caught, T.caught, '#b3342f'],
    laser: ['Laser-Sperre', RED, sfx.caught, T.laserdead, '#e0584c'], gas: ['Kontamination', '#b5c95a', sfx.caught, T.gasdead, '#b5c95a']
  }[reason] || ['Kontakt', RED, sfx.caught, T.caught, '#b3342f'];
  sparks(pp.x + 0.5, pp.y + 0.5, 22, D[4], 4);
  let lost = false; if (S.coreN > 0 && !S.doorOpen) { for (const co of S.cores) co.got = false; S.coreN = 0; lost = true; }
  { let hc = false; for (const co of S.cores) { const hi = idx(co.c, co.r); if (S.holes.has(hi)) { S.holes.delete(hi); hc = true; } } if (hc) ensureConnected(null); }
  const upl = !!S.uplink; S.uplink = null;
  S.jam = null; S.stam = 1; S.stamLock = false;
  D[2](); banner(D[0], 'Proband zurückgesetzt. −7 s' + (upl ? ' Übertragung abgebrochen, Kerne verloren.' : (lost ? ' Datenkerne verloren.' : '')), D[1], 2.2, false, 4); say(D[3], true);
  P.c = P.fc = S.startC; P.r = P.fr = S.startR; P.t = 1; P.expr = 'sad'; P.exprT = 1.2;
  if (S.chasers.length) {
    S.chasers = S.chasers.filter(ch => ch.kind !== 'shard');
    const dp = bfs(P.c, P.r).d; let mx = 0; for (const v of dp) if (v > mx) mx = v;
    const far = []; for (let i = 0; i < dp.length; i++) if (dp[i] >= mx * 0.65) far.push(i);
    for (const ch of S.chasers) { const i = pick(far); ch.c = ch.fc = i % cols; ch.r = ch.fr = (i / cols) | 0; ch.t = 1; ch.tgt = null; if (ch.kind === 'lurker') ch.st = 'wait'; }
  }
  emitNoise(P.c, P.r, 10);
}

function timeUp() { S.timeouts++; S.streak = 0; S.fails++; sfx.fake(); newLevel('time'); }
const sprintAny = () => S.sprintKey || S.touchSprint || S.padSprint;

function wantDir() {
  let d = S.touchDir || S.padDir || (S.held.length ? S.held[S.held.length - 1] : 0);
  return d;
}

function takeDir() {
  const b = S.buf;
  if (b && b.t > 0) { if (!blocked(P.c, P.r, b.d)) { S.buf = null; return b.d; } }
  return wantDir();
}

function bufDir(d) { if (S.phase === 'play' && P.t < 1 && d) S.buf = { d, t: 0.28 }; }

function tryMove(dir) {
  if (S.phase !== 'play' || P.t < 1 || !dir) return;
  P.face = dir;
  if (blocked(P.c, P.r, dir)) { if (P.expr !== 'bonk') { P.expr = 'bonk'; P.exprT = 0.25; sfx.bump(); if (Math.random() < 0.15) say(T.bump); } return; }
  S.sprinting = sprintAny() && !S.stamLock && S.stam > 0.02;
  P.step = stepNow(); P.fc = P.c; P.fr = P.r; P.c += DX[dir]; P.r += DY[dir]; P.t = 0; sfx.step(S.sprinting);
  if (S.sprinting && S.noiseCd <= 0) { emitNoise(P.c, P.r, 7); S.noiseCd = 0.3; }
}
