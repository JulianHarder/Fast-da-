'use strict';
/* Gamepad */

let padPrevStart = false, padPrevJam = false, padPrevA = false;
let padBroken = false;

function pollPad() {
  if (padBroken || typeof navigator.getGamepads !== 'function') { S.padDir = 0; S.padSprint = false; return; }
  let gp = null;
  try { const pads = navigator.getGamepads(); gp = pads ? Array.prototype.find.call(pads, x => x && x.connected) : null; } catch (e) { padBroken = true; }
  if (!gp) { S.padDir = 0; S.padSprint = false; return; }
  try { padBody(gp); } catch (e) { padBroken = true; S.padDir = 0; S.padSprint = false; }
}

function padBody(gp) {
  const bt = i => !!(gp.buttons[i] && gp.buttons[i].pressed), ax = gp.axes[0] || 0, ay = gp.axes[1] || 0;
  let d = 0;
  if (bt(12)) d = N; else if (bt(13)) d = SO; else if (bt(14)) d = WE; else if (bt(15)) d = E;
  else if (Math.max(Math.abs(ax), Math.abs(ay)) > 0.5) d = Math.abs(ax) > Math.abs(ay) ? (ax > 0 ? E : WE) : (ay > 0 ? SO : N);
  S.padDir = S.phase === 'play' ? d : 0;
  S.padSprint = bt(0) || bt(7) || bt(5);
  const jam = bt(2) || bt(1); if (jam && !padPrevJam && S.phase === 'play') useJammer(); padPrevJam = jam;
  const st = bt(9); if (st && !padPrevStart) { if (S.phase === 'play' || S.phase === 'reveal') pauseGame(); else if (S.phase === 'paused') resumeGame(); else if (S.phase === 'brief') beginSector(); } padPrevStart = st;
  const a = bt(0); if (a && !padPrevA && S.phase === 'menu' && !OVS.menu.classList.contains('hidden')) startGame(); if (a && !padPrevA && S.phase === 'brief') beginSector(); padPrevA = a;
}
