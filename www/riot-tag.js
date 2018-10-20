define(function(require, exports, module) {
    'use strict';

    var riot = require("riot");

    var masterConfig = (module.config && module.config()) || {};

    var riot_tag = {
        version: "0.0.1",

        tagparser: /<([a-z][a-z0-9]*-[-a-z0-9]+)[^>]*>/,

        load: function (name, req, onLoad, config) 
        {
            req(["text!tags/" + name + ".tag"], function(tagdef) {
                // find any custom tags used in this tag, define them
                // define the tag
                var p = riot_tag.tagparser;
                var loaders;
                p.lastIndex = 0;
                var mkloader = function(tag) {
                    return new Promise(function(res, rej) {
                        require("riot-tag!" + tag, function(tag) {
                            res(tag);
                        }, function(err) {
                            res(null);
                        });
                    });
                };
                for(let tag;(tag = p.exec(tagdef));) {
                    if (!riot_tag.loaded[tag]) {
                        riot_tag.loaded[tag] = true;
                        loaders.push(mkloader(tag));
                    }
                }
                Promise.all(loaders).then(function() {
                    var r = riot.compile(tagdef);
                    onLoad(r);
                }, function(err) {
                    var r = riot.compile(tagdef);
                    onLoad(r);
                });
            });
         },
    }
    return riot_tag;
});

})