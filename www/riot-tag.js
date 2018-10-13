define(function(require, exports, module) {
    'use strict';

    var riot = require("riot");

    var masterConfig = (module.config && module.config()) || {};

    riot_tag = {
        version: "0.0.1",

        load: function (name, req, onLoad, config) {
            req(["text!tags/" + name + ".tag"], function(tagdef) {
                // find any custom tags used in this tag, define them
                // define the tag
                r = riot.mount(tagdef);
                onLoad( r );
            }, function(err) {
                // hmm, didn't load
                onLoad.error(err);
            });
         },
    }
    return riot_tag;
});

})