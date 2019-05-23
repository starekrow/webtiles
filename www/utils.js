define(function(require) {
    'use strict';

    var Utils = {};

    Utils.isArray = function(val)
    {
        return Array.isArray(val);
        //return Object.toString.apply(val) === "[object Array]";
    }
    
\    Utils.isObject = function(val)
    {
        return val && typeof(val) === "object";
    }

    Utils.isString = function(val)
    {
        return typeof(val) === "string";
    }

    Utils.isNull = function(val)
    {
        return val === null;
    }

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