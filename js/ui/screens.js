'use strict';
/* Overlays: Menue, Bestenliste, Pause */

const OVS = { menu: $('ov-menu'), help: $('ov-help'), brief: $('ov-brief'), board: $('ov-board'), pause: $('ov-pause') };
const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
function show(name) { for (const k in OVS) OVS[k].classList.toggle('hidden', k !== name); }
function hideAll() { for (const k in OVS) OVS[k].classList.add('hidden'); }

function showMenu() {
  S.phase = 'menu'; $('hud').style.display = 'none'; $('pad').style.display = 'none'; show('menu');
  const top = getBoard()[0];
  let t = top ? `BESTWERT: ${String(top.score).padStart(6, '0')} PUNKTE · SEKTOR ${pad2(top.sector)} · ${top.name}` : 'KEINE DATEN VORHANDEN';
  if (S.lastScore) t += `\nLETZTER LAUF: ${String(S.lastScore).padStart(6, '0')}${S.lastRank ? ' · PLATZ ' + S.lastRank : ''}`;
  $('rec').textContent = t; $('rec').style.whiteSpace = 'pre-line';
  const esc = x => String(x).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])), tops = getBoard().slice(0, 3);
  $('top3').innerHTML = `<div class="g">${top ? 'Ziel: Platz 1 schlagen (' + String(top.score).padStart(6, '0') + ')' : 'Ziel: erster Eintrag in der Bestenliste'}</div>` +
    tops.map((e, i) => `<div class="t"><span>${String(i + 1).padStart(2, '0')}</span><span style="flex:1">${esc(e.name)}</span><span style="color:var(--ink)">${String(e.score).padStart(6, '0')}</span></div>`).join('');
}

let boardFrom = 'menu';

function showBoard(from) {
  boardFrom = from || 'menu';
  const list = getBoard(), el = $('boardList');
  let h = '<span class="h">#</span><span class="h">Proband</span><span class="h" style="text-align:right">Punkte</span><span class="h" style="text-align:right">Sektor</span>';
  for (let i = 0; i < 10; i++) {
    const e = list[i], me = e && e.date === S.lastDate ? ' me' : '';
    const esc = x => String(x).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    h += `<span class="rk${me}">${String(i + 1).padStart(2, '0')}</span><span class="${me}">${e ? esc(e.name) + (e.safe ? ' ·S' : '') : '· · · · ·'}</span><span class="sc${me}">${e ? String(e.score).padStart(6, '0') : '------'}</span><span class="sec${me}">${e ? pad2(e.sector) : '--'}</span>`;
  }
  const t1 = list[0];
  el.innerHTML = h; $('boardRec').textContent = (t1 ? 'ZIEL: ' + String(t1.score).padStart(6, '0') + ' PUNKTE ÜBERBIETEN.  ' : 'ZIEL: ERSTER EINTRAG.  ') + 'Läufe werden automatisch gespeichert (nur in diesem Browser). ·S = mit Safe Space.';
  show('board');
}

function fillPauseStats() {
  const rk = liveRank(), rows2 = [['Punkte', Math.floor(S.score)], ['Platz (live)', rk > 10 ? '> 10' : rk], ['Nächstes Ziel', (() => { const l = lbInfo(); return l.next ? '+' + (l.next.score - l.sc + 1) + ' Punkte' : (l.any ? 'Platz 1 gehalten' : 'erster Eintrag'); })()], ['Sektor', pad2(S.level)], ['Datenkerne', `${S.coreN}/${S.cores.length}`], ['Sektoren geschafft', S.cleared], ['Verluste', S.deaths], ['Dauer', fmtTime(S.time)]];
  $('pauseStats').innerHTML = rows2.map(r => `<span>${r[0]}</span><span>${r[1]}</span>`).join('');
}
