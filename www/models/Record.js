/* Copyright (C) 2014, 2015, 2019 David O'Riva. MIT License
 ****************************************************

Transactions have a two-part ID that allows multiple programs and devices to
synchronize through the database. The first part is a device GUID, representing
the device that created the transaction. The second part is a (usually serial)
ID issued by that device.

Other fields include:
  * datetime
  * parent
  * wallet
  * split
  * amount
  * memo
  * check number
  * payee/issuer
  * category
  * cleared
  * reconciled
  * source
  * created
  * modified

Each device chooses a properly random GUID, and maintains a table of known
device GUIDs. When loading the transaction table

------------------------------------------------------------------------*/
define(function(require) {
    "use strict"
    var Field           = require("Field");
    var FieldSet        = require("FieldSet");
    var Schema          = require("Schema");

    function Record(data, schema)
    {
        let schema = new Schema(schema);
        for (let field in data) {
            this[field] = schema.validate(field, data, schema);
        }        
    }

    var _public = Record.prototype;
    var _static = Record;

    _public.query = function(query)
    {

    }

    return Record;
})
