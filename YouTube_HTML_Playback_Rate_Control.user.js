// ==UserScript==
// @name        YouTube HTML Playback Rate Control
// @version     1.8
// @namespace   BSP
// @downloadURL https://github.com/BinarySplit/gm_scripts/raw/master/YouTube_HTML_Playback_Rate_Control.user.js
// @include     https://www.youtube.com/*
// @include     http://www.youtube.com/*
// @grant       unsafeWindow
// ==/UserScript==

// Snipped to hide all front-page recommendations
// menus = document.querySelector('ytd-grid-renderer').querySelectorAll('#items>ytd-grid-video-renderer ytd-menu-renderer');
// (async () => {
//   for (var i = 0; i < menus.length; i++) {
//     menus[i].onOverflowTap_();
//     await new Promise(r => setTimeout(r, 16));
//     document.querySelector('ytd-popup-container ytd-menu-service-item-renderer:nth-child(3)').onTap_();
//     await new Promise(r => setTimeout(r, 16));
//     document.querySelector('ytd-popup-container').handleCloseAllPopupsAction_();
//     await new Promise(r => setTimeout(r, 16));
//   }
// })()

var first = true;
function init() {
    
    var oldContainer = document.querySelector(".bsp-playback-rate-control");
    if(oldContainer) {
        oldContainer.parentElement.removeChild(oldContainer);
    }
    
    var video = document.querySelector("video");
    var actionBar = document.querySelector("#menu-container");
    
    if(video && actionBar) {
        var speeds = [
            //0.75,
            //0.8,
            //0.9,
            1,
            1.2,
            1.5,
            2.0,
            2.5,
            3.0,
            3.5,
            4.0,
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

        unsafeWindow.__bspBumpVideoPlaybackRate = (delta) => {
            range.value = parseFloat(range.value) + delta;
            rangeInput();
        };

        // Init slider
        var range = Object.assign(document.createElement("input"), {
            className: "playback-rate-control-range",
            type: "range",
            min: 0,
            step: 1,
            max: speeds.length - 1,
            value: speeds.indexOf(parseFloat(localStorage.playbackRate)),
        })
        range.style.verticalAlign = "-0.45em";
        range.addEventListener("input", rangeInput, false);
        range.addEventListener("focus", function() {
            var player = document.querySelector(".html5-video-player");
            if(player)
                player.focus();
        }, false);

        // Init label
        var speedLabel = document.createElement("span");
        Object.assign(speedLabel.style, {
            display: "inline-block",
            width: "28px",
            fontWeight: "bold",
        })
        rangeInput();

        // Init containing element
        const container = Object.assign(document.createElement("div"), {
            className: "bsp-playback-rate-control",
        })
        Object.assign(container.style, {
            opacity: "0.5",
            cssFloat: "right",
            marginTop: "6px",
            fontSize: "11px",
            color: 'var(--yt-button-icon-button-text-color, var(--yt-spec-text-secondary))',
        })
        container.appendChild(range);
        container.appendChild(speedLabel);
        actionBar.parentNode.insertBefore(container, actionBar);

        // Unrelated: prevent volume control, etc. retaining keyboard focus after usage
        [...document.querySelectorAll('#player-theater-container [tabindex]:not(#movie_player):not(video)')]
            .forEach(el => el.removeAttribute('tabindex'));
        
        var i = 0, j = 0;
        function waitForStart() {
            if(video.getCurrentTime && video.getCurrentTime() > 0) {
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

const registeredVideos = new WeakSet()

function watchVideoForSrcChanges(v) {
    if (!registeredVideos.has(v)) {
        console.log('watching video for src changes', v)
        registeredVideos.add(v)
        loadWatcher.observe(v, { attributes: true, attributeFilter: ['src'] })
        forceQuality();
    }
}

async function forceQuality() {
    const player = (document.querySelector('ytd-player') || {}).player_;
    if (player != null && !player.getPlaybackQuality) {
        // Some members seem to be added after initialization - wait a tick for getPlaybackQuality
        await new Promise(resolve => setTimeout(resolve, 0));
        console.log(player, player.getPlaybackQuality)
    }
    if (player != null && player.getPlaybackQuality) {
        const quality = player.getPlaybackQuality();
        const levels = player.getAvailableQualityLevels();
        if (quality != 'auto' && quality != 'unknown') {
            player.setPlaybackQualityRange(quality, quality);
            console.log({quality, levels})
        } else {
            const q = levels.includes('hd1080') ? 'hd1080' : levels[0];
            player.setPlaybackQualityRange(q, q);
            console.log({quality, q, levels})
        }
    }
}

var loadWatcher = new MutationObserver(function(mutations) {
  //  console.log({mutations})
  const allAddedElements = mutations.flatMap(m => [...(m.addedNodes || [])])
    .filter(node => node != null && node.nodeType == 1); //HTMLElement.ELEMENT_NODE
  const hasVideoChange = mutations.some(m => m.type == 'attributes');
  const hasNewVideo = allAddedElements.some(el => {
    return el.tagName === "VIDEO"
      || el.id === 'menu-container'
      || el.className === 'ytp-iv-video-content'
      || el.querySelector("video, #menu-container, .ytp-iv-video-content") != null;
  });
  // Watch video elements for src attribute change
  allAddedElements
      .flatMap(el => el.tagName === "VIDEO" ? [el] : [...el.querySelectorAll('video')])
      .forEach(watchVideoForSrcChanges)
  // console.log("shouldInit", hasVideoChange, hasNewVideo, allAddedElements);
  console.log("shouldInit", hasVideoChange, hasNewVideo);
  if (hasVideoChange || hasNewVideo) {
    // console.log("init", allAddedElements);
      init();
      forceQuality();
  }
});
loadWatcher.observe(document, { childList: true, subtree: true });
[...document.querySelectorAll('video')].forEach(watchVideoForSrcChanges)
init();
