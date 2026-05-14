import { useCallback, useEffect, useMemo, useState } from "react";
import { failingCtqs } from "./ctqSpecs";
import { Sidebar } from "./components/Sidebar";
import { LineAnimation } from "./components/LineAnimation";
import { CTQCharts } from "./components/CTQCharts";
import { sliceForCharts, useDataset } from "./useDataset";

const CSV_URL = "/dataset_Philips_FieldProject_2026.csv";

export default function App() {
  const load = useDataset(CSV_URL);
  const rows = load.status === "ready" ? load.rows : [];
  const maxIdx = Math.max(0, rows.length - 1);

  const [playing, setPlaying] = useState(true);
  const [speedMs, setSpeedMs] = useState(520);
  const [sampleIndex, setSampleIndex] = useState(0);
  const [phase, setPhase] = useState(0);
  const [chartWindow, setChartWindow] = useState(5000);

  useEffect(() => {
    if (sampleIndex > maxIdx) setSampleIndex(maxIdx);
  }, [maxIdx, sampleIndex]);

  useEffect(() => {
    if (!playing) return;
    const tickMs = 40;
    const id = window.setInterval(() => {
      setPhase((p) => {
        const step = tickMs / speedMs;
        const np = p + step;
        if (np >= 1) {
          setSampleIndex((i) => (i >= maxIdx ? 0 : i + 1));
          return np - 1;
        }
        return np;
      });
    }, tickMs);
    return () => clearInterval(id);
  }, [playing, speedMs, maxIdx]);

  const onSampleChange = useCallback((idx: number) => {
    setSampleIndex(idx);
    setPhase(0);
  }, []);

  const currentRow = rows[sampleIndex] ?? null;
  const failing = useMemo(() => (currentRow ? failingCtqs(currentRow) : []), [currentRow]);

  const chartRows = useMemo(
    () => sliceForCharts(rows, sampleIndex + 1, chartWindow),
    [rows, sampleIndex, chartWindow],
  );

  const loadLabel =
    load.status === "loading"
      ? "Loading CSV…"
      : load.status === "error"
        ? load.message
        : `${rows.length.toLocaleString()} units`;

  return (
    <div className="app-shell">
      <Sidebar
        playing={playing}
        onTogglePlay={() => setPlaying((v) => !v)}
        speedMs={speedMs}
        onSpeedChange={(ms) => {
          setSpeedMs(ms);
          setPhase(0);
        }}
        sampleIndex={sampleIndex}
        maxSample={maxIdx}
        onSampleChange={onSampleChange}
        chartWindow={chartWindow}
        onChartWindowChange={setChartWindow}
        linePhase={phase}
        currentSample={currentRow?.sample ?? null}
        failing={failing}
        loadLabel={loadLabel}
      />

      <main className="main-panel">
        {load.status === "loading" && (
          <div className="overlay-msg">
            <p>Parsing production data…</p>
            <p className="muted">Large CSV — first load may take a few seconds.</p>
          </div>
        )}
        {load.status === "error" && (
          <div className="overlay-msg error">
            <p>Could not load dataset.</p>
            <p className="muted">{load.message}</p>
          </div>
        )}
        {load.status === "ready" && (
          <>
            <LineAnimation phase={phase} currentRow={currentRow} />
            <CTQCharts rows={chartRows} />
            <footer className="footer-note">
              Specifications from FieldProject_DigitalTwin_2026 (Table&nbsp;1). Distributions use the
              trailing window of completed units (see sidebar).
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
