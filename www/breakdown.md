
Primary Components
==================

The application is expected to comprise a few "primary components", major 
building blocks that provide the outline of the application.

  * Record - a list of field values. Each value has a corresponding name.
  * Tables - Row-oriented data storage, with each row containing one or more
    columns.
  * Cache - ephemeral key/value storage
  * Session - a session ties together multiple disjoint actions by a single 
    source.
  * Models - 
  * Schema - metadata describing the basic data structure of a Record or Table.
    May include well-known constraints.
  * 

* data
  * records
    * column types
      * scalar - bool/int/fp/string/binary
      * structured - JSON object, array
      * blob
    * column names
    * record type?
  * constraints
  * schemata
  * tables
  * cache
  * session
  * configuration
  * files
    * application code
    * local resources
    * remote resources (S3 etc)
* operators
  * validators - apply constraints to records
  * actions
  * controllers
  * may interact with multiple data sources
* events
  * responders
  * traps
  * triggers
  * may arise from within or without the application
* procedures
  * business logic
  * controllers
* assemblies
  * model
  * controller


Model-Presenter-Abstraction-View

The components:
  * Model - represents the business logic and data.
  * Presenter - the presenter organizes access to and queries the model to 
    support a given variety of interactive flow.
  * Abstraction - an agreed-upon set of values, events, handlers and queries
    that the presenters and views will share
  * View - a view is an assembly of interactive controls that are rendered as 
    a group and that share a single lifecycle.

MPAV is designed primarily for larger applications, or as the "shell" of a 
framework that offers a specific kind of application-authoring experience. It 
encourages a clear and streamlined assessment of the author's needs and a minimalist 
approach to implementation, and consistent management of library dependencies 
from the point of view of the "main application".

The application is separated into five (or more) distinct layers. Each layer 

:
  * Platform - the platform layer contains whatever system calls may be 
    available, and any functionality added by vendor libraries or system 
    extensions. These together are taken to be the platform that your 
    application runs on.
  * Model - the business logic, schemata and data together comprise the model.
    Aspects of the model will likely be implemented on the platform (e.g. data 
    storage). The Model is also the primary source of the Abstraction.
  * Abstraction - encapsulates a distilled view of all the functions and options 
    available in the application, mostly from the perspective of on interactive 
    user.
  * Presenter - manages an interactive use of the Model, usually through a View.
    The Presenter contributes to the Abstraction and may work with the Model, 
    the Abstraction and the Platform simultaneously.
  * View - a group of controls that share a lifecycle. These are typically 
    bound directly to some part of the abstraction while alive. Note that the 
    View controls are usually supplied by the Platform, which makes the main
    purpose of a View to broker between the platform implentation of a 
    particular type of control and a specific abstraction.

Ideally, the application 


A quick illustration of an application written with this pattern follows. This
application will take notes from the user and remember them, and offer some 
management tools for them.

Platform:
  * rand()
  * ORM

Model:
  * Note class
  * Note management functions

Abstraction:
  * note
  * save_note()
  * select_note(id)
  * new_note()
  * 

Presenters
  * app
  * newNote
  * editNote
  * 






