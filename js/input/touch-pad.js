'use strict';
/* Touch-Steuerkreuz und Aktionsknoepfe */

for (const b of document.querySelectorAll('#pad .dpad button')) {
  const d = +b.dataset.d;
  b.addEventListener('pointerdown', e => { e.preventDefault(); b.classList.add('on'); if (!S.held.includes(d)) S.held.push(d); if (S.phase === 'play' && P.t >= 1) tryMove(wantDir()); else bufDir(d); });
  const up = () => { b.classList.remove('on'); S.held = S.held.filter(x => x !== d); };
  b.addEventListener('pointerup', up); b.addEventListener('pointerleave', up); b.addEventListener('pointercancel', up);
  b.addEventListener('contextmenu', e => e.preventDefault());
}

{
  const bs = $('bSprint'), spUp = () => { S.touchSprint = false; bs.classList.remove('on'); };
  bs.addEventListener('pointerdown', e => { e.preventDefault(); S.touchSprint = true; bs.classList.add('on'); });
  bs.addEventListener('pointerup', spUp); bs.addEventListener('pointerleave', spUp); bs.addEventListener('pointercancel', spUp);
  $('bJam').addEventListener('pointerdown', e => { e.preventDefault(); useJammer(); });
  $('bMap').addEventListener('pointerdown', e => { e.preventDefault(); useMap(); });
}
