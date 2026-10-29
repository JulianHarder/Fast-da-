'use strict';
/* Kleine Hilfsfunktionen (Zufall, Mathe, Formatierung) */

const rnd = (a, b) => a + Math.random() * (b - a);
const ri = n => Math.floor(Math.random() * n);
const pick = a => a[ri(a.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pad2 = n => String(n).padStart(2, '0');
function hash(a, b, c) { let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967295; }
function fmtTime(t) { t = Math.floor(t); return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0'); }
function mixc(a, b, t) { return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`; }
