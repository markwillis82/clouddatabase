/*
 * core.js: Core functions for accessing rackspace cloud servers
 *
 * Originally written by Nodejitsu Modified for cloud Database
 * (C) 2012 Mark Willis.
 * MIT LICENSE
 *
 */

var http = require('http'),
    url = require('url'),
    request = require('request'),
    clouddatabase = require('../clouddatabase'),
    utils = require('./utils');

var defaultAuthUrl = 'lon.identity.api.rackspacecloud.com/',
    serverUrl = 'servers.api.rackspacecloud.com';

exports.createClient = function (options) {
  return new Client(options);
};

var Client = exports.Client = function (options) {
 if (!options.auth) throw new Error ('options.auth is required to create Config');

 this.config = options;
 this.config.serverUrl = 'https://' + (this.config.serverUrl || serverUrl);
 this.authorized = false;
};

//
// Authenticates node-clouddatabase with the specified options:
// { username: "your-username", apiKey: "your-secret-key" }
//
Client.prototype.setAuth = function (callback) {
  var self = this;
  var authUrl = this.config.auth.host || defaultAuthUrl;

  var body = JSON.stringify({
      "credentials": {
        'username': this.config.auth.username,
        'key': this.config.auth.apiKey
      }
    });

  var authOptions = {
    uri: 'https://' + authUrl + 'v1.1/auth',
    headers: {
      'HOST': authUrl,
      'Content-Type' : 'application/json',
      'Accept' : 'application/json'
    },
    body: body
  };

  request.post(authOptions, function (err, res, body) {
    if (err) return callback(err);

    var jsonBody = JSON.parse(body);

    self.authorized = true;
    self.config.serverUrl = 'https://lon.databases.api.rackspacecloud.com/v1.0/10007234';//jsonBody.auth.serviceCatalog.cloudServers[0].publicURL;
    self.config.authToken = jsonBody.auth.token.id;

    self.serverUrl = self.config.serverUrl;

    callback(null, res);
  });
};

//
// Gets all flavors (i.e. size configurations) for the authenticated username / apikey.
// Parameters: details? callback
//
Client.prototype.getFlavors = function () {
  var self = this, details = false, callback;

  if (typeof arguments[0] === 'function') {
    callback = arguments[0];
  }
  else {
    details = arguments[0];
    callback = arguments[1];
  }

  var flavorPath = details ? '/flavors/detail.json' : '/flavors.json';
  utils.rackspace([flavorPath], this, callback, function (body) {
    var flavorInfo = JSON.parse(body), results = [];
    flavorInfo.flavors.forEach(function (info) {
      results.push(new (clouddatabase.Flavor)(self, info));
    });

    callback(null, results);
  });
};

// create Database Server
Client.prototype.addDatabase = function (flavorId, dbSize, instanceName, databaseName, callback) {
  var options = {
    "instance": {
      "databases": [
          {
            "name": databaseName
          }
        ]
      ,
      "flavorRef": flavorId,
      "name": instanceName,
      "volume": {
        "size": dbSize.toString()
      }
    }
  }

/*var options = {
    "instance": {
        "databases": [
            {
                "character_set": "utf8",
                "collate": "utf8_general_ci",
                "name": "sampledb"
            }, {
                "name": "nextround"
            }
        ],
        "flavorRef": "https://lon.databases.api.rackspacecloud.com/v1.0/10007234/flavors/2",
        "name": "json_rack_instance",
        "volume": {
          "size": "2"
        }
      }
    }
*/
  console.log(options);

  var instancePath = "/instances";

  var createOptions = {
    method: 'POST',
    uri: [instancePath],
    client: this,
    body: options
  };

  utils.rackspace(createOptions, callback, function (body) {
    console.log(body);
    //callback(null, results);
  });

}


//
// Gets all instances of the any databases currently setup
// Parameters: details (boolean) , callback
//
Client.prototype.getInstances = function () {
  var self = this, details = false, callback;

  if (typeof arguments[0] === 'function') {
    callback = arguments[0];
  }
  else {
    details = arguments[0];
    callback = arguments[1];
  }

  var flavorPath = details ? "/instances/detail" : "/instances";


  utils.rackspace([flavorPath], this, callback, function (body) {

    var instanceInfo = JSON.parse(body), results = [];
    instanceInfo.instances.forEach(function (info) {

      results.push(new (clouddatabase.Database)(self, info));
    });

    callback(null, results);
  });
}

//
// Gets details of single database
// Parameters: instanceId, callback
//
Client.prototype.getInstance = function (instanceId, callback) {
  var self = this;

  var flavorPath = "/instances/"+instanceId;


  utils.rackspace([flavorPath], this, callback, function (body) {
    var instanceInfo = JSON.parse(body), results = [];
    callback(null, instanceInfo);
  });

};
