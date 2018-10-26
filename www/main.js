define(function(require) {
    var riot = require("vendor/riot");
    var route = require("vendor/riot-route");
    var ex1 = require("riot-tag!example-1")

    window.riot = riot;
    window.route = route;
    
    var d = document.createElement("div");
    document.body.appendChild(d);
    var tag = riot.mount(d, 'example-1')[0]

    debugger;
})