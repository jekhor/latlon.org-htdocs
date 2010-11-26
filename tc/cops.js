var map;
var osb;
var mapnik;
var markers;
var selectControl;
var popup;
var cops;
var brokenContentSize;

function style_osm_feature(feature) {
    alert(0);
}

function osbug() {
    osbug_makeform();
}

function osbug_makeform() {
        var newContent = document.createElement("div");
        var el1,el2,el3;
        var control = osb;

        var el_form = newContent;

        el1 = document.createElement("dl");

        el2 = document.createElement("dt");
        el2.appendChild(document.createTextNode(OpenLayers.i18n("Type:")));
        el1.appendChild(el2);
        el2 = document.createElement("dd");
        var calmType1 = document.createElement("input");
        calmType1.id = "speedcam";
        calmType1.value = "speedcam";
        calmType1.type = "radio";
        calmType1.name = "type";
        el2.appendChild(calmType1);
        var label = document.createElement("label");
        //label.for = "speedcam";
        label.appendChild(document.createTextNode(OpenLayers.i18n("Speedcam")));
        el2.appendChild(label);
        el2.appendChild(document.createElement("br"));
        var calmType2 = document.createElement("input");
        calmType2.id = "bump";
        calmType2.value = "bump";
        calmType2.type = "radio";
        calmType2.name = "type";
        el2.appendChild(calmType2);
        label = document.createElement("label");
        //label.for = "bump";
        label.appendChild(document.createTextNode(OpenLayers.i18n("Bump")));
        el2.appendChild(label);
        el2.appendChild(document.createElement("br"));
        var calmType3 = document.createElement("input");
        calmType3.id = "bug";
        calmType3.value = "bug";
        calmType3.type = "radio";
        calmType3.name = "type";
        el2.appendChild(calmType3);
        label = document.createElement("label");
        //label.for = "bump";
        label.appendChild(document.createTextNode(OpenLayers.i18n("Something's wrong")));
        el2.appendChild(label);
        el1.appendChild(el2);

        el2 = document.createElement("dt");
        el2.appendChild(document.createTextNode(OpenLayers.i18n("Your name:")));
        el1.appendChild(el2);
        el2 = document.createElement("dd");
        var inputUsername = document.createElement("input");
        if (osb.osbLayer.usernameshort != null) {
            if (osb.osbLayer.usernameshort == "") {
                osb.osbLayer.usernameshort = "anonymous";
            }            
        } else {
            if (osb.osbLayer.username != null) {
                osb.osbLayer.usernameshort = osb.osbLayer.username.replace("@latlon.org/tc","");
            }
        }
        if (osb.osbLayer.usernameshort == "NoName") {
            osb.osbLayer.usernameshort = OpenLayers.i18n("NoName");
        }
        inputUsername.className = "osbUsername";
        inputUsername.id = "osbuser";
        el2.appendChild(inputUsername);
        el1.appendChild(el2);

        el2 = document.createElement("dt");
        el2.appendChild(document.createTextNode(OpenLayers.i18n("Your message:")));
        el1.appendChild(el2);
        el2 = document.createElement("dd");
        var inputDescription = document.createElement("input");
        inputDescription.id = "osbtext";
        el2.appendChild(inputDescription);
        el1.appendChild(el2);
        el_form.appendChild(el1);

        el1 = document.createElement("div");
        el2 = document.createElement("button");
        el2.innerHTML = OpenLayers.i18n("Say");
        el2.id = "saybtn";
        el1.appendChild(el2);
        el_form.appendChild(el1);

        popup.setContentHTML(newContent.innerHTML);
        $("bump").checked = true;
        $("osbuser").value = osb.osbLayer.usernameshort;
        $("saybtn").onclick = function() {
            var l = popup.lonlat;
            var t = "(error) ";
            if ($("speedcam").checked) t = "(speedcam) ";
            if ($("bump").checked) t = "(bump) ";
            l.transform(map.projection,map.displayProjection)
            /* if ($("osbuser").value == "NoName") {
                alert(OpenLayers.i18n("Please fill in your name"));
                return false;
            } */
            osb.osbLayer.setUserName($("osbuser").value + "@latlon.org/tc");
            osb.osbLayer.usernameshort = $("osbuser").value;
            osb.osbLayer.createBug(l, t + $("osbtext").value);
            popup.setContentHTML(OpenLayers.i18n("Thanks for your response, it will be taken into account soon."));
            popup.updateSize();
            return false;
        };

        popup.updateSize();
}

function onPopupClose(evt) {
    if (popup) {
        map.removePopup(popup);
        popup.destroy();
        popup = null;
    }
}

function onFeatureSelect(evt) {
    onPopupClose();
    if (map.zoom < 17) {
        map.zoomTo(17);
        return;
    }
    var l = map.getLonLatFromViewPortPx(evt.xy);

    var name;

    popup = new OpenLayers.Popup.FramedCloud("featurePopup",
                             l,
                             new OpenLayers.Size(100,100),
                             "dummy",
                             null, true, onPopupClose);
    popup.updateSize();
    map.addPopup(popup);
    osbug_makeform()
}

function onFeatureUnselect(evt) {
    return;
}

function putAJAXMarker(id, lon, lat, text, closed)
{
    var comments = text.split(/<hr \/>/);
    for(var i=0; i<comments.length; i++)
        comments[i] = comments[i].replace(/&quot;/g, "\"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    if (closed) return;
    if ((text.indexOf("LatLon") == -1) &&
        (text.indexOf("latlon") == -1)) return;
    
    putAJAXMarker.bugs[id] = [
        new OpenLayers.LonLat(lon, lat),
        comments,
        closed
    ];
    for(var i=0; i<putAJAXMarker.layers.length; i++)
        putAJAXMarker.layers[i].createMarker(id);
}

putAJAXMarker.layers = [ ];
putAJAXMarker.bugs = { };

function init() {
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
    cops = new OpenLayers.Layer.OSM("Traffic calming", "http://91.208.39.18/cops/${z}/${x}/${y}.png?" + date.getTime(), {numZoomLevels: 19,  isBaseLayer: false,  type: 'png', splayOutsideMaxExtent: true, visibility: true});

    //new OpenLayers.Layer.Markers("Cafés");
    markers = new OpenLayers.Layer.Markers("Markers");

    var osbLayer = new OpenLayers.Layer.OpenStreetBugs("OpenStreetBugs", { permalinkURL: "http://latlon.org/tc/", theme: "/css/openstreetbugs.css"});
    osb = new OpenLayers.Control.OpenStreetBugs(osbLayer);
    map.addLayers([mapnik, cops, markers, osbLayer]);
    //map.addLayers([osbLayer]);
    //cafes.preFeatureInsert = style_osm_feature; 

    selectControl = new OpenLayers.Control.Click(osbLayer, {"click": onFeatureSelect}, {"single": true, "double": false, "pixelTolerance": 0, "stopSingle": false, "stopDouble": false});
    selectControl.click = onFeatureSelect;
    map.addControl(selectControl);
    selectControl.activate();

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

    window.onload = handleResize;
    window.onresize = handleResize;
    
    var sorry = document.createElement("div");
    sorry.innerHTML = OpenLayers.i18n("New bumps can be added on zoom level 17 or greater<br/>More info can be found <a href='http://blog.latlon.org/2010/11/16/otmetki-o-lezhachikh-policejjskikh-v-osm/'>here</a>");
    sorry.id = "sorry";
    document.body.insertBefore(sorry, $("content"));
}


OpenLayers.Lang.ru = OpenLayers.Util.extend(OpenLayers.Lang.ru, {
    "Say": "Сообщить",
    "Your message:": "Комментарий",
    "Bump": "Спящий полицейский",
    "Speedcam": "Камера",
    "Type:": "Вид:",
    "Your name:": "Представьтесь:",
    "NoName": "Кто-то",
    "Please fill in your name": "Представьтесь, пожалуйста",
    "Comment is required": "Впишите, пожалуйста, комментарий",
    "Something's wrong": "Ошибка на карте",
    "Description": "Описание",
    "Comment": "Комментарий",
    "Permalink": "Постоянная ссылка",
    "Zoom": "Приблизить",
    "Unresolved Error": "Неисправленная неточность",
    "Comment/Close": "Изменить",
    "Traffic Calming": "",
    "Nickname": "Представьтесь",
    "New bumps can be added on zoom level 17 or greater<br/>More info can be found <a href='http://blog.latlon.org/2010/11/16/otmetki-o-lezhachikh-policejjskikh-v-osm/'>here</a>": "Добавлять сведения можно только на максимальном уровне детализации<br/>Подробности <a href='http://blog.latlon.org/2010/11/16/otmetki-o-lezhachikh-policejjskikh-v-osm/'>здесь</a>"
});

