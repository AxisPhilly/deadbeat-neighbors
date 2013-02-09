var app = {};

app.getClass = function(dimValue) {
  var color = '';
  switch(true) {
    case (dimValue === 0):
      color = "step-zero";
      break;
    case ((dimValue > 0) && (dimValue < 1000000)):
      color = "step-one";
      break;
    case ((dimValue >= 1000000) && (dimValue < 10000000)):
      color = "step-two";
      break;
    case ((dimValue >= 10000000) && (dimValue < 100000000)):
      color = "step-three";
      break;
    case (dimValue >= 100000000):
      color = "step-four";
      break;
    default:
      color = "foo";
      break;
  }

  return color;
};

app.getDimValue = function(id, data) {
  var dimValue;

  for(var i=0; i<data.length; i++) {
    if(id === data[i].hood) {
      dimValue = data[i].dimValue;
    }
  }

  return dimValue;
};

//http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
Number.prototype.formatMoney = function(){
  var c=2, d='.', t=',';
  var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

d3.json("data/summary.json", function(error, data){

  // Map Stuff
  app.map = {};

  d3.json("data/neighborhoods-topo.json", function(error, topology) {
  
  app.map.path = d3.geo.path()
    .projection(d3.geo.mercator([-75.118,40.0020])
    .scale(438635)
    .translate([91727, 53480]));

  app.map.svg = d3.select("#map").append("svg")
    .attr("viewBox", "0 0 400 435")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("width", 400)
    .attr("height", 435);

  app.map.svg.selectAll("path")
      .data(topojson.object(topology, topology.objects.neighborhoods).geometries)
    .enter().append("path")
      .attr("d", app.map.path)
      .attr("class", function(d) {
        var dimValue = app.getDimValue(d.id, data);
        return app.getClass(dimValue);
      })
      .on("mouseover", function(d){
        d3.select('#neighborhood span').html(d.id);

        var dimValue = app.getDimValue(d.id, data) || 0;
        d3.select('#dim-value span').html('$' + dimValue.formatMoney());
      })
      .on("click", function(d) {

      })
      .call(function(){

        var ratio = 400 / 435;

        if(window.innerWidth < 400) {
          d3.select("#map svg")
            .attr("width", window.innerWidth - 40)
            .attr("height", (window.innerWidth - 40) / ratio);
        }
      });
  });
});