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

// now js search function
everyone.now.search = function(text, count, callback) {
  // create regex for "contains" and ignore case
  var regex = new RegExp(text.term, 'i');
  // execute the search
  Property.find({address: regex}, function(err, docs) {
    callback(null, docs);
  });
};