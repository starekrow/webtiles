define(function(require) {
    'use strict';
    var riot = require('riot')

    var Viewport = function()
    {

    }

    var _static = Viewport
    var _public = Viewport.prototype

    ENUM(_static, {
        FRAME_NONE:             1,
        FRAME_FULL:             2,
        FRAME_POPOUT:           3,
    });

    _public.open = function(options)
    {
        
    }

    return Viewport;
});