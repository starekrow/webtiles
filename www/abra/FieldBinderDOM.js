/* Copyright (c) 2019 David O'Riva. MIT License.
 ***********************************************

### DOM Binding

If you bind a field to a DOM node, it will have various effects depending on the
node type:

  * INPUT nodes assign values to the field when they are changed
  * IMG and IFRAME nodes have their `src` field updated by the value of the
    field
  * TABLE nodes display the field's value in various useful ways. The value may
    be an object or an array, and the elements may be values or objects or
    arrays
  * Other nodes have their `innerHtml` attribute updated by the field value when
    it changes.

Unlike field-to-field bindings, DOM node bindings are usually "strong", in the
sense that if either the field or the node is retained by another reference,
they will support each others' existence.

In most cases, if the Field's value is `undefined` when the binding is
performed, it will take on the current value of the DOM node.

*/
define(function(require) {
    'use strict';
    var Field = require("Field");

    function bindNode(field, node)
    {
        switch (node.tagName) {
            case 'INPUT':
            case 'IMG':
            case 'IFRAME':
            default:
        }
        var hl = field.handleDOMNodeEvents = {};

    }

    Field.addBinding({
        name: "HTMLElement",
        bind: function(field, other) {
            if (!(other instanceof HTMLElement) || !other.tagName) {
                return;
            }
            if (!field._boundDOMNodes) {
                field._boundDOMNodes = new WeakMap();
            }
            if (field._boundDOMNodes[other]) {
                return;
            }
            bindNode(field, other);
        },
        unbind: function(field, other) {
            if (!(other instanceof HTMLElement) || !other.tagName) {
                return;
            }
            delete field._boundDOMNodes[other];
        }
    });

});