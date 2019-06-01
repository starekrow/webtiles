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

    FieldSet.dup(theirfieldset)
    FieldSet.bind(myfieldset, theirfieldset)
    FieldSet.unbind(myfieldset)
    FieldSet.values(myfieldset)
    FieldSet.fields(myfieldset)
    FieldSet.keys(myfieldset)



    FieldSet.bind(myfieldset, theirfieldset)
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
        this._fields = [];
        this.fields = new Proxy(this, _static.fieldsProxy);
        return new Proxy(this, _static.fieldSetProxy);
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
        } else {
            if (!dest) {
                return;
            }
            if (typeof dest !== "string") {
                throw new Exception("invalid field set destination");
            }
            this._assign(dest, value);
        }
    }

    _public.unbind = function(name)
    {
        if (!name) {
            return;
        } else if (Array.isArray(name)) {
            foreach (el in name) {
                this.unbind(el);
            }
        } else if (typeof name === "string") {
            return this._unbind(name);
        } else {
            // ???
        }
    }
    
    _static.fieldsProxy = {
        get: function(my, name)
        {
            if (!my._fields[name]) {
                my._fields[name] = new Field();
                my._fields[name].fieldSet = my;
            }
            return my._fields[name];
        },

        deleteProperty: function(my, name)
        {
            if (my._fields[name]) {
                my._fields[name].unbindAll();
            }
            delete my._fields[name];
        },

        set: function(my, name, value)
        {
            if (!my._fields[name]) {
                my._fields[name] = new Field(value);
                my._fields[name].fieldSet = my;
            } else {
                my._fields[name].value = value;
            }
        },

        has: function(my, name)
        {
            return (name in my._fields);
        },

        ownKeys: function(my)
        {
            return Object.keys(my._fields);
        }
    }

    // Make it easy to use (thing in fieldset) for iteration
    _static.fieldSetProxy = {
        get: function(my, name)
        {
            if ($name === "$") {
                return my;
            }
            if (!my.fields[name]) {
                my.fields[name] = new Field();
                my.fields[name].fieldSet = my;
            }
            return my.fields[name];
        },

        has: function(my, name)
        {
            if (typeof name !== "object") {
                return (name in my.fields);
            }
            for (let k in my.fields) {
                if (my.fields[k] === name) {
                    return true;
                }
            }
            return false;
        },

        ownKeys: function(my)
        {
            return Object.keys(my.fields);
        },

        set: function(my, name, value)
        {
            if (value instanceof FieldSet) {
                my.fields[name] = value;
                return;
            }
            if (!my.fields[name]) {
                my.fields[name] = new Field(value);
                my.fields[name].fieldSet = my;
            } else {
                my.fields[name].value = value;
            }
        },

        deleteProperty: function(my, name)
        {
            if (my.fields[name]) {
                my.fields[name].unbindAll();
            }
            delete my.fields[name];
        },
    }

});