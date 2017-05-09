//http://stackoverflow.com/questions/42408265/plot-new-york-neighborhoods-with-d3-js


// Defining SVG size
var margin_map = {top: 20, right: 0, bottom: 5, left: 0};
var width_map = 600 - margin_map.left - margin_map.right,
    height_map = 500 - margin_map.top - margin_map.bottom;

// Appending a SVG to the div
var svg_map = d3.select("#chart-container")
  .append("svg")
    .attr("class", "map")
    .attr("width", width_map + margin_map.left + margin_map.right)
    .attr("height", height_map + margin_map.top + margin_map.bottom)
    .call(d3.zoom().scaleExtent([1, 8]).translateExtent([[-100, -100], [width + 90, height + 400]]) //Applying the zoom function to the SVG
            .on("zoom", function () {
            svg_map.attr("transform", d3.event.transform); //SVG zoom
            d3.selectAll(".ny-neighborhoods")
            .style("stroke-width",0.5/d3.event.transform.k); //Rescaling the widths of the border lines
                }))
    .append("g")  //Appending the element containing the map
    .attr("transform", "translate(" + margin_map.left + "," + margin_map.top + ")") //Tranlating the element to maintain the map margin_

//Appending an overlay so the zoom function works all over the SVG
svg_map.append("rect")
    .attr("class", "overlay")
    .attr("width", width_map)
    .attr("height", height_map);


//Appending a new SVG to contain the color-map
var svg_map_color_bar = d3.select("#chart-container_color_bar")
    .append("svg")
    .attr("class", "map_bar")
    .attr("width", width_map + margin_map.left + margin_map.right+100)
    .attr("height", 50)

var svg_map_title = d3.select("#chart-container-title")
    .append("svg")
    .attr("class", "map_bar_title")
    .attr("width", width_map + margin_map.left + margin_map.right)
    .attr("height", 50)
    .append("g")
    .attr("transform", "translate(" + width_map/2 + "," + 0 + ")");


//Defining the width of the color-bar
var legendWidth = Math.min(width_map*0.8, 400)

//Defining a gradient to make the color bar
var gradient = svg_map_color_bar.append("defs")
    .append("linearGradient")
    .attr("id","linear-gradient")
    .attr("x1", "0%").attr("y1", "0%")  //Goes from left to right
    .attr("x2", "100%").attr("y2", "0%");

//Appending the left color of the color bar
gradient.append("stop")
    .attr("offset","0%")
    .attr("stop-color",d3.rgb(255,255,255)) //White
    .attr("stop-opacity", 1);

//Appending the right color of the color bar
gradient.append("stop")
    .attr("offset","100%")
    .attr("stop-color",d3.rgb(0,0,255)) //Blue
    .attr("stop-opacity", 1);

//Appending the actual color bar
var legendsvg = svg_map_color_bar.append("g")
    .attr("class","legendWrapper")
    .attr("transform", "translate(" + width_map/2 + "," + 0 + ")");


//Call our dataset
d3.queue()
      .defer(d3.json,"ntasWPoptopo.json")
      .await(ready); //Run our funciton


//Function which plots the NYC map on top of our SVG.
// Input topojson file
function ready(error, ny) {
  if (error) return console.warn(error); //Veryfying dataset

  var data_kind = "Change to incident density"  //Assigning initial type
  var nyfeatures = topojson.feature(ny,ny.objects.ntasWPop)  //Making a new variable containing the important data from the topojson.  dict->dict->dict->list->dict.... is reformed to list->dict->...
  var pop_max_per_area = d3.max(nyfeatures.features, function(d) { return d.properties.population/d.properties.Shape__Area; })  //Getting the max value of the population per area to define scales
  var xScale_map_max = pop_max_per_area/9456.49240963  //Rescaling the max value since the Shape__Area is an internal unit squared area
  var pop_scale = d3.scaleLinear().domain([0,pop_max_per_area]).range([255, 0])  //Defining a linear scalefuntion
  var projection = d3.geoAlbersUsa()  //Fitting the projection of the map to our SVG with the projection AlbersUSA
  .fitSize([width_map, height_map], nyfeatures)
  var path = d3.geoPath()  //Defining a path to rescale our coordinates to the SVG
      .projection(projection);

//Creating all the NTAs paths (polygons) on the SVG
  var nyPaths = svg_map.selectAll(".ny-neighborhoods")
      .data(nyfeatures.features)
      .enter().append("path")
      .attr("class", "ny-neighborhoods")
      .attr("d", function(d) { return path(d); }) //The making of the polygons
      .style("fill",function(d){  //Filling each polygon with the rescaled color acordding to population/area
          return d3.rgb(pop_scale(d.properties.population/d.properties.Shape__Area), pop_scale(d.properties.population/d.properties.Shape__Area),255)})
      .on("mouseover", function(d) { //Giving each polugon a mouseover color fill to indicate mouse focus
          d3.select(this).style("fill", "#FD783A");
      })
      .on("mouseout", function(d){ //Recoloring the actual population per area color
          return d3.select(this).style("fill", d3.rgb(pop_scale(d.properties.population/d.properties.Shape__Area), pop_scale(d.properties.population/d.properties.Shape__Area),255))
      })
      .append("title")  //Giving text information to the mouseover
      .text(function(d){return "NTAName : " + d.properties.NTAName + ", Population : " + d.properties.population + ", Relative area : " + d.properties.Shape__Area})
   //On buttonclick switch the data
   d3.selectAll("#map_button").on("click", function(){
     if (data_kind == "Change to incident density") { //Checking former data
          //rescalling the variables
          var pop_max_per_area = d3.max(nyfeatures.features, function(d) { return d.properties.count/d.properties.Shape__Area; })
          var pop_scale = d3.scaleLinear().domain([0,pop_max_per_area]).range([255, 0])
          var xScale_map_max = pop_max_per_area/9456.49240963
          var xScale_map = d3.scaleLinear()
            .range([-legendWidth/2, legendWidth/2])
            .domain([ 0, pop_max_per_area] );

          //Making the axis labels to the color map
          var xAxis_map = d3.axisBottom(xScale_map)
            .ticks(5);

          //Making the xaxis
          d3.selectAll(".axis_map").transition().duration(500).call(xAxis_map)

          //Appending Title
          d3.selectAll(".legendTitle").transition().duration(500).text("Incidents per square km for the period from 01-07-2012 to 31-03-2017")

          //Updating the data kind
          data_kind = "Change to population density";

          //Recoloring the polygons
          svg_map.selectAll(".ny-neighborhoods")
           .data(nyfeatures.features)
           .transition().duration(500)
           .style("fill",function(d){
               return d3.rgb(pop_scale(d.properties.count/d.properties.Shape__Area), pop_scale(d.properties.count/d.properties.Shape__Area),255)});

          //Redefining the mouseout to the new colors
          svg_map.selectAll(".ny-neighborhoods")
            .data(nyfeatures.features)
           .on("mouseout", function(d){
               return d3.select(this).style("fill", d3.rgb(pop_scale(d.properties.count/d.properties.Shape__Area), pop_scale(d.properties.count/d.properties.Shape__Area),255))
           })
        }

      //Same as above with colorchanges
      else if (data_kind == "Change to population density") {
          var pop_max_per_area = d3.max(nyfeatures.features, function(d) { return d.properties.population/d.properties.Shape__Area; })
          var pop_scale = d3.scaleLinear().domain([0,pop_max_per_area]).range([255, 0])
          var xScale_map_max = pop_max_per_area/9456.49240963
          var xScale_map = d3.scaleLinear()
            .range([-legendWidth/2, legendWidth/2])
            .domain([ 0, xScale_map_max] );
          var xAxis_map = d3.axisBottom(xScale_map)
            .ticks(5);
          d3.selectAll(".axis_map").transition().duration(500).call(xAxis_map)
          d3.selectAll(".legendTitle").transition().duration(500).text("Population per square km")
          data_kind = "Change to incident density"
          svg_map.selectAll(".ny-neighborhoods")
           .data(nyfeatures.features)
           .transition().duration(500)
           .style("fill",function(d){
               return d3.rgb(pop_scale(d.properties.population/d.properties.Shape__Area), pop_scale(d.properties.population/d.properties.Shape__Area),255)});
          svg_map.selectAll(".ny-neighborhoods")
            .data(nyfeatures.features)
            .on("mouseover", function(d) {
                d3.select(this).style("fill", "#FD783A");
           })
            .on("mouseout", function(d){
               return d3.select(this).style("fill", d3.rgb(pop_scale(d.properties.population/d.properties.Shape__Area), pop_scale(d.properties.population/d.properties.Shape__Area),255))
           })
        }
       //updating button text
       d3.selectAll("#map_button").text(data_kind)
     })
     //Fill the colorbar with the colorgradient
     legendsvg.append("rect")
         .attr("class", "legendRect")
         .attr("x", -legendWidth/2)
         .attr("y", 0)
         .attr("width", legendWidth)
         .attr("height", 10)
         .style("fill", "url(#linear-gradient)");
      //Recaling scales
      var xScale_map = d3.scaleLinear()
       .range([-legendWidth/2, legendWidth/2])
       .domain([ 0, xScale_map_max] );
      var xAxis_map = d3.axisBottom(xScale_map)
       .ticks(5);

      //Set up X axis
     legendsvg.append("g")
    	 .attr("class", "axis_map")
    	 .attr("transform", "translate(0," + 9 + ")")
    	 .call(xAxis_map);
       //Setting colormap text
      svg_map_title.append("text")
        .attr("class", "legendTitle")
        .attr("x", 0)
        .attr("y", 45)
        .style("text-anchor", "middle")
        .text("Population per square km");
}
