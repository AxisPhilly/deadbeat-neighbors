// Create a set of documents containing property information for
// populating mongo instance

var csv = require('csv');
var fs = require('fs');

var output = [];

csv()
  .from(__dirname + '/data/props_w_dim_value_hoods.csv', {columns: true})
  .on('record', function(data, index) {
    output.push({
      address: data.address,
      dimPercent: Number(data.dim_percent),
      count: Number(data.count)
    });
  })
  .on('end', function(count) {
    console.log('Number of lines: ' + count);

    fs.writeFile(__dirname + '/data/props.json', JSON.stringify(output, null, 2), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log('JSON saved to ' + __dirname + '/data/props.json');
      }
    });
  })
  .on('error', function(error) {
    console.log(error.message);
  });