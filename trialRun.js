var clouddatabase = require('./lib/clouddatabase'),
    helpers = require('./test/helpers');

var client = helpers.createClient();


console.log("Setup Auth");

client.setAuth(function() {

	console.log("Get List of Instances");
	client.getInstances(/*true,*/function(err, instances) {
		instances.forEach(function(item) {
			console.log("name: "+item.name+ ": " + item.status);
		});
		if(instances.length) {
			var item = instances.pop();
			console.log(item);
			if(item.status == "ACTIVE") {
				processDB(item); // run all commands == shutdown
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
		/*
		console.log("Delete Instance")
		item.deleteServer(function(err) { // delete the instace we just made
			if(err) {
				console.log("Error on delete: "+ err);
			}
		});*/

		console.log("List Databases");
		item.getDatabases(function(err, databases) {
			console.log(databases)
		})
	});
}