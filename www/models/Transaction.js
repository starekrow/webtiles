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
    var Record          = require("Record");

    var SuperClass = Record;
    function Transaction(fields)
    {
        SuperClass.call(this, fields, {
            time:               Schema.kTime | Schema.kNow,
            created:            Schema.kTime | Schema.kNow,
            modified:           Schema.kTime | Schema.kNow,
            memo:               Schema.kText,
            checkNumber:        Schema.kInt,
            payee:              Schema.kString,
            issuer:             Schema.kString,
            detail:             Schema.kDetail,
            amount:             Schema.kDouble | Schema.k0,
            split:              Schema.kBool,
            splitFrom:          Schema.kRecordId,
            cleared:            Schema.kBool,
            reconciled:         Schema.kBool,
            flags:              Schema.kInt,
            wallet:             Schema.kRecordId,
            checkImage:         Schema.kUrl,
        });
    }

    var _static = Transaction;
    var _public = _static.prototype = Object.create(SuperClass.prototype);
    _public.constructor = Transaction;



    return Transaction;
})
