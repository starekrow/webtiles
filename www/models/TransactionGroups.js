/* Copyright (C) 2019 David O'Riva. MIT License
 ****************************************************



------------------------------------------------------------------------*/
define(function(require) {
    "use strict"
    var Field           = require("Field");
    var FieldSet        = require("FieldSet");
    var Schema          = require("Schema");
    var Record          = require("model/Record");

    var SuperClass = Record;
    function TransactionGroups(fields)
    {

        SuperClass.call(this, fields, this.schema);
    }

    var _static = TransactionGroups;
    var _public = _static.prototype = Object.create(SuperClass.prototype);
    _public.constructor = TransactionGroups;

    _static.schema = {
        id:                 Schema.kRecordId,
        groupId:            Schema.kRecordId,
        transactionId:      Schema.kRecordId,
        _index:             {
            id:                 true,
            walletId:           true,
            subwalletId:        true,
        },
        _foreignKeys:       {
            groupId:            "Wallet",
            transactionId:      "Transaction",
        }
    };


    return TransactionGroups;
})
