[![build status](https://secure.travis-ci.org/markwillis82/clouddatabase.png)](http://travis-ci.org/markwillis82/clouddatabase)
# Rackspace Database as a Service Node.js Bindings

Initial Project to open up the Rackspace DBaaS to Node.js through there API.

Based upon https://github.com/nodejitsu/node-cloudservers as much of the api structure is the same

### Installing clouddatabase
<pre>
  npm install clouddatabase
</pre>


### Getting Started
Before we can do anything with clouddatabase, we have to create a client with valid credentials. Clouddatabase will authenticate for you automatically:
<pre>
  var clouddatabase = require('clouddatabase');
  var config = {
    auth : {
      username: 'your-username',
      apiKey: 'your-api-key'
    }
  };
  var client = clouddatabase.createClient(config);
</pre>
