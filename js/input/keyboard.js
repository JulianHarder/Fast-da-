'use strict';
/* Tastatur und Fensterereignisse */

const KEYMAP = { ArrowUp: N, KeyW: N, ArrowRight: E, KeyD: E, ArrowDown: SO, KeyS: SO, ArrowLeft: WE, KeyA: WE };

addEventListener('keydown', e => {
  const d = KEYMAP[e.code];
  if (S.phase === 'brief') { if (e.code === 'Enter' || e.code === 'Space' || e.code === 'NumpadEnter') { e.preventDefault(); if (!e.repeat) beginSector(); } return; }
  if (S.phase === 'play' || S.phase === 'reveal') {
    if (d) { e.preventDefault(); if (!S.held.includes(d)) S.held.push(d); if (S.phase === 'play' && P.t >= 1) tryMove(wantDir()); else bufDir(d); }
    else if (e.code === 'Space' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') { e.preventDefault(); S.sprintKey = true; }
    else if (e.code === 'KeyE' || e.code === 'KeyQ') { e.preventDefault(); useJammer(); }
    else if (e.code === 'KeyM') { e.preventDefault(); useMap(); }
    else if (e.code === 'KeyP' || e.code === 'Escape') { e.preventDefault(); pauseGame(); }
    return;
  }
  if (S.phase === 'paused') { if (e.code === 'KeyP' || e.code === 'Escape' || e.code === 'Enter') { e.preventDefault(); resumeGame(); } return; }
  if (e.target.tagName === 'INPUT') { if (e.code === 'Enter' && S.phase === 'menu') { e.preventDefault(); e.target.blur(); startGame(); } return; }
  if (e.target.tagName === 'BUTTON') return;
  const helpOpen = !OVS.help.classList.contains('hidden'), boardOpen = !OVS.board.classList.contains('hidden');
  if (S.phase === 'menu' && boardOpen) { if (e.code === 'Escape' || e.code === 'Enter') { e.preventDefault(); showMenu(); } return; }
  if (S.phase === 'menu' && helpOpen) { if (e.code === 'Escape' || e.code === 'Enter') { e.preventDefault(); show('menu'); } }
  else if (S.phase === 'menu' && (e.code === 'Enter' || e.code === 'Space')) { e.preventDefault(); startGame(); }
});

addEventListener('keyup', e => { const d = KEYMAP[e.code]; if (d) S.held = S.held.filter(x => x !== d); if (e.code === 'Space' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') S.sprintKey = false; });
addEventListener('blur', () => { S.held = []; S.touchDir = 0; S.sprintKey = false; S.touchSprint = false; pauseGame(); });
addEventListener('pagehide', () => { if (S.phase === 'play' || S.phase === 'paused' || S.phase === 'reveal') submitRun(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseGame(); });
