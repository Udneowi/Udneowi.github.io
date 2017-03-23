
  //width and height
  var w = 500;
  var h = 300;
  var padding=30;

  //Dynamic dataset_scatter
  var dataset_scatter = [];											//Initialize empty array
	var numDataPoints = 50;										//Number of dummy data points to create
	var maxRange = Math.random() * 1000;						//Max range of new values
	for (var i = 0; i < numDataPoints; i++) {					//Loop numDataPoints times
		var newNumber1 = Math.floor(Math.random() * maxRange);	//New random integer
		var newNumber2 = Math.floor(Math.random() * maxRange);	//New random integer
		dataset_scatter.push([newNumber1, newNumber2]);					//Add new number to array
	}

  var xScale_scatter = d3.scale.linear()
                  .domain([0,d3.max(dataset_scatter,function(d){ return d[0]; })])
                  .range([padding,w-padding*2]);
  var yScale_scatter = d3.scale.linear()
                  .domain([0,d3.max(dataset_scatter,function(d){ return d[1]; })])
                  .range([h-padding,padding])
  var rScale_scatter = d3.scale.linear()
                  .domain([0,d3.max(dataset_scatter,function(d){return d[1];})])
                  .range([2,5]);

  var xAxis = d3.svg.axis()
     .scale(xScale_scatter)
     .orient("bottom")
     .ticks(5);
  var yAxis = d3.svg.axis()
                .scale(yScale_scatter)
                .orient("left")
                .ticks(5);
  var svg_scatter = d3.select("#d3scatter")
            .append("svg")
            .attr({
              width: w,
              height: h
            });
  svg_scatter.selectAll("circle")
            .data(dataset_scatter)
            .enter()
            .append("circle")
            .attr({
              cx: function(d){return xScale_scatter(d[0]);},
              cy: function(d){return yScale_scatter(d[1]);},
              r:  function(d){ return rScale_scatter(d[1]);}
            });



   svg_scatter.append("g")
      .attr("class", "axis")
      .attr("transform","translate(0," + (h-padding) + ")")
      .call(xAxis);
   svg_scatter.append("g")
      .attr("class","axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);

    //On click update with new data
    d3.select("#bottom_2")
      .on("click",function(){
        //New values for dataset
        var numValues = dataset_scatter.length;
        var maxRange = Math.random()*1000;
        dataset_scatter = [];
        for (var i = 0; i < numValues; i++) {				 		//Loop numValues times
						var newNumber1 = Math.floor(Math.random() * maxRange);	//New random integer
						var newNumber2 = Math.floor(Math.random() * maxRange);	//New random integer
						dataset_scatter.push([newNumber1, newNumber2]);					//Add new number to array
				}

        //Update scale domains
        xScale_scatter.domain([0,d3.max(dataset_scatter, function(d){return d[0]})]);
        yScale_scatter.domain([0,d3.max(dataset_scatter, function(d){return d[1]})]);
        rScale_scatter.domain([0,d3.max(dataset_scatter,function(d){return d[1];})]);

        //Update scircles
        svg_scatter.selectAll("circle")
            .data(dataset_scatter)
            .transition()
            .duration(1000)
            .attr({
              cx: function(d){return xScale_scatter(d[0]);},
              cy: function(d){return yScale_scatter(d[1]);},
              r:  function(d){ return rScale_scatter(d[1]);}
            })
      })
