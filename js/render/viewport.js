'use strict';
/* Fenstergroesse, Zellgroesse und Layout */

let VW = 0, VH = 0, DPR = 1, cs = 40, ox = 0, oy = 0;
let TIMER_H = 30; const HUD_T = 84; let HUD_B = 100;

function layout() {
  const aw = VW - 20, ah0 = VH - HUD_T - HUD_B - 6;
  const cs0 = Math.max(14, Math.floor(Math.min(aw / cols, ah0 / rows)));
  TIMER_H = Math.round(clamp(cs0 * 0.5, 15, 30)) + 10; const pad = TIMER_H + 6, ah = ah0 - pad;
  cs = Math.max(14, Math.floor(Math.min(aw / cols, ah / rows))); floorCache = null;
  ox = Math.floor((VW - cs * cols) / 2);
  oy = Math.floor(HUD_T + pad + (ah + 6 - cs * rows) / 2);
}

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  VW = innerWidth; VH = innerHeight; HUD_B = VH >= 560 ? 100 : 44;
  cv.width = Math.round(VW * DPR); cv.height = Math.round(VH * DPR); grainCv = null;
  layout();
}

addEventListener('resize', resize);
