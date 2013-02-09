var app = {};

  app = {
    getClass: function(dimValue) {
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
    },

    getDimValue: function(id, data) {
      var dimValue;

      for(var i=0; i<data.length; i++) {
        if(id === data[i].hood) {
          dimValue = data[i].dimValue;
        }
      }

      return dimValue;
    },

    showToolTip: function(hood, dimValue, x, y) {
      contents = '<div id="neighborhood"><span>' + hood +'</span></div>' +
                  '<div id="dim-value"><i>Diminished Value:</i> <span>' + dimValue + '</span></div>';

      if ($('.hover').length) {
          $('.hover').html(contents).show();
        } else {
          $('<div/>', {
            'class': 'hover',
            html: contents
          }).appendTo('body').show();
        }

      var offset = $('body').offset();

      $(document).mousemove(function(e){
        var posX = e.pageX - 120;
            posY = e.pageY - 90;

        $('.hover').css({ left: posX, top: posY });
      });
    },

  hideTooltip: function() {
    $('.hover').hide();
    $(document).unbind('mousemove');
  },

  legendItems: [
    {
      className: "step-zero",
      range: "$0"
    },
    {
      className: "step-one",
      range: "< $1,000,000 "
    },
    {
      className: "step-two",
      range: "< $10,000,000"
    },
    {
      className: "step-three",
      range: "< $100,000,000"
    },
    {
      className: "step-four",
      range: ""
    }
  ]
};

//http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
Number.prototype.formatMoney = function(){
  var c=2, d='.', t=',';
  var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

// Legend
app.legend = d3.select("#legend").append("svg")
    .attr("height", 50)
    .attr("width", 400)
    .attr("viewBox", "0 0 400 50")
    .attr("preserveAspectRatio", "xMidYMid")
  .selectAll("g")
    .data(app.legendItems)
  .enter().append("g");

app.legend.append("rect")
    .attr("height", 20)
    .attr("width", 80)
    .attr("x", function(d, i) { return i * 80; })
    .attr("class", function(d) { return d.className; });

app.legend.append("text")
    .text(function(d) { return d.range; })
    .attr("x", function(d, i) { return i * 30; })
    .attr("y", 35)
    .call(function() {

      if(window.innerWidth < 400) {
        d3.select("#legend svg").
          attr("width", window.innerWidth - 20);
      }
    });


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
      .attr("id", function(d){
        return d.id;
      })
      .on("mouseover", function(d){
        var dimValue = app.getDimValue(d.id, data) || 0;

        app.showToolTip(d.id, '$' + dimValue.formatMoney());
      })
      .on("mouseout", function(d){
        app.hideTooltip();
      })
      .on("click", function(d) {
        var dimValue = app.getDimValue(d.id, data) || 0;

        app.showToolTip(d.id, '$' + dimValue.formatMoney());
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