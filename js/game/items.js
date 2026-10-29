'use strict';
/* Datenkerne, Items, Laerm, Karte und Stoersender */

function emitNoise(c, r, rad) { S.noiseId++; S.noises.push({ c, r, rad, age: 0, life: 1.3, id: S.noiseId }); if (S.noises.length > 14) S.noises.shift(); }

function placeCores() {
  const dp = bfs(P.c, P.r).d, hot = new Map();
  const bump = (c, r, w) => { if (inb(c, r)) { const i = idx(c, r); hot.set(i, (hot.get(i) || 0) + w); } };
  for (const l of S.lasers) { bump(l.c, l.r, 3); bump(l.dir === E ? l.c + 1 : l.c, l.dir === E ? l.r : l.r + 1, 3); }
  for (const d of S.doors.values()) { bump(d.c, d.r, 2); bump(d.dir === E ? d.c + 1 : d.c, d.dir === E ? d.r : d.r + 1, 2); }
  for (const pt of S.portals) bump(pt.c, pt.r, 2);
  const cand = [];
  for (let i = 0; i < dp.length; i++) {
    const c = i % cols, r = (i / cols) | 0;
    if (dp[i] < 5 || (S.door && c === S.door.c && r === S.door.r) || S.portals.some(pt => pt.c === c && pt.r === r)) continue;
    const open = DIRS.filter(d => !wallAt(c, r, d)).length;
    cand.push({ c, r, s: (hot.get(i) || 0) + (open === 1 ? 2 : 0) + Math.random() * 2.5 });
  }
  cand.sort((a, b) => b.s - a.s);
  const out = [];
  for (const minD of [6, 4, 2]) {
    for (const x of cand) { if (out.length >= 3) break; if (out.includes(x)) continue; if (out.every(o => Math.abs(o.c - x.c) + Math.abs(o.r - x.r) >= minD)) out.push(x); }
    if (out.length >= 3) break;
  }
  S.cores = out.map(x => ({ c: x.c, r: x.r, got: false }));
}

function placeItems() {
  S.items = [];
  const dp = bfs(P.c, P.r).d, taken = new Set(S.cores.map(c => idx(c.c, c.r)).concat(S.portals.map(p => idx(p.c, p.r))));
  const want = ['battery', 'battery'].concat(S.level >= 4 ? ['battery'] : [], ['jammer'], S.level >= 6 ? ['jammer'] : []);
  for (const type of want) {
    for (let k = 0; k < 80; k++) {
      const i = ri(dp.length); if (dp[i] < 3 || taken.has(i) || i === idx(G.c, G.r) || (S.door && i === idx(S.door.c, S.door.r))) continue;
      taken.add(i); S.items.push({ type, c: i % cols, r: (i / cols) | 0, got: false }); break;
    }
  }
}

function pickups() {
  for (const co of S.cores) if (!co.got && co.c === P.c && co.r === P.r) {
    co.got = true; S.coreN++; addScore(500, 'DATENKERN +500', '#7fe3ff'); sfx.core(S.coreN); sparks(co.c + 0.5, co.r + 0.5, 22, '#7fe3ff', 3.6);
    S.coreFx.push({ c: co.c, r: co.r, t: 0 }); S.flyers.push({ x: ox + (co.c + 0.5) * cs, y: oy + (co.r + 0.5) * cs, t: 0, txt: '+' + Math.round(500 * mult()) }); say(T.core, true);
    S.evT = Math.min(S.evT, 0.5);
    if (S.coreN >= S.cores.length) startUplink(); else banner('Datenkern ' + S.coreN + ' von ' + S.cores.length, 'Noch ' + (S.cores.length - S.coreN) + ' bis zur Übertragung.', '#7fe3ff', 2.2, false, 3);
  }
  for (const it of S.items) if (!it.got && it.c === P.c && it.r === P.r) {
    it.got = true;
    if (it.type === 'battery') { S.levelT = Math.min(S.levelMax * 1.4, S.levelT + 8); S.lightBoost = 12; addScore(50, 'BATTERIE +8 s', '#f2c14e'); say(T.battery, true); }
    else { S.jammers = Math.min(3, S.jammers + 1); addScore(50, 'STÖRSENDER +1', '#7fb6b0'); say(T.jamget, true); }
    sfx.battery(); sparks(it.c + 0.5, it.r + 0.5, 10, '#f2c14e', 2.5);
  }
}

function useMap() {
  if (S.phase !== 'play' || S.mapCd > 0 || S.mapT > 0) return;
  S.mapT = 2.2; S.mapCd = 30; sfx.tick(); say('Karte geladen.', true);
}

function useJammer() {
  if (S.phase !== 'play' || S.jam || S.jammers <= 0) return;
  S.jammers--; S.jam = { c: P.c, r: P.r, t: 7, beep: 0 }; sfx.jam(); say(T.jam, true); emitNoise(P.c, P.r, 10);
}
