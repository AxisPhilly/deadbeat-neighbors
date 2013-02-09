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

    var prop1 = new Property({
      address: '1000 Market St Foo',
      dimValue: -30,
      count: 333
    });
    prop1.save();

// now js search function
everyone.now.search = function(text, count, callback) {
  // create regex for "contains" and ignore case
  var regex = new RegExp(text.term, 'i');
  // execute the search
  Property.find({address: regex}, function(err, docs) {
    var props = [];
    for(var prop in docs) {
      // push the firstname to the array
      props.push(docs[prop].address);
    }
    // send back via callback function
    callback(null, props);
  });
};