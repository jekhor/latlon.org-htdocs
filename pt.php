<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
      "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <title>LatLon.org</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <link rel="stylesheet" href="/css/style.css" type="text/css" />
        <link rel="stylesheet" href="/css/global.css" type="text/css" />

        <script src="http://www.openlayers.org/api/2.10/OpenLayers.js" type="text/javascript"></script>
        <script src="/js/lib.js" type="text/javascript"></script>
        <script src="/js/pt.js" type="text/javascript"></script>
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
