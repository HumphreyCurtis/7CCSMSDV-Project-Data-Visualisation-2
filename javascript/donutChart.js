/* 
 * Projection of donut chart
 *
 */

var peopleVaccinated = [];
var totalVaccinations = []; 
var legendRectSize = 13;
var legendSpacing = 7;
var width = 400;
var height = 400;
var radius = Math.min(width, height) / 2;
var donutWidth = 75;
var color = d3.scaleOrdinal()
.range(["#1F313F", "#1A5760", "#1C8174", "#4CAA76", "#94CF6C", "#EEEF63"]);

var svg = d3.select('#donut')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2) + ')');

var arc = d3.arc()
    .innerRadius(radius - donutWidth)
    .outerRadius(radius);



var pie = d3.pie()
    .value(function (d) {
        return d.value;
    })
    .sort(null);

var donutTip = d3.select("body").append("div")
        .attr("class", "donut-tip")
        .style("opacity", 0);   


var path;

Promise.all([d3.json('../data/top5PeopleVaccinated.json'), d3.json('../data/top5TotalVaccinations.json')]).then(function([totalData, totalVaccinated]){
    peopleVaccinated = totalData;
    totalVaccinations = totalVaccinated;
    draw(); 
}); 


function draw() {

path = svg.selectAll('path')
    .data(pie(totalVaccinations))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function (d, i) {
        return color(d.data.title);
    })
    .attr('transform', 'translate(0, 0)')
    .on('mouseover', function (d, i) {
        d3.select(this).transition()
            .duration('50')
            .attr('opacity', '.85');
        donutTip.transition()
            .duration(50)
            .style("opacity", 1);
        let num = d.data.title + ": " + (Math.round((d.value / d.data.all) * 100)).toString() + '%' + "\nCount: " + (d.value);
        donutTip.html(num)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 15) + "px");

    })
    .on('mouseout', function (d, i) {
        d3.select(this).transition()
            .duration('50')
            .attr('opacity', '1');
        donutTip.transition()
            .duration('50')
            .style("opacity", 0);
    });

    drawLegend(totalVaccinations); 

}

d3.select("button#peopleVaccinated")
.on("click", function () {
    change(peopleVaccinated);
})
d3.select("button#totalVaccinations")
.on("click", function () {
    change(totalVaccinations);
})

function change(data) {
    svg.selectAll('.circle-legend').remove();
    var pie = d3.pie()
        .value(function (d) {
            return d.value;
        }).sort(null)(data);

    var radius = Math.min(width, height) / 2;
    var donutWidth = 75;

    path = d3.select("#donut")
        .selectAll("path")
        .data(pie); // Compute the new angles
    var arc = d3.arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius);
    path.transition().duration(500).attr("d", arc); // redrawing the path with a smooth transition

    drawLegend(data); 
}

function drawLegend(data) {
    svg.selectAll('.circle-legend').remove(); 
    var legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'circle-legend')
        .attr('transform', function (d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = height * color.domain().length / 2;
            var horz = -2 * legendRectSize - 13;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('circle')
        .style('fill', color)
        .style('stroke', color)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', '.5rem');
    
    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function (data) {
            return data;
        }); 
}

