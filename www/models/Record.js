/* Copyright (C) 2014, 2015, 2019 David O'Riva. MIT License
 ****************************************************



------------------------------------------------------------------------*/
define(function(require) {
    "use strict"
    var Field           = require("Field");
    var FieldSet        = require("FieldSet");
    var Schema          = require("Schema");

    let Record = class {
        constructor(data, schema)
        {
            let schema = new Schema(schema);
            for (let field in data) {
                this[field] = schema.validate(field, data, schema);
            }    
        }

        query(query)
        {

        }
    }

    return Record;
})
