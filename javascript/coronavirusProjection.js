// Define size related variables
const dimension = d3.select(".visualisation")
    .node()
    .parentNode
    .getBoundingClientRect();
const margin = 90;
const width = dimension.width;
const height = 500;
const aspect = width / (height - margin);
const rotate = -9.9;

const zoom = d3.zoom()
    .scaleExtent([1, 30])
    .translateExtent([
        [0, 0],
        [width, height]
    ])
    .on('zoom', function () {
        d3.select('g').attr('transform', d3.event.transform)
    });

// Add the core svg block
const svg = d3.select(".visualisation")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .call(zoom);

const globe = svg.append("g");

const tooltip = d3.select('.visualisation').append('div')
    .attr('class', 'hidden tooltip');

const projection = d3.geoMercator()
    .rotate([rotate, 0])
    .scale(height / (1.4 * Math.PI))
    .translate([width / 2, (height - margin) / 1.2]);

const geoPath = d3.geoPath()
    .projection(projection);

const colorScale = d3.scaleSqrt(["#ddd", "#777", "#000"]);

const map = {};

Promise.all([
    d3.json('../data/world.topojson'),
    // d3.json('https://corona.lmao.ninja/v3/covid-19/countries'),
    d3.json('../data/coronavirusWorldwide.json'),

]).then(function ([shapes, data]) {
    var shapes = topojson.feature(shapes, "world");
    // save in a global context and remove antarctic.
    map.features = shapes.features.filter((d) => d.properties.ISO_A3 !== "ATA");
    map.data = data;
    map.metric = d3.select("#metrics").property("value");
    console.log(map.metric); /* Setting of metric value by user */
    selectData();
    colorScale.domain([0,
        d3.median(map.features, d => d.properties.dataPoint),
        d3.max(map.features, d => d.properties.dataPoint)
    ]);
    draw();
    drawLegend();

    d3.select("#metrics").on("change", change);

});

function selectData() {
    map.features.forEach((d) => {
        var entry1 = map.data.filter(t => t.countryInfo.iso3 == d.properties.ISO_A3)[0];
        if (entry1) {
            d.properties.dataPoint = entry1[map.metric];
            d.properties.country = entry1.country;
        } else {
            d.properties.dataPoint = 0;
            d.properties.country = "Unknown";
        }
    })
};

function draw() {
    globe.selectAll("path.country").remove();
    globe.selectAll("path.country")
        .data(map.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr('d', geoPath)
        .style("fill", d => colorScale(d.properties.dataPoint))
        .on('mousemove', function (d) {
            tooltip.classed('hidden', false) /* Adds functionality on hover + addeed code to deduce current underlying metric */
                .html("<h6>" + d.properties.country + " " + map.metric + ": " + d.properties.dataPoint + "</h6>")
                .attr('style', 'left:' + (d3.event.pageX + 15) + 'px; top:' + (d3.event.pageY + 20) + 'px');
            console.log(d.properties.dataPoint); /* Logging values in console */
        })
        .on('mouseout', function () {
            tooltip.classed('hidden', true);
        });
};

function drawLegend() {
    svg.select(".legendLinear").remove();
    svg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(10," + (height - margin) + ")");

    var shapeWidth = 40,
        cellCount = 5,
        shapePadding = 2,
        legendTitle = map.metric.replace("PerOneMillion", "") + " per million population: ";

    var legendLinear = d3.legendColor()
        .title(legendTitle)
        .shape("rect")
        .shapeWidth(shapeWidth)
        .cells(cellCount)
        .labelFormat(d3.format(".3s"))
        .orient('horizontal')
        .shapePadding(shapePadding)
        .scale(colorScale);

    svg.select(".legendLinear")
        .append("rect")
        .attr("class", "legendBackground")
        .attr("x", -5)
        .attr("y", -22)
        .attr("opacity", 0.9)
        .attr("rx", 8)
        .attr("ry", 8)
        .attr("width", legendTitle.length * 7.4)
        .attr("height", margin);

    svg.select(".legendLinear")
        .call(legendLinear);
};

function change() {
    map.metric = d3.select("#metrics").property("value")
    selectData();
    colorScale.domain([0,
        d3.median(map.features, d => d.properties.dataPoint),
        d3.max(map.features, d => d.properties.dataPoint)
    ]);
    draw();
    drawLegend();
}

d3.select(window)
    .on("resize", function () {
        var targetWidth = d3.select(".visualisation").node().parentNode.getBoundingClientRect();
        svg.attr("width", targetWidth);
        svg.attr("height", targetWidth / aspect);
        svg.attr("viewBox", `0 0 ${width} ${height}`)
    });