System.register(["d3"], function (exports_1, context_1) {
    "use strict";
    var d3, svg;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (d3_1) {
                d3 = d3_1;
            }
        ],
        execute: function () {
            svg = d3.select("#historical-chart")
                .append('svg')
                .attr("width", 600)
                .attr("height", 400);
            svg.append("text")
                .attr("x", 100)
                .attr("y", 100)
                .text("Hello d3js");
            svg
                .append("circle")
                .attr("r", 30)
                .attr("cx", 60)
                .attr("cy", 50);
        }
    };
});
