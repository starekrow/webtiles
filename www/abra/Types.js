/* Copyright (c) 2013,2019 David O'Riva. MIT License.
 ***********************************************

Fundamental Types
-----------------

- bool
- int8, int32, int64, uint8, uint32, uint64
- timestamp
- time
- fp32, fp64
- bigint
- string
- binary
- vector<type>
- array
- dictionary
- object
- blob
- var
- struct

Meaningful basic types
----------------------
- timestamp
- time
- vector<type>
- 

Struct Types
------------
- int8/16/24/32/64
- uint8/16/24/32/64
- char/8/16/32
- align16/32/64/128
- ptr8/16/32/64
- fp32/64
- int/uint/bool.1..32
- bool (=8), bool1..32 [pack]
- enum8/16/32/64/.1..64
- array - type[count]
- pointer - type/struct pointer
- unixtime/32/64



*/
define(function(require) {
    'use strict';

    var Field = function(name, value)
    {
        this.name = name;
        this._value = value;
    }

    var _static = Field;
    var _public = Field.prototype;

    /**
     * (internal) Add a function to to the scheduler queue
     */
    function schedule(func)
    {
        return setTimeout(func, 0);
    }

    /**
     * (internal) Remove a scheduled function from the queue
     */
    function unschedule(ref)
    {
        clearTimeout(ref);
    }

    /**
     * (internal) Invoke the handlers for a field
     */
    function invokeHandlers(field)
    {
        if (field.handlers) {
            let hl = field.handlers.slice();
            for (let h in hl) {
                h(field);
            }
        }
    }

    var abortField = function(field, seen)
    {
        seen[field] = true;
        if (field.triggered) {
            unschedule(field.triggered);
            field.triggered = null;
        }
        if (field._timer) {
            clearTimeout(field._timer);
            field._timer = null;
        }
        if (field._bindings) {
            for (let f in field._bindings) {
                if (!(f in seen)) {
                    abortField(f, seen);
                }
            }
        }
    }

    /**
     * Assigns a value for this field. 
     * 
     * The values for any bound fields are set as well.
     * 
     * @param Field field 
     * @param mixed value 
     * @param object seen 
     */
    var setRawValue = function(field, value, seen)
    {
        seen[field] = true;
        field._value = value;
        if (field._bindings) {
            for (let f in field._bindings) {
                if (!(f in seen)) {
                    setRawValue(f, value, seen);
                }
            }
        }
    }

   /**
     * Assigns a value for this field. 
     * 
     * The values for any bound fields are set as well.
     * 
     * @param Field field 
     * @param mixed value 
     * @param object seen 
     */
    var triggerField = function(field)
    {
        if (!field.triggered) {
            if (field._bindings) {
                field.triggered = true;
                for (let f in field._bindings) {
                    f.trigger();
                }
            }
            field.triggered = schedule(() => {
                field.triggered = null;
                invokeHandlers(field);
            });
        }
    }

    /**
     * Adds a handler to this field.
     * 
     * The field's handlers are run in an arbitrary order when the field is
     * triggered. Unlike DOM events, it is not possible for one handler to 
     * prevent others from running.
     * 
     * Handlers are triggered with a reference to the field as their single 
     * argument.
     */
    _public.handle = function(handler)
    {
        if (!this.handlers) {
            this.handlers = [];
        }
        this.handlers.push(handler);
    }

    /**
     * Remove a handler from a field
     */
    _public.unhandle = function(handler)
    {
        if (this.handlers) {
            let i = this.handlers.indexOf(handler);
            if (i >= 0) {
                this.handlers.splice(i, 1);
            }    
        }
    }

    /**
     * Triggers the field
     * 
     * Causes any field trigger handlers to run. The handlers are not run 
     * immediately, but on the next scheduler round.
     * 
     * Note that the list of handlers to be run is sampled just before the 
     * handlers are run, and is not affected by any operations performed on the
     * field within any of those handlers.
     * 
     * If a field is triggered multiple times before the handlers have a chance
     * to run, they will only be run once.
     * 
     * Any fields bound to this field are also triggered.
     */
    _public.trigger = function()
    {
        triggerField(this);
    }

    /**
     * Clear all pending triggers and timers for the field
     * 
     * Note this will not prevent handlers that have already been triggered
     * from running.
     */
    _public.abort = function()
    {
        abortField(this, {this: true});
    }

    /**
     * Assigns a value to the field without triggering it
     *
     * Equivalent to `thisField.rawValue = value`.
     *
     * Any fields bound to this field have their value updated as well.
     */
    _public.setRaw = function(value)
    {
        if (value instanceof Field) {
            this._value = value._value;
        } else {
            this._value = value;
        }
        if (this._bindings) {
            for (let f in this._bindings) {
                f._value = this._value;
            }
        }
    }

    /**
     * Assigns a value to the field and triggers it
     * 
     * Equivalent to `thisField.value = value`.
     * 
     * Any fields bound to this field have their value updated and are 
     * triggered as well.
     */
    _public.set = function(value)
    {
        this.setRaw(value);
        this.trigger();
    }

    _static.binders = [];

    _static.addBinding = function(handlers)
    {
        if (!handlers || (typeof handlers !== "object")) {
            return;
        }
        _static.binders.unshift(handlers);
        return _static;
    }

    _static.removeBinding = function(handlers)
    {
        if (!handlers || (typeof handlers !== "object")) {
            return;
        }
        let i = _static.binders.indexOf(handlers);
        if (i >= 0) {
            _static.binders.splice(i,1);
        }
        return _static;
    }

    /**
     * Binds this field to another field (or value)
     * 
     * This is the lowest-level, default field binding function. 
     *
     * When fields are bound together, their values, timers and trigger states
     * are all forced to track each other. These binding associations are always
     * "weak" in nature; if the last outstanding reference to a field is its
     * binding to another field, that binding is allowed to dissolve.
     *
     * Any two fields may only be bound together once; binding two fields that
     * are already bound to each other will have no effect.
     *
     * The field that performs the binding will take on the value of the other
     * field. Unless both fields' value is `undefined`, the binding field's
     * value will be assigned and the binding field will be triggered just
     * before it is bound to the other field.
     */
    _public.bindField = function(toThing)
    {
        if (toThing instanceof Field) {
            if (this === toThing) {
                return true;
            }
            if (this._value !== undefined || toThing._value !== undefined) {
                this.set(toThing._value);
            }
            if (!this._bindings) {
                this._bindings = new WeakMap();
            }
            if (!this._bindings[field]) {
                this._bindings[field] = true;
                if (!toThing._bindings) {
                    toThing._bindings = new WeakMap();
                }
                toThing._bindings[this] = true;
            }
        } else {
            this.set(toThing);
        }
        return true;
    }

    _public.unbindField = function(other)
    {
        if (other && typeof other === "object") {
            if (this._bindings && this._bindings[other]) {
                delete this._bindings[other];
                if (other instanceof Field) {
                    delete other._bindings[this];
                }
            }
        }
        return true;
    }

    Field.addBinding({
        bind:       _public.bindField,
        unbind:     _public.unbindField
    });

    /**
     * Binds this field to another object (or value)
     *
     * Tries each field binding handler in turn, until one reports that the 
     * field is bound or the last one has run.
     */
    _public.bind = function(other)
    {
        if (other === undefined || other === null) {
            return this;
        }
        for (let handler in _static.binders) {
            let result = handler.bind ? handler.bind(this, other) : null;
            if (result) {
                if (typeof result === "object") {
                    other = result;
                } else {
                    return this;
                }
            }
        }
        return this;
    }

    /**
     * Removes the binding between a field and another object
     */
    _public.unbind = function(other)
    {
        if (other === undefined || other === null) {
            return this;
        }
        for (let handler in _static.binders) {
            let result = handler.unbind ? handler.unbind(this, other) : null;
            if (result) {
                if (typeof result === "object") {
                    other = result;
                } else {
                    return this;
                }
            }
        }
        return this;
    }

    /**
     * Removes all bindings to this field
     * 
     * TODO: This is only correct for other Fields, need a way to do this for
     * all bound objects.
     */
    _public.unbindAll = function()
    {
        if (this._bindings) {
            for (let other in this._bindings) {
                delete other._bindings[this];
            }
            delete this._bindings;
        }
        return this;
    }

    /**
     * Sets a timer to trigger the field.
     * 
     * Creates a timer that will trigger the field after the given number of
     * milliseconds.
     * 
     * Note that a field can only run one timer at a time; setting the timer 
     * will clear any currently running timer.
     * 
     * Use stop() or abort() to stop a timer and prevent it from triggering. 
     */
    _public.timer = function(ms)
    {
        this.stop();
        this._timer = setTimeout(() => {
            this._timer = null;
            if (this.triggered) {
                // take over the trigger
                unschedule(this.triggered);
            }
            this.triggered = true;
            if (this._bindings) {
                for (let f in this._bindings) {
                    f.trigger();
                }
            }
            this.triggered = null;
            invokeHandlers(this);
        });
    }

    /**
     * Sets a recurring timer to trigger the field.
     * 
     * Like timer(), except that the timer will be automatically repeated at
     * the given interval.
     * 
     * Use stop() or abort() to stop a repeating timer.
     */
    _public.repeat = function(ms)
    {
        this.stop();
        this._interval = setInterval(() => {
            this._interval = null;
            if (this.triggered) {
                // take over the trigger
                unschedule(this.triggered);
            }
            this.triggered = true;
            if (this._bindings) {
                for (let f in this._bindings) {
                    f.trigger();
                }
            }    
            this.triggered = null;
            invokeHandlers(this);
        });
    }

    /**
     * Stop a timer
     * 
     * If there is a timer running on this field, stop it.
     */
    _public.stop = function()
    {
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
        if (this._interval) {
            clearTimeout(this._interval);
            this._interval = null;
        }
    }

    /**
     * Start a query
     *
     * A field with an executable value can be queried for an answer. You supply
     * a value representing the query, and the field's contents are executed
     * with that value and are expected to supply a result.
     *
     * If the field value is not a function, it is just assigned to a new field
     * and that field is scheduled to be triggered. Otherwise, the function is
     * executed with the query. It may return a Promise or a Field; other types
     * of values are considered to be "immediate" results and are scheduled to
     * be triggered immediately.
     *
     * A query will automatically synthesize a new "result" Field that will be
     * triggered with the result of the query, when it is available. If you
     * supply a `result` field in the call to the query, your supplied field
     * will be bound to the actual result field.
     *
     * Queries are not run inline; they are scheduled to be run at the next
     * available execution slot.
     *
     * Returns the supplied result field, or a new Field instance that will
     * be set to the result.
     */
    _public.query = function(query, result)
    {
        var value = this._value;
        result = result || new Field();
        schedule(() => {
            if (typeof value == "function") {
                let got = value(query);
                if (got instanceof Field) {
                    result.bind(got);
                } else if (got && got.then && typeof got.then === "function") {
                    got.then(value => {
                        result.set(value);
                    }, error => {
                        result.set(error);
                    });
                }
            } else {
                result.value = value;
            }
        });
        return result;
    }

    // TODO: _public.pause might be interesting

    Object.defineProperty(_public, 'value', { 
        set: _public.set,
        get: function() { return this._value; }
    });

    Object.defineProperty(_public, 'rawValue', { 
        set: _public.setRaw,
        get: function() { return this._value; }
    });

    Object.defineProperty(_public, 'stringValue', { 
        get: function() {
            return "" + this._value;
        }
    });

    Object.defineProperty(_public, 'jsonValue', { 
        get: function() {
            return JSON.stringify(this._value);
        }
    });

    Object.defineProperty(_public, 'boolValue', { 
        get: function() {
            return this._value ? true : false;
        }
    });

    Object.defineProperty(_public, 'intValue', { 
        get: function() {
            return this._value | 0;
        }
    });

    Object.defineProperty(_public, 'floatValue', { 
        get: function() {
            return this._value * 1;
        }
    });

    return Field;
});