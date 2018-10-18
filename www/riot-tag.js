define(function(require, exports, module) {
    'use strict';

    var riot = require("riot");

    var masterConfig = (module.config && module.config()) || {};

    var riot_tag = {
        version: "0.0.1",

        tagparser: /<([a-z][a-z0-9]*-[-a-z0-9]+)[^>]*>/,

        load: function (name, req, onLoad, config) {
            req(["text!tags/" + name + ".tag"], function(tagdef) {
                // find any custom tags used in this tag, define them
                // define the tag
                var p = riot_tag.tagparser;
                p.lastIndex = 0;
                var handler = function(r) {

                }
                for(var got;(got = p.exec(tagdef));) {
                    if (!riot_tag.loaded[got]) {
                        riot_tag.loaded[got] = true;
                        loaders[got] = new Promise(function(res, rej) {
                            require("text!" + got, function(tag) {
                                res(tag);
                            }, function(err) {

                            });
                        });
                    }
                }
                Promise.all(loaders).then(function() {
                    var r = riot.compile(tagdef);
                    onLoad(r);    
                });
                riot_tag.tags
            }, function(err) {
                // hmm, didn't load
                onLoad.error(err);
            });
         },
    }
    return riot_tag;
});

})