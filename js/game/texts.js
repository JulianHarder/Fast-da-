'use strict';
/* Systemtexte, Meldungen (say) und Banner */

const T = {
  near: ['Ausgang in Reichweite.', 'Die Daten sehen vielversprechend aus.', 'Sie sind nah dran. Das ist statistisch irrelevant.'],
  slam: ['Strukturelle Anpassung durchgeführt.', 'Wand installiert.', 'Die Route wurde optimiert. Nicht für Sie.', 'Hindernis hinzugefügt.'],
  flee: ['Ausgang verlegt.', 'Der Ausgang ist vorübergehend nicht verfügbar.', 'Koordinaten des Ausgangs aktualisiert.'],
  vanish: ['Signal verloren.', 'Ausgang wird neu kalibriert.', 'Fehler 404: Ausgang nicht gefunden.'],
  fake: ['Falscher Ausgang. Kein Grund zur Sorge.', 'Das war eine Attrappe. Der Versuch läuft weiter.', 'Der echte Ausgang befindet sich in einem anderen Versuchsaufbau.', 'Ausgang nicht verifiziert.'],
  back: ['Rückweg versiegelt.', 'Rückzug nicht vorgesehen.'],
  dark: ['Stromausfall.', 'Beleuchtung deaktiviert.'],
  shuffle: ['Struktur wurde angepasst (v2.0.1).', 'Laufende Änderung am Versuchsaufbau.'],
  mirage: ['Halluzination.', 'Dort war nie ein Ausgang.'],
  idle: ['Der Versuch läuft.', 'Ihre Daten sind uns wichtig.', 'Notiz: Proband zeigt Anzeichen von Stress.', 'Bitte nicht aufgeben. Oder doch.'],
  bump: ['Kollision.', 'Wand.'],
  hole: ['Bodenintegrität kritisch.', 'Riss im Fundament erkannt.', 'Achtung: Einsturzgefahr.'],
  fall: ['Bodeneinsturz. Proband zurückgesetzt.', 'Sturz registriert.', 'Das war vorhersehbar.'],
  caught: ['Kontakt mit Anomalie. Proband zurückgesetzt.', 'Verlust registriert. Neustart.'],
  chaser: ['Anomalie freigesetzt.', 'Sie hat Sie bemerkt.', 'Bewegen Sie sich.'],
  portal: ['Transfer ausgeführt.', 'Partner-Pad erreicht.'],
  slow: ['Zähe Flüssigkeit am Boden.', 'Bewegung eingeschränkt.'],
  turbo: ['Stimulans injiziert.', 'Reaktionszeit erhöht. Kontrolle nicht.'],
  cage: ['Sperrmechanismus aktiviert.', 'Zwei Ausgänge bleiben offen.'],
  exit: ['Notausgang aktiviert.', 'Fluchtweg freigegeben.', 'Sicherheitssystem: Durchgang geöffnet.'],
  time: ['Zeit abgelaufen.', 'Sektor wird zurückgesetzt.'],
  gas: ['Kontamination erkannt.', 'Leck im Lüftungssystem.', 'Atemschutz wird empfohlen.'],
  gasdead: ['Kontamination. Proband zurückgesetzt.', 'Atemwege beeinträchtigt. Neustart.'],
  laserdead: ['Laser-Kontakt. Proband zurückgesetzt.', 'Die Sperre war aktiv.'],
  glitch: ['Anzeige gestört.', 'Messwerte nicht zuverlässig.'],
  ghost: ['Sensorfehler. Kontakt nicht bestätigt.', 'Bewegung erkannt. Vielleicht.'],
  flicker: ['Spannungsschwankung.', 'Stromversorgung instabil.'],
  locked: ['Ausgang gesperrt. Datenkerne unvollständig.', 'Zugriff verweigert.'],
  core: ['Datenkern gesichert.', 'Kern aufgenommen. Das System reagiert.'],
  unlock: ['Alle Datenkerne gesichert. Ausgang entsperrt.'],
  battery: ['Batterie aufgenommen.', 'Energie wiederhergestellt.'],
  jamget: ['Störsender aufgenommen.'],
  jam: ['Störsender aktiviert.', 'Ablenkung läuft.'],
  rank1: ['Neuer Bestwert. Das System ist beeindruckt.', 'Erster Platz. Das war nicht vorgesehen.'],
  rankup: ['Platz gutgemacht.', 'Ein Proband weniger vor Ihnen.', 'Rang verbessert.'],
  door: ['Tür entriegelt. Folgen Sie dem Licht.', 'Zugang freigegeben. Laufen Sie.', 'Die Tür öffnet sich. Nicht stehen bleiben.'],
  safe: ['Safe Space betreten. Zeit angehalten.', 'Atmen Sie durch. Hier passiert nichts.', 'Anomalien zurückgedrängt. Nehmen Sie sich Zeit.'],
  uplink: ['Übertragung läuft. Nicht sterben.', 'Datenübertragung aktiv. Bleiben Sie am Leben.', 'Das System wehrt sich. Halten Sie durch.'],
  real: ['Übertragung abgeschlossen. Unerwartet.', 'Sektor abgeschlossen. Das war nicht vorgesehen.']
};

function say(arr, force) { if (!force && S.tauntT > 2.2) return; S.taunt = typeof arr === 'string' ? arr : pick(arr); S.tauntT = 5; S.idleT = 0; }

function banner(text, sub, col, dur, big, prio, mid) {
  const pr = prio || 1;
  if (S.banner && (S.banner.prio || 1) > pr && S.banner.t < S.banner.dur * 0.85) return;
  S.banner = { text, sub, col: col || '#fff', t: 0, dur: dur || 1.6, big, prio: pr, mid: !!mid };
}
