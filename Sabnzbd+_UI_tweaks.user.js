// ==UserScript==
// @name        BSP Sabnzbd+ UI tweaks
// @namespace   BSP
// @include     http://localhost:8080/*
// @version     1
// @grant		unsafeWindow
// @run-at      document-end
// ==/UserScript==

var lr = unsafeWindow.lr;
var lrb = unsafeWindow.lrb;

function loadtitle() {
	// document.URL isn't updated when someone clicks on "#/dv1/"; can't use it.
	url = window.location.toString();
	if (url.match('#'))
	{
		index = url.lastIndexOf('#');
		url = url.slice(index+1, url.length);
		url = url.replace('-', '/');
		if (url.indexOf('/') == 0){
			url = url.slice(1, url.length);
		}
		if (url.lastIndexOf('/') == url.length-1){
			url = url.slice(0, url.length-1);
		}

		switch(url)
		{
			case 'dv1':
			lr('queue/','limit=15', 1, 1);
			lrb('history/','limit=15',1);
			break;
			case 'dv2':
			lr('queue/','limit=15', 1, 2);
			lrb('history/','limit=15',1);
			break;
			case 'history':
			lr('history/','limit=15',1);
			break;
			case 'queue':
			lr('queue/','limit=15',1);
			break;
			case 'status':
			lr(url,'',1)
			default:
			lr(url)
		}
	} else {
		lr('queue/','limit=25', 1, 2);
		lrb('history/','limit=25',1);
	}
}

unsafeWindow.loadtitle = exportFunction(loadtitle, unsafeWindow);

var styleElem = document.createElement("style");
styleElem.type = "text/css";
styleElem.innerHTML += "#queueTable { font-size:10px; }\n";
styleElem.innerHTML += "#queueTable>tbody>tr>td:nth-child(3) { max-width: 200px; word-wrap: break-word; }\n";
styleElem.innerHTML += "#queueTable>tbody>tr>td:nth-child(6) { min-width: 33px; }\n";
styleElem.innerHTML += "#queueTable>tbody>tr>td:nth-child(8) { min-width: 33px; vertical-align:top; }\n";
document.body.appendChild(styleElem);

var rssBtn = document.querySelector("a[href='./config/']");
if(rssBtn) {
	rssBtn.parentElement.innerHTML += ' <a class="config" href="javascript:void(0)" onclick="doSimpleXMLHttpRequest(\'./config/rss/rss_now?session=\'+session).addCallback(function(){ document.location = document.location; });">RSS</a>';
}