/* Copyright (C) 2019 David O'Riva. MIT License
 ****************************************************

Autobase manages the details of maintaining a set of records that are
synchronized across multiple devices. 

Each record has a paired ID that identifies the device that created the record
and a serial number issued by that device. Both creation and modification
timestamps are also kept for each record.

Aside from their ID, records may maintain any number of fields. Each field may
contain a string, a number, a boolean, a null, or an array or a map of such
values. Maps associate string keys with values.

There is a "Synchronization Procedure" that controls the process of bringing two
groups of records into agreement, when devices that have been out of
communication for a while reconcile the changes that have been made to a shared
data store during that time.

The synchronization procedure involves describing the "known state of the world"
to the devices you are in communication with, as well as a way to provide
particular groups of updates on request.

The data model is generally designed to limit the required data storage to a
reasonable multiple of the minimal dataset description - that is, if the set of
records required to represent the state of the database has a minimal
representation of N bytes, the storage required for the full dataset with
synchronizing metadata would typically be somewhat less than 3N.

Further, there is a mechanism supplied that works to summarize important metrics
of the dataset in data blocks called "frames". These frames are distributed
along the same primary index as the records themselves, and they make it
possible to perform partial dataset syncs without sacrificing the overall
accuracy of the data set.


Synchronization possibilities are 

Devices maintain a log of operatons performed on the database

## Device Identification

In a typical implementation, each device will have a local ID in addition to the
device GUID. The local ID provides a concise (usually indexed) mapping to the
set of known devices, and reduces storage requirements for any local records
that would otherwise include the full device GUID for each record.



## Log Operations

All operations have a <timestamp>

  * create <id> <sequence> <fields>
  * set <id> <sequence> <fields>
  * alter <id> <sequence> <fields>
  * delete <id>
  * remove <id> <fields>
  * remap <srcid> <destid>
  * break <frameids>

Each device must maintain a "log index" that increases with each log entry, and
is exposed to other devices. Each log entry has an index assigned by the device
that creates it. The latest index "seen" for a foreign device through
interaction with a data source can be stored and used to decide how much
recalculation is needed for a given set of updates from such a device.

## Frames

A "frame" consists of a set of calculated values that are related to the records
in a table, along with information about each device that contributed state to
the frame.

Frames can be used to capture running totals or counters, allowing the system to
truncate logs when bringing devices up to date. 

Could be implemented simply as records that are adjusted by each system that
syncs with them, but I want to solve the "A-B/A-C" problem, where one system
syncs with two others that never directly interact. The right solution should
allow information to be shared amongst all of them with each maintaining a
self-consistent set of frames.

Each field in the frame contains a value and a set of versioned contributors.

Example frame record:

* contributors:
  * guid
* fields:
  * contributorSet
    * contributorIndex
    * sequenceNumber
  * value

## Correlation

Two records can become "correlated", meaning that the syncing mechanism has
determined that they refer to the same underlying entity. When an operation is
performed on a correlated record, that operation is applied to all records that
are associated with it. In this way, alterations made to a record on multiple
devices are retained, even if that record is later determined to have been a
duplicate of a different record on two or more of those devices.



## Sourcemaps

A sourcemap allows for efficient synchronization of the set of known
contributors to the dataset. Each entry in the sourcemap has an identifying
"hash". One of the phases of synchronization is to fill in the sourcemaps
between the syncees.

Each sourcemap is identified by a SHA1 hash. The sourcemap itself is a map of
source GUIDs to local indexes, and contains the complete set of known sources
for the data set.

If the first exchange results in a source not recognizing the supplied dataset,
it can request more information about it. Usually, this should be supplied in
the form of a map of synchronizers seen within the last <N> days since the
formation of the latest sourcemap, along with a reference to the sourcemap
formed by the prior state to that map.

Note that the assignment of indexes to source GUIDs is strictly ordered by the
GUID's value. This allows a group of synchronizing devices to converge on a
stable set of known interlocutors.

Minimum storage to support sourcemap synchronizations:

* Primary map is own sourceGUID:index, also index:guid
* Metadata per sourceGUID:
  * first seen timestamp
  * last seen timestamp
  * 
* Map of hashes to subsets of the main map
  * timestamp of last sync, allows disposal of old associations
* Map of selected timeslices with corresponding hashes.

### Simple sourcemap sync

For simpler applications, one can use a single-layered sync:

* Send the entire map each time
* Send the hash; if not recognized, exchange the full map
* Receivers can just insist on their own map; if they come into contact with
  later information, they just add the new information to their own map and
  proceed. If in contact with a device that is missing syncees, they will be
  installed to it in the process.


## Data Field Value Sync

Records are actually built up out of an open-ended sequence of operations that
define their field values and the way those values change over time. Any
alterations to the shared data store are captured in these operations. Each
operation is assigned a source and a "sequence number", an ordinal value that
repesents the state of the data store after that operation has completed.

Each operation also has a destination, a record identifier that the operation
will modify in some way. The typical operations are:

* create - make a record with zero or more field values
* destroy - remove a record
* set - assign a specific value to one or more field(s)
* adjust - perform arithmetic addition with the value of a field
* delete - remove a field
* append - add text to a string field
* group - a set of operations that should run without interruption

It is possible to be quite efficient with this storage, and only store each
possible value of the field in question once. The field identifiers themselves
can be indexed to furher compress run-time storage requirements.

## MVP

If the account is restricted to a "reasonable" (say, less than 100 over the
lifetime of a database) number of devices, an easy-to-manage sync mechanism can
be used. Also, if some reasonable method for coalescing old devices can be
devised, the device count limit can be removed.

## opslog

The opslog is the primary synchronization mechanism between devices. This
records all the actions made with a particular device, in the order that they
happened. Each opslog entry comprises an absolute timestamp, an implied device
id, an implied sequence number, and one of the following instructions:

* newRecord fields{name:value}
* set id fields{name:value}
* add id fields{name:+-offset}
* del id fields{name}
* delRecord id
* matchRecords id id
* synced device sequence




------------------------------------------------------------------------*/
define(function(require) {
    "use strict"

    function TransactionLoader()
    {
        this.tx = {};               // transactions by id
        this.txlist = [];           // transactions by timestamp

    }

    var _public = TransactionLoader.prototype;
    var _static = TransactionLoader;

    _public.query = function(query)
    {

    }


    return TransactionLoader;
})
