var using_ie = (document.uniqueID && (!document.defaultView));

var width_correction;

var onsidebarclose;

if (using_ie) {
    width_correction = 2;
} else {
    width_correction = 0;
}

/*
function tailcall(fn, args) {
  setTimeout(function() {fn.apply(this, args)}, 0);
};
*/

function tailthis() {
  var fn = tail.caller;
  var args = arguments;
  setTimeout(function() {fn.apply(this, args)}, 0);
};

function foreach(arr, lambda) {
    var l = arr.length;
    for (var i = 0; i < l; i++) {
        lambda(arr[i]);
    }
}

function stringmap(s, pairs) {
    var l = pairs.length;
    for (var i = 0; i < l; i++) {
        s = s.replace(pairs[i][0], pairs[i][1]);
    }
    return s;
}

function cond(predicate, i, e) {
    if (predicate) {
        return i;
    } else {
        return e;
    }
}

function scond(predicate, i, e) {
    if (predicate) {
        if (i) return i;
        else return "";
    } else {
        if (e) return e;
        else return "";
    }
}

function getStyle(element, style) {
    element = $(element);
    style = style == 'float' ? 'cssFloat' : OpenLayers.String.camelize(style);
    var value = element.style[style];
    if (!value || value == 'auto') {
        var css;
        if (document.defaultView && document.defaultView.getComputedStyle) {
            css = document.defaultView.getComputedStyle(element, null);
        } else {
            if (document.uniqueID && element.currentStyle) {
                css = element.currentStyle;
            }
        }
        value = css ? css[style] : null;
    }
    if (style == 'opacity') return value ? parseFloat(value) : 1.0;
    return value == 'auto' ? null : value;
}


function openSidebar(options) {
    options = options || {};

    if (onsidebarclose) {
        onsidebarclose();
        onsidebarclose = null;
    }

    if (options.title) { $("sidebar_title").innerHTML = options.title; }
    if (options.content) { $("sidebar_content").innerHTML = options.content; }

    $("sidebar").style.display = "block";

    //handleResize();

    onsidebarclose = options.onclose;
}

function closeSidebar() {
    //$("sidebar").style.width = "0";
    $("sidebar").style.display = "none";

    handleResize();

    if (onsidebarclose) {
        onsidebarclose();
        onsidebarclose = null;
    }
}

function updateSidebar(title, content) {
    $("sidebar_title").innerHTML = title;
    $("sidebar_content").innerHTML = content;
}

function handleResize() {
 
    var centre = map.getCenter();
    var zoom = map.getZoom();
    var sidebar_width = parseInt(getStyle($("sidebar"), "width").replace("px",""));

    if (sidebar_width > 0) {
        sidebar_width = sidebar_width + 5
    }

    var content = $("content");
    var contentheight = getStyle(content, "height")
    if (contentheight == null) contentheight = content.offsetHeight;
    var contentHeight = parseInt(contentheight);
    var diff = document.documentElement.clientHeight - content.offsetTop - contentHeight;
    contentHeight += diff;
    content.style.height = (contentHeight) + "px";
    content.style.width = document.documentElement.clientWidth - content.offsetLeft;

    //document.getElementById("map").style.left = (sidebar_width) + "px";
    //document.getElementById("map").style.width = (document.getElementById("content").offsetWidth - sidebar_width - width_correction) + "px";
    document.getElementById("map").style.height = (document.getElementById("content").offsetHeight - 2) + "px";
    document.getElementById("sidebar").style.height = (document.getElementById("content").offsetHeight - 2) + "px";

    map.updateSize();
    map.setCenter(centre, zoom);
}

function getMapExtent() {
    return map.getExtent().clone().transform(map.getProjectionObject(), epsg4326);
}

function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}
