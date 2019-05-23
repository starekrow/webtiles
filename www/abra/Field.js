/* Copyright (c) 2019 David O'Riva. MIT License
 **********************************************

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
     */
    _public.trigger = function()
    {
        if (!this.triggered) {
            this.triggered = schedule(() => {
                _static.invokeHandlers(this);
            })
        }
    }

    /**
     * Clear all pending triggers and timers for the field
     * 
     * Note this will not prevent handlers that have already been triggered
     * from running.
     */
    _public.abort = function(value)
    {
        if (this.triggered) {
            _static.unschedule(this.triggered);
            this.triggered = null;
        }
        if (this._timer) {
            clearTimeout(this._timer);
        }
    }

    /**
     * Assigns a value to the field and triggers it
     * 
     * Equivalent to `thisField.value = value`.
     */
    _public.set = function(value)
    {
        if (value instanceof Field) {
            this._value = value._value;
        } else {
            this._value = value;
        }
        this.trigger();
    }

    _public.bind = function(field)
    {

    }

    _public.unbind = function(field)
    {
        
    }

    /**
     * Sets a timer to trigger the field.
     * 
     * Creates a timer that will trigger the field after the given number of
     * milliseconds.
     * 
     * Note that a field can only run one timer at a time; setting the timer 
     * will clear any currently running timer.
     */
    _public.timer = function(ms)
    {
        this.stop();
        this._timer = setTimeout(() => {
            this._timer = null;
            _static.invokeHandlers(this);
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
    }

    Object.defineProperty(_public, 'value', { 
        set: _public.set,
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