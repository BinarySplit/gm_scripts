// ==UserScript==
// @name        Google Analytics Mock
// @namespace   BSP
// @downloadURL https://github.com/BinarySplit/gm_scripts/raw/master/Google_Analytics_Mock.user.js
// @include     *
// @exclude     https://console.developers.google.com/*
// @version     1.1.0
// @grant       unsafeWindow
// @run-at 		document-start
// ==/UserScript==

/** Util function for injecting a script into a page and seeing which globals it adds */
function testScript(url) {
	function loadScript(callback) {
		var done = false;
		var script = document.createElement("script");
		script.src = url;
		script.onload = script.onreadystatechange = function() {
			if(!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
				done = true;
				callback();
			}
		};
		document.head.appendChild(script);
	}
	(function() {
		var A = Object.keys(window);
		loadScript(function() {
			var C = Object.keys(window).filter(function(b) { return A.indexOf(b) === -1; });
			console.log('foo',C);
		});
	})()
}

applyProxy = function () {/**
	(function() {
		var w = this;
		
		function MakeSuperProxy() {
			var SuperProxyTarget = function() {};
			SuperProxyTarget.length = 0;
			//SuperProxyTarget.valueOf = "";
			SuperProxyTarget.toString = function() { return ""; };
			
			var descriptor = {
				getPropertyDescriptor: function(target, name) { return { value: SuperProxy, writable: true, enumerable: true, configurable: true }; },
				getOwnPropertyDescriptor: function(target, name) { return { value: SuperProxy, writable: true, enumerable: true, configurable: true }; },
				
				ownKeys: function(target, name) { return []; },
				defineProperty: function(target, name, propertyDescriptor) { return; },
				deleteProperty: function(target, name) { return true; },
				preventExtensions: function(target) { return true; },
				has: function(target, name) { return false; },
				get: function(target, name, receiver) { return name in target ? target[name] : SuperProxy; },
				set: function(target, name, val, receiver) { target[name] = val; return true; },
				enumerate: function(target) { return []; },
				apply: function(target, thisValue, args) { return SuperProxy; },
				construct: function(target, args) { return SuperProxy; }
			};
			//Debug log:
			//for(var k in descriptor) descriptor[k] = (function(k, v) { return function() { console.log(Array.prototype.concat.apply([k], arguments)); return v.apply(this, arguments); }; })(k, descriptor[k]);
			
			var SuperProxy = new Proxy(SuperProxyTarget, descriptor);
			
			return SuperProxy;
		}

		var blocks = []
		//http://www.google-analytics.com/ga.js
		blocks.push("_gat","_gaq");

		//http://www.google-analytics.com/analytics.js
		blocks.push("ga","gaplugins");

		//http://platform.twitter.com/widgets.js
		blocks.push("__twttrlr", "twttr", "__twitterIntentHandler");

		//https://apis.google.com/js/client:plusone.js?onload=loadGoogleClientLibraries
		if(!/youtube/.test(document.location))
			blocks.push("gapi", "___jsl");

		//https://imasdk.googleapis.com/js/sdkloader/ima3.js
		blocks.push("google_js_reporting_queue", "gteh", "Goog_AdSense_Lidar_sendVastEvent", "Goog_AdSense_Lidar_getViewability", 
			"Goog_AdSense_Lidar_getUrlSignalsArray", "Goog_AdSense_Lidar_getUrlSignalsList", "ima", "onYouTubeIframeAPIReady", 
			"google")

		//https://connect.facebook.net/en_US/all.js
		blocks.push("FB");

		//https://cdn.siftscience.com/s.js
		blocks.push("_sift", "__siftFlashCB", "Sift", "i");
		
		//Stuff needed for recode.net
		blocks.push("fyre","Gravatar","st_go","ex_go","linktracker_init");

		//Stuff needed for tumblr
		
		blocks.forEach(function(name) { 
			if(!(name in w))
				w[name] = MakeSuperProxy();
		});
	})();
**/}

var script = document.createElement('script');
script.setAttribute("type", "application/javascript");
script.textContent = applyProxy.toString().split('\n').slice(1, -1).join('\n');;

// Insert the script node into the page, so it will run, and immediately
// remove it to clean up.
document.head.appendChild(script);
document.head.removeChild(script);
