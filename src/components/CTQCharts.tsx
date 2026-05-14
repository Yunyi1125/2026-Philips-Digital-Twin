import { useEffect, useMemo, useRef } from "react";
import Plotly from "plotly.js-dist-min";
import type { Data, Layout, Config } from "plotly.js";
import { CTQ_SPECS, type CTQKey } from "../ctqSpecs";
import type { UnitRow } from "../useDataset";

type Props = {
  rows: UnitRow[];
};

const PLOT_CONFIG: Partial<Config> = {
  displayModeBar: false,
  responsive: true,
};

function buildShapes(
  spec: (typeof CTQ_SPECS)[number],
  dataMin: number,
  dataMax: number,
): Partial<Layout["shapes"]> {
  const pad = (dataMax - dataMin) * 0.08 || Math.abs(spec.usl - spec.lsl) * 0.1 || 1;
  const xmin = Math.min(dataMin, spec.lsl) - pad;
  const xmax = Math.max(dataMax, spec.usl) + pad;
  return [
    {
      type: "rect",
      xref: "x",
      yref: "paper",
      x0: xmin,
      x1: spec.lsl,
      y0: 0,
      y1: 1,
      fillcolor: "rgba(239,68,68,0.14)",
      line: { width: 0 },
      layer: "below",
    },
    {
      type: "rect",
      xref: "x",
      yref: "paper",
      x0: spec.usl,
      x1: xmax,
      y0: 0,
      y1: 1,
      fillcolor: "rgba(239,68,68,0.14)",
      line: { width: 0 },
      layer: "below",
    },
    {
      type: "line",
      xref: "x",
      yref: "paper",
      x0: spec.lsl,
      x1: spec.lsl,
      y0: 0,
      y1: 1,
      line: { color: "rgba(220,38,38,0.95)", width: 2, dash: "dash" },
      layer: "above",
    },
    {
      type: "line",
      xref: "x",
      yref: "paper",
      x0: spec.usl,
      x1: spec.usl,
      y0: 0,
      y1: 1,
      line: { color: "rgba(220,38,38,0.95)", width: 2, dash: "dash" },
      layer: "above",
    },
    {
      type: "line",
      xref: "x",
      yref: "paper",
      x0: spec.target,
      x1: spec.target,
      y0: 0,
      y1: 1,
      line: { color: "rgba(59,130,246,0.55)", width: 1.5, dash: "dot" },
      layer: "above",
    },
  ];
}

function SingleCTQPlots({ ctqKey, rows }: { ctqKey: CTQKey; rows: UnitRow[] }) {
  const histRef = useRef<HTMLDivElement>(null);
  const violinRef = useRef<HTMLDivElement>(null);
  const spec = CTQ_SPECS.find((s) => s.key === ctqKey)!;

  const xs = useMemo(() => rows.map((r) => r[ctqKey]), [rows, ctqKey]);
  const values = xs.length ? xs : [spec.target];
  const dataMin = Math.min(...values, spec.lsl);
  const dataMax = Math.max(...values, spec.usl);

  useEffect(() => {
    const elH = histRef.current;
    const elV = violinRef.current;
    if (!elH || !elV) return;

    const shapes = buildShapes(spec, dataMin, dataMax);

    const histTrace: Data = {
      type: "histogram",
      x: values,
      name: "Count",
      marker: { color: "rgba(14,165,233,0.55)", line: { color: "rgba(2,132,199,0.35)", width: 1 } },
      autobinx: true,
    };

    const histLayout: Partial<Layout> = {
      margin: { l: 44, r: 10, t: 28, b: 36 },
      title: {
        text: `${spec.label} · histogram`,
        font: { size: 12, color: "#e2e8f0" },
      },
      paper_bgcolor: "transparent",
      plot_bgcolor: "rgba(15,23,42,0.35)",
      font: { color: "#94a3b8", size: 10 },
      xaxis: { title: `${spec.unit}`, gridcolor: "rgba(148,163,184,0.12)", zeroline: false },
      yaxis: { title: "Freq", gridcolor: "rgba(148,163,184,0.12)", zeroline: false },
      shapes: shapes as Layout["shapes"],
      showlegend: false,
    };

    const violinTrace: Data = {
      type: "violin",
      y: values,
      name: "Distribution",
      box: { visible: true, fillcolor: "rgba(15,23,42,0.6)", line: { color: "#64748b" } },
      meanline: { visible: true, color: "#f8fafc" },
      fillcolor: "rgba(56,189,248,0.35)",
      line: { color: "rgba(125,211,252,0.9)", width: 1 },
      opacity: 0.92,
      side: "positive",
    };

    const violinLayout: Partial<Layout> = {
      margin: { l: 44, r: 10, t: 28, b: 36 },
      title: {
        text: `${spec.label} · violin`,
        font: { size: 12, color: "#e2e8f0" },
      },
      paper_bgcolor: "transparent",
      plot_bgcolor: "rgba(15,23,42,0.35)",
      font: { color: "#94a3b8", size: 10 },
      xaxis: { visible: false },
      yaxis: {
        title: `${spec.unit}`,
        gridcolor: "rgba(148,163,184,0.12)",
        zeroline: false,
      },
      shapes: [
        {
          type: "line",
          xref: "paper",
          yref: "y",
          x0: 0,
          x1: 1,
          y0: spec.lsl,
          y1: spec.lsl,
          line: { color: "rgba(220,38,38,0.95)", width: 2, dash: "dash" },
          layer: "above",
        },
        {
          type: "line",
          xref: "paper",
          yref: "y",
          x0: 0,
          x1: 1,
          y0: spec.usl,
          y1: spec.usl,
          line: { color: "rgba(220,38,38,0.95)", width: 2, dash: "dash" },
          layer: "above",
        },
        {
          type: "rect",
          xref: "paper",
          yref: "y",
          x0: 0,
          x1: 1,
          y0: Math.min(dataMin, spec.lsl) - 1,
          y1: spec.lsl,
          fillcolor: "rgba(239,68,68,0.12)",
          line: { width: 0 },
          layer: "below",
        },
        {
          type: "rect",
          xref: "paper",
          yref: "y",
          x0: 0,
          x1: 1,
          y0: spec.usl,
          y1: Math.max(dataMax, spec.usl) + 1,
          fillcolor: "rgba(239,68,68,0.12)",
          line: { width: 0 },
          layer: "below",
        },
        {
          type: "line",
          xref: "paper",
          yref: "y",
          x0: 0,
          x1: 1,
          y0: spec.target,
          y1: spec.target,
          line: { color: "rgba(59,130,246,0.55)", width: 1.5, dash: "dot" },
          layer: "above",
        },
      ] as Layout["shapes"],
      showlegend: false,
    };

    const p1 = Plotly.react(elH, [histTrace], histLayout, PLOT_CONFIG);
    const p2 = Plotly.react(elV, [violinTrace], violinLayout, PLOT_CONFIG);
    void Promise.all([p1, p2]);

    const ro = new ResizeObserver(() => {
      Plotly.Plots.resize(elH);
      Plotly.Plots.resize(elV);
    });
    ro.observe(elH);
    ro.observe(elV);

    return () => {
      ro.disconnect();
      Plotly.purge(elH);
      Plotly.purge(elV);
    };
  }, [ctqKey, spec, values, dataMin, dataMax]);

  return (
    <div className="ctq-pair">
      <div ref={histRef} className="plot-cell" />
      <div ref={violinRef} className="plot-cell" />
    </div>
  );
}

export function CTQCharts({ rows }: Props) {
  return (
    <section className="charts-section">
      <header className="charts-header">
        <h2>CTQ distributions</h2>
        <p className="muted">
          Live histogram and violin for each CTQ. Red bands and dashed lines: LSL/USL. Blue dotted:
          target.
        </p>
      </header>
      <div className="charts-grid">
        {CTQ_SPECS.map((s) => (
          <SingleCTQPlots key={s.key} ctqKey={s.key} rows={rows} />
        ))}
      </div>
    </section>
  );
}
