/* 
 * Projection of donut chart
 *
 */

var peopleVaccinated = [];
var totalVaccinations = []; 
var legendRectSize = 13;
var legendSpacing = 7;
var width = 520;
var height = 520;
var radius = 220;
var donutWidth = 84;
var color = d3.scaleOrdinal()
    .range(["#243746", "#2f6770", "#3c8c81", "#68ae7d", "#a8ce72", "#efe26d"]);

var svg = d3.select('#donut')
    .append('svg')
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('role', 'img')
    .attr('aria-label', 'Vaccination totals for five leading countries and the rest of the world')
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

Promise.all([
    d3.json('../data/top5PeopleVaccinated.json'),
    d3.json('../data/top5TotalVaccinations.json')
]).then(function ([peopleData, totalData]) {
    peopleVaccinated = peopleData;
    totalVaccinations = totalData;
    draw();
});


function draw() {
    path = svg.selectAll('path')
        .data(pie(totalVaccinations))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d) {
            return color(d.data.title);
        })
        .on('mouseover', function (d) {
            d3.select(this).transition()
                .duration(80)
                .attr('opacity', 0.82);
            donutTip.transition()
                .duration(80)
                .style('opacity', 1);
            var percentage = Math.round((d.value / d.data.all) * 100);
            donutTip.html('<strong>' + d.data.title + '</strong><br>' + percentage + '% · ' + d3.format(',')(d.value))
                .style('left', (d3.event.pageX + 10) + 'px')
                .style('top', (d3.event.pageY - 15) + 'px');
        })
        .on('mouseout', function () {
            d3.select(this).transition()
                .duration(80)
                .attr('opacity', 1);
            donutTip.transition()
                .duration(80)
                .style('opacity', 0);
        });

    drawLegend();

}

d3.select("button#peopleVaccinated")
    .on("click", function () {
        setActiveMeasure("peopleVaccinated");
        change(peopleVaccinated);
    });
d3.select("button#totalVaccinations")
    .on("click", function () {
        setActiveMeasure("totalVaccinations");
        change(totalVaccinations);
    });

function setActiveMeasure(activeId) {
    d3.selectAll('.chart-toolbar button')
        .attr('aria-pressed', function () {
            return this.id === activeId ? 'true' : 'false';
        });
}

function change(data) {
    svg.selectAll('.circle-legend').remove();
    var pie = d3.pie()
        .value(function (d) {
            return d.value;
        }).sort(null)(data);

    path = d3.select("#donut")
        .selectAll("path")
        .data(pie); // Compute the new angles
    var updatedArc = d3.arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius);
    path.transition().duration(500).attr("d", updatedArc);

    drawLegend();
}

function drawLegend() {
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
        .text(function (label) {
            return label;
        });
}
