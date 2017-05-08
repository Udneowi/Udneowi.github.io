//Defining width and height of the plot
var w_map = 650;
var h_map = 350;

//Defining the location on the worldmap we'll like to show.
var projection = d3.geo.mercator()
    .center([-122.433701, 37.767683])  //Centering in San Fransisco
    .translate([w_map / 2, h_map / 2]) //Translating since it's the upper left corner which is centered
    .scale([100000]);  //Zooming
var path = d3.geo.path()
    .projection(projection);

//Making our svg we'd like to plot the data onto
var svg_map = d3.select("#plot_map")
    .append("svg")
    .attr({
        width: w_map,
        height: h_map
    })
//Defining some colors to use in our plots.
var colors = ['red', 'green', 'purple', 'yellow', 'pink'];

//Plotting San Fransisco as a background map.
d3.json("sfpddistricts.geojson", function(json) {
    svg_map.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "steelblue");
    d3.json("coords.json", function(json) { //Plotting the raw coords onto the map
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

//Assigning buttum functions

d3.select("#Raw") //Removing cluster centers and coloring the existing coords to the raw data.
    .on("click", function(){
      svg_map.selectAll(".centers").remove();
      svg_map.selectAll("circle")
          .attr({
            fill: "black"
          })
    })

d3.select("#K2")//Removing cluster centers and coloring the existing coords to the K2 data. Also replotting the new cluster centers
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
                        fill: function(d,i){return colors[i];},
                        class: "centers",
                        stroke: "black",
                        "stroke-width": "1"
                    })
            })
        })
    })

d3.select("#K3")//Removing cluster centers and coloring the existing coords to the K3 data. Also replotting the new cluster centers
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
                        fill: function(d,i){return colors[i];},
                        class: "centers",
                        stroke: "black",
                        "stroke-width": "1"
                    })
            })
        })
    })
d3.select("#K4")//Removing cluster centers and coloring the existing coords to the K4 data. Also replotting the new cluster centers
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
                        fill: function(d,i){return colors[i];},
                        class: "centers",
                        stroke: "black",
                        "stroke-width": "1"
                    })
            })
        })
    })
d3.select("#K5")//Removing cluster centers and coloring the existing coords to the K5 data. Also replotting the new cluster centers
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
                        fill: function(d,i){return colors[i];},
                        class: "centers",
                        stroke: "black",
                        "stroke-width": "1"
                    })
            })
        })
    })
d3.select("#K6")//Removing cluster centers and coloring the existing coords to the K6 data. Also replotting the new cluster centers
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
                        fill: function(d,i){return colors[i];},
                        class: "centers",
                        stroke: "black",
                        "stroke-width": "1"
                    })
            })
        })
    })
