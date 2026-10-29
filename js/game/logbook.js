'use strict';
/* Logbuch-Eintraege und Fragmente */

const LOGS = [
  ['LOGBUCH 01 · V. HALDEN', ['Versuchsreihe 07 gestartet. Proband 07 betritt Sektor 1.', 'Zielvorgabe: drei Datenkerne sichern. Danach Übertragung.']],
  ['LOGBUCH 02', ['Die Übertragung dauert nur wenige Sekunden.', 'Bisher hat sie niemand bis zum Ende erlebt.']],
  ['LOGBUCH 03', ['Proband 07 sammelt Datenkerne. Das war nicht vorgesehen.', 'Das System reagiert. Es wirkt verärgert.']],
  ['LOGBUCH 04', ['Die Anomalie wurde nie von uns gebaut.', 'Sie war schon da, als wir die Wände errichteten.']],
  ['LOGBUCH 05', ['Proband 03 hat alle Kerne gesichert. Die Übertragung lief.', 'Proband 03 spricht nicht mehr. Er lächelt nur.']],
  ['LOGBUCH 06', ['Wir haben die Böden verstärkt. Die Risse kommen trotzdem.', 'Als wolle das Gebäude nachgeben.']],
  ['LOGBUCH 07', ['Der Lüftungsschacht atmet. Ich schwöre, er atmet.', 'Das Gas ist nur ein Leck. Hoffe ich.']],
  ['LOGBUCH 08', ['Die Laser waren zur Sicherheit gedacht.', 'Wessen Sicherheit, hat uns niemand gesagt.']],
  ['LOGBUCH 09', ['Mir fällt auf: der Versuchsleiter steht nicht im Dienstplan.', 'Ich bin der Versuchsleiter.']],
  ['LOGBUCH 10', ['Es heißt, nach der Übertragung öffnet sich etwas.', 'Ich habe nie gesehen, was.']],
  ['LOGBUCH 11', ['Ich habe die Tür hinter mir geschlossen.', 'Sie war nie offen.']],
  ['LOGBUCH 12', ['Proband 07 ist besser als alle anderen.', 'Das ist beunruhigend. Für uns beide.']],
  ['LOGBUCH 13', ['Das Licht flackert, wenn es mich ansieht.', 'Notiz an mich: nicht zurückblicken.']],
  ['LOGBUCH 14', ['Ich habe meinen Namen vergessen. Er steht im Protokoll.', 'Dort steht: Proband 01.']]
];

const FRAGS = [
  ['FRAGMENT', ['... der Ausgang ist dort, wo du nicht bist ...']],
  ['FRAGMENT', ['... sie zählen die Schritte. Alle Schritte ...']],
  ['FRAGMENT', ['... Kern 3 war nie im Plan. Wer hat ihn gelegt? ...']],
  ['FRAGMENT', ['... wenn das Licht ausgeht, hör auf deinen Puls ...']],
  ['FRAGMENT', ['... Proband 07, bitte nicht stehen bleiben ...']],
  ['FRAGMENT', ['... niemand hat je den echten Ausgang gesehen. Nur gespürt ...']]
];

function startLog() { const e = S.level - 1 < LOGS.length ? LOGS[S.level - 1] : pick(FRAGS); S.log = { head: e[0], lines: e[1], t: 0, dur: 9 }; }
