//http://stackoverflow.com/questions/42408265/plot-new-york-neighborhoods-with-d3-js

//Defining the SVG attributes
var margin_map2 = {top: 20, right: 5, bottom: 5, left: 5};
var width_map2 = 600 - margin_map2.left - margin_map2.right,
    height_map2 = 500 - margin_map2.top - margin_map2.bottom;
//Appended svg to div
var svg_map2 = d3.select("#chart-container2")
  .append("svg")
    .attr("class", "map2")
    .attr("width", width_map2 + margin_map2.left + margin_map2.right)
    .attr("height", height_map2 + margin_map2.top + margin_map2.bottom)
  .append("g")
    .attr("transform", "translate(" + margin_map2.left + "," + margin_map2.top + ")")

//Queing the data
d3.queue()
      .defer(d3.json,"ntasWPoptopo.json")
      .await(ready2);

//Defining colors for the plot
var colors = [d3.rgb(0,0,255),d3.rgb(0,255,0),d3.rgb(255,0,0)]

//Defining a function to plot the data
function ready2(error, ny) {
  if (error) return console.warn(error);
  var nyfeatures2 = topojson.feature(ny,ny.objects.ntasWPop)//Making a new variable containing the important data from the topojson.  dict->dict->dict->list->dict.... is reformed to list->dict->...
  var projection2 = d3.geoAlbersUsa()//Fitting the projection of the map to our SVG with the projection AlbersUSA
  .fitSize([width_map2, height_map2], nyfeatures2)
  var path2 = d3.geoPath() //Defining a path to rescale our coordinates to the SVG
      .projection(projection2);
  //Creating all the NTAs paths (polygons) on the svg
  var nyPaths2 = svg_map2.selectAll(".ny-neighborhoods2")
      .data(nyfeatures2.features)
      .enter().append("path")
      .attr("class", "ny-neighborhoods2")
      .attr("d", function(d) { return path2(d); }) //Making of the polygons
      .style("fill",d3.rgb(150,150,255)) //Coloring
      .on("mouseover", function(d) {  //mouseover color
          d3.select(this).style("fill", "#FD783A");
      })
      .on("mouseout", function(d){ // mouseout color
          return d3.select(this).style("fill",d3.rgb(150,150,255))
      })
      .append("title")
      .text(function(d){return d.properties.NTAName })
   //Plot scatterplot on top
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
