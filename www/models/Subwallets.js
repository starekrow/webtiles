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
    function Subwallets(fields)
    {

        SuperClass.call(this, fields, this.schema);
    }

    var _static = Subwallets;
    var _public = _static.prototype = Object.create(SuperClass.prototype);
    _public.constructor = Subwallets;

    _static.schema = {
        id:                 Schema.kRecordId,
        walletId:           Schema.kRecordId,
        subwalletId:        Schema.kRecordId,
        _index:             {
            id:                 true,
            walletId:           true,
            subwalletId:        true,
        },
        _foreignKeys:       {
            walletId:           "Wallet",
            subwalletId:        "Wallet",
        }
    };


    return Subwallets;
})
