// ==UserScript==
// @name       DG utilities Git v0.4
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
/* === END OF GENERIC FUNCTIONS === */

/* Updated main menu items */
var confIcon = document.createElement('div');
confIcon.className = 'left relative';
confIcon.style = 'cursor:pointer;';
confIcon.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AYCCxcxPEClUgAAA3ZJREFUOMuVlE1sVGUUhp87987CUlqJpdG2AVJIFzKhTfAn1pgYJMZYNC6wdYw2LtQFKgZtqZLSDkhLf6damUIUNxaLxA3ponHhT1ITpTGFhChKJe0CgoJoqLU/4/Se18XMHaYpmPglN9+5X+557jnfec9xuMU6GE9EDcZSKX8y1rQTgK7320guFJRLVLfsfu3YzfxCgdHZ+REA7fGBmvZ4YkYwhDgX9tztwTfJhYLtEuckDcY635tp7Xi3BiAW68sCnVx6e3zgFdAhACl9powhCSmzo8y7kPT6O3ve6F8WYXvfYUCT/xOGxMSejvjylDeU3gFiNhcmCZMoXJlPYUE+JsP3LReGSXO/lJdlgV5g1NbW0tab2JYbWdXGCtavLcN13fTjuVyYusjoqfEAhqRtn9XWjmYj7OhLANDWm9gENAawrQ/dS/maEq7NLvLJ91c5NvYb1/5OcXdFOfW1TwYwJDU27evaBNDQ0oHT1pt4DIgC9UEqVRsrKF9TwvAP0zQPT5EXdsCMhWSK3miE6IPr+HFikpEvv8EBzITJPjaz4yHgSAADELB+bRl/zBl7h6dYEQ7hSIQwVoShcXCc32f+YXNlBKQAhpnqTTocAkpzq1m4Mh/Xdfni/DS3hR2Q4cjHMZ+Q+eSFHT4/cwnXdSleXRTAgr3UU4YWVA2E67qEnHSaDpaFOfLBFgkBnuumVXADhkyEgIlcnf15/S9cz6WmspiFZGoJzDGf+fkFnqregOd5XLp8ZQnMZBOh5oZXIyZbJelrkf7jhamLlKzKo+/ZCPPzSWQ+8heZnZtnYMcWSosKGTt9FpMfwL7y8W8f6IpFQplKXG9t2rlF0nnHgdFT48zNJ6mrXseZ7ifY+3QVLXX38NMHL/Dc1ggzs3OcODkCOMj086HOlkcc3Oklvdza0Y/kRyUNBaJ99OFqNldGcF0Xz3XxPI+x02c5cXIE3yyTpqJeOPVpf9uB5cOhuT3+AOLbQLS+GUgUry5CUubO/CCy4P6qj/Ts+25Z62V0c7/pRh87gAl+vXIVM4Ej0BIYJt0H3Bxo4s7cSZKRxGUzjmcAUZlKcmBIdlcuI5tyQ3c3PY2NvLW/+3FJQ2YqNNnR3v1vv5TrsGN37EMzvWjSjMmeORo/MPJ8QwODPT3853qz5WBdehrHsme7dqXn3ssNrXW38vsX7dp271V7DXsAAAAASUVORK5CYII="/>';

/* Updating main menu */
var mainMenu = document.querySelector('div.icons');
p = mainMenu.getElementsByTagName('a')[2];
mainMenu.removeChild(p);
mainMenu.appendChild(confIcon);
mainMenu.appendChild(p);

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
            if (e.which === 39) {
                document.querySelectorAll('.nextPrevFleet a:nth-of-type(1)')[0].click();
            }
        });
    } else if (typeof (document.querySelectorAll('.nextPrevFleet')[0]) !== 'undefined' &&
               typeof (document.querySelectorAll('.nextPrevFleet')[1]) !== 'undefined') {
        document.addEventListener("keydown", e => {
            if (e.which === 37) {
                document.querySelectorAll('.nextPrevFleet a:nth-of-type(1)')[0].click();
            }
            if (e.which === 39) {
                document.querySelectorAll('.nextPrevFleet a:nth-of-type(1)')[1].click();
            }
        });
    } else { /* In case of '«' */
        document.addEventListener("keydown", e => {
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
if (location.href.includes('/planet/')) {
    line = document.getElementsByClassName('resource')[3];
    availablePopulation = line.getElementsByTagName('span')[0].innerText.split(' / ')[0];
    occupiedPopulation = line.getElementsByTagName('span')[2].innerText.replace('(', '').replace(' occupied)', '')

    availablePopulation = parseInt(availablePopulation.replace(',', ''));
    occupiedPopulation = parseInt(occupiedPopulation.replace(',', ''));
    line.getElementsByTagName('span')[0].innerText = formatNumber(availablePopulation+occupiedPopulation) + ' / ' + line.getElementsByTagName('span')[0].innerText.split(' / ')[1]
}

if (window.location.pathname=="/planets/") {
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
if (location.href.includes('/radar/')) {
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
