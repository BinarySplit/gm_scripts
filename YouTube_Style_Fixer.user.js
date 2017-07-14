// ==UserScript==
// @name         YouTube Style Fixer
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle([
    "#watch-appbar-playlist .playlist-videos-list>li .yt-uix-button-playlist-remove-item { display: inline-block; }",
    //Make remove item in playlist view bigger
    ".yt-uix-button-icon-playlist-remove-item { zoom: 3 }",
    "#watch-appbar-playlist .yt-uix-button-playlist-remove-item { height: auto; }",
    //Make Add To Watch Later button always visible
    ".contains-addto .video-actions, .ux-thumb-wrap .video-actions, a .video-actions, .video-actions, .video-actions.yt-uix-button-active {  right: 2px; }",
    //Move video time to left side and make it always visible
    ".video-time { left: 2px !important; bottom: 2px !important; right: auto !important; top: auto !important; display: inline-block !important; }",
    //On video, bring back Watch Later button in the topbar
	".ytp-hide-info-bar:hover .ytp-chrome-top { display: inherit !important; }",
    //But hide the other crap up there
	".ytp-hide-info-bar .ytp-chrome-top > .ytp-title, .ytp-hide-info-bar .ytp-chrome-top > .ytp-share-button { display: none !important; }",
    //And hide the topbar itself so that it doesn't overlap annotations
    ".ytp-hide-info-bar:hover .ytp-chrome-top { overflow:visible; height:0; }",
    //Add some blank space to the bottom of the playlist so that it doesn't scroll up when deleting items
    "#player-playlist .playlist-videos-list { padding-bottom: 559px; }"
    //Hide the top/bottom gradients that make the video hard to see
    //".ytp-gradient-bottom, .ytp-gradient-top { display:none; }"
].join('\n'));
