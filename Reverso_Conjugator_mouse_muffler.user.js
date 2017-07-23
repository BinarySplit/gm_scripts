// ==UserScript==
// @name        Reverso Conjugator mouse muffler
// @namespace   BSP
// @downloadURL https://github.com/BinarySplit/gm_scripts/raw/master/Reverso_Conjugator_mouse_muffler.user.js
// @include     http://conjugator.reverso.net/*
// @version     1
// @grant       none
// ==/UserScript==

document.addEventListener('mouseover', e =>  e.stopPropagation(), true)