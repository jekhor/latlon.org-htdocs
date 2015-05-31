#!/usr/bin/python

print "Content-Type: text/html"     # HTML is following
print                               # blank line, end of headers

import sys
reload(sys)
sys.setdefaultencoding("utf-8")

import cgi
form = cgi.FieldStorage()
if "user" not in form:
  print "Bad params"
  exit()
uuu = form["user"].value
import json
txt = "adddata(["

import urllib2
for i in uuu.split(","):
 try: 
  zi = i.replace(" ", "%20")
  data = json.loads(urllib2.urlopen("http://hdyc.neis-one.org/user/"+zi).read())

  txt += "[\""+i+"\",\""
  #txt += urllib2.urlopen("http://hdyc.neis-one.org/user/"+zi).read()
#  txt += ""
  txt +=  "<dd>Nodes: %s (#%s)</dd>"% (data[u"nodes"][u"lm"], data[u"nodes"][u"r"])
  txt +=  "<dd>Ways: %s (#%s)</dd>"% (data["ways"].get("lm", "xx"), data["ways"].get("r", "xx"))
  txt +=  "<dd>Relations: %s (#%s)</dd>"% (data["relations"].get("lm", "xx"), data["relations"].get("r", "xx"))
  txt += "\"],"
 except:
  txt += ' '
  txt += "\"],"

  pass
txt = txt[:-1]
txt += "]);"
print txt

