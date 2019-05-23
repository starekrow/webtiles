define(function(require) {
    'use strict';
    var Field = require("abra/Field");

    var FieldSet = function()
    {

    }

    var _static = FieldSet;
    var _public = FieldSet.prototype;
        
    Object.assign(_static, {
        T_NAMESPACE     :1,
        T_FIELDSET      :2,
        T_ANY           :3,
        // T_SCALAR?
        T_BOOL          :4,
        T_INT           :5,
        T_DOUBLE        :6,
        T_STRING        :7,
        T_ARRAY         :8,
        T_DICT          :9,
        T_COLOR         :10,
        T_IMAGE         :11,
        T_DATE          :12,
        T_BLOB          :13,
    });

    _public.set = function(dest, value)
    {
        if (value === undefined) { 
            if (typeof dest != "object" || Array.isArray(dest)) {
                throw new Exception("bad field set assignment");
            }
            if (!dest) {
                return;
            }
            for (var key in dest) {
                this._assign(key, dest[key]);
            }
        }
    }

    _public.unbind = function(name)
    {
        if (Array.isArray(name)) {

        } else if (typeof name != "string") {

        } else {
            return this._unbind(name);
        }
    }

    /**
     * Binds this field to another field
     * 
     * Binding is an omni-directional sharing of state; any value assigned to
     * a bound field, or event triggered on one, will be shared with all fields
     * bound to it.
     * 
     * The binding itself is weak in both directions. You must arrange for 
     * another mechanism to retain the fields themselves. Put another way,
     * if the only living reference to a field is its binding to another field,
     * the field will be released.
     *  
     */
    _public.bind = function(field)
    {
        if (Array.isArray(name)) {

        } else if (typeof name != "string") {

        } else {
            return this._unbind(name);
        }
    }

    _public.on = function()
    {
    
    }


    /**
     * Cancels any timers running on this field.
     * 
     * 
     */
    _public.stop = function()
    {

    }


    _public.on_change = function()
    {
    
    }

    _public.on_assign = function()
    {
    
    }

    setter(_public, {
        value: function()
    });
    
    Object.defineProperty(_public,
    'value', { set: function(val) {
        val = Field.coerce(val, this.type);
        if (this.assigning) {
            this.assignNext = true;
            this.assignNextValue = val;
            return;
        }
        this.assigning = true;
        if (val == this._value) {
    
        } else {
            let event = {
                field: this,
                value: val,
                previous: this._value,
            }
            this._value = val;
    
        }
        this.assigning = false;
        if (this.assignNext) {
            let v2 = this.assignNextValue;
            this.assignNextValue = null;
            this.assignNext = false;
            this.value = v2;
        }
    } });
    
    _public.on = function(eventName, handler)
    {
        if (!this.eventHandlers[eventName]) {
            this.eventHandlers[eventName] = [];
        }
        let handlers = this.eventHandlers[eventName];
        if (handler) {
            this.eventHandlers[eventName].push(handler);
        }
    }
    
    _public.off = function(eventName, handler)
    {
        let handlers = this.eventHandlers[eventName];
        if (!handlers) {
            return;
        }
        let index = handlers.indexOf(handler);
        if (index >= 0) {
            handlers.splice(index, 1);
        }
    }
    
    /**
     * Raises the given event against this field
     */
    _public.trigger = function(event, extra)
    {
        let evname;
        let evdata;
        if (typeof event == "string") {
            evname = event;
            evdata = extra ? extra : {};
        } else {
            evname = event.type;
            evdata = event;
        }
    
        setTimeout(() => {
            let handlers = Object.keys(this.eventHandlers[evname]);
            handlers.forEach(handler => {
                if (false === handler.apply(this, evdata)) {
                    break;
                }
            });    
        }, 0);
    }
    
    
    });