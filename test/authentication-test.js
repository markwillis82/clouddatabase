/*
 * authentication-test.js: Tests for rackspace clouddatabase authentication
 *
 * Originally written by Nodejitsu Modified for cloud Database
 * (C) 2012 Mark Willis.
 * MIT LICENSE
 *
 */

var fs = require('fs'),
    path = require('path'),
    vows = require('vows'),
    assert = require('assert'),
    clouddatabase = require('../lib/clouddatabase'),
    helpers = require('./helpers');

var testData = {},
    client = helpers.createClient();

vows.describe('node-clouddatabase/authentication').addBatch({
  "The node-clouddatabase client": {
    "should have core methods defined": function () {
      assert.isObject(client.config.auth);
      assert.include(client.config.auth, 'username');
      assert.include(client.config.auth, 'apiKey');

      assert.isFunction(client.setAuth);
      assert.isFunction(client.getInstance);
    },
    "with a valid username and api key": {
      topic: function () {
        client.setAuth(this.callback);
      },
      "should respond with 200 and appropriate headers": function (err, res) {
        assert.equal(res.statusCode, 200);
        var resBody = JSON.parse(res.body);
        assert.isObject(resBody);
      },
      "should update the config with appropriate urls": function (err, res) {
        var config = client.config;
        var resBody = JSON.parse(res.body);
        assert.isObject(resBody);
        //assert.equal(resBody.serviceCatalog.cloudFiles[0]., config.serverUrl);
        //assert.equal(res.headers['x-storage-url'], config.storageUrl);
        //assert.equal(res.headers['x-cdn-management-url'], config.cdnUrl);
        //assert.equal(res.headers['x-auth-token'], config.authToken);
      }
    },
    "with an invalid username and api key": {
      topic: function () {
        var badClient = clouddatabase.createClient({
          "auth": {
            "username": "fake",
            "apiKey": "data"
          }
        });

        badClient.setAuth(this.callback);
      },
      "should respond with 401": function (err, res) {
        assert.equal(err, "Username or api key is invalid");
      }
    }
  }
}).export(module);