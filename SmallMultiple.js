<!-- reference https://www.d3-graph-gallery.com/graph/line_smallmultiple.html -->

<!DOCTYPE html>
<meta charset="utf-8">

<!-- Load d3.js -->
<script src="https://d3js.org/d3.v4.js"></script>

<!-- Create a div where the graph will take place -->
<div id="my_dataviz"></div>
<script>

    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 0, bottom: 30, left: 50 },
        width = 210 - margin.left - margin.right,
        height = 210 - margin.top - margin.bottom;

    //Read the data
    d3.csv("emissions.csv", function (data) {

        data.forEach(function (d) {
            d["Year"] = d3.timeParse("%Y")(d.Year)
            d["Emissions.Type.CO2"] = +d["Emissions.Type.CO2"]
        });

        // group the data: I want to draw one line per group
        var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
            .key(function (d) { return d.Country; })
            .entries(data);

        sumstat = sumstat.splice(0, 11) // take the first 10 countries
        removed = sumstat.splice(8, 1) //remove the countires with high or low data
        removed = sumstat.splice(6, 1)
        removed = sumstat.splice(4, 2)
        console.log(sumstat)

        var newData = [];
        sumstat.forEach(function (d) {
            vals = (d.values)
            vals.forEach(function (f) {
                newData.push(f)
            })
        })

        allKeys = sumstat.map(function (d) { return d.key })

        // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
        var svg = d3.select("#my_dataviz")
            .selectAll("uniqueChart")
            .data(sumstat)
            .enter()
            .append("svg")
            .attr("width", width + 20 + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, function (d) { return d.Year; }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(3));

        //Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(newData, function (d) { return +d["Emissions.Type.CO2"]; })])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y).ticks(5));

        // color palette
        var color = d3.scaleOrdinal()
            .domain(allKeys)
            .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#a65628', '#f781bf', '#999999'])

        // Draw the line
        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", function (d) { return color(d.key) })
            .attr("stroke-width", 1.9)
            .attr("d", function (d) {
                return d3.line()
                    .x(function (d) { return x(d.Year); })
                    .y(function (d) { return y(+d["Emissions.Type.CO2"]); })
                    (d.values)
            })

        // Add titles
        svg.append("text")
            .attr("text-anchor", "start")
            .attr("y", -5)
            .attr("x", 0)
            .text(function (d) { return (d.key) })
            .style("fill", function (d) { return color(d.key) })

        svg.append("text")
            .attr("y", height + 30)
            .attr("x", width - 50)
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Year")

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 43)
            .attr("dy", "-5.1em")
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("CO2 Emission");

    })
</script>