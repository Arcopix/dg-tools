// ==UserScript==
// @name	   DG utilities Git v0.4
// @namespace  devhex
// @version    0.4.xxxx
// @description  various minor improvements of DG interface
// @match      https://beta.darkgalaxy.com/
// @match      https://beta.darkgalaxy.com/*
// @copyright  2020, Stefan Lekov / Arcopix / Devhex Ltd
// @homepage   https://github.com/Arcopix/dg-tools
// ==/UserScript==

/* Config start */
var nap_ally = [ "[ALLY1]", "[ALLY2]" ]; // Which alliances you want to be color coded as NAP. Note the brackets.
var custom_style = "COLOR: #FFE66F;"; // Color specified for NAP
/* Config end */

/* Common counters & pointers */
var i, j, k, l, m, n, p;

/* Development warning */
m = localStorage.getItem('develWarning');
if (m!==getDate()) {
	window.alert("WARNING, you are using development version of DG utilities.\n		 Use it at your own risk");
	window.alert("This message will be displayed on once a day");
	localStorage.setItem('develWarning', getDate());
}

/* === START OF GENERIC FUNCTIONS === */

/* function to decode URI params */
function getQueryParams(qs) {
	qs = qs.split('+').join(' ');
	var params = {},
		tokens,
		re = /[?&]?([^=]+)=([^&]*)/g;

	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	}
	return params;
}

/* Formatting numbers */
function formatNumber(num)
{
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

/* common function in css to change css style */
function addGlobalStyle(css) {
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

/* === END OF GENERIC FUNCTIONS === */

/* Check if globacl configuration is set and if not - initiate defaults */
if (localStorage.getItem('cfgRulername')=='') {
	/* FIXME */
	localStorage.setItem('cfgRulername', 'FIXME');
	localStorage.setItem('cfgAllyNAP', 'ALLY1, ALLY2');
	localStorage.setItem('cfgAllyNAPcolor', '#FFE66F');
	localStorage.setItem('cfgAllyCAP', 'ALLY3, ALLY4');
	localStorage.setItem('cfgAllyCAPcolor', '#6FFFA2');
	
	localStorage.setItem('cfgPopulationTotals', 'true');
	localStorage.setItem('cfgRadarSorting', 'true');
	localStorage.setItem('cfgPlanetSorting', 'true');	
	alert('Initializing config');
}

/* Global configuration */
var cfgRulername = localStorage.getItem('cfgRulername');
var cfgAllyNAP = localStorage.getItem('cfgAllyNAP');
var cfgAllyNAPcolor = localStorage.getItem('cfgAllyNAPcolor');
var cfgAllyCAP = localStorage.getItem('cfgAllyCAP');
var cfgAllyCAPcolor = localStorage.getItem('cfgAllyCAPcolor');
var cfgPopulationTotals = parseBool(localStorage.getItem('cfgPopulationTotals'));
var cfgRadarSorting = parseBool(localStorage.getItem('cfgRadarSorting'));
var cfgPlanetSorting = parseBool(localStorage.getItem('cfgPlanetSorting'));


/* Updated main menu items */
var confIcon = document.createElement('div');
confIcon.className = 'left relative';
confIcon.style = 'cursor:pointer;';
confIcon.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AYCCxcxPEClUgAAA3ZJREFUOMuVlE1sVGUUhp87987CUlqJpdG2AVJIFzKhTfAn1pgYJMZYNC6wdYw2LtQFKgZtqZLSDkhLf6damUIUNxaLxA3ponHhT1ITpTGFhChKJe0CgoJoqLU/4/Se18XMHaYpmPglN9+5X+557jnfec9xuMU6GE9EDcZSKX8y1rQTgK7320guFJRLVLfsfu3YzfxCgdHZ+REA7fGBmvZ4YkYwhDgX9tztwTfJhYLtEuckDcY635tp7Xi3BiAW68sCnVx6e3zgFdAhACl9powhCSmzo8y7kPT6O3ve6F8WYXvfYUCT/xOGxMSejvjylDeU3gFiNhcmCZMoXJlPYUE+JsP3LReGSXO/lJdlgV5g1NbW0tab2JYbWdXGCtavLcN13fTjuVyYusjoqfEAhqRtn9XWjmYj7OhLANDWm9gENAawrQ/dS/maEq7NLvLJ91c5NvYb1/5OcXdFOfW1TwYwJDU27evaBNDQ0oHT1pt4DIgC9UEqVRsrKF9TwvAP0zQPT5EXdsCMhWSK3miE6IPr+HFikpEvv8EBzITJPjaz4yHgSAADELB+bRl/zBl7h6dYEQ7hSIQwVoShcXCc32f+YXNlBKQAhpnqTTocAkpzq1m4Mh/Xdfni/DS3hR2Q4cjHMZ+Q+eSFHT4/cwnXdSleXRTAgr3UU4YWVA2E67qEnHSaDpaFOfLBFgkBnuumVXADhkyEgIlcnf15/S9cz6WmspiFZGoJzDGf+fkFnqregOd5XLp8ZQnMZBOh5oZXIyZbJelrkf7jhamLlKzKo+/ZCPPzSWQ+8heZnZtnYMcWSosKGTt9FpMfwL7y8W8f6IpFQplKXG9t2rlF0nnHgdFT48zNJ6mrXseZ7ifY+3QVLXX38NMHL/Dc1ggzs3OcODkCOMj086HOlkcc3Oklvdza0Y/kRyUNBaJ99OFqNldGcF0Xz3XxPI+x02c5cXIE3yyTpqJeOPVpf9uB5cOhuT3+AOLbQLS+GUgUry5CUubO/CCy4P6qj/Ts+25Z62V0c7/pRh87gAl+vXIVM4Ej0BIYJt0H3Bxo4s7cSZKRxGUzjmcAUZlKcmBIdlcuI5tyQ3c3PY2NvLW/+3FJQ2YqNNnR3v1vv5TrsGN37EMzvWjSjMmeORo/MPJ8QwODPT3853qz5WBdehrHsme7dqXn3ssNrXW38vsX7dp271V7DXsAAAAASUVORK5CYII="/>';

confIcon.addEventListener('click', function() { showPluginConfiguration() }, false);

/* Updating main menu */
var mainMenu = document.querySelector('div.icons');
p = mainMenu.getElementsByTagName('a')[2];
mainMenu.removeChild(p);
mainMenu.appendChild(confIcon);
mainMenu.appendChild(p);

/* get the turnNumber */
var turnNumber = document.getElementById('turnNumber').innerText;

/* Colorize the alliance tag / playname if it matches a tag nap_ally */
var elems = document.getElementsByTagName("div");
var deb=0;
var player="";
for (i=0; i<elems.length; i++) {
	var e = elems[i];
	if (e.className=="allianceName"&&nap_ally.includes(e.innerText.trim())) {
		e.style = custom_style;
		p = e.parentElement;
		for (j=0; j<p.children.length; j++) {
			if (p.children[j].className=="playerName") {
				p.style = custom_style;
			}
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
		window.location.href = "https://beta.darkgalaxy.com/mail/?to=" + this.innerText.trim();
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

/* Navigate through fleets using ARROW keys */
if (location.href.includes('/fleet/')&&document.querySelector('.nextPrevFleet, .left')) {
	/* If we have only RIGHT fleet, meaning we are only at first one, activate RIGHT ARROWO ONLY */
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

/* No longer showing "FREE" population, show total population,
  Original concept by Mordread
  Refactored by Arcopix
*/
var line;
var availablePopulation, occupiedPopulation;
var planets;
if (cfgPopulationTotals && location.href.includes('/planet/')) {
	line = document.getElementsByClassName('resource')[3];
	availablePopulation = line.getElementsByTagName('span')[0].innerText.split(' / ')[0];
	occupiedPopulation = line.getElementsByTagName('span')[2].innerText.replace('(', '').replace(' occupied)', '')

	availablePopulation = parseInt(availablePopulation.replace(',', ''));
	occupiedPopulation = parseInt(occupiedPopulation.replace(',', ''));
	line.getElementsByTagName('span')[0].innerText = formatNumber(availablePopulation+occupiedPopulation) + ' / ' + line.getElementsByTagName('span')[0].innerText.split(' / ')[1]
}

if (cfgPopulationTotals && window.location.pathname=="/planets/") {
	planets = document.getElementsByClassName('locationWrapper');
	for (i=0; i<planets.length; i++) {
		line = planets[i].getElementsByClassName('resource')[3];

		availablePopulation = line.getElementsByTagName('span')[0].innerText.split(' / ')[0];
		occupiedPopulation = line.getElementsByTagName('span')[1].innerText.replace('(', '').replace(' occupied)', '');

		availablePopulation = parseInt(availablePopulation.replace(',', ''));
		occupiedPopulation = parseInt(occupiedPopulation.replace(',', ''));

		line.getElementsByTagName('span')[0].innerText = formatNumber(availablePopulation+occupiedPopulation);
	}
}

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
	if (typeof c !== 'undefined' && typeof c.innerText !== 'undefined' && c.innerText=='0.0.0') {
		continue;
	}

	if (c && c.innerText.match(/^[0-9]+\.[0-9]+\.[0-9]+$/g)) {
		let p = c.innerText.split('.');
		c.innerHTML = '<a href="/navigation/' + p[0] + '/' + p[1] + '/">' + c.innerHTML + '</a>';
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
		if (e.which == 8 && this.value=='') {
			e.preventDefault();
			document.querySelector('input[name="coordinate.1"]').focus();
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

/* End of script */

/* === START OF GENERIC FUNCTIONS === */

function savePluginConfiguration()
{
	localStorage.setItem('cfgRulername', document.getElementById('cfgRulername').value);
	localStorage.setItem('cfgAllyNAP', document.getElementById('cfgAllyNAP').value);
	localStorage.setItem('cfgAllyNAPcolor', document.getElementById('cfgAllyNAPcolor').value);
	localStorage.setItem('cfgAllyCAP', document.getElementById('cfgAllyCAP').value);
	localStorage.setItem('cfgAllyCAPcolor', document.getElementById('cfgAllyCAPcolor').value);
	localStorage.setItem('cfgAllyCAP', document.getElementById('cfgAllyCAP').value);
	
	localStorage.setItem('cfgPopulationTotals', document.getElementById('cfgPopulationTotals').checked);
	localStorage.setItem('cfgRadarSorting', document.getElementById('cfgRadarSorting').checked);
	localStorage.setItem('cfgPlanetSorting', document.getElementById('cfgPlanetSorting').checked);

	alert("Settings saved successfully");
}

function dumpPluginConfiguration()
{
	alert('cfgRulername = ' + localStorage.getItem('cfgRulername'));
	alert('cfgAllyNAP = ' + localStorage.getItem('cfgAllyNAP'));
	alert('cfgAllyNAPcolor = ' + localStorage.getItem('cfgAllyNAPcolor'));
	alert('cfgAllyCAP = ' + localStorage.getItem('cfgAllyCAP'));
	alert('cfgAllyCAPcolor = ' + localStorage.getItem('cfgAllyCAPcolor'));
	alert('cfgAllyCAP = ' + localStorage.getItem('cfgAllyCAP'));
	alert('cfgPopulationTotals = ' + localStorage.getItem('cfgPopulationTotals'));
	alert('cfgRadarSorting = ' + localStorage.getItem('cfgRadarSorting'));
	alert('cfgPlanetSorting = ' + localStorage.getItem('cfgPlanetSorting'));
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
	'	<div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;"><input type="checkbox" id="cfgPopulationTotals" name="cfgPopulationTotals" value="" /> <label for="cfgPopulationTotals">Display total population</label></div>' +
	'	<div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;"><input type="checkbox" id="cfgRadarSorting" name="cfgRadarSorting" value="" /> <label for="cfgRadarSorting">Fix radar sorting</label></div>' +
	'	<div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;"><input type="checkbox" id="cfgPlanetSorting" name="" value="" /> <label for="cfgPlanetSorting">Fix planet sorting</label></div>' +
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
	
	/* Boolean setting */
	document.getElementById('cfgPopulationTotals').checked = parseBool(localStorage.getItem('cfgPopulationTotals'));
	document.getElementById('cfgRadarSorting').checked = parseBool(localStorage.getItem('cfgRadarSorting'))
	document.getElementById('cfgPlanetSorting').checked = parseBool(localStorage.getItem('cfgPlanetSorting'));
	
	/* Buttons */
	document.getElementById('cfgDump').addEventListener('click', function() { dumpPluginConfiguration(); }, false);
	document.getElementById('cfgSave').addEventListener('click', function() { savePluginConfiguration(); }, false);
}

/* === END OF GENERIC FUNCTIONS === */

