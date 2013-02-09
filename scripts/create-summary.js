// Create a json file which summarizes diminished cash value by neighborhood.
// Used in conjunction with d3 map

var csv = require('csv');
var fs = require('fs');

var output = [],
    total = 0;

csv()
  .from(__dirname + '/data/props_w_dim_value_hoods.csv', {columns: true})
  .on('record', function(data, index) {
    var found = 0;

    output.forEach(function(item){
      if(data.hood === item.hood) {
        found = 1;

        item.dimValue += Number(data.dim_value);
      }
    });

    if (!found) {
      output.push({
        hood: data.hood,
        dimValue: Number(data.dim_value)
      });
    }

    total += Number(data.dim_value);
  })
  .on('end', function(count) {
    console.log('Number of lines: ' + count);

    fs.writeFile(__dirname + '/data/summary.json', JSON.stringify(output, null, 2), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log(total);
        console.log('JSON saved to ' + __dirname + '/data/summary.json');
      }
    });
  })
  .on('error', function(error) {
    console.log(error.message);
  });