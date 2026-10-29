'use strict';
/* Einstellungen (Ton, Intensitaet, Effekte, Safe Space) */

function setSound(on) { soundOn = on; lsSet('sound', on); $('bSnd').classList.toggle('off', !on); $('bSnd2').textContent = 'Ton: ' + (on ? 'an' : 'aus'); }
function setMode(v) { MODE = v; lsSet('mode', v); $('bMad').textContent = 'Intensität: ' + ['Hoch', 'Extrem', 'Albtraum'][v]; }
let reduced = lsGet('reduced', false);
function setReduced(v) { reduced = v; lsSet('reduced', v); $('bFx').textContent = 'Effekte: ' + (v ? 'reduziert' : 'normal'); }
let MODE = lsGet('mode', 0); if (![0, 1, 2].includes(MODE)) MODE = 0;
const MM = () => [1, 1.5, 2.2][MODE];
let SAFE = lsGet('safe', false);
function setSafe(v) { SAFE = !!v; lsSet('safe', SAFE); $('bSafe').textContent = 'Safe Space: ' + (SAFE ? 'an' : 'aus'); }
