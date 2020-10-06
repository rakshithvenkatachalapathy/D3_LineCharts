<!-- reference https://www.d3-graph-gallery.com/graph/line_several_group.html 
https://stackoverflow.com/questions/38954316/adding-legends-to-d3-js-line-charts-->

<!DOCTYPE html>
<meta charset="utf-8">

<!-- Load d3.js -->
<script src="https://d3js.org/d3.v4.js"></script>

<!-- Create a div where the graph will take place -->
<div id="my_dataviz"></div>
<script>

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 100, bottom: 30, left: 60 },
        width = 700 - margin.left - margin.right,
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
    d3.csv("emissions.csv", function (data) {

        data.forEach(function (d) {
            d["Year"] = d3.timeParse("%Y")(d.Year)
            d["Emissions.Type.CO2"] = +d["Emissions.Type.CO2"]
        });

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
            }
            )
        }
        )

        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, function (d) { return d.Year; }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(5));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(newData, function (d) { return +d["Emissions.Type.CO2"]; })])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        var res = sumstat.map(function (d) { return d.key }) // list of group names
        var color = d3.scaleOrdinal()
            .domain(res)
            .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#a65628', '#f781bf', '#999999'])
        //'#ffff33',

        // Draw the line
        svg.selectAll(".line")
            .data(sumstat)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", function (d) { return color(d.key) })
            .attr("stroke-width", 1.5)
            .attr("d", function (d) {
                return d3.line()
                    .x(function (d) { return x(d.Year); })
                    .y(function (d) { return y(+d["Emissions.Type.CO2"]); })
                    (d.values)
            })

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
            .text("Emission of CO2 for 7 countries:1970-2012")


        //Adding legend
        var lineLegend = svg.selectAll(".lineLegend").data(res)
            .enter().append("g")
            .attr("class", "lineLegend")
            .attr("transform", function (d, i) {
                return "translate(" + width + "," + (i * 20) + ")";
            });

        lineLegend.append("text").text(function (d) { return d; })
            .attr("transform", "translate(15,9)"); //align texts with boxes

        lineLegend.append("rect")
            .attr("fill", function (d, i) { return color(d); })
            .attr("width", 10)
            .attr("height", 10);

    })
</script>