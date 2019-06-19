/* Copyright (c) 2019 David O'Riva. MIT License.
 ***********************************************

### Promise binding

Binding a field to a Promise will cause the field to trigger when the Promise is
resolved or rejected. The field's value will be assigned to the parameter passed
when the Promise resolves or rejects.

*/
define(function(require) {
    'use strict';
    var Field = require("Field");

    function bindPromise(fieldMap, promise)
    {
        promise.then(
            result => {
                for (let field in fieldMap) {
                    field.value = result;
                }    
            },
            error => {
                for (let field in fieldMap) {
                    field.value = result;
                }
            }
        );
    }

    Field.addBinding({
        name: "Promise",
        bind: function(field, promise) {
            bindPromise(new WeakMap({field: null}), promise);
        },
        unbind: function(field, promise) {
            throw new TypeError("promises cannot be unbound from fields")
        }
    });

});