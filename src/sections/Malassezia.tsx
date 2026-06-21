"use client";

import { useState } from "react";
import Engine from "@/lib/malassezia_engine";
import type { AnalyzeResult, Tier } from "@/lib/malassezia_engine";

// 파스텔 색상
const DOT_CLASS: Record<Tier, string> = {
  strong: "bg-[#f2a0a0]",   // 파스텔 레드
  med:    "bg-[#f5c08a]",   // 파스텔 오렌지
  disp:   "bg-[#f0d882]",   // 파스텔 옐로
};

const LEGEND = [
  { color: "bg-[#f2a0a0]", label: "유발 가능성 높음" },
  { color: "bg-[#f5c08a]", label: "유발 가능성 중간" },
  { color: "bg-[#f0d882]", label: "개인차 (출처마다 평가 갈림 · 패치 테스트 권장됨)" },
  { color: "bg-[#90d4a0]", label: "안전" },
];

type SummaryPart = { color: string; count: number };

function buildSummaryParts(total: number, counts: AnalyzeResult["counts"]): SummaryPart[] {
  const safe = total - counts.strong - counts.med - counts.disp;
  const parts: SummaryPart[] = [];
  if (counts.strong > 0) parts.push({ color: "bg-[#f2a0a0]", count: counts.strong });
  if (counts.med    > 0) parts.push({ color: "bg-[#f5c08a]", count: counts.med });
  if (counts.disp   > 0) parts.push({ color: "bg-[#f0d882]", count: counts.disp });
  if (safe          > 0) parts.push({ color: "bg-[#90d4a0]", count: safe });
  return parts;
}

const Malassezia = ({
  refItem,
}: {
  refItem: React.RefObject<HTMLDivElement | null>;
}) => {
  const [input, setInput]         = useState("");
  const [res, setRes]             = useState<AnalyzeResult | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [phase, setPhase]         = useState<"input" | "results">("input");
  const [visible, setVisible]     = useState(true);

  const fade = (cb: () => void) => {
    setVisible(false);
    setTimeout(() => { cb(); setVisible(true); }, 350);
  };

  const handleAnalyze = () => {
    if (!input.trim()) return;
    fade(() => { setRes(Engine.analyze(input)); setPhase("results"); });
  };

  const handleReset = () => {
    fade(() => { setRes(null); setInput(""); setPhase("input"); });
  };

  return (
    <div
      ref={refItem}
      className="relative w-full min-h-[calc(100dvh-50px)] md:min-h-[calc(100dvh-60px)] bg-cover bg-[#555]"
      style={{ backgroundImage: "url('/drive-images/malassezia-bg.png')", backgroundPosition: "65% center" }}
    >
      {/* 모바일 전용: 균일 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black/62 md:hidden" />
      {/* 데스크탑 전용: 왼쪽 진하고 오른쪽 투명한 그라데이션 */}
      <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-black/70 via-black/45 to-black/10" />

      {/* 콘텐츠 */}
      <div
        className={`relative z-10 flex flex-col justify-center min-h-[calc(100dvh-50px)] md:min-h-[calc(100dvh-60px)] px-5 py-10 md:px-16 md:py-20 w-full md:max-w-2xl transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      >

        {/* ── 입력 화면 ── */}
        {phase === "input" && (
          <>
            <h1 className="!text-[1.1rem] font-semibold text-white leading-snug md:!text-[2.6rem] md:leading-[1.25]">
              말라세지아 모낭염 유발성분,
              <br />
              <span className="text-white">에즈윤과 함께 체크해요~</span>
            </h1>

            <p className="mt-3 text-sm text-white/80 md:mt-5 md:text-lg">
              민감 피부일수록, 성분 확인을 더 꼼꼼하게!
              <br />
              쉽고 빠르게 말라세지아 모낭염 유발 성분을 체크해 보세요~
            </p>

            <p className="mt-3 text-sm text-white/90 md:mt-4 md:text-base">
              ▼{" "}
              <button onClick={() => setGuideOpen(true)} className="underline text-white/90">
                사용 가이드
              </button>
              를 참고해, 제품의 전 성분을 입력해 주세요.
            </p>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="예) 정제수, 글리세린, 글리세릴스테아레이트, 폴리소르베이트60, 올리브오일 ..."
              className="mt-3 min-h-[130px] w-full resize-y rounded border border-white/40 bg-white/15 p-4 text-[16px] text-white placeholder:text-white/50 outline-none focus:border-white/70 backdrop-blur-sm"
            />
            <button
              onClick={handleAnalyze}
              className="mt-3 rounded bg-white px-7 py-3 tracking-widest text-[#20201e] font-semibold transition hover:bg-[#b83330] hover:text-white self-start"
            >
              분석하기
            </button>
          </>
        )}

        {/* ── 결과 화면 ── */}
        {phase === "results" && res && (
          <>
            <h2
              className="text-2xl font-semibold mb-2"
              style={{
                color:
                  res.flagged.length === 0
                    ? "#90d4a0"
                    : res.counts.strong > 0
                    ? "#f2a0a0"
                    : "#f0d882",
              }}
            >
              {res.flagged.length === 0
                ? "✓ 안전 — 유발 성분 미검출"
                : res.counts.strong > 0
                ? `⚠️ 주의 — 유발 성분 ${res.flagged.length}개 감지`
                : `참고 — 약한·개인차 성분 ${res.flagged.length}개`}
            </h2>

            {/* 요약 한 줄 — styled dot 사용 */}
            <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/70">
              <span>총 {res.total}개 성분 중</span>
              {buildSummaryParts(res.total, res.counts).map((p, i, arr) => (
                <span key={i} className="flex items-center gap-1">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${p.color}`} />
                  <span>{p.count}개{i < arr.length - 1 ? "," : ""}</span>
                </span>
              ))}
            </div>

            {/* 성분 테이블: 점 + 성분명 + 분류 */}
            {res.flagged.length > 0 && (
              <table className="w-full overflow-hidden rounded border border-white/30 bg-black/40 text-left text-sm text-white backdrop-blur-sm">
                <thead>
                  <tr className="bg-white/10 text-white/60">
                    <th className="p-2.5 font-semibold">성분</th>
                    <th className="p-2.5 font-semibold text-right pr-4">분류</th>
                  </tr>
                </thead>
                <tbody>
                  {res.flagged.map((f, i) => (
                    <tr key={i} className="border-t border-white/20">
                      <td className="p-2.5">
                        <span className={`mr-2.5 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full align-middle ${DOT_CLASS[f.tier]}`} />
                        {f.name}
                      </td>
                      <td className="p-2.5 text-right pr-4 text-white/60 text-xs">{f.cat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 범례 */}
            <div className="mt-4 flex flex-col gap-1.5 text-sm text-white/80">
              {LEGEND.map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <span className={`inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full ${l.color}`} />
                  <span>{l.label}</span>
                </div>
              ))}
            </div>

            {/* 다시 분석하기 */}
            <button
              onClick={handleReset}
              className="mt-6 self-start rounded border border-white/60 px-6 py-2.5 text-white/90 text-sm transition hover:bg-white/20"
            >
              다시 분석하기
            </button>
          </>
        )}
      </div>

      {/* 사용 가이드 팝업 */}
      {guideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 py-10"
          onClick={() => setGuideOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-lg bg-white p-7 md:p-10 text-[#20201e]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setGuideOpen(false)}
              className="absolute right-5 top-4 text-xl text-[#6b675f] hover:text-[#a93b2a]"
              aria-label="닫기"
            >
              ✕
            </button>
            <h2 className="mb-6 text-2xl font-bold">사용 가이드</h2>
            <div className="space-y-5 text-[15px] leading-relaxed">
              <div>
                <p className="font-bold"><span className="underline">Step 1</span>: 전 성분을 입력해 주세요.</p>
                <p className="text-[#54504a]">
                  확인하고 싶으신 제품의 전 성분을 입력해 주세요.<br />
                  단일 성분만 입력해도 되고, 제품 전 성분 전체를 복사해 붙여넣으셔도 됩니다.
                </p>
              </div>
              <div>
                <p className="font-bold"><span className="underline">Step 2</span>: 오타와 표기를 확인해 주세요.</p>
                <p className="text-[#54504a]">
                  성분이 쉼표(,)로 구분되면 가장 정확합니다.<br />
                  한글·영문 모두 인식하지만, 오타가 있으면 인식이 어려울 수 있습니다.
                </p>
              </div>
              <div>
                <p className="font-bold"><span className="underline">Step 3</span>: 검색 버튼을 눌러 주세요.</p>
                <p className="text-[#54504a]">
                  검색 버튼을 누르면 입력한 성분 중 말라세지아 모낭염에 주의가 필요하다고 알려진 성분을 찾아 보여줍니다.
                </p>
              </div>
              <div>
                <p className="font-bold"><span className="underline">Step 4</span>: 결과는 참고 기준으로 확인해 주세요.</p>
                <p className="text-[#54504a]">
                  본 체커는 말라세지아 피부에서 주의가 필요하다고 알려진 성분을 보다 쉽게 확인할 수 있도록 만든 참고 도구입니다.
                </p>
                <p className="mt-3 text-[#54504a]">
                  분석 기준은 말라세지아가 이용할 수 있는 C11–C24 지방산, 지방산 에스터, 폴리소르베이트, 소르비탄 계열, 식물성 오일·버터, 일부 발효·효모 성분 등을 중심으로 구성했습니다. 여기에 해외 말라세지아 성분 체커와 관련 논문 자료를 함께 참고해, 성분별 주의도를 가능성 높음·중간·개인차(출처마다 평가가 갈림 · 패치테스트 권장) 단계로 나누어 분류했습니다.
                </p>
                <p className="mt-3 text-[#54504a]">
                  다만 성분 반응은 개인의 피부 상태, 성분의 농도, 제품의 제형, 함께 사용한 제품에 따라 달라질 수 있습니다. 따라서 본 결과는 의학적 진단이나 절대적인 안전 판정이 아니라, 제품을 고를 때 참고할 수 있는 성분 체크 기준으로 봐주세요.
                </p>
                <p className="mt-3 text-[#54504a]">
                  새로운 제품은 얼굴 전체에 사용하기 전 패치 테스트를 권장하며, 가려움·붉어짐·모낭염 등 증상이 지속되거나 악화될 경우에는 피부과 전문의와 상담해 주세요.
                </p>
              </div>
            </div>
            <div className="mt-7 text-center">
              <button onClick={() => setGuideOpen(false)} className="rounded bg-[#20201e] px-8 py-2.5 text-white hover:bg-[#a93b2a]">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Malassezia;
