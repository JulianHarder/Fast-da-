'use strict';
/* Wischen per Zeiger/Touch auf dem Canvas */

let touch = null;

cv.addEventListener('pointerdown', e => {
  e.preventDefault();
  if (S.phase !== 'play') return;
  touch = { id: e.pointerId, x: e.clientX, y: e.clientY };
  try { cv.setPointerCapture(e.pointerId); } catch (_) {}
});

cv.addEventListener('pointermove', e => {
  if (!touch || touch.id !== e.pointerId) return;
  const dx = e.clientX - touch.x, dy = e.clientY - touch.y, m = Math.max(Math.abs(dx), Math.abs(dy));
  if (m > 14) {
    S.touchDir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? E : WE) : (dy > 0 ? SO : N);
    if (m > 46) { touch.x = e.clientX; touch.y = e.clientY; }
  }
});

const tEnd = e => { if (touch && touch.id === e.pointerId) { touch = null; S.touchDir = 0; } };
cv.addEventListener('pointerup', tEnd); cv.addEventListener('pointercancel', tEnd);
cv.addEventListener('contextmenu', e => e.preventDefault());
