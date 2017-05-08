//http://stackoverflow.com/questions/42408265/plot-new-york-neighborhoods-with-d3-js

var margin_map2 = {top: 20, right: 5, bottom: 5, left: 5};
var width_map2 = 900 - margin_map2.left - margin_map2.right,
    height_map2 = 500 - margin_map2.top - margin_map2.bottom;
var svg_map2 = d3.select("#chart-container2")
  .append("svg")
    .attr("class", "map2")
    .attr("width", width_map2 + margin_map2.left + margin_map2.right)
    .attr("height", height_map2 + margin_map2.top + margin_map2.bottom)
  .append("g")
    .attr("transform", "translate(" + margin_map2.left + "," + margin_map2.top + ")")

d3.queue()
      .defer(d3.json,"ntasWPoptopo.json")
      .await(ready2);
var colors = [d3.rgb(0,0,255),d3.rgb(0,255,0),d3.rgb(255,0,0)]

function ready2(error, ny) {
  if (error) return console.warn(error);
  var nyfeatures2 = topojson.feature(ny,ny.objects.ntasWPop)
  var projection2 = d3.geoAlbersUsa()
  .fitSize([width_map2, height_map2], nyfeatures2)
  var path2 = d3.geoPath()
      .projection(projection2);
  var nyPaths2 = svg_map2.selectAll(".ny-neighborhoods2")
      .data(nyfeatures2.features)
      .enter().append("path")
      .attr("class", "ny-neighborhoods2")
      .attr("d", function(d) { return path2(d); })
      .style("fill",d3.rgb(150,150,255))
      .on("mouseover", function(d) {
          d3.select(this).style("fill", "#FD783A");
      })
      .on("mouseout", function(d){
          return d3.select(this).style("fill",d3.rgb(150,150,255))
      })
      .append("title")
      .text(function(d){return d.properties.NTAName })
   d3.json("resultKNN.json", function(error, data_points){
       if (error) return console.warn(error);
       d3.selectAll(".map2").selectAll(".KNN_data")
       .data(data_points)
       .enter()
       .append("circle")
       .attr("cx", function(d) {
               return projection2([d.longitude,d.latitude])[0];
           })
       .attr("cy", function(d) {
               return projection2([d.longitude,d.latitude])[1];
           })
       .attr("class","KNN_data")
       .attr("r",1)
       .attr("fill",function(d){ return colors[d.class]})
     })}
