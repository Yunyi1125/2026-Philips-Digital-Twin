import { CTQ_SPECS, type CTQKey } from "../ctqSpecs";
import type { UnitRow } from "../useDataset";

const STATIONS = [
  { id: "S1", title: "Station 1", ctqs: ["S1_Q1", "S1_Q2"] as CTQKey[] },
  { id: "S2", title: "Station 2", ctqs: ["S2_Q1"] as CTQKey[] },
  { id: "S3", title: "Station 3", ctqs: ["S3_Q1", "S3_Q2", "S3_Q3"] as CTQKey[] },
  { id: "S4", title: "Station 4", ctqs: ["S4_Q1"] as CTQKey[] },
  { id: "S5", title: "Station 5", ctqs: ["S5_Q1"] as CTQKey[] },
];

type Props = {
  phase: number;
  currentRow: UnitRow | null;
};

function specFor(key: CTQKey) {
  return CTQ_SPECS.find((s) => s.key === key)!;
}

export function LineAnimation({ phase, currentRow }: Props) {
  const n = STATIONS.length;
  const active = Math.min(n - 1, Math.floor(phase * n));
  const t = phase * n - active;
  const pctAlong = Math.min(1, (active + Math.min(1, Math.max(0, t))) / Math.max(1, n - 1));

  return (
    <section className="line-section">
      <header className="line-header">
        <h2>Unit on the line</h2>
        <p className="muted">
          One sub-assembly moves S1→S5. Measurements appear as the unit reaches each station.
        </p>
      </header>

      <div className="line-track">
        <div className="line-rail" aria-hidden />
        <div
          className="line-token"
          style={{
            left: `${(pctAlong * 100).toFixed(3)}%`,
            transform: "translateX(-50%)",
          }}
        >
          <span className="token-core" />
        </div>

        <div className="stations">
          {STATIONS.map((st, i) => {
            const isActive = i === active;
            const done = i < active;
            return (
              <div key={st.id} className={`station-card ${isActive ? "active" : ""} ${done ? "done" : ""}`}>
                <div className="station-head">
                  <span className="badge">{st.id}</span>
                  <span className="station-title">{st.title}</span>
                </div>
                <ul className="ctq-readouts">
                  {st.ctqs.map((key) => {
                    const spec = specFor(key);
                    const val = currentRow?.[key];
                    const ok =
                      val === undefined || val === null
                        ? true
                        : val >= spec.lsl && val <= spec.usl;
                    return (
                      <li key={key} className={ok ? "" : "bad"}>
                        <span className="mono">{key}</span>
                        <span className="readout">
                          {val === undefined || val === null ? "—" : val.toFixed(3)}
                          <small>{spec.unit}</small>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
