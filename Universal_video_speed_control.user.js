// ==UserScript==
// @name         Universal video speed control
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @downloadURL  https://github.com/BinarySplit/gm_scripts/raw/master/Universal_video_speed_control.user.js
// @author       You
// @include      *
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    let speed = 1;
  document.addEventListener('keydown', e => {
      //console.log('document.activeElement', document.activeElement);
    if (
      !(document.activeElement
       && (['INPUT','TEXTAREA'].includes(document.activeElement.tagName))
           || document.activeElement.getAttribute('contentEditable'))
      && (e.key === '-' || e.key === '=')
      && !e.ctrlKey && !e.metaKey
    ) {
      const delta = e.key === '-' ? -1 : 1;
      e.preventDefault();
      e.stopPropagation();

      if (unsafeWindow.__bspBumpVideoPlaybackRate) {
          unsafeWindow.__bspBumpVideoPlaybackRate(delta);
      } else {
          speed += delta * 0.5;
          console.log('setting video speed to ', speed)
          Array.from(document.querySelectorAll('video')).forEach(v => { v.playbackRate = speed });
      }
    }
  });
})();
