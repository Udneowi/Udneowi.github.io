//http://stackoverflow.com/questions/42408265/plot-new-york-neighborhoods-with-d3-js

var margin_map = {top: 20, right: 5, bottom: 5, left: 5};
var width_map = 900 - margin_map.left - margin_map.right,
    height_map = 500 - margin_map.top - margin_map.bottom;
var svg_map = d3.select("#chart-container")
  .append("svg")
    .attr("class", "map")
    .attr("width", width_map + margin_map.left + margin_map.right)
    .attr("height", height_map + margin_map.top + margin_map.bottom)
    .call(d3.zoom().scaleExtent([1, 8]).translateExtent([[-100, -100], [width + 90, height + 400]])
            .on("zoom", function () {
            svg_map.attr("transform", d3.event.transform);
            d3.selectAll(".ny-neighborhoods")
            .style("stroke-width",0.5/d3.event.transform.k);
                }))
    .append("g")
    .attr("transform", "translate(" + margin_map.left + "," + margin_map.top + ")")
var svg_map_color_bar = d3.select("#chart-container_color_bar")
  .append("svg")
    .attr("class", "map_bar")
    .attr("width", width_map + margin_map.left + margin_map.right)
    .attr("height", 50)




    svg_map.append("rect")
    .attr("class", "overlay")
    .attr("width", width_map)
    .attr("height", height_map);

    var legendWidth = Math.min(width_map*0.8, 400)
    var gradient = svg_map_color_bar.append("defs")
        .append("linearGradient")
        .attr("id","linear-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%");

    gradient.append("stop")
        .attr("offset","0%")
        .attr("stop-color",d3.rgb(255,255,255))
        .attr("stop-opacity", 1);
    gradient.append("stop")
        .attr("offset","100%")
        .attr("stop-color",d3.rgb(0,0,255))
        .attr("stop-opacity", 1);
    var legendsvg = svg_map_color_bar.append("g")
        .attr("class","legendWrapper")
        .attr("transform", "translate(" + width_map/2 + "," + 0 + ")");



d3.queue()
      .defer(d3.json,"ntasWPoptopo.json")
      .await(ready);

function resetted() {
  console.log("Hi")
  svg_map.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
}
d3.select("#map_button_reset").on("click",resetted);

function ready(error, ny, hi) {
  if (error) return console.warn(error);

  var data_kind = "Change to incident density"
  var nyfeatures = topojson.feature(ny,ny.objects.ntasWPop)
  var pop_max_per_area = d3.max(nyfeatures.features, function(d) { return d.properties.population/d.properties.Shape__Area; })
  var xScale_map_max = pop_max_per_area/9456.49240963
  var pop_scale = d3.scaleLinear().domain([0,pop_max_per_area]).range([255, 0])
  var projection = d3.geoAlbersUsa()
  .fitSize([width_map, height_map], nyfeatures)
  var path = d3.geoPath()
      .projection(projection);


  var nyPaths = svg_map.selectAll(".ny-neighborhoods")
      .data(nyfeatures.features)
      .enter().append("path")
      .attr("class", "ny-neighborhoods")
      .attr("d", function(d) { return path(d); })
      .style("fill",function(d){
          return d3.rgb(pop_scale(d.properties.population/d.properties.Shape__Area), pop_scale(d.properties.population/d.properties.Shape__Area),255)})
      .on("mouseover", function(d) {
          d3.select(this).style("fill", "#FD783A");
      })
      .on("mouseout", function(d){
          return d3.select(this).style("fill", d3.rgb(pop_scale(d.properties.population/d.properties.Shape__Area), pop_scale(d.properties.population/d.properties.Shape__Area),255))
      })
      .append("title")
      .text(function(d){return d.properties.NTAName + " : " + d.properties.population + " : " + d.properties.Shape__Area})

   d3.selectAll("#map_button").on("click", function(){
     if (data_kind == "Change to incident density") {
          var pop_max_per_area = d3.max(nyfeatures.features, function(d) { return d.properties.count/d.properties.Shape__Area; })
          var pop_scale = d3.scaleLinear().domain([0,pop_max_per_area]).range([255, 0])
          var xScale_map_max = pop_max_per_area/9456.49240963
          var xScale_map = d3.scaleLinear()
            .range([-legendWidth/2, legendWidth/2])
            .domain([ 0, pop_max_per_area] );
          var xAxis_map = d3.axisBottom(xScale_map)
            .ticks(5);
          d3.selectAll(".axis_map").transition().duration(500).call(xAxis_map)
          d3.selectAll(".legendTitle").transition().duration(500).text("Incidents per square kilometer for the period from 01-07-2012 to 31-03-2017")
          data_kind = "Change to population density";
          svg_map.selectAll(".ny-neighborhoods")
           .data(nyfeatures.features)
           .transition().duration(500)
           .style("fill",function(d){
               return d3.rgb(pop_scale(d.properties.count/d.properties.Shape__Area), pop_scale(d.properties.count/d.properties.Shape__Area),255)});
          svg_map.selectAll(".ny-neighborhoods")
            .data(nyfeatures.features)
           .on("mouseover", function(d) {
               d3.select(this).style("fill", "#FD783A");
           })
           .on("mouseout", function(d){
               return d3.select(this).style("fill", d3.rgb(pop_scale(d.properties.count/d.properties.Shape__Area), pop_scale(d.properties.count/d.properties.Shape__Area),255))
           })
        }

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
          d3.selectAll(".legendTitle").transition().duration(500).text("Population per square kilometer")
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
       d3.selectAll("#map_button").text(data_kind)
     })

     legendsvg.append("rect")
         .attr("class", "legendRect")
         .attr("x", -legendWidth/2)
         .attr("y", 0)
         .attr("width", legendWidth)
         .attr("height", 10)
         .style("fill", "url(#linear-gradient)");
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

      legendsvg.append("text")
        .attr("class", "legendTitle")
        .attr("x", 0)
        .attr("y", 45)
        .style("text-anchor", "middle")
        .text("Population per square kilometer");
}
