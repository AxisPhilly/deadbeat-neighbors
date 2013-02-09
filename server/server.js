var httpServer = require('http').createServer(function(req, resp) {
  response.writeHead(200, {'Content-Type':'text/html'});
  response.write('hello');
  response.end();
});

httpServer.listen(3000);

var nowjs = require('now'),
    everyone = nowjs.initialize(httpServer),
    models = require('./models'),
    Property = models.Property;

// bulk load properties
/*var props1 = require('../scripts/data/props-load1.json');
var props2 = require('../scripts/data/props-load2.json');
var props3 = require('../scripts/data/props-load3.json');

Property.collection.insert(props1, {}, function(err){
  console.log(err);
});
Property.collection.insert(props2, {}, function(err){
  console.log(err);
});
Property.collection.insert(props3, {}, function(err){
  console.log(err);
});*/

// now js search function
everyone.now.search = function(text, count, callback) {
  // create regex for "contains" and ignore case
  var regex = new RegExp(text.term, 'i');
  // execute the search
  Property.find({address: regex}, function(err, docs) {
    callback(null, docs);
  });
};