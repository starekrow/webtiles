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
    var Record          = require("model/Record");

    var SuperClass = Record;
    function Transaction(fields)
    {
        SuperClass.call(this, fields, this.schema);
    }

    var _static = Transaction;
    var _public = _static.prototype = Object.create(SuperClass.prototype);
    _public.constructor = Transaction;

    _public.

    return Transaction;
})
