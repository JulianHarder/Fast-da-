'use strict';
/* Symbole fuer die Einsatzbesprechung (kleine SVGs im Stil des Spiels) */

const svgIcon = body => `<svg viewBox="0 0 48 48" aria-hidden="true">${body}</svg>`;

// Gegner: dunkler Koerper mit Fangarmen, Farbe der Augen/Aura unterscheidet den Typ
function monsterIcon(aura, arm, eyes, o = {}) {
  const r = o.r || 11;
  return svgIcon(
    `<circle cx="24" cy="24" r="21" fill="${aura}" opacity=".10"/><circle cx="24" cy="24" r="16" fill="${aura}" opacity=".16"/>` +
    `<g stroke="${arm}" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M24 24Q10 18 5 8"/><path d="M24 24Q38 18 43 8"/><path d="M24 24Q10 32 6 42"/><path d="M24 24Q38 32 42 42"/></g>` +
    `<circle cx="24" cy="24" r="${r}" fill="#060607" stroke="${arm}" stroke-width="1.5"/>${eyes}${o.extra || ''}`
  );
}
const brEye = (x, y, col, rx = 3.2, ry = 1.7) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${col}"/>`;

const brStripes = Array.from({ length: 4 }, (_, k) => `<polygon points="17,${12 + k * 12} 31,${4 + k * 12} 31,${10 + k * 12} 17,${18 + k * 12}"/>`).join('');

const BR_ICONS = {
  hunter: monsterIcon('#ff2a1c', '#5a1b16', brEye(19.5, 22.5, '#ff4a38') + brEye(28.5, 22.5, '#ff4a38')),
  lurker: monsterIcon('#7fb0ff', '#1d3a66', brEye(20, 23, '#bfe0ff', 2.6, 1.3) + brEye(28, 23, '#bfe0ff', 2.6, 1.3)),
  blind: monsterIcon('#aab3b7', '#3a4248', '', {
    extra: '<g stroke="#d7e1e6" stroke-width="2" fill="none" stroke-linecap="round"><path d="M16 18Q13 24 16 30"/><path d="M32 18Q35 24 32 30"/><path d="M11 14Q6 24 11 34" opacity=".5"/><path d="M37 14Q42 24 37 34" opacity=".5"/></g>',
  }),
  splitter: monsterIcon('#ff2a1c', '#5a1b16', brEye(19, 21, '#ff4a38', 2.8, 1.5) + brEye(29, 21, '#ff4a38', 2.8, 1.5) + brEye(24, 27, '#ff4a38', 2.8, 1.5), {
    r: 12,
    extra: '<circle cx="8" cy="39" r="3.2" fill="#060607" stroke="#5a1b16"/><circle cx="40" cy="39" r="3.2" fill="#060607" stroke="#5a1b16"/><circle cx="8" cy="38.5" r="1" fill="#ff4a38"/><circle cx="40" cy="38.5" r="1" fill="#ff4a38"/>',
  }),
  core: svgIcon('<circle cx="24" cy="24" r="21" fill="#6edcff" opacity=".12"/><circle cx="24" cy="24" r="16" fill="#6edcff" opacity=".18"/><polygon points="24,11 35.3,17.5 35.3,30.5 24,37 12.7,30.5 12.7,17.5" fill="#96ebff" stroke="#e8fbff" stroke-width="1.5"/><circle cx="24" cy="24" r="3" fill="#fff"/>'),
  uplink: svgIcon('<circle cx="24" cy="24" r="16" fill="none" stroke="#7fe3ff" stroke-opacity=".25" stroke-width="4"/><path d="M24 8A16 16 0 1 1 8.8 29" fill="none" stroke="#7fe3ff" stroke-width="4" stroke-linecap="round"/><polygon points="24,18 30,21 30,27 24,30 18,27 18,21" fill="#96ebff"/>'),
  exit: svgIcon('<polygon points="15,38 33,38 46,48 2,48" fill="#fff1c9" opacity=".25"/><rect x="12" y="6" width="24" height="34" fill="#050607" stroke="#3a4248" stroke-width="2"/><rect x="16" y="10" width="16" height="30" fill="#fffbe8"/><circle cx="24" cy="26" r="14" fill="#fff1c9" opacity=".25"/>'),
  next: svgIcon('<path d="M8 24H35M26 13L37 24L26 35" fill="none" stroke="#6ee7a0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'),
  doors: svgIcon(`<rect x="17" y="6" width="14" height="36" fill="#1a1c1e"/><clipPath id="brClipDoor"><rect x="17" y="6" width="14" height="36"/></clipPath><g clip-path="url(#brClipDoor)" fill="#d6a21c">${brStripes}</g><rect x="17" y="6" width="14" height="36" fill="none" stroke="#5a6268" stroke-width="1.5"/><circle cx="24" cy="4" r="2.2" fill="#e64637"/>`),
  laser: svgIcon('<rect x="5" y="19" width="7" height="10" fill="#0c0d0f" stroke="#5a6268" stroke-width="1.5"/><rect x="36" y="19" width="7" height="10" fill="#0c0d0f" stroke="#5a6268" stroke-width="1.5"/><line x1="12" y1="24" x2="36" y2="24" stroke="#ff4637" stroke-width="7" opacity=".3"/><line x1="12" y1="24" x2="36" y2="24" stroke="#ffe6e1" stroke-width="2.5"/>'),
  holes: svgIcon('<path d="M24 8L22 2M40 19L46 18M31 39L33 46M8 22L2 24" stroke="#cfc9b4" stroke-width="1.5" opacity=".7" fill="none"/><polygon points="24,8 33,11 40,19 38,30 31,39 21,40 11,33 8,22 14,12" fill="#050506" stroke="#8d8a7e" stroke-width="2"/>'),
  walls: svgIcon('<rect x="5" y="31" width="38" height="8" fill="#111416" stroke="#3a4248" stroke-width="1.5"/><line x1="24" y1="5" x2="24" y2="30" stroke="#ffaa3c" stroke-width="5" stroke-dasharray="5 4"/>'),
  gas: svgIcon('<circle cx="18" cy="27" r="13" fill="#aad246" opacity=".38"/><circle cx="31" cy="22" r="14" fill="#aad246" opacity=".34"/><circle cx="27" cy="33" r="11" fill="#c9d96a" opacity=".32"/>'),
  portal: svgIcon('<circle cx="24" cy="24" r="17" fill="none" stroke="#c8e1eb" stroke-width="2.5" stroke-dasharray="6 5"/><circle cx="24" cy="24" r="11" fill="none" stroke="#9fe8ff" stroke-width="2"/><text x="24" y="30" text-anchor="middle" font-size="16" font-weight="700" fill="#9fe8ff" font-family="monospace">A</text>'),
  glitch: svgIcon('<polygon points="27,4 11,27 22,27 19,44 37,19 26,19" fill="#e0b050"/>'),
  clock: svgIcon('<rect x="21" y="3" width="6" height="4" fill="#8c979c"/><circle cx="24" cy="26" r="16" fill="none" stroke="#8c979c" stroke-width="3"/><path d="M24 26V15M24 26L32 30" stroke="#d5d9db" stroke-width="3" stroke-linecap="round" fill="none"/>'),
  battery: svgIcon('<rect x="21" y="6" width="6" height="5" fill="#f2c14e"/><rect x="15" y="11" width="18" height="31" rx="2" fill="#f2c14e" stroke="#0a0b0c" stroke-width="2"/><polygon points="26,17 20,29 24,29 22,37 29,25 25,25" fill="#0a0b0c"/>'),
  jammer: svgIcon('<path d="M13 9Q7 13 7 19M35 9Q41 13 41 19" stroke="#7fb6b0" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/><line x1="24" y1="23" x2="24" y2="11" stroke="#7fb6b0" stroke-width="2.5"/><circle cx="24" cy="9" r="2.8" fill="#9fe8de"/><circle cx="24" cy="31" r="9" fill="#1e282a" stroke="#7fb6b0" stroke-width="2.5"/><circle cx="24" cy="31" r="2.5" fill="#9fe8de"/>'),
  safe: svgIcon('<circle cx="24" cy="24" r="20" fill="#5ad2af" opacity=".16"/><circle cx="24" cy="24" r="13" fill="none" stroke="#8cf0d2" stroke-width="2.5"/><circle cx="24" cy="24" r="4" fill="#8cf0d2"/>'),
};
