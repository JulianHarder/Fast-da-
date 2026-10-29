'use strict';
/* Start: Initialisierung, Frame-Schleife, Fehleranzeige */

$('pname').value = lsGet('pname', '') || '';
$('pname').addEventListener('input', () => lsSet('pname', $('pname').value.trim().slice(0, 12)));
setSound(soundOn); setReduced(reduced); setMode(MODE); setSafe(SAFE);
resize(); showMenu();
let last = 0;

function frame(ts) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, Math.max(0, (ts - last) / 1000) || 0); last = ts;
  pollPad();
  try { update(dt); } catch (e) { reportErr(e); }
  try { draw(); } catch (e) { reportErr(e); }
}

let errCount = 0;

function reportErr(e) {
  if (errCount++ > 2) return;
  const el = $('err'); if (!el) return;
  el.textContent = 'Fehler im Spiel: ' + (e && e.message ? e.message : e); el.style.display = 'block';
  try { console.error(e); } catch (_) {}
}

addEventListener('error', e => reportErr(e.error || e.message));
requestAnimationFrame(frame);
