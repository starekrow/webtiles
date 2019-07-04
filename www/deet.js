define(function(require, exports, module) {
    'use strict';
    var DEET = require("vendor/DEET");

    var masterConfig = (module.config && module.config()) || {};

    var deet_loader = {
        version: "0.0.1",

        tagparser: /<([a-z][a-z0-9]*-[-a-z0-9]+)[^>]*>/g,

        loaded: {},

        load: function (name, req, onLoad, config)
        {
            deet_loader.loaded[name] = true;
            require(["text!" + name], function(payload) {
                let res = null;
                try {
                    res = DEET.parse(payload);
                } catch(e) {
                    console.log(e.toString());
                }
                onLoad(res);
            });
        },
    }
    return deet_loader;
});