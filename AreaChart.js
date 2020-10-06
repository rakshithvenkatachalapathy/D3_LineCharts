<!-- reference https://www.d3-graph-gallery.com/graph/area_basic.html -->

<!DOCTYPE html>
<meta charset="utf-8">

<!-- Load d3.js -->
<script src="https://d3js.org/d3.v6.min.js"></script>

<!-- Create a div where the graph will take place -->
<div id="my_dataviz"></div>
<script>

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 600 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    d3.csv("emissions.csv").then(function (data) {
        data.forEach(function (d) {
            d["y"] = +d.Year
            d["Year"] = d3.timeParse("%Y")(d.Year)
            d["Emissions.Type.CH4"] = +d["Emissions.Type.CH4"]

        });
        data = d3.group(data, function (d) { return d["Country"]; })
        data = data.get("Barbados") //displaying the data only for Barbados
        console.log(data)

        // create a tooltip
        var tooltip = d3.select("body")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        var mouseover = function (d) {
            tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }
        var mousemove = function (d, i) {
            console.log(i)
            tooltip
                .html("CH4 emission for " + i["y"] + " is :" + i["Emissions.Type.CH4"])
                .style("left", (d3.pointer(this)[0] + 70) + "px")
                .style("top", (d3.pointer(this)[1]) + "px")
        }
        var mouseleave = function (d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
        }

        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, function (d) { return d.Year; }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return +d["Emissions.Type.CH4"]; })])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("y", height + 27)
            .attr("x", width - 100)
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Year")

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 35)
            .attr("dy", "-5.1em")
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("CH4 Emission");

        svg.append("text")
            .attr("y", height - 450)
            .attr("x", width - 100)
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Area chart for Emission of CH4 for Barbados: 1970-2012")


        // Add the area
        svg.append("path")
            .datum(data)
            .attr("fill", "#cce5df")
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 1.5)
            .attr("d", d3.area()
                .x(function (d) { return x(d["Year"]) })
                .y0(y(0))
                .y1(function (d) { return y(d["Emissions.Type.CH4"]) })
            )

        svg.selectAll("myCircles")
            .data(data)
            .enter()
            .append("circle")
            .attr("fill", "black")
            .attr("stroke", "none")
            .attr("cx", function (d) { return x(d["Year"]) })
            .attr("cy", function (d) { return y(d["Emissions.Type.CH4"]) })
            .attr("r", 3)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

    })
</script>