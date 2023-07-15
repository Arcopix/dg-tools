// ==UserScript==
// @name	   DG utilities Git v0.4
// @namespace  devhex
// @version    0.4.xxxx
// @description  various minor improvements of DG interface
// @match      https://beta.darkgalaxy.com/
// @match      https://beta.darkgalaxy.com/*
// @match      https://speedgame.darkgalaxy.com
// @match      https://speedgame.darkgalaxy.com/*
// @match      https://andromeda.darkgalaxy.com
// @match      https://andromeda.darkgalaxy.com/*
// @require    https://html2canvas.hertzen.com/dist/html2canvas.min.js
// @copyright  2020-2023, Stefan Lekov / Arcopix / Devhex Ltd
// @homepage   https://github.com/Arcopix/dg-tools
// ==/UserScript==

/* Common counters & pointers */
var i, j, k, l, m, n, p;

/* Development warning */
m = localStorage.getItem('develWarning');
if (m!==getDate()) {
	window.alert("WARNING, you are using development version of DG utilities.\n" +
					"Use it at your own risk\n" +
					"\n" +
					"This message will be displayed on once a day");

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

function initializeConfig()
{
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

	localStorage.setItem('cfgPopulationTotals', 'true');
	localStorage.setItem('cfgRadarSorting', 'true');
	localStorage.setItem('cfgPlanetSorting', 'true');
	window.alert('Initializing config');
}

/* === END OF GENERIC FUNCTIONS === */

/* Check if global configuration is set and if not - initiate defaults */
if (localStorage.getItem('cfgRulername')=='') {
    initializeConfig();
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

/* Updated main menu items */
var testIcon = document.createElement('div');
testIcon.className = 'left relative';
testIcon.style = 'cursor:pointer;';
testIcon.innerHTML = '<img src="data:image/png;base64,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"/>';

testIcon.addEventListener('click', function() { ax1() }, false);


/* Updating main menu */
var mainMenu = document.querySelector('div.icons');
p = mainMenu.getElementsByTagName('a')[2];
mainMenu.removeChild(p);
mainMenu.appendChild(confIcon);
mainMenu.appendChild(testIcon);
mainMenu.appendChild(p);

/* get the turnNumber */
var turnNumber = document.getElementById('turnNumber').innerText;

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
			e.style = 'color: ' + cfgAllyNAPcolor;
			p = e.parentElement;
			for (j=0; j<p.children.length; j++) {
				if (p.children[j].className=="playerName") {
					p.style = 'color: ' + cfgAllyNAPcolor;
				}
			}
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
			e.style = 'color: ' + cfgAllyCAPcolor;
			p = e.parentElement;
			for (j=0; j<p.children.length; j++) {
				if (p.children[j].className=="playerName") {
					p.style = 'color: ' + cfgAllyCAPcolor;
				}
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

/* No longer showing "FREE" population, show total population,
  Original concept by Mordread
  Refactored by Arcopix
*/
var line;
var availablePopulation, occupiedPopulation;
var planets;
/* No longer needed */
if (0 && cfgPopulationTotals && location.href.includes('/planet/')) {
	line = document.getElementsByClassName('resource')[3];
	availablePopulation = line.getElementsByTagName('span')[0].innerText.split(' / ')[0];
	occupiedPopulation = line.getElementsByTagName('span')[2].innerText.replace('(', '').replace(' occupied)', '')
	availablePopulation = parseInt(availablePopulation.split(',').join(''));
	occupiedPopulation = parseInt(occupiedPopulation.split(',').join(''));
	line.getElementsByTagName('span')[0].innerText = formatNumber(availablePopulation+occupiedPopulation) + ' / ' + line.getElementsByTagName('span')[0].innerText.split(' / ')[1]
}

/* No longer needed */
if (0 && cfgPopulationTotals && window.location.pathname=="/planets/") {
	planets = document.getElementsByClassName('locationWrapper');
	for (i=0; i<planets.length; i++) {
		line = planets[i].getElementsByClassName('resource')[3];

		availablePopulation = line.getElementsByTagName('span')[0].innerText.split(' / ')[0];
		occupiedPopulation = line.getElementsByTagName('span')[1].innerText.replace('(', '').replace(' occupied)', '');

		availablePopulation = parseInt(availablePopulation.split(',').join(''));
		occupiedPopulation = parseInt(occupiedPopulation.split(',').join(''));

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
	if (typeof c !== 'undefined' && typeof c.innerText !== 'undefined' && c.innerText=='0.0.0.0') {
		continue;
	}

	if (c && c.innerText.match(/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/g)) {
		let p = c.innerText.split('.');
		c.innerHTML = '<a href="/navigation/' + p[0] + '/' + p[1] + '/' + p[2] + '/">' + c.innerHTML + '</a>';
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
function sendBase64ImageToDiscord(webhookUrl, base64Image) {
  try {
    // Strip data:image/png;base64,
    base64Image = base64Image.substr(base64Image.indexOf(',') + 1);
    // Convert base64 image to binary
    // webhookUrl = "http://dome.devhex.net";
    const binaryImage = atob(base64Image);
    const imageLength = binaryImage.length;
    const uint8Array = new Uint8Array(imageLength);
    for (let i = 0; i < imageLength; i++) {
      uint8Array[i] = binaryImage.charCodeAt(i);
    }

    // Create form data payload
    const form = new FormData();
    const file = new Blob([uint8Array], { type: 'image/png' });
    //form.append("message", "test 1 2 3\nfoo bar");
    form.append("content", "test 1 2 3");
    form.append("tts", "false");
    form.append('file', file, '/usr/share/screenshot.png');

    // Create XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    xhr.open('POST', webhookUrl);

    // Set up the request headers
    const headers = {
//      'Content-Type': 'multipart/form-data',
      'Accept': '*/*'
    };
    for (const header in headers) {
      xhr.setRequestHeader(header, headers[header]);
    }
      // Display the values
for (const value of form.values()) {
  console.log(value);
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

function ax1()
{
    const screenshotTarget = document.getElementById('contentBox');
    const hook = "TODO";
// Content-Disposition: form-data; name="content"

    html2canvas(screenshotTarget).then((canvas) => {
        const base64image = canvas.toDataURL("image/png");
        const request = new XMLHttpRequest();

        sendBase64ImageToDiscord(hook, base64image);
        return;
        var formData = {
            content: "test er",
            file: {
                value: base64image,
                options: {
                    filename: 'screenshot.png',
                    contentType: 'image/png'
                }
            }
        }

        request.open("POST", hook);
        request.setRequestHeader('Content-type', 'application/json');
        request.send(JSON.stringify(formData));
        return;

        window.alert(base64image);

        request.open("POST", hook);
        request.setRequestHeader('Content-type', 'application/json');
        //request.setRequestHeader('Content-Type', 'multipart/form-data');

        formData = new FormData();

        formData.append("file1", base64image);
        formData.append("content", "File Submited");

        const params = {
            username: localStorage.getItem('cfgRulername'),
            content: "test hell",
            embeds: [
                {
                    image: {
                        url: base64image
                    }
                }
            ]
        }/*,
            attachments: [{
                id: 0,
                description: "Image of a cute little cat",
                filename: "myfilename.png"
            }]
        }*/
        //var data = "";
        //data = data + "--boundary\nContent-Disposition: form-data; name=\"payload_json\"\nContent-Type: application/json\n\n" + JSON.stringify(params) + "\n\n";
        //data = data + "--boundary\nContent-Disposition: form-data; name=\"files[0]\"; filename=\"myfilename.png\"\nContent-Type: image/png\n\n" + base64image + "\n\n--boundary--";

        //request.send(data);
        request.send(JSON.stringify(params));
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

	localStorage.setItem('cfgPopulationTotals', document.getElementById('cfgPopulationTotals').checked);
	localStorage.setItem('cfgRadarSorting', document.getElementById('cfgRadarSorting').checked);
	localStorage.setItem('cfgPlanetSorting', document.getElementById('cfgPlanetSorting').checked);

	window.alert("Settings saved successfully");
}

function dumpPluginConfiguration()
{
    window.alert('Data dumping in console');
	console.log('cfgRulername = ' + localStorage.getItem('cfgRulername'));
	console.log('cfgAllyNAP = ' + localStorage.getItem('cfgAllyNAP'));
	console.log('cfgAllyNAPcolor = ' + localStorage.getItem('cfgAllyNAPcolor'));
	console.log('cfgAllyCAP = ' + localStorage.getItem('cfgAllyCAP'));
	console.log('cfgAllyCAPcolor = ' + localStorage.getItem('cfgAllyCAPcolor'));
	console.log('cfgAllyCAP = ' + localStorage.getItem('cfgAllyCAP'));
	console.log('cfgPopulationTotals = ' + localStorage.getItem('cfgPopulationTotals'));
	console.log('cfgRadarSorting = ' + localStorage.getItem('cfgRadarSorting'));
	console.log('cfgPlanetSorting = ' + localStorage.getItem('cfgPlanetSorting'));
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
	'	<div class="left name" style="line-height: 22px; padding-right: 20px; text-align: right;"><input type="checkbox" id="cfgPlanetSorting" name="" value="" onchange="alert(\'Not implemented yet\')"/> <label for="cfgPlanetSorting">Fix planet sorting</label></div>' +
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
