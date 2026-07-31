# Global COVID-19 Vaccination Visualisation

An interactive D3.js exploration of the early global COVID-19 vaccination rollout, produced for the **7CCSMSDV Simulation and Data Visualisation** module during my MSc at King's College London in 2021.

The project asks: **How did the global vaccine rollout differ between nations, and which countries had progressed furthest?** The repository also preserves the four-stage visual design exploration that led to the final dashboard.

## Visualisations

- **Interactive choropleth** - compare absolute vaccination totals and each country's share of worldwide vaccinations.
- **Lollipop chart** - switch between total vaccinations and people vaccinated across countries.
- **Donut chart** - compare the five leading national totals with the remainder of the world.

[Open the live visualisation](https://humphreycurtis.github.io/7CCSMSDV-Project-Data-Visualisation-2/) · [Read the submitted report](docs/KCL-COVID-19-Data-Visualisation-Report.pdf)

## Design process

Before implementing the final dashboard, I explored four visual directions: a temporal bubble map, an HDI/deaths scatterplot, a vaccination choropleth and an HDI-ordered Sankey diagram. The curated [`design-process/`](design-process/) archive contains the useful sketches, concept PDFs, screenshots, prototype datasets and runnable D3 experiments.

## How it works

The browser visualisations use HTML, CSS, JavaScript, D3.js v4/v5 and TopoJSON. A Java pipeline using JSON.simple parsed an Our World in Data snapshot, extracted country and worldwide totals, and calculated proportional measures for the map.

**Data date:** the archived OWID source covers records through **9 March 2021**. The visualisations use the latest available record for each country within that snapshot, so individual countries can have earlier reporting dates. These dates were verified against all 227 populated measures in the chart-ready dataset.

The repository preserves these submitted historical datasets rather than presenting them as current public-health information.

## Run locally

The D3 data requests require a local web server:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Repository structure

```text
├── index.html              Project overview
├── html/                   Three interactive visualisations
├── javascript/             D3 chart code
├── css/                    Shared and chart-specific styling
├── data/                   Static chart-ready datasets and world geometry
├── data-processing/        Java/JSON.simple preprocessing pipeline
├── design-process/         Four curated design and D3 prototyping stages
└── docs/                   Submitted coursework report
```

## Data processing

The archived Java pipeline is reproducible with Maven:

```sh
cd data-processing
mvn compile exec:java
```

This reads the included `vaccinations.json` source snapshot and writes `februaryVaccinationData.json` locally. The generated file is ignored; an earlier coursework export is preserved as `historical-output.json`, and the final chart-ready datasets are under `data/`.

## Sources and acknowledgements

- Vaccination data: [Our World in Data](https://ourworldindata.org/coronavirus-source-data)
- Choropleth foundation: [Mikael Koutero](https://bl.ocks.org/eetuko/4535086c3fabe76a173b432c44b254c6)
- Legend component: [Susie Lu's d3-legend](https://d3-legend.susielu.com/)
- Lollipop-chart foundation: [Yan Holtz / D3 Graph Gallery](https://www.d3-graph-gallery.com/graph/lollipop_animationStart.html)
- Donut-chart foundation: [KJ Schmidt](https://medium.com/@kj_schmidt/making-an-animated-donut-chart-with-d3-js-17751fde4679)

This is an archived coursework project and is not actively maintained.
