define(function(require) {
    var riot  = require("riot")
    var route = require("vendor/riot-route")
    var ex1   = require("riot-tag!example-1")
    
    var d = document.createElement("div");
    document.body.appendChild(d);
    try {
        var tag = riot.mount(d, 'example-1')[0];
    } catch(e) {
        console.log( "Mount failed, " + e.toString());
    }
})
