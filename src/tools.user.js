// ==UserScript==
// @name     DG utilities v0.4
// @namespace    devhex
// @version      0.4.0006
// @description  various minor improvements of DG interface
// @match        https://*.darkgalaxy.com
// @match        https://*.darkgalaxy.com/*
// @require      https://html2canvas.hertzen.com/dist/html2canvas.min.js
// @require      https://github.com/Arcopix/dg-tools/raw/master/resources.js?v=0.4.0006
// @copyright    2020-2023, Stefan Lekov / Arcopix / Devhex Ltd
// @homepage     https://github.com/Arcopix/dg-tools
// @supportURL   https://github.com/Arcopix/dg-tools/issues
// @downloadURL  https://github.com/Arcopix/dg-tools/raw/master/tools.user.js
// @updateURL    https://github.com/Arcopix/dg-tools/raw/master/tools.user.js
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACrUlEQVQ4jY2T3YsTZxTGf+/MZCfZmDXR1P1wdT+irfiRokK7uCBExC0UBC9KL/z4B7wqlf4BvW0RKvaqf0ahoLe6CquorWyWlqwbdsmaTHSSycxOZiYz7+uFFoIW6gMHDoeH53A+HsGHMIDxUcHs3jT7AOwQa0dSB1pAPEwW7+VTnxYyS5WjB7/+bH7myIimCgKJ7bidraa19njD+uO55d8ZKLYBNSyg6XDi0ucHvvv2wtmL0zOlgjeIWd+oEycSoWICt4NtNTt/vWj8fq/evdkd8ByQ+lcTJjUvOXzti/kfr1++9E1+fynbsHs0222ar17jhTH1rQZr63X8cJDJasmxLPH4tp88vTqbei2A3Lm5/I3vr138wdg9ka5ttvB9j5bVwmrbJDKhY9u8srvEiQQEQqn+dl/99DKQP+tpOH2lcvzG2CdT+2ubTXp+n7GZI6h0jr+rVYJBwuHTiwQqxT+bTdr9hHagUn6iCrFixTg+mV2YnZuaf/GyRa22Sa44QT49xk5kUz57ASklgW5yoJzn4do6Xcf5d+lzwIIxnh895LiB2di2abUsukFCbrrB4wfLfHl+iVhKnjx4iDFiEg4GwxdMA4e0sB+Mbmw0tF7PJYxCgiAkkgo3gUgqokRhjJhUKhWKxeKwgAaMGn4YO27Plb3+QHe9HUwzT27PXo6dPEWn66CAUqlEJpNB07RhAQk4hhPJ6k7P8Rw3Kjj9GL9l8+dqFaVgeXkZgMXFRR6trNDpdIYFPKDKrpRWXpoeuX+mqKt9KZQhUO++7P/iPlDWI6kcA0w/ZsEKVSZS/+GOD9EFfgXuktEFumDS1MQvAtyP6OwBt4BJAD1WoMBLFKtAAEwAWd66cthsgYB1Ab8Bt4EG7xEA8sBRoAycBGbf1beApwKeCViVb0cA4A0jB1JIhWkJiAAAAABJRU5ErkJggg==
// @grant        none
// ==/UserScript==

/* Common counters & pointers */
var i, j, k, l, m, n, p, r, q, s, t;
var buf;

var __HIDE_MENU_INSTRUCTION__ = false;

var browser="chrome";

/* Common data */

const logisticsCapacity = {
    "Freighter": 100000,
    "Merchant": 250000,
    "Trader": 625000,
    "Hulk": 1562500
};

const ships = {
    "Freighter": 3.84,
    "Merchant": 7.68,
    "Trader": 11.52,
    "Hulk": 19.2,
    "Fighter": 0.24,
    "Bomber": 0.72,
    "Frigate": 2.88,
    "Destroyer": 12,
    "Cruiser": 25.2,
    "Battleship": 144,
    "Invasion_Ship": 4.16,
    "Outpost_Ship": 4.8,
    "Colony_Ship": 105
};

const RTT = [32, 24, 16];
var curRTT = 0;

/* End of common data, variables */

/* Global CSS */
addGlobalStyle(`
.large-input {
  background-color: #4a4a4a;
  border: 1px solid #7a7a7a;
  color: #fff;
  }
.large-input::placeholder {
  color: #bbb;
  font-style: italic;
}
.fleet-filter {
  float: right;
  width: 200px;
  height: 20px;
  margin-top: 4px;
  margin-right: 20px;   
}
.smallHeader {
  padding: 4px;
  font-family: DarkGalaxy, sans-serif;
  font-size: 18px;
  line-height: 22px;
  color: #fff;
}
`);

/* Development warning */
m = localStorage.getItem('develWarning');
if (0 && m!==getDate()) {
    window.alert("WARNING, you are using development version of DG utilities.\n" +
                    "Use it at your own risk\n" +
                    "\n" +
                    "This message will be displayed on once a day");

    localStorage.setItem('develWarning', getDate());
}

/* Check if global configuration is set and if not - initiate defaults */
if (!localStorage.getItem('cfgRulername')||localStorage.getItem('cfgRulername')==='') {
    initializeConfig();
}

if (!localStorage.getItem('cfgShowedHelp')||localStorage.getItem('cfgShowedHelp')!=='v0.4.0004') {
    showHelp();
} else {
    if (!localStorage.getItem('cfgShowedVersion')||localStorage.getItem('cfgShowedVersion')!=='v0.4.0006') {
        showWhatsNew();
    }
}

/* Global configuration */
var cfgRulername = localStorage.getItem('cfgRulername');
var cfgAllyNAP = localStorage.getItem('cfgAllyNAP');
var cfgAllyNAPcolor = localStorage.getItem('cfgAllyNAPcolor');
var cfgAllyCAP = localStorage.getItem('cfgAllyCAP');
var cfgAllyCAPcolor = localStorage.getItem('cfgAllyCAPcolor');
var cfgRadarSorting = parseBool(localStorage.getItem('cfgRadarSorting'));
var cfgFleetSorting = parseBool(localStorage.getItem('cfgFleetSorting'));
var cfgPlanetSorting = localStorage.getItem('cfgPlanetSortingV2');
var cfgShowSM = (localStorage.getItem('cfgShowSM')!=='')?parseBool(localStorage.getItem('cfgShowSM')):true;
var cfgShowAS = (localStorage.getItem('cfgShowAS')!=='')?parseBool(localStorage.getItem('cfgShowAS')):true;



/* Updated main menu items */
var confIcon = document.createElement('div');
confIcon.className = 'left relative';
confIcon.style = 'cursor:pointer;';
confIcon.innerHTML = '<img alt="Configuration" src="' + imageContainer["confIcon.png"] + '"/>';

confIcon.addEventListener('click', function() { showPluginConfiguration() }, false);

/* Updated main menu items */
var screenshotIcon = document.createElement('div');
screenshotIcon.className = 'left relative';
screenshotIcon.style = 'cursor:pointer;';
screenshotIcon.innerHTML = '<img alt="Take a screenshot" src="' + imageContainer["screenshotIcon.png"] + '"/>';

screenshotIcon.addEventListener('click', function() { generateScreenshot() }, false);

/* Updating main menu */
var mainMenu = document.querySelector('div.icons');
p = mainMenu.getElementsByTagName('a')[2];
mainMenu.removeChild(p);
mainMenu.appendChild(confIcon);
mainMenu.appendChild(screenshotIcon);
mainMenu.appendChild(p);

/* get the turnNumber */
var turnNumber = document.getElementById('turnNumber').innerText;
var jsonPageDataCache = null;

q = document.head.querySelectorAll('script');
for (i=0; i<q.length; i++) {
	if (q[i].innerHTML.match(/let jsonPageData/g)) {
		data = q[i].innerHTML;
		data = data.replace("let jsonPageData =", "");
		data = data.replace(/;$/, "");
		data = data.trim();
		jsonPageData = JSON.parse(data);
	}
}

if (location.href.includes('/planets/') && typeof jsonPageData !== 'undefined' && jsonPageData !== null) { 
	console.log("Setting jsonPageData to cache");
	localStorage.setItem('jsonPageData', JSON.stringify(jsonPageData));
	jsonPageDataCache = jsonPageData;
} else {
	console.log("Fetching jsonPageData from cache");
	jsonPageDataCache = JSON.parse(localStorage.getItem('jsonPageData'));
}

jsonFleetCache = JSON.parse(localStorage.getItem('fleetArray'));

addGlobalStyle('[data-tooltip] { display: inline-block; position: relative; cursor: help;  padding: 4px; }');
addGlobalStyle('[data-tooltip]:before { content: attr(data-tooltip); display: none; position: absolute; background: rgba(0, 0, 0, 0.7); color: #fff; padding: 4px 8px; font-size: 14px; line-height: 1.4; min-width: 100px; text-align: center; border-radius: 4px; }');
addGlobalStyle('[data-tooltip-position="top"]:before, [data-tooltip-position="bottom"]:before { left: 50%; -ms-transform: translateX(-50%); -moz-transform: translateX(-50%); -webkit-transform: translateX(-50%); transform: translateX(-50%); }');
addGlobalStyle('[data-tooltip-position="right"]:before, [data-tooltip-position="left"]:before { top: 50%; -ms-transform: translateY(-50%); -moz-transform: translateY(-50%); -webkit-transform: translateY(-50%); transform: translateY(-50%); }');
addGlobalStyle('[data-tooltip-position="top"]:before { bottom: 100%; margin-bottom: 6px; }');
addGlobalStyle('[data-tooltip-position="right"]:before { left: 100%; margin-left: 6px; }');
addGlobalStyle('[data-tooltip-position="bottom"]:before { top: 100%; margin-top: 6px; }');
addGlobalStyle('[data-tooltip-position="left"]:before { right: 100%; margin-right: 6px; }');
addGlobalStyle('[data-tooltip]:after { content: \'\'; display: none; position: absolute; width: 0; height: 0; border-color: transparent; border-style: solid; }');
addGlobalStyle('[data-tooltip-position="top"]:after, [data-tooltip-position="bottom"]:after { left: 50%; margin-left: -6px; }');
addGlobalStyle('[data-tooltip-position="right"]:after, [data-tooltip-position="left"]:after { top: 50%; margin-top: -6px; }');
addGlobalStyle('[data-tooltip-position="top"]:after { bottom: 100%; border-width: 6px 6px 0; border-top-color: #000; }');
addGlobalStyle('[data-tooltip-position="right"]:after { left: 100%; border-width: 6px 6px 6px 0; border-right-color: #000; }');
addGlobalStyle('[data-tooltip-position="bottom"]:after { top: 100%; border-width: 0 6px 6px; border-bottom-color: #000; }');
addGlobalStyle('[data-tooltip-position="left"]:after { right: 100%; border-width: 6px 0 6px 6px; border-left-color: #000; }');
addGlobalStyle('[data-tooltip]:hover:before, [data-tooltip]:hover:after { display: block; z-index: 9000; }');

/* Coordinates as links */
var coords;
coords = document.getElementsByClassName('coords')
for (i=0; i<coords.length; i++)
{
    let c = coords[i];
    /* In planet details there is no span on the planer coordinates */
    let __c = c.getElementsByTagName('span')[0];
    if (__c) {
        c = __c;
    }

    /* Don't bother with home planets */
    if (typeof c !== 'undefined' && typeof c.innerText !== 'undefined' && c.innerText==='0.0.0.0') {
        continue;
    }

    if (c && c.innerText.match(/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/g)) {
        let p = c.innerText.split('.');
        if (c.innerHTML === c.innerText) {
            c.innerHTML = '<a href="/navigation/' + p[0] + '/' + p[1] + '/' + p[2] + '/">' + c.innerHTML + '</a>';
        } else {
            c.innerHTML = c.innerHTML.replace(c.innerText, '<a href="/navigation/' + p[0] + '/' + p[1] + '/' + p[2] + '/">' + c.innerText + '</a>');
        }
    }
}

/* TODO: Thsi should be combined with cfgAllyCAP */
/* Colorize the alliance tag / playname if it matches a tag arrayAllyNAP */
if (cfgAllyNAP!=='') {
    var arrayAllyNAP = cfgAllyNAP.split(',');

    for (i=0; i<arrayAllyNAP.length; i++) {
        arrayAllyNAP[i] = '[' + arrayAllyNAP[i].trim() + ']';
    }

    var elems = document.getElementsByTagName("div");
    var player="";
    for (i=0; i<elems.length; i++) {
        var e = elems[i];
        if (e.className==="allianceName"&&arrayAllyNAP.includes(e.innerText.trim())) {
            /* Colorize the alliance TAG */
            e.style.color = cfgAllyNAPcolor;
            /* Only for navigation */
            if (location.href.includes('/navigation/')) {
                /* Find the Element with the entire planet */
                p = e.parentElement.parentElement.parentElement;
                /* Reset the border of the planet */

                p.style.border = "1px solid " + cfgAllyNAPcolor;

                /* Reset the color for any text */
                p.style.color = cfgAllyNAPcolor;
                p.querySelector("span").style.color = cfgAllyNAPcolor;
                if (p.querySelector("a")) {
                    p.querySelector("a").style.color = cfgAllyNAPcolor;
                }
                /* Properly colorize the player name */
                p.querySelector('div .playerName').style.color = cfgAllyNAPcolor;
            }
        }
    }
}

/* Colorize the alliance tag / playname if it matches a tag arrayAllyCAP */
if (cfgAllyCAP!=='') {
    var arrayAllyCAP = cfgAllyCAP.split(',');

    for (i=0; i<arrayAllyCAP.length; i++) {
        arrayAllyCAP[i] = '[' + arrayAllyCAP[i].trim() + ']';
    }

    elems = document.getElementsByTagName("div");
    player="";
    for (i=0; i<elems.length; i++) {
        e = elems[i];
        if (e.className==="allianceName"&&arrayAllyCAP.includes(e.innerText.trim())) {
            /* Colorize the alliance TAG */
            e.style.color = cfgAllyCAPcolor;
            /* Find the Element with the entire planet */
            p = e.parentElement.parentElement.parentElement;
            /* Reset the border of the planet */
            if (location.href.includes('/navigation/')) {
                p.style.border = "1px solid " + cfgAllyCAPcolor;

                /* Reset the color for any text */
                p.style.color = cfgAllyCAPcolor;
                p.querySelector("span").style.color = cfgAllyCAPcolor;
                if (p.querySelector("a")) {
                    p.querySelector("a").style.color = cfgAllyCAPcolor;
                }
                /* Properly colorize the player name */
                p.querySelector('div .playerName').style.color = cfgAllyCAPcolor;
            }
        }
    }
}

/* Add onclick to player names through the interface to forward to mail module */
elems = document.getElementsByClassName("playerName");
for (i=0; i<elems.length; i++) {
    e = elems[i];
    if (e.parentNode.className==='friendly') {
        e.style.cursor = 'not-allowed';
        continue;
    }
    e.addEventListener('click', function() {
        window.location.href = "/mail/?to=" + this.innerText.trim();
    }, false);
}

/* If in mail module and to is set -> set the recepient */
if (window.location.pathname==="/mail/" && window.location.search!=="") {
    var query = getQueryParams(document.location.search);
    if (typeof query.to !== 'undefined' && query.to !== "") {
        document.getElementsByName('to')[0].value = query.to;
    }
}

/* Add confirmation on canceling buildings */
elems = document.getElementsByClassName("queueRemoveButton");
for (i=0; i<elems.length; i++) {
    var add_confirm = 0;
    var left;
    var name = 'unknown';
    e = elems[i];
    p = e.parentElement.parentElement;

    for (j=0; j<p.children.length; j++) {
        if (p.children[j].className==="left name") {
            name = p.children[j].innerText;
        }
        if (p.children[j].className==="left width25") {
            left = p.children[j].innerText;
            if (left>0) {
                add_confirm = 1;
            }
        }
    }

    if (add_confirm) {
        e.confirmString = "Are you sure you want to cancel " + name + "?";
        e.addEventListener('click', function(evt) { if (confirm(evt.currentTarget.confirmString)===false) evt.preventDefault(); });
    }
}

/* Script by Mordread -> use ARROW keys to navigate in navigation
   fix by Arcopix - removed anonymous function, since it was useless */
if (document.querySelector(".navigation.left")) {
    document.addEventListener("keydown", (e) => {
        if (document.activeElement.tagName==='INPUT') {
            return;
        }
        if (e.which === 37 && !e.altKey && !e.ctrlKey) {
            document.querySelector(".navigation.left").click();
        }
        if (e.which === 39 && !e.altKey && !e.ctrlKey) {
            document.querySelector(".navigation.right").click();
        }
    });
}

/* Fix coordinates to be min 100 px in width due bug in Navigation:
   - News link is not shown due to width of 85px for longer coordinates (10-12) */
if (window.location.href.match(/\/navigation\/[0-9]+\/[0-9]+\/[0-9]+/)) {
    addGlobalStyle(".coords {min-width: 130px;}");

    addGlobalStyle("img.jumpTo, img.scanIcon {cursor: pointer;}");
    addGlobalStyle("div.contextMenu { background-color: rgba(100, 100, 100, 0.8); min-width: 100px; padding: 10px; display: none; position: absolute; border: 1px solid #fff}");
    addGlobalStyle("div.contextMenuItem { background-color: rgba(100, 100, 100); margin: 2px; padding-left: 3px; border-left: 1px solid #000 }");
    addGlobalStyle("div.contextMenuItem:hover { background-color: rgba(80, 80, 80, 1); }");

    var newDiv = document.createElement('div');
    newDiv.id = 'dhFleetListMenu';
    newDiv.className = 'contextMenu';
    newDiv.style.minHeight = '50px';
    document.body.appendChild(newDiv);

    var foundComms = false;

    if (!jsonPageDataCache.locationList) {
        console.log("Missing jsonPageDataCache.locationList");
    } else {
        for (i=0; i<jsonPageDataCache.locationList.length; i++) {
            p = jsonPageDataCache.locationList[i];
            for (j=0; j<p.mobileUnitCount.unitList.length; j++) {
                if (p.mobileUnitCount.unitList[j].name === "Comms_Satellite" && p.mobileUnitCount.unitList[j].amount === 1) {
                    foundComms = true;
                    break;
                }
            }
            if (foundComms) {
                break;
            }
        }
    }

    buf = document.querySelectorAll('div .planets');
    for (i = 0; i<buf.length; i++) {
        p = buf[i].querySelector('div .right');
        n = buf[i].querySelector('span');

        if (n.querySelector('a')) {
            n = n.querySelector('a');
        }

        /* Actual coordinates */
        n = n.innerHTML;

        if (foundComms) {
            r = document.createElement('img');
            r.id = makeId(8);
            console.log(imageContainer["scanPlanet.png"]);
            r.src = imageContainer["scanPlanet.png"];
            r.setAttribute('coordinate', n);
            r.className = 'scanIcon';
            r.style.paddingRight = '4px';
            r.addEventListener("click", showScanMenu, false);
            p.appendChild(r);
        }

        m = document.createElement('img');
        m.id = makeId(8);
        m.src = imageContainer["jumpToIcon.png"];
        m.setAttribute('coordinate', n);
        m.className = 'jumpTo';
        m.addEventListener("click", showJumpMenu, false);
        p.appendChild(m);
    }
}

/* Script by Mordread -> use ARROW keys to navigate in planet details
   fix by Arcopix - removed anonymous function, since it was useless */
if (document.querySelector('#planetHeader .planetName a:nth-of-type(1)')) {
    document.addEventListener("keydown", e => {
        if (document.activeElement.tagName==='INPUT') {
            return;
        }
        if (e.which === 37 && !e.altKey && !e.ctrlKey) {
            document.querySelector('#planetHeader .planetName a:nth-of-type(1)').click();
        }
        if (e.which === 39 && !e.altKey && !e.ctrlKey) {
            document.querySelector('#planetHeader .planetName a:nth-of-type(2)').click();
        }
    });
}

if (window.location.href.match(/\/fleet\/[0-9]+/)) {
    buf = getQueryParams(document.location.search);
    
    if (buf.c0 && buf.c1 && buf.c2 && buf.c3) {
        addGlobalStyle("@keyframes color { 0%   { background: #A00; } 50% { background: #000; } 100% { background: #A00; } }");
        addGlobalStyle(".blinkButton { animation: color 1s infinite linear }");

        showNotification("Make sure you actually queue your fleet.");

        document.querySelector('input[name="coordinate.0"]').value = buf.c0;
        document.querySelector('input[name="coordinate.1"]').value = buf.c1;
        document.querySelector('input[name="coordinate.2"]').value = buf.c2;
        document.querySelector('input[name="coordinate.3"]').value = buf.c3;

        buf = document.querySelector('input[name="coordinate.0"]').parentNode.parentNode.parentNode;
        buf = buf.querySelector('input[type="Submit"]');
        buf.className = 'blinkButton';
    }
    
    if (document.getElementById('fleetQueue')) {
        buf = document.getElementById('fleetQueue');
        p = buf.querySelector('div .header.border');
        
        var screenshotIcon = document.createElement('div');
        screenshotIcon.className = 'right relative';
        screenshotIcon.style = 'cursor:pointer; margin-top: auto; margin-bottom: auto;';
        screenshotIcon.innerHTML = '<img alt="Take a screenshot" style="margin-top: 4px" src="' + imageContainer["screenshotIcon.png"] + '"/>';

        screenshotIcon.addEventListener('click', function() { generateScreenshot('fleetQueue') }, false);
        
        p.appendChild(screenshotIcon);
    }
    
    q = document.querySelector('div .fleetRight');
    if (q) {
        q = q.querySelectorAll('div .fleetRight');
        for (i = 0; i<q.length; i++) {
            buf = q[i];
            p = buf.querySelector('div .header.border');
            currentTab = '';
            
            if (p.innerText.trim()==='Current Action') {
                currentTab = 'currentAction';
            }
            
            if (p.innerText.trim()==='Fleet Composition') {
                currentTab = 'fleetComposition';
            }
            
            if (currentTab==='') {
                continue;
            }
            
            var screenshotIcon = document.createElement('div');
            screenshotIcon.className = 'right relative';
            screenshotIcon.style = 'cursor:pointer; margin-top: auto; margin-bottom: auto;';
            screenshotIcon.innerHTML = '<img alt="Take a screenshot" style="margin-top: 4px" src="' + imageContainer["screenshotIcon.png"] + '"/>';
            
            /* The div is missing ID */
            buf.id = currentTab;
            if (p.innerText.trim()==='Current Action') {
                screenshotIcon.addEventListener('click', function() { generateScreenshot('currentAction') }, false);
            }
            if (p.innerText.trim()==='Fleet Composition') {
                screenshotIcon.addEventListener('click', function() { generateScreenshot('fleetComposition') }, false);
            }
            
            p.appendChild(screenshotIcon);
        }
/*
        buf = document.getElementById('fleetQueue');
        p = buf.querySelector('div .header.border');
        
        var screenshotIcon = document.createElement('div');
        screenshotIcon.className = 'right relative';
        screenshotIcon.style = 'cursor:pointer; margin-top: auto; margin-bottom: auto;';
        screenshotIcon.innerHTML = '<img alt="Take a screenshot" style="margin-top: 4px" src="' + imageContainer["screenshotIcon.png"] + '"/>';

        screenshotIcon.addEventListener('click', function() { generateScreenshot('fleetQueue') }, false);
        
        p.appendChild(screenshotIcon);
*/
    }
}

/* Navigate through fleets using ARROW keys */
if (location.href.includes('/fleet/')&&document.querySelector('.nextPrevFleet')) {
    /* If we have only RIGHT fleet, meaning we are only at first one, activate RIGHT ARROW ONLY */
    if (document.querySelector('.nextPrevFleet').innerText === '»') {
        document.addEventListener("keydown", e => {
            if (document.activeElement.tagName==='INPUT') {
                return;
            }
            if (e.which === 39 && !e.altKey && !e.ctrlKey) {
                document.querySelectorAll('.nextPrevFleet a:nth-of-type(1)')[0].click();
            }
        });
    } else if (typeof (document.querySelectorAll('.nextPrevFleet')[0]) !== 'undefined' &&
               typeof (document.querySelectorAll('.nextPrevFleet')[1]) !== 'undefined') {
        document.addEventListener("keydown", e => {
            if (document.activeElement.tagName==='INPUT') {
                return;
            }
            if (e.which === 37 && !e.altKey && !e.ctrlKey) {
                document.querySelectorAll('.nextPrevFleet a:nth-of-type(1)')[0].click();
            }
            if (e.which === 39 && !e.altKey && !e.ctrlKey) {
                document.querySelectorAll('.nextPrevFleet a:nth-of-type(1)')[1].click();
            }
        });
    } else { /* In case of '«' */
        document.addEventListener("keydown", e => {
            if (document.activeElement.tagName==='INPUT') {
                return;
            }
            if (e.which === 37 && !e.altKey && !e.ctrlKey) {
                document.querySelectorAll('.nextPrevFleet a:nth-of-type(1)')[0].click();
            }
        });
    }
}

/* Convert any friendly planets to link to the targeted planet instead of navigation */
buf = document.querySelectorAll(".friendly");
for (i=0; i<buf.length; i++) {
    /* If it is link to a fleet -> do not replace as the fleet is named after the planet */
    if (buf[i].querySelector('a').href.includes('/fleet/')) {
        continue;
    }
    let p = getPlanetByName(buf[i].innerText);
    if (!p) {
        continue;
    }
    let plLink = buf[i].querySelector('a');
    plLink.href = "/planet/"+p.id+"/"
}

if (location.href.includes('/fleets/')) {
    /* Page filtering based on the input in the search box */
    buf = document.querySelector('div .header.pageTitle');
    buf.innerHTML = '<span>' + buf.innerHTML + '</span>';
    buf.innerHTML += '<input type="text" id="filterFleet" class="fleet-filter large-input" placeholder="Filter fleets">';
    document.getElementById('filterFleet').addEventListener("keyup", filterFleet, false);

    document.addEventListener("keydown", (e) => {
        if (document.activeElement.tagName==='INPUT') {
            if (e.which === 27) {
                document.getElementById('filterFleet').value = '';
            }
            return;
        }
        if (e.which === 70 && e.ctrlKey) {
            document.getElementById("filterFleet").focus();
            console.log('Focusing on filterFleet');
            console.log(e.key);
            console.log(e);
            e.preventDefault();
        }
        if (e.which === 191) {
            document.getElementById("filterFleet").focus();
            console.log('Focusing on filterFleet');
            console.log(e.key);
            console.log(e);
            e.preventDefault();
        }
    });

    if (cfgFleetSorting) {
        sortFleets();
    }

    /* Cache fleets for future usage */
    cacheFleets();
}

if (window.location.href.match(/\/fleet\/[0-9]+[\/]?$/)) {
    improveResXferPlanner(document.getElementById('fleetQueue'));
}

if (window.location.href.match(/\/fleet\/[0-9]+\/transfer\/(location|mobile)\/[0-9]+[\/]?$/)) {
    improveResXfer();
}

if (window.location.href.match(/\/fleet\/[0-9]+[\/]?$/)) {
    parseFleet();
}

function parseFleet()
{
	var fleetArray = JSON.parse(localStorage.getItem('fleetArray'));
	var fleetID = window.location.href.match(/\/fleet\/([0-9]+)[\/]?$/);
	fleetID = parseInt(fleetID[1]);
	var composition = {};
	var s;
	
	p = getFleetById(fleetID);
	
	/* Parse fleet composition */
    q = document.querySelectorAll('.structureImage');
    for (i=0; i<q.length; i++) {
		s = [];
		t = q[i].parentNode.querySelectorAll('div');
		if (t[1]) {
			t = t[1].innerText.trim();
			console.log(t);
			s[1] = parseInt(t.split(' ', 1)[0].replace('x', ''));
			s[0] = t.slice(t.indexOf(' ')).trim().replaceAll(' ', '_');
			composition[s[0]] = s[1];
		} else {
			console.log("Cannot find node");
		}
    }
	
    /* If we need to add it */
    if (!p) {
        q = (document.querySelector('div .header.pageTitle').querySelectorAll('div .left')[2]).innerText;
        q = q.trim();
        if (q) {
            console.log('Adding fleet ' + q + ' to the fleetArray cache');
            fleetArray.push({'id': fleetID, 'name': q, 'url': window.location.href, 'composition': composition});
            localStorage.setItem('fleetArray', JSON.stringify(fleetArray));
        } else {
            console.log('Cannot find name for fleet with URL ' + window.location.href);
			return;
        }
    } else {
		for (i=0; i<fleetArray.length; i++) {
			if (fleetArray[i].id === fleetID) {
				fleetArray[i].composition = composition;
				break;
			}
		}
		localStorage.setItem('fleetArray', JSON.stringify(fleetArray));
	}
	
	console.log(composition);
}

/* Fix sorting of planets */
if (cfgPlanetSorting!=='') {
    /* Sort planets in select drop down in Fleet command */
    var planetSelect;
    planetSelect = document.querySelector('select[name="locationId"]')
    if (planetSelect) {
        const options = Array.from(planetSelect.options);
        const homePlanet = options.shift();

        options.sort((a, b) => {
            const textA = a.text;
            const textB = b.text;
            
            if (cfgPlanetSorting==='name') {
                return textA.localeCompare(textB);
            }
            
            if (cfgPlanetSorting==='pop') {
                const p1 = getPlanetByName(textA.trim());
                const p2 = getPlanetByName(textB.trim());
                workerA = getPopulationOfPlanet(p1);
                workerB = getPopulationOfPlanet(p2);
                if (workerA === workerB) {
                    return textA.localeCompare(textB);
                } else {
                    return (workerA > workerB)?-1:1;
                }
            }
       });

        // Clear the existing options
        planetSelect.innerHTML = '';
        planetSelect.appendChild(homePlanet);
        // Re-insert the sorted options
        options.forEach((option) => {
            planetSelect.appendChild(option);
        });
    }

    if (location.href.includes('/planets/')) {
        updatePlanetSorting(cfgPlanetSorting);
    }
} else {
    console.log("Planet sorting disabled");
}

if (cfgShowSM) {
    if (location.href.includes('/planets/')) {
        let planetsDiv = document.querySelectorAll('div .locationWrapper');
        for (i=0; i<planetsDiv.length; i++) {
            let coord = planetsDiv[i].querySelector('div .coords').innerText;
            p = getPlanetByCoord(coord);
            /* FIXME This is a bit dirty without any checks */
            q = planetsDiv[i].querySelectorAll('div .planetHeadSection')[0];
            q = q.querySelector('div');

            if (getAmount(p.mobileUnitCount.unitList, "Jump_Gate")>0) {
                q.innerHTML += '<div class="right resource"><img style="border: 1px solid #666;" src="/images/units/main/structures/jump_gate.jpg" title="' + p.name + ' has Jump Gate" alt="' + p.name + ' has Jump Gate" width="18" height="18"></div>';
            }
            if (getAmount(p.mobileUnitCount.unitList, "Hyperspace_Beacon")>0) {
                q.innerHTML += '<div class="right resource"><img style="border: 1px solid #666;" src="/images/units/main/structures/hyperspace_beacon.jpg" title="' + p.name + ' has Hyperspace Beacon" alt="' + p.name + ' has Hyperspace Beacon" width="18" height="18"></div>';
            }
            if (getAmount(p.mobileUnitCount.unitList, "Space_Tether")>0) {
                q.innerHTML += '<div class="right resource"><img style="border: 1px solid #666;" src="/images/units/main/structures/space_tether.jpg" title="' + p.name + ' has Space Tether" alt="' + p.name + ' has Space Tether" width="18" height="18"></div>';
            }
        }
    }
}

if (cfgShowAS) {
	if (location.href.includes('/planets/')) {
		let planetsDiv = document.querySelectorAll('div .locationWrapper');
		for (i=0; i<planetsDiv.length; i++) {
			let coord = planetsDiv[i].querySelector('div .coords').innerText;
			p = getPlanetByCoord(coord);
			/* FIXME This is a bit dirty without any checks */
			q = planetsDiv[i].querySelectorAll('div .planetHeadSection')[0];
			
			q = q.querySelector('div');
			
			shipBuf = [];
			wfShipStr = "";
			trShipStr = "";
			
			for (j=0; j<p.mobileUnitCount.unitList.length; j++) {
				t = p.mobileUnitCount.unitList[j].name;
				q = p.mobileUnitCount.unitList[j].amount;
				
				if (!ships[t]) {
					continue;
				}
				
				shipBuf[t] = q;
			}
			
			for ([t, q] of Object.entries(ships)) {
				/* If not set - no such ships continue */
				if (typeof shipBuf[t] === 'undefined') {
					continue;
				}
				
				if (logisticsCapacity[t]) {
					trShipStr = trShipStr + " <em>" + shipBuf[t] + "</em> " + t.replaceAll('_', ' ');
				} else {
					wfShipStr = wfShipStr + " <em>" + shipBuf[t] + "</em> " + t.replaceAll('_', ' ');
				}
			}
			
			/* Nothing landed - skip */
			if (trShipStr==="" && wfShipStr==="") {
				continue;
			}
			
			/* Both are set */
			if (trShipStr!=="" && wfShipStr!=="") {
				shipStr = wfShipStr + " | " + trShipStr;
			} else {
				shipStr = wfShipStr + trShipStr;
			}
			
			t = document.createElement('div');
			t.className = 'planetHeadSection';
			t.style.marginTop = '2px';
			t.innerHTML = `
<div class="lightBorder ofHidden opacBackground padding fleetList">
  <div class="left">
    <span class="fleet" style="font-weight: bold">Landed ships: </span>
    <span class="fleet">${shipStr}</span>
  </div>
</div>`;
			planetsDiv[i].querySelector('div').appendChild(t);
		}
	}
}

if (location.href.includes('/planets/')) {
    addGlobalStyle(".btn { position: absolute; width: 120px; height: 25px; cursor: pointer; background: transparent; border: 1px solid #71A9CF; outline: none; transition: 1s ease-in-out; }");
    addGlobalStyle("svg { position: absolute; left: 0; top: 0; fill: none; stroke: #fff; stroke-dasharray: 150 480; stroke-dashoffset: 150; transition: 1s ease-in-out; }");

    addGlobalStyle(".btn:hover { transition: 1s ease-in-out; background: #2F75BA; }");

    addGlobalStyle(".btn:hover svg { stroke-dashoffset: -480; }");

    addGlobalStyle(".btn span { color: white; font-size: 12px; font-weight: 100; }");

    buf = document.querySelector('div .header.pageTitle');
    buf.innerHTML = '<span>' + buf.innerHTML + '</span>';
    buf.innerHTML += '<span style="float: right; padding-right: 130px; padding-top: 7px;"><button id="btnStats" class="btn"><svg width="120px" height="25px" viewBox="0 0 120 25" class="border"><polyline points="119,0 119,24 0,24 0,0 119,0" class="bg-line" /><polyline points="119,0 119,24 1,24 0,0 119,0" class="hl-line" /></svg><span>Statistics</span></button>';
    buf.innerHTML += '<span style="float: right; padding-right: 130px; padding-top: 7px;"><button id="btnLogst" class="btn"><svg width="120px" height="25px" viewBox="0 0 120 25" class="border"><polyline points="119,0 119,24 0,24 0,0 119,0" class="bg-line" /><polyline points="119,0 119,24 1,24 0,0 119,0" class="hl-line" /></svg><span id="labelLogst">Logistics</span></button>';
    buf.innerHTML += '<span style="float: right; padding-right: 130px; padding-top: 7px;"><button id="btnExport" class="btn"><svg width="120px" height="25px" viewBox="0 0 120 25" class="border"><polyline points="119,0 119,24 0,24 0,0 119,0" class="bg-line" /><polyline points="119,0 119,24 1,24 0,0 119,0" class="hl-line" /></svg><span id="labelLogst">Export</span></button>';
    buf.innerHTML += '<input type="text" id="filterPlanet" class="fleet-filter large-input" style="margin-top: 6px;" placeholder="Filter planets">';

    document.getElementById('btnStats').addEventListener("click", generateStats, false);
    document.getElementById('btnLogst').addEventListener("click", generateLogistics, false);
    document.getElementById('btnExport').addEventListener("click", exportPlanets, false);
    
    
    document.getElementById('filterPlanet').addEventListener("keyup", filterPlanet, false);

    document.addEventListener("keydown", (e) => {
        if (document.activeElement.tagName==='INPUT') {
            if (e.which === 27) {
                document.getElementById('filterPlanet').value = '';
            }
            return;
        }
        if (e.which === 70 && e.ctrlKey) {
            document.getElementById("filterPlanet").focus();
            console.log('Focusing on filterPlanet');
            console.log(e.key);
            console.log(e);
            e.preventDefault();
        }
        if (e.which === 191) {
            document.getElementById("filterPlanet").focus();
            console.log('Focusing on filterPlanet');
            console.log(e.key);
            console.log(e);
            e.preventDefault();
        }
    });

}

if (window.location.href.match(/\/planet\/[0-9]+\//)) {
    el = document.getElementsByTagName('img');
    for (i=0; i<el.length; i++) {
        if (el[i].src.match(/\/destroy_.*\.jpg/)) {
            const imgFilename = el[i].src.split('/').pop();
            if (imageContainer[imgFilename]) {
                el[i].src = imageContainer[imgFilename];
            } else {
                console.log('No image override for ' + imgFilename);
            }
        }
    }
}

/* Fix sorting of radars */
var radars, radar, fleetRow;
if (cfgRadarSorting && location.href.includes('/radar/')) {
    /* Get and sort out each coms/radar section */
    radars = document.getElementsByClassName('opacDarkBackground');
    for (i=0; i<radars.length; i++) {
        /* Skip the header */
        if (radars[i].className.includes('paddingMid')) {
            continue;
        }

        radar = radars[i];
        fleetRow = radar.getElementsByClassName('entry');

        /* Clone radar rows and remove the original ones */
        let crow = [];
        for (j=fleetRow.length-1; j>=0; j--) {
            crow[j] = fleetRow[j];
            fleetRow[j].parentNode.removeChild(fleetRow[j]);
        }

        n = 0;
        /* For every possible TICK, reducing output the rows */
        for (m=24; m>=0; m--) {
            for (j=crow.length-1; j>=0; j--) {
                if (crow[j]&&crow[j].getElementsByClassName('turns')[0]&&parseInt(crow[j].getElementsByClassName('turns')[0].innerText)==m) {
                    if (n++%2===0) {
                        crow[j].className = "opacBackground lightBorderBottom entry";
                    } else {
                        crow[j].className = "opacLightBackground lightBorderBottom entry";
                    }
                    //alert(crow[j].className);
                    radars[i].appendChild(crow[j]);
                    /* Nullify the row, so we would not have to search it by class, text and so on */
                    crow[j] = 0;
                }
            }
        }

        /* Make sure to add any rows that are not already added/invalidated */
        for (j=crow.length-1; j>=0; j--) {
            if (crow[j]) {
                radars[i].appendChild(crow[j]);
            }
        }
    }
}

/* Smart input for coords */
if (document.querySelector('input[name="coordinate.0"]')) {
    var el = document.querySelector('input[name="coordinate.0"]');
    el.addEventListener('keydown', function(e) {
        if(e.which === 110 || e.which === 188 || e.which === 190) {
            e.preventDefault();
            document.querySelector('input[name="coordinate.1"]').value = '';
            document.querySelector('input[name="coordinate.1"]').focus();
        }
    });

    el = document.querySelector('input[name="coordinate.1"]');
    el.addEventListener('keydown', function(e) {
        if(e.which === 110 || e.which === 188 || e.which === 190) {
            e.preventDefault();
            document.querySelector('input[name="coordinate.2"]').value = '';
            document.querySelector('input[name="coordinate.2"]').focus();
        }
        if (e.which === 8 && this.value==='') {
            e.preventDefault();
            document.querySelector('input[name="coordinate.0"]').focus();
        }
    });

    el = document.querySelector('input[name="coordinate.2"]');
    el.addEventListener('keydown', function(e) {
        if(e.which === 110 || e.which === 188 || e.which === 190) {
            e.preventDefault();
            document.querySelector('input[name="coordinate.3"]').value = '';
            document.querySelector('input[name="coordinate.3"]').focus();
        }
        if (e.which === 8 && this.value==='') {
            e.preventDefault();
            document.querySelector('input[name="coordinate.1"]').focus();
        }
    });

    el = document.querySelector('input[name="coordinate.3"]');
    el.addEventListener('keydown', function(e) {
        if (e.which === 8 && this.value==='') {
            e.preventDefault();
            document.querySelector('input[name="coordinate.2"]').focus();
        }
    });
}

if (window.location.pathname.match(/\/planet\/[0-9]+\/comms\/$/)) {
    /* Add short onclick on different comms scans to select that type of scan */
    k = document.getElementsByTagName('form')[0];
    l = k.querySelectorAll('div.entry');
    for (i=0; i<l.length; i++) {
        if (l[i].className.includes('coordsInput')) {
            continue;
        }
        l[i].addEventListener('click', function(e) {
            this.getElementsByTagName('input')[0].click();
        });
    }

    /* If coordinates are set as parameters, set the coordinates for scanning */
    buf = getQueryParams(document.location.search);
    if (buf.c0 && buf.c1 && buf.c2 && buf.c3) {
        document.getElementsByName('coordinate.0')[0].value = buf.c0;
        document.getElementsByName('coordinate.1')[0].value = buf.c1;
        document.getElementsByName('coordinate.2')[0].value = buf.c2;
        document.getElementsByName('coordinate.3')[0].value = buf.c3;
    }
}

/* Request confirmation when kicking people from alliance */
if (window.location.pathname==='/alliances/') {
    k = document.querySelectorAll('input[type=submit]');
    for (i=0; i<=k.length; i++) {
        if (!k[i]) {
            continue;
        }
        if (k[i].value==='Kick Member') {
            l=k[i];
            /* Get the player name. This is a bit ugly, but oh well... */
            let playerName = l.parentNode.parentNode.parentNode.querySelector('div.name').innerText;
            l.confirmString = "Are you sure you want to kick " + playerName + "?";
            l.addEventListener('click', function(evt) { if (confirm(evt.currentTarget.confirmString)===false) evt.preventDefault(); });
        }
        if (k[i].value==='Leave Alliance') {
            l=k[i];
            l.addEventListener('click', function(evt) { if (confirm("Are you sure you want to leave?")===false) evt.preventDefault(); });
        }
    }
}

/* Add <label on couple of elements */
/* This needs a bit of optimization as it is ... well not great */
var allForms = document.getElementsByTagName("form");
for (i=0; i<allForms.length; i++) {
    var allDivs = allForms[i].getElementsByTagName("div");
    for (j=0; j<allDivs.length; j++) {
        k = allDivs[j].innerText.trim();
        if (k !== "Repeat:" && k !== "Repeat" && k !== "All Resources:" && k !== "All Resources") {
            continue;
        }
        /* We've reached a div with inner text "Repeat" or "All Resources" */
        var siblings = allDivs[j].parentNode.children;
        for (m = 0; m < siblings.length; m++) {
            var sibling = siblings[m];
            /* Test out siblings to find a sibling DIV which has childen */
            if (sibling === allDivs[j] && !(sibling.tagName === 'DIV' && sibling.children)) {
                continue;
            }

            var children = sibling.children;
            for (n = 0; n < children.length; n++) {
                /* Test out the siblings for CHECKBOX(es) */
                if (children[n].tagName === 'INPUT' && children[n].type === 'checkbox') {
                    /* We've found a checkbox, time to test if it has ID and if not allocate one for it */

                    /* All such cases do not have ID at the current time, but who knows */
                    if (children[n].id === '') {
                        const newId = makeId(8);
                        children[n].id = newId;
                        /* Update the original DIV to have label with the newId of the checkbox */
                        allDivs[j].innerHTML = "<label for='" + newId + "'>" + k + "</label>";
                    } else {
                        /* Update the original DIV to have label with the ID of the checkbox */
                        allDivs[j].innerHTML = "<label for='" + children[n].id + "'>" + k + "</label>";
                    }
                }
            }
        }
    }
}

/* End of script */

/* === START OF FEATURE FUNCTIONS === */

function showWhatsNew()
{
    console.log("Showing whats new");
    var i = 0;
    const main = document.getElementById('contentBox');
    if (!main) {
        return;
    }
    localStorage.setItem('cfgShowedVersion', 'v0.4.0006');

    addGlobalStyle('.topic {padding: 10px; cursor: pointer; border-bottom: 1px solid #ddd; letter-spacing: 1px; padding-left: 20px;}');
    addGlobalStyle('.topicContent { display: none; padding: 10px; font-size: 1.2em; border-bottom: 1px solid #ddd; }');
    addGlobalStyle('.topicContent.show { display:block; }');
    main.innerHTML = '<div class="header border pageTitle"><span>DG utilities help</span></div><div class="opacBackground ofHidden padding" id="helpBox"></div>';

    const help = document.getElementById('helpBox');

    help.innerHTML = '';
    help.innerHTML += `<div class="lightBorder ofHidden opacBackground header topic"
    onclick="c = document.querySelectorAll(\'.topicContent\'); c.forEach((s, i) => { if (i === ` + i++ + `) { s.classList.toggle(\'show\'); } else {s.classList.remove(\'show\'); } });">
      v0.4.0006
    </div>`;

    help.innerHTML += `<div class="topicContent show">
    Version 0.4.0006 comes with the following changes:<br/><br/>
    <strong>New features:</strong>
    <ul>
      <li>Capability to export the planet list with various details to a CSV file for download</li>
      <li>Showing speed modifier buildings (ST/HB/JG) in planet list</li>
      <li>During fleet transfers, available resources units and ships are automatically inputed by clicking on the appropriate resource/ship.</li>
    </ul>
    <br/>
    <strong>Updates:</strong>
    <ul>
      <li>Refactored generation of general statistics to be based on the provided JSON data</li>
      <li>Introduced information about population and soldier growth in the general statistics</li>
      <li>Introduced summary information about current construction (buildings, ships and soldiers)</li>
    </ul>
    <br/>
    <strong>Bug Fixes:</strong>
    <ul>
      <li>Fixed issue with the context menu for fleet orders not updating coordinates upon follow up usage</li>
      <li>Fixed issue with the context menu for scanning not updating coordinates upon follow up usage</li>
      <li>Fixed issue with planet navigation using arrow keys while inputting information in an input</li>
      <li>Fixed issue with missing coordinates within generated screenshots in some scenarios</li>
    </ul><br/>
    <hr/><br/></div>`;

    help.innerHTML += `<div class="lightBorder ofHidden opacBackground header topic"
    onclick="c = document.querySelectorAll(\'.topicContent\'); c.forEach((s, i) => { if (i === ` + i++ + `) { s.classList.toggle(\'show\'); } else {s.classList.remove(\'show\'); } });">
      v0.4.0005
    </div>`;

    help.innerHTML += `<div class="topicContent">
    Version 0.4.0005 comes with the following changes:<br/><br/>
    <strong>New features:</strong>
    <ul>
      <li>Added confirmation upon leaving the current alliance</li>
      <li>Improved resource transfer on fleet actions</li>
      <li><strong>Scan planet</strong> icon was added on each planet in Navigation. This allows shortcut for scanning the target.</li>
      <li>Added built-in CHANGELOG</li>
    </ul>
    <br/>
    <strong>Updates:</strong>
    <ul>
      <li>Updated bugfix for missing images <em>(added all buildings)</em></li>
      <li>Creating a new fleet now adds it to the fleetArray cache without having to visit the <a href="/fleets/">Fleet List</a> page</li>
    </ul>
    <br/>
    <strong>Bug Fixes:</strong>
    <ul>
      <li>Fixed issues with NAP/CAP colorization in player rankigs</li>
    </ul><br/>
    <strong>Removed:</strong>
    <ul>
      <li>Unused input TODO/???? was removed from the configuration</li>
    </ul>
    <hr/><br/></div>`;

    help.innerHTML += `<div class="lightBorder ofHidden opacBackground header topic"
    onclick="c = document.querySelectorAll(\'.topicContent\'); c.forEach((s, i) => { if (i === ` + i++ + `) { s.classList.toggle(\'show\'); } else {s.classList.remove(\'show\'); } });">
      v0.4.0004
    </div>`;

    help.innerHTML += `<div class="topicContent">
    Version 0.4.0004 comes with the following changes:<br/><br/>
    <strong>New features:</strong>
    <ul>
      <li><strong>Move to planet</strong>icon was added in Navigation on each planet which provides handy shortcut to queue a fleet to move to that target</li>
      <li>Overall planet statistics <em>(HTML & Markdown formatting)</em></li>
      <li>Logistic calculator in Planet List per planet</li>
      <li>DG utilities built in help</li>
    </ul>
    <br/>
    <strong>Updates:</strong>
    <ul>
      <li>Minor code cleanup</li>
      <li>Optimization for Repeat label workaround</li>
      <li>Optimization for colorization based on NAP/CAP filters</li>
      <li>Added userscript icon</li>
      <li>Implemented bugfix for missing images for destroying buildings by replacing those with local images <em>(only basic mines are added at the current time)</em></li>
    </ul>
    <br/>
    <strong>Bug Fixes:</strong>
    <ul>
      <li>Colorization now applies the same effect to the border of the planet</li>
      <li>Fixed initial configuration initialization</li>
    </ul>
    <br/>
    <strong>Removed:</strong>
    <ul>
      <li>Some debug output was removed</li>
    </ul>
    <hr/><br/></div>`;
}

function getImageURL(file)
{
    window.alert(browser + " " + file);
    return chrome.runtime.getURL("images/"+ file);

}

function showHelp()
{
    console.log("Showing help");

    const main = document.getElementById('contentBox');

    localStorage.setItem('cfgShowedHelp', 'v0.4.0004');

    addGlobalStyle('.topic {padding: 10px; cursor: pointer; border-bottom: 1px solid #ddd; letter-spacing: 1px; padding-left: 20px;}');
    addGlobalStyle('.topicContent { display: none; padding: 10px; font-size: 1.2em; border-bottom: 1px solid #ddd; }');
    addGlobalStyle('.topicContent.show { display:block; }');
    main.innerHTML = '<div class="header border pageTitle"><span>DG utilities help</span></div><div class="opacBackground ofHidden padding" id="helpBox"></div>';

    const help = document.getElementById('helpBox');

    help.innerHTML = '';

    help.innerHTML += `<div class="lightBorder ofHidden opacBackground header topic"
    onclick="c = document.querySelectorAll(\'.topicContent\'); c.forEach((s, i) => { if (i === 0) { s.classList.toggle(\'show\'); } else {s.classList.remove(\'show\'); } });">
      DG utilties
    </div>`;
    help.innerHTML += `<div class="topicContent show">DG utitilies are set of fixes and improvements for our belloved DarkGalaxy.<br/>
    <strong>New features:</strong>
    <ul>
      <li>Colorizatopm of friendly alliances player names and alliance tags (NAP and CAP coloring)
      <li>Clicking on a player name now navigates to the internal mailing system</li>
      <li>Improved planet, fleet and navigation by enabling ARROW KEYS (left and right) for switching to previous/next</li>
      <li>Capability to generate a screenshot <em>(stores it in the clipboard or sends it to a Discord channel via user defined webhook)</em></li>
      <li>Sorting of planets by name <em>(both planet listing and fleet navigation drop down)</em></li>
      <li>Sorting of fleets by name in fleet listing</li>
      <li>Sorting comms in the radar section based on turns</li>
      <li>Fleet queuing from the Navigation</li>
      <li>General planet income statistics</li>
      <li>Logistic calculator per planet</li>
    </ul>
    <strong>Minor improvements:</strong>
    <ul>
      <li>Cancelling the top building/ship/soldier which is being built at the moment now requires confirmation</li>
      <li>Added confirmation on kicking members</li>
      <li>Labels for Repeat and All resources are now activating the checkbox</li>
      <li>Selecting scan type in comms can be done by clicking anywhere on the row</li>
      <li>Smart inputs on coordinates in fleet orders and scanning (using dot and backspace now navigates between the coordinates)</li>
    </ul>
    <strong>Bug fixes:</strong>
    <ul>
      <li>Some missing images were restored</li>
    </ul>
    <hr/>
    For additional information for some of the features, click on the respective section below: <br/></div>`;
    help.innerHTML += `<div class="lightBorder ofHidden opacBackground header topic"
    onclick="c = document.querySelectorAll(\'.topicContent\'); c.forEach((s, i) => { if (i === 1) { s.classList.toggle(\'show\'); } else {s.classList.remove(\'show\'); } });">
      Colorization
    </div>`;
    help.innerHTML += `<div class="topicContent">
    <p>In order to use special colorization of players based on their alliance for NAP/CAP purposes,
    click on settings icon (<img style="vertical-align: middle;" src="` + imageContainer['confIcon.png'] + `"/>)
    in the top right menu. There you can configure NAP and CAP list as well as setting custom color for each group:</p>
    <ul>
    <li>Your should specify the alliance TAG(s) in the respective inout.</li>
    <li>Multiple alliance tags are supported (using coma as delimiter)</li>
    <li>The alliance tags are CASE sensitive</li>
    <li>Setting NAP list to "DalCom,EST" and CAP list to "EsRi,GP" will result in something like the image below:</li>
    </ul>
    <img style="padding: 10px;" src="` + imageContainer['navExample.png'] + `"/>
    </div>`;

    help.innerHTML += `<div class="lightBorder ofHidden opacBackground header topic"
    onclick="c = document.querySelectorAll(\'.topicContent\'); c.forEach((s, i) => { if (i === 2) { s.classList.toggle(\'show\'); } else {s.classList.remove(\'show\'); } });">
      Screenshots
    </div>`;
	let imgSrc = getImageURL("screenshotExample.png");

    help.innerHTML += `<div class="topicContent">
    <p>DG utilities comes with integrated screenshot capabiltity. This allows the player to easily share information
    from the game to his friends, allies, and sometimes - even enemies. In order to generate a screenshot click on the
    icon (<img style="vertical-align: middle;" src="` + imageContainer['screenshotIcon.png'] + `"/>) in the top menu.
    This will generate a screenshot of the main area of the game. If you've configured a Discord webhook in the settings
    (<img style="vertical-align: middle;" src="` + imageContainer['confIcon.png'] + `"/>) the generated screenshot will
    be automatically sent to it. The URL in question should look something like this: <br/>
    <pre style='padding-left: 50px; border-left: 3px solid #fff;'>https://discord.com/api/webhooks/1234567890123456789/kjdUEuqnsduqwrgQG1_asdhUQubfqu13hsUSQhQ_GYJKQVBDyhqg31gbmasHSs-ggWP</pre>
    <div class="green seperator">
      <strong>Tip:</strong> Pressing <em>Ctrl</em> key on your keyboard will always store the image
    to your clipboard regardless of your Discord webhook configuration in the settings.
    </div><br/>
    Here's an example:
    </p>
    <img style="padding: 10px;" src="`+imgSrc+`"/>
    </div>`;

    help.innerHTML += `<div class="lightBorder ofHidden opacBackground header topic"
    onclick="c = document.querySelectorAll(\'.topicContent\'); c.forEach((s, i) => { if (i === 3) { s.classList.toggle(\'show\'); } else {s.classList.remove(\'show\'); } });">
      Fleet queuing
    </div>`;
    help.innerHTML += `<div class="topicContent">
    <p>While browsing the in-game Navigation you can press the queue fleet icon (<img style="vertical-align: middle;" src="` + imageContainer['jumpToIcon.png'] + `"/>)
    which will pop a context menu with your current fleets.</p>
    <div class="error seperator"><strong>Warning:</strong> This will only open the selected fleet and populate the coordinates. You'll have to confirm the fleet movement manually.</div>
    <img style="padding: 10px;" src="` + imageContainer['navigationExample.png'] + `"/>
    </div>`;

    help.innerHTML += `<div class="lightBorder ofHidden opacBackground header topic "
    onclick="c = document.querySelectorAll(\'.topicContent\'); c.forEach((s, i) => { if (i === 4) { s.classList.toggle(\'show\'); } else {s.classList.remove(\'show\'); } });">
      Planet logistics
    </div>`;
    help.innerHTML += `<div class="topicContent">
    <p>Within <a href="/planets/">Planet List</a> you'll notice a "Logistics" button in the top header.
    Activating this functionality will calculate the required transport fleet in order to ship the entire
    income of each planet. Initially the calculation is based on round trip time of 32 turns (standard
    travel time within the same Galaxy). Pressing the same button again will rotate between 24, 16 and 32
    turns again.
    <div class="green seperator">
       Buildings which lower your travel time like
       <img width="25" height="25" style="vertical-align: middle;" src="/images/units/research/space_tether.png"/> Space Tether,
       <img width="25" height="25" style="vertical-align: middle;" src="/images/units/research/hyperspace_beacon.png"/> Hyperspace Beacon or
       <img width="25" height="25" style="vertical-align: middle;" src="/images/units/research/jump_gate.png"/> Jump Gates are not
       taken into consideration.
    </div>
    <div class="error seperator">
       The Logistics calculator will make suggestions based on a single type of transport ships. Feel free to mix and match for best results.
    </div>
    </p>
    <img style="padding: 10px;" src="` + imageContainer['logisticsExample.png'] + `"/>
    </div>`;

    //buf.innerHTML += '<span style="float: right; padding-right: 130px; padding-top: 7px;"><button id="btnLogst" class="btn"><svg width="120px" height="25px" viewBox="0 0 120 25" class="border"><polyline points="119,0 119,24 0,24 0,0 119,0" class="bg-line" /><polyline points="119,0 119,24 1,24 0,0 119,0" class="hl-line" /></svg><span id="labelLogst">Logistics</span></button>';

}

function cacheFleets()
{
    var fleetArray = [];
    const table = document.getElementById("fleetList");
    const idRegex = /\/fleet\/([0-9]+)/;

    rows = table.querySelectorAll('.entry');
    rowsArray = Array.from(rows);

    console.log("Caching fleets");

    for (i = 0; i<rowsArray.length; i++) {
        const link = rowsArray[i].querySelector('.name a');
        const linkId = link.href.match(idRegex);
        const fleetData = getFleetById(parseInt(linkId[1]));
		console.log(linkId);
		console.log("i = " + i);
		if (!fleetData) {
			composition = null;
		} else {
			if (!fleetData.composition) {
			    composition = null;
			} else {
			    composition = fleetData.composition;
            }
		}
        var fleet = { id: parseInt(linkId[1]), name: link.text, url: link.href, composition: composition };
        fleetArray.push(fleet);
    }
    localStorage.setItem('fleetArray', JSON.stringify(fleetArray));
}

function getFleetById(id)
{
    var i;
    for (i=0; i<jsonFleetCache.length; i++) {
        if (jsonFleetCache[i].id === id) {
            return jsonFleetCache[i];
        }
    }
    console.log(`Cannot find fleet by ID ${id}`);
    return null;
}

function sortFleets()
{
    /* Sort the table based on fleet name */
    const table = document.getElementById("fleetList");
    var rows = table.querySelectorAll('.entry');
    var rowsArray = Array.from(rows);

    rowsArray.sort((a, b) => {
        const linkA = a.querySelector('.name a');
        const linkB = b.querySelector('.name a');
        const textA = linkA ? linkA.textContent : '';
        const textB = linkB ? linkB.textContent : '';
        return textA.localeCompare(textB);
    });

    table.innerHTML = '<div class="tableHeader"><div>&nbsp;</div><div class="title name">Name</div><div class="title activity">Activity</div></div>';
    rowsArray.forEach(row => table.appendChild(row));

    /* Fix backgrounds due to resorting */
    fixBackground(table,'.entry');
}

function filterPlanet(f)
{
    data = document.getElementById('filterPlanet').value;
    /* Filter the data only to the entries matching data */
    var re = new RegExp(".*" + data + ".*", "i");
    
    const table = document.getElementById("planetList");
    var rows = table.querySelectorAll('.locationWrapper');
    var rowsArray = Array.from(rows);

    for (i=0; i<rowsArray.length; i++) {
        if (!re.exec(rowsArray[i].innerText)) {
            rowsArray[i].style.display = 'none';
        } else {
            rowsArray[i].style.display = '';
        }
    }
    /* Fix backgrounds due to resorting */
    fixBackground(table,'.entry');
}

function filterFleet(f)
{
    data = document.getElementById('filterFleet').value;
    /* Filter the data only to the entries matching data */
    var re = new RegExp(".*" + data + ".*", "i");

    const table = document.getElementById("fleetList");
    var rows = table.querySelectorAll('.entry');
    var rowsArray = Array.from(rows);

    for (i=0; i<rowsArray.length; i++) {
        if (!re.exec(rowsArray[i].innerText)) {
            rowsArray[i].style.display = 'none';
        } else {
            rowsArray[i].style.display = '';
        }
    }
    /* Fix backgrounds due to resorting */
    fixBackground(table,'.entry');
}

function fixBackground(element, selector)
{
    rows = element.querySelectorAll(selector);
    j = 0;
    for (i = 0; i<rows.length; i++) {
        /* If the row is hidden -> skip it */
        if (rows[i].style.display==='none') {
            continue;
        }
        rows[i].className = (j++%2?'opacBackground entry':'opacLightBackground entry');
    }
}
function addShipsDescriptions()
{
    let buf = null;
    /* 109 fighter */
    if (buf = document.getElementById('unit-109')) {
        buf = buf.querySelector('div .desc');
        buf.innerHTML = `Fighters are good for intercepting Bombers and other Fighters. Usually used for dump for your excess metal.<br/><hr/><strong>Targeting:</strong> Bomber-&gt;Fighter-&gt;Destroyer`;
    }
    /* 110 bomber */
    if (buf = document.getElementById('unit-110')) {
        buf = buf.querySelector('div .desc');
        buf.innerHTML = `Bombers are good for dealing with those pesky Frigates and Destroyers. In high numbers they are capable of dealing with single digit Battleships.<br/><hr/><strong>Targeting:</strong> Destroyer-&gt;Frigate-&gt;Battleship`;
    }
    /* 111 frigate */
    if (buf = document.getElementById('unit-111')) {
        buf = buf.querySelector('div .desc');
        buf.innerHTML = `Frigates are the go to ship to deal with Cruisers and Fighters. Occasionally useful against Destroyers.<br/><hr/><strong>Targeting:</strong> Cruiser-&gt;Fighter-&gt;Destroyer`;
    }
    /* 112 destroyer */
    if (buf = document.getElementById('unit-112')) {
        buf = buf.querySelector('div .desc');
        buf.innerHTML = `Destroyers are arguably the only cost effective way to manage the enemy Battleships. Second to that, they're good at dealing with Cruisers.<br/><hr/><strong>Targeting:</strong> Battleship-&gt;Cruiser-&gt;Destroyer`;
    }
    /* 113 cruiser */
    if (buf = document.getElementById('unit-113')) {
        buf = buf.querySelector('div .desc');
        buf.innerHTML = `Send these bad boys in and watch the enemy Bomber burn. Known to use fighters for target practice when bored<br/><hr/><strong>Targeting:</strong> Fighter-&gt;Bomber-&gt;Frigate`;
    }
    /* 114 battleship */
    if (buf = document.getElementById('unit-114')) {
        buf = buf.querySelector('div .desc');
        buf.innerHTML = `If your enemy has these and you don't, you might want to start rebuilding your fleet before it crashes and burn. Effective against all ship types although relatively weak against destroyers.<br/><hr/><strong>Targeting:</strong> Frigate-&gt;Cruiser-&gt;Battleship`;
    }
    /* Civilian stuff */
    /* 115 outpost */
    if (buf = document.getElementById('unit-115')) {
        buf.querySelector('div .title').innerHTML = 'Outpost Ship';
        buf = buf.querySelector('div .desc');
        buf.innerHTML = `Used in the early and mid-game to colonize unihabited planets.<br/><hr/><strong>Tip:</strong> Scan with <img src='/images/units/main/structures/comms_satellite.jpg' width="16" height="16"/> Comms Satellite if available.`;
    }
    /* 116 colony ship ? */
    /* 117 invasion */
    if (buf = document.getElementById('unit-117')) {
        buf.querySelector('div .title').innerHTML = 'Invasion Ship';
        buf = buf.querySelector('div .desc');
        buf.innerHTML = `The only ship capable of transporting soldiers. Oh, and capable of performing invasions.<br/><hr/><strong>Tip:</strong> Scan with <img src='/images/units/main/structures/comms_satellite.jpg' width="16" height="16"/> Comms Satellite prior to invading.<br/><hr/><strong>Tip:</strong> Unsucessful invasions will cause the invasions ships to vanish from your fleet.`;
    }
    /* 118 invasion */
    if (buf = document.getElementById('unit-118')) {
        buf = buf.querySelector('div .desc');
        buf.innerHTML = `The bread and butter of your early game economy. Used for transfers of resources and colonists.<br/><hr/><strong>Capacity:</strong> 100,000`;
    }
    /* 119 Merchant */
    if (buf = document.getElementById('unit-119')) {
        buf = buf.querySelector('div .desc');
        buf.innerHTML = `A slightly advanced version of the Freighter. Good balance between cargo space and build time.<br/><hr/><strong>Capacity:</strong> 250,000`;
    }
    /* 120 Trader */
    if (buf = document.getElementById('unit-120')) {
        buf = buf.querySelector('div .desc');
        buf.innerHTML = `An excellent choice if you want to move an entire planet resource production and have spare cargo space for passengers.<br/><hr/><strong>Capacity:</strong> 625,000`;
    }
    /* 121 Hulk */
    if (buf = document.getElementById('unit-121')) {
        buf = buf.querySelector('div .desc');
        buf.innerHTML = `Meet the heavy weight champion of the galaxy. Pilot's favorite jokes starts with "Your mama is so big"...<br/><hr/><strong>Capacity:</strong> 1,562,500`;
    }
}

function improveResXfer()
{
    /* Generic counters */
    let i = 0, j = 0;
    let rows = document.querySelectorAll("div .transferRow");

    console.log('here comes johny');

    for (i=0; i<rows.length; i++) {
        if (rows[i].children.length <= 2) {
            continue;
        }
        j = parseInteger(rows[i].querySelector('div .left.text').innerText.trim());

        rows[i].querySelector('div .left.text').value = j;
        rows[i].querySelector('div .left.text').style.cursor = 'pointer';
        rows[i].querySelector('div .left.text').addEventListener("click", function(e) { e.srcElement.parentElement.querySelector("input").value = e.srcElement.value; }, false);
    }
}

function improveResXferPlanner(fleetQueue)
{
    var planetName = null;
    var planetCoords = null;
    var planetData = null;
    const fmt = new Intl.NumberFormat('en-US');

    if (!fleetQueue) {
        return;
    }

    buf = fleetQueue.querySelector('div .entry');

    if (!buf) {
        return;
    }

    buf = buf.querySelector('div .nameColumn');

    if (!buf) {
        return;
    }

    buf = buf.getElementsByTagName('span');

    if (!buf||(buf.length!==2&&buf.length!==4)) {
        console.log("Warning - unexpected buf");
        console.log(buf);
        return;
    }

    if (buf.length==2) {
        planetCoords = buf[0].innerText.split('.');
        buf = buf[1];
    }

    if (buf.length==4) {
        planetCoords = buf[2].innerText.split('.');
        buf = buf[3];
    }

    if (planetCoords.length!==4) {
        console.log("Unexpected coordinates " + planetCoords);
        return;
    } else {
        planetCoords[0] = parseInt(planetCoords[0]);
        planetCoords[1] = parseInt(planetCoords[1]);
        planetCoords[2] = parseInt(planetCoords[2]);
        planetCoords[3] = parseInt(planetCoords[3]);
    }

    if (buf.className === 'friendly') {
        planetName = buf.innerText.trim();
    } else {
        /* Not friendly */
        return;
    }

    if (!jsonPageDataCache.locationList) {
        console.log("Missing jsonPageDataCache.locationList");
        return;
    }

    for (i = 0; i<jsonPageDataCache.locationList.length; i++) {
        /* Home planet does not have coordinates */
        if (jsonPageDataCache.locationList[i].coordinates.length === 0) {
            jsonPageDataCache.locationList[i].coordinates = [0, 0, 0, 0];
        }

        if (jsonPageDataCache.locationList[i].name === planetName &&
            JSON.stringify(jsonPageDataCache.locationList[i].coordinates) === JSON.stringify(planetCoords)) {
            planetData = jsonPageDataCache.locationList[i];
            break;
        }
    }

    if (!planetData) {
        console.log("Couldn't find the planet");
        return;
    }

    if (!planetData.mobileUnitCount) {
        console.log("Bad planetData structure");
        return;
    }

    buf = document.querySelectorAll('div .left.ofHidden.lightBorder.opacDarkBackground.seperator.fleetLeftInnerSmall');
    if (buf.length!==2) {
        console.log("Unexpected document structure");
        return;
    }

    buf = buf[1];

    p = buf.querySelectorAll('div .title');
    if (p.length!==2) {
        console.log("Unexpected header structure");
        return;
    }
    p[1].style.width = '70px';

    p = buf.querySelector('div .tableHeader');
    p.innerHTML += '<div class="title" style="width: 120px; text-align: right;"><a href="/planet/' + planetData.id + '">' + planetName + '</a></div>';


    p = buf.querySelectorAll('div .transferRow');
    for (i=0; i<p.length; i++) {
        q = p[i].getElementsByTagName('div')[2].innerText.trim();
        for (j=0; j<planetData.mobileUnitCount.unitList.length; j++) {
            if (planetData.mobileUnitCount.unitList[j].name === q) {
                // console.log(planetData);
                k = planetData.mobileUnitCount.unitList[j].amount;
                //console.log(planetData.mobileUnitCount.unitList[j].amount);
                //console.log(p[i]);
                console.log(q);
                t = document.createElement('div');
                t.className = 'right text ' + q.toLowerCase();
                t.setAttribute('value', k);
                r = getIncome(planetData, q);
                if (r>0) {
                    t.setAttribute('data-tooltip', "+" + fmt.format(r));
                    t.setAttribute('data-tooltip-position', 'left');
                }
                t.style.cursor = 'pointer';
                t.innerHTML = fmt.format(k);
                t.addEventListener("click", function (k) { this.parentNode.querySelector('input').value = this.getAttribute('value'); }, false);
                p[i].appendChild(t);
                break;
            }
        }
    }
    console.log(planetData);
}

function getPlanetByCoord(coord)
{
    let i=0;
    const c = coord.split('.');
    for (i=0; i<jsonPageDataCache.locationList.length; i++) {
        /* Home planets and their special coordinates */
        if (c[0] === '0' && jsonPageDataCache.locationList[i].coordinates.length === 0) {
            return jsonPageDataCache.locationList[i];
        }
        let pC = jsonPageDataCache.locationList[i].coordinates;
        if (c[0] == pC[0] && c[1] == pC[1] && c[2] == pC[2] && c[3] == pC[3]) {
            return jsonPageDataCache.locationList[i];
        }
    }
    return null;
}

function getPlanetByName(name)
{
    let i=0;
    for (i=0; i<jsonPageDataCache.locationList.length; i++) {
        if (jsonPageDataCache.locationList[i].name === name) {
            return jsonPageDataCache.locationList[i];
        }
    }
    return null;
}

function getResource(planet, type)
{
    var i;
    if (!planet.mobileUnitCount.unitList) {
        console.log("Missing mobileUnitCount");
        return null;
    }
    for (i=0; i<planet.mobileUnitCount.unitList.length; i++) {
        if (planet.mobileUnitCount.unitList[i].name === type) {
            return planet.mobileUnitCount.unitList[i];
        }
    }
    return null;
}

function getIncome(planet, type)
{
    var i;
    if (!planet.upkeepUnitCount) {
        console.log("Missing upkeepUnitCount");
        return null;
    }

    for (i=0; i<planet.upkeepUnitCount.unitList.length; i++) {
        if (planet.upkeepUnitCount.unitList[i].name === type) {
            return planet.upkeepUnitCount.unitList[i].amount;
        }
    }
    return null;
}

function getAmount(arr, type)
{
    var i;

    for (i=0; i<arr.length; i++) {
        if (arr[i].name === type) {
            return arr[i].amount;
        }
    }
    return 0;
}

function showScanMenu(e)
{
    console.log("Executing showScanMenu");
    var commsLink = [];
    var energy;
    const coordinate = e.currentTarget.getAttribute('coordinate').split('.');
    const m = document.getElementById('dhFleetListMenu');

    if (!jsonPageDataCache.locationList) {
        console.log("Missing jsonPageDataCache.locationList");
        return;
    }

    for (i=0; i<jsonPageDataCache.locationList.length; i++) {
        p = jsonPageDataCache.locationList[i];
        c = getResource(p, 'Comms_Satellite');
        if (c && c.amount ===1 ) {
            energy = getResource(p, 'Energy');
            /* Out of energy */
            if (!energy) {
                continue;
            }
            /* Do not add planets with insufficent energy for anything */
            if (energy.amount >= 500) {
                commsLink.push({'name': p.name, 'url': "/planet/" + p.id +"/comms/", 'energy': energy.amount });
            }
        }
    }

    if (commsLink.length === 0) {
        window.alert('No planet with Comms and sufficient energy was detected!');
        return;
    }

    /* Sort by Energy descending-ly as we want the planet with most energy on the top */
    commsLink.sort(function(a,b) {return (a.energy > b.energy) ? -1 : 1;} );

    m.style.left = e.x + 'px';
    m.style.top = e.y + 'px';

    /* Reset context menu */
    /* Previous optimization does not work due to not changing the coordinates */
    m.innerHTML = '';
    m.setAttribute('menuType', 'scan');

    /* Populate context menu prior to showing it */
    for (var i=0; i < commsLink.length; i++) {
        var newDiv = document.createElement('div');
        var url = commsLink[i].url;
        url += '?';
        url += 'c0=' + coordinate[0];
        url += '&c1=' + coordinate[1];
        url += '&c2=' + coordinate[2];
        url += '&c3=' + coordinate[3];

        newDiv.className = 'contextMenuItem';
        newDiv.innerHTML = '<a href="' + url + '">' + commsLink[i].name + '</a>';
        m.appendChild(newDiv);
    }
    implementContextMenu();
    m.style.display = 'block';
}

function showJumpMenu(e)
{
    console.log("Executing showJumpMenu");
    const coordinate = e.currentTarget.getAttribute('coordinate').split('.');
    const m = document.getElementById('dhFleetListMenu');
    const f = JSON.parse(localStorage.getItem('fleetArray'));
    if (coordinate.length!=4) {
        window.alert('Bad coordinates');
        return;
    }

    if (f==null) {
        window.alert('No fleets are cached. Visit your fleet list!');
        return;
    }

    m.style.left = e.x + 'px';
    m.style.top = e.y + 'px';

    /* Reset context menu */
    /* Previous optimization does not work due to not changing the coordinates */
    m.innerHTML = '';
    m.setAttribute('menuType', 'scan');

    /* Populate context menu prior to showing it */
    for (var i =0; i < f.length; i++) {
        var newDiv = document.createElement('div');
        var url = f[i].url;
        url += '?';
        url += 'c0=' + coordinate[0];
        url += '&c1=' + coordinate[1];
        url += '&c2=' + coordinate[2];
        url += '&c3=' + coordinate[3];

        newDiv.className = 'contextMenuItem';
        newDiv.innerHTML = '<a href="' + url + '">' + f[i].name + '</a>';
        m.appendChild(newDiv);
    }
    implementContextMenu();
    m.style.display = 'block';
}

function implementContextMenu()
{
    const m = document.getElementById('dhFleetListMenu');
    if (!__HIDE_MENU_INSTRUCTION__) {
        document.addEventListener("click", function (e) {
            console.log('Click click');
            if (e.composedPath().includes(m)) {
                return;
            }
            q = document.querySelectorAll(".scanIcon");
            for (i=0; i<q.length;i++) {
                if (e.composedPath().includes(q[i])) {
                    return;
                }
            }
            q = document.querySelectorAll(".jumpTo");
            for (i=0; i<q.length;i++) {
                if (e.composedPath().includes(q[i])) {
                    return;
                }
            }
            m.style.display = 'none';
        });
        __HIDE_MENU_INSTRUCTION__ = true;
    }
}

function generateStats()
{
    var el;
    var buf;
    var plBuf;
    var genData = { "count": 0, "worker": 0, "newWorker":0, "soldier": 0, "newSoldier": 0, "ground": 0, "orbit": 0};
    var total = { "metal": 0, "mineral": 0, "food": 0, "energy": 0};
    var income = { "metal": 0, "mineral": 0, "food": 0, "energy": 0};
    var ratio = { "metal": 0, "mineral": 0, "food": 0, "energy": 0};
    var reinfData = {};
    var transData = {};
    var building = {};
    var localWorker = 0;
    var newWorker = 0;
    var maxWorker = 0;


    document.getElementById('btnExport').style.display = 'none';
    document.getElementById('btnStats').style.display = 'none';
    document.getElementById('btnLogst').style.display = 'none';

    const fmt = new Intl.NumberFormat('en-US');
    const fmtRatio = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    genData.count = jsonPageDataCache.locationList.length;
    //console.log(jsonPageDataCache);
    for (i=0; i<jsonPageDataCache.locationList.length; i++) {
        genData.ground += getAmount(jsonPageDataCache.locationList[i].locationUnitCount.unitList, "Ground");
        genData.orbit += getAmount(jsonPageDataCache.locationList[i].locationUnitCount.unitList, "Orbit");
        localWorker = getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Worker") + 
			getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "OccupiedWorker");

        genData.worker += getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Worker");
        genData.worker += localWorker;
	
        /* Calculate max living space fot the current planet */
        maxWorker = 50000 + getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Colony")*100000 +
                getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Metropolis")*200000 +
                getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Living_Quarters")*50000 + 
                getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Habitat")*100000 +
                getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Orbital_Ring")*1500000;
	
       	/* Copy newWorker to a local variable (for shortness) */
        newWorker = getAmount(jsonPageDataCache.locationList[i].upkeepUnitCount.unitList, "Worker");
    
        /* If maxWorker == localWorker (at max storage level OR
         * somehow maxWorker less than localWorker (should not be possible */
    	if (maxWorker <= localWorker) {
            /* No new workers will be produced */
            newWorker = 0;
        } else {
            if (localWorker + newWorker > maxWorker) {
                /* Available space is less than max living space, limit it */
                newWorker = maxWorker - localWorker;
            }
        }
        
        genData.newWorker += newWorker;
	
        genData.soldier += getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Soldier");
        genData.newSoldier += getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "CreatingSoldier");

        total.metal += getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Metal");
        total.mineral += getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Mineral");
        total.food += getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Food");
        total.energy += getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Energy");

        income.metal += getAmount(jsonPageDataCache.locationList[i].upkeepUnitCount.unitList, "Metal");
        income.mineral += getAmount(jsonPageDataCache.locationList[i].upkeepUnitCount.unitList, "Mineral");
        income.food += getAmount(jsonPageDataCache.locationList[i].upkeepUnitCount.unitList, "Food");
        income.energy += getAmount(jsonPageDataCache.locationList[i].upkeepUnitCount.unitList, "Energy");

        ratio.metal += getAmount(jsonPageDataCache.locationList[i].locationUnitCount.unitList, "Metal_Abundance");
        ratio.mineral += getAmount(jsonPageDataCache.locationList[i].locationUnitCount.unitList, "Mineral_Abundance");
        ratio.food += getAmount(jsonPageDataCache.locationList[i].locationUnitCount.unitList, "Food_Abundance");
        ratio.energy += getAmount(jsonPageDataCache.locationList[i].locationUnitCount.unitList, "Energy_Abundance");

        for (j = 0; j<jsonPageDataCache.locationList[i].executingItems.unitList.length; j++) {
            buf = jsonPageDataCache.locationList[i].executingItems.unitList[j].name;
            if (building[buf]>0) {
                building[buf] += jsonPageDataCache.locationList[i].executingItems.unitList[j].amount;
            } else {
                building[buf] = jsonPageDataCache.locationList[i].executingItems.unitList[j].amount;
            }
        }
        c = jsonPageDataCache.locationList[i].coordinates.join('.');
        if (c === '') {
            c = '0.0.0.0';
        }
        n = 0;
		m = 0;
        for (j = 0; j<jsonPageDataCache.locationList[i].mobileUnitCount.unitList.length; j++) {
            t = jsonPageDataCache.locationList[i].mobileUnitCount.unitList[j].name;
            q = jsonPageDataCache.locationList[i].mobileUnitCount.unitList[j].amount;
			
			if (!ships[t] && t !== 'Soldier') {
				continue;
			}

			if (logisticsCapacity[t]) {
				if (!transData[c]) {
                    transData[c] = [];
                }
                transData[c][m] = {amount: q, type: t};
                m++;
			} else {
				/* Skip soldiers less than 1000 */
				if (t === 'Soldier' && q<1000) {
					continue;
				}
				if (!reinfData[c]) {
					reinfData[c] = [];
				}
				reinfData[c][n] = {amount: q, type: t};
				n++;
			}
        }
    }

    /* Calculate avergaes for ratios */
    for (const [key, value] of Object.entries(total)) {
        total[key] = fmt.format(total[key]);
        income[key] = fmt.format(income[key]);
        ratio[key] = fmtRatio.format(ratio[key]/genData.count, 2);
    }

    /* Detect ground and orbit space, population and soldiers */
    plBuf = document.getElementsByClassName('locationWrapper');
    plBuf = Array.from(plBuf);

    el = document.getElementById('planetList');
    /* while testing */
    el.innerHTML = '';

    el.innerHTML += "<div id='genTable' class='left' style='height: 100%; width: 40%;'></div>";
    buf = document.getElementById('genTable');
    buf.innerHTML = "<div id='aTable' class='opacDarkBackground lightBorder paddingMid ofHidden' style='height: 100%;'></div>";
    buf = document.getElementById('aTable');
    buf.innerHTML = "<div id='bTable' class='opacBackground lightBorder paddingMid ofHidden'></div>";
    buf = document.getElementById('bTable');
    buf.innerHTML += "<div class='left resource' style='width: 35%; text-align: right;'>Planets</div>";
    buf.innerHTML += "<div class='left resource' style='width: 60%; text-align: right;'>" + genData.count + "</div>";
    buf.innerHTML += "<div class='left resource' style='width: 35%; text-align: right;'>Space</div>";
    buf.innerHTML += "<div class='left resource' style='width: 60%; text-align: right;'>" + genData.ground + " / " + genData.orbit + "</div>";
    buf.innerHTML += "<div class='left resource' style='width: 35%; text-align: right;'>Workers</div>";
    buf.innerHTML += "<div class='left resource' style='width: 28%; text-align: right;'>+" + fmt.format(genData.newWorker) + "</div>";
    buf.innerHTML += "<div class='left resource' style='width: 30%; text-align: right;'>" + fmt.format(genData.worker) + "</div>";
    buf.innerHTML += "<div class='left resource' style='width: 35%; text-align: right;'>Soldiers</div>";
    buf.innerHTML += "<div class='left resource' style='width: 28%; text-align: right;'>+" + fmt.format(genData.newSoldier) + "</div>";
    buf.innerHTML += "<div class='left resource' style='width: 30%; text-align: right;'>" + fmt.format(genData.soldier) + "</div>";

    //buf.innerHTML = "<pre>" + genData + "</pre>";

    el.innerHTML += "<div id='resTable' class='opacDarkBackground lightBorder paddingMid ofHidden' style='height: 100%; width: 59%;'></div>";
    el = document.getElementById('resTable');

    el.innerHTML += "<div id='statHeader' class='lightBorder ofHidden opacBackground'></div>";
    buf = document.getElementById('statHeader');
    buf.innerHTML += "<div class='left resource' style='width: 12%;'>&nbsp;</div>";
    for (const [key, value] of Object.entries(total)) {
        buf.innerHTML += "<div class='left resource " + key + "' style='width: 20%; text-align: right;'>" + key + "</div>";
    }
    el.innerHTML += "<div id='statStorage' class='lightBorder ofHidden opacBackground'></div>";
    buf = document.getElementById('statStorage');
    buf.innerHTML += "<div class='left resource' style='width: 12%;'>Storage</div>";
    for (const [key, value] of Object.entries(total)) {
        buf.innerHTML += "<div class='left resource " + key + "' style='width: 20%; text-align: right;'>" + value + "</div>";
    }
    el.innerHTML += "<div id='statIncome' class='lightBorder ofHidden opacBackground'></div>";
    buf = document.getElementById('statIncome');
    buf.innerHTML += "<div class='left resource' style='width: 12%;'>Income</div>";
    for (const [key, value] of Object.entries(income)) {
        buf.innerHTML += "<div class='left resource " + key + "' style='width: 20%; text-align: right;'>+" + value + "</div>";
    }
    el.innerHTML += "<div id='statRatio' class='lightBorder ofHidden opacBackground'></div>";
    buf = document.getElementById('statRatio');
    buf.innerHTML += "<div class='left resource' style='width: 12%;'>Abundance</div>";
    for (const [key, value] of Object.entries(ratio)) {
        buf.innerHTML += "<div class='left resource " + key + "' style='width: 20%; text-align: right;'>" + value + "%</div>";
    }

    el = document.getElementById('planetList');
    el.innerHTML += "<div id='buildDiv' class='opacDarkBackground lightBorder paddingMid ofHidden' style='height: 100%; width: 99%;'></div>";
    buf = document.getElementById('buildDiv');
    buf.innerHTML = "<div id='innerBuildDiv' class='opacBackground lightBorder paddingMid ofHidden'></div>";
    buf = document.getElementById('innerBuildDiv');

    buf.innerHTML =  "<div class='lightBorder ofHidden' style='display: table-cell; width: 20%; padding: 5px; padding-left: 10px; margin-left: 10px; margin-bottom: 10px;'><div class='border smallHeader'>Currently constructing:</div><ul id='buildList'></ul></div>";
    buf.innerHTML += "<div class='lightBorder ofHidden' style='display: table-cell; width: 20%; padding: 5px; padding-left: 10px; margin-left: 10px; margin-bottom: 10px;'><div class='border smallHeader'>Currently training:</div><ul id='trainList'></ul></div>";
    buf.innerHTML += "<div class='lightBorder ofHidden' style='display: table-cell; width: 20%; padding: 5px; padding-left: 10px; margin-left: 10px; margin-bottom: 10px;'><div class='border smallHeader'>Available reinforcements:</div><ul id='reinfList'></ul></div>";
    buf.innerHTML += "<div class='lightBorder ofHidden' style='display: table-cell; width: 20%; padding: 5px; padding-left: 10px; margin-left: 10px; margin-bottom: 10px;'><div class='border smallHeader'>Parked transports:</div><ul id='transportList'></ul></div>";
    let p = 0;

    for (const key of Object.keys(building).sort()) {
        if (ships[key] >= 0 || key === 'Soldier') {
            buf = document.getElementById('trainList');
        } else {
            buf = document.getElementById('buildList');
        }
        buf.innerHTML += "<li>" + building[key] + "x <em>" + key.replaceAll("_", " ") + "</em></li>";
    }


    if (document.getElementById('buildList').childElementCount === 0) {
        document.getElementById('buildList').innerHTML += "<li><em>nothing</em></li>";
    }
    if (document.getElementById('trainList').childElementCount === 0) {
        document.getElementById('trainList').innerHTML += "<li><em>nothing</em></li>";
    }

    if (Object.keys(reinfData).length === 0) {
        document.getElementById('reinfList').innerHTML += "<li><em>nothing</em></li>";
    } else {
        buf = document.getElementById('reinfList');
        for ([c, data] of Object.entries(reinfData)) {
            p = getPlanetByCoord(c);
            a = "<a href='/planet/" + p.id + "/'>" + c + "</a>";
            a += "<span class='friendly'><a href='/planet/" + p.id + "/'>" + ' ' + p.name + "</a></span>";
            buf.innerHTML += "<div style='margin-left: -20px;'><strong>" + a + "</strong></div>";
            for (i=0; i<data.length; i++) {
                buf.innerHTML += "<li>" + data[i].amount + "x <em>" + data[i].type.replaceAll("_", " ") + "</em></li>";
            }
        }
    }
	
	if (Object.keys(transData).length === 0) {
        document.getElementById('transportList').innerHTML += "<li><em>nothing</em></li>";
    } else {
        buf = document.getElementById('transportList');
        for ([c, data] of Object.entries(transData)) {
            p = getPlanetByCoord(c);
            a = "<a href='/planet/" + p.id + "/'>" + c + "</a>";
            a += "<span class='friendly'><a href='/planet/" + p.id + "/'>" + ' ' + p.name + "</a></span>";
            buf.innerHTML += "<div style='margin-left: -20px;'><strong>" + a + "</strong></div>";
            for (i=0; i<data.length; i++) {
                buf.innerHTML += "<li>" + data[i].amount + "x <em>" + data[i].type.replaceAll("_", " ") + "</em></li>";
            }
        }
    }

    buf = document.querySelector('div .header.pageTitle');
    buf.innerHTML = '<span>Planet Statistics</span>';
    buf.innerHTML += '<span style="float: right; padding-right: 130px; padding-top: 7px;"><button id="btnCopy" class="btn"><svg width="120px" height="25px" viewBox="0 0 120 25" class="border"><polyline points="119,0 119,24 0,24 0,0 119,0" class="bg-line" /><polyline points="119,0 119,24 1,24 0,0 119,0" class="hl-line" /></svg><span>Copy</span></button>';
    buf.innerHTML += '<span style="float: right; padding-right: 130px; padding-top: 7px;"><button id="btnCopyPartial" class="btn"><svg width="120px" height="25px" viewBox="0 0 120 25" class="border"><polyline points="119,0 119,24 0,24 0,0 119,0" class="bg-line" /><polyline points="119,0 119,24 1,24 0,0 119,0" class="hl-line" /></svg><span>Partial Copy</span></button>';

    document.getElementById('btnCopy').addEventListener("click", function (e) {
        var turn = ' turn '+ turnNumber + ' ';
        buf = "```\n";
        buf += "--- General statistics --------------" + turn.padEnd(13, '-') + "\n";
        buf += " Planets: " + fmt.format(genData.count).padStart(12) + "\n";
        buf += "  Ground: " + fmt.format(genData.ground).padStart(12) + "\n";
        buf += "   Orbit: " + fmt.format(genData.orbit).padStart(12) + "\n";
        buf += " Workers: " + fmt.format(genData.worker).padStart(12) + ("+" + fmt.format(genData.newWorker)).padStart(14) + "\n";
        buf += "Soldiers: " + fmt.format(genData.soldier).padStart(12) + ("+" + fmt.format(genData.newSoldier)).padStart(14) + "\n\n";
        buf += "--- Resources ------------------------------------\n";
        buf += "          " + "Storage".padStart(14) + "Income".padStart(12) + "Abundance".padStart(12) + "\n";
        buf += "   Metal: " + total.metal.padStart(14) + income.metal.padStart(12) + ratio.metal.padStart(11) + "%\n";
        buf += " Mineral: " + total.mineral.padStart(14) + income.mineral.padStart(12) + ratio.mineral.padStart(11) + "%\n";
        buf += "    Food: " + total.food.padStart(14) + income.food.padStart(12) + ratio.food.padStart(11) + "%\n";
        buf += "  Energy: " + total.energy.padStart(14) + income.energy.padStart(12) + ratio.energy.padStart(11) + "%\n";
        buf += "--- Constructing ---------------------------------\n";
        if (document.getElementById('buildList').childElementCount === 0) {
            buf += "  -- nothing --\n";
        } else {
            for (const key of Object.keys(building).sort()) {
                if (!ships[key] && key !== 'Soldier') {
                    buf += (building[key]).toString().padStart(8, ' ') + "x " + key.replaceAll("_", " ") + "\n";
                }
            }
        }
        buf += "--- Training -------------------------------------\n";
        if (document.getElementById('trainList').childElementCount === 0) {
            buf += "  -- nothing --\n";
        } else {
            for (const key of Object.keys(building).sort()) {
                if (ships[key] >= 0 || key === 'Soldier') {
                    buf += (building[key]).toString().padStart(8, ' ') + "x " + key.replaceAll("_", " ") + "\n";
                }
            }
        }
        buf += "--- Reinforcements -------------------------------\n";
        if (Object.keys(reinfData).length === 0) {
            buf += "  -- nothing --\n";
        } else {
            for ([c, data] of Object.entries(reinfData)) {
                p = getPlanetByCoord(c);
                buf += " ** " + c + " " + p.name + "\n";
                for (i=0; i<data.length; i++) {
                    buf += (data[i].amount).toString().padStart(8, ' ') + "x " + data[i].type.replaceAll("_", " ") + "\n";
                }
                console.log(data);
            }
        }
        buf += "```"

        navigator.clipboard.writeText(buf);
        showNotification("Information copied to clipboard");
    }, false);
}

function generateLogistics()
{
    const plBuf = document.getElementsByClassName('locationWrapper');
    const plArr = Array.from(plBuf);
    const fmt = new Intl.NumberFormat('en-US');
    var income = { "metal": 0, "mineral": 0, "food": 0, "energy": 0};

    for (i=0; i<plArr.length; i++) {
        /* Reset income for each planet */
        income = { "metal": 0, "mineral": 0, "food": 0, "energy": 0}
        for (const [key, value] of Object.entries(income)) {
            var resEl = plArr[i].querySelectorAll("div .resource." + key);
            for (var j=0; j<resEl.length; j++) {
                const data = resEl[j].querySelector("span").innerText.split(' ');
                income[key] += parseInteger(data[1]);
            }
        }
        var totalIncome = income.metal + income.mineral + income.food + income.energy;
        var subEl = plArr[i].getElementsByClassName('planetHeadSection');

        subEl[2].innerHTML = subEl[2].querySelector("div .lightBorder.ofHidden.opacBackground").outerHTML;
        subEl[2].innerHTML += '<div class="lightBorder ofHidden opacBackground"><div class="left resource"><span>Logistics: Total income is +' + fmt.format(totalIncome) + ' RU/turn.</span></div></div>';
        subEl[2].innerHTML += '<div class="lightBorder ofHidden opacBackground"><div class="left resource"><span>Logistics round-trip over <strong>' + RTT[curRTT] + '</strong> turns: ' + getLogistics(totalIncome) + '</span></div></div>';
    }

    /* Shift to next flight times */
    curRTT++;
    /* If out of bound -> reset curRTT */
    if (curRTT >= RTT.length) {
        curRTT = 0;
    }

    /* Update label of the button */
    document.getElementById('labelLogst').innerText = 'Logistics / ' + RTT[curRTT] + ' turns';
}

function getLogistics(res)
{
    var ret = '';
    /* Calculating for X ticks of income */
    res *= RTT[curRTT];

    const fmt = new Intl.NumberFormat('en-US');

    /* If 1 Freighter is sufficent, no need to continue */
    if (res < logisticsCapacity.Freighter) {
        return "<span class='ofHidden metal'>1 <em>Freighter</em></span>";
    }

    ret += "<span class='ofHidden metal'>" + fmt.format(Math.ceil(res / logisticsCapacity.Freighter)) + " <em>Freighter</em></span> ";
    ret += " OR <span class='ofHidden population'>" + fmt.format(Math.ceil(res / logisticsCapacity.Merchant)) + " <em>Merchant</em></span> ";
    /* If 1 merchent is sufficent, no need to continue */
    if (Math.ceil(res / logisticsCapacity.Merchant) == 1) {
        return ret;
    }
    ret += " OR <span class='ofHidden food'>" + fmt.format(Math.ceil(res / logisticsCapacity.Trader)) + " <em>Trader</em></span> ";
    /* If 1 Trader is sufficent, no need to continue */
    if (Math.ceil(res / logisticsCapacity.Trader) == 1) {
        return ret;
    }
    /* Lastly add Hulks */
    ret += " OR <span class='ofHidden energy'>" + fmt.format(Math.ceil(res / logisticsCapacity.Hulk)) + " <em>Hulk</em></span> ";
    return ret;
}

function exportPlanets()
{
    /* Generic counters */
    let i = 0, j = 0;
    var data = [];
    /* [
        {
            id: 1,
            name: "G\"eeks",
            profession: "de\\\"veloper"
        },
        {
            id: 2,
            name: "John",
            profession: "Tester"
        }
    ]; */
    for (i = 0; i<jsonPageDataCache.locationList.length; i++) {
        let planet = {};
        if (jsonPageDataCache.locationList[i].coordinates.length === 0) {
            planet.Coordinates = '0.0.0.0';
        } else {
            planet.Coordinates = jsonPageDataCache.locationList[i].coordinates.join('.');
        }
        planet.Name = jsonPageDataCache.locationList[i].name;
        planet.Ground = getAmount(jsonPageDataCache.locationList[i].locationUnitCount.unitList, "Ground");
        planet.Orbit = getAmount(jsonPageDataCache.locationList[i].locationUnitCount.unitList, "Orbit");
        planet["Metal Abnd"] = getAmount(jsonPageDataCache.locationList[i].locationUnitCount.unitList, "Metal_Abundance");
        planet["Mineral Abnd"] = getAmount(jsonPageDataCache.locationList[i].locationUnitCount.unitList, "Mineral_Abundance");
        planet["Food Abnd"] = getAmount(jsonPageDataCache.locationList[i].locationUnitCount.unitList, "Food_Abundance");
        planet["Energy Abnd"] = getAmount(jsonPageDataCache.locationList[i].locationUnitCount.unitList, "Energy_Abundance");
        planet["Metal Inc"] = getAmount(jsonPageDataCache.locationList[i].upkeepUnitCount.unitList, "Metal");
        planet["Mineral Inc"] = getAmount(jsonPageDataCache.locationList[i].upkeepUnitCount.unitList, "Mineral");
        planet["Food Inc"] = getAmount(jsonPageDataCache.locationList[i].upkeepUnitCount.unitList, "Food");
        planet["Energy Inc"] = getAmount(jsonPageDataCache.locationList[i].upkeepUnitCount.unitList, "Energy");
        planet.Metal = getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Metal");
        planet.Mineral = getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Mineral");
        planet.Food = getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Food");
        planet.Energy = getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Energy");
        planet.Population = getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Worker") + getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "OccupiedWorker");
        planet.Soldier = getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Soldier");
        planet.Comms = (getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Comms_Satellite")>0)?"Yes":"No";
        planet.ST = (getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Space_Tether")>0)?"Yes":"No";
        planet.HB = (getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Hyperspace_Beacon")>0)?"Yes":"No";
        planet.JG = (getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Jump_Gate")>0)?"Yes":"No";
        planet.Colony = (getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Colony")>0)?"Yes":"No";
        planet.Metropolis = (getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, "Metropolis")>0)?"Yes":"No";

        for (const key of Object.keys(ships)) {
            planet[key.replaceAll('_', ' ')] = getAmount(jsonPageDataCache.locationList[i].mobileUnitCount.unitList, key);
        }

        data.push(planet);
    }

    let csvRows = [];
    let csvData = "";

    const headers = Object.keys(data[0]);

    for (i = 0; i<data.length; i++) {
        let buf = data[i];
        let row = [];
        for (j in headers) {
            j = headers[j];

            if (typeof buf[j] === 'string' || buf[j] instanceof String) {
                /* First escape quotes */
                buf[j] = buf[j].replaceAll('"', "\\\"");
                /* Add quotes */
                buf[j] = '"' + buf[j] + '"';
            }

            row.push(buf[j]);
        }
        csvRows.push(row.join(","));
    }

    csvData = headers.join(",") + "\n" + csvRows.join("\n");

    let elCSV = document.createElement('a');

    elCSV.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvData);
    elCSV.download = 'planetList-' + turnNumber + '.csv';
    elCSV.click();
}

function updatePlanetSorting(sortType)
{
    const table = document.getElementById("planetList");
    var rows = table.querySelectorAll("div[id='planetList']");
    var rowsArray = Array.from(rows);
    const homePlanet = rowsArray.shift();
    const filterDiv = table.querySelector('div.seperator');
    
    console.log(`Sorting by ${sortType}`);
    if (sortType==='name') {
        rowsArray.sort((a, b) => {
           const linkA = a.querySelector('div .planetName');
           const linkB = b.querySelector('div .planetName');
           const textA = linkA ? linkA.textContent.trim() : '';
           const textB = linkB ? linkB.textContent.trim() : '';
           return textA.localeCompare(textB);
       });
    }
    if (sortType==='pop') {
        rowsArray.sort((a, b) => {
            const linkA = a.querySelector('div .planetName');
            const linkB = b.querySelector('div .planetName');
            const textA = linkA ? linkA.textContent.trim() : '';
            const textB = linkB ? linkB.textContent.trim() : '';
            const p1 = getPlanetByName(textA.trim());
            const p2 = getPlanetByName(textB.trim());
            
            workerA = getPopulationOfPlanet(p1);
            workerB = getPopulationOfPlanet(p2);

            if (workerA === workerB) {
                return textA.localeCompare(textB);
            } else {
                return (workerA > workerB)?-1:1;
            }
       });
    }

    table.innerHTML = '';
    const elementsToRemove = table.querySelectorAll("div[id='planetList']");

    elementsToRemove.forEach((element) => {
        element.remove();
    });
    table.appendChild(filterDiv);
    table.appendChild(homePlanet);
    rowsArray.forEach(row => table.appendChild(row));
}

function getPopulationOfPlanet(p)
{
    var w1 = 0, w2 = 0;
    
    w1 = getResource(p, 'Worker');
    w2 = getResource(p, 'OccupiedWorker');
    
    w1 = w1?w1.amount:0;
    w2 = w2?w2.amount:0;
    
    return w1+w2;
}

function sendBase64ImageToDiscord(webhookUrl, base64Image)
{
  try {
    // Strip data:image/png;base64,
    base64Image = base64Image.substr(base64Image.indexOf(',') + 1);
    // Convert base64 image to binary
    const binaryImage = atob(base64Image);
    const imageLength = binaryImage.length;
    const uint8Array = new Uint8Array(imageLength);
    for (let i = 0; i < imageLength; i++) {
      uint8Array[i] = binaryImage.charCodeAt(i);
    }

    // Create form data payload
    const form = new FormData();
    const file = new Blob([uint8Array], { type: 'image/png' });
    form.append("content", "Screenshot from " + localStorage.getItem('cfgRulername') + " on turn " + turnNumber);
    form.append("tts", "false");
    form.append('file', file, '/usr/share/screenshot.png');

    // Create XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    xhr.open('POST', webhookUrl);

    // Set up the request headers
    const headers = {
      'Accept': '*/*'
    };
    for (const header in headers) {
      xhr.setRequestHeader(header, headers[header]);
    }

    // Send the request
    xhr.send(form);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          console.log('Image sent to Discord successfully!', xhr.responseText);
        } else {
          console.error('Error sending image to Discord:', xhr.status, xhr.responseText);
        }
      }
    };
  } catch (error) {
    console.error('Error sending image to Discord:', error.message);
  }
}

function imageToBlob(imageURL)
{
  const img = new Image;
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  img.crossOrigin = "";
  img.src = imageURL;
  return new Promise(resolve => {
    img.onload = function () {
      c.width = this.naturalWidth;
      c.height = this.naturalHeight;
      ctx.drawImage(this, 0, 0);
      c.toBlob((blob) => {
        // here the image is a blob
        resolve(blob)
      }, "image/png", 1);
    };
  })
}

function copyToClipboard(base64image)
{
  const blob = imageToBlob(base64image)
  const item = new ClipboardItem({ "image/png": blob });
  navigator.clipboard.write([item]);
  showNotification('The screenshot was copied into the local clipboard!');
  return;
}

function generateScreenshot(element)
{
    console.log(element);
    var hook = false;
    var screenshotTarget;
    if (typeof element !== 'undefined') {
        screenshotTarget = document.getElementById(element);
console.log(element);
    } else {
        screenshotTarget = document.getElementById('contentBox');
    }
    const coord = screenshotTarget.getBoundingClientRect()

    if (window.event.ctrlKey) {
        hook = false;
    } else {
        hook = localStorage.getItem('cfgDiscordTokenA');
    }

    html2canvas(document.body, {x: coord.left, y: coord.top, width: coord.right - coord.left, height: coord.bottom-coord.top}).then((canvas) => {
        const base64image = canvas.toDataURL("image/png");
        const request = new XMLHttpRequest();

        if (hook && hook.length > 6) {
            sendBase64ImageToDiscord(hook, base64image);
        } else {
            copyToClipboard(base64image);
        }
        return;
    });
}

function savePluginConfiguration()
{
    localStorage.setItem('cfgRulername', document.getElementById('cfgRulername').value);
    localStorage.setItem('cfgAllyNAP', document.getElementById('cfgAllyNAP').value);
    localStorage.setItem('cfgAllyNAPcolor', document.getElementById('cfgAllyNAPcolor').value);
    localStorage.setItem('cfgAllyCAP', document.getElementById('cfgAllyCAP').value);
    localStorage.setItem('cfgAllyCAPcolor', document.getElementById('cfgAllyCAPcolor').value);
    localStorage.setItem('cfgAllyCAP', document.getElementById('cfgAllyCAP').value);

    localStorage.setItem('cfgDiscordTokenA', document.getElementById('cfgDiscordTokenA').value);

    localStorage.setItem('cfgPlanetSortingV2', document.getElementById('cfgPlanetSortingV2').value);
    localStorage.setItem('cfgRadarSorting', document.getElementById('cfgRadarSorting').checked);
    localStorage.setItem('cfgFleetSorting', document.getElementById('cfgFleetSorting').checked);
    localStorage.setItem('cfgShowSM', document.getElementById('cfgShowSM').checked);
    localStorage.setItem('cfgShowAS', document.getElementById('cfgShowAS').checked);

    showNotification("Settings saved successfully");
}

function dumpPluginConfiguration()
{
    showNotification('Data dumping in console');
    console.log('cfgRulername = ' + localStorage.getItem('cfgRulername'));
    console.log('cfgAllyNAP = ' + localStorage.getItem('cfgAllyNAP'));
    console.log('cfgAllyNAPcolor = ' + localStorage.getItem('cfgAllyNAPcolor'));
    console.log('cfgAllyCAP = ' + localStorage.getItem('cfgAllyCAP'));
    console.log('cfgAllyCAPcolor = ' + localStorage.getItem('cfgAllyCAPcolor'));
    console.log('cfgAllyCAP = ' + localStorage.getItem('cfgAllyCAP'));

    console.log('cfgPlanetSortingV2 = ' + localStorage.getItem('cfgPlanetSortingV2'));
    console.log('cfgRadarSorting = ' + localStorage.getItem('cfgRadarSorting'));
    console.log('cfgFleetSorting = ' + localStorage.getItem('cfgFleetSorting'));
    console.log('cfgShowSM = ' + localStorage.getItem('cfgShowSM'));
    console.log('cfgShowAS = ' + localStorage.getItem('cfgShowAS'));
}

function showPluginConfiguration()
{
    var contentBox = document.getElementById('contentBox');
    var pageTitle = contentBox.querySelector('.pageTitle');
    var mainBox = document.createElement('div');
    pageTitle.innerHTML = 'Utilities Configuration';
    contentBox.innerHTML = '';

    contentBox.appendChild(pageTitle);

    mainBox.className = 'opacBackground ofHidden padding';
    contentBox.appendChild(mainBox);
    mainBox.id = 'cfgBox';

    addGlobalStyle('.input-text-cfg { width: 168px; height: 14px; font-size: 12px; margin-right: 10px; border: 1px solid #7a7a7a; background-color: #4a4a4a; color: #ffffff; }');
    addGlobalStyle('.input-text-cfg-color { width: 72px; height:18px; font-size: 12px; margin-right: 10px; border: 1px solid #7a7a7a; background-color: #4a4a4a; color: #ffffff; }');

    mainBox.innerHTML = '<div style="overflow: hidden; padding: 0px" class="lightBorder opacDarkBackground"> ' +
    '  <div class="tableHeader">' +
    '     <div class="left title" style="padding-left: 4px">Setting</div>' +
    '     <div class="title right" style="width: 20px"></div>' +
    '     <div class="title right"></div>' +
    '  </div>' +
    '  <div class="entry opacBackground lightBorderBottom" style="padding: 4px">' +
    '    <div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;">Rulername</div>' +
    '    <div class="left" style="padding-top: 2px;">' +
    '      <input type="text" class="input-text-cfg" id="cfgRulername" value="" />' +
    '    </div>' +
    '    <div class="left" style="line-height: 22px">Copy of your rulername (used in various messaging)</div>' +
    '    <div class="right" style="padding-top: 2px; width: 100px; text-align: right;"></div>' +
    '  </div>' +
    '<!--  <div class="entry opacLightBackground lightBorderBottom" style="padding: 4px">' +
    '    <div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;">???</div>' +
    '    <div class="left" style="padding-top: 2px; ">' +
    '      <input type="text" class="input-text-cfg" id="TODO" value="" />' +
    '    </div>' +
    '    <div class="left" style="line-height: 22px">????</div>' +
    '    <div class="right" style="padding-top: 2px; width: 100px; text-align: right;"></div>' +
    '  </div> -->' +
    '  <div class="entry opacBackground lightBorderBottom" style="padding: 4px">' +
    '    <div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;">NAP list</div>' +
    '    <div class="left" style="padding-top: 2px;">' +
    '      <input type="text" class="input-text-cfg" id="cfgAllyNAP" value="" />' +
    '    </div>' +
    '    <div class="left" style="line-height: 22px">Which alliances should be classified and color coded as NAP</div>' +
    '    <div class="right" style="padding-top: 2px; width: 100px; text-align: right;">' +
    '      <input type="color" class="input-text-cfg-color" id="cfgAllyNAPcolor" value="#ff8080" />' +
    '    </div>' +
    '  </div>' +
    '  <div class="entry opacLightBackground lightBorderBottom" style="padding: 4px">' +
    '    <div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;">CAP list</div>' +
    '    <div class="left" style="padding-top: 2px; ">' +
    '      <input type="text" class="input-text-cfg" id="cfgAllyCAP" value="" />' +
    '    </div>' +
    '    <div class="left" style="line-height: 22px">Which alliances should be classified and color coded as CAP</div>' +
    '    <div class="right" style="padding-top: 2px; width: 100px; text-align: right;">' +
    '      <input type="color" class="input-text-cfg-color" id="cfgAllyCAPcolor" value="#f6b73c" />' +
    '    </div>' +
    '  </div>' +
    `
  <div class="entry opacBackground lightBorderBottom" style="padding: 4px">
    <div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;">Planet sorting</div>
    <div class="left" style="padding-top: 2px;">
      <select style='font-size: 12px; border: 1px solid #7a7a7a; background-color: #4a4a4a; color: #ffffff;' id="cfgPlanetSortingV2" name="cfgPlanetSortingV2">
        <option value=''>default / coords</option>
        <option value='name'>by planet name</option>
        <option value='pop'>by population</option>
      </select>
    </div>
  </div>
  <div class="entry opacLightBackground lightBorderBottom" style="padding: 4px">
    <div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;"><input type="checkbox" id="cfgRadarSorting" name="cfgRadarSorting" value="" /> <label for="cfgRadarSorting">Fix radar sorting</label></div>
    <div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;"><input type="checkbox" id="cfgFleetSorting" name="cfgFleetSorting" value="" /> <label for="cfgFleetSorting">Fix fleet sorting</label></div>
  </div>
  <div class="entry opacBackground lightBorderBottom" style="padding: 4px">
    <div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;"><input type="checkbox" id="cfgShowSM" name="cfgShowSM" value=""/> <label for="cfgShowSM">Show ST/GB/JG in planet list</label></div>
    <div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;"><input type="checkbox" id="cfgShowAS" name="cfgShowAS" value=""/> <label for="cfgShowAS">Show available ships in planet list</label></div>
  </div>` +
    '  <div class="entry opacLightBackground lightBorderBottom" style="padding: 4px">' +
    '    <div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;">Discord sharing</div>' +
    '    <div class="left" style="padding-top: 2px; ">' +
    '      <input type="text" class="input-text-cfg" id="cfgDiscordTokenA" value="" />' +
    '    </div>' +
    '    <div class="left" style="line-height: 22px">Place discord token in order to enable sharing of screenshots</div>' +
    '    <div class="right" style="padding-top: 2px; width: 100px; text-align: right;">' +
    '    </div>' +
    '  </div>' +
        '  <div class="right entry  opacBackground coordsInput" style="border-left: 1px solid #545454; padding: 4px"> ' +
    '    <div class="right" style="line-height: 22px; padding-left: 6px"> ' +
    '      <input type="button" name="cfgVers" id="cfgVers" value="ChangeLog" /> ' +
    '      <input type="button" name="cfgHelp" id="cfgHelp" value="Help" /> ' +
    '      <input type="button" name="cfgDump" id="cfgDump" value="Dump" /> ' +
    '      <input type="button" name="cfgSave" id="cfgSave" value="Save" /> ' +
    '    </div> ' +
    '  </div>' +
    '</div>';

    /* Text values */
    document.getElementById('cfgRulername').value = localStorage.getItem('cfgRulername');
    document.getElementById('cfgAllyNAP').value = localStorage.getItem('cfgAllyNAP');
    document.getElementById('cfgAllyNAPcolor').value = localStorage.getItem('cfgAllyNAPcolor');
    document.getElementById('cfgAllyCAP').value = localStorage.getItem('cfgAllyCAP');
    document.getElementById('cfgAllyCAPcolor').value = localStorage.getItem('cfgAllyCAPcolor');
    document.getElementById('cfgAllyCAP').value = localStorage.getItem('cfgAllyCAP');
    document.getElementById('cfgDiscordTokenA').value = localStorage.getItem('cfgDiscordTokenA');

    /* Boolean setting */
    document.getElementById('cfgRadarSorting').checked = parseBool(localStorage.getItem('cfgRadarSorting'));
    document.getElementById('cfgFleetSorting').checked = parseBool(localStorage.getItem('cfgFleetSorting'));
    document.getElementById('cfgPlanetSortingV2').value = localStorage.getItem('cfgPlanetSortingV2');
    document.getElementById('cfgShowSM').checked = parseBool(localStorage.getItem('cfgShowSM'));
    document.getElementById('cfgShowAS').checked = parseBool(localStorage.getItem('cfgShowAS'));

    /* Buttons */
    document.getElementById('cfgVers').addEventListener('click', function() { showWhatsNew(); }, false);
    document.getElementById('cfgHelp').addEventListener('click', function() { showHelp(); }, false);
    document.getElementById('cfgDump').addEventListener('click', function() { dumpPluginConfiguration(); }, false);
    document.getElementById('cfgSave').addEventListener('click', function() { savePluginConfiguration(); }, false);
}

/* === END OF FEATURE FUNCTIONS === */

/* === START OF GENERIC FUNCTIONS === */

/* function to decode URI params */
function getQueryParams(qs)
{
    qs = qs.split('+').join(' ');
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
    return params;
}

function makeId(length)
{
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

/* Formatting numbers */
function formatNumber(num)
{
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

/* common function in css to change css style */
function addGlobalStyle(css)
{
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function getDate()
{
    let d = new Date();

    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }

    return [year, month, day].join('-');
}

function parseBool(val)
{
    if (val==='true') {
        return true;
    } else {
        return false;
    }
}

function parseInteger(val)
{
    return parseInt(val.replaceAll(',', '').replace('%', '').replace('(', '').replace(')', '').replace('+', ''));
}

function initializeConfig()
{
    console.log("Initializing initial configuration");
    /* First get the playerBox.
       Then get the first element with "left" and "border" classes
       This one holds "Welcome [TAG]Player name"
       This one holds "Welcome PLayer name"
     */
    var e = document.getElementById("playerBox");
    if (!e) {
        return;
    }
    e = e.querySelector('.left.border');
    if (!e) {
        return;
    }

    e = e.innerHTML.trim();

    var playerName = '';
    if (e && e.match(/^Welcome .*$/g)) {
        const regexAlly = /^Welcome \[.*\](.*)$/;
        const regexNonAlly = /^Welcome (.*)$/;
        var match = e.match(regexAlly);
        if (match) {
            playerName = match[1];
        } else {
            match = e.match(regexNonAlly);
            if (match) {
                playerName = match[1];
            }
        }
    }

    playerName = window.prompt("Enter player name", playerName);
    if (!playerName) {
        window.alert("Cancelling initializing of config");
        return;
    }

       localStorage.setItem('cfgRulername', playerName);
    localStorage.setItem('cfgAllyNAP', 'ALLY1, ALLY2');
    localStorage.setItem('cfgAllyNAPcolor', '#FFE66F');
    localStorage.setItem('cfgAllyCAP', 'ALLY3, ALLY4');
    localStorage.setItem('cfgAllyCAPcolor', '#6FFFA2');

    localStorage.setItem('cfgRadarSorting', 'true');
    localStorage.setItem('cfgFleetSorting', 'true');
    localStorage.setItem('cfgPlanetSortingV2', 'name');
    localStorage.setItem('cfgShowSM', 'true');
    localStorage.setItem('cfgShowAS', 'true');

    window.alert('Initializing config');
}

function showNotification(message)
{
    var newDev = document.getElementById('dhNotification');
    if (newDev==null) {
        addGlobalStyle(".vcenter { display: table; left: 70px;  height: 100%; text-align: center; /* optional */ }");
        addGlobalStyle(".vcenter > :first-child { display: table-cell; vertical-align: middle; }");

        var newDiv = document.createElement('div');
        newDiv.id = 'dhNotification';
        newDiv.className = 'turnUpdateDialog';
        newDiv.style.minHeight = '50px';
        newDiv.style.padding = 0;
        newDiv.style.background = 'rgba(0, 50, 250, 0.7)';
        newDiv.style.verticalAlign = 'middle';
        newDiv.innerHTML = '<div><img src="/images/buttons/warning.png" width="50" height="50"></div><div class="vcenter"><p id="dhMsg">Test me!.asd</p></div>';
        document.body.appendChild(newDiv);
    }

    document.getElementById('dhNotification').style.display = 'block';
    var nMsg = document.getElementById('dhMsg');
    nMsg.innerText = message;

    setTimeout(function () {
        document.getElementById('dhNotification').style.display = 'none';
    }, 8000);
}
/* === END OF GENERIC FUNCTIONS === */
