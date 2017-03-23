<!--Making bar plots -->
  var dataset_bar = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
                11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];
  var maxValue_bar = d3.max(dataset_bar);
  var w_bar=600;
  var h_bar=250;
  var barPadding = 1;
  var svg_bar =  d3.select("#my_fancy_bar")
                .append("svg")
                .attr("width",w_bar)
                .attr("height",h_bar);
  var xScale_bar = d3.scale.ordinal()
                 .domain(d3.range(dataset_bar.length))
                 .rangeRoundBands([0,w_bar],0.05);
  var yScale_bar = d3.scale.linear()
                 .domain([0,d3.max(dataset_bar)])
                 .range([0,h_bar]);


  svg_bar.selectAll("rect")
     .data(dataset_bar)
     .enter()
     .append("rect")
     .attr({
          x: function(d, i) { return xScale_bar(i); },
          y: function(d) { return h_bar - yScale_bar(d); },
          width: xScale_bar.rangeBand(),
          height: function(d) { return yScale_bar(d); },
          fill: function(d) { return "rgb(0, 0, " + (d * 10) + ")"; }
     });
  svg_bar.selectAll("text")
      .data(dataset_bar)
      .enter()
      .append("text")
      .text(function(d){return d})
      .attr({
        x: function(d,i){ return xScale_bar(i)+ xScale_bar.rangeBand()/2;},
        y: function(d) { return h_bar - yScale_bar(d)+14;},
        "font-family": "sans-serif",
        "font-size": "11px",
        "fill": "white",
        "text-anchor": "middle"
      });
  d3.select("#bottom_1")
      .on("click", function(){

        //New values for dataset_bar
        var numValues = dataset_bar.length;               //Count original length of dataset_bar
        dataset_bar = [];                                       //Initialize empty array
        for (var i = 0; i < numValues; i++) {               //Loop numValues times
          var newNumber = Math.floor(Math.random() * maxValue_bar); //New random integer (0-24)
          dataset_bar.push(newNumber);                        //Add new number to array
        }
        yScale_bar.domain([0,d3.max(dataset_bar)]);
        svg_bar.selectAll("rect")
            .data(dataset_bar)
            .transition()
            .delay(function(d,i){ return i /dataset_bar.length * 1000;})
            .duration(1000)
            .attr({
              y: function(d) { return h_bar - yScale_bar(d);},
              height: function(d) { return yScale_bar(d);},
              fill: function(d) { return "rgb(0,0, " + (d*10) + ")";}
            });
        svg_bar.selectAll("text")
            .data(dataset_bar)
            .transition()
            .delay(function(d,i){ return i /dataset_bar.length * 1000;})
            .duration(1000)
            .text(function(d) {return d ;})
            .attr({
              x: function(d,i){ return xScale_bar(i) + xScale_bar.rangeBand()/2 ;},
              y: function(d) { return h_bar - yScale_bar(d) + 14 ;}
            })
      });
