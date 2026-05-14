export type CTQKey =
  | "S1_Q1"
  | "S1_Q2"
  | "S2_Q1"
  | "S3_Q1"
  | "S3_Q2"
  | "S3_Q3"
  | "S4_Q1"
  | "S5_Q1";

export type CTQSpec = {
  key: CTQKey;
  station: "S1" | "S2" | "S3" | "S4" | "S5";
  label: string;
  unit: string;
  target: number;
  lsl: number;
  usl: number;
};

/** Table 1 — FieldProject_DigitalTwin_2026.pdf */
export const CTQ_SPECS: CTQSpec[] = [
  { key: "S1_Q1", station: "S1", label: "S1_Q1", unit: "μm", target: 20, lsl: 15, usl: 25 },
  { key: "S1_Q2", station: "S1", label: "S1_Q2", unit: "μm", target: 7, lsl: 2, usl: 12 },
  { key: "S2_Q1", station: "S2", label: "S2_Q1", unit: "μm", target: 18, lsl: 14, usl: 22 },
  { key: "S3_Q1", station: "S3", label: "S3_Q1", unit: "μm", target: 33, lsl: 30, usl: 36 },
  { key: "S3_Q2", station: "S3", label: "S3_Q2", unit: "μm", target: 11, lsl: 9.5, usl: 12.5 },
  { key: "S3_Q3", station: "S3", label: "S3_Q3", unit: "μm", target: 16, lsl: 10, usl: 22 },
  { key: "S4_Q1", station: "S4", label: "S4_Q1", unit: "μm", target: 27, lsl: 21, usl: 33 },
  { key: "S5_Q1", station: "S5", label: "S5_Q1", unit: "Hz", target: 250, lsl: 210, usl: 290 },
];

export const CTQ_KEYS: CTQKey[] = CTQ_SPECS.map((s) => s.key);

export function isInSpec(value: number, spec: CTQSpec): boolean {
  return value >= spec.lsl && value <= spec.usl;
}

export function failingCtqs(
  row: Record<CTQKey, number>,
): CTQSpec[] {
  return CTQ_SPECS.filter((s) => !isInSpec(row[s.key], s));
}
