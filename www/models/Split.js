/* Copyright (C) 2014, 2015, 2019 David O'Riva. MIT License
 ****************************************************



------------------------------------------------------------------------*/
define(function(require) {
    "use strict"
    var Field           = require("Field");
    var FieldSet        = require("FieldSet");
    var Schema          = require("Schema");
    var Record          = require("model/Record");

    var SuperClass = Record;
    function Split(fields)
    {
        SuperClass.call(this, fields, this.schema);
    }

    var _static = Split;
    var _public = _static.prototype = Object.create(SuperClass.prototype);
    _public.constructor = Split;

    _static.schema = {
        id:                 Schema.kRecordId,
        transactionId:      Schema.kRecordId,
        amount:             Schema.kInt,
        walletId:           Schema.kRecordId,
        _index:             {
            id:                 true,
            walletId:           true,
            transactionId:      true,
        },
        _search:            {
            amount:             true,
        },
        _foreignKeys:       {
            walletId:           "Wallet",
            transactionId:      "Transaction",
        },
    };


    return Split;
})
