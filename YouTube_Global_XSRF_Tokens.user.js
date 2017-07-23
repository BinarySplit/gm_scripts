// ==UserScript==
// @name         YouTube Global XSRF Tokens
// @downloadURL  https://github.com/BinarySplit/gm_scripts/raw/master/YouTube_Global_XSRF_Tokens.user.js
// @match        https://www.youtube.com/*
// @grant        unsafeWindow
// ==/UserScript==
setTimeout(function() {
    var xsrf = unsafeWindow.yt.getConfig("XSRF_TOKEN");
    if(xsrf) {
        console.log("Sharing XSRF Token: " + xsrf);
        localStorage["GM_YT_XSRF"] = xsrf;
    }

    window.addEventListener("storage", function(e) {
        if (e.key === "GM_YT_XSRF" && e.newValue && unsafeWindow.yt.setConfig) {
            console.log("Receiving XSRF Token: " + e.newValue);
            unsafeWindow.yt.setConfig({"XSRF_TOKEN": e.newValue});
        }
    }, false);
}, 50);