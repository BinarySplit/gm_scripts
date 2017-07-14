// ==UserScript==
// @name        Steam Store Title Cleanup & video boost
// @include     http://store.steampowered.com/app/*
// @grant       none
// ==/UserScript==

var title = document.querySelector("title");
title.textContent = title.textContent.replace(/Save \d+% on | on Steam/g, '');

jQuery("body").on("click", ".movie_thumb,.html5_video_overlay", function() { 
	jQuery("video").prop("playbackRate", 2); 
})