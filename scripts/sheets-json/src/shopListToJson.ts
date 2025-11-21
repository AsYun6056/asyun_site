import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { google } from "googleapis";
import { z } from "zod";
import { loadServiceAccount } from ".";

// --------- 환경설정 ---------
const SPREADSHEET_ID = mustEnv("SHOP_SPREADSHEET_ID");
const SHEET_NAME = process.env.SHEET_NAME; // 예: "Sheet1"
const RANGE = process.env.RANGE; // 예: "Sheet1!A1:Z"
const OUT_DIR = process.env.OUT_DIR ?? "dist";
const OUT_FILE = process.env.SHOP_OUT_FILE ?? "shopItems.json";

// 컬럼명 매핑 (시트 헤더 → JSON 키)
const keyMap: Record<string, string> = {
  제품분류: "type",
  제품이름: "name",
  제품특징: "desc",
  링크: "url",
};

// 스키마(필요에 따라 수정)
// - 없으면 문자열로 들어온 값이 그대로 들어가기 쉬워서 추천
const RowSchema = z.object({
  type: z
    .string()
    .nullish()
    .transform((v) => v ?? null),
  name: z
    .string()
    .nullish()
    .transform((v) => (v ? v : null)),
  desc: z
    .string()
    .min(1)
    .transform((v) => v.replace(/\n/g, "<br/>")),
  url: z
    .string()
    .nullish()
    .transform((v) => (v ? v : null)),
});

type Row = z.infer<typeof RowSchema>;

// --------- 유틸 ---------
function mustEnv(k: string) {
  const v = process.env[k];
  if (!v) throw new Error(`Missing env: ${k}`);
  return v;
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function normalizeHeader(h: unknown) {
  return String(h ?? "").trim();
}

// --------- 인증 ---------
async function getClient() {
  const sa = loadServiceAccount(); // { client_email, private_key, ... } 객체

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: sa.client_email,
      private_key: sa.private_key, // BEGIN/END 포함, \n 포함 그대로
    },
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      // 드라이브 읽기 필요하면 추가:
      // "https://www.googleapis.com/auth/drive.readonly",
    ],
  });

  return auth.getClient();
}

// --------- 시트 읽기 (재시도 포함) ---------
async function fetchValuesWithRetry(sheets: any, args: any, maxRetry = 5) {
  let attempt = 0;
  while (true) {
    try {
      const res = await sheets.spreadsheets.values.get(args);
      return res.data.values as unknown[][] | undefined;
    } catch (err: any) {
      const status = err?.code ?? err?.response?.status;
      const retryable = [429, 500, 502, 503, 504].includes(Number(status));
      attempt++;
      if (!retryable || attempt > maxRetry) throw err;
      const backoff = Math.min(2000 * attempt, 8000);
      await sleep(backoff);
    }
  }
}

// --------- 변환 파이프라인 ---------
function rowsToObjects(
  values: unknown[][],
  keyMap: Record<string, string>
): Record<string, unknown>[] {
  const headers = (values[0] ?? []).map(normalizeHeader);
  const dataRows = values.slice(1);

  return dataRows.map((row) => {
    const obj: Record<string, unknown> = {};
    headers.forEach((h, i) => {
      const key = keyMap[h] ?? h; // 매핑 없으면 원래 헤더 사용
      obj[key] = row[i] ?? null;
    });
    return obj;
  });
}

// 사용자 정의 변환 로직: 필터/정렬/그룹핑 등
function transform(objs: Record<string, unknown>[]) {
  // 1) 스키마 캐스팅/검증
  const parsed: Row[] = objs.map((o) => RowSchema.parse(o));

  // 2) 필터: active=true만
  // const filtered = parsed.filter((r) => r.active === true);

  // 3) 정렬: priority 오름차, null은 뒤로
  // filtered.sort((a, b) => (a.priority ?? Infinity) - (b.priority ?? Infinity));

  // 4) 필요 시 그룹핑 예시: category 기준으로 묶기
  const grouped: Record<string, Row[]> = {};
  for (const r of parsed) {
    const key = r.type ?? "UNCATEGORIZED";
    (grouped[key] ??= []).push(r);
  }

  // 기본 반환은 납품 스키마에 맞춰서:
  // - 전체 목록
  // - 그룹핑 결과
  return { list: parsed, byCategory: grouped };
}

// --------- 저장 ---------
function writeJSON(filename: string, data: unknown) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, filename);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), "utf-8");
  console.log("Wrote:", outPath);
}

// --------- 메인 ---------
async function main() {
  const authClient = await getClient();
  const sheets = google.sheets({ version: "v4", auth: authClient });

  // 범위 선택: RANGE 우선, 없으면 SHEET_NAME 전체(A:ZZ) 가져오기
  const range = RANGE ?? `${SHEET_NAME}!A1:ZZ`;
  if (!range) throw new Error("RANGE 또는 SHEET_NAME 중 하나는 필요합니다.");

  const values = await fetchValuesWithRetry(sheets, {
    spreadsheetId: SPREADSHEET_ID,
    range,
  });

  if (!values || values.length < 2) {
    throw new Error("데이터가 비어있거나 헤더만 존재합니다.");
  }

  const objs = rowsToObjects(values, keyMap);
  const result = transform(objs);

  // 단일 파일
  writeJSON(OUT_FILE, result);

  // 예: 여러 파일로 분할 저장하고 싶으면
  // const res = transform(objs) as { list: Row[], byCategory: Record<string, Row[]> };
  // writeJSON('list.json', res.list);
  // Object.entries(res.byCategory).forEach(([cat, rows]) => {
  //   writeJSON(`category-${slug(cat)}.json`, rows);
  // });
}

// function slug(s: string) {
//   return s
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/(^-|-$)/g, "");
// }

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
