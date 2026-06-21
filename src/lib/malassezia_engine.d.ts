// 타입 선언 — malassezia_engine.js(UMD/CommonJS)를 Next.js에서 타입 안전하게 import
export type Tier = "strong" | "med" | "disp";

export interface Flagged {
  name: string;
  cat: string;
  tier: Tier;
}

export interface AnalyzeResult {
  flagged: Flagged[];
  counts: { strong: number; med: number; disp: number };
  total: number;
  verdict: "주의" | "경고" | "안전";
}

export function classify(token: string): { cat: string; tier: Tier } | null;
export function analyze(text: string): AnalyzeResult;
export const version: string;

declare const _default: {
  classify: typeof classify;
  analyze: typeof analyze;
  version: string;
};
export default _default;
