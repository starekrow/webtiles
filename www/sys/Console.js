/* Copyright (C) 2014, 2015, 2019 David O'Riva. MIT License
 ****************************************************

A "Console" is conceived as an operating console for the application. It is
possible to offer more than one console configuration. There are many possible
interactive components of a console:

* *terminal* -- One of a selection of classic I/O terminals (vt100, MSDOS etc).
  Characterized by a single character input stream and a single character 
  output stream that uses terminal control characters to assert varying levels
  of control over the terminal's output.
* *streams* -- a console may offer uni-directional or bi-directional numbered
  or named byte streams
* *socket routing* -- a console may offer routing and/or gateways for IP
  sockets.*
* *logs* -- a console may offer 
* *sensors* -- a console may offer 
* *knobs* -- a console may offer 
* *controllers* -- a console may offer 
* *environment* -- a console may offer 
* *signals* -- a console may offer 
* *wires* -- a console may offer 
* ** -- a console may offer 


------------------------------------------------------------------------*/
define(function(require) {
    "use strict"
    var Field           = require("Field");

    var SuperClass = Object, constructor;
    var Console = constructor = function()
    {
        SuperClass.call(this);

    }

    var _public = _static.prototype = Object.create(SuperClass.prototype);
    var _static = _public.constructor = constructor;

    _public.*

    return Console;
})
