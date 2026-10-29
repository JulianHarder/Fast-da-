'use strict';
/* Jaeger: Erzeugung, Typen und Verhalten */

function mkChaser(kind, c, r) {
  const base = Math.max(0.34, 0.56 - 0.03 * S.level) * [1, 0.9, 0.8][MODE];
  const spd = kind === 'lurker' ? 0.2 : kind === 'blind' ? base * 1.25 : kind === 'splitter' ? base * 1.25 : kind === 'shard' ? 0.38 : base;
  return { kind, c, r, fc: c, fr: r, t: 1, spd, sp: 0, spCd: rnd(2, 5), st: kind === 'lurker' ? 'wait' : 'go', dash: 0, rest: 0, split: rnd(10, 14), life: kind === 'shard' ? 7 : 0, grace: kind === 'shard' ? 1 : 0, tgt: null, tT: 0, heard: 0, vary: Math.random() < 0.5 };
}

function planChasers(L) {
  const k = Math.min(6, (L >= 9 ? 4 : (L >= 5 ? 3 : (L >= 2 ? 2 : 1))) + MODE);
  const allowed = ['hunter']; if (L >= 2) allowed.push('lurker'); if (L >= 3) allowed.push('blind'); if (L >= 5) allowed.push('splitter');
  const out = []; for (let n = 0; n < k; n++) out.push(n === 0 ? 'hunter' : allowed[n % allowed.length]);
  return out;
}

function prepareSpawn() {
  const kinds = S.plan && S.plan.length ? S.plan : planChasers(S.level);
  const dp = bfs(P.c, P.r).d; let mx = 0; for (const v of dp) if (v > mx) mx = v;
  const far = []; for (let i = 0; i < dp.length; i++) if (dp[i] >= mx * 0.65) far.push(i);
  S.spawnPlan = kinds.map(k => { const i = pick(far); return { kind: k, c: i % cols, r: (i / cols) | 0 }; });
  if (!S.inSafe) { const a = S.spawnPlan[0], pan = clamp((a.c - P.c) / 6, -1, 1); sfx.warnPan(pan); }
}

function spawnChasers() {
  if (!S.spawnPlan) prepareSpawn();
  const plan = S.spawnPlan; S.spawnPlan = null;
  S.chasers = [];
  for (const pl of plan) {
    const c = pl.c, r = pl.r;
    S.chasers.push(mkChaser(pl.kind, c, r));
    sparks(c + 0.5, r + 0.5, 14, '#b3342f', 3);
  }
  sfx.chaser(); banner('Anomalie freigesetzt', 'Sie hat Sie bemerkt.', RED, 1.4); say(T.chaser, true);
}

function stepToward(ch, tab, vary) {
  const opts = [];
  for (const dir of DIRS) {
    if (blocked(ch.c, ch.r, dir)) continue;
    const nc = ch.c + DX[dir], nr = ch.r + DY[dir]; if (!inb(nc, nr)) continue;
    const v = tab[idx(nc, nr)]; if (v >= 0) opts.push([v, nc, nr]);
  }
  if (!opts.length) return null;
  opts.sort((a, b) => a[0] - b[0]);
  const o = (vary && opts.length > 1 && Math.random() < 0.35) ? opts[1] : opts[0];
  return [o[1], o[2]];
}

function wander(ch) {
  const opts = DIRS.filter(dir => !blocked(ch.c, ch.r, dir) && inb(ch.c + DX[dir], ch.r + DY[dir]));
  if (!opts.length) return null;
  const fwd = opts.filter(dir => !(ch.c + DX[dir] === ch.fc && ch.r + DY[dir] === ch.fr));
  const dir = pick(fwd.length ? fwd : opts); return [ch.c + DX[dir], ch.r + DY[dir]];
}

function updateChasers(dt) {
  S.nearMissCd = Math.max(0, S.nearMissCd - dt);
  const dP = bfs(P.c, P.r, true).d, dJ = S.jam ? bfs(S.jam.c, S.jam.r, true).d : null, born = [];
  for (const ch of S.chasers) {
    ch.spCd -= dt; if (ch.sp > 0) ch.sp -= dt; if (ch.kind === 'shard') ch.life -= dt; if (ch.grace > 0) ch.grace -= dt;
    if (ch.tgt) { ch.tT -= dt; if (ch.tT <= 0) ch.tgt = null; }
    if (ch.kind === 'splitter') { ch.split -= dt; if (ch.split <= 0 && S.chasers.length + born.length < 9) { ch.split = rnd(11, 15); born.push([ch.c, ch.r], [ch.c, ch.r]); sfx.growl(); } }
    if (ch.t < 1) { ch.t = Math.min(1, ch.t + dt / (ch.spd * (ch.sp > 0 ? 0.75 : 1))); continue; }
    const here = idx(ch.c, ch.r); let next = null;
    if (ch.kind === 'lurker') {
      if (ch.st === 'rest') { ch.rest -= dt; if (ch.rest <= 0) ch.st = 'wait'; continue; }
      if (ch.st === 'wait') { const dd = dP[here]; if (dd >= 0 && dd <= 5 && S.inv <= 0) { ch.st = 'dash'; ch.dash = 10; sfx.growl(); } else continue; }
      next = stepToward(ch, dP, false);
      if (--ch.dash <= 0) { ch.st = 'rest'; ch.rest = 3.5; }
    } else if (ch.kind === 'blind') {
      for (const n of S.noises) if (n.id > ch.heard && Math.abs(n.c - ch.c) + Math.abs(n.r - ch.r) <= n.rad) { ch.heard = n.id; ch.tgt = [n.c, n.r]; ch.tT = 6; }
      if (dP[here] >= 0 && dP[here] <= 2 && S.inv <= 0) { ch.tgt = [P.c, P.r]; ch.tT = 3; }
      if (ch.tgt) { const tab = bfs(ch.tgt[0], ch.tgt[1], true).d; if (tab[here] === 0) ch.tgt = null; else next = stepToward(ch, tab, false); }
      if (!next) next = wander(ch);
    } else {
      const tab = dJ || dP;
      if (ch.kind !== 'shard' && ch.spCd <= 0 && dP[here] >= 0 && dP[here] <= 5) { ch.sp = 0.8; ch.spCd = rnd(8, 12); sfx.growl(); }
      if (dJ && tab[here] === 0) continue;
      next = stepToward(ch, tab, ch.kind === 'shard' && ch.vary) || wander(ch);
    }
    if (next) { ch.fc = ch.c; ch.fr = ch.r; ch.c = next[0]; ch.r = next[1]; ch.t = 0; }
  }
  for (const b of born) S.chasers.push(mkChaser('shard', b[0], b[1]));
  if (S.chasers.some(c => c.kind === 'shard' && c.life <= 0)) S.chasers = S.chasers.filter(c => c.kind !== 'shard' || c.life > 0);
  const pp = playerPos();
  for (const ch of S.chasers) {
    const e = 1 - Math.pow(1 - ch.t, 2), x = ch.fc + (ch.c - ch.fc) * e, y = ch.fr + (ch.r - ch.fr) * e, dd = Math.hypot(x - pp.x, y - pp.y);
    if (S.inv <= 0 && !(ch.grace > 0) && dd < (ch.kind === 'shard' ? 0.48 : 0.55)) { die('caught'); return; }
    if (S.inv <= 0 && S.nearMissCd <= 0 && dd >= 0.55 && dd < 1.1 && !(ch.kind === 'lurker' && ch.st === 'wait')) { S.nearMissCd = 3; S.secNear++; addScore(50, 'BEINAHE +50', '#d5d9db'); }
  }
}
