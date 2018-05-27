// ==UserScript==
// @name         Twitch popout
// @description  Ctrl+clicking a link to a Twitch stream from the grid causes the video & chat to pop out into their own windows
// @downloadURL  https://github.com/BinarySplit/gm_scripts/raw/master/Twitch_popout.user.js
// @version      1.0
// @match        https://www.twitch.tv/*
// @grant        window.close
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('click', e => {
        if (!e.metaKey && !e.ctrlKey) {
            return;
        }
        let el = e.target;
        while (el && !(el.tagName === 'A' && el.getAttribute('data-test-selector') === 'live-channel-card-link-selector')) {
            el = el.parentElement;
        }
        if (el) {
            const [,streamer] = /twitch.tv\/([^\/]+)$/.exec(el.href) || [];
            if (streamer) {
                e.preventDefault();
                setTimeout(() => {
                    const {availWidth:w, availHeight: h} = screen;
                    const chat = 400;
                    window.open(`https://www.twitch.tv/popout/${streamer}/chat?popout=`, "_blank", `left=2000,width=${chat},height=${h}`);
                    window.open(`https://player.twitch.tv/?channel=${streamer}`, "_blank", `left=0,width=${w-chat-2},height=${h}`);
                    window.close();
                });
            }
        }
    }, true);
})();
