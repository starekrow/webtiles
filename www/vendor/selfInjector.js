define(function(require) {
    "use strict"
    //var Api = require("Api");

    function SelfInjector(scope)
    {
        var that = this;
        this.lookup = [];
        this.lookups = [];
        this.stack = [];
        this.scope = scope || {};
        scope.inject = function(fields, code) {
            return that.inject(fields, code);
        }
        scope.publish = function(fields, value) {
            return that.publish(fields, value);
        }
        this.begin();
        this.stack.pop();
        scope.published = new Proxy(this, _static.publishedProxy);
    }

    var _public = SelfInjector.prototype;
    var _static = SelfInjector;

    _static.injectedProxy = {
        get: function(obj, prop, receiver)
        {
            if (prop in _static.methods) {
                return obj[prop];
            }
            for (let el in obj.lookup) {
                if (prop in el) {
                    return el[prop];
                }
            }
        }
    }

    _static.publishedProxy = {
        set: function(obj, prop, value)
        {
            obj.injector.publish(prop, value);
        },
        get: function(obj, prop)
        {
            return obj.injector.lookup[0][prop];
        }
    }

    _public.begin = function(fields)
    {
        this.lookups.push(this.lookup);
        this.lookup = this.lookup.slice();
        this.lookup.unshift({});
        this.assignMany(fields);

        let ob = {
            lookup:         lookup,
            injector:       this
        };

        let injected = new Proxy(ob, _static.injectedProxy);
        this.stack.push(injected);
        this.scope.injected = this.scope.inject.me = injected;
        return injected;
    }

    _public.end = function()
    {
        if (this.stack.length) {
            this.scope.injected = this.scope.inject.me = this.stack.shift();
            this.lookup = this.lookups.pop();
        }
        return this.scope.injected;
    }

    _public.publish = function(fields, value)
    {
        let target = this.lookup[this.lookup.length - 1];
        if (typeof fields === "string") {
            target[fields] = value;
        } else {
            this.assignMany(fields, target);
        }
        return this;
    }

    _public.assign = function(fields, value)
    {
        let target = this.lookup[0];
        if (typeof fields === "string") {
            target[fields] = value;
        } else {
            this.assignMany(fields, target);
        }
        return this;
    }

    _public.assignMany = function(fields, target)
    {
        if (!target) {
            target = this.lookup[0];
        }
        if (fields && typeof fields === "object") {
            for (let name in fields) {
                ob[name] = fields[name];
            }    
        } else if (Array.isArray(fields)) {
            for (let el in fields) {
                this.assign(el, target);
            }
        }
        return this;
    }

    _static.resolveInjected = function(obj, prop, receiver)
    {
        if (prop in _static.methods) {
            return obj[prop];
        }
        for (let el in obj.lookup) {
            if (prop in el) {
                return el[prop];
            }
        }
    }

    _public.inject = function(fields, code)
    {
        this.begin(fields);
        try {
            code();
        } finally {
            this.end();
        }
    }

    return SelfInjector;
})
