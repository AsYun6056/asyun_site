"use client";

import { useState } from "react";
import Engine from "@/lib/malassezia_engine";
import type { AnalyzeResult, Tier } from "@/lib/malassezia_engine";

const TIER_LABEL: Record<Tier, string> = {
  strong: "높음 · 피피 권장",
  med: "중간 · 주의",
  disp: "개인차 · 패치테스트",
};
const TIER_DOT: Record<Tier, string> = {
  strong: "bg-[#c0392b]",
  med: "bg-[#cf8a2e]",
  disp: "bg-[#c9a227]",
};

const Malassezia = ({
  refItem,
}: {
  refItem: React.RefObject<HTMLDivElement | null>;
}) => {
  const [input, setInput] = useState("");
  const [res, setRes] = useState<AnalyzeResult | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const run = (t: string) => setRes(t.trim() ? Engine.analyze(t) : null);

  return (
    <div
      ref={refItem}
      className="relative w-full min-h-[calc(100dvh-50px)] md:min-h-[calc(100dvh-60px)] bg-cover bg-center"
      style={{ backgroundImage: "url('/drive-images/말라세지아 사진 크기 2500.png')" }}
    >
      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black/50" />

      {/* 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-start justify-center min-h-[calc(100dvh-50px)] md:min-h-[calc(100dvh-60px)] px-6 py-14 md:px-16 md:py-20 max-w-2xl">
        <h1 className="text-3xl leading-snug font-semibold text-white md:text-[2.6rem] md:leading-[1.25]">
          말라세지아 모낭염 유발성분,
          <br />
          <span className="text-[#e8836e]">에즈윤과 함께 체크해요~</span>
        </h1>

        <p className="mt-5 text-white/80 md:text-lg">
          민감 피부일로, 성분 확인을 더 꼼꼼하게!
          <br />
          쉽고 빠르게 말라세지아 모낭염 유발 성분을 체크해 보세요~
        </p>

        <p className="mt-4 text-white/90">
          ▼{" "}
          <button
            onClick={() => setGuideOpen(true)}
            className="underline text-white/90"
          >
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
          onClick={() => run(input)}
          className="mt-3 rounded bg-white px-7 py-3 tracking-widest text-[#20201e] font-semibold transition hover:bg-[#e8836e] hover:text-white"
        >
          분석하기
        </button>

        {res && (
          <section className="mt-7 w-full">
            <h2
              className="mb-2 text-xl font-semibold"
              style={{
                color:
                  res.flagged.length === 0
                    ? "#6ee89a"
                    : res.counts.strong > 0
                    ? "#f08080"
                    : "#f0c060",
              }}
            >
              {res.flagged.length === 0
                ? "✓ 안전 — 유발 성분 미검출"
                : res.counts.strong > 0
                ? `⚠️ 주의 — 유발 성분 ${res.flagged.length}개 감지`
                : `🟡 참고 — 약한·개인차 성분 ${res.flagged.length}개`}
            </h2>
            <div className="mb-3 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-[#f6dcd8]/80 px-3 py-1 text-[#c0392b]">높음 {res.counts.strong}</span>
              <span className="rounded-full bg-[#f6e6cf]/80 px-3 py-1 text-[#9a6512]">중간 {res.counts.med}</span>
              <span className="rounded-full bg-[#f4eccb]/80 px-3 py-1 text-[#8a7414]">개인차 {res.counts.disp}</span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-white">검사 {res.total}개</span>
            </div>
            {res.flagged.length > 0 && (
              <table className="w-full overflow-hidden rounded border border-white/30 bg-black/40 text-left text-sm text-white backdrop-blur-sm">
                <thead>
                  <tr className="bg-white/10 text-white/70">
                    <th className="p-2.5 font-semibold">성분</th>
                    <th className="p-2.5 font-semibold">분류</th>
                    <th className="p-2.5 font-semibold">주의도</th>
                  </tr>
                </thead>
                <tbody>
                  {res.flagged.map((f, i) => (
                    <tr key={i} className="border-t border-white/20">
                      <td className="p-2.5">{f.name}</td>
                      <td className="p-2.5 text-white/70">{f.cat}</td>
                      <td className="p-2.5">
                        <span className={`mr-2 inline-block h-2 w-2 rounded-full align-middle ${TIER_DOT[f.tier]}`} />
                        {TIER_LABEL[f.tier]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        <p className="mt-7 text-xs leading-relaxed text-white/50">
          본 분석은 말라세지아가 이용할 수 있다고 알려진 C11–C24 지방산, 지방산 에스터, 폴리소르베이트,
          식물성 오일·버터, 일부 발효·효모 성분 등을 기준으로 합니다. 결과는 의학적 진단이 아닌 제품 선택의 참고용입니다.
        </p>
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
                <p className="text-[#54504a]">확인하고 싶은 제품의 전 성분을 입력해 주세요.<br />단일 성분만 입력해도 되고, 제품 전 성분 전체를 복사해 붙여넣으셔도 됩니다.</p>
              </div>
              <div>
                <p className="font-bold"><span className="underline">Step 2</span>: 구분자 표기를 확인해 주세요.</p>
                <p className="text-[#54504a]">성분이 쉼표(,)로 구분되면 가장 정확합니다.<br />한글·영문 모두 인식하지만, 구분자가 없으면 인식이 어려울 수 있어요.</p>
              </div>
              <div>
                <p className="font-bold"><span className="underline">Step 3</span>: 검색 버튼을 눌러 주세요.</p>
                <p className="text-[#54504a]">분석하기 버튼을 누르면 입력한 성분 중 말라세지아 모낭염의 주의가 필요하다고 알려진 성분을 찾아 보여줍니다.</p>
              </div>
              <div>
                <p className="font-bold"><span className="underline">Step 4</span>: 결과는 참고 기준으로 확인해 주세요.</p>
                <p className="text-[#54504a]">성분 반응은 개인의 피부 상태, 성분의 농도, 제품의 유형에 따라 달라질 수 있습니다. 결과는 의학적 진단이 아닌 참고용이며, 새로운 제품 사용 전 패치 테스트를 권장합니다.</p>
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
