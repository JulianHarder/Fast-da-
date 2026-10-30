'use strict';
/* Zugriff auf DOM und Canvas */

const $ = id => document.getElementById(id);
const cv = $('cv'); let g = cv.getContext('2d', { alpha: false });
