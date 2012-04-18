/*
 * helpers.js: Test helpers for node-clouddatabase
 *
 * Originally written by Nodejitsu Modified for cloud Database
 * (C) 2012 Mark Willis.
 * MIT LICENSE
 *
 */

var assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    util = require('util'),
    vows = require('vows'),
    clouddatabase = require('../lib/clouddatabase');

var helpers = exports,
    testConfig,
    client;

helpers.createClient = function () {
  if (!testConfig) {
    helpers.loadConfig();
  }

  if (!client) {
    client = clouddatabase.createClient(testConfig);
  }

  return client;
};

helpers.loadConfig = function () {
  try {
    var configFile = path.join(__dirname, 'fixtures', 'test-config.json'),
        stats = fs.statSync(configFile),
        config = JSON.parse(fs.readFileSync(configFile).toString());

    if (config.auth.username === 'test-username'
        || config.auth.apiKey === 'test-apiKey') {
      util.puts('Config file test/fixtures/test-config.json must be created with valid data before running tests');
      process.exit(0);
    }

    testConfig = config;
    return config;
  }
  catch (ex) {
    util.puts('Config file test/fixtures/test-config.json must be created with valid data before running tests');
    process.exit(0);
  }
};

helpers.assertServer = function (server) {
  assert.instanceOf(server, clouddatabase.Server);
  assert.isNotNull(server.id);
  assert.isNotNull(server.name);
};

helpers.assertServerDetails = function (server) {
  helpers.assertServer(server);
  assert.isNotNull(server.progess);
  assert.isNotNull(server.imageId);
  assert.isNotNull(server.flavorId);
  assert.isNotNull(server.status);
  assert.isNotNull(server.hostId);
  assert.isNotNull(server.addresses);
};

helpers.assertImage = function (image) {
  assert.instanceOf(image, clouddatabase.Image);
  assert.isNotNull(image.id);
  assert.isNotNull(image.name);
};

helpers.assertImageDetails = function (image) {
  helpers.assertImage(image);
  assert.isNotNull(image.updated);
  assert.isNotNull(image.created);
  assert.isNotNull(image.status);
};

helpers.assertFlavor = function (flavor) {
  assert.instanceOf(flavor, clouddatabase.Flavor);
  assert.isNotNull(flavor.id);
  assert.isNotNull(flavor.name);
};

helpers.assertFlavorDetails = function (flavor) {
  helpers.assertFlavor(flavor);
  assert.isNotNull(flavor.ram);
  assert.isNotNull(flavor.disk);
};