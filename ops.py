#!/usr/bin/python

import sys
reload(sys)
sys.setdefaultencoding("utf-8")

import re

import cgi
form = cgi.FieldStorage()
maponly = "maponly" in form;
js = (not maponly) and ("js" in form);
if "id" not in form:
    print "error: <tt>id</tt> parameter expected"
    exit
else:
    id = str(int(form["id"].value))

import json

if not js:
    print "Content-Type: text/html; charset=UTF-8"     # HTML is following
    print                               # blank line, end of headers
    txt = """
<!doctype html>
<html>
<head>
    <title>OPS viewer</title>
    <meta charset=\"UTF-8\" />

    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">

    <link rel=\"stylesheet\" href=\"http://cdn.leafletjs.com/leaflet-0.6.4/leaflet.css\" />
    <!--[if lte IE 8]><link rel=\"stylesheet\" href=\"http://cdn.leafletjs.com/leaflet-0.6.4/leaflet.ie.css\" /><![endif]-->
    <style type=\"text/css\">
     @import \"http://www.mulica.sk/wp-content/themes/mystique/style.css\";
     @import \"http://www.mulica.sk/index.php/tyzden-mobility-a-cyklojazda-su-opat-predo-dvermi/?mystique=css\";
"""
    if maponly:
        txt += """
    body {
        width: 400px !important;
        height: 400px !important;
    }
    """
    else:
        txt += """

     body {
        width: 600px !important;
     }

     /*
     #pics img {
        display: block;
     }
     */
    """
    txt += """
    </style>
    <script src="http://cdn.leafletjs.com/leaflet-0.6.4/leaflet.js"></script>
</head>
<body>
"""
else:
    print "Content-Type: application/x-javascript; charset=UTF-8"
    print
    txt = ""

import urllib2
try: 
 data = json.loads(urllib2.urlopen("http://api.odkazprestarostu.sk/api/podnet?id=" + id).read())

 if not maponly:
     txt += "<h2>%s</h2>" % data["nadpis"]
     txt += "<p>%s</p>" % data["popis"]
     txt += "<p><em>%s, %s, %s</em></p>" % (data["ulica"], data["mestska_cast_slovom"], data["zodpovednost"])
     txt += "<div>"
     txt += "<link rel='image_src' href='%s' />" % data["images"][0]
     txt += "<a class='opspiclink' rel='ops' href='%s'><img style='max-height: 450px; width: auto;' src='%s'/></a><div id='pics'>" % (re.sub(r'image/w[0-9]*/', r'image/w1920/', data["images"][0]), re.sub(r'image/w[0-9]*/', r'image/w600/', data["images"][0]))
     for image in data["images"][1:]:
        txt += "<a class='opspiclink' rel='ops' href='%s'>" % re.sub(r'image/w[0-9]*/', r'image/w1920/', image)
        txt += "<img width='200' src='%s'/>" % re.sub(r'image/w[0-9]*/', r'image/w200/', image)
        txt += "</a>"
     txt += "</div></div>"
 if js:
    txt = "var html = \"" + txt.replace('\r', '\\r').replace('\n', '\\n').replace('"', '\\"')
    txt += "\";"
    txt += """
document.getElementById('opscontent').innerHTML = html; jQuery('.opspiclink').fancybox({
  });

"""
 else:
    txt += '<div id="map" style="width: 400px; height: 400px"></div>'
    txt += "<script>"
    txt += """
if (typeof(jQuery) != "undefined") {
    jQuery("div.opspage").append("<div id='map' style='width: 400px; height: 400px'></div>");
}
var map = L.map('map').setView([%s, %s], 17);
var osm;

(osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Mapov&#253; podklad &copy; <a href="http://www.openstreetmap.org/">OpenStreetMap</a> prispievatelia, ODbL 1.0'
}));

osm.addTo(map);
L.marker([%s, %s]).addTo(map);
""" % (data["lat"], data["long"], data["lat"], data["long"])
    txt += "</script>"
 #txt += urllib2.urlopen("http://hdyc.neis-one.org/user/"+zi).read()
except:

 pass

print txt

