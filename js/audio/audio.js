'use strict';
/* WebAudio-Grundlagen: Kontext und Tongenerator */

let AC = null, soundOn = lsGet('sound', true);
function ac() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (AC && AC.state === 'suspended') AC.resume(); return AC; }

function tone(f1, f2, dur, type = 'square', vol = 0.05, delay = 0) {
  if (!soundOn) return; const a = ac(); if (!a) return;
  try {
    const o = a.createOscillator(), gn = a.createGain(), t0 = a.currentTime + delay;
    o.type = type; o.frequency.setValueAtTime(f1, t0);
    if (f2 !== f1) o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t0 + dur);
    gn.gain.setValueAtTime(vol, t0); gn.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(gn); gn.connect(a.destination); o.start(t0); o.stop(t0 + dur + 0.03);
  } catch (e) {}
}
