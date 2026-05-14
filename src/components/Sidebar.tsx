import type { CTQSpec } from "../ctqSpecs";

type Props = {
  playing: boolean;
  onTogglePlay: () => void;
  speedMs: number;
  onSpeedChange: (ms: number) => void;
  sampleIndex: number;
  maxSample: number;
  onSampleChange: (idx: number) => void;
  chartWindow: number;
  onChartWindowChange: (n: number) => void;
  linePhase: number;
  currentSample: number | null;
  failing: CTQSpec[];
  loadLabel: string;
};

const SPEED_OPTIONS = [
  { label: "Slow", ms: 900 },
  { label: "Normal", ms: 520 },
  { label: "Fast", ms: 260 },
];

export function Sidebar({
  playing,
  onTogglePlay,
  speedMs,
  onSpeedChange,
  sampleIndex,
  maxSample,
  onSampleChange,
  chartWindow,
  onChartWindowChange,
  linePhase,
  currentSample,
  failing,
  loadLabel,
}: Props) {
  const stationStep = Math.min(4, Math.floor(linePhase * 5));

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" />
        <div>
          <h1>Assembly twin</h1>
          <p className="muted">Philips line · CTQ monitor</p>
        </div>
      </div>

      <div className="panel">
        <h2>Simulation</h2>
        <button type="button" className={`play-btn ${playing ? "on" : ""}`} onClick={onTogglePlay}>
          {playing ? "Pause" : "Play"}
        </button>
        <div className="field">
          <label>Line speed</label>
          <div className="seg">
            {SPEED_OPTIONS.map((o) => (
              <button
                key={o.ms}
                type="button"
                className={speedMs === o.ms ? "active" : ""}
                onClick={() => onSpeedChange(o.ms)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label>
            Sample index <span className="mono">{currentSample ?? "—"}</span>
          </label>
          <input
            type="range"
            min={0}
            max={Math.max(0, maxSample)}
            value={sampleIndex}
            onChange={(e) => onSampleChange(Number(e.target.value))}
          />
        </div>
        <div className="stat-grid">
          <div>
            <span className="muted">Station focus</span>
            <strong>S{stationStep + 1}</strong>
          </div>
          <div>
            <span className="muted">Data</span>
            <strong className="truncate" title={loadLabel}>
              {loadLabel}
            </strong>
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>Charts</h2>
        <div className="field">
          <label>Sliding window (most recent units)</label>
          <select
            value={chartWindow}
            onChange={(e) => onChartWindowChange(Number(e.target.value))}
          >
            <option value={800}>800</option>
            <option value={2000}>2 000</option>
            <option value={5000}>5 000</option>
            <option value={15000}>15 000</option>
          </select>
        </div>
        <p className="hint">
          Histograms and violins update as units complete the line. LSL/USL are drawn in red; shaded
          bands show out-of-spec regions.
        </p>
      </div>

      <div className="panel alert-panel">
        <h2>Current unit</h2>
        {failing.length === 0 ? (
          <p className="ok">All CTQs in spec for this unit.</p>
        ) : (
          <ul className="fail-list">
            {failing.map((f) => (
              <li key={f.key}>
                <span className="mono">{f.key}</span> outside [{f.lsl}, {f.usl}] {f.unit}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
