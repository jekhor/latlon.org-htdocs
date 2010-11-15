<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
      "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <title>LatLon.org &mdash; Traffic calming map</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="stylesheet" href="style.css" type="text/css" />
        <link rel="stylesheet" href="/css/global.css" type="text/css" />

        <script src="http://www.openlayers.org/api/OpenLayers.js" type="text/javascript"></script>
        <script type="text/javascript" src="http://osm.cdauth.eu/map/openstreetbugs.js"></script>
        <script src="lib.js" type="text/javascript"></script>
        <script src="click.js" type="text/javascript"></script>
        <script src="cops.js" type="text/javascript"></script>
    </head>
    <body onload="init()">
        <?include ("../top.ng.php"); ?>
        <div id="sorry">New bumps can be added on zoom 17 or greater<br/>This site is still work-in-progress</div>
        <div id="content">
            <div id="sidebar" class="hidden">
              <div class="sidebar_title">
                <div id="sidebar_title">Sidebar</div>
                <a id="sidebar_close" href="#" onclick="return closeSidebar();">×</a>
              </div>
              <div id="sidebar_content">
                This is the sample content.
              </div>
            </div>
            <div id="map" class="smallmap" ></div>
        </div>
    </body>
</html>
