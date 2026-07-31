/* 
 * Projection of vaccination map 
 *
 */

const margin = 104;
const width = 1120;
const height = 620;
const rotate = -9.9;

const zoom = d3.zoom()
    .scaleExtent([1, 30])
    .translateExtent([
        [0, 0],
        [width, height]
    ])
    .on('zoom', function () {
        globe.attr('transform', d3.event.transform);
    });

// Add the core svg block
const svg = d3.select(".visualisation")
    .append("svg")
    .attr("role", "img")
    .attr("aria-label", "World map of COVID-19 vaccination measures")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .call(zoom);

const globe = svg.append("g");

const tooltip = d3.select('body').append('div')
    .attr('class', 'hidden tooltip');

const projection = d3.geoMercator()
    .rotate([rotate, 0])
    .scale(height / (1.4 * Math.PI))
    .translate([width / 2, (height - margin) / 1.2]);

const geoPath = d3.geoPath()
    .projection(projection);

const colorScale = d3.scaleSqrt().range(["#fff2c6", "#efa24d", "#a92f37"]);

const map = {};

const metricLabels = {
    totalVaccinationsAsProportionGlobally: "Share of worldwide doses (%)",
    peopleVaccinatedAsProportionGlobally: "Share vaccinated worldwide (%)",
    totalVaccinations: "Total vaccinations",
    peopleVaccinated: "People vaccinated"
};

Promise.all([
    d3.json('../data/world.topojson'),
    d3.json('../data/vaccinationsWorldwide.json')

]).then(function ([shapes, data]) {
    const world = topojson.feature(shapes, shapes.objects.world);
    // save in a global context and remove antarctic.
    map.features = world.features.filter((d) => d.properties.ISO_A3 !== "ATA");
    map.data = data;
    map.dataByIso = new Map(data.map((entry) => [entry.iso_code, entry]));
    map.metric = d3.select("#metrics").property("value");
    selectData();
    updateColorDomain();
    draw();
    drawLegend();

    d3.select("#metrics").on("change", change);
});

function selectData() {
    map.features.forEach((d) => {
        const entry = map.dataByIso.get(d.properties.ISO_A3);
        if (entry) {
            d.properties.dataPoint = Number(entry[map.metric]) || 0;
            d.properties.country = entry.name;
        } else {
            d.properties.dataPoint = 0;
            d.properties.country = d.properties.NAME || "No data";
        }
    });
}

function updateColorDomain() {
    const values = map.features
        .map((feature) => feature.properties.dataPoint)
        .filter((value) => Number.isFinite(value) && value > 0);
    colorScale.domain([0, d3.median(values), d3.max(values)]);
}

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
            const value = d.properties.dataPoint ? d3.format(",.3~g")(d.properties.dataPoint) : "No data";
            tooltip.classed('hidden', false)
                .html("<h6>" + d.properties.country + "</h6>" + metricLabels[map.metric] + ": " + value)
                .attr('style', 'left:' + (d3.event.pageX + 15) + 'px; top:' + (d3.event.pageY + 20) + 'px');
        })
        .on('mouseout', function () {
            tooltip.classed('hidden', true);
        });
}

function drawLegend() {
    svg.select(".legendLinear").remove();
    svg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(10," + (height - margin) + ")");

    var shapeWidth = 40,
        cellCount = 10,
        shapePadding = 2,
        legendTitle = metricLabels[map.metric];

    var legendLinear = d3.legendColor()
        .title(legendTitle)
        .shape("rect")
        .shapeWidth(shapeWidth)
        .cells(cellCount)
        .labelFormat(d3.format(".3~s"))
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
        .attr("width", Math.max(330, legendTitle.length * 7.2))
        .attr("height", margin);

    svg.select(".legendLinear")
        .call(legendLinear);
}

function change() {
    map.metric = d3.select("#metrics").property("value");
    selectData();
    updateColorDomain();
    draw();
    drawLegend();
}
