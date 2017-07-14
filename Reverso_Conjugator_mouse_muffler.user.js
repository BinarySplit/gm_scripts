// ==UserScript==
// @name        Reverso Conjugator mouse muffler
// @namespace   BSP
// @include     http://conjugator.reverso.net/*
// @version     1
// @grant       none
// ==/UserScript==

document.addEventListener('mouseover', e =>  e.stopPropagation(), true)