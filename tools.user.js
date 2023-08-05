// ==UserScript==
// @name	     DG utilities v0.4
// @namespace    devhex
// @version      0.4.0004
// @description  various minor improvements of DG interface
// @match        https://*.darkgalaxy.com
// @match        https://*.darkgalaxy.com/*
// @require      https://html2canvas.hertzen.com/dist/html2canvas.min.js
// @require      https://raw.githubusercontent.com/Arcopix/dg-tools/dg-tools-v4-dev/resources.js
// @copyright    2020-2023, Stefan Lekov / Arcopix / Devhex Ltd
// @homepage     https://github.com/Arcopix/dg-tools
// @supportURL   https://github.com/Arcopix/dg-tools/issues
// @downloadURL  https://raw.githubusercontent.com/Arcopix/dg-tools/dg-tools-v4-dev/tools.user.js
// @updateURL    https://raw.githubusercontent.com/Arcopix/dg-tools/dg-tools-v4-dev/tools.user.js
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACrUlEQVQ4jY2T3YsTZxTGf+/MZCfZmDXR1P1wdT+irfiRokK7uCBExC0UBC9KL/z4B7wqlf4BvW0RKvaqf0ahoLe6CquorWyWlqwbdsmaTHSSycxOZiYz7+uFFoIW6gMHDoeH53A+HsGHMIDxUcHs3jT7AOwQa0dSB1pAPEwW7+VTnxYyS5WjB7/+bH7myIimCgKJ7bidraa19njD+uO55d8ZKLYBNSyg6XDi0ucHvvv2wtmL0zOlgjeIWd+oEycSoWICt4NtNTt/vWj8fq/evdkd8ByQ+lcTJjUvOXzti/kfr1++9E1+fynbsHs0222ar17jhTH1rQZr63X8cJDJasmxLPH4tp88vTqbei2A3Lm5/I3vr138wdg9ka5ttvB9j5bVwmrbJDKhY9u8srvEiQQEQqn+dl/99DKQP+tpOH2lcvzG2CdT+2ubTXp+n7GZI6h0jr+rVYJBwuHTiwQqxT+bTdr9hHagUn6iCrFixTg+mV2YnZuaf/GyRa22Sa44QT49xk5kUz57ASklgW5yoJzn4do6Xcf5d+lzwIIxnh895LiB2di2abUsukFCbrrB4wfLfHl+iVhKnjx4iDFiEg4GwxdMA4e0sB+Mbmw0tF7PJYxCgiAkkgo3gUgqokRhjJhUKhWKxeKwgAaMGn4YO27Plb3+QHe9HUwzT27PXo6dPEWn66CAUqlEJpNB07RhAQk4hhPJ6k7P8Rw3Kjj9GL9l8+dqFaVgeXkZgMXFRR6trNDpdIYFPKDKrpRWXpoeuX+mqKt9KZQhUO++7P/iPlDWI6kcA0w/ZsEKVSZS/+GOD9EFfgXuktEFumDS1MQvAtyP6OwBt4BJAD1WoMBLFKtAAEwAWd66cthsgYB1Ab8Bt4EG7xEA8sBRoAycBGbf1beApwKeCViVb0cA4A0jB1JIhWkJiAAAAABJRU5ErkJggg==
// @grant        none
// ==/UserScript==

/* Common counters & pointers */
var i, j, k, l, m, n, p, q;
var buf;

/* Common data */

const logisticsCapacity = {
    "freighter": 100000,
    "merchant": 250000,
    "trader": 625000,
    "hulk": 1562500
};

const RTT = [32, 24, 16];
var curRTT = 0;

/* End of common data, variables */

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
if (!localStorage.getItem('cfgRulername')||localStorage.getItem('cfgRulername')=='') {
    initializeConfig();
}

if (!localStorage.getItem('cfgShowedHelp')||localStorage.getItem('cfgShowedHelp')!=='v0.4.0004') {
    showHelp();
}

/* Global configuration */
var cfgRulername = localStorage.getItem('cfgRulername');
var cfgAllyNAP = localStorage.getItem('cfgAllyNAP');
var cfgAllyNAPcolor = localStorage.getItem('cfgAllyNAPcolor');
var cfgAllyCAP = localStorage.getItem('cfgAllyCAP');
var cfgAllyCAPcolor = localStorage.getItem('cfgAllyCAPcolor');
var cfgRadarSorting = parseBool(localStorage.getItem('cfgRadarSorting'));
var cfgFleetSorting = parseBool(localStorage.getItem('cfgFleetSorting'));
var cfgPlanetSorting = parseBool(localStorage.getItem('cfgPlanetSorting'));

/* Updated main menu items */
var confIcon = document.createElement('div');
confIcon.className = 'left relative';
confIcon.style = 'cursor:pointer;';
confIcon.innerHTML = '<img src="' + imageContainer["confIcon.png"] + '"/>';

confIcon.addEventListener('click', function() { showPluginConfiguration() }, false);

/* Updated main menu items */
var screenshotIcon = document.createElement('div');
screenshotIcon.className = 'left relative';
screenshotIcon.style = 'cursor:pointer;';
screenshotIcon.innerHTML = '<img src="' + imageContainer["screenshotIcon.png"] + '"/>';

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
	if (typeof c !== 'undefined' && typeof c.innerText !== 'undefined' && c.innerText=='0.0.0.0') {
		continue;
	}

	if (c && c.innerText.match(/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/g)) {
		let p = c.innerText.split('.');
		c.innerHTML = '<a href="/navigation/' + p[0] + '/' + p[1] + '/' + p[2] + '/">' + c.innerHTML + '</a>';
	}
}

/* Colorize the alliance tag / playname if it matches a tag arrayAllyNAP */
if (cfgAllyNAP!='') {
	var arrayAllyNAP = cfgAllyNAP.split(',');

	for (i=0; i<arrayAllyNAP.length; i++) {
		arrayAllyNAP[i] = '[' + arrayAllyNAP[i].trim() + ']';
	}

	var elems = document.getElementsByTagName("div");
	var deb=0;
	var player="";
	for (i=0; i<elems.length; i++) {
		var e = elems[i];
		if (e.className=="allianceName"&&arrayAllyNAP.includes(e.innerText.trim())) {
            /* Colorize the alliance TAG */
			e.style.color = cfgAllyNAPcolor;
            /* Find the Element with the entire planet */
			p = e.parentElement.parentElement.parentElement;
            /* Reset the border of the planet */
            p.style.border = "1px solid " + cfgAllyNAPcolor;
            /* Reset the color for any text */
            p.style.color = cfgAllyNAPcolor;
            p.querySelector("span").style.color = cfgAllyNAPcolor;
            p.querySelector("a").style.color = cfgAllyNAPcolor;
            /* Properly colorize the player name */
            p.querySelector('div .playerName').style.color = cfgAllyNAPcolor;
		}
	}
}

/* Colorize the alliance tag / playname if it matches a tag arrayAllyCAP */
if (cfgAllyCAP!='') {
	var arrayAllyCAP = cfgAllyCAP.split(',');

	for (i=0; i<arrayAllyCAP.length; i++) {
		arrayAllyCAP[i] = '[' + arrayAllyCAP[i].trim() + ']';
	}

	elems = document.getElementsByTagName("div");
	deb=0;
	player="";
	for (i=0; i<elems.length; i++) {
		e = elems[i];
		if (e.className=="allianceName"&&arrayAllyCAP.includes(e.innerText.trim())) {
            /* Colorize the alliance TAG */
			e.style.color = cfgAllyCAPcolor;
            /* Find the Element with the entire planet */
			p = e.parentElement.parentElement.parentElement;
            /* Reset the border of the planet */
            p.style.border = "1px solid " + cfgAllyCAPcolor;
            /* Reset the color for any text */
            p.style.color = cfgAllyCAPcolor;
            p.querySelector("span").style.color = cfgAllyCAPcolor;
            p.querySelector("a").style.color = cfgAllyCAPcolor;
            /* Properly colorize the player name */
            p.querySelector('div .playerName').style.color = cfgAllyCAPcolor;
		}
	}
}

/* Add onclick to player names through the interface to forward to mail module */
elems = document.getElementsByClassName("playerName");
for (i=0; i<elems.length; i++) {
	e = elems[i];
	if (e.parentNode.className=='friendly') {
		e.style.cursor = 'not-allowed';
		continue;
	}
	e.addEventListener('click', function() {
		window.location.href = "/mail/?to=" + this.innerText.trim();
	}, false);
}

/* If in mail module and to is set -> set the recepient */
if (window.location.pathname=="/mail/" && window.location.search!=="") {
	var query = getQueryParams(document.location.search);
	if (typeof query.to != 'undefined' && query.to != "") {
		document.getElementsByName('to')[0].value = query.to;
	}
}

/* Add confirmation on canceling buildings */
elems = document.getElementsByClassName("queueRemoveButton");
for (i=0; i<elems.length; i++) {
	var add_confirm = 0;
	var left, name;
	e = elems[i];
	p = e.parentElement.parentElement;

	for (j=0; j<p.children.length; j++) {
		if (p.children[j].className=="left name") {
			name = p.children[j].innerText;
		}
		if (p.children[j].className=="left width25") {
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
		if (document.activeElement.tagName=='input') {
			return;
		}
		if (e.which === 37) {
			document.querySelector(".navigation.left").click();
		}
		if (e.which === 39) {
			document.querySelector(".navigation.right").click();
		}
	});
}

/* Fix coordinates to be min 100 px in width due bug in Navigation:
   - News link is not shown due to width of 85px for longer coordinates (10-12) */
if (window.location.href.match(/\/navigation\/[0-9]+\/[0-9]+\/[0-9]+/)) {
    addGlobalStyle(".coords {min-width: 120px;}");

    addGlobalStyle("img.jumpTo {cursor: pointer;}");
    addGlobalStyle("div.contextMenu { background-color: rgba(100, 100, 100, 0.8); min-width: 100px; padding: 10px; display: none; position: absolute; border: 1px solid #fff}");
    addGlobalStyle("div.contextMenuItem { background-color: rgba(100, 100, 100); margin: 2px; padding-left: 3px; border-left: 1px solid #000 }");
    addGlobalStyle("div.contextMenuItem:hover { background-color: rgba(80, 80, 80, 1); }");

    var newDiv = document.createElement('div');
    newDiv.id = 'dhFleetListMenu';
    newDiv.className = 'contextMenu';
    newDiv.style.minHeight = '50px';
    document.body.appendChild(newDiv);

    buf = document.querySelectorAll('div .planets');
    for (i = 0; i<buf.length; i++) {
        p = buf[i].querySelector('div .right');
        n = buf[i].querySelector('span');
        /* Actual coordinates */
        n = n.innerHTML;

        q = makeId(8);
        p.innerHTML = p.innerHTML + '<img id=' + q + ' src="' + imageContainer["jumpToIcon.png"] + '"/>';
        m = document.getElementById(q);
        m.setAttribute('coordinate', n);
        m.className = 'jumpTo';
        m.addEventListener("click", showJumpMenu, false);
    }

}

/* Script by Mordread -> use ARROW keys to navigate in planet details
   fix by Arcopix - removed anonymous function, since it was useless */
if (document.querySelector('#planetHeader .planetName a:nth-of-type(1)')) {
	document.addEventListener("keydown", e => {
		if (document.activeElement.tagName=='input') {
			return;
		}
		if (e.which === 37) {
			document.querySelector('#planetHeader .planetName a:nth-of-type(1)').click();
		}
		if (e.which === 39) {
			document.querySelector('#planetHeader .planetName a:nth-of-type(2)').click();
		}
	});
}

if (window.location.href.match(/\/fleet\/[0-9]+/)) {
    buf = getQueryParams(document.location.search);

    if (buf.c1 && buf.c2 && buf.c3 && buf.c4) {
        addGlobalStyle("@keyframes color { 0%   { background: #A00; } 50% { background: #000; } 100% { background: #A00; } }");
        addGlobalStyle(".blinkButton { animation: color 1s infinite linear }");

        showNotification("Make sure you actually queue your fleet.");

        document.querySelector('input[name="coordinate.0"]').value = buf.c1;
        document.querySelector('input[name="coordinate.1"]').value = buf.c2;
        document.querySelector('input[name="coordinate.2"]').value = buf.c3;
        document.querySelector('input[name="coordinate.3"]').value = buf.c4;

        buf = document.querySelector('input[name="coordinate.0"]').parentNode.parentNode.parentNode;
        buf = buf.querySelector('input[type="Submit"]');
        buf.className = 'blinkButton';
    }
}

/* Navigate through fleets using ARROW keys */
if (location.href.includes('/fleet/')&&document.querySelector('.nextPrevFleet')) {
	/* If we have only RIGHT fleet, meaning we are only at first one, activate RIGHT ARROW ONLY */
	if (document.querySelector('.nextPrevFleet').innerText === '»') {
		document.addEventListener("keydown", e => {
			if (document.activeElement.tagName=='INPUT') {
				return;
			}
			if (e.which === 39) {
				document.querySelectorAll('.nextPrevFleet a:nth-of-type(1)')[0].click();
			}
		});
	} else if (typeof (document.querySelectorAll('.nextPrevFleet')[0]) !== 'undefined' &&
			   typeof (document.querySelectorAll('.nextPrevFleet')[1]) !== 'undefined') {
		document.addEventListener("keydown", e => {
			if (document.activeElement.tagName=='INPUT') {
				return;
			}
			if (e.which === 37) {
				document.querySelectorAll('.nextPrevFleet a:nth-of-type(1)')[0].click();
			}
			if (e.which === 39) {
				document.querySelectorAll('.nextPrevFleet a:nth-of-type(1)')[1].click();
			}
		});
	} else { /* In case of '«' */
		document.addEventListener("keydown", e => {
			if (document.activeElement.tagName=='INPUT') {
				return;
			}
			if (e.which === 37) {
				document.querySelectorAll('.nextPrevFleet a:nth-of-type(1)')[0].click();
			}
		});
	}
}


if (cfgFleetSorting && location.href.includes('/fleets/')) {
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

   rows = table.querySelectorAll('.entry');

   for (i = 0; i<rows.length; i++) {
        rowsArray[i].className = (i%2?'opacBackground entry':'opacLightBackground entry');
   }
}

/* Cache fleets for future usage */
if (location.href.includes('/fleets/')) {
    var fleetArray = [];
    const table = document.getElementById("fleetList");
    rows = table.querySelectorAll('.entry');
    rowsArray = Array.from(rows);

    for (i = 0; i<rowsArray.length; i++) {
        const link = rowsArray[i].querySelector('.name a');
        var fleet = { name: link.text, url: link.href };
        fleetArray.push(fleet);
    }
    localStorage.setItem('fleetArray', JSON.stringify(fleetArray));
}

/* Fix sorting of planets */
if (cfgPlanetSorting) {
    /* Sort planets in select drop down in Fleet command */
    var planetSelect;
	if (planetSelect = document.querySelector('select[name="locationId"]')) {
        const options = Array.from(planetSelect.options);
        const homePlanet = options.shift();

        options.sort((a, b) => {
            const textA = a.text.toLowerCase();
            const textB = b.text.toLowerCase();

            if (textA < textB) return -1;
            if (textA > textB) return 1;
            return 0;
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
        updatePlanetSorting();
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

    document.getElementById('btnStats').addEventListener("click", generateStats, false);
    document.getElementById('btnLogst').addEventListener("click", generateLogistics, false);
}

if (window.location.href.match(/\/planet\/[0-9]+\//)) {
    el = document.getElementsByTagName('img');
    for (i=0; i<el.length; i++) {
        if (el[i].src.match(/\/destroy_.*\.jpg/)) {
            const imgFilename = el[i].src.split('/').pop();
            if (imageContainer[imgFilename]) {
                el[i].src = imageContainer[imgFilename];
            } else {
                console.log('No image overide for ' + imgFilename);
            }
        }
    }
}



/* Fix sorting of radars */
var radars, radar, fleetRow, fleetCount;
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
					if (n = ((n+1)%2)) {
						crow[j].className = "opacBackground lightBorderBottom entry";
					} else {
						crow[j].className = "opacLightBackground lightBorderBottom entry";
					}
					//alert(crow[j].className);
					radars[i].appendChild(crow[j]);
					/* Nullify the row so we would not have to search it by class, text and so on */
					crow[j] = 0;
				}
			}
		}

		/* Make sure to add any rows that are not already aded/invalidated */
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
		if(e.which == 110 || e.which == 188 || e.which == 190) {
			e.preventDefault();
			document.querySelector('input[name="coordinate.1"]').value = '';
			document.querySelector('input[name="coordinate.1"]').focus();
		}
	});

	el = document.querySelector('input[name="coordinate.1"]');
	el.addEventListener('keydown', function(e) {
		if(e.which == 110 || e.which == 188 || e.which == 190) {
			e.preventDefault();
			document.querySelector('input[name="coordinate.2"]').value = '';
			document.querySelector('input[name="coordinate.2"]').focus();
		}
		if (e.which == 8 && this.value=='') {
			e.preventDefault();
			document.querySelector('input[name="coordinate.0"]').focus();
		}
	});

    el = document.querySelector('input[name="coordinate.2"]');
	el.addEventListener('keydown', function(e) {
		if(e.which == 110 || e.which == 188 || e.which == 190) {
			e.preventDefault();
			document.querySelector('input[name="coordinate.3"]').value = '';
			document.querySelector('input[name="coordinate.3"]').focus();
		}
		if (e.which == 8 && this.value=='') {
			e.preventDefault();
			document.querySelector('input[name="coordinate.1"]').focus();
		}
	});

	el = document.querySelector('input[name="coordinate.3"]');
	el.addEventListener('keydown', function(e) {
		if (e.which == 8 && this.value=='') {
			e.preventDefault();
			document.querySelector('input[name="coordinate.2"]').focus();
		}
	});
}

/* Add short onclick on different comms scans to select that type of scan */
if (location.href.includes('/comms/')) {
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
}

/* Request confirmation when kicking people from alliance */
if (window.location.pathname=='/alliances/') {
	k = document.querySelectorAll('input[type=submit]');
	for (i=0; i<=k.length; i++) {
		if (k[i]&&k[i].value=='Kick Member') {
			l=k[i];
			/* Get the player name. This is a bit ugly, but oh well... */
			let playerName = l.parentNode.parentNode.parentNode.querySelector('div.name').innerText;
			l.confirmString = "Are you sure you want to kick " + playerName + "?";
			l.addEventListener('click', function(evt) { if (confirm(evt.currentTarget.confirmString)===false) evt.preventDefault(); });
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
                    if (children[n].id == '') {
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

function showHelp()
{
    console.log("Showing help");

    const main = document.getElementById('contentBox');

    localStorage.setItem('cfgShowedHelp', 'v0.4.0004');

    addGlobalStyle('.topic {padding: 10px; cursor: pointer; border-bottom: 1px solid #ddd; letter-spacing: 1px; padding-left: 20px;}');
    addGlobalStyle('.topicContent { display: none; padding: 10px; border-bottom: 1px solid #ddd; }');
    addGlobalStyle('.topicContent.show { display:block; }');
    main.innerHTML = '<div class="header border pageTitle"><span>DG utilities help</span></div><div class="opacBackground ofHidden padding" id="helpBox"></div>';

    const help = document.getElementById('helpBox');

    help.innerHTML = '';

    help.innerHTML += '<div class="lightBorder ofHidden opacBackground header topic" onclick="c = document.querySelectorAll(\'.topicContent\'); c.forEach((s, i) => { if (i === 0) { s.classList.toggle(\'show\'); } else {s.classList.remove(\'show\'); } });">DG utilties</div>';
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
    help.innerHTML += '<div class="lightBorder ofHidden opacBackground header topic" onclick="c = document.querySelectorAll(\'.topicContent\'); c.forEach((s, i) => { if (i === 1) { s.classList.toggle(\'show\'); } else {s.classList.remove(\'show\'); } });">Colorization</div>';
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

    help.innerHTML += '<div class="lightBorder ofHidden opacBackground header topic" onclick="c = document.querySelectorAll(\'.topicContent\'); c.forEach((s, i) => { if (i === 2) { s.classList.toggle(\'show\'); } else {s.classList.remove(\'show\'); } });">Screenshots</div>';
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
    <img style="padding: 10px;" src="` + imageContainer['screenshotExample.png'] + `"/>
    </div>`;

    help.innerHTML += '<div class="lightBorder ofHidden opacBackground header topic" onclick="c = document.querySelectorAll(\'.topicContent\'); c.forEach((s, i) => { if (i === 3) { s.classList.toggle(\'show\'); } else {s.classList.remove(\'show\'); } });">Fleet queuing</div>';
    help.innerHTML += `<div class="topicContent">
    <p>While browsing the in-game Navigation you can press the queue fleet icon (<img style="vertical-align: middle;" src="` + imageContainer['jumpToIcon.png'] + `"/>)
    which will pop a context menu with your current fleets.</p>
    <div class="error seperator"><strong>Warning:</strong> This will only open the selected fleet and populate the coordinates. You'll have to confirm the fleet movement manually.</div>
    <img style="padding: 10px;" src="` + imageContainer['navigationExample.png'] + `"/>
    </div>`;

    help.innerHTML += '<div class="lightBorder ofHidden opacBackground header topic " onclick="c = document.querySelectorAll(\'.topicContent\'); c.forEach((s, i) => { if (i === 4) { s.classList.toggle(\'show\'); } else {s.classList.remove(\'show\'); } });">Planet logistics</div>';
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

function showJumpMenu(e)
{
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

    /* The context menu is aleady populated */
    if (m.innerHTML!='') {
        m.style.display = 'block';
        return;
    }

    /* Populate context menu prior to showing it */
    for (var i =0; i < f.length; i++) {
        var newDiv = document.createElement('div');
        var url = f[i].url;
        url += '?';
        url += 'c1=' + coordinate[0];
        url += '&c2=' + coordinate[1];
        url += '&c3=' + coordinate[2];
        url += '&c4=' + coordinate[3];

        newDiv.className = 'contextMenuItem';
        newDiv.innerHTML = '<a href="' + url + '">' + f[i].name + '</a>';
        m.appendChild(newDiv);
    }
    m.style.display = 'block';
}

function generateStats()
{
    var el;
    var buf;
    var plBuf;
    var genData = { "count": 0, "worker": 0, "soldier": 0, "ground": 0, "orbit": 0};
    var total = { "metal": 0, "mineral": 0, "food": 0, "energy": 0};
    var income = { "metal": 0, "mineral": 0, "food": 0, "energy": 0};
    var ratio = { "metal": 0, "mineral": 0, "food": 0, "energy": 0};

    document.getElementById('btnStats').style.display = 'none';
    document.getElementById('btnLogst').style.display = 'none';

    const fmt = new Intl.NumberFormat('en-US');
    const fmtRatio = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    console.log(total);
    for (const [key, value] of Object.entries(total)) {
         el = document.querySelectorAll("div .resource."+key);
         for (var i=0; i<el.length; i++) {
             const data = el[i].querySelector("span").innerText.split(' ');
             /* Map:
              * data[0] -> current storage
              * data[1] -> current income (in brackets with a +)
              * data[1] -> abundance ratio (with %)
              */
             total[key] += parseInteger(data[0]);
             income[key] += parseInteger(data[1]);
             ratio[key] += parseInteger(data[2]);
         }
    }

    /* Calculate avergaes for ratios */
    for (const [key, value] of Object.entries(total)) {
        total[key] = fmt.format(total[key]);
        income[key] = fmt.format(income[key]);
        ratio[key] = fmtRatio.format(ratio[key]/el.length, 2);
    }

    /* Detect ground and orbit space, population and soldiers */
    plBuf = document.getElementsByClassName('locationWrapper');
    plBuf = Array.from(plBuf);
    for (i=0; i<plBuf.length; i++) {
        el = plBuf[i].getElementsByTagName('span');
        genData.count++;
        genData.orbit += parseInteger(el[1].innerText);
        genData.ground += parseInteger(el[2].innerText);
        genData.worker += parseInteger(el[4].innerText);
        genData.soldier += parseInteger(el[3].innerText);
    }

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
    buf.innerHTML += "<div class='left resource' style='width: 60%; text-align: right;'>" + fmt.format(genData.worker) + "</div>";
    buf.innerHTML += "<div class='left resource' style='width: 35%; text-align: right;'>Soldiers</div>";
    buf.innerHTML += "<div class='left resource' style='width: 60%; text-align: right;'>" + fmt.format(genData.soldier) + "</div>";
    //buf.innerHTML = "<pre>" + genData + "</pre>";

    el.innerHTML += "<div id='resTable' class='opacDarkBackground lightBorder paddingMid ofHidden' style='height: 100%;'></div>";
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

    buf = document.querySelector('div .header.pageTitle');
    buf.innerHTML = '<span>Planet Statistics</span>';
    buf.innerHTML += '<span style="float: right; padding-right: 130px; padding-top: 7px;"><button id="btnCopy" class="btn"><svg width="120px" height="25px" viewBox="0 0 120 25" class="border"><polyline points="119,0 119,24 0,24 0,0 119,0" class="bg-line" /><polyline points="119,0 119,24 1,24 0,0 119,0" class="hl-line" /></svg><span>Copy</span></button>';

    document.getElementById('btnCopy').addEventListener("click", function (e) {
        var turn = ' turn '+ turnNumber + ' ';
        buf = "```\n";
        buf += "---- General statistics ---------------------" + turn.padEnd(12, '-') + "\n";
        buf += "  Planets: " + fmt.format(genData.count).padStart(12) + "\n";
        buf += "   Ground: " + fmt.format(genData.ground).padStart(12) + "\n";
        buf += "    Orbit: " + fmt.format(genData.orbit).padStart(12) + "\n";
        buf += "  Workers: " + fmt.format(genData.worker).padStart(12) + "\n";
        buf += " Soldiers: " + fmt.format(genData.soldier).padStart(12) + "\n\n";
        buf += "---- Resources ------------------------------------------\n";
        buf += "           " + "Storage".padStart(16) + "Income".padStart(16) + "Abundance".padStart(14) + "\n";
        buf += "    Metal: " + total.metal.padStart(16) + income.metal.padStart(16) + ratio.metal.padStart(14) + "\n";
        buf += "  Mineral: " + total.mineral.padStart(16) + income.mineral.padStart(16) + ratio.mineral.padStart(14) + "\n";
        buf += "     Food: " + total.food.padStart(16) + income.food.padStart(16) + ratio.food.padStart(14) + "\n";
        buf += "   Energy: " + total.energy.padStart(16) + income.energy.padStart(16) + ratio.energy.padStart(14) + "\n";
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
    console.log(res);
    console.log(logisticsCapacity);
    /* If 1 freighter is sufficent, no need to continue */
    if (res < logisticsCapacity.freighter) {
        return "<span class='ofHidden metal'>1 <em>freighter</em></span>";
    }

    ret += "<span class='ofHidden metal'>" + fmt.format(Math.ceil(res / logisticsCapacity.freighter)) + " <em>freighter</em></span> ";
    ret += " OR <span class='ofHidden population'>" + fmt.format(Math.ceil(res / logisticsCapacity.merchant)) + " <em>merchant</em></span> ";
    /* If 1 merchent is sufficent, no need to continue */
    if (Math.ceil(res / logisticsCapacity.merchant) == 1) {
        return ret;
    }
    ret += " OR <span class='ofHidden food'>" + fmt.format(Math.ceil(res / logisticsCapacity.trader)) + " <em>trader</em></span> ";
    /* If 1 trader is sufficent, no need to continue */
    if (Math.ceil(res / logisticsCapacity.trader) == 1) {
        return ret;
    }
    /* Lastly add hulks */
    ret += " OR <span class='ofHidden energy'>" + fmt.format(Math.ceil(res / logisticsCapacity.hulk)) + " <em>hulk</em></span> ";
    return ret;
}

function updatePlanetSorting()
{
    const table = document.getElementById("planetList");
    var rows = table.querySelectorAll("div[id='planetList']");
    var rowsArray = Array.from(rows);
    const homePlanet = rowsArray.shift();
    const filterDiv = table.querySelector('div.seperator');

    for (i = 0; i<rows.length; i++) {
        console.log(rows[i]);
    }

    rowsArray.sort((a, b) => {
        const linkA = a.querySelector('div .planetName');
        const linkB = b.querySelector('div .planetName');
        const textA = linkA ? linkA.textContent : '';
        const textB = linkB ? linkB.textContent : '';
        return textA.localeCompare(textB);
    });

    table.innerHTML = '';
    const elementsToRemove = table.querySelectorAll("div[id='planetList']");

    elementsToRemove.forEach((element) => {
        element.remove();
    });
    table.appendChild(filterDiv);
    table.appendChild(homePlanet);
    rowsArray.forEach(row => table.appendChild(row));
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

function generateScreenshot()
{
    var hook = false;
    const screenshotTarget = document.getElementById('contentBox');
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

	localStorage.setItem('cfgPlanetSorting', document.getElementById('cfgPlanetSorting').checked);
    localStorage.setItem('cfgRadarSorting', document.getElementById('cfgRadarSorting').checked);
    localStorage.setItem('cfgFleetSorting', document.getElementById('cfgFleetSorting').checked);

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

	console.log('cfgPlanetSorting = ' + localStorage.getItem('cfgPlanetSorting'));
    console.log('cfgRadarSorting = ' + localStorage.getItem('cfgRadarSorting'));
    console.log('cfgFleetSorting = ' + localStorage.getItem('cfgFleetSorting'));
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
	'	 <div class="left title" style="padding-left: 4px">Setting</div>' +
	'	 <div class="title right" style="width: 20px"></div>' +
	'	 <div class="title right"></div>' +
	'  </div>' +
	'  <div class="entry opacBackground lightBorderBottom" style="padding: 4px">' +
	'	<div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;">Rulername</div>' +
	'	<div class="left" style="padding-top: 2px;">' +
	'	  <input type="text" class="input-text-cfg" id="cfgRulername" value="" />' +
	'	</div>' +
	'	<div class="left" style="line-height: 22px">Copy of your rulername (used in various messaging)</div>' +
	'	<div class="right" style="padding-top: 2px; width: 100px; text-align: right;"></div>' +
	'  </div>' +
	'  <div class="entry opacLightBackground lightBorderBottom" style="padding: 4px">' +
	'	<div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;">???</div>' +
	'	<div class="left" style="padding-top: 2px; ">' +
	'	  <input type="text" class="input-text-cfg" id="TODO" value="" />' +
	'	</div>' +
	'	<div class="left" style="line-height: 22px">????</div>' +
	'	<div class="right" style="padding-top: 2px; width: 100px; text-align: right;"></div>' +
	'  </div>' +
	'  <div class="entry opacBackground lightBorderBottom" style="padding: 4px">' +
	'	<div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;">NAP list</div>' +
	'	<div class="left" style="padding-top: 2px;">' +
	'	  <input type="text" class="input-text-cfg" id="cfgAllyNAP" value="" />' +
	'	</div>' +
	'	<div class="left" style="line-height: 22px">Which alliances should be classified and color coded as NAP</div>' +
	'	<div class="right" style="padding-top: 2px; width: 100px; text-align: right;">' +
	'	  <input type="color" class="input-text-cfg-color" id="cfgAllyNAPcolor" value="#ff8080" />' +
	'	</div>' +
	'  </div>' +
	'  <div class="entry opacLightBackground lightBorderBottom" style="padding: 4px">' +
	'	<div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;">CAP list</div>' +
	'	<div class="left" style="padding-top: 2px; ">' +
	'	  <input type="text" class="input-text-cfg" id="cfgAllyCAP" value="" />' +
	'	</div>' +
	'	<div class="left" style="line-height: 22px">Which alliances should be classified and color coded as CAP</div>' +
	'	<div class="right" style="padding-top: 2px; width: 100px; text-align: right;">' +
	'	  <input type="color" class="input-text-cfg-color" id="cfgAllyCAPcolor" value="#f6b73c" />' +
	'	</div>' +
	'  </div>' +
	'  <div class="entry opacBackground lightBorderBottom" style="padding: 4px">' +
	'	<div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;"><input type="checkbox" id="cfgPlanetSorting" name="cfgPlanetSorting" value=""/> <label for="cfgPlanetSorting">Fix planet sorting</label></div>' +
  	'	<div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;"><input type="checkbox" id="cfgRadarSorting" name="cfgRadarSorting" value="" /> <label for="cfgRadarSorting">Fix radar sorting</label></div>' +
    '	<div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;"><input type="checkbox" id="cfgFleetSorting" name="cfgFleetSorting" value="" /> <label for="cfgFleetSorting">Fix fleet sorting</label></div>' +
    '  </div>' +
	'  <div class="entry opacLightBackground lightBorderBottom" style="padding: 4px">' +
	'	<div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;">Discord sharing</div>' +
	'	<div class="left" style="padding-top: 2px; ">' +
	'	  <input type="text" class="input-text-cfg" id="cfgDiscordTokenA" value="" />' +
	'	</div>' +
	'	<div class="left" style="line-height: 22px">Place discord token in order to enable sharing of screenshots</div>' +
	'	<div class="right" style="padding-top: 2px; width: 100px; text-align: right;">' +
	'	</div>' +
	'  </div>' +
        '  <div class="right entry  opacLightBackground coordsInput" style="border-left: 1px solid #545454; padding: 4px"> ' +
	'    <div class="right" style="line-height: 22px; padding-left: 6px"> ' +
    '      <input type="button" name="cfgSave" id="cfgHelp" value="Help" /> ' +
	'      <input type="button" name="cfgSave" id="cfgDump" value="Dump" /> ' +
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
	document.getElementById('cfgPlanetSorting').checked = parseBool(localStorage.getItem('cfgPlanetSorting'));

	/* Buttons */
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
	let	day = '' + d.getDate();
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
	if (val=='true') {
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
    var e = document.getElementById("playerBox").querySelector('.left.border');
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
	localStorage.setItem('cfgPlanetSorting', 'true');
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