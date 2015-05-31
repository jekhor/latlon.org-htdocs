<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
      "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <title>LatLon.org &mdash; Bike stands map</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <link rel="stylesheet" href="/css/style.css" type="text/css" />
        <link rel="stylesheet" href="/css/global.css" type="text/css" />

        <script src="http://www.openlayers.org/api/2.10/OpenLayers.js" type="text/javascript"></script>
        <script type="text/javascript" src="/js/openstreetbugs.js"></script>
        <script src="/js/lib.js" type="text/javascript"></script>
        <script src="/js/click.js" type="text/javascript"></script>
        <script src="cops.js" type="text/javascript"></script>
    </head>
    <body onload="init()">
        <?include ("../top.ng.php"); ?>
        <!-- div id="sorry" class="hidden">New bumps can be added on zoom level 17 or greater<br/>More info can be found <a href='http://blog.latlon.org/2010/11/16/otmetki-o-lezhachikh-policejjskikh-v-osm/'>here</a></div -->
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
<!-- Piwik --> 
<script type="text/javascript">
var pkBaseURL = (("https:" == document.location.protocol) ? "https://openstreetmap.by/piwik/" : "http://openstreetmap.by/piwik/");
document.write(unescape("%3Cscript src='" + pkBaseURL + "piwik.js' type='text/javascript'%3E%3C/script%3E"));
</script><script type="text/javascript">
try {
var piwikTracker = Piwik.getTracker(pkBaseURL + "piwik.php", 2);
piwikTracker.trackPageView();
piwikTracker.enableLinkTracking();
} catch( err ) {}
</script><noscript><p><img src="http://openstreetmap.by/piwik/piwik.php?idsite=2" style="border:0" alt="" /></p></noscript>
<!-- End Piwik Tracking Code -->
    </body>
</html>
