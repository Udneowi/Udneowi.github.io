
/* Adapted from: https://bl.ocks.org/misanuk/fc39ecc400eed9a3300d807783ef7607 */

//Defining SVG size
var margin = {top: 200, right: 20, bottom: 190, left: 50},
    margin2 = {top: 530, right: 20, bottom: 30, left: 50},
    width = 700 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom,
    height2 = 600 - margin2.top - margin2.bottom;

//Defining a variable to reformate data to timeParses
var parseTime = d3.timeParse("%Y-%m-%d");

//Defining all the scale variables
var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

//Defining the axises
var xAxis = d3.axisBottom(x).tickSize(0),
    xAxis2 = d3.axisBottom(x2).tickSize(0),
    yAxis = d3.axisLeft(y).tickSize(0);

//Defining the brush variable (drag variable)
var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush", brushed);

//Defining the zoom variable
var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

//Selecting the div and appending a SVG
var svg_bar_zoom = d3.select("#collisions_bar_zoom").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

//Assigning the svg an outer layer
svg_bar_zoom.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("class","layer")
    .attr("width", width)
    .attr("height", height);

//Appending a g element to cover the top graph
var focus = svg_bar_zoom.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Appending a g element to cover the lower graph
var context = svg_bar_zoom.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

// Data Load from json
d3.json("Collisions_per_day.json", function(error, data) {
  if(error) throw error;

  //Convert the time
  data.forEach(function(d) {
    d.date = parseTime(d.date);
  });

  //Define max and mins for the data
  var xMin = d3.min(data, function(d) { return d.date; });
  var xMax = d3.max(data, function(d) { return d.date; });
  var yMax = Math.max(20, d3.max(data, function(d) { return d.count; }));

  //Define the domain for the scale variable
  x.domain([xMin, new Date()]);
  y.domain([0, yMax]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  //
  var num_messages = function(dataArray, domainRange) { return d3.sum(dataArray, function(d) {
    return d.date >= domainRange.domain()[0] && d.date <= domainRange.domain()[1];
    })
  }

  // append bar plot to main chart area
  var messages = focus.append("g");
    messages.attr("clip-path", "url(#clip)");
    messages.selectAll("message")
        .data(data)
        .enter().append("rect")
        .attr('class', 'message')
        .attr("x", function(d) { return x(d.date); })
        .attr("y", function(d) { return y(d.count) ; })
        .attr("height", function(d) { return height - y(d.count); })
        .attr("width", width/data.length);

  focus.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

  focus.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);

  // Summary Stats
  focus.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Incidents (per day)");

  svg_bar_zoom.append("text")
        .attr("transform",
              "translate(" + ((width + margin.right + margin.left)/2) + " ," +
                             (height + margin.top*0.56 + margin.bottom) + ")")
        .style("text-anchor", "middle")
        .text("Date");

  svg_bar_zoom.append("rect")
    .attr("class", "zoom")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);

  // append bar plot to brush chart area
   var messages = context.append("g");
       messages.attr("clip-path", "url(#clip)");
       messages.selectAll("message")
          .data(data)
          .enter().append("rect")
          .attr('class', 'messageContext')
          .style("opacity", 1)
          .attr("x", function(d) { return x2(d.date); })
          .attr("y", function(d) { return y2(d.count); })
          .attr("width", width/data.length)
          .attr("height", function(d) { return height2 - y2(d.count); })

  context.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

  context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, x.range());

  });

//create brush function redraw bar plot with selection
function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.selectAll(".message")
        .attr("x", function(d) { return x(d.date); })
        .attr("width", (width / (s[1] - s[0])/2));
  focus.select(".x-axis").call(xAxis);
  svg_bar_zoom.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());
  focus.selectAll(".message")
        .attr("x", function(d) { return x(d.date); })
        .attr("width", t.k/2);
  focus.select(".x-axis").call(xAxis);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}
