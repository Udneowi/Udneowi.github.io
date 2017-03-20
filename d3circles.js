<!--Making circles -->
    // Setting attributes
    var w = 500;
    var h = 100;
    // Creating SVG element
    var svg = d3.select("#d3circles").append("svg")
              .attr("width", w)
              .attr("height", h);
    // Our dataset
    var dataset = [5, 10, 15 ,20, 25];
    // Circle variable
    var circles = svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle");
    // Creating some circles
    circles.attr("cx",function(d,i){ return (i*50)+25;})
            .attr("cy", h/2)
            .attr("r", function(d) { return d; })
            .attr("fill", "yellow")
            .attr("stroke","orange")
            .attr("stroke-width",function(d){ return d/2 ;});
