var w_map = 960;
var h_map = 500;
var projection = d3.geo.mercator()
    .center([-122.433701, 37.767683])
    .translate([w_map / 2, h_map / 2])
    .scale([100000]);
var path = d3.geo.path()
    .projection(projection);

var svg_map = d3.select("#plot_map")
    .append("svg")
    .attr({
        width: w_map,
        height: h_map
    })
var colors = ['red', 'green', 'purple', 'yellow', 'pink'];
d3.json("sfpddistricts.geojson", function(json) {
    svg_map.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "steelblue");
    d3.json("coords.json", function(json) {
        svg_map.selectAll("circle")
            .data(json)
            .enter()
            .append("circle")
            .attr({
                cx: function(d) {
                    return projection(d)[0];
                },
                cy: function(d) {
                    return projection(d)[1];
                },
                r: 1,
                fill: "black"
            });
    })
})



d3.select("#K2")
    .on("click", function() {
        svg_map.selectAll(".centers").remove();
        d3.json("labels.json", function(json) {
            svg_map.selectAll("circle")
                .data(json)
                .attr({
                    fill: function(d) {
                        return colors[d[0]];
                    }
                })
            d3.json("center2.json", function(json) {
                svg_map.selectAll(".centers")
                    .data(json)
                    .enter()
                    .append("circle")
                    .attr({
                        cx: function(d) {
                            return projection(d)[0];
                        },
                        cy: function(d) {
                            return projection(d)[1];
                        },
                        r: 5,
                        opacity: 1,
                        fill: "black",
                        class: "centers",
                        stroke: "black"
                    })
            })
        })
    })

d3.select("#K3")
    .on("click", function() {
        svg_map.selectAll(".centers").remove();
        d3.json("labels.json", function(json) {
            svg_map.selectAll("circle")
                .data(json)
                .attr({
                    fill: function(d) {
                        return colors[d[1]];
                    }
                })
            d3.json("center3.json", function(i, json) {
                svg_map.selectAll(".centers")
                    .data(json)
                    .enter()
                    .append("circle")
                    .attr({
                        cx: function(d) {
                            return projection(d)[0];
                        },
                        cy: function(d) {
                            return projection(d)[1];
                        },
                        r: 5,
                        opacity: 1,
                        fill: "black",
                        class: "centers",
                        stroke: "black"
                    })
            })
        })
    })
d3.select("#K4")
    .on("click", function() {
        svg_map.selectAll(".centers").remove();
        d3.json("labels.json", function(json) {
            svg_map.selectAll("circle")
                .data(json)
                .attr({
                    fill: function(d) {
                        return colors[d[2]];
                    }
                })
            d3.json("center4.json", function(i, json) {
                svg_map.selectAll(".centers")
                    .data(json)
                    .enter()
                    .append("circle")
                    .attr({
                        cx: function(d) {
                            return projection(d)[0];
                        },
                        cy: function(d) {
                            return projection(d)[1];
                        },
                        r: 5,
                        opacity: 1,
                        fill: "black",
                        class: "centers",
                        stroke: "black"
                    })
            })
        })
    })
d3.select("#K5")
    .on("click", function() {
        svg_map.selectAll(".centers").remove();
        d3.json("labels.json", function(json) {
            svg_map.selectAll("circle")
                .data(json)
                .attr({
                    fill: function(d) {
                        return colors[d[3]];
                    }
                })
            d3.json("center5.json", function(i, json) {
                svg_map.selectAll(".centers")
                    .data(json)
                    .enter()
                    .append("circle")
                    .attr({
                        cx: function(d) {
                            return projection(d)[0];
                        },
                        cy: function(d) {
                            return projection(d)[1];
                        },
                        r: 5,
                        opacity: 1,
                        fill: "black",
                        class: "centers",
                        stroke: "black"
                    })
            })
        })
    })
d3.select("#K6")
    .on("click", function() {
        svg_map.selectAll(".centers").remove();
        d3.json("labels.json", function(json) {
            svg_map.selectAll("circle")
                .data(json)
                .attr({
                    fill: function(d) {
                        return colors[d[4]];
                    }
                })
            d3.json("center6.json", function(i, json) {
                svg_map.selectAll(".centers")
                    .data(json)
                    .enter()
                    .append("circle")
                    .attr({
                        cx: function(d) {
                            return projection(d)[0];
                        },
                        cy: function(d) {
                            return projection(d)[1];
                        },
                        r: 5,
                        opacity: 1,
                        fill: "black",
                        class: "centers",
                        stroke: "black"
                    })
            })
        })
    })
