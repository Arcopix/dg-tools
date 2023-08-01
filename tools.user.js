// ==UserScript==
// @name	     DG utilities v0.4
// @namespace    devhex
// @version      0.4.0004
// @description  various minor improvements of DG interface
// @match        https://*.darkgalaxy.com
// @match        https://*.darkgalaxy.com/*
// @require      https://html2canvas.hertzen.com/dist/html2canvas.min.js
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

/* Development warning */
m = localStorage.getItem('develWarning');
if (0 && m!==getDate()) {
	window.alert("WARNING, you are using development version of DG utilities.\n" +
					"Use it at your own risk\n" +
					"\n" +
					"This message will be displayed on once a day");

	localStorage.setItem('develWarning', getDate());
}

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
var cfgRadarSorting = parseBool(localStorage.getItem('cfgRadarSorting'));
var cfgFleetSorting = parseBool(localStorage.getItem('cfgFleetSorting'));
var cfgPlanetSorting = parseBool(localStorage.getItem('cfgPlanetSorting'));

/* Updated main menu items */
var confIcon = document.createElement('div');
confIcon.className = 'left relative';
confIcon.style = 'cursor:pointer;';
confIcon.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AYCCxcxPEClUgAAA3ZJREFUOMuVlE1sVGUUhp87987CUlqJpdG2AVJIFzKhTfAn1pgYJMZYNC6wdYw2LtQFKgZtqZLSDkhLf6damUIUNxaLxA3ponHhT1ITpTGFhChKJe0CgoJoqLU/4/Se18XMHaYpmPglN9+5X+557jnfec9xuMU6GE9EDcZSKX8y1rQTgK7320guFJRLVLfsfu3YzfxCgdHZ+REA7fGBmvZ4YkYwhDgX9tztwTfJhYLtEuckDcY635tp7Xi3BiAW68sCnVx6e3zgFdAhACl9powhCSmzo8y7kPT6O3ve6F8WYXvfYUCT/xOGxMSejvjylDeU3gFiNhcmCZMoXJlPYUE+JsP3LReGSXO/lJdlgV5g1NbW0tab2JYbWdXGCtavLcN13fTjuVyYusjoqfEAhqRtn9XWjmYj7OhLANDWm9gENAawrQ/dS/maEq7NLvLJ91c5NvYb1/5OcXdFOfW1TwYwJDU27evaBNDQ0oHT1pt4DIgC9UEqVRsrKF9TwvAP0zQPT5EXdsCMhWSK3miE6IPr+HFikpEvv8EBzITJPjaz4yHgSAADELB+bRl/zBl7h6dYEQ7hSIQwVoShcXCc32f+YXNlBKQAhpnqTTocAkpzq1m4Mh/Xdfni/DS3hR2Q4cjHMZ+Q+eSFHT4/cwnXdSleXRTAgr3UU4YWVA2E67qEnHSaDpaFOfLBFgkBnuumVXADhkyEgIlcnf15/S9cz6WmspiFZGoJzDGf+fkFnqregOd5XLp8ZQnMZBOh5oZXIyZbJelrkf7jhamLlKzKo+/ZCPPzSWQ+8heZnZtnYMcWSosKGTt9FpMfwL7y8W8f6IpFQplKXG9t2rlF0nnHgdFT48zNJ6mrXseZ7ifY+3QVLXX38NMHL/Dc1ggzs3OcODkCOMj086HOlkcc3Oklvdza0Y/kRyUNBaJ99OFqNldGcF0Xz3XxPI+x02c5cXIE3yyTpqJeOPVpf9uB5cOhuT3+AOLbQLS+GUgUry5CUubO/CCy4P6qj/Ts+25Z62V0c7/pRh87gAl+vXIVM4Ej0BIYJt0H3Bxo4s7cSZKRxGUzjmcAUZlKcmBIdlcuI5tyQ3c3PY2NvLW/+3FJQ2YqNNnR3v1vv5TrsGN37EMzvWjSjMmeORo/MPJ8QwODPT3853qz5WBdehrHsme7dqXn3ssNrXW38vsX7dp271V7DXsAAAAASUVORK5CYII="/>';

confIcon.addEventListener('click', function() { showPluginConfiguration() }, false);

/* Updated main menu items */
var screenshotIcon = document.createElement('div');
screenshotIcon.className = 'left relative';
screenshotIcon.style = 'cursor:pointer;';
screenshotIcon.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSKVKnYQcQhYnSyIijhKFYtgobQVWnUwufRDaNKQpLg4Cq4FBz8Wqw4uzro6uAqC4AeIq4uToouU+L+k0CLGg+N+vLv3uHsHCPUyU82OcUDVLCMVj4nZ3IoYeEUAIfShF8MSM/VEeiEDz/F1Dx9f76I8y/vcn6NHyZsM8InEs0w3LOJ14ulNS+e8TxxmJUkhPiceM+iCxI9cl11+41x0WOCZYSOTmiMOE4vFNpbbmJUMlXiKOKKoGuULWZcVzluc1XKVNe/JXxjMa8tprtMcQhyLSCAJETKq2EAZFqK0aqSYSNF+zMM/6PiT5JLJtQFGjnlUoEJy/OB/8LtbszA54SYFY0Dni21/jACBXaBRs+3vY9tunAD+Z+BKa/krdWDmk/RaS4scAaFt4OK6pcl7wOUOMPCkS4bkSH6aQqEAvJ/RN+WA/luge9XtrbmP0wcgQ10t3QAHh8BokbLXPN7d1d7bv2ea/f0Acq1yp87JZPIAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfnBw8RFRwThj7AAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAmtJREFUOMutlN9Lk2EUxz/PXDAnsjbfV2GltoWg0yZUUIHdqRWV3aXiXyCBSUVBXUe/xDuTiOhKtIuaWxnhmhfOrmJBjtp00zl/XIRgyW62vXNvF+ZqzjULv3fPc77ne7485zxHLC6tqOwhtIUI6XQ666zRaP5PMBaL8WJkiCmvl42NDQCKiopoajpNe2cXpaWlO+Zlyvl8H3n+7Cnr6z8AcDkdeN67SSTipFIKqZRCIhHH43HjcjoKOwwGAoyPv6NMkimTJKa8k3mTPngnsVisqKqKEAKz2YzFchgVFbG4tKLOz81x5/bN3GrafZy/cBGLxQpAJDLP2BsXqVQqh3v33n2s1ppNh5FIJIdgs9XTfaUHSZIydydOnqK5pZXBxwN8/eLP4kfmo1itNZtvmE5nT47RaKKn9zqSJKEoScKhEOFQCEVRkCSZnqu9GE2mbdOg5u9ye0cXBoOBWCxGf98DgsEAALW1dVy7cQuDYT+X2zt5MjiQv8t/os5mA2DC486IAQSDASY87l+c+r+PzRZUNU2JXg+A3z+dk+Cf/gxAiV6Pqqq7cCgEyWQSgKqq6pxwVfUhAJJJBSFEYUGBYCG6AEBzSys6XXEmptMV09zSCkA0Gtn91xt1vKSh4Qhm8wEe9vXzyecDVI4eO44sl6MoCqOOV7sXnJ0JMjI8REdnF7Jczpmz5zIxRVEYGR5idiaYX1CrzdV9O/aacDhMW9slDlZWArC8vITL6WR2JrDDr9L+FrQ32pHlClZXv21zGqDvUaDgDpTLK7A32jd7sLVg4/E439fWUPm3fSuEwGg0odPpsgX3Chr2GD8BJfXkHge7nl4AAAAASUVORK5CYII="/>';

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
        p.innerHTML = p.innerHTML + '<img id='+q+' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxMAAAsTAQCanBgAAAIASURBVDhPrVI9T1NhFD7n3pYQsAVhs3wUSHAQEogLE5OrSGIg8gOQ9LZOLE7+AxbS3kIMEwuw2Ogv0MnBxMbo0IRIgTICpjeQkN77Hs85vBSucdNnuPd8v+fjgX8F2n8Mo34wYYDmWXx4bYFaCK1Kw+v/bvU2YgUG1n71JTudMosLBHDC/6o6AKY4MMPRexGY3JHXe27ttwUkOdHpfEKgPmMwf1hIVQCR6zCIMFtuPkXCDTacGjSzN0UcDWDIy5KMrWjm8FX6XTtZwHLd63mPicQMv9jvgnap0A5kZiL6Zgw812TGWOl0MITkYwcxQwQDCLh/kL+3lfUv5hCiSmhw8riQ+qEdyMJkZm3b4qrDvWDnGxaLiPAaKBoXez3X9UFiE64u2Y5gdNvVu203lnvPDMFbqwK4zrH+JYawanNud/Anhv3ghePgOpEp8RK/GkMN64plXYsO1Pg7JdsWVZMBtvmp9Xq+p9DqME+SSfeL+DSGOJa5IaoWEJLIneVUovPMk5rspVdFl3H2X3ZrB9lSMIdEmZBQ99XmwYjf3OHKs3KqnytdR9Ycw+jm5RCF4WcWPx7k00tia08TQSonJJEAOdXNOAohUrH5THwSE6HxrCdO5SGf7iMEZa66KKfSbStomsd6wHzYZRZ6f6XyXQwWg0d6Z3sqRk1mFuJY/X8B4Ddult5tzWNgCQAAAABJRU5ErkJggg=="/>';
        m = document.getElementById(q);
        m.setAttribute('coordinate', n);
        m.className = 'jumpTo';
        m.addEventListener("click", showJumpMenu, false);
    }

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

/* No longer showing "FREE" population, show total population,
  Original concept by Mordread
  Refactored by Arcopix
*/

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
    buf.innerHTML += '<span style="float: right; padding-right: 130px; padding-top: 7px;"><button id="btnMerch" class="btn"><svg width="120px" height="25px" viewBox="0 0 120 25" class="border"><polyline points="119,0 119,24 0,24 0,0 119,0" class="bg-line" /><polyline points="119,0 119,24 1,24 0,0 119,0" class="hl-line" /></svg><span>Merchant</span></button>';

    document.getElementById('btnStats').addEventListener("click", generateStats, false);
    document.getElementById('btnMerch').addEventListener("click", generateMerch, false);
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
    document.getElementById('btnMerch').style.display = 'none';

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
        buf = "```\n";
        buf += "---- General statistics ---------------------------------\n";
        buf += " Planets: " + fmt.format(genData.count).padStart(12) + "\n";
        buf += "  Ground: " + fmt.format(genData.ground).padStart(12) + "\n";
        buf += "   Orbit: " + fmt.format(genData.orbit).padStart(12) + "\n";
        buf += " Workers: " + fmt.format(genData.worker).padStart(12) + "\n";
        buf += "Soldiers: " + fmt.format(genData.soldier).padStart(12) + "\n\n";
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

function generateMerch()
{
    window.alert("Not implemented yet!");
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
    const screenshotTarget = document.getElementById('contentBox');
    const hook = localStorage.getItem('cfgDiscordTokenA');
    const coord = screenshotTarget.getBoundingClientRect()

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
	document.getElementById('cfgDump').addEventListener('click', function() { dumpPluginConfiguration(); }, false);
	document.getElementById('cfgSave').addEventListener('click', function() { savePluginConfiguration(); }, false);
}

/* === END OF FEATURE FUNCTIONS === */
