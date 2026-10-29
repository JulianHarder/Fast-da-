# FAST DA™ – Versuchsreihe 07

Labyrinth-Survival-Spiel im Browser (Canvas, reines HTML/CSS/JavaScript, keine Abhängigkeiten).

## Starten

`index.html` per Doppelklick im Browser öffnen. Ein Server wird nicht gebraucht.

## Aufbau

```
index.html          Markup (Overlays, Canvas) und Skript-Reihenfolge
css/                Stile: base (Grundlagen), components (Buttons, Listen), touch (Steuerkreuz)
js/
  core/             DOM-Zugriff, Hilfsfunktionen, Speicher, Einstellungen
  audio/            WebAudio-Grundlagen und alle Klangeffekte
  game/             Spiellogik: Labyrinth, Zustand, Level, Gegner, Gefahren, Punkte, Update
  render/           Zeichnen: Boden, Figuren, Hindernisse, Licht, HUD, Gesamtbild
  ui/               Overlays (Menü, Bestenliste, Pause), Einsatzbesprechung, Button-Anbindung
  input/            Tastatur, Wischen, Touch-Steuerkreuz, Gamepad
  main.js           Start, Frame-Schleife, Fehleranzeige
```

## Wichtig beim Ändern

- Die Dateien sind **klassische Skripte** (keine ES-Module), weil Module über `file://` nicht laden.
  Alle Dateien teilen sich einen globalen Gültigkeitsbereich, so wie vorher in der einen Datei.
- **Die Reihenfolge der `<script>`-Tags in `index.html` zählt.** Code, der beim Laden sofort läuft
  (z. B. `bind(...)` in `ui/bindings.js` oder `lsGet(...)` in `core/settings.js`), braucht die
  Funktionen aus früher geladenen Dateien. Neue Dateien daher passend einsortieren.
- `Laborith Fast da.html` ist die ursprüngliche Ein-Datei-Fassung (nach der Bereinigung) und wird vom Spiel nicht benötigt.

## To-do für morgen

- **Löcher und Portale:** Löcher dürfen nicht auf Portalen entstehen. Generell darf nichts auf einem Loch liegen (Portal, Kern, Item, Tür, Startfeld). Liegt doch etwas darauf, dann das Loch umsetzen.
- **Nur für Desktop optimieren:** Die Touch-Bedienung (Steuerkreuz, Wischen) wird nicht weiter gepflegt. Auf dem Handy soll stattdessen eine Info erscheinen, dass das Spiel nur auf einem größeren Display funktioniert.
- **Eventuell mehr Features:** Ideen sammeln und entscheiden, was dazukommt.
