# Data processing

This folder preserves the Java pipeline used for the submitted coursework. It reads the included 2021 Our World in Data vaccination snapshot, builds country/world objects and calculates each country's share of global vaccination totals.

Run with Java 11+ and Maven:

```sh
mvn compile exec:java
```

The original code writes `februaryVaccinationData.json` in this folder. That generated file is ignored. `historical-output.json` preserves an earlier coursework export, while the final chart-ready datasets used by the visualisations are under `../data/`.
