'use strict';
/* Spielablauf: Start, Pause, Fortsetzen, Bestwerte */

function bestInfo() { return lsGet('best', { level: 0, time: 0 }); }

function saveBest() {
  const b = bestInfo();
  const nb = { level: Math.max(b.level, S.level), time: Math.max(b.time, Math.floor(S.time)) };
  lsSet('best', nb);
}

function startGame() {
  ac(); sfx.click();
  Object.assign(S, { level: 1, pops: 0, steps: 0, time: 0, deaths: 0, timeouts: 0, flash: 0, rage: 0, taunt: '', tauntT: 0, banner: null, inv: 0,
    score: 0, cleared: 0, streak: 0, sectDeaths: 0, fails: 0, lastStats: null, jammers: 1, submitted: false, runId: Date.now(), passed: new Set(), saveT: 0, lbT: 0, popups: [], noises: [], log: null, sprintKey: false, touchSprint: false, lastRank: null });
  lsSet('pname', $('pname').value.trim().slice(0, 12)); refreshLb();
  hideAll(); $('hud').style.display = 'flex'; $('bPause').textContent = 'II'; $('pad').style.display = isTouch ? 'block' : 'none';
  newLevel();
}

function pauseGame() { if (S.phase === 'play' || S.phase === 'reveal') { submitRun(); refreshLb(); S.prev = S.phase; S.phase = 'paused'; S.held = []; S.touchDir = 0; S.sprintKey = false; S.touchSprint = false; fillPauseStats(); show('pause'); } }
function resumeGame() { if (S.phase === 'paused') { S.phase = S.prev; hideAll(); } }
