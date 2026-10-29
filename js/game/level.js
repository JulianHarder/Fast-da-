'use strict';
/* Level-Aufbau pro Sektor */

const BEH = ['drift', 'flee', 'slam', 'vanish'];

function newLevel(why) {
  const L = S.level;
  let a = 14, b = Math.round(a * 0.62);
  if (VH > VW) { cols = b; rows = a; } else { cols = a; rows = b; }
  generate(); layout();
  const corners = [[0, 0], [cols - 1, 0], [0, rows - 1], [cols - 1, rows - 1]], cn = SAFE ? [0, 0] : pick(corners);
  P.c = P.fc = cn[0]; P.r = P.fr = cn[1]; P.t = 1; P.expr = 'idle'; P.face = cn[0] === 0 ? E : WE;
  const dp = bfs(P.c, P.r).d; let mx = 0; for (const v of dp) if (v > mx) mx = v;
  const far = []; for (let i = 0; i < dp.length; i++) if (dp[i] >= mx * 0.8) far.push(i);
  const gi = pick(far); G.c = gi % cols; G.r = (gi / cols) | 0; G.vis = false; G.rev = false; G.ok = false;
  const k = Math.min(3, 1 + Math.floor((L - 1) / 2)), pool = BEH.slice(), sel = [];
  while (sel.length < k) sel.push(pool.splice(ri(pool.length), 1)[0]);
  S.B = {}; sel.forEach(x => S.B[x] = true);
  S.d0 = Math.max(1, dp[gi]); S.dist = dp[gi]; S.lastDist = S.dist;
  S.anims = []; S.parts = []; S.decoy = null; S.darkT = 0; S.vanishT = 0; S.cdSlam = 0; S.cdFlee = 0;
  S.startC = P.c; S.startR = P.r; S.holes = new Map(); S.doors = new Map(); S.portals = []; S.chasers = [];
  S.slowT = 0; S.turboT = 0; S.inv = 0; S.portalCd = 0; S.tickLast = 99;
  S.chaserT = Math.max(2.5, 5 - 0.25 * L) * [1, 0.7, 0.5][MODE];
  S.levelMax = Math.max(45, 80 - 3 * (L - 1)) * [1, 0.85, 0.7][MODE]; S.levelT = S.levelMax;
  S.pal = (L - 1) % 12; floorCache = null;
  S.gas = new Map(); S.gasMode = 'off'; S.gasCd = rnd(6, 10) / MM(); S.gasExp = 0; S.ghosts = []; S.glitchT = 0; S.flickT = 0; S.nearDist = 99; S.pulse = 0;
  S.cores = []; S.uplink = null; S.sectorDone = false; S.door = null; S.doorOpen = false; S.doorD0 = 1; S.plan = planChasers(L); S.inSafe = false; S.safeDist = 0; S.safeArrow = '';
  makeDoors(); makeLasers(); makePortals(); placeExit(); placeCores(); placeItems();
  S.coreN = 0; S.jam = null; S.stam = 1; S.stamLock = false; S.lightBoost = 0; S.popups = []; S.noises = []; S.lockMsgCd = 0;
  S.wwarn = []; S.buf = null; S.coreFx = []; S.flyers = []; S.spawnPlan = null; S.mapT = 0; S.mapCd = 0; if (why !== 'time') { S.sectDeaths = 0; S.fails = 0; S.easeGiven = false; S.secNear = 0; } S.secStart = S.time; S.evT = L > 1 ? rnd(4, 5) : rnd(2.2, 3.2); S.chaserT = Math.max(S.chaserT, L > 1 ? 4 : 0); S.held = []; S.touchDir = 0; S.phase = 'play'; S.banner = null;
  updateCoreHint(); updateSafeHint();
  if (why === 'time') { banner('Sektor ' + pad2(L) + ' neu gestartet', 'Zeit abgelaufen. Neues Labyrinth, gleiche Aufgabe.', RED, 3.2, true, 4, true); say(T.time, true); sfx.level(); }
  else { S.phase = 'brief'; showBrief(); if (L > 1) sfx.level(); }
}
