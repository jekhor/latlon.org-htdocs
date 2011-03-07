

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

    
    <script src='http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAA4RJuqz7pcsqYdE-UgSNCLhTDHWCCDaHhpyCQHbdxzVfRMRQXlBSD1sB3MWEn0zedSC-AoQn7vamynw'></script>
    <script src="http://api.maps.yahoo.com/ajaxymap?v=3.0&appid=euzuro-openlayers"></script>

    <script src="http://www.openlayers.org/api/OpenLayers.js"></script>
    <script type="text/javascript">

        // make map available for easy debugging
        var map;

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
            var options = {
                projection: new OpenLayers.Projection("EPSG:900913"),
                displayProjection: new OpenLayers.Projection("EPSG:4326"),
                units: "m",
                numZoomLevels: 18,
                maxResolution: 156543.0339,
                maxExtent: new OpenLayers.Bounds(-20037508, -20037508,
                                                 20037508, 20037508.34),
		controls: [new OpenLayers.Control.MouseDefaults(), new OpenLayers.Control.PanZoomBar(), new OpenLayers.Control.ScaleLine(), new OpenLayers.Control.MousePosition(), new OpenLayers.Control.Permalink(), new OpenLayers.Control.KeyboardDefaults(),

new OpenLayers.Control.Permalink('editlink', 'http://openstreetmap.org/edit'),
new OpenLayers.Control.Permalink('mini', 'http://latlon.org/'),
new OpenLayers.Control.Permalink('maxi', 'http://latlon.org/maxi'),
new OpenLayers.Control.Permalink('transport', 'http://latlon.org/pt'),
new OpenLayers.Control.Permalink('sketchlink', 'http://latlon.org/sketch'),

 ]

            };
            map = new OpenLayers.Map('map', options);

            // create Google Mercator layers
            var gmap = new OpenLayers.Layer.Google(
                "Google Streets",
                {'sphericalMercator': true}
            );
            var gsat = new OpenLayers.Layer.Google(
                "Google Satellite",
                {type: G_SATELLITE_MAP, 'sphericalMercator': true, numZoomLevels: 22}
            );
            var ghyb = new OpenLayers.Layer.Google(
                "Google Hybrid",
                {type: G_HYBRID_MAP, 'sphericalMercator': true}
            );

    var road = new OpenLayers.Layer.TMS("MapSurfer.NET Road", "http://tiles1.mapsurfer.net/tms_r.ashx?", {  numZoomLevels: 19, isBaseLayer: true,  type: 'png', getURL: osm_getTileURL, displayOutsideMaxExtent: true });
            // create Yahoo layer
            var yahoosat = new OpenLayers.Layer.Yahoo(
                "Yahoo Satellite",
                {'type': YAHOO_MAP_SAT, 'sphericalMercator': true}
            );

            // create OSM layer
            var mapnik = new OpenLayers.Layer.OSM();
            var bel = new OpenLayers.Layer.TMS("Беларуская", "http://tile.latlon.org/tiles/", {   numZoomLevels: 18, isBaseLayer: true,  type: 'png', getURL: osmt_getTileURL, displayOutsideMaxExtent: true });
            var yasat = new OpenLayers.Layer.TMS("yandex.ru retiling", "http://wms.latlon.org/?request=GetTile&layers=yasat&", {  numZoomLevels: 19,  isBaseLayer: true,  type: 'png', getURL: osm_getTileURL, displayOutsideMaxExtent: true });

            //var gshtab = new OpenLayers.Layer.TMS("BY Genshtab 100k", "http://wms.play.latlon.org/?request=GetTile&layers=gshtab&", {  numZoomLevels: 19,  isBaseLayer: true,  type: 'png', getURL: osm_getTileURL, displayOutsideMaxExtent: true });
            var irs = new OpenLayers.Layer.TMS("kosmosnimki.ru IRS retiling + yahoo", "http://wms.latlon.org/?request=GetTile&layers=yhsat,irs&force=noblend&", {  numZoomLevels: 16,  isBaseLayer: true,  type: 'png', getURL: osm_getTileURL, displayOutsideMaxExtent: true });
            var spot_by = new OpenLayers.Layer.TMS("kosmosnimki.ru SPOT (Belarus)", "http://wms.latlon.org/?request=GetTile&layers=spot&", {  numZoomLevels: 17,  isBaseLayer: true,  type: 'png', getURL: osm_getTileURL, displayOutsideMaxExtent: true });
	    var layerGenshtab = new OpenLayers.Layer.TMS("Genshtab 1 km", "http://wms.latlon.org/?request=GetTile&layers=gshtab&", {  numZoomLevels: 18,  isBaseLayer: true,  type: 'png', getURL: osm_getTileURL, displayOutsideMaxExtent: true, visibility: true });
            var hyb = new OpenLayers.Layer.TMS("MapSurfer.NET OSM Hybrid", "http://tiles3.mapsurfer.net/tms_h.ashx?", {  numZoomLevels: 19,  isBaseLayer: false,  type: 'png', getURL: osm_getTileURL, displayOutsideMaxExtent: true, visibility: true });
            var pt = new OpenLayers.Layer.TMS("Public Transport", "http://tile.latlon.org/pt/", {  numZoomLevels: 18,  isBaseLayer: false,  type: 'png', getURL: osmt_getTileURL, displayOutsideMaxExtent: true, visibility: true });
            var tc = new OpenLayers.Layer.TMS("Traffic Calming", "http://osmosnimki.ru/cops/", {  numZoomLevels: 19,  isBaseLayer: false,  type: 'png', getURL: osmt_getTileURL, displayOutsideMaxExtent: true, visibility: false });
            var belsn = new OpenLayers.Layer.OSM("Беларуская (kosmosnimki)", "http://osmosnimki.ru/kosmo-be/${z}/${x}/${y}.png", {isBaseLayer: true,  type: 'png', displayOutsideMaxExtent: true, transitionEffect: "resize"});

            //var opnv = new OpenLayers.Layer.TMS("öpnvkarte.de", "http://tile.xn--pnvkarte-m4a.de/tilegen/", {   isBaseLayer: true,  type: 'png', getURL: osmt_getTileURL, displayOutsideMaxExtent: true});
            var opnv = new OpenLayers.Layer.OSM("&Ouml;pnv Deutschland", "http://tile.xn--pnvkarte-m4a.de/tilegen/${z}/${x}/${y}.png", {numZoomLevels: 19,displayInLayerSwitcher:true,buffer:0});
            var navdebug = new OpenLayers.Layer.OSM("Navigation Debug", "http://ec2-184-73-15-218.compute-1.amazonaws.com/6700/256/${z}/${x}/${y}.png", {numZoomLevels: 18,displayInLayerSwitcher:true,buffer:0});
//var navitel = new OpenLayers.Layer.OSM("Navitel", "http://tile.xn--pnvkarte-m4a.de/tilegen/${z}/${x}/${y}.png", {numZoomLevels: 19,displayInLayerSwitcher:false,buffer:0});
            var navitel = new OpenLayers.Layer.TMS("Navitel", "http://map.navitel.su/navitms.fcgi?t=", {  isBaseLayer: true,  type: 'png', getURL: osmn_getTileURL, displayOutsideMaxExtent: true});


            // create a vector layer for drawing
            //var vector = new OpenLayers.Layer.Vector("Editable Vectors");

            map.addLayers([gsat, yasat, irs, spot_by, bel, layerGenshtab, navitel, yahoosat, opnv, mapnik, gmap, ghyb, road, navdebug, pt, tc, belsn, hyb]);
            var ls = new OpenLayers.Control.LayerSwitcher();
            map.addControl(ls);
            ls.maximizeControl();

            //map.addControl(new OpenLayers.Control.LayerSwitcher());
            //map.addControl(new OpenLayers.Control.PanZoomBar());

           // map.addControl(new OpenLayers.Control.EditingToolbar(vector));
           // map.addControl(new OpenLayers.Control.Permalink());
           // map.addControl(new OpenLayers.Control.MousePosition());
            if (!map.getCenter()) {var lonlat = new OpenLayers.LonLat(27.62011,53.85267);lonlat.transform(map.displayProjection,map.projection) ; map.setCenter(lonlat, 7);}
            ;
            map.panTo(lonlat);

        }

    </script>
  </head>
  <body onload="init()">
<table cellpadding=0 cellspacing=0 border=0 width=100% height=100%>
  <tr>
    <td height=30><?include ("top.inc.php"); ?></td>
  <tr>
    <td><div id="map" style="width:100%; height:100%; overflow:hidden;"></div></td>
    
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



