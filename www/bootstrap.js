define(function(require) {
    "use strict"
// Note: following modules can be assumed preloaded by the entire app
    var riot  = require("riot")
    var route = require("vendor/riot-route")

    if (!window.global) {
        window.global = window;
    }
    try {
        require(["logic/App"], function(App) {
            global.App = App;
            global.app = new App();
        });
//        var tag = riot.mount(d, 'example-1')[0];
    } catch(e) {
        console.log("App error:" + e.toString());
//        console.log( "Mount failed, " + e.toString());
    }
})
