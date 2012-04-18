/*
 * clouddatabase.js: Wrapper for node-clouddatabase object
 *
 * Originally written by Nodejitsu Modified for cloud Database
 * (C) 2012 Mark Willis.
 * MIT LICENSE
 *
 */

var clouddatabase = exports;

// Expose version through `pkginfo`.
require('pkginfo')(module, 'version');

// Core functionality
clouddatabase.createClient = require('./clouddatabase/core').createClient;

// Type Definitions
//clouddatabase.Client = require('./clouddatabase/core').Client;
clouddatabase.Database = require('./clouddatabase/database').Database;
clouddatabase.Flavor = require('./clouddatabase/flavor').Flavor;
