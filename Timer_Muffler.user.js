// ==UserScript==
// @name        SetTimeout Tamer
// @namespace   BSP
// @downloadURL https://github.com/BinarySplit/gm_scripts/raw/master/Timer_Muffler.user.js
// @include     http://*
// @include     https://*
// @exclude	    http://*.google.tld/*
// @exclude	    https://*.google.tld/*
// @exclude	    http://*.youtube.tld/*
// @exclude	    https://*.youtube.tld/*
// @exclude	    http://irc.lc/*
// @exclude	    https://irc.lc/*
// @exclude	    http://www.newsblur.com/*
// @exclude	    https://www.newsblur.com/*
// @exclude		https://www.duolingo.com/*
// @version     2
// @grant       none
// @run-at		document-start
// ==/UserScript==

function doIt() {
(function() {
var setInterval_old = window.setInterval;
var setTimeout_old = window.setTimeout;
var clearInterval_old = window.clearInterval;
var clearTimeout_old = window.clearTimeout;

//QueuedTimer format: {ID: [startTime, repeat, func, delay, args]}
var queuedTimers = null;
//ActiveTimer format: {ID: [repeat, func, delay, args, browserTimerID]}
var activeTimers = window.timeoutTamerTimers = {};
var nextID = 1000000;

function debugLog(...args) {
	false && console.log(...args);
}

function addTimer(ID, repeat, func, delay, args, isNew) {
	if(typeof func != "function" && typeof func != "string") {
		debugLog("addTimer", "invalid func", arguments);
		//throw Error("setInterval/setTimeout: invalid func");
		return ID;
	}
	delay = +(delay || 0); //coerce to number
	if(isNaN(delay)) { //check for NaN (results from non-number strings/objects, etc.)
		debugLog("addTimer", "invalid delay", arguments);
		//throw Error("setInterval/setTimeout: invalid delay");
		return ID;
	}
	
	if(document.visibilityState === 'hidden') {
		if(!queuedTimers) queuedTimers = {};
		isNew && debugLog("addTimer", "Deferred", [ID, repeat, delay, func]);
		queuedTimers[ID] = [Date.now(), repeat, func, delay, args];
	} else {
		var browserTimerID = setTimeout_old(execTimer, delay, ID, repeat, func, delay, args);
		isNew && debugLog("addTimer", "Scheduled", [ID, repeat, delay, func]);
		activeTimers[ID] = [repeat, func, delay, args, browserTimerID];
	}
	return ID;
}

function execTimer(ID, repeat, func, delay, args) {
	try {
		if(ID in activeTimers) {
			delete activeTimers[ID];
			debugLog("execTimer", "Executing", ID, repeat);
			
			//Re-add to the list so it can be cleared while in progress
			if(repeat) {
				addTimer(ID, repeat, func, delay, args, false);
			}
		} else {
			debugLog("wtf", ID, repeat, func, delay, args);
		}
		
		try {
			if(typeof func == "string") {
				var script = document.createElement('script');
				script.setAttribute("type", "application/javascript");
				script.textContent = func;

				// Insert the script node into the page, so it will run, and immediately
				// remove it to clean up.
				document.body.appendChild(script);
				document.body.removeChild(script);
			} else {
				func.apply(window, args);
			}
		} catch(ex) { /* Silence it like JS normally does */ debugLog("execTimer", "Error", arguments, ex); }
	
	} catch(ex) { console.log(ex); }
}

function onVisibilityChange(event) {
	debugLog("onVisibilityChange", "document.visibilityState is", document.visibilityState);
	try {
		//If window becomes active and any timers are queued, restart them
		if(!document.visibilityState !== 'hidden' && queuedTimers) {
			debugLog("onVisibilityChange", "Processing deferred timers", arguments, queuedTimers);
			try {
				for(var ID in queuedTimers) {
					//QueuedTimer format: {ID: [startTime, repeat, func, delay, args]}
					var timer = queuedTimers[ID];
					var delay = Math.max(0, timer[0] + timer[3] - Date.now());

					var browserTimerID = setTimeout_old(execTimer, delay, ID, timer[1], timer[2], timer[3], timer[4]);
					//ActiveTimer format: {ID: [repeat, func, delay, args, browserTimerID]}
					activeTimers[ID] = [timer[1], timer[2], timer[3], timer[4], browserTimerID];
					delete queuedTimers[ID];
				}
			} catch(ex) {
				debugLog("onVisibilityChange", "Error", ex);
			}
			queuedTimers = null;
		}
	} catch(ex) { console.log(ex); }
}

document.addEventListener("visibilitychange", onVisibilityChange);



window.setInterval = 
function setInterval() {
	try {
		var func = arguments[0];
		var delay = arguments[1];
		var args = Array.slice(arguments, 2);
		return addTimer(nextID++, true, func, delay, args, true);
	} catch(ex) { console.log(ex); }
};


window.setTimeout = 
function setTimeout() {
	try {
		var func = arguments[0];
		var delay = arguments[1];
		var args = Array.slice(arguments, 2);
		//console.log(arguments);
		return addTimer(nextID++, false, func, delay, args, true);
	} catch(ex) { console.log(ex); }
};

window.clearTimeout = 
window.clearInterval = 
function clearTimer(ID) {
	try {
		var args = Array.slice(arguments, 0);
		if(queuedTimers && typeof(queuedTimers[ID]) != "undefined") {
			debugLog("clearTimer", "Clearing deferred timer", args, queuedTimers[ID]);
			delete queuedTimers[ID];
		}
		if(typeof(activeTimers[ID]) != "undefined") {
			debugLog("clearTimer", "Clearing active timer", args, activeTimers[ID]);
			clearTimeout_old(activeTimers[ID][4]);
			delete activeTimers[ID];
		}
	} catch(ex) { console.log(ex); }
};
})();
}

var sauce = doIt.toSource().split("\n"); 
var specialSauce = sauce.slice(1, sauce.length - 1).join("");

// Defer so that document.head can be loaded
setTimeout(() => {
	var script = document.createElement("script");
	script.text = specialSauce;
	document.head.appendChild(script);
	document.head.removeChild(script);
	console.log("setTimeout Tamer Started");
}, 0)
