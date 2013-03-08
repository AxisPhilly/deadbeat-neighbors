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
        case ((dimValue >= 1000000) && (dimValue < 50000000)):
          color = "step-two";
          break;
        case ((dimValue >= 50000000) && (dimValue < 100000000)):
          color = "step-three";
          break;
        case ((dimValue >= 100000000) && (dimValue < 200000000)):
          color = "step-four";
          break;
        case (dimValue >= 200000000):
          color = "step-five";
          break;
        default:
          color = "step-zero";
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
          }).appendTo('#map').show();
        }

      var offset = $('#map').offset();

      $(document).mousemove(function(e){
        var posX = e.pageX - offset.left;
            posY = e.pageY - offset.top - 100;

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
      range: "",
      x: 0
    },
    {
      className: "step-one",
      range: "$0",
      x: 30
    },
    {
      className: "step-two",
      range: "$1 M",
      x: 112
    },
    {
      className: "step-three",
      range: "$50 M",
      x: 178
    },
    {
      className: "step-four",
      range: "$100 M",
      x: 240
    },
    {
      className: "step-five",
      range: "$200 M",
      x: 310
    }
  ]
};

app.run = function() {
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
      .attr("height", 10)
      .attr("width", 63)
      .attr("y", 20)
      .attr("x", function(d, i) { return i * 65 + 1; })
      .attr("class", function(d) { return d.className; });

  app.legend.append("line")
      .attr("x1", function(d, i) { return (i + 1) * 65; })
      .attr("y1", 20)
      .attr("x2", function(d, i) { return (i + 1) * 65; })
      .attr("y2", 35)
      .attr("class", function(d, i) { if(i === 5) return 'last'; });

  app.legend.append("text")
      .text(function(d) { return d.range; })
      .attr("x", function(d, i) { return d.x; })
      .attr("y", 45)
      .call(function() {

        if(window.innerWidth < 400) {
          d3.select("#legend svg").
            attr("width", window.innerWidth - 20);
        }
      });

  d3.select("#legend svg").append("text")
      .text("Aggregate Diminished Value")
      .attr("y", 10)
      .attr("class", "title");

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
          var dimValue = app.getDimValue(d.id, data) || 0,
              fDimValue = '$0';

          if(dimValue && dimValue < 1000000) {
            fDimValue = '< $1 Million';
          }  else if (dimValue >= 1000000) {
            fDimValue = '$' + (dimValue / 1000000).toFixed(0) + ' Million';
          }

          app.showToolTip(d.id, fDimValue);
        })
        .on("mouseout", function(d){
          app.hideTooltip();
        })
        .on("click", function(d) {
          var dimValue = app.getDimValue(d.id, data) || 0,
              fDimValue = '$' + dimValue / 1000000 + ' Million';

          app.showToolTip(d.id, fDimValue);
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
};