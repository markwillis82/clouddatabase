var clouddatabase = require('./lib/clouddatabase'),
	helpers = require('./test/helpers');

var client = helpers.createClient();


console.log("Setup Auth");

client.setAuth(function(err) {

	console.log("Get List of Instances");
	client.getInstances(/*true,*/function(err, instances) {
		instances.forEach(function(item) {
			console.log("name: "+item.name+ ": " + item.status);
		});
		if(instances.length) {
			var item = instances.pop();
			if(item.status == "ACTIVE") {
				processDB(item); // run all commands == shutdown
			} else {
				console.log("Wait for server finish");
				item.setWait({ status: 'ACTIVE' }, 5000, function () {
					console.log("Should be active");
				});
			}
		} else {
			console.log("No Servers -- Start One");

			console.log("Get Flavors");
			client.getFlavors(function(err,flavors) {
				var useFlavor = flavors.pop();
				//console.log(useFlavor.links[0].href);
				client.addDatabase(useFlavor.links[0].href, 1, "nodeTest", "db1", done);

			});


		}
	});

});



function done(err,body) {
	console.log(err);
	console.log(body);
	console.log("done");
}

function processDB(item) {
	console.log("ID: "+item.id);
	console.log("Name: "+item.name);
	console.log("Status: "+item.status);
	item.getDetails(function(err, items /* not used */) { // got all instance details

//			console.log(item);

/*
		console.log("Delete Instance")
		item.deleteServer(function(err) { // delete the instace we just made
			if(err) {
				console.log("Error on delete: "+ err);
			}
		}); */

		console.log("List Databases");
		item.getDatabases(function(err, databases) {
			console.log(databases);
		});

/*		console.log("Add New Database");
		var options = [{
			name: "NewDB2"
		}];

		item.addDatabase(options, function(err) {
			if(err) {
				console.log("Error on add: "+ err);
			}
		}); */

/*		console.log("Delete Databases");
		item.deleteDatabase("NewDB2", function(err) {
			if(err) {
				console.log("Error on delete: "+ err);
			}
		}); */


		console.log("List Users");
		item.getUsers(function(err, users) {
			console.log(users);
		});

/*		console.log("Add New User");
		var options = [{
			name: "mark",
			password: "mark",
			database: "db1"
		}];

		item.addUser(options, function(err) {
			if(err) {
				console.log("Error on add: "+ err);
			}
		});
*/

/*		console.log("Delete User");
		item.deleteUser("mark", function(err) {
			if(err) {
				console.log("Error on delete: "+ err);
			}
		});
*/

/*		console.log("Resize Instance - Change Flavor");

		item.resizeFlavor({flavorRef: 2}, function(err) {
			if(err) {
				console.log("Error on resize: "+ err);
			}
			console.log("Waiting for resize");
			item.setWait({ status: 'ACTIVE' }, 5000, function () {
				console.log("Should be active");
			});

		}); */


/*
		console.log("Resize Instance - Change Flavor");

		item.resizeFlavor({flavorRef: 2}, function(err) {
			if(err) {
				console.log("Error on resize: "+ err);
			}
			console.log("Waiting for resize");
			item.setWait({ status: 'ACTIVE' }, 5000, function () {
				console.log("Should be active");
			});

		}); */

/*
		console.log("Resize Instance - Volume");

		item.resizeVolume({volume: { size: 3 } }, function(err) {
			if(err) {
				console.log("Error on volume resize: "+ err);
			}
			console.log("Waiting for resize");
			item.setWait({ status: 'ACTIVE' }, 5000, function () {
				console.log("Should be active");
			});

		});
*/

/*
		console.log("Restart Instance");

		item.restart(function(err) {
			if(err) {
				console.log("Error on restart: "+ err);
			}
			console.log("Waiting for restart");
			item.setWait({ status: 'ACTIVE' }, 5000, function () {
				console.log("Should be active");
			});

		});
*/

/*
		console.log("Check Root User Enabled");

		item.checkRootUser(function(err, body) {
			if(err) {
				console.log("Error on check root user: "+ err);
			}
			console.log(body);

		});
*/

/*
		console.log("Enable Root User");

		item.enableRootUser(function(err, body) {
			if(err) {
				console.log("Error on enable root user: "+ err);
			}
			console.log(body);

		});
*/

	});
}