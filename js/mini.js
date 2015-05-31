var map;
var mapnik;
var bel;
var markers;
var brokenContentSize;

var sketchSymbolizers = {
    "Point": {
      pointRadius: 4,
      graphicName: "square",
      fillColor: "white",
      fillOpacity: 1,
      strokeWidth: 1,
      strokeOpacity: 1,
      strokeColor: "#333333"
    },
    "Line": {
      strokeWidth: 3,
      strokeOpacity: 1,
      strokeColor: "#666666",
      strokeDashstyle: "dash"
    },
    "Polygon": {
      strokeWidth: 2,
      strokeOpacity: 1,
      strokeColor: "#666666",
      fillColor: "white",
      fillOpacity: 0.3
    }
};

var styleMap = new OpenLayers.StyleMap({
    "default": new OpenLayers.Rule({symbolizer: sketchSymbolizers})
});

function handleMeasure(event)
{
  if (event.order==1) // LINEAR
  {
      var mydiv=document.getElementById("distance");
      mydiv.style.display="inline";
      mydiv.innerHTML=event.measure.toFixed(3) + " " + event.units;
  }
  else // POLYGON
  {
      var area = event.measure.toFixed(3) + " " + event.units;
      var a = map.getControlsByClass('OpenLayers.Control.Measure');
      var ctrl = a[0];
      var length = (ctrl.getBestLength(event.geometry)[0]).toFixed(3) + " " + ctrl.getBestLength(event.geometry)[1];
  }
}

function hideDistance(event) {
  var mydiv=document.getElementById("distance");
  mydiv.style.display="none";
  mydiv.innerHTML="";
}


function init() {
    var distanceDiv = document.createElement("div");
    distanceDiv.id = "distance";
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(distanceDiv);
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
//    bel = new OpenLayers.Layer.OSM("Беларуская", "http://tile.latlon.org/tiles/${z}/${x}/${y}.png", {isBaseLayer: true,  type: 'png', displayOutsideMaxExtent: true, transitionEffect: "resize"});
    br = new OpenLayers.Layer.OSM("Belroad", "http://tile.latlon.org/tiles/${z}/${x}/${y}.png", {isBaseLayer: true,  type: 'png', displayOutsideMaxExtent: true, transitionEffect: "resize"});
    stranger = new OpenLayers.Layer.OSM("Чепецк.net", "http://tile.latlon.org/stranger/${z}/${x}/${y}.png", {isBaseLayer: true,  type: 'png', displayOutsideMaxExtent: true, transitionEffect: "resize"});
    layerGenshtab = new OpenLayers.Layer.WMS("Genshtab 1 km", "http://ms.latlon.org/ms", {layers: "GS-100k-N-34,GS-100k-N-35,GS-100k-N-36"}, {projection: new OpenLayers.Projection("EPSG:3857")});
    markers = new OpenLayers.Layer.Markers("Markers");

    map.addLayers([br, stranger, mapnik, layerGenshtab, markers]);

    var MLinearCtrlOptions =
    {
        title: 'линейка',
        displayUnits: 'm',
        eventListeners:
        {
          'measure': handleMeasure,
          'measurepartial': handleMeasure,
          'deactivate': hideDistance
        },
        handlerOptions:
        {
          persist: true,
          layerOptions: {styleMap: styleMap}
        },
        geodesic: true
    };

    var tb = new OpenLayers.Control.Panel(
            {displayClass: 'olControlEditingToolbar'}
    );

    tb.addControls([
        new OpenLayers.Control.Measure(OpenLayers.Handler.Path, MLinearCtrlOptions),
        new OpenLayers.Control.Navigation()
    ]);
    map.addControl(tb);
    tb.controls[1].activate();

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
}



