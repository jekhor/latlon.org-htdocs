<html>
<head>
<?php

if (is_null($_GET["gpx_url"]) || ($_GET["gpx_url"] == "")) {
?>
<title>Visualize a GPX track</title>
<? } else { ?>
<title>GPX track <?php echo $_GET["gpx_url"] ?></title>
<? } ?>

<?php
if (!is_null($_GET["gpx_url"]) && ($_GET["gpx_url"] != "")) {
?>

<script src="http://www.openlayers.org/api/2.12/OpenLayers.js"></script>
<script src="http://www.openstreetmap.org/openlayers/OpenStreetMap.js"></script>
<script src="proj4js/proj4js-compressed.js"></script>

	<script type="text/javascript">
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

		function init() {
			Proj4js.defs["EPSG:3857"]= "+title= Google Mercator EPSG:3857 +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
			permalink = new OpenLayers.Control.Permalink();
			permalink.displayProjection = new OpenLayers.Projection("EPSG:4326");
			map = new OpenLayers.Map ("map", {
				controls:[
					new OpenLayers.Control.Navigation(),
					new OpenLayers.Control.PanZoomBar(),
					new OpenLayers.Control.LayerSwitcher(),
					new OpenLayers.Control.Attribution(),
					permalink
					],

				maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
				maxResolution: 156543.0399,
				numZoomLevels: 19,
				units: 'm',
				projection: new OpenLayers.Projection("EPSG:900913"),
				displayProjection: new OpenLayers.Projection("EPSG:4326")
			} );

			layerMapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
			map.addLayer(layerMapnik);

			osm_be = new OpenLayers.Layer.OSM("Беларуская", "http://tile.latlon.org/tiles/${z}/${x}/${y}.png", {numZoomLevels: 19,displayInLayerSwitcher:true,buffer:0});
			map.addLayer(osm_be);

			layerGenshtab = new OpenLayers.Layer.WMS("Genshtab 1 km", "http://ms.latlon.org/ms", {layers: "GS-100k-N-34,GS-100k-N-35,GS-100k-N-36"}, {projection: new OpenLayers.Projection("EPSG:3857")});
//			layerGenshtab = new OpenLayers.Layer.TMS("Genshtab 1 km", "http://wms.latlon.org/?request=GetTile&layers=gshtab&", {  numZoomLevels: 18,  isBaseLayer: true,  type: 'png', getURL: osm_getTileURL, displayOutsideMaxExtent: true, visibility: true });
			map.addLayer(layerGenshtab);

//			layerMarkers = new OpenLayers.Layer.Markers("Markers");
//			map.addLayer(layerMarkers);

			var context = {
				pointLabel: function(feature) {
					return feature.attributes['name'] + " (" + feature.attributes['desc'] + ")";
				}
			};
			var gpxStyle = new OpenLayers.StyleMap({
				'default': new OpenLayers.Style({
					strokeColor: 'red',
					strokeWidth: 5,
					strokeOpacity: 0.6,
					pointRadius: 5,
					fillColor: 'red',
					label: "${pointLabel}",
					labelYOffset: 15,
					fontSize: "12px",
					fontColor: "#FF550000"

				}, {
					context: context
				})
			});
// Add the Layer with GPX Track
			var lgpx = new OpenLayers.Layer.Vector("GPX track", {
				projection: new OpenLayers.Projection("EPSG:4326"),
				strategies: [new OpenLayers.Strategy.Fixed()],
				protocol: new OpenLayers.Protocol.HTTP({
					url: "get_gpx.php?gpx_url=<?php echo urlencode($_GET["gpx_url"]) ?>",
					format: new OpenLayers.Format.GPX()
				}),
				styleMap: gpxStyle,
			});
			map.addLayer(lgpx);

//			var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
//			var lonLat = lgpx.getDataExtent().getCenterLonLat();
			if (!map.getCenter()) {
				lgpx.events.register('loadend', map, function(){this.zoomToExtent(lgpx.getDataExtent())});
				map.setCenter (null, null);
			}

//			var size = new OpenLayers.Size(21,25);
//			var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
//			var icon = new OpenLayers.Icon('http://www.openstreetmap.org/openlayers/img/marker.png',size,offset);
//			layerMarkers.addMarker(new OpenLayers.Marker(lonLat,icon));
		}
	</script>
</head>
<!-- body.onload is called once the page is loaded (call the 'init' function) -->
<body onload="init();">
<? } else { ?>
</head>
<body>
<? } ?>
<p>
<form method="GET" action="show_gpx">
GPX file URL:
<input type="text" name="gpx_url" value="<? echo $_GET['gpx_url']?>" size="30" />

<input type="submit" value="Go"/>
</p>
</form>
	<!-- define a DIV into which the map will appear. Make it take up the whole window -->
	<div style="width:90%; height:90%" id="map"></div>
<!-- Piwik -->
<script type="text/javascript">
  var _paq = _paq || [];
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="//stat.komzpa.net/";
    _paq.push(['setTrackerUrl', u+'piwik.php']);
    _paq.push(['setSiteId', 1]);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
  })();
</script>
<noscript><p><img src="//stat.komzpa.net/piwik.php?idsite=1" style="border:0;" alt="" /></p></noscript>
<!-- End Piwik Code -->
</body>
</html>
