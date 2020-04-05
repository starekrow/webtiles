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
    function Wallet(fields)
    {
        SuperClass.call(this, fields, this.schema);
    }

    var _static = Wallet;
    var _public = _static.prototype = Object.create(SuperClass.prototype);
    _public.constructor = Wallet;

    _static.schema = {
        id:                 Schema.kRecordId,
        name:               Schema.kString,
        balance:            Schema.kInt         | Schema.kNull,
        created:            Schema.kTime        | Schema.kNow,
        modified:           Schema.kTime        | Schema.kNow,
        notes:              Schema.kText        | Schema.kNull,
        _index:             {
            id:                 true,
            name:               true,
        },
        _search:            {
            notes:              true,
            name:               true,
        },
    };


    return Wallet;
})
