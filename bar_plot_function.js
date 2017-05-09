//Width and height


// set the dimensions and margins of the graph
var margin_bar = {top:50, right: 0, bottom: 220, left: 50},
    w = 1000 - margin_bar.left - margin_bar.right,
    h = 700 - margin_bar.top - margin_bar.bottom,
    padding = 100;

//Create svg_bar element
var svg_bar = d3.select("#bar_plot_div")
.append("svg")
.attr("class","bar_plot_svg")
.attr("width", w + margin_bar.left + margin_bar.right)
.attr("height", h + margin_bar.top + margin_bar.bottom)
.attr("transform","translate(" + margin_bar.left + "," + margin_bar.top+ ")");;

//Call the plot function
plot_bar_plot("incidents_per_year.json","Yearly development")

//On click, update with new data
d3.selectAll("#bar_plot_button")
.on("click", function() {
  //See which p was clicked
  var paragraphID = d3.select(this).attr("value2");
  var titel = d3.select(this).attr("value");
  plot_bar_plot(paragraphID, titel)
})

//Function which makes the bar plot
//Input json file containing categories and amounts
function plot_bar_plot(dataset_name, titel){
  d3.json(dataset_name, function(dataset){//Calling the data

    //Defining the ordinal scale for the xaxis
    var xScale = d3.scaleBand()
    .domain(dataset.map(function(d){ return d.indeces; }))
    .range([padding, w ]);
    //Defining the linear scale for the yAxis
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) { return d.count; })])
    .range([h, padding/2]);
    //Defining the axises
    var xAxis_bar = d3.axisBottom(xScale).ticks(5);
    var yAxis_bar = d3.axisLeft(yScale).ticks(5);



  //Plotting the bar on the SVG
  svg_bar.selectAll("rect").data(dataset).enter()
  .append("rect")
  .attr("x", w)
  .attr("y", function(d) {
    return yScale(d.count);
  })
  .attr("width", xScale.bandwidth())
  .attr("height", function(d) {
    return h- yScale(d.count);
  })
  .attr("fill", function(d) {
    return "rgb(0, 0, " + 200 + ")";
  });
  //Updating the existing elements
  svg_bar.selectAll("rect").data(dataset).transition()
  .duration(500)
  .attr("x", function(d) {
    return xScale(d.indeces);
  })
  .attr("y", function(d) {
    return yScale(d.count);
  })
  .attr("width", xScale.bandwidth())
  .attr("height", function(d) {
    return h- yScale(d.count);
  });

  //Removing the left over elements
  svg_bar.selectAll("rect").data(dataset).exit()
  .transition()
  .duration(500)
  .attr("height", 0)
  .attr("y",h)
  .remove();


  //Appending bar labels
  svg_bar.selectAll(".bar_text").data(dataset).enter()
  .append("text")
  .text(function(d) {
    return d.count;
  })
  .attr("class", "bar_text")
  .attr("text-anchor", "middle")
  .attr("x", w)
  .attr("y", function(d) {
    return yScale(d.count) + 14;
  })
  .attr("font-family", "sans-serif")
  .attr("font-size", "11px")
  .attr("fill", "white");
  //Updating existing labels
  svg_bar.selectAll(".bar_text").data(dataset).transition()
  .duration(500)
  .text(function(d) {return d.count;})
  .attr("x", function(d) {
    return xScale(d.indeces) + xScale.bandwidth() / 2;
  })
  .attr("y", function(d) {
    return  yScale(d.count) + 14;
  });
  //Removing leftovers
  svg_bar.selectAll(".bar_text").data(dataset).exit()
  .transition()
  .duration(500)
  .attr("y", h+11)
  .remove();

  // If there are no xAxis (initilization), then call the xaxis
  if (svg_bar.selectAll(".bar_x_axis").empty()){
    svg_bar.append("g")
    .attr("class","bar_x_axis")
    .attr("transform", "translate(0," + h + ")")
    .attr("fill","white")
    .call(xAxis_bar)
    // Add the Y Axis
    svg_bar.append("g")
    .attr("class","bar_y_axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis_bar);
  }
  else { //Otherwise update it
    if (dataset_name == "incidents_causes.json") {
      svg_bar.selectAll(".bar_x_axis").transition().duration(500)
      .call(xAxis_bar).selectAll("text").attr("transform", "rotate(90)translate(10,-15)")
      .style("text-anchor", "start").attr("font-size",14);
      svg_bar.selectAll(".bar_y_axis").transition().duration(500).call(yAxis_bar);
    }
    else {
    svg_bar.selectAll(".bar_x_axis").transition().duration(500).call(xAxis_bar);
    svg_bar.selectAll(".bar_y_axis").transition().duration(500).call(yAxis_bar);
    }
  }

  //Updating the XAxis labels text
  if (dataset_name ==   "incidents_per_year.json"){
    svg_bar.selectAll(".label_bar_xAxis").remove()
    svg_bar.append("text")
          .attr("class","label_bar_xAxis")
          .attr("transform",
                "translate(" + ((w + margin_bar.right + margin_bar.left)/2) + " ," +
                               (h + margin_bar.top + margin_bar.bottom-padding*2) + ")")
          .style("text-anchor", "middle")
          .attr("fill","white")
          .text("Year");
  }
  else if (dataset_name == "incidents_causes.json") {
    svg_bar.selectAll(".label_bar_xAxis").remove()
    svg_bar.append("text")
          .attr("class","label_bar_xAxis")
          .attr("transform",
                "translate(" + ((w + margin_bar.right + margin_bar.left)/2) + " ," +
                               (h + margin_bar.top + margin_bar.bottom-padding*0.8) + ")")
          .style("text-anchor", "middle")
          .attr("fill","white")
          .text("");
  }
  else{
    svg_bar.selectAll(".label_bar_xAxis").remove()
    svg_bar.append("text")
          .attr("class","label_bar_xAxis")
          .attr("transform",
                "translate(" + ((w + margin_bar.right + margin_bar.left)/2) + " ," +
                               (h + margin_bar.top + margin_bar.bottom-padding*2) + ")")
          .style("text-anchor", "middle")
          .attr("fill","white")
          .text("Hour");
  }
  //Update the YAxis
  svg_bar.selectAll(".label_bar_yAxis").remove()
  svg_bar.append("text")
    .attr("class", "label_bar_yAxis")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 + margin.left/2)
    .attr("x",0 - (h / 2))
    .attr("dy", "1em")
    .attr("fill","white")
    .style("text-anchor", "middle")
    .text("Amout of "+dataset_name.split('_')[0]);

  //Update the SVG title
  svg_bar.selectAll(".titel_bar").remove()
  svg_bar.append("text")
        .attr("class","titel_bar")
        .attr("x", (w + margin_bar.right + margin_bar.left)/2)
        .attr("y", 0 + margin.top-180)
        .attr("text-anchor", "middle")
        .attr("fill","white")
        .style("font-size", "24px")
        .style("text-decoration", "underline")
        .text(titel);
  if  (dataset_name == "incidents_causes.json") {
    svg_bar.selectAll(".bar_text").remove()
  }
})}
