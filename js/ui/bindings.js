'use strict';
/* Buttons mit Aktionen verbinden */

function bind(id, fn) { const b = $(id); b.addEventListener('click', () => { sfx.click(); fn(); b.blur(); }); }
bind('bStart', startGame);
bind('bHelp', () => show('help'));
bind('bHelpBack', () => show('menu'));
bind('bFx', () => setReduced(!reduced));
bind('bSnd2', () => setSound(!soundOn));
bind('bMad', () => setMode((MODE + 1) % 3));
bind('bSafe', () => setSafe(!SAFE));
bind('bGo', beginSector);
bind('bSnd', () => setSound(!soundOn));
bind('bPause', () => { if (S.phase === 'paused') resumeGame(); else pauseGame(); });
bind('bResume', resumeGame);
bind('bToMenu', () => { submitRun(); saveBest(); showMenu(); });
bind('bBoard', () => showBoard('menu'));
bind('bBoardBack', () => { if (boardFrom === 'pause') show('pause'); else showMenu(); });
bind('bPauseBoard', () => { submitRun(); refreshLb(); showBoard('pause'); });
for (const id of ['bPause', 'bSnd']) $(id).addEventListener('mousedown', e => e.preventDefault());
