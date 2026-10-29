'use strict';
/* Einsatzbesprechung vor jedem Sektor */

// Karten gruppiert nach Gegner, Hilfen und Gefahren. Details stehen im Tooltip und klappen per Klick auf.
function briefGroups() {
  const L = S.level, cnt = {};
  for (const k of S.plan) cnt[k] = (cnt[k] || 0) + 1;
  const card = (icon, label, col, o = {}) => ({ icon, label, col, count: o.count, value: o.value, tip: o.tip, isNew: !!o.isNew });
  const enemies = [], hazards = [], helps = [];
  if (cnt.hunter) enemies.push(card('hunter', 'Jäger', '#c4453d', { count: cnt.hunter, value: `ab ${Math.round(S.chaserT)} s`, tip: `Rote Augen: verfolgen Sie, erscheinen nach ca. ${Math.round(S.chaserT)} s.` }));
  if (cnt.lurker) enemies.push(card('lurker', 'Lauerer', '#7fb0ff', { count: cnt.lurker, tip: 'Blaue Augen: stehen reglos, stürmen bei Nähe los.', isNew: L === 2 }));
  if (cnt.blind) enemies.push(card('blind', 'Blinder', '#aab3b7', { count: cnt.blind, value: 'hört nur', tip: 'Blinder Jäger: hört nur Lärm. Sprint und Umbauten locken ihn.', isNew: L === 3 }));
  if (cnt.splitter) enemies.push(card('splitter', 'Teiler', '#b3342f', { count: cnt.splitter, tip: 'Spaltet kleine, schnelle Fragmente ab.', isNew: L === 5 }));

  hazards.push(card('doors', 'Schleusen', '#b8891a', { count: S.doors.size, tip: 'Gelb-schwarze Tore, öffnen und schließen im Takt.' }));
  hazards.push(card('laser', 'Laser', '#e0584c', { count: S.lasers.length, tip: 'Rote Sperren: nicht durchqueren, solange sie hell feuern.' }));
  hazards.push(card('holes', 'Einbrüche', '#9a9488', { value: `bis ${6 + L + MODE * 4}`, tip: `Helle Risse, dann fehlt der Boden. Bis zu ${6 + L + MODE * 4} gleichzeitig.` }));
  const every = (Math.max(0.9, 2.7 - 0.2 * (L - 1)) / MM()).toFixed(1).replace('.', ',');
  hazards.push(card('walls', 'Wände', '#7fb6b0', { value: `alle ${every} s`, tip: `Plötzliche Wände: etwa alle ${every} s ein Ereignis.` }));
  if (L >= 2) hazards.push(card('gas', 'Gas', '#b5c95a', { tip: 'Kontamination: gelbgrüner Nebel breitet sich aus, nicht darin stehen.', isNew: L === 2 }));
  if (S.portals.length) hazards.push(card('portal', 'Portale', '#d5d9db', { count: S.portals.length / 2, value: 'Paare', tip: 'Weiße Ringe mit gleichem Buchstaben sind verbunden.', isNew: L === 2 }));
  const st = ['zähe Flüssigkeit'];
  if (L >= 2) st.push('Stimulans', 'Lichtflackern', 'falsche Anzeigen', 'Halluzinationen');
  if (L >= 3) st.push('Stromausfall', 'Sperr-Falle');
  hazards.push(card('glitch', 'Störungen', '#c7a05a', { value: st.length === 1 ? '1 Art' : `${st.length} Arten`, tip: 'Störungen: ' + st.join(', ') + '.', isNew: L === 2 || L === 3 }));
  hazards.push(card('clock', 'Zeit', '#8c979c', { value: `${Math.round(S.levelMax)} s`, tip: `Kollaps nach ${Math.round(S.levelMax)} s. Dann wird der Sektor neu aufgebaut.` }));

  const nb = S.items.filter(i => i.type === 'battery').length, nj = S.items.filter(i => i.type === 'jammer').length;
  helps.push(card('battery', 'Batterie', '#f2c14e', { count: nb, value: '+8 s', tip: 'Batterie: +8 s Zeit und mehr Licht.' }));
  helps.push(card('jammer', 'Störsender', '#7fb6b0', { count: nj, value: isTouch ? 'Knopf rechts' : 'Taste E', tip: 'Aktivieren: Taste E oder Q, am Handy der Knopf STÖRSENDER, am Gamepad X oder B. Lenkt Anomalien 7 s lang ab.' }));
  if (SAFE) helps.push(card('safe', 'Safe Space', '#5fb8a0', { value: 'Zeit steht', tip: 'Links oben (türkis): dort steht die Zeit still.' }));

  return [['Gegner', enemies, ''], ['Hilfen', helps, ''], ['Gefahren', hazards, 'full']];
}

function showBrief() {
  const L = S.level, esc = x => String(x).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  S.banner = null; S.held = []; S.touchDir = 0; S.sprintKey = false; S.touchSprint = false;
  $('brTitle').textContent = 'Sektor ' + pad2(L) + ' · ' + sectName(L);

  // Ablauf in vier Schritten
  const step = (icon, big, small, tip) => `<div class="step" title="${esc(tip)}">${BR_ICONS[icon]}<b>${esc(big)}</b><span>${esc(small)}</span></div>`;
  $('brGoal').innerHTML = [
    step('core', S.cores.length, 'Datenkerne', 'Sichern Sie alle leuchtenden Datenkerne.'),
    step('uplink', [8, 10, 12][MODE] + ' s', 'Übertragung', 'Mit dem letzten Kern startet die Übertragung: so lange überleben.'),
    step('exit', 'Tür', 'erreichen', 'Danach öffnet sich eine leuchtende Tür in der Außenwand. Hinlaufen.'),
    step('next', 'Weiter', 'Sektor ' + pad2(L + 1), 'Der nächste Sektor beginnt. Punkte zählen für die Bestenliste.'),
  ].join('<i class="flowarrow">›</i>');

  // Auswertung des letzten Sektors als Kurzwerte
  { const st = S.lastStats, el = $('brStats');
    if (st && L > 1 && st.level === L - 1) {
      const chip = (k, v, col) => `<span class="chip"><i>${k}</i><b${col ? ` style="color:${col}"` : ''}>${v}</b></span>`;
      el.style.display = '';
      el.innerHTML = `<span class="hd">Sektor ${pad2(st.level)} · ${esc(st.name)}</span>` +
        chip('Rang', st.rank, '#f2c14e') + chip('Zeit', fmtTime(st.time)) + chip('Beinahe', st.near) + chip('Verluste', st.deaths) +
        chip('Bonus', '+' + st.bonus + (st.mult > 1 ? ' ×' + st.mult.toFixed(2).replace(/0$/, '') : ''), '#6ee7a0');
    } else el.style.display = 'none'; }

  $('brList').innerHTML = briefGroups().map(([title, cards, cls]) =>
    `<section class="brgroup ${cls}"><h3>${title}</h3><div class="brcards">` + cards.map(c =>
      `<div class="card" style="--c:${c.col}" title="${esc(c.tip || '')}">` +
      (c.isNew ? '<em class="new">NEU</em>' : '') + (c.count != null ? `<span class="n">×${c.count}</span>` : '') +
      `${BR_ICONS[c.icon]}<b>${esc(c.label)}</b>` + (c.value ? `<span class="v">${esc(c.value)}</span>` : '') +
      `<span class="d">${esc(c.tip || '')}</span></div>`).join('') + '</div></section>').join('');

  const lg = L - 1 < LOGS.length ? LOGS[L - 1] : pick(FRAGS);
  $('brLog').innerHTML = `<div style="color:var(--acc);letter-spacing:.12em;margin-bottom:3px">${esc(lg[0])}</div>${lg[1].map(esc).join('<br>')}`;
  $('hud').style.display = 'flex';
  show('brief');
}

$('brList').addEventListener('click', e => { const c = e.target.closest('.card'); if (c) c.classList.toggle('open'); });

function beginSector() {
  if (S.phase !== 'brief') return;
  S.phase = 'play'; hideAll();
  banner('Sektor ' + pad2(S.level) + ' · ' + sectName(S.level), S.cores.length + ' Datenkerne sichern, danach Übertragung.', ACC, 2.4, false, 2);
  say(S.level === 1 ? 'Sichern Sie die 3 leuchtenden Datenkerne.' : 'Neuer Sektor. Gleiche Bedingungen.', true);
}
