<!-- https://www.d3-graph-gallery.com/graph/line_basic.html -->

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
            d["Year"] = d3.timeParse("%Y")(d.Year)
            d["Emissions.Type.CO2"] = +d["Emissions.Type.CO2"]
        });

        data = d3.group(data, function (d) { return d["Country"]; })
        //data = data.get("United States")
        data = data.get("Namibia")
        console.log(data)

        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, function (d) {
                return d.Year;
            }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return +d["Emissions.Type.CO2"]; })])
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
            .text("CO2 Emission");

        svg.append("text")
            .attr("y", height - 450)
            .attr("x", width - 100)
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Line chart for Emission of CO2 for Namibia: 1970-2012")

        // Add the line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) { return x(d["Year"]) })
                .y(function (d) { return y(d["Emissions.Type.CO2"]) })
            )
    })
</script>