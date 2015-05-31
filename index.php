<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
      "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <title>LatLon.org</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <link rel="stylesheet" href="/css/style.css" type="text/css" />
        <link rel="stylesheet" href="/css/global.css" type="text/css" />

        <script src="http://www.openlayers.org/api/2.11/OpenLayers.js" type="text/javascript"></script>
        <script src="/js/lib.js" type="text/javascript"></script>
        <script src="/js/mini.js" type="text/javascript"></script>
    </head>
    <body onload="init()">
        <?include ("top.ng.php"); ?>
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
