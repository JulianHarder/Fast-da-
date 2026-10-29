'use strict';
/* Safe Space */

function scatterChasers() {
  if (!S.chasers.length) return;
  S.chasers = S.chasers.filter(ch => ch.kind !== 'shard');
  const dp = bfs(S.startC, S.startR).d; let mx = 0; for (const v of dp) if (v > mx) mx = v;
  const far = []; for (let i = 0; i < dp.length; i++) if (dp[i] >= mx * 0.65) far.push(i);
  for (const ch of S.chasers) { const i = pick(far); ch.c = ch.fc = i % cols; ch.r = ch.fr = (i / cols) | 0; ch.t = 1; ch.tgt = null; if (ch.kind === 'lurker') ch.st = 'wait'; }
}

function enterSafe() {
  scatterChasers();
  const d = bfs(S.startC, S.startR).d;
  for (const i of [...S.gas.keys()]) if (d[i] >= 0 && d[i] <= 5) S.gas.delete(i);
  let ch = false; for (const i of [...S.holes.keys()]) if (d[i] >= 0 && d[i] <= 3) { S.holes.delete(i); ch = true; }
  if (ch) ensureConnected(null);
  S.darkT = S.slowT = S.turboT = S.flickT = S.glitchT = 0; S.gasExp = 0; S.beatT = 0; S.pulse = 0; S.nearDist = 99;
  say(T.safe, true); sfx.safe();
}

function updateSafeHint() {
  if (!SAFE) { S.safeArrow = ''; S.safeDist = 0; return; }
  const dg = bfs(S.startC, S.startR).d, me = dg[idx(P.c, P.r)]; S.safeDist = Math.max(0, me); let arrow = '';
  for (const dir of DIRS) {
    if (wallAt(P.c, P.r, dir)) continue;
    const nc = P.c + DX[dir], nr = P.r + DY[dir]; if (!inb(nc, nr)) continue;
    if (dg[idx(nc, nr)] >= 0 && dg[idx(nc, nr)] < me) { arrow = { 1: '↑', 2: '→', 4: '↓', 8: '←' }[dir]; break; }
  }
  S.safeArrow = arrow;
}
