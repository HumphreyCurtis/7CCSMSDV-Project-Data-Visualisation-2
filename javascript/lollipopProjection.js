/* 
 * Projection of lollipop chart map 
 *
 */

var margin = {
    top: 30,
    right: 30,
    bottom: 100,
    left: 85
  },
  width = 1000 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

var donutTip = d3.select("body").append("div")
  .attr("class", "donut-tip")
  .style("opacity", 0);

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Initialize the X axis
var x = d3.scaleBand()
  .range([0, width])
  .padding(1);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")

// Initialize the Y axis
var y = d3.scaleLinear()
  .range([height, 0]);
var yAxis = svg.append("g")
  .attr("class", "myYaxis")

var circlesColour = "#69b3a2";

// A function that create / update the plot for a given variable:
function update(selectedVar) {

  svg.selectAll(".axis").remove(); // This works to adapt axes and delete overlap but could effect future code

  // Parse the Data
  d3.csv("../data/vaccinationLollipop.csv", function (data) {


    // X axis
    x.domain(data.map(function (d) {
      return d.group;
    }))
    xAxis.transition().duration(1000).call(d3.axisBottom(x))
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(90)")
      .style("text-anchor", "start");

    // Append text to X-axis
    svg.append("text")
      .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + margin.top + 50) + ")")
      .style("text-anchor", "middle")
      .text("Countries")
      .attr('class', 'axis');

    // Add Y axis
    y.domain([0, d3.max(data, function (d) {
      return + d[selectedVar]
    })]);

    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(selectedVar)
      .attr('class', 'axis');


    // variable u: map data to existing circle
    var j = svg.selectAll(".myLine")
      .data(data);

    // update lines
    j
      .enter()
      .append("line")
      .attr("class", "myLine")
      .merge(j)
      .transition()
      .duration(1000)
      .attr("x1", function (d) {
        console.log(x(d.group));
        return x(d.group);
      })
      .attr("x2", function (d) {
        return x(d.group);
      })
      .attr("y1", y(0))
      .attr("y2", function (d) {
        return y(d[selectedVar]);
      })
      .attr("stroke", "grey");

    // variable u: map data to existing circle
    var u = svg.selectAll("circle")
      .data(data);

    if (selectedVar == "PeopleVaccinated") {
      circlesColour = "#ffa600";
    } else {
      circlesColour = "#69b3a2";
    }

    // update bars
    u
      .enter()
      .append("circle")
      .merge(u)
      .transition()
      .duration(1000)
      .attr("cx", function (d) {
        return x(d.group);
      })
      .attr("cy", function (d) {
        return y(d[selectedVar]);
      })
      .attr("r", 5)
      .attr("fill", circlesColour);

    var circle = svg.selectAll("circle")
      .on('mouseover', function (d) {
        donutTip.transition()
          .duration(50)
          .style("opacity", 1);
        let keyword = selectedVar;
        let country = d.group;
        let num = d.PeopleVaccinated;
        if (keyword == "TotalVaccinations") {
          num = d.TotalVaccinations
        }
        donutTip.html("<h6>" + country + ", " + keyword + ": " + num + "</h6>")
          .style("left", (d3.event.pageX + 10) + "px")
          .style("top", (d3.event.pageY - 15) + "px");
      })
      .on('mouseout', function () {
        donutTip.transition()
          .duration('50')
          .style("opacity", 0);
      })

  })

}

// Initialize plot
update('TotalVaccinations');