import { useEffect, useState } from "react";
import Papa from "papaparse";
import type { CTQKey } from "./ctqSpecs";
import { CTQ_KEYS } from "./ctqSpecs";

export type UnitRow = { sample: number } & Record<CTQKey, number>;

type LoadState =
  | { status: "idle" | "loading" }
  | { status: "ready"; rows: UnitRow[] }
  | { status: "error"; message: string };

const MAX_ROWS = 120_000;

export function useDataset(csvUrl: string): LoadState {
  const [state, setState] = useState<LoadState>({ status: "idle" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    Papa.parse(csvUrl, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (cancelled) return;
        const errors = results.errors?.filter((e) => e.type !== "Quotes");
        if (errors?.length) {
          setState({
            status: "error",
            message: errors.map((e) => e.message).join("; "),
          });
          return;
        }
        const raw = results.data as Record<string, unknown>[];
        const rows: UnitRow[] = [];
        for (let i = 0; i < raw.length && i < MAX_ROWS; i++) {
          const r = raw[i];
          if (!r || typeof r.Sample !== "number") continue;
          const base = { sample: r.Sample as number };
          let ok = true;
          const values: Partial<Record<CTQKey, number>> = {};
          for (const k of CTQ_KEYS) {
            const v = r[k];
            if (typeof v !== "number" || Number.isNaN(v)) {
              ok = false;
              break;
            }
            values[k] = v;
          }
          if (ok) rows.push({ ...base, ...values } as UnitRow);
        }
        if (!rows.length) {
          setState({ status: "error", message: "No valid rows parsed from CSV." });
          return;
        }
        setState({ status: "ready", rows });
      },
      error: (err) => {
        if (!cancelled) setState({ status: "error", message: err.message });
      },
    });

    return () => {
      cancelled = true;
    };
  }, [csvUrl]);

  return state;
}

/** Subsample indices [0, end] for chart performance; bias toward recent units. */
export function sliceForCharts(rows: UnitRow[], endExclusive: number, cap: number): UnitRow[] {
  const end = Math.min(endExclusive, rows.length);
  if (end <= 0) return [];
  if (end <= cap) return rows.slice(0, end);
  return rows.slice(end - cap, end);
}
