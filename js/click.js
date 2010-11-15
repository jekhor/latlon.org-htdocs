OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {

    initialize: function() {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
    },

    destroy: function() {
        if (this.handler)
            this.handler.destroy();
        this.handler = null;

        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },

    draw: function() {
        handlerOptions = {
        'single': true,
        'double': false,
        'pixelTolerance': 0,
        'stopSingle': false,
        'stopDouble': false
        };

        this.handler = new OpenLayers.Handler.Click(this, {'click': this.click}, handlerOptions);
    },

    click: function(ev) {
        alert(0);
    },

    CLASS_NAME: "OpenLayers.Control.Click"
});

