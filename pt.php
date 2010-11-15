

<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>LatLon.org</title>
    <link rel="stylesheet" href="../theme/default/style.css" type="text/css" />
    <link rel="stylesheet" href="style.css" type="text/css" />
    <script src="http://www.openlayers.org/api/OpenLayers.js"></script>
    <script type="text/javascript">

        // make map available for easy debugging
        var map;

        // avoid pink tiles
        OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
        OpenLayers.Util.onImageLoadErrorColor = "transparent";

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

function init (){
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
          new OpenLayers.Control.LayerSwitcher(), 
          new OpenLayers.Control.PanZoomBar(), 
          new OpenLayers.Control.ScaleLine(), 
          new OpenLayers.Control.MousePosition(), 
          new OpenLayers.Control.Permalink(), 
          new OpenLayers.Control.Permalink('editlink', 'http://openstreetmap.org/edit'), 

new OpenLayers.Control.Permalink('mini', 'http://latlon.org/'),
new OpenLayers.Control.Permalink('maxi', 'http://latlon.org/maxi'),
          new OpenLayers.Control.KeyboardDefaults()]

            };
            map = new OpenLayers.Map('map', options);

            // create OSM layer
            var mapnik = new OpenLayers.Layer.OSM();
       var bel = new OpenLayers.Layer.TMS("Беларуская", "http://d.tile.latlon.org/tiles/", {   isBaseLayer: true,  type: 'png', getURL: osmt_getTileURL, displayOutsideMaxExtent: true, transitionEffect: 'resize' });
      var pt = new OpenLayers.Layer.TMS("Public Transport", "http://tile.latlon.org/pt/", {   isBaseLayer: false,  type: 'png', getURL: osmt_getTileURL, displayOutsideMaxExtent: true, visibility: true });

            map.addLayers([mapnik,bel,pt]);
           
            if (!map.getCenter()) {var lonlat = new OpenLayers.LonLat(27.62011,53.85267);lonlat.transform(map.displayProjection,map.projection) ; map.setCenter(lonlat, 10);};
            map.panTo(lonlat);}</script>



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



