// ==UserScript==
// @name        YouTube HTML Playback Rate Control
// @namespace   BSP
// @downloadURL https://github.com/BinarySplit/gm_scripts/raw/master/YouTube_HTML_Playback_Rate_Control.user.js
// @include     https://www.youtube.com/*
// @include     http://www.youtube.com/*
// @version     1
// @grant       none
// ==/UserScript==
var first = true;
function init() {
    var video = document.querySelector("video");
    
    var container = document.querySelector(".bsp-playback-rate-control");
    var hadContainer = container != null;
    if(container) {
        container.parentElement.removeChild(container);
    }
    
    if(video) {
        var speeds = [
            0.05, 0.1, 0.25, 0.5, 0.9,
            1, 1.5, 1.8, 2.0, 2.25, 
            2.5, 2.75, 3.0, 3.5, 4.0
        ];
        function rangeFunction(i) {
            return speeds[i] || 1;
        }
    
        function rangeInput() {
            var newRate = rangeFunction(range.value);
            if(localStorage.playbackRate != newRate)
            	localStorage.playbackRate = newRate;
            
            speedLabel.textContent = newRate.toString() + "x";
            var videos = document.querySelectorAll("video");
            for(var i = 0; i < videos.length; i++)
                videos[i].playbackRate = newRate;
        }
        
        window.addEventListener("storage", function() {
            range.value = speeds.indexOf(parseFloat(localStorage.playbackRate) || 2);
            rangeInput();
        }, false);

    
        var range = document.createElement("input");
        var speedLabel = document.createElement("span");
        var container = document.createElement("div");
        var actionBar = document.querySelector(".watch-action-buttons");
        
        range.className = "playback-rate-control-range";
        range.type = "range";
        range.min = 0;
        range.step = 1;
        range.max = speeds.length - 1;
        range.value = speeds.indexOf(parseFloat(localStorage.playbackRate));
        range.style.verticalAlign = "-0.45em";
        
        range.addEventListener("input", rangeInput, false);
        range.addEventListener("focus", function() {
            var player = document.querySelector(".html5-video-player");
            if(player)
                player.focus();
        }, false);
        rangeInput();
        
        speedLabel.style.display = "inline-block";
        speedLabel.style.width = "28px";
        speedLabel.style.fontWeight = "bold";
        
        container.style.opacity = "0.5";
        container.style.cssFloat = "right";
        container.style.marginTop = "6px";
        container.style.fontSize = "11px";
        container.appendChild(range);
        container.appendChild(speedLabel);
        container.className = "bsp-playback-rate-control";
        
        actionBar.appendChild(container);
        
        var i = 0, j = 0;
        function waitForStart() {
            if(video.getCurrentTime() > 0) {
                if(first) {
                	video.pause();
                    first = false;
                }
                rangeInput();
                
                var player = document.querySelector(".html5-video-player");
                if(player)
                    (player.origFocus || player.focus).call(player);
                
                if(j++ < 5)
                    setTimeout(waitForStart, 20);
            } else if(i++ < 500) {
                setTimeout(waitForStart, 20);
            }
        }
        setTimeout(waitForStart, 20);
    }
}
init();

var loadWatcher = new MutationObserver(function(mutations) {
    var playerNodes = [];
    for(var i = 0; i < mutations.length; i++) {
        var mutation = mutations[i];
        for(var j = 0; j < mutation.addedNodes.length; j++) {
            var node = mutation.addedNodes[j];
            if(node != null && node.nodeType == HTMLElement.ELEMENT_NODE) {
                //node.classList.contains("ytp-player-content") || 
                if(node.tagName == "VIDEO" || node.querySelector("video") != null || node.querySelector(".watch-action-buttons") != null) {
                    playerNodes.push(node);
                }
            }
        }
    }
    
    if(playerNodes.length > 0) {
        console.log("Reiniting playback rate control because of mutation", mutation, playerNodes);
        init();
    }
});
loadWatcher.observe(document, { childList: true, subtree: true });
console.log("Yatta!")


//HTMLElement.prototype.origFocus = HTMLElement.prototype.focus;
//HTMLElement.prototype.focus = function() { /* FYAD Watch Later button mouseover event */ };