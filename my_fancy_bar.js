<!--Making bar plots -->
  //var dataset = [ 25, 7, 5, 26, 11, 8, 25, 14, 23, 19,14, 11, 22, 29, 11, 13, 12, 17, 18, 10,24, 18, 25, 9, 3 ];
  var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
                11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];
  //var dataset = [];
  var w=600;
  var h=250;
  var barPadding = 1;
  //for (var i = 0; i < 25; i++) {
  //  var newNumber = Math.floor(Math.random()*30);
  //  dataset.push(newNumber);
  //}
  var svg =  d3.select("#my_fancy_bar")
                .append("svg")
                .attr("width",w)
                .attr("height",h);
  var xScale = d3.scale.ordinal()
                 .domain(d3.range(dataset.length))
                 .rangeRoundBands([0,w],0.05);


      svg.selectAll("rect")
         .data(dataset)
         .enter()
         .append("rect")
         .attr({
              x: function(d, i) { return i * (w / dataset.length); },
              y: function(d) { return h - (d * 4); },
              width: w / dataset.length - barPadding,
              height: function(d) { return d * 4; },
              fill: function(d) { return "rgb(0, 0, " + (d * 10) + ")"; }
         });
      svg.selectAll("text")
          .data(dataset)
          .enter()
          .append("text")
          .text(function(d){return d})
          .attr({
            x: function(d,i){ return i*(w/dataset.length)+(w/dataset.length -barPadding)/2;},
            y: function(d) { return h - (d*4)+14;},
            "font-family": "sans-serif",
            "font-size": "11px",
            "fill": "white",
            "text-anchor": "middle"
          });
