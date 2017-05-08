//Width and height


// set the dimensions and margins of the graph
var margin_bar = {top:50, right: 20, bottom: 20, left: 50},
    w = 1000 - margin_bar.left - margin_bar.right,
    h = 500 - margin_bar.top - margin_bar.bottom,
    padding = 100;

//Create svg_bar element
var svg_bar = d3.select("#bar_plot_div")
.append("svg")
.attr("class","bar_plot_svg")
.attr("width", w + margin_bar.left + margin_bar.right)
.attr("height", h + margin_bar.top + margin_bar.bottom)
.attr("transform","translate(" + margin_bar.left + "," + margin_bar.top+ ")");;


plot_bar_plot("incidents_per_year.json","Yearly development")

//On click, update with new data
d3.selectAll("#bar_plot_button")
.on("click", function() {
  //See which p was clicked
  var paragraphID = d3.select(this).attr("value2");
  var titel = d3.select(this).attr("value");
  plot_bar_plot(paragraphID, titel)
})


function plot_bar_plot(dataset_name, titel){
  d3.json(dataset_name, function(dataset){
    var svg_bar = d3.select(".bar_plot_svg")

    var xScale = d3.scaleBand()
    //.domain(d3.range([d3.min(dataset, function(d) { return d.indeces; }),d3.max(dataset, function(d) { return d.indeces; })]))
    .domain(dataset.map(function(d){ return d.indeces; }))
    .range([padding, w ]);
    var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) { return d.count; })])
    .range([h, padding/2]);

    var xAxis_bar = d3.axisBottom(xScale).ticks(5);
    var yAxis_bar = d3.axisLeft(yScale).ticks(5);



  //Enter…
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
  //Update…
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

  //Exit…
  svg_bar.selectAll("rect").data(dataset).exit()
  .transition()
  .duration(500)
  .attr("height", 0)
  .attr("y",h)
  .remove();
  //Update all labels


  //Enter…
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
  //Update…
  svg_bar.selectAll(".bar_text").data(dataset).transition()
  .duration(500)
  .text(function(d) {return d.count;})
  .attr("x", function(d) {
    return xScale(d.indeces) + xScale.bandwidth() / 2;
  })
  .attr("y", function(d) {
    return  yScale(d.count) + 14;
  });
  //Exit…
  svg_bar.selectAll(".bar_text").data(dataset).exit()
  .transition()
  .duration(500)
  .attr("y", h+11)
  .remove();
  if (svg_bar.selectAll(".bar_x_axis").empty()){
    svg_bar.append("g")
    .attr("class","bar_x_axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis_bar);

    // Add the Y Axis
    svg_bar.append("g")
    .attr("class","bar_y_axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis_bar);
  }
  else {
    svg_bar.selectAll(".bar_x_axis").transition().duration(500).call(xAxis_bar);
    svg_bar.selectAll(".bar_y_axis").transition().duration(500).call(yAxis_bar);
  }

  if (dataset_name ==   "incidents_per_year.json"){
    svg_bar.selectAll(".label_bar_xAxis").remove()
    svg_bar.append("text")
          .attr("class","label_bar_xAxis")
          .attr("transform",
                "translate(" + ((w + margin_bar.right + margin_bar.left)/2) + " ," +
                               (h + margin_bar.top + margin_bar.bottom-padding/3) + ")")
          .style("text-anchor", "middle")
          .text("Year");
  }
  else{
    svg_bar.selectAll(".label_bar_xAxis").remove()
    svg_bar.append("text")
          .attr("class","label_bar_xAxis")
          .attr("transform",
                "translate(" + ((w + margin_bar.right + margin_bar.left)/2) + " ," +
                               (h + margin_bar.top + margin_bar.bottom-padding/3) + ")")
          .style("text-anchor", "middle")
          .text("Hour");
  }
  svg_bar.selectAll(".label_bar_yAxis").remove()
  svg_bar.append("text")
    .attr("class", "label_bar_yAxis")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 + margin.left/2)
    .attr("x",0 - (h / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Amount of "+dataset_name.split('_')[0]);

  svg_bar.selectAll(".titel_bar").remove()
  svg_bar.append("text")
        .attr("class","titel_bar")
        .attr("x", (w + margin_bar.right + margin_bar.left)/2)
        .attr("y", 0 + (margin.top))
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("text-decoration", "underline")
        .text(titel);

})}
