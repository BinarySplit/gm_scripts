// ==UserScript==
// @name        Steam Store Title Cleanup & video boost
// @downloadURL https://github.com/BinarySplit/gm_scripts/raw/master/Steam_Store_Title_Cleanup.user.js
// @include     http://store.steampowered.com/app/*
// @grant       none
// ==/UserScript==

var title = document.querySelector("title");
title.textContent = title.textContent.replace(/Save \d+% on | on Steam/g, '');

jQuery("body").on("click", ".movie_thumb,.html5_video_overlay", function() { 
	jQuery("video").prop("playbackRate", 2); 
})