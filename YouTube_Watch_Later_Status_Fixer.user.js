// ==UserScript==
// @name         YouTube Watch Later Status Fixer
// @downloadURL  https://github.com/BinarySplit/gm_scripts/raw/master/YouTube_Watch_Later_Status_Fixer.user.js
// @match        https://www.youtube.com/feed/subscriptions*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

var watchLaterVideoIds = {};
function applyStyles() {
    $("[data-context-item-id]")
        .not(".addto-watch-later-button-success")
        .each(function() {
        if(watchLaterVideoIds[$(this).attr("data-context-item-id")]) {
            console.log($(this).attr("data-context-item-id"));
            $(".addto-watch-later-button", this).removeClass("addto-watch-later-button").addClass("addto-watch-later-button-success");
        }
    });
}

$.get("/playlist?list=WL").done(function(data) {

    $("[data-video-id]", data).each(function() { 
        watchLaterVideoIds[$(this).attr("data-video-id")] = true; 
    });
    console.log(watchLaterVideoIds);
    applyStyles();
});

var observer = new MutationObserver(function(mutations) {
    console.log(mutations);
    applyStyles();
});
$("#browse-items-primary, .item-section").each(function() {
    observer.observe(this, { childList: true });
});