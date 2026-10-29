'use strict';
/* Farben, Schriften, Paletten und Sektornamen */

const ACC = '#d9a441', RED = '#c4453d', TEAL = '#7fb6b0', INK = '#d5d9db';
const MONO = 'Consolas,"SF Mono",Menlo,"Liberation Mono",monospace';
const SANS = '"Bahnschrift","Segoe UI","Helvetica Neue",Arial,sans-serif';
const PALS = [[50, 62, 68], [52, 64, 54], [72, 60, 52], [58, 56, 72], [46, 68, 70], [74, 70, 52], [64, 52, 60], [48, 56, 74], [70, 62, 46], [54, 70, 60], [66, 54, 54], [56, 62, 76]];
const SECT_NAMES = ['Aufnahme', 'Kühlraum', 'Serverhalle', 'Filterstrecke', 'Archiv', 'Labor Nord', 'Quarantäne', 'Reaktorgang', 'Kältekammer', 'Wartungsschacht', 'Kontrollzentrum', 'Tiefenlager'];
const sectName = L => SECT_NAMES[(L - 1) % SECT_NAMES.length];
const ls = px => { if ('letterSpacing' in g) g.letterSpacing = px; };
