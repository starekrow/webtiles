/* Copyright (c) 2019 David O'Riva. MIT License.
 ***********************************************

The Field class represents a simple, functional interface for storing a value
and triggering handlers when the value changes. Fields have a number of useful
properties:

### Value

A field stores a single value, accessed through the `value` instance property.
The value can be of any type supported by your implementation. Normally,
assigning to the value (whether or not the assigned value is different from the
previous value) will trigger the field.

If you wish to set the field's value without triggering it, there is a
`rawValue` instance property that will set and read the field value without
triggering it.

### Trigger

Every field has a "trigger", a flag that is set to indicate that something of
interest has happened with the field. Setting this flag is called "triggering"
the field. Fields can be explicitly triggered by outside code, or implicitly
triggered by some actions  

Fields can be triggered in a variety of ways:

  * When the field value is set (whether or not it has changed)
  * When the field timer runs to completion
  * Explicitly, by calling trigger() on the field instance
  * When another field bound to the field is triggered

### Handlers

You can attach functions to a field that will be run whenever the field is
triggered. These functions are termed "handlers" because they handle the results
of whatever event led to the field being triggered.

### Timer

Every field has a timer that can be set in milliseconds. Once the timer is set,
it delays for the given amount of time and then triggers the field.

The timer can also be set to repeat, so that it triggers the field at a given
time interval.

You can stop the timer at any time.

### Bindings

In a general sense, a Field can be bound to another object as a transmitter, a
receiver, or both. In fact, it is possible to bind a Field to any number of
other objects.

In particular, it is always possible to bind two Fields together. Bound fields
share a single value and trigger, so that when either field's value is changed
the other's changes automatically with it, and when either field is triggered
the other is triggered at the same time.

This binding between the fields is weak, which allows many kinds of asociations
to be built without requiring the programmer to explicitly clean up after them.

It is also possible to release specific bindings, and to release all bindings to
a field. Releasing a binding usually releases all associations between the Field
and the other object, allowing for transfer of control and garbage collection.

See [Custom Bindings] for more details.

### Queries

It is possible to "query" a field for information. This mechanism can be used to
disguise or normalize the interface to just about any query/response mechanism.
The result of a query is another Field, which will be triggered with a value
representing that query result. Query semantics guarantee that the code making
the query will have an opportunity to add handlers before the query result is
triggered.

If a field's "value" is executable (for example, a function), then the field's
"response" is the result of calling the function. If the result of that call is
a Field, that field is bound to the result field. Promises are similarly bound
so that they will trigger the field's value when resolved or rejected. 

Non-executable field values return themselves as the result of a query; that is,
the actual contents of the query are completely ignored.

## Triggers and Concurrence

When a field is triggered, the handlers do not run immediately; instead, a
trigger event is added to the implementation's run queue, to be run in a new
execution context as soon as possible. In addition, a field can only have one
trigger pending.

This means that you can change a field's value many times in a single function,
but it will only be triggered (and the handlers will only run) once.

If you find yourself wanting to "shut down" a field after it might have been
triggered but before any of the handlers have run, there is an abort mechanism
that will clear any pending trigger and also clear the field's timer.

Setting a field's value within a trigger is guaranteed to trigger the field
again. It is also possible to manually trigger a field from within a trigger
handler. You must take care not to create an infinite loop of field triggers.

The interaction with bound fields and triggers is somewhat nuanced. When a field
is triggered, its handlers will typically run to completion before any of the
bound fields' handlers are started. This can result in slightly different
triggering behavior between the field that originates the trigger and the fields
that are bound to it.

## Remote Fields

With the field mechanism as described here, it would be fairly simple to set up
a mechanism to bind fields over a transport mechanism (network, shared memory,
etc).

The query mechanism can be also used to implement an application-level
abstraction for an external API, with its explicit one-to-one binding of query
actions to responses.

## Layered Abstractions

One of the main advantages of the Field mechanism is that it provides a simple
and consistent way to "narrow the pipe" between different parts of your
application. This is an excellent method for separating concerns within the
codebase without sacrificing too much performance.

The author's first use case involved separating view controller activity from
application logic, but the mechanisms provided allow for a rich expression of a
contract between any sections of a program.

## Custom Bindings

If you wish to add custom binding behaviors to all fields, you can use
`Field.addBinder`. You supply two functions for your custom binding; one to
perform a binding, and one to undo a binding. Each of these is given an
opportunity to examine the target object and decide whether to perform the
operation. In this way, it is possible to add useful extensions to the field's
capabilities at runtime and make in-the-moment decisions about how exactly a
field will be bound to a target object.

Custom (un)binding functions are called in a most-recent-first order, making it
easy to override or augment existing binding behaviors. Your functions can
either pass, or claim completion of the operation, or chain to previous handlers
with the same or a different target.

### DOM Binding

If you bind a field to a DOM node, it will have various effects depending on the
node type:

  * INPUT nodes assign values to the field when they are changed
  * IMG nodes have their `src` field updated by the value of the field
  * TABLE nodes display the field's value in various useful ways. The value may
    be an object or an array, and the elements may be values or objects or
    arrays
  * Other nodes have their `innerHtml` attribute updated by the field value when
    it changes.

In most cases, if the Field's value is `undefined` when the binding is
performed, it will take on the current value of the DOM node.

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
     * 
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
     * Queries are not run "inline"; they are scheduled to be run at the next
     * available execution slot.
     *
     * Returns the original result field.
     */
    _public.query = function(query, result)
    {
        var value = this._value;
        var result = new Field();
        schedule(() => {
            if (typeof value == "function") {
                let got = value(query);
                if (got instanceof Field) {
                    result.bind(got);
                } else if (got && got.then) {
                    got.then(value => {
                        result.set(value);
                    }, error => {
                        result.set(error);
                    })
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