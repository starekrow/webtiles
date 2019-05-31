/* Copyright (c) 2019 David O'Riva. MIT License.
 ***********************************************

A FieldSet provides organized storage for a group of fields. Fields within a 
FieldSet are easily created and located, and you can create heirarchies of 
fields as needed.

A FieldSet is itself a field; it reports its value as a map of field names to field 
objects, and it is not possible to directly assign a new value to it. 

To reference a named field within a FieldSet, there are two possibilities:

  * string lookup: myfieldset["name"]
  * compiler lookup: myfieldset.name

  * string lookup: myfieldset["name"]
  * compiler lookup: myfieldset.fields.name.value

In order for this syntax to work, 


## Binding FieldSets

You can bind all fields in a fieldset to another fieldset. The syntax is:

    myfieldset.$.bindAll(theirfieldset);
    FieldSet.bindFrom(theirfieldset).to(myfieldset)
    FieldSet.bindTo(myfieldset).from(theirfieldset)
    myfieldset.bindFrom(theirfieldset);




## Other commands

    FieldSet.reset(myfieldset);
    myfieldset.reset();

    FieldSet.delete(myfieldset, fieldName);
    myfieldset.delete(fieldName);

    FieldSet.

*/
define(function(require) {
    'use strict';
    var Field = require("abra/Field");

    var FieldSet = function()
    {

    }

    var _static = FieldSet;
    var _public = FieldSet.prototype;

    
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