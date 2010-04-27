

<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>LatLon.org</title>
    <link rel="stylesheet" href="../theme/default/style.css" type="text/css" />
    <link rel="stylesheet" href="style.css" type="text/css" />
    <style type="text/css">
        .olControlAttribution { bottom: 0px!important }
        #map {
            height: 512px;
        }
    </style>

    
    <script src="http://api.maps.yahoo.com/ajaxymap?v=3.0&appid=euzuro-openlayers"></script>
    <script src="http://www.openlayers.org/api/OpenLayers.js"></script>
    <script type="text/javascript">

        // make map available for easy debugging
        var map,vector,wkt;
        // fix for opera
        //document.getElementById('map').innerText = "";
        // avoid pink tiles
        OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
        OpenLayers.Util.onImageLoadErrorColor = "transparent";

        function osm_getTileURL(bounds)
    {
      var res = this.map.getResolution();
      var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
      var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
      var z = this.map.getZoom();
      var limit = Math.pow(2, z);

      if (y < 0 || y >= limit)
      {
        return OpenLayers.Util.getImagesLocation() + "404.png";
      }
      else
      {
        x = ((x % limit) + limit) % limit;
        return this.url + "x=" + x + "&y=" + y + "&z=" + z;
      }
    }
        function osmt_getTileURL(bounds)
    {
      var res = this.map.getResolution();
      var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
      var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
      var z = this.map.getZoom();
      var limit = Math.pow(2, z);

      if (y < 0 || y >= limit)
      {
        return OpenLayers.Util.getImagesLocation() + "404.png";
      }
      else
      {
        x = ((x % limit) + limit) % limit;
        return this.url + z + "/" + x + "/" + y+".png";
      }
    }
        function osmn_getTileURL(bounds)  {
      var res = this.map.getResolution();
      var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
      var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
      var z = this.map.getZoom();
      var limit = Math.pow(2, z);

      if (y < 0 || y >= limit)
      {        return OpenLayers.Util.getImagesLocation() + "404.png";    }
      else
      {  x = ((x % limit) + limit) % limit;
        function zAlignedStr(az,bz){return((new Array(bz+1)).join("0").substr(0,bz-String(az).length)+String(az))};
       return this.url + zAlignedStr(x,8)+","+zAlignedStr(limit-y-1,8)+","+zAlignedStr(z,2);
        //return this.url + z + "/" + x + "/" + y+".png";
      }
    }
function init (){











    /**
     * Method: update
     * Update the size of the bars, and the labels they contain.
     */
    OpenLayers.Control.ScaleLine.prototype.update = function() {
        var res = this.map.getResolution();
        if (!res) {
            return;
        }

        var curMapUnits = this.map.getUnits();
        var inches = OpenLayers.INCHES_PER_UNIT;
       // scale maxSizeData by cos(lat) if possible
                     var center = this.map.getCenter();
                     if (center && this.displayProjection && this.displayProjection.projCode == "EPSG:4326") {
                        var lat = center.lat;
                         var lon = center.lon;

                         var mapPosition = OpenLayers.Projection.transform(
                               { x: lon, y: lat },
                               this.map.getProjectionObject(),
                               this.displayProjection);

                         lon = mapPosition.x;
                         lat = mapPosition.y;

                         coslat = Math.cos(lat * Math.PI / 180.0);

                        // clamp coslat to stop the resolution getting too small near the poles
                         if (coslat < 0.01) {
                             coslat = 0.01;
                         }

                         res *= coslat;
                     }

        // convert maxWidth to map units
        var maxSizeData = this.maxWidth * res * inches[curMapUnits];

        // decide whether to use large or small scale units
        var topUnits;
        var bottomUnits;
        if(maxSizeData > 100000) {
            topUnits = this.topOutUnits;
            bottomUnits = this.bottomOutUnits;
        } else {
            topUnits = this.topInUnits;
            bottomUnits = this.bottomInUnits;
        }

        // and to map units units
        var topMax = maxSizeData / inches[topUnits];
        var bottomMax = maxSizeData / inches[bottomUnits];

        // now trim this down to useful block length
        var topRounded = this.getBarLen(topMax);
        var bottomRounded = this.getBarLen(bottomMax);

        // and back to display units
        topMax = topRounded / inches[curMapUnits] * inches[topUnits];
        bottomMax = bottomRounded / inches[curMapUnits] * inches[bottomUnits];

        // and to pixel units
        var topPx = topMax / res;
        var bottomPx = bottomMax / res;

        // now set the pixel widths
        // and the values inside them

        if (this.eBottom.style.visibility == "visible"){
            this.eBottom.style.width = Math.round(bottomPx) + "px";
            this.eBottom.innerHTML = bottomRounded + " " + bottomUnits ;
        }

        if (this.eTop.style.visibility == "visible"){
            this.eTop.style.width = Math.round(topPx) + "px";
            this.eTop.innerHTML = topRounded + " " + topUnits;
        }

    };




            var options = {
                projection: new OpenLayers.Projection("EPSG:900913"),
                displayProjection: new OpenLayers.Projection("EPSG:4326"),
                units: "m",
                numZoomLevels: 18,
                maxResolution: 156543.0339,
                maxExtent: new OpenLayers.Bounds(-20037508, -20037508,
                                                 20037508, 20037508.34),
		controls: [new OpenLayers.Control.MouseDefaults(), new OpenLayers.Control.PanZoomBar(), new OpenLayers.Control.ScaleLine(), new OpenLayers.Control.MousePosition(), new OpenLayers.Control.Permalink(),

new OpenLayers.Control.Permalink('editlink', 'http://openstreetmap.org/edit'),
new OpenLayers.Control.Permalink('mini', 'http://latlon.org/'),
new OpenLayers.Control.Permalink('maxi', 'http://latlon.org/maxi'),
new OpenLayers.Control.Permalink('transport', 'http://latlon.org/pt'),
new OpenLayers.Control.Permalink('sketchlink', 'http://latlon.org/sketch'),
 ]

            };
            map = new OpenLayers.Map('map', options);

    var road = new OpenLayers.Layer.TMS("Mapsurfer Road", "http://tiles1.mapsurfer.net/tms_r.ashx?", {  numZoomLevels: 19, isBaseLayer: true,  type: 'png', getURL: osm_getTileURL, displayOutsideMaxExtent: true });
            // create Yahoo layer
            var yahoosat = new OpenLayers.Layer.Yahoo(
                "Yahoo Satellite",
                {'type': YAHOO_MAP_SAT, 'sphericalMercator': true}
            );

            // create OSM layer
            var mapnik = new OpenLayers.Layer.OSM();
            var bel = new OpenLayers.Layer.TMS("Беларуская", "http://d.tile.latlon.org/tiles/", {   numZoomLevels: 18, isBaseLayer: true,  type: 'png', getURL: osmt_getTileURL, displayOutsideMaxExtent: true });
            var yasat = new OpenLayers.Layer.TMS("yandex.ru retiling", "http://wms.latlon.org/?request=GetTile&layers=yasat&", {  numZoomLevels: 19,  isBaseLayer: true,  type: 'png', getURL: osm_getTileURL, displayOutsideMaxExtent: true });

            var gshtab = new OpenLayers.Layer.TMS("BY Genshtab 100k", "http://wms.latlon.org/?request=GetTile&layers=gshtab&", {  numZoomLevels: 19,  isBaseLayer: true,  type: 'png', getURL: osm_getTileURL, displayOutsideMaxExtent: true });
            var irs = new OpenLayers.Layer.TMS("kosmosnimki.ru IRS", "http://wms.latlon.org/?request=GetTile&layers=irs&", {  numZoomLevels: 16,  isBaseLayer: true,  type: 'png', getURL: osm_getTileURL, displayOutsideMaxExtent: true });
            var hyb = new OpenLayers.Layer.TMS("Mapsurfer OSM Hybrid", "http://tiles3.mapsurfer.net/tms_h.ashx?", {  numZoomLevels: 19,  isBaseLayer: false,  type: 'png', getURL: osm_getTileURL, displayOutsideMaxExtent: true, visibility: false });
            var pt = new OpenLayers.Layer.TMS("Public Transport", "http://tile.latlon.org/pt/", {  numZoomLevels: 18,  isBaseLayer: false,  type: 'png', getURL: osmt_getTileURL, displayOutsideMaxExtent: true, visibility: true });
            //var opnv = new OpenLayers.Layer.TMS("öpnvkarte.de", "http://tile.xn--pnvkarte-m4a.de/tilegen/", {   isBaseLayer: true,  type: 'png', getURL: osmt_getTileURL, displayOutsideMaxExtent: true});
            var opnv = new OpenLayers.Layer.OSM("&Ouml;pnv Deutschland", "http://tile.xn--pnvkarte-m4a.de/tilegen/${z}/${x}/${y}.png", {numZoomLevels: 19,displayInLayerSwitcher:true,buffer:0});












            // create a vector layer for drawing
            vector = new OpenLayers.Layer.Vector("Editable Vectors");
            
            map.addLayers([mapnik,  yasat, irs, yahoosat, hyb, vector]);
            var ls = new OpenLayers.Control.LayerSwitcher();
            map.addControl(ls);
            ls.maximizeControl();

            //map.addControl(new OpenLayers.Control.LayerSwitcher());
            //map.addControl(new OpenLayers.Control.PanZoomBar());
wkt = new OpenLayers.Format.WKT( {
                        'internalProjection': new OpenLayers.Projection("EPSG:900913"),
                         'externalProjection': new OpenLayers.Projection("EPSG:4326")
                                  });


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
           var mystyle=new OpenLayers.Style();
           mystyle.addRules([
                new OpenLayers.Rule({symbolizer: sketchSymbolizers})
            ]);
           var styleMap=new OpenLayers.StyleMap({"default": mystyle});
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
               }
           };

    edittb =new OpenLayers.Control.EditingToolbar(vector);


           MeasureLinearCtrl = new OpenLayers.Control.Measure ( OpenLayers.Handler.Path, MLinearCtrlOptions );
           MeasureLinearCtrl.geodesic=true;
edittb.addControls([MeasureLinearCtrl]);
            map.addControl(edittb);
           // map.addControl(new OpenLayers.Control.Permalink());
           // map.addControl(new OpenLayers.Control.MousePosition());
            if (!map.getCenter()) {var lonlat = new OpenLayers.LonLat(27.62011,53.85267);lonlat.transform(map.displayProjection,map.projection) ; map.setCenter(lonlat, 7);}        ;
            map.panTo(lonlat);


 };

        function handleMeasure(event)
        {
            if(event.order==1) // LINEAR
            {
                var mydiv=document.getElementById("distance");
                mydiv.style.display="inline";
                mydiv.innerHTML=event.measure.toFixed(3) + " " + event.units;
                //displayMeasr (event.measure.toFixed(3) + " " + event.units, "");
            }
            else // POLYGON
            {
                var area = event.measure.toFixed(3) + " " + event.units;
                var a = map.getControlsByClass('OpenLayers.Control.Measure');
                var ctrl = a[0];
                var length = (ctrl.getBestLength(event.geometry)[0]).toFixed(3) + " " + ctrl.getBestLength(event.geometry)[1];
                //displayMeasr (length, area);
            }
        }

        function hideDistance(event) {
            var mydiv=document.getElementById("distance");
            mydiv.style.display="none";
            mydiv.innerHTML="";
        }
 


function getSketchUrl(lay, wid){
if (lay == undefined) {lay = "osm" }
if (wid == undefined) {wid = "300" }

a = wkt.write(vector.features);
a=a.substr(19,a.length-20);
a = escape(a);
a = a.replace('((','(');
if (a.length > 0){a = "&wkt="+a;};
return 'http://wms.latlon.org/?format=image/png&layers='+lay+'&width='+wid+'&bbox='+getMapExtent().left+','+getMapExtent().bottom+','+getMapExtent().right+','+getMapExtent().top+""+a;
};

function getLayers () {
lays = new Array("osm", "osm-be", "gshtab","yhsat","irs");
a = "";
for (i in lays){
if (document.getElementById(lays[i]).checked) {if (a != "") {a = a+",";}; a = a + lays[i];};
};
return a;
};



    </script>
<script src="map.js" type="text/javascript"></script>
  </head>
  <body onload="init()">
<table cellpadding=0 cellspacing=0 border=0 width=100% height=100%>

  <tr>
    <td height=30 colspan=2 width=100%><?include ("top.inc.php"); ?></td>
  <tr>


<td width="300" valign="top">

<form id="wms_params" action="#">
<input type="checkbox" id="osm" checked> <label for="osm">OpenStreetMap</label><br />
<input type="hidden" id="gshtab"> <!--label for="gshtab">Генштаб</label><br /-->
<input type="checkbox" id="osm-be"> <label for="osm-be">Беларускамоўны OpenStreetMap</label><br />
<input type="checkbox" id="yhsat"> <label for="irs">Yahoo! Satellite</label><br />
<input type="checkbox" id="irs"> <label for="irs">IRS</label><br />
Width:
        <SELECT id="wms-width" SIZE=1>
                <OPTION value="300" selected>  300
                <OPTION value="450">  450
                <OPTION value="600">  600                
        </SELECT>
</form>
<input type="checkbox" id="noresize"> <label for="noresize">No resize</label><br />

<!--button onclick="alert(document.getElementById('wms-width').value);">Test</button-->
<button onclick="force=''; wth=' width=\''+document.getElementById('wms-width').value+'\'';
if(document.getElementById('noresize').checked) {force = '&force=noresize';wth=''};
document.getElementById('map_preview').innerHTML = 'Preview (scaled 300px):<br><img src='+getSketchUrl(getLayers(),300)+' width=300><br>Forum code: <br><TEXTAREA rows=6 cols=30>[img]'+getSketchUrl(getLayers(),document.getElementById('wms-width').value)+force +'[/img]</TEXTAREA><br>HTML Code:<br><TEXTAREA rows=6 cols=30><img src=\''+getSketchUrl(getLayers(),document.getElementById('wms-width').value)+force + '\'' + wth + '></TEXTAREA>'">Get Image</button>


<div id="map_preview"><img src="http://www.openlayers.org/api/img/zoom-plus-mini.png" width=300 height=1 /></div>
</td>
<td style="width:80%; height:100%; overflow:hidden;">
<table width=100% height=100% cellspacing=1 cellpadding=0 border=0><td><div id="map" style="width:100%; height:100%; overflow:hidden;" width="100%"><div id="distance" style="        font-size: 20px;
        font-color: red;
        right : 20px;
        bottom: 50px;
        position: absolute;
        z-index: 1000;
        display: none;"></div> </div></td></table>

</td>

</table>


<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
  var pageTracker = _gat._getTracker("UA-3696753-3");
  pageTracker._trackPageview();
  } catch(err) {}</script>
  </body>
</html>



