var using_ie = (document.uniqueID && (!document.defaultView));

var width_correction;

if (using_ie) {
    width_correction = 2;
} else {
    width_correction = 0;
}

function foreach(arr, lambda) {
    for (var i = arr.length - 1; i >= 0; i--) {
        lambda(arr[i]);
    }
}

function stringmap(s, pairs) {
    for (var i = pairs.length - 1; i >= 0; i--) {
        s = s.replace(pairs[i][0], pairs[i][1]);
    }
    return s;
}

function getStyle(element, style) {
    element = $(element);
    style = style == 'float' ? 'cssFloat' : style.camelize();
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

    if (onclose) {
        onclose();
        onclose = null;
    }

    if (options.title) { $("sidebar_title").innerHTML = options.title; }
    if (options.content) { $("sidebar_content").innerHTML = options.content; }

    if (options.width) { $("sidebar").style.width = options.width; }
    else { $("sidebar").style.width = "30%"; }

    $("sidebar").style.display = "block";

    handleResize();

    onclose = options.onclose;
}

function closeSidebar() {
    $("sidebar").style.width = "0";
    $("sidebar").style.display = "none";

    handleResize();

    if (onclose) {
        onclose();
        onclose = null;
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

    map.setCenter(centre, zoom);
}

function getMapExtent() {
    return map.getExtent().clone().transform(map.getProjectionObject(), epsg4326);
}


