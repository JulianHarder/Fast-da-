'use strict';
/* Speicher: localStorage mit Fallback im Arbeitsspeicher */

const mem = {};
function lsGet(k, d) { try { const v = localStorage.getItem('fastda.' + k); if (v !== null) return JSON.parse(v); } catch (e) {} return (k in mem) ? mem[k] : d; }
function lsSet(k, v) { mem[k] = v; try { localStorage.setItem('fastda.' + k, JSON.stringify(v)); } catch (e) {} }
