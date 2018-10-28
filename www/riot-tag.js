define(function(require, exports, module) {
    'use strict';

    var riot = require("riot");

    var masterConfig = (module.config && module.config()) || {};

    var riot_tag = {
        version: "0.0.1",

        tagparser: /<([a-z][a-z0-9]*-[-a-z0-9]+)[^>]*>/g,

        loaded: {},

        load: function (name, req, onLoad, config)
        {
            riot_tag.loaded[name] = true;
            require(["text!tags/" + name + ".tag"], function(tagdef) {
                // find any custom tags used in this tag, define them
                var p = riot_tag.tagparser;
                var loaders = [];
                p.lastIndex = 0;
                var mkloader = function(tag) {
                    //console.log("Load dependent " + tag);
                    return new Promise(function(res, rej) {
                        require(["riot-tag!" + tag], function(tag) {
                            res(tag);
                        }, function(err) {
                            res(null);
                        });
                    });
                };
                for(let tag;(tag = p.exec(tagdef));) {
                    if (!riot_tag.loaded[tag[1]]) {
                        riot_tag.loaded[tag[1]] = true;
                        loaders.push(mkloader(tag[1]));
                    }
                }
                Promise.all(loaders).then(function() {
                    try {
                        // define the tag
                        //console.log("Compile " + name);
                        var r = riot.compile(tagdef);
                    } catch (e) {
                        //console.log("Compile " + name + "failed");
                        //console.log(e);
                    }
                    //console.log("Compiled " + name + ", got " + r );
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