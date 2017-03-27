//width and height
var w = 700;
var h = 400;
var padding = 60;
d3.json("scatter2003.json", function(json2003) {
    data2003 = json2003;
    d3.json("scatter2015.json", function(json2015) {
        data2015 = json2015;
        var year = "2003";
        Xmax = Math.max(d3.max(data2003, function(d) {
            return d[0];
        }), d3.max(data2015, function(d) {
            return d[0];
        }));
        Ymax = Math.max(d3.max(data2003, function(d) {
            return d[1];
        }), d3.max(data2015, function(d) {
            return d[1];
        }));
        Rmax = Math.max(d3.max(data2003, function(d) {
            return d[2];
        }), d3.max(data2015, function(d) {
            return d[2];
        }));
        var xScale_scatter = d3.scale.linear()
            .domain([0, Xmax])
            .range([padding, w - padding * 2]);
        var yScale_scatter = d3.scale.linear()
            .domain([0, Ymax])
            .range([h - padding, padding])
        var rScale_scatter = d3.scale.linear()
            .domain([0, Rmax])
            .range([1, 8]);
        var xAxis = d3.svg.axis()
            .scale(xScale_scatter)
            .orient("bottom")
            .ticks(5);
        var yAxis = d3.svg.axis()
            .scale(yScale_scatter)
            .orient("left")
            .ticks(5);
        var svg_scatter = d3.select("#scatter")
            .append("svg")
            .attr({
                width: w,
                height: h
            });
        svg_scatter.selectAll("circle")
            .data(data2003)
            .enter()
            .append("circle")
            .attr({
                cx: function(d) {
                    return xScale_scatter(d[0]);
                },
                cy: function(d) {
                    return yScale_scatter(d[1]);
                },
                r: function(d) {
                    return rScale_scatter(d[2]);
                }
            })
            .append("title")
            .text(function(d) {
                return "Total crimes from "+d[3]+" is "+d[2];
            });
        svg_scatter.selectAll("text")
            .data(data2003)
            .enter()
            .append("text")
            .text(function(d) {
                return d[3];
            })
            .attr({
                x: function(d) {
                    return xScale_scatter(d[0]) + rScale_scatter(d[2]);
                },
                y: function(d) {
                    return yScale_scatter(d[1]);
                },
                "font-family": "sans-serif",
                "font-size": "12px",
                class: "plot_labels"
            });
        svg_scatter.append("text")
            .attr({
                x: w / 2,
                y: 20,
                "font-family": "sans-serif",
                "text-anchor": "middle",
                "font-size": "18px",
                "text-decoration": "underline",
                class: "title"
            })
            .text("Graph from 2003");
        svg_scatter.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis);
        svg_scatter.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);
        //Label on xAxis
        svg_scatter.append("text")
            .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate(" + (padding / 2 - 14) + "," + (h / 2) + ")rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
            .text("VEHICLE THEFT");
        //Label on yAxis
        svg_scatter.append("text")
            .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate(" + (w / 2) + "," + (h - (padding / 3)) + ")") // centre below axis
            .text("PROSTITUTION");

        d3.select("#toggle_year")
            .on("click", function() {
                if (year == "2003") {
                    dataset_scatter = data2015;
                    year = "2015";
                } else if (year == "2015") {
                    dataset_scatter = data2003;
                    year = "2003"
                }
                //Update circles
                svg_scatter.selectAll("circle")
                    .data(dataset_scatter)
                    .transition()
                    .duration(1000)
                    .attr({
                        cx: function(d) {
                            return xScale_scatter(d[0]);
                        },
                        cy: function(d) {
                            return yScale_scatter(d[1]);
                        },
                        r: function(d) {
                            return rScale_scatter(d[2]);
                        }
                    });
                svg_scatter.selectAll("title").data(dataset_scatter)
                    .text(function(d) {
                        return "Total crimes from "+d[3]+" is "+d[2];
                    });
                svg_scatter.selectAll(".plot_labels")
                    .data(dataset_scatter)
                    .transition()
                    .duration(1000)
                    .attr({
                        x: function(d) {
                            return xScale_scatter(d[0]) + rScale_scatter(d[2]);
                        },
                        y: function(d) {
                            return yScale_scatter(d[1]);
                        }
                    })
                svg_scatter.select(".title")
                    .text("Graph from " + year)

            })
        d3.select("#labels")
            .on("click", function() {
                var active = labels.active ? false : true,
                    boo = active ? 0 : 1;
                svg_scatter.selectAll(".plot_labels").attr({
                    "font-size": 12 * boo +1  + "px",  //Set to 1 to avoid text getting stuck at the old location when applying again
                    opacity    :  boo,
                });

                labels.active = active;
            })

    })
})
