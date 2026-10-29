'use strict';
/* Zufallsereignisse waehrend des Spiels */

function doEvent() {
  const L = Math.min(S.level, 5);
  const opts = [['pop', 5], ['hole', 6], ['back', 2], ['open', 1], ['shuffle', 2], ['slow', 2],
    ['turbo', L >= 2 ? 2 : 0], ['dark', L >= 3 ? 2 : 0], ['cage', L >= 3 ? 2 : 0],
    ['gas', L >= 2 ? 3 : 0], ['flicker', L >= 2 ? 2 : 0], ['glitch', L >= 2 ? 2 : 0], ['ghost', L >= 2 ? 2 : 0]];
  let tot = 0; for (const o of opts) tot += o[1];
  let x = Math.random() * tot, ev = 'pop'; for (const o of opts) { x -= o[1]; if (x <= 0) { ev = o[0]; break; } }
  switch (ev) {
    case 'pop': {
      const n = 1 + (L >= 3 && Math.random() < 0.5 ? 1 : 0) + (L >= 6 && Math.random() < 0.5 ? 1 : 0);
      for (let k = 0; k < n; k++) popAhead();
      break;
    }
    case 'hole': holeEvent(); if (L >= 3 && Math.random() < 0.4) holeEvent(); break;
    case 'back': {
      const dir = OPP[P.face];
      if (!wallAt(P.c, P.r, dir) && inb(P.c + DX[dir], P.r + DY[dir])) { if (warnWall(P.c, P.r, dir)) say(T.back, true); } else popAhead();
      break;
    }
    case 'open': {
      for (let k = 0; k < 20; k++) {
        const c = clamp(P.c + ri(9) - 4, 0, cols - 1), r = clamp(P.r + ri(9) - 4, 0, rows - 1), d = pick([E, SO]);
        if (openWall(c, r, d)) { sfx.open(); break; }
      }
      break;
    }
    case 'shuffle': {
      const dp = bfs(P.c, P.r).d, n = 3 + Math.floor(L / 2);
      let rem = n; for (let k = 0; k < 80 && rem > 0; k++) { const c = ri(cols), r = ri(rows), d = pick([E, SO]); if (dp[idx(c, r)] >= 4 && openWall(c, r, d)) rem--; }
      let add = n; for (let k = 0; k < 80 && add > 0; k++) { const c = ri(cols), r = ri(rows), d = pick([E, SO]); if (dp[idx(c, r)] >= 4 && placeWall(c, r, d, true)) add--; }
      ensureConnected(null);
      sfx.open(); say(T.shuffle, true); banner('Struktur angepasst', 'Laufende Änderung am Versuchsaufbau.', TEAL, 1.3);
      break;
    }
    case 'slow': S.slowT = rnd(3, 4.5); S.turboT = 0; sfx.slow(); say(T.slow, true); banner('Zähe Flüssigkeit', 'Bewegung eingeschränkt.', ACC, 1.1); break;
    case 'turbo': S.turboT = rnd(3, 4.5); S.slowT = 0; sfx.turbo(); say(T.turbo, true); banner('Stimulans injiziert', '', ACC, 1.1); break;
    case 'dark': S.darkT = S.darkMax = rnd(4, 5.5); sfx.dark(); say(T.dark, true); banner('Stromausfall', '', TEAL, 1.1); break;
    case 'gas': if (!startGas()) popAhead(); break;
    case 'flicker': S.flickT = 1.8; say(T.flicker, true); sfx.dark(); break;
    case 'glitch': S.glitchT = rnd(3, 5); say(T.glitch, true); break;
    case 'ghost': spawnGhosts(); break;
    case 'cage': {
      const nb = DIRS.filter(d => !wallAt(P.c, P.r, d) && inb(P.c + DX[d], P.r + DY[d]));
      if (nb.length > 2) { const keep = nb.slice().sort(() => Math.random() - 0.5).slice(0, 2); for (const d of nb) if (!keep.includes(d)) warnWall(P.c, P.r, d); say(T.cage, true); } else popAhead();
      break;
    }
  }
  const base = Math.max(1.5, 2.7 - 0.2 * (L - 1)) / (1 + (MM() - 1) * 0.6) / (S.uplink ? 1.8 : 1);
  S.evT = base * rnd(0.6, 1.3) * (S.fails >= 3 ? 1.35 : 1);
  if (L >= 3 && Math.random() < 0.12) S.evT = 0.6;
}
