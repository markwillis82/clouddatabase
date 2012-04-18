/**
	Rackspace database api calls.
**/

var utils = require("./utils");

var Database = function (client, details) {
  if (!details) throw new Error("CloudDatabase must be constructed with at least basic details.")

  	this.client = client;
	this._setProperties(details);

};

Database.prototype = {
	//
	// Helper method for performing 'Server Actions' to /instances/:id/action
	// e.g. Reboot, Rebuild, Resize, Confirm Resize, Revert Resize
	//
	databaseAction: function (id, body, client, callback) {
	  var actionOptions = {
	    method: 'POST',
	    client: client,
	    uri: ['instances', id, 'action'],
	    body: body
	  };

	  utils.rackspace(actionOptions, callback, function (body, res) {
	    callback(null, res);
	  });
	},

	//
	// Sets the properties for this instance
	// Parameters: details
	//
	_setProperties: function (details) {
		// Set core properties
		this.id = details.id;
		this.links = details.links;
		this.status = details.status;
		this.name = details.name;
		this.flavor = details.flavor;
		this.created = details.created;
		this.updated = details.updated;
		this.hostname = details.hostname;
		this.volume = details.volume;
		this.rootEnabled = details.rootEnabled;


	},

	getDetails: function(callback) {
		var self = this;
		this.client.getInstance(this.id, function(err, info) {
			self._setProperties(info.instance);
			callback(null, self);
		})
	},

	getDatabases: function(callback) {
	  var actionOptions = {
	    method: 'GET',
	    client: this.client,
	    uri: '/instances/'+this.id+'/databases'
	    ,
	  };


	  utils.rackspace(actionOptions, callback, function (body) {
	    callback(null, body);
	  });
	},

	deleteServer: function(callback) {
	  var actionOptions = {
	    method: 'DELETE',
	    client: this.client,
	    uri: '/instances/'+this.id,
	  };


	  utils.rackspace(actionOptions, callback, function (body) {
	    callback(null, body);
	  });

	},

	getVersion: function () {
		console.log("something");

	}
};

exports.Database = Database;