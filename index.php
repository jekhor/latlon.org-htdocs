<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
      "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <title>LatLon.org</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <link rel="stylesheet" href="/css/style.css" type="text/css" />
        <link rel="stylesheet" href="/css/global.css" type="text/css" />

        <script src="http://www.openlayers.org/api/OpenLayers.js" type="text/javascript"></script>
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
    <script type="text/javascript">
	// <![CDATA[
	var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
	document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
	// ]]>
    </script>
    <script type="text/javascript">
	// <![CDATA[
	try {
		var pageTracker = _gat._getTracker("UA-3696753-3");
		pageTracker._trackPageview();
	} catch(err) {}
	// ]]>
    </script>
</html>
