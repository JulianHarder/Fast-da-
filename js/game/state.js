'use strict';
/* Spielzustand: Spieler P, Ziel G und globaler Zustand S */

const P = { c: 0, r: 0, fc: 0, fr: 0, t: 1, step: 0.1, face: E, expr: 'idle', exprT: 0 };
const G = { c: 0, r: 0, vis: true, rev: false };

const S = {
  phase: 'menu', prev: 'play', level: 1, pops: 0, steps: 0, time: 0, flash: 0, evT: 5,
  darkT: 0, vanishT: 0, revT: 0, cdSlam: 0, cdFlee: 0, d0: 1, dist: 99, lastDist: 99,
  banner: null, taunt: '', tauntT: 0, idleT: 0, nearT: 0, held: [], touchDir: 0, B: {}, decoy: null,
  anims: [], parts: [], rage: 0, T: 0,
  wwarn: [], buf: null, streak: 0, sectDeaths: 0, fails: 0, easeGiven: false, secNear: 0, secStart: 0, lastStats: null, coreFx: [], flyers: [], spawnPlan: null, mapT: 0, mapCd: 0, holes: new Map(), doors: new Map(), portals: [], chasers: [], chaserT: 6, inv: 0, deaths: 0, timeouts: 0,
  slowT: 0, turboT: 0, cornerCd: 0, exitT: 0, levelT: 80,
  gas: new Map(), gasMode: 'off', gasCd: 8, gasExp: 0, gasFront: [], gasSeen: new Set(), gasOrder: [], gasT: 0, gasSpT: 0, gasCap: 20, gasFadeI: 0, gasFadeT: 0,
  lasers: [], ghosts: [], glitchT: 0, flickT: 0, beatT: 0, pulse: 0, nearDist: 99,
  score: 0, cleared: 0, cores: [], coreN: 0, locked: true, realExit: false, items: [], jammers: 1, jam: null,
  stam: 1, stamLock: false, sprintKey: false, touchSprint: false, padDir: 0, padSprint: false, sprinting: false, sprintDelay: 0, lightBoost: 0,
  respawnT: 9, fade: 0, fallFx: null, inSafe: false, safeDist: 0, safeArrow: '', plan: [], runId: 0, passed: new Set(), lbOthers: [], saveT: 0, lbT: 0, uplink: null, sectorDone: false, coreDist: 99, coreArrow: '', popups: [], noises: [], noiseId: 0, noiseCd: 0, log: null, nearMissCd: 0, submitted: false, lastRank: null, lastScore: 0, voiceT: 30, lockMsgCd: 0, levelMax: 80, startC: 0, startR: 0, portalCd: 0, tickLast: 99
};
