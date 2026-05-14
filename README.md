# Philips Field Project Digital Twin Dashboard

This frontend dashboard supports the **2026 Philips Drachten digital twin** use case: it visualizes how **CTQs (critical-to-quality characteristics)** evolve across stations **S1–S5** for each **production unit**, so you can compare measurements to spec limits, spot trends, and highlight outliers.

## What the dashboard does

- **Unit-by-unit playback**: Step through `Sample` order with play/pause and adjustable speed to mimic line time progression.
- **Specs and failures**: Targets, LSL, and USL come from **Table 1** in *FieldProject_DigitalTwin_2026*; the current unit is checked and **out-of-spec CTQs** are listed.
- **Main view**: A line-style animation summarizes the active unit; **Plotly** charts below show each CTQ over a **trailing window** of recently completed units so you can see short-term variation and boundary crossings.
- **Sidebar**: Current sample index, failing CTQ list, chart window length, and other controls.

Column semantics match the station/metric keys defined in `src/ctqSpecs.ts` (e.g. S1_Q1, S2_Q1, … with units such as μm and Hz).

## Data (raw files are not in the repo)

The app loads **`/dataset_Philips_FieldProject_2026.csv`**, which in local development maps to **`public/dataset_Philips_FieldProject_2026.csv`**.

For compliance and size, **raw CSV datasets are not committed** (see `.gitignore`).

Before running locally, place a CSV with the expected headers in `public/` using that filename. The file must include a `Sample` column plus each CTQ column whose name matches the keys in `ctqSpecs.ts`.

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Stack

React 18, TypeScript, Vite, Papa Parse (CSV), Plotly.js (charts).

## Relation to the main repository

This dashboard lives in **[Yunyi1125/2026-Philips-Digital-Twin](https://github.com/Yunyi1125/2026-Philips-Digital-Twin)** as the web UI for exploring digital-twin / field-project data. **Official conclusions should still be based on governed data sources and project documentation.**
