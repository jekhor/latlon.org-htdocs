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

<script src="http://www.openlayers.org/api/OpenLayers.js"></script>
<script src="http://www.openstreetmap.org/openlayers/OpenStreetMap.js"></script>

	<script type="text/javascript">
		var map;

		function init() {
			permalink = new OpenLayers.Control.Permalink();
			permalink.displayProjection = new OpenLayers.Projection("EPSG:4326");
			map = new OpenLayers.Map ("map", {
				controls:[
					new OpenLayers.Control.Navigation(),
					new OpenLayers.Control.PanZoomBar(),
					new OpenLayers.Control.LayerSwitcher(),
					new OpenLayers.Control.Attribution(),
					new OpenLayers.Control.Permalink()
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
			layerTilesAtHome = new OpenLayers.Layer.OSM.Osmarender("Osmarender");
			map.addLayer(layerTilesAtHome);
			layerCycleMap = new OpenLayers.Layer.OSM.CycleMap("CycleMap");
			map.addLayer(layerCycleMap);
			layerGenshtab = new OpenLayers.Layer.WMS("Genshtab 1 km", "http://ms.latlon.org/ms", {layers: "GS-100k-N-34,GS-100k-N-35,GS-100k-N-36"}, {projection: new OpenLayers.Projection("EPSG:3857")});
			map.addLayer(layerGenshtab);
//			layerMarkers = new OpenLayers.Layer.Markers("Markers");
//			map.addLayer(layerMarkers);
 
// Add the Layer with GPX Track
			var lgpx = new OpenLayers.Layer.GML("GPX track", "get_gpx.php?gpx_url=<?php echo urlencode($_GET["gpx_url"]) ?>", {
  format: OpenLayers.Format.GPX,
  style: {strokeColor: "red", strokeWidth: 5, strokeOpacity: 0.6},
  projection: new OpenLayers.Projection("EPSG:4326")
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
<form method="GET" action="show_gpx.php">
GPX file URL:
<input type="text" name="gpx_url" value="<? echo $_GET['gpx_url']?>" size="30" />

<input type="submit" value="Go"/>
</p>
</form>
	<!-- define a DIV into which the map will appear. Make it take up the whole window -->
	<div style="width:90%; height:90%" id="map"></div>
</body>
</html>
