'use strict';
/* Punkte und Bestenliste */

const mult = () => 1 + 0.25 * Math.min(S.streak, 6);

function addScore(n, text, col, raw) {
  const m = raw ? 1 : mult(); n = Math.round(n * m); S.score += n;
  if (text && m > 1) text += ' ×' + m.toFixed(2).replace(/0$/, '');
  if (text) { const pp = playerPos(); S.popups.push({ text, x: pp.x + 0.5, y: pp.y + 0.2, t: 0, col: col || '#d9a441' }); if (S.popups.length > 6) S.popups.shift(); }
}

function getName() { return ($('pname').value.trim().slice(0, 12)) || 'Proband'; }
function getBoard() { const a = lsGet('board', []); return Array.isArray(a) ? a : []; }

function submitRun() {
  const sc = Math.floor(S.score); if (sc <= 0 || !S.runId) return null;
  let list = getBoard();
  const data = { id: S.runId, safe: SAFE, name: getName(), score: sc, sector: S.level, cleared: S.cleared, time: Math.floor(S.time), date: S.runId };
  const ex = list.find(e => e.id === S.runId);
  if (ex) Object.assign(ex, data); else list.push(data);
  list.sort((a, b) => b.score - a.score || a.date - b.date); list = list.slice(0, 10); lsSet('board', list);
  const i = list.findIndex(e => e.id === S.runId);
  S.lastRank = i >= 0 ? i + 1 : null; S.lastScore = sc; S.lastDate = S.runId;
  return S.lastRank;
}

function refreshLb() { S.lbOthers = getBoard().filter(e => e.id !== S.runId); }

function lbInfo() {
  const sc = Math.floor(S.score), oth = S.lbOthers || []; let rank = 1, next = null;
  for (const e of oth) if (e.score > sc) { rank++; if (!next || e.score < next.score) next = e; }
  return { rank, next, sc, any: oth.length > 0 };
}

function checkRank() {
  const sc = Math.floor(S.score); let best = null;
  for (const e of S.lbOthers || []) { const k = e.id || e.date; if (e.score < sc && !S.passed.has(k)) { S.passed.add(k); if (!best || e.score > best.score) best = e; } }
  if (!best) return;
  const lb = lbInfo();
  if (lb.rank === 1) { banner('Neuer Bestwert', 'Sie führen die Bestenliste an.', '#f2c14e', 2.8, true, 3); say(T.rank1, true); }
  else { banner('Platz ' + lb.rank, 'Überholt: ' + best.name + ' (' + best.score + ')', '#f2c14e', 2.4, false, 3); say(T.rankup, true); }
  sfx.rank();
}

function liveRank() { let r = 1; const sc = Math.floor(S.score); for (const e of getBoard()) if (e.score > sc) r++; return r; }
