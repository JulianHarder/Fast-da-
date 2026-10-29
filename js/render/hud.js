'use strict';
/* Zeichnen: HUD, Zeitrahmen, Meldungsleiste */

function timeShown() { return S.glitchT > 0 && S.phase === 'play' && Math.sin(S.T * 9) > 0.2 ? ((Math.floor(S.T * 8) * 7) % 9) + 1 : Math.max(0, Math.ceil(S.levelT)); }

function drawTimerFrame() {
  if (S.phase !== 'play' && S.phase !== 'reveal') return;
  const w = cols * cs, h = rows * cs, m = Math.max(5, Math.min(9, cs * 0.16)), y0 = oy - m * 1.4, frac = clamp(S.levelT / S.levelMax, 0, 1);
  const safe = S.inSafe, low = S.levelT < 10 && !safe, col = safe ? '127,227,192' : (frac > 0.4 ? '111,211,192' : (frac > 0.15 ? '242,193,78' : '224,88,76'));
  const pulse = low && !reduced ? 0.65 + 0.35 * Math.sin(S.T * 14) : 1;
  // große Zahl, in die Oberkante des Labyrinths eingelassen
  const fs2 = TIMER_H - 10, txt = pad2(timeShown()) + ' s', cx = ox + w / 2;
  g.save(); g.font = `700 ${fs2}px ${MONO}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  const tw = g.measureText(txt).width + 22, th = TIMER_H, yc = oy - 3 - th / 2;
  g.fillStyle = 'rgba(8,10,11,.96)'; g.fillRect(cx - tw / 2, yc - th / 2, tw, th);
  g.strokeStyle = `rgba(${col},${0.85 * pulse})`; g.lineWidth = 2; g.strokeRect(cx - tw / 2 + 0.5, yc - th / 2 + 0.5, tw - 1, th - 1);
  g.fillStyle = low ? (Math.sin(S.T * 14) > 0 ? '#ff6a5c' : '#f2f2f2') : `rgb(${col})`; g.fillText(txt, cx, yc + 1); g.restore();
}

function drawHud() {
  const narrow = VW < 760, fs = clamp(VW / 64, 11, 14), live = S.phase === 'play' || S.phase === 'reveal' || S.phase === 'brief';
  g.fillStyle = 'rgba(5,6,7,.86)'; g.fillRect(0, 0, VW, HUD_T - 6); g.fillStyle = '#23292d'; g.fillRect(0, HUD_T - 7, VW, 1);
  g.textBaseline = 'alphabetic'; g.textAlign = 'left'; g.font = `${fs}px ${MONO}`; ls('1px'); g.fillStyle = '#aab3b7';
  const sc = String(Math.floor(S.score)).padStart(6, '0'), nc = S.cores.length;
  // Zeile 1: Stand, neueste Punkte, Timer
  const lt = narrow ? `S${pad2(S.level)}  ${sc}  VL ${S.deaths}` : `SEKTOR ${pad2(S.level)}   PUNKTE ${sc}   VERLUSTE ${pad2(S.deaths)}   KERNE ${S.coreN}/${nc}`;
  g.fillText(lt, 14, 20); const lw = g.measureText(lt).width;
  const pu = S.popups[S.popups.length - 1];
  if (pu && 14 + lw + 40 < VW - 290) { const k = pu.t / 1.6; g.globalAlpha = clamp(1 - k * k, 0, 1); g.fillStyle = pu.col; g.font = `600 ${fs}px ${MONO}`; g.fillText(pu.text, 14 + lw + 26, 20); g.globalAlpha = 1; g.font = `${fs}px ${MONO}`; }
  const low = S.levelT < 10 && S.phase === 'play';
  g.textAlign = 'right'; g.font = `600 ${fs + 3 + (VW > 1500 ? 6 : 0)}px ${MONO}`;
  g.fillStyle = S.inSafe ? '#7fe3c0' : (low ? (Math.sin(S.T * 14) > 0 ? '#e0584c' : '#d5d9db') : '#aab3b7');
  const tshow = S.glitchT > 0 && S.phase === 'play' && Math.sin(S.T * 9) > 0.2 ? ((Math.floor(S.T * 8) * 7) % 9) + 1 : Math.max(0, Math.ceil(S.levelT));
  g.fillText(`${narrow ? '' : (S.inSafe ? 'ANGEHALTEN ' : 'KOLLAPS ')}${pad2(tshow)} s`, VW - 134, 20);
  // Zeile 2: Datenkerne, Fortschritt, Hinweis
  const ix = 14, iy = 42;
  for (let k = 0; k < nc; k++) {
    const hx = ix + k * 24 + 9, got = k < S.coreN;
    g.beginPath(); for (let q = 0; q < 6; q++) { const t = q * Math.PI / 3; g.lineTo(hx + Math.cos(t) * 9, iy + Math.sin(t) * 9); } g.closePath();
    if (got) { g.fillStyle = '#7fe3ff'; g.fill(); } else { g.strokeStyle = '#4b585f'; g.lineWidth = 1.5; g.stroke(); }
  }
  const bx = ix + nc * 24 + 10, bw = Math.max(80, Math.min(240, VW - 330)), by = 40;
  let pct = 0, label = '', fill = '#7fb6b0';
  const shown = S.glitchT > 0 ? (Math.floor(S.T * 6) % 9) + 1 : S.coreDist;
  if (S.sectorDone) { pct = 1; fill = '#6ee7a0'; label = 'SEKTOR ABGESCHLOSSEN'; }
  else if (S.doorOpen) { pct = clamp(1 - S.coreDist / S.doorD0, 0, 1); fill = '#fff1c9'; label = narrow ? `TÜR ~${shown} ${S.coreArrow}` : `TÜR OFFEN  ·  ZUR TÜR ~${shown} SCHRITTE ${S.coreArrow}`; }
  else if (S.uplink) { pct = S.uplink.t / S.uplink.dur; fill = '#7fe3ff'; label = `ÜBERTRAGUNG ${Math.max(0, Math.ceil(S.uplink.dur - S.uplink.t))} s  ·  ÜBERLEBEN`; }
  else { pct = nc ? S.coreN / nc : 0; label = narrow ? `NÄCHSTER KERN ~${shown} ${S.coreArrow}` : `ZIEL: ${nc} DATENKERNE SICHERN  ·  NÄCHSTER ~${shown} SCHRITTE ${S.coreArrow}`; }
  g.fillStyle = '#171b1e'; g.fillRect(bx, by, bw, 4); g.fillStyle = fill; g.fillRect(bx, by, bw * pct, 4);
  g.textAlign = 'left'; g.font = `${fs - 1}px ${MONO}`; g.fillStyle = S.uplink ? '#9fe8ff' : '#7d898f'; g.fillText(label, bx + bw + 12, by + 5);
  // Zeile 3: Werkzeuge links, Bestenliste rechts
  if (live) {
    g.font = `${fs}px ${MONO}`; g.textAlign = 'left'; let x = 14; const ry = 68;
    g.fillStyle = S.stamLock ? '#a8504a' : '#7d898f'; g.fillText('SPRINT', x, ry); x += 62;
    g.fillStyle = '#171b1e'; g.fillRect(x, ry - 8, 90, 6); g.fillStyle = S.stamLock ? '#a8504a' : '#d9a441'; g.fillRect(x, ry - 8, 90 * S.stam, 6); x += 108;
    const jt = `STÖRSENDER ${S.jammers}${S.jam ? ' · AKTIV ' + Math.ceil(S.jam.t) + 's' : ''}`;
    g.fillStyle = S.jammers > 0 || S.jam ? '#7fb6b0' : '#586166'; g.fillText(jt, x, ry); x += g.measureText(jt).width + 18;
    if (S.lightBoost > 0) { g.fillStyle = '#f2c14e'; g.fillText(`LICHT + ${Math.ceil(S.lightBoost)}s`, x, ry); x += 110; }
    const lb = lbInfo(); let tx;
    if (lb.rank === 1) tx = lb.any ? 'PLATZ 1  ·  SIE FÜHREN' : 'PLATZ 1  ·  ERSTER EINTRAG';
    else tx = `PLATZ ${lb.rank > 10 ? '>10' : lb.rank}  ·  NÄCHSTER: ${lb.next.name.slice(0, 10)} +${lb.next.score - lb.sc + 1}`;
    g.textAlign = 'right'; g.fillStyle = lb.rank === 1 ? '#f2c14e' : '#d9a441'; g.fillText(tx, VW - 14, ry);
  }
  // ---- Meldungsleiste unter dem Spielfeld ----
  const b = S.banner, bigStrip = HUD_B >= 100;
  if (b && b.mid && S.phase !== 'brief') {
    const k = b.t / b.dur, a = k < 0.1 ? k / 0.1 : (k > 0.78 ? (1 - k) / 0.22 : 1), size = clamp(VW / 17, 18, 52), cy = VH * 0.44, bh = size * (b.sub ? 2.8 : 2.0);
    g.save(); g.globalAlpha = clamp(a, 0, 1);
    g.fillStyle = 'rgba(4,5,6,.8)'; g.fillRect(0, cy - bh / 2, VW, bh); g.fillStyle = b.col; g.fillRect(0, cy - bh / 2, VW, 2); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(0, cy + bh / 2 - 1, VW, 1);
    g.textAlign = 'center'; g.font = `600 ${size}px ${SANS}`; ls(`${Math.round(size * 0.16)}px`); g.fillStyle = b.col;
    g.fillText(b.text.toUpperCase(), VW / 2 + size * 0.08, cy + (b.sub ? -size * 0.1 : size * 0.33));
    if (b.sub) { g.font = `${Math.max(12, size * 0.34)}px ${MONO}`; ls('1px'); g.fillStyle = '#aab3b7'; g.fillText(b.sub, VW / 2, cy + size * 0.82); }
    g.restore();
  }
  if (b && !b.mid && bigStrip && S.phase !== 'brief') {
    const k = b.t / b.dur, a = k < 0.1 ? k / 0.1 : (k > 0.8 ? (1 - k) / 0.2 : 1), w = Math.min(660, VW - 28), x0 = (VW - w) / 2, y0 = VH - HUD_B + 2, h = 52;
    g.save(); g.globalAlpha = clamp(a, 0, 1);
    g.fillStyle = 'rgba(8,9,10,.92)'; g.fillRect(x0, y0, w, h); g.fillStyle = b.col; g.fillRect(x0, y0, 4, h); g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(x0, y0 + h - 1, w, 1);
    g.textAlign = 'left'; const ts = clamp(VW / 52, 15, 21); g.font = `600 ${ts}px ${SANS}`; ls(`${Math.round(ts * 0.14)}px`); g.fillStyle = b.col;
    g.fillText(b.text.toUpperCase(), x0 + 18, y0 + (b.sub ? 22 : 32));
    if (b.sub) { g.font = `${Math.max(12, fs)}px ${MONO}`; ls('0.5px'); g.fillStyle = '#aab3b7'; g.fillText(b.sub, x0 + 18, y0 + 42); }
    g.restore();
  }
  // Statuszeile (Störungen, Safe Space)
  const chips = [];
  if (S.phase === 'play') {
    if (S.inSafe) chips.push(['SAFE SPACE · ZEIT ANGEHALTEN', '#7fe3c0']);
    else if (SAFE) chips.push([`SAFE SPACE ${S.safeArrow} ~${S.safeDist} SCHRITTE`, '#5fb8a0']);
    { const m = mult(); if (m > 1) chips.push([`SERIE ×${m.toFixed(2).replace(/0$/, '')} · ${S.streak} SEKTOREN`, '#f2c14e']); }
    chips.push(S.mapCd > 0 ? [`KARTE ${Math.ceil(S.mapCd)} s`, '#6f7a7f'] : ['KARTE [M] BEREIT', '#7fe3ff']);
    if (S.slowT > 0) chips.push(['ZÄHE FLÜSSIGKEIT', '#c7a05a']);
    if (S.turboT > 0) chips.push(['STIMULANS AKTIV', '#c7a05a']);
    if (S.darkT > 0) chips.push(['STROMAUSFALL', '#8c979c']);
    if (S.gasExp > 0.05) chips.push([`KONTAMINATION ${Math.min(100, Math.round(S.gasExp / 1.9 * 100))}%`, '#c9d96a']);
  }
  if (chips.length) {
    g.font = `600 ${fs - 1}px ${MONO}`; ls('1px'); g.textAlign = 'left';
    const ws = chips.map(c => g.measureText(c[0]).width + 20), tot = ws.reduce((x, y) => x + y + 8, -8);
    let cx = Math.max(10, (VW - tot) / 2); const cy = VH - 44;
    chips.forEach((c, i) => { g.fillStyle = 'rgba(10,12,13,.92)'; g.fillRect(cx, cy, ws[i], 18); g.fillStyle = c[1]; g.fillRect(cx, cy, 3, 18); g.fillText(c[0], cx + 11, cy + 13); cx += ws[i] + 8; });
  }
  // Systemmeldung (bei kleinem Streifen auch die Banner-Zeile)
  let msg = S.taunt, ma = S.tauntT > 0 ? Math.min(1, S.tauntT / 0.8) * 0.5 + 0.5 : 0.35;
  if (b && !b.mid && !bigStrip && S.phase !== 'brief') { msg = b.text.toUpperCase() + (b.sub ? ' · ' + b.sub : ''); ma = 1; }
  if (msg && S.phase !== 'brief') {
    g.globalAlpha = ma; g.textAlign = 'center'; g.font = `${fs + 2}px ${MONO}`; ls('1px'); g.fillStyle = '#b9c2c6';
    g.fillText('> ' + msg, VW / 2, VH - 9); g.globalAlpha = 1;
  }
  ls('0px');
  if (S.phase === 'paused') { g.fillStyle = 'rgba(3,4,5,.55)'; g.fillRect(0, 0, VW, VH); }
}
