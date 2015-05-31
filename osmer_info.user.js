// ==UserScript== 
// @name           OSMer info
// @namespace           osm
// @version        0.02
// @description    Adds an OSM user info to forum pages
// @include        http://forum.openstreetmap.org/viewtopic.php*
// @match        http://forum.openstreetmap.org/viewtopic.php*
// ==/UserScript==

nickname = [];
domobjects = [];

function getscript(nick)
{
	var newscript = document.createElement('script');
	newscript.setAttribute('type','text/javascript');
	newscript.setAttribute('src', 'http://latlon.org/user_stat?user=' + nick);
	document.body.appendChild(newscript);
	return newscript;
};

function index(array, element)
{
	for (var i = 0; i < array.length; i++)
	{
		if (array[i] == element)
		{
			return i;
		}
	}
	return -1;
};

// Preparing callback function and injecting it in document
var newscript = document.createElement('script');
newscript.setAttribute('type','text/javascript');
var newscripttext = document.createTextNode("\
function getValueByKey(key, dict) {\
	for (var i = 0; i < dict.length; i++)\
	{\
		if (key == dict[i][0])\
			return dict[i][1];\
	}\
	return '';\
}\
function adddata(data) {\
	var postlefts = document.getElementsByClassName('postleft');\
	for (var i = 0; i < postlefts.length; i++)\
	{\
		currnick = postlefts[i].getElementsByTagName('dl')[0].getElementsByTagName('dt')[0].getElementsByTagName('strong')[0].getElementsByTagName('a')[0].text;\
		value = getValueByKey(currnick, data);\
		if (value != '')\
		{\
			newvalue = postlefts[i].getElementsByTagName('dl')[0].innerHTML.replace('<dd class=\"dummy\"><br><br><br><br></dd>', value);\
			postlefts[i].getElementsByTagName('dl')[0].innerHTML = newvalue;\
		}\
	}}");
newscript.appendChild(newscripttext);
document.body.appendChild(newscript);

var postlefts = document.getElementsByClassName('postleft');
for (var i = 0; i < postlefts.length; i++)
{
	nick = postlefts[i].getElementsByTagName('dl')[0].getElementsByTagName('dt')[0].getElementsByTagName('strong')[0].getElementsByTagName('a')[0].text;
	pos = index(nickname, nick);
	if (pos == -1)
	{
		nickname.push(nick);
		domobjects.push([postlefts[i].getElementsByTagName('dl')[0]]);
	}
	else 
		domobjects[pos].push(postlefts[i].getElementsByTagName('dl')[0]);
	// Adding dummies
	postlefts[i].getElementsByTagName('dl')[0].innerHTML += '<dd class="dummy"><br><br><br><br></dd>';
}

urlparts = window.location.href.split("#")
if (urlparts.length > 1)
	 document.getElementById(urlparts[1]).scrollIntoView();

for (var i = 0; i < nickname.length; i+=2)
	getscript(nickname[i]+((i+1 == nickname.length) ? '' : ','+nickname[i+1]));