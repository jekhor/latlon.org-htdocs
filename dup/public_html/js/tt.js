var map;
var bel, belsn;
var osb;
var mapnik;
var markers;
var selectControl;
var popup;
var box = null, boxes;
var features = null;
var brokenContentSize;
var questionform;

var loggedin = false;

var proto;

var uploading = false;

var modifiedstyle = {
    strokeColor: "green",
    strokeWidth: 3,
    strokeOpacity: 0.5,
    fillOpacity: 0.2,
    fillColor: "green",
    pointRadius: 6
};

var autostyle = {
    strokeColor: "#b9b900",
    strokeWidth: 3,
    strokeOpacity: 0.5,
    fillOpacity: 0.2,
    fillColor: "#b9b900",
    pointRadius: 6
};

var selectstyle = {
    strokeColor: "blue",
    strokeWidth: 3,
    strokeOpacity: 0.5,
    fillOpacity: 0.2,
    fillColor: "blue",
    pointRadius: 6
};

var hidestyle = {
    strokeColor: "transparent",
    fillColor: "transparent"
};


function loadfeatures(url) {
    removeedit(editing);
    if (uploading) return;
    if (map.zoom < 16) {
        if (map.zoom < 12) {
            questionform.className = "form hidden";
            questionform.innerHTML = "<div style='width: 300px; height: 100px;'>" +
             "<p style='text-align: center;'>" + OpenLayers.i18n("Please zoom in to be able to select features") + "</p>" +
             "<p style='text-align: center;'><button id='cancelbtn'>" + OpenLayers.i18n("Dismiss") + "</button></p></div>";
            questionform.style.display = "block";
            $("cancelbtn").onclick = function () {
                questionform.style.display = "none";
                return false;
            }
        } else {
            questionform.className = "form hidden";
            questionform.innerHTML = "<div style='width: 300px; height: 100px;'>" +
             "<p style='text-align: center;'>" + OpenLayers.i18n("Please zoom in to be able to select features") + "</p>" +
             "<p style='text-align: center;'><button id='cancelbtn'>" + OpenLayers.i18n("Dismiss") + "</button>" +
             "<button id='loadbtn'>" + OpenLayers.i18n("Load anyway") + "</button></p></div>";
            questionform.style.display = "block";
            $("cancelbtn").onclick = function () {
                questionform.style.display = "none";
                return false;
            }
            $("loadbtn").onclick = function () {
                if (!modified) {
                    questionform.style.display = "none";
                    actuallyloadfeatures(url);
                } else {
                    questionform.className = "form attention hidden";
                    questionform.innerHTML = "<div style='width: 300px; height: 100px;'>" +
                     "<p style='text-align: center;'>" + OpenLayers.i18n("You have unsaved changes. If you proceed, these changes will be lost") + "</p>" +
                     "<p style='text-align: center;'><button id='cancelbtn'>" + OpenLayers.i18n("Cancel") + "</button>" +
                     "<button id='discardbtn'>" + OpenLayers.i18n("Discard changes") + "</button></p></div>";
                    questionform.style.display = "block";
                    $("cancelbtn").onclick = function () {
                        questionform.style.display = "none";
                        return false;
                    }
                    $("discardbtn").onclick = function () {
                        questionform.style.display = "none";
                        actuallyloadfeatures(url);
                        return false;
                    }
                }
                return false;
            }
        }
        return;
    } else {
        questionform.style.display = "none";
    }
    if (modified) {
        questionform.className = "form attention hidden";
        questionform.innerHTML = "<div style='width: 300px; height: 100px;'>" +
         "<p style='text-align: center;'>" + OpenLayers.i18n("You have unsaved changes. If you proceed, these changes will be lost") + "</p>" +
         "<p style='text-align: center;'><button id='cancelbtn'>" + OpenLayers.i18n("Cancel") + "</button>" +
         "<button id='discardbtn'>" + OpenLayers.i18n("Discard changes") + "</button></p></div>";
        questionform.style.display = "block";
        $("cancelbtn").onclick = function () {
            questionform.style.display = "none";
            return false;
        }
        $("discardbtn").onclick = function () {
            questionform.style.display = "none";
            actuallyloadfeatures(url);
            return false;
        }
        return;
    }
    actuallyloadfeatures(url);
}

var actualdata = 0;
var gotsomedata = false;

function actuallyloadfeatures(url) {
    if (features) {
        features.destroy();
    }
    objmodified = {};
    objdownloaded = {};
    modified = false;

    var d = new Date();
    d = d.getTime();
    actualdata = d;
    gotsomedata = false;
    openSidebar({title: OpenLayers.i18n("Features"), content: OpenLayers.i18n("Loading data") + "... <img src='/images/spin.gif'/>"});
    setTimeout(function () {
        if (gotsomedata) return;
        $("sidebar_content").innerHTML = OpenLayers.i18n("Timed out waiting for data to load.");
    }, 90000);
    features = new OpenLayers.Layer.Vector("Features", {
        projection: map.displayProjection,
        strategies: [new OpenLayers.Strategy.Fixed()],
        style: hidestyle,
        onFeatureInsert: function (feature) {
            if (actualdata != d) return;
            gotsomedata = true;
            addfeature(feature);
        },
        displayInLayerSwitcher: false,
        protocol: proto = new OpenLayers.Protocol.HTTP({
            url: url,
            format: new OpenLayers.Format.OSM()
        })
    });
    map.addLayer(features);
}

var editing = null;
var oldvalue = null;

var modified = false;
var objmodified = {};

var objdownloaded = {};

function highlightfeature(id, style) {
    var feature = features.getFeatureByFid(id);
    feature.style = style;
    features.drawFeature(feature, style);
}

function handlekey(key) {
    switch (key) {
        case "Escape": {
            removeedit(editing);
        } break;
        case "Up": {
            if (editing.parentNode.previousElementSibling) {
                var id = editing.id;
                id = id.replace(/(node|way|relation)\.\d+\./, "");
                addedit($(editing.parentNode.previousElementSibling.id + "." + id));
            }
        } break;
        case "Enter":
        case "Down": {
            if (editing.parentNode.nextElementSibling) {
                var id = editing.id;
                id = id.replace(/(node|way|relation)\.\d+\./, "");
                addedit($(editing.parentNode.nextElementSibling.id + "." + id));
            }
        } break;
        case "Left": {
            if (editing && (editing.children[0].selectionEnd == editing.children[0].selectionStart)) {
                if (editing.children[0].selectionStart == 0) {
                    if (editing.previousElementSibling)
                        addedit(editing.previousElementSibling);
                    return false;
                }
            }
            return true;
        } break;
        case "Right": {
            if (editing && (editing.children[0].selectionEnd == editing.children[0].selectionStart)) {
                if (editing.children[0].selectionEnd == editing.children[0].value.length) {
                    if (editing.nextElementSibling)
                        addedit(editing.nextElementSibling);
                    return false;
                }
            }
            return true;
        } break;
        case "Ctrl+Right": {
            copytag();
        } break;
        default: {
            alert(key + " pressed");
        }
    }
    return false;
}

var tagspopup = null;

var tagcombo = null;

var header;

function addtagcombo(o, selected, populatecombo, onselect) {
    if (o.children.length) return;
    if (tagcombo) removetagcombo(tagcombo);
    o.innerHTML = "<select id='"+ o.id +"_combo'></select>";
    var options = populatecombo();
    for (var i in options) {
        var y = document.createElement("option");
        y.value = i;
        y.text = options[i];
        y.selected = (selected == i);
        o.children[0].add(y, null);
    }
    o.onblur = function () {
        removetagcombo(o);
    }
    o.children[0].focus();
    tagcombo = o;
}

function removetagcombo(o) {
    if (!o.children.length) return;
    var s = o.children[0].value;
    o.innerHTML = stringmap(s, [[/&/g, "&amp;"], [/"/g, "&quot;"], [/'/g, "&#39;"], [/</g, "&lt;"], [/>/g, "&gt;"]]);
    var id = o.id.replace("tagspan.", "");
    usefultags[parseInt(id)] = s;
}

function addtagedit(o, selected, populatecombo, onselect) {
    if (o.children.length) return;
    if (tagcombo) removetagcombo(tagcombo);
    o.innerHTML = "<select id='"+ o.id +"_combo'></select>";
    var options = populatecombo();
    for (var i in options) {
        var y = document.createElement("option");
        y.value = i;
        y.text = options[i];
        y.selected = (selected == i);
        o.children[0].add(y, null);
    }
    o.onblur = function () {
        removetagcombo(o);
    }
    o.children[0].focus();
    tagcombo = o;
}

function removetagedit(o) {
    if (!o.children.length) return;
    o.innerHTML = stringmap(o.children[0].value, [[/&/g, "&amp;"], [/"/g, "&quot;"], [/'/g, "&#39;"], [/</g, "&lt;"], [/>/g, "&gt;"]]);
}

function addedit(o) {
    if (uploading) return;
    if (!editing) {
        var w = o.clientWidth;
        var h = o.clientHeight;
        o.innerHTML = "<input id='"+ o.id +"_edit' type='text' value=\"" + stringmap(o.innerHTML, [[/"/g, "&quot;"], [/>/g, "&gt;"], [/</g, "&lt;"]]) + "\" />";
        o.onblur = function () {
            removeedit(o);
        }
        editing = o;
        oldvalue = o.children[0].value;
        o.children[0].style.width = w + "px";
        o.children[0].style.height = h + "px";
        o.children[0].focus();
        highlightfeature(o.parentNode.id, selectstyle);
        tagspopup = $("tagspopup");
        var s = "<ul id='tagslist'>", t, f = features.getFeatureByFid(o.parentNode.id).data;
        for (t in f) {
            s += ("<li>" + stringmap(t + "=" + f[t], [[/&/g, "&amp;"], [/"/g, "&quot;"], [/'/g, "&#39;"], [/</g, "&lt;"], [/>/g, "&gt;"]]) + "</li>");
        }
        s += "</ul>";
        tagspopup.innerHTML = s;
        tagspopup.className = "form";
        tagspopup.style.left = "0px";
        tagspopup.style.right = "auto";
        tagspopup.style.height = "";
        tagspopup.style.height = cond(tagspopup.scrollHeight > 100, 100, (tagspopup.scrollHeight)) + "px";
        if ((o.parentNode.offsetTop - $("sidebar_content").offsetTop) < ($("sidebar_content").offsetHeight/2)) {
            tagspopup.style.top = "";
            tagspopup.style.bottom = "0px";
        } else {
            tagspopup.style.top = $("sidebar_title").offsetHeight + "px";
            tagspopup.style.bottom = "";
        }
    } else {
        if (editing == o) return;
        removeedit(editing);
        if (o)
            addedit(o);
    }
}

function removeedit(o) {
    if (uploading) return;
    if (editing) {
        var s = o.children[0].value;
        if (s != oldvalue) {
            o.parentNode.className = "modifiedrow";
            var id = o.id;
            id = id.replace(/(node|way|relation)\.\d+\./, "");
            if (!objmodified[o.parentNode.id]) {
                objmodified[o.parentNode.id] = {};
            }
            objmodified[o.parentNode.id][id] = s;
            highlightfeature(o.parentNode.id, modifiedstyle);
            modified = true;
        }
        s = stringmap(s, [[/&/g, "&amp;"], [/"/g, "&quot;"], [/'/g, "&#39;"], [/</g, "&lt;"], [/>/g, "&gt;"]]);
        if (!objmodified[o.parentNode.id]) {
            highlightfeature(o.parentNode.id, hidestyle);
        } else {
            highlightfeature(o.parentNode.id, modifiedstyle);
        }
        o.innerHTML = s;
        editing = null;
        tagspopup.className = "form hidden";
    }
}

function getnext(a) {
    if (a.length == 0) {
        openchangeset();
        return;
    }
    var i = a.shift();
    $("log").innerHTML += (OpenLayers.i18n("Downloading") + " " + stringmap(i, [["."," "]]) + "...");
    OpenLayers.Request.GET({url: "/api/0.6/" + stringmap(i, [[".","/"]]), params: {}, success: function (o) {
            $("log").innerHTML += "<br />";
            objdownloaded[i] = OpenLayers.parseXMLString(o.responseText);
            var w = objdownloaded[i].documentElement.firstElementChild;
            foreach(usefultags, function (e) {
                var tags = w.getElementsByTagName("tag");
                var l = tags.length;
                var j;
                var matches = 0;
                for (j = 0; j < l; j++) {
                    if (tags[j].attributes["k"].value == e) {
                        if (objmodified[i][e])
                            tags[j].setAttribute("v", objmodified[i][e]);
                        matches++;
                    }
                }
                if (matches == 0) {
                    if ((objmodified[i][e]) && (objmodified[i][e] != "")) {
                        var t = osmchanges.createElement("tag");
                        t.setAttribute("k", e);
                        t.setAttribute("v", objmodified[i][e]);
                        w.appendChild(t);
                    }
                }
            });
            osmchanges.documentElement.firstElementChild.appendChild(w.cloneNode(true));
            setTimeout(function() {
                getnext(a);
            }, 0);
            /* tailcall(getnext, a); */
        }
    });
}

var osmchanges;
var changesetid;

function openchangeset() {
    var changesetreq = "<?xml version='1.0' encoding='UTF-8'?><osm version='0.6' generator='JOSM'><changeset id='0' open='false'><tag k='comment' v='on-line edits' /><tag k='created_by' v='http://latlon.org/tt/' /></changeset></osm>";
    $("log").innerHTML += (OpenLayers.i18n("Opening the new changeset") + "...");
    OpenLayers.Request.PUT({url: "/api/0.6/changeset/create", data: changesetreq, headers: {"Authorization": header}, success: function (o) {
            changesetid = o.responseText;
            $("log").innerHTML += (" " + changesetid + "<br />" + OpenLayers.i18n("Uploading changes") + "...");
            var m = osmchanges.documentElement.firstElementChild;
            foreach(m.childNodes, function (e) {
                e.setAttribute("changeset", changesetid);
                //e.setAttribute("version", parseInt(e.attributes["version"].value)+1);
            });
            OpenLayers.Request.POST({url: "/api/0.6/changeset/" + changesetid + "/upload", headers: {"Authorization": header}, data: osmchanges, success: function (o) {
                    $("log").innerHTML += (" " + OpenLayers.i18n("done") + "<br />" + OpenLayers.i18n("Closing the changeset") + "...");
                    OpenLayers.Request.PUT({url: "/api/0.6/changeset/" + changesetid + "/close", headers: {"Authorization": header}, success: function (o) {
                            uploading = false;
                            $("wait").style.display = "none";
                            $("log").innerHTML += (" " + OpenLayers.i18n("success") + "!<br />");
                            var r = $("transtable").rows;
                            var l = r.length;
                            var i;
                            for (i = 1; i < l; i++) {
                                if ((r[i].className == "modifiedrow") || (r[i].className == "autorow")) {
                                    r[i].className = "savedrow";
                                }
                            }
                            modified = false;
                        }, failure: function (o) {
                            uploading = false;
                            $("wait").style.display = "none";
                            $("log").innerHTML += " " + OpenLayers.i18n("failure") + ".";
                        }
                    });
                }, failure: function (o) {
                    uploading = false;
                    $("wait").style.display = "none";
                    $("log").innerHTML += " " + OpenLayers.i18n("failure") + ".";
                }
            });
        }, failure: function (o) {
            uploading = false;
            $("wait").style.display = "none";
            $("log").innerHTML += " " + OpenLayers.i18n("failure") + ".";
        }
    });
}

function startupload() {
    if (uploading) return;
    removeedit(editing);
    if (!modified) return;
    uploading = true;
    osmchanges = OpenLayers.parseXMLString("<osmChange version='0.3' generator='latlon.org/tt/'><modify></modify></osmChange>");
    var q = [];
    for(var i in objmodified) {
        q.push(i);
    }
    tagspopup.className = "form hidden";
    $("wait").style.display = "inline";
    getnext(q);
}

var maintag = "name";
var usefultags = ["name", "name:be", "name:ru"];

function decodehtml(html) {
    var e = document.createElement("div");
    e.innerHTML = "<input value=\""+ stringmap(html, [[/"/g, "&quot;"], [/>/g, "&gt;"], [/</g, "&lt;"]]) + "\"/>";
    return e.children[0].value;
}

function copytag() {
    editing.children[0].value = decodehtml($(editing.parentNode.id + "." + maintag).innerHTML)
}


function filltags(tag) {
    removeedit(editing);
    var r = $("transtable").rows;
    var l = r.length;
    var i, id, v;
    var tm = {};
    for (i = 1; i < l; i++) {
        id = r[i].id;
        v = $(id + "." + maintag).innerHTML;
        if (!tm[v]) {
            tm[v] = $(id + "." + tag).innerHTML;
        }
    }
    for (i = 1; i < l; i++) {
        id = r[i].id;
        v = $(id + "." + maintag).innerHTML;
        if ($(id + "." + tag).innerHTML == "") {
            if (tm[v]) {
                $(id + "." + tag).innerHTML = tm[v];
            } else {
                $(id + "." + tag).innerHTML = v;
            }
            $(id).className = "autorow";
            if (!objmodified[id]) {
                objmodified[id] = {};
            }
            objmodified[id][tag] = decodehtml(v);
            modified = true;
            highlightfeature(id, autostyle);
        }
    }
}

function filltagsknown(tag) {
    removeedit(editing);
    var r = $("transtable").rows;
    var l = r.length;
    var i, id, v;
    var tm = {};
    for (i = 1; i < l; i++) {
        id = r[i].id;
        v = $(id + "." + maintag).innerHTML;
        if (!tm[v]) {
            tm[v] = $(id + "." + tag).innerHTML;
        }
    }
    for (i = 1; i < l; i++) {
        id = r[i].id;
        v = $(id + "." + maintag).innerHTML;
        if ($(id + "." + tag).innerHTML == "") {
            if (tm[v]) {
                $(id + "." + tag).innerHTML = tm[v];
                $(id).className = "autorow";
                if (!objmodified[id]) {
                    objmodified[id] = {};
                }
                objmodified[id][tag] = decodehtml(tm[v]);
                modified = true;
                highlightfeature(id, autostyle);
            }
        }
    }
}

function dumbfilltags(tag) {
    removeedit(editing);
    var r = $("transtable").rows;
    var l = r.length;
    var i, id;
    for (i = 1; i < l; i++) {
        id = r[i].id;
        if ($(id + "." + tag).innerHTML == "") {
            $(id + "." + tag).innerHTML = $(id + "." + maintag).innerHTML;
            $(id).className = "autorow";
        }
    }
}

function loginbox() {
    if (loggedin) {
        return "<p style='text-align: center' id='okaybox'><button id='okay'>Okay</button></p>";
    } else {
        return "<p style='text-align: center' class='hidden' id='okaybox'><button id='okay'>Okay</button></p><p id='loginbox'>" + OpenLayers.i18n("You haven't yet logged in.") + "<br /><span><button id='login'>" + OpenLayers.i18n("Log in") + "</button> " + OpenLayers.i18n("or") + " <button id='register'>" + OpenLayers.i18n("Register") + "</button></span></p>";
    }
}

var base64_alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
 
function base64_encode(input) {
    var result = "";
    var i, chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    for (i = 0; i < input.length; i += 3) {
        chr1 = input.charCodeAt(i);
        chr2 = input.charCodeAt(i + 1);
        chr3 = input.charCodeAt(i + 2);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 0x3f;
        if (isNaN(chr2)) {
            enc3 = 0x40;
            enc4 = 0x40;
        } else if (isNaN(chr3)) {
            enc4 = 0x40;
        }
        result += (base64_alphabet[enc1] + base64_alphabet[enc2] + base64_alphabet[enc3] + base64_alphabet[enc4]);
    }
    return result;
}


function login() {
    $("loginbox").innerHTML = "<form>" + OpenLayers.i18n("User name") + ": <input type='text' name='username' id='username'/><br />" + OpenLayers.i18n("Password") + ": <input type='password' name='password' id='password'/><br /><button id='lemmein'>" + OpenLayers.i18n("Let me in") + "</button><span id='loginmessage'></span></form>";
    $("lemmein").onclick = function () {
        var username = $("username").value;
        var password = $("password").value;
        loggedin = {
            "username": username,
            "password": password
        };
        header = "Basic " + base64_encode(username + ":" + password);
        $("loginmessage").innerHTML = "";
        OpenLayers.Request.GET({url: "/api/0.6/user/details", headers: {"Authorization": header}, success: function (o) {
            $("loginbox").innerHTML = OpenLayers.i18n("Logged in successfully.");
            setTimeout(function() {
                $("okaybox").className = "";
                $("loginbox").className = "hidden";
            }, 5000);
        }, failure: function (o) {
            $("loginmessage").innerHTML = OpenLayers.i18n("Failed to log in.");
        }});
        return false;
    };
}

function register() {
    window.open("http://www.openstreetmap.org/user/new", "osmreg");
}

function addfeature(feature) {
    /* if (feature.data[maintag] == null) return; */
    var useful = false;
    for (var i in usefultags) {
        if (feature.data[usefultags[i]] != null) {
            useful = true;
        }
    }
    if (!useful) return;
    var t = $("transtable");
    if (t == null) {
        var h = "";
        foreach(usefultags, function (x) {
            h += ("<th>" + cond(x == maintag, x, "<a href='#' title='Autofill' id='head." + x +"'>&rarr;</a>" +
                "<a href='#' title='Autofill known' id='head2." + x +"'>&#8801;</a>" + x) + "</th>");
        });
        openSidebar({title: OpenLayers.i18n("Features"), content: "<table id='transtable' cellspacing='0'><thead><tr>" + h + "</tr></thead><tbody></tbody></table>" + loginbox() + "<p>" + OpenLayers.i18n("Log") + ":</p><p><span id='log'></span><img id='wait' style='display: none;' src='/images/spin.gif'/></p>"});
        foreach(usefultags, function (x) {
            if (x != maintag) {
                $("head." + x).onclick = function () {
                    filltags(x);
                    return false;
                }
                $("head2." + x).onclick = function () {
                    filltagsknown(x);
                    return false;
                }
            }
        });
        $("okay").onclick = startupload;
        if (!loggedin) {
            $("login").onclick = login;
            $("register").onclick = register;
        }
        t = $("transtable");
    } else {
        editing = null;
    }
    t = $("transtable").children[1];
    var r = document.createElement("tr");
    r.id = feature.fid;
    var i = 0;
    foreach(usefultags, function (n) {
        var e = document.createElement("td");
        e.appendChild(document.createTextNode(scond(feature.data[n], feature.data[n])));
        e.id = feature.fid + "." + n;
        if (i == 0) {
            e.className = feature.fid.replace(/\.\d+/, "") + "obj";
        }
        i++;
        e.onclick = function (ev) {
            addedit(e);
        }
        r.appendChild(e);
    });
    t.appendChild(r);
}

function init() {
    if (OpenLayers.Util.getParameters().lang != null) {
        OpenLayers.Lang.setCode(OpenLayers.Util.getParameters().lang.replace(/_/, "-"));
    }
    brokenContentSize = $("content").offsetWidth == 0;
    OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
    OpenLayers.Util.onImageLoadErrorColor = "transparent";
    OpenLayers.Control.Permalink.prototype.updateLink = function() {
        var href = this.base;
        if (href.indexOf('#') != -1) {
            href = href.substring( 0, href.indexOf('#') );
        }
        if (href.indexOf('?') != -1) {
            href = href.substring( 0, href.indexOf('?') );
        }

        var query = OpenLayers.Util.getParameterString(this.createParams());
        if (query != "") query = "?" + query;

	href += query;
	if (this.hash) 
        	href += this.hash;

        this.element.href = href;
    }

    if (!location.hash) {
        //location.hash="#";
    }

    var options = {
        projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        units: "m",
        numZoomLevels: 18,
        maxResolution: 156543.0339,
        maxExtent: new OpenLayers.Bounds(-20037508, -20037508,
                                         20037508, 20037508.34),
        controls: [
          new OpenLayers.Control.MouseDefaults(), 
          new OpenLayers.Control.PanZoomBar(), 
          new OpenLayers.Control.Attribution(), 
          new OpenLayers.Control.ScaleLine(), 
          new OpenLayers.Control.MousePosition(),
          new OpenLayers.Control.LayerSwitcher(),
          new OpenLayers.Control.Permalink(null, null, {"hash": document.location.hash}),
          new OpenLayers.Control.Permalink("editlink", "http://openstreetmap.org/edit", {"hash": document.location.hash}),
          new OpenLayers.Control.Permalink("mini", "http://latlon.org/", {"hash": document.location.hash}),
          new OpenLayers.Control.Permalink("maxi", "http://latlon.org/maxi", {"hash": document.location.hash}),
          new OpenLayers.Control.Permalink("transport", "http://latlon.org/pt", {"hash": document.location.hash}),
          new OpenLayers.Control.Permalink("sketchlink", "http://latlon.org/sketch", {"hash": document.location.hash})
        ]
    };

    map = new OpenLayers.Map('map', options);
    mapnik = new OpenLayers.Layer.OSM();

    var date = new Date();
    bel = new OpenLayers.Layer.OSM("Беларуская", "http://tile.latlon.org/tiles/${z}/${x}/${y}.png", {isBaseLayer: true,  type: 'png', displayOutsideMaxExtent: true, transitionEffect: "resize"});

    boxes  = new OpenLayers.Layer.Boxes("Boxes", {displayInLayerSwitcher: false});
    
    map.addLayers([mapnik, bel, boxes]);
    if (OpenLayers.Util.getParameters().layers == null) {
        map.setBaseLayer(bel);
    }
    {
        var h = "";
        var i = 0;
        foreach(usefultags, function (x) {
            h += ("<li>" + cond(x == maintag, "<span class='maintagli tagli' id='tagspan."+ i + "'>" + x + "</span> <a class='actionlink hidden' href='#'>" + OpenLayers.i18n("Make default") + "</a>", "<span class='tagli' id='tagspan."+ i + "'>" + x + "</span> <a class='actionlink' href='#'>" + OpenLayers.i18n("Make default") + "</a>") + "</li>");
            i++;
        });
        openSidebar({title: OpenLayers.i18n("Features"), content: "<p style='text-align: center; margin: 5px;'>" + OpenLayers.i18n("Use Ctrl+drag to select the area to download. Remember that you have to be a <a href='https://www.openstreetmap.org/user/new'>registered</a> OpenStreetMap user to save your changes.") + "</p>" +
            "<p style=''>" + OpenLayers.i18n("Tags to edit (click to change)") + ":</p><ul style='margin-left: 10pt;'>" + h + "</ul>"});
        var l = i;
        i = 0;
        foreach(usefultags, function (x) {
            var o = $("tagspan." + i);
            var ll = l;
            var ii = i;
            o.parentNode.getElementsByTagName("a")[0].onclick = function () {
                if (tagcombo) removetagcombo(tagcombo);
                tagcombo = null;
                var i;
                for (i = 0; i < ll; i++) {
                    var oo = $("tagspan." + i);
                    oo.parentNode.getElementsByTagName("a")[0].className = (i == ii) ? "actionlink hidden" : "actionlink";
                    oo.className = (i == ii) ? "maintagli tagli" : "tagli";
                }
                maintag = decodehtml(o.innerHTML);
            }
            $("tagspan." + i).onclick = function () {
                addtagcombo(o, x, function () {
                    var l = {};
                    foreach(usefultags, function (y) {
                        l[y] = y;
                    });
                    foreach(["name", "name:en", "name:be", 
                             "name:uk", "name:ru", "name:de",
                             "name:pl", "name:cz", "name:sk",
                             "old_name", "int_name", "alt_name"], function (y) {
                        l[y] = y;
                    });
                    return l;
                }, function () {
                    alert(x);
                });
            }
            i++;
        });
    }

    //map.addLayers([osbLayer]);
    //cafes.preFeatureInsert = style_osm_feature; 

    var control = new OpenLayers.Control();
    OpenLayers.Util.extend(control, {
        draw: function () {
            // this Handler.Box will intercept the shift-mousedown
            // before Control.MouseDefault gets to see it
            this.box = new OpenLayers.Handler.Box( control,
                {"done": this.notice},
                {keyMask: OpenLayers.Handler.MOD_CTRL});
            this.box.activate();
        },

        notice: function (bounds) {
            var ll = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.left, bounds.bottom)); 
            var ur = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.right, bounds.top)); 
            if (box) {
                boxes.removeMarker(box);
                box.destroy();
            }
            boxes.addMarker(box = new OpenLayers.Marker.Box(new OpenLayers.Bounds(ll.lon.toFixed(4), ll.lat.toFixed(4), ur.lon.toFixed(4), ur.lat.toFixed(4))));
            ll.transform(map.projection,map.displayProjection);
            ur.transform(map.projection,map.displayProjection);
            /*alert(ll.lon.toFixed(4) + ", " + 
                  ll.lat.toFixed(4) + ", " + 
                  ur.lon.toFixed(4) + ", " + 
                  ur.lat.toFixed(4));*/
            loadfeatures("/api/0.6/map?bbox=" + ll.lon.toFixed(7) + "," + 
                  ll.lat.toFixed(7) + "," + 
                  ur.lon.toFixed(7) + "," + 
                  ur.lat.toFixed(7));
        }
    });
    map.addControl(control);

    if (!map.getCenter()) {
        var lonlat, zoom;
        if (OpenLayers.Util.getParameters().mlon == null) {
            lonlat = new OpenLayers.LonLat(27.56813, 53.90313);
            zoom = 7;
        } else {
            lonlat = new OpenLayers.LonLat(OpenLayers.Util.getParameters().mlon,OpenLayers.Util.getParameters().mlat);
            if (OpenLayers.Util.getParameters().zoom == null) {
                zoom = 17;
            } else {
                zoom = OpenLayers.Util.getParameters().zoom;
            }
            markers.addMarker(new OpenLayers.Marker(lonlat));
        }
        lonlat.transform(map.displayProjection,map.projection);
        map.setCenter(lonlat, zoom);
        map.panTo(lonlat);
    }

    handleResize();
    foreach(["Left", "Up", "Down", "Right", "Enter", "Escape", "Ctrl+Right"], function (key) {
        shortcut.add(key, function () {
            return handlekey(key);
        });
    });

    window.onload = handleResize;
    window.onresize = handleResize;
   
    tagspopup = document.createElement("div");
    tagspopup.id = "tagspopup";
    tagspopup.className = "form hidden";
    $("sidebar").appendChild(tagspopup);

    questionform = document.createElement("form");
    questionform.innerHTML = OpenLayers.i18n("Are you sure?");
    questionform.id = "question";
    questionform.className = "form hidden";
    document.body.insertBefore(questionform, $("content"));
    
    var sorry = document.createElement("div");
    sorry.innerHTML = OpenLayers.i18n("Ctrl-Drag to select the area to translate.<br />This tool is still a work-in-progress. Please <a href='https://bitbucket.org/andrew_shadoura/online-translator/issues/new'>report</a> any bugs you find to the author.");
    sorry.id = "sorry";
    document.body.insertBefore(sorry, $("content"));
}



