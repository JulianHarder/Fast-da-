'use strict';
/* Gas, Laser, Halluzinationen und Herzschlag */

function startGas() {
  if (S.gasMode !== 'off' || S.gasCd > 0) return false;
  const dp = bfs(P.c, P.r).d, cand = [];
  for (let i = 0; i < dp.length; i++) if (dp[i] >= 8 && !S.holes.has(i)) cand.push(i);
  if (!cand.length) return false;
  const src = pick(cand);
  S.gas = new Map([[src, { v: 0.05, fade: false }]]); S.gasSeen = new Set([src]); S.gasFront = [src]; S.gasOrder = [src];
  S.gasMode = 'grow'; S.gasT = 0; S.gasSpT = 0; S.gasCap = Math.floor(cols * rows * [0.22, 0.27, 0.33][MODE]); S.gasFadeI = 0; S.gasFadeT = 0;
  sfx.gas(); say(T.gas, true); banner('Kontamination', 'Leck im Lüftungssystem.', '#b5c95a', 1.5);
  return true;
}

function updateGas(dt) {
  if (S.gasMode === 'off') { S.gasCd = Math.max(0, S.gasCd - dt); S.gasExp = Math.max(0, S.gasExp - dt * 1.5); return; }
  S.gasT += dt;
  if (S.gasMode === 'grow') {
    S.gasSpT += dt;
    if (S.gasSpT > 0.6) {
      S.gasSpT = 0; const nf = [];
      for (const i of S.gasFront) {
        const c = i % cols, r = (i / cols) | 0;
        for (const dir of DIRS) {
          if (walls[i] & dir) continue;
          const nc = c + DX[dir], nr = r + DY[dir]; if (!inb(nc, nr)) continue;
          const j = idx(nc, nr); if (S.gasSeen.has(j) || S.gas.size >= S.gasCap) continue;
          S.gasSeen.add(j); S.gas.set(j, { v: 0.05, fade: false }); S.gasOrder.push(j); nf.push(j);
        }
      }
      S.gasFront = nf;
      if (!nf.length || S.gas.size >= S.gasCap || S.gasT > 16) { S.gasMode = 'fade'; S.gasFadeI = 0; S.gasFadeT = 0; }
    }
  } else {
    S.gasFadeT += dt;
    if (S.gasFadeT > 0.25) { S.gasFadeT = 0; if (S.gasFadeI < S.gasOrder.length) { const o = S.gas.get(S.gasOrder[S.gasFadeI++]); if (o) o.fade = true; } }
  }
  for (const [i, o] of S.gas) {
    if (o.fade) { o.v -= dt * 1.4; if (o.v <= 0) { S.gas.delete(i); continue; } } else o.v = Math.min(1, o.v + dt * 1.8);
    if (Math.random() < dt * 1.2) sparks((i % cols) + 0.5 + rnd(-0.3, 0.3), ((i / cols) | 0) + 0.5 + rnd(-0.3, 0.3), 1, 'rgba(190,220,100,.8)', 0.3);
  }
  if (S.gasMode === 'fade' && S.gas.size === 0) { S.gasMode = 'off'; S.gasCd = rnd(12, 18) / MM(); }
  const o = S.gas.get(idx(P.c, P.r));
  if (o && o.v > 0.45 && S.inv <= 0) { S.gasExp += dt; if (S.gasExp >= 1.9) { S.gasExp = 0; die('gas'); } }
  else S.gasExp = Math.max(0, S.gasExp - dt * 1.5);
}

function makeLasers() {
  S.lasers = [];
  const L = Math.min(S.level, 6), n = Math.min(7, 1 + Math.floor(L * 0.9) + MODE), pe = pathEdges(300).slice(3);
  let tries = 0;
  while (S.lasers.length < n && tries++ < 300) {
    let c, r, d;
    if (pe.length && Math.random() < 0.5) { const e = pick(pe); c = e[0]; r = e[1]; d = e[2]; } else { c = ri(cols); r = ri(rows); d = pick([E, SO]); }
    if (!inb(c + DX[d], r + DY[d]) || wallAt(c, r, d)) continue;
    const cn = canon(c, r, d), k = cn.join(',');
    if (S.doors.has(k) || S.lasers.some(l => l.k === k)) continue;
    if (Math.abs(cn[0] - S.startC) + Math.abs(cn[1] - S.startR) < 3) continue;
    const per = rnd(2.8, 4.4) / (MODE ? 1.1 : 1);
    S.lasers.push({ c: cn[0], r: cn[1], dir: cn[2], k, per, t: rnd(0, per), st: 'off' });
  }
}

function updateLasers(dt) {
  S.lasers = S.lasers.filter(l => !wallAt(l.c, l.r, l.dir));
  for (const l of S.lasers) {
    l.t += dt; const ph = (l.t % l.per) / l.per, was = l.st;
    l.st = ph < 0.5 ? 'off' : ph < 0.66 ? 'charge' : ph < 0.86 ? 'fire' : 'off';
    const near = Math.abs(l.c - P.c) + Math.abs(l.r - P.r) < 6;
    if (near && was !== 'charge' && l.st === 'charge') sfx.lcharge();
    if (near && was !== 'fire' && l.st === 'fire') sfx.lfire();
    if (l.st === 'fire' && S.inv <= 0 && P.t < 1) {
      const bc = l.dir === E ? l.c + 1 : l.c, br = l.dir === E ? l.r : l.r + 1;
      const cross = (P.fc === l.c && P.fr === l.r && P.c === bc && P.r === br) || (P.fc === bc && P.fr === br && P.c === l.c && P.r === l.r);
      if (cross && P.t > 0.12 && P.t < 0.92) { die('laser'); return; }
    }
  }
}

function spawnGhosts() {
  const dp = bfs(P.c, P.r).d, cand = [];
  for (let i = 0; i < dp.length; i++) if (dp[i] >= 3 && dp[i] <= 9) cand.push(i);
  const n = 1 + ri(3);
  for (let k = 0; k < n && cand.length; k++) { const i = pick(cand); S.ghosts.push({ c: i % cols, r: (i / cols) | 0, t: 0, life: rnd(1.2, 2.6) }); }
  say(T.ghost, true); sfx.ghost();
}

function updateHazards(dt) {
  updateGas(dt); updateLasers(dt);
  for (const gh of S.ghosts) gh.t += dt; S.ghosts = S.ghosts.filter(gh => gh.t < gh.life);
  if (S.glitchT > 0) S.glitchT -= dt; if (S.flickT > 0) S.flickT -= dt;
  S.beatT -= dt; S.pulse = Math.max(0, S.pulse - dt * 2.6);
  if (S.chasers.length && S.nearDist <= 9 && S.beatT <= 0) { sfx.beat(); S.pulse = 1; S.beatT = clamp(0.3 + S.nearDist * 0.1, 0.38, 1.2); }
}
