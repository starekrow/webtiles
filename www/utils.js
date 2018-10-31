define(function(require) {
    'use strict';

    var Utils = {};

    _global.isArray = 
    Utils.isArray = function(val)
    {
        return Object.toString.apply(val) === "[object Array]";
    }
    
    _global.isObject = 
    Utils.isObject = function(val)
    {
        return val && typeof(val) === "object";
    }

    _global.isString = 
    Utils.isString = function(val)
    {
        return typeof(val) === "string";
    }

    _global.isNull = 
    Utils.isNull = function(val)
    {
        return val === null;
    }

    _global.isUndefined = 
    Utils.isUndefined = function(val)
    {
        return typeof(val) === "undefined";
    }

    _global.ENUM = 
    Utils.enum = function(target, values)
    {
        if (isArray(values)) {
            for (let i = 0, len = values.length; i < len; i++) {
                target[values[i]] = i;
            }
        } else if (isObject(values)) {
            Object.assign(target, values);
        }
    }


});