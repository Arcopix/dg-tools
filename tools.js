// ==UserScript==
// @name       DG utilities
// @namespace  devhex
// @version    0.3.0004
// @description  various minor improvements of DG interface
// @match      https://beta.darkgalaxy.com/
// @match      https://beta.darkgalaxy.com/*
// @copyright  2020, Stefan Lekov / Arcopix / Devhex Ltd
// ==/UserScript==

/* TODO:
integrate/refactor scripts 1, 2 and 4 from Mord */

/* Config start */
var nap_ally = [ "[ALLY1]", "[ALLY2]" ]; // Which alliances you want to be color coded as NAP. Note the brackets.
var custom_style = "COLOR: #FFD54F;"; // Color specified for NAP
/* Config end */

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

/* Go to mail module and set recepient */
function configureMail(player)
{
    window.location.href = "https://beta.darkgalaxy.com/mail/?to=" + player;
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
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

/* Colorize the alliance tag / playname if it matches a tag nap_ally */
var elems = document.getElementsByTagName("div");
var deb=0;
var player="";
for (var i=0; i<elems.length; i++) {
    var e = elems[i];
    if (e.className=="allianceName"&&nap_ally.includes(e.innerText.trim())) {
        e.style = custom_style;
        var p = e.parentElement;
        for (var j=0; j<p.children.length; j++) {
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
    e.addEventListener('click', function() { configureMail(this.innerText.trim()) }, false);
}

/* If in mail module and to is set -> set the recepient */
if (window.location.pathname=="/mail/" && window.location.search!=="") {
    var query = getQueryParams(document.location.search);
    if (typeof query.to != 'undefined' && query.to != "") {
        document.getElementsByName('to')[0].value = query.to;
    }
}
var name, left;

/* Add confirmation on canceling buildings */
elems = document.getElementsByClassName("queueRemoveButton");
for (i=0; i<elems.length; i++) {
    var add_confirm = 0;
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
if (document.querySelector('.nextPrevFleet, .left')) {
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
var numberWithCommas;
var line;
var availablePopulation, occupiedPopulation;
var planets;
if (location.href.includes('/planet/')) {
    numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    c = c.getElementsByTagName('span')[0];

    /* Don't bother with home planets */
    if (c.innerText=='0.0.0') {
        continue;
    }

    let p = c.innerText.split('.');
    c.innerHTML = '<a href="/navigation/' + p[0] + '/' + p[1] + '/">' + c.innerHTML + '</a>';
}

/* Fix sorting of radarts */
var radars, radar, fleetRow, fleetCount;
if (location.href.includes('/radar/')) {
    radars = document.getElementsByClassName('opacDarkBackground');
    for (i=0; i<radars.length; i++) {
        if (radars[i].className.includes('paddingMid')) {
            continue;
        }
        radar = radars[i];
        fleetRow = radar.getElementsByClassName('entry');

        let crow = [];
        for (j=fleetRow.length-1; j>=0; j--) {
            crow[j] = fleetRow[j];
            fleetRow[j].parentNode.removeChild(fleetRow[j]);
        }

        for (m=24; m>=0; m--) {
            for (j=crow.length-1; j>=0; j--) {
                if (crow[j]&&parseInt(crow[j].getElementsByClassName('turns')[0].innerText)==m) {
                    radars[i].appendChild(crow[j]);
                    crow[j] = 0;
                }
            }
        }
        for (j=crow.length-1; j>=0; j--) {
            if (crow[j]) {
                radars[i].appendChild(crow[j]);
            }
        }
    }
}

/* End of script */
