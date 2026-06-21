"use client";

import { useState } from "react";
import Engine from "@/lib/malassezia_engine";
import type { AnalyzeResult, Tier } from "@/lib/malassezia_engine";

// 주의도 명칭 (낮음 → 개인차)
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
const softCat = (c: string) => c.replace(/낮음/g, "개인차");

const EXAMPLE =
  "정제수, 글리세린, 나이아신아마이드, 부틸렌글라이콜, 글리세릴스테아레이트, 폴리소르베이트60, 세틸팔미테이트, 올리브이매오일, 갈락토미세스발효여과물, 다이메티콘, 토코페롤, 스쿠알란, 스쿠알렌, 라우르산";

export default function MalasseziaPage() {
  const [input, setInput] = useState("");
  const [res, setRes] = useState<AnalyzeResult | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const run = (t: string) => setRes(t.trim() ? Engine.analyze(t) : null);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#e7e4df] text-[#20201e]">
      <div className="grid md:grid-cols-2">
        {/* 왼쪽: 텍스트 + 입력 */}
        <div className="flex flex-col justify-center px-6 py-12 md:px-12 md:py-16">
          <h1 className="text-3xl leading-snug font-semibold md:text-[2.6rem] md:leading-[1.25]">
            말라세지아 모낭염 유발성분,
            <br />
            <span className="text-[#a93b2a]">에즈윤과 함께 체크해요~</span>
          </h1>

          <p className="mt-6 text-[#4f4b45] md:text-lg">
            민감 피부일로, 성분 확인을 더 꼼꼼하게!
            <br />
            쉽고 빠르게 말라세지아 모낭염 유발 성분을 체크해 보세요~
          </p>

          <p className="mt-5 text-[#20201e]">
            ▼{" "}
            <button onClick={() => setGuideOpen(true)} className="underline text-[#a93b2a]">
              사용 가이드
            </button>
            를 참고해, 제품의 전 성분을 입력해 주세요.
          </p>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="예) 정제수, 글리세린, 글리세릴스테아레이트, 폴리소르베이트60, 올리브오일 ..."
            className="mt-3 min-h-[130px] w-full max-w-xl resize-y rounded border border-[#bdb7ac] bg-white/80 p-4 text-[16px] outline-none focus:border-[#a93b2a]"
          />
          <div className="mt-3 flex max-w-xl items-center gap-3">
            <button
              onClick={() => run(input)}
              className="rounded bg-[#20201e] px-7 py-3 tracking-widest text-white transition hover:bg-[#a93b2a]"
            >
              분석하기
            </button>
            <button onClick={() => { setInput(EXAMPLE); run(EXAMPLE); }} className="text-sm text-[#a93b2a] underline">
              예시 넣어보기
            </button>
          </div>

          {res && (
            <section className="mt-7 max-w-xl">
              <h2
                className="mb-2 text-xl font-semibold"
                style={{ color: res.flagged.length === 0 ? "#3f9b63" : res.counts.strong > 0 ? "#c0392b" : "#cf8a2e" }}
              >
                {res.flagged.length === 0
                  ? "✓ 안전 — 유발 성분 미검출"
                  : res.counts.strong > 0
                  ? `⚠️ 주의 — 유발 성분 ${res.flagged.length}개 감지`
                  : `🟡 참고 — 약한·개인차 성분 ${res.flagged.length}개`}
              </h2>
              <div className="mb-3 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-[#f6dcd8] px-3 py-1 text-[#c0392b]">높음 {res.counts.strong}</span>
                <span className="rounded-full bg-[#f6e6cf] px-3 py-1 text-[#9a6512]">중간 {res.counts.med}</span>
                <span className="rounded-full bg-[#f4eccb] px-3 py-1 text-[#8a7414]">개인차 {res.counts.disp}</span>
                <span className="rounded-full bg-[#dcefe2] px-3 py-1 text-[#3f9b63]">검사 {res.total}개</span>
              </div>
              {res.flagged.length > 0 && (
                <table className="w-full overflow-hidden rounded border border-[#cfc9bf] bg-white/80 text-left text-sm">
                  <thead>
                    <tr className="bg-[#ded8cf] text-[#6b675f]">
                      <th className="p-2.5 font-semibold">성분</th>
                      <th className="p-2.5 font-semibold">분류</th>
                      <th className="p-2.5 font-semibold">주의도</th>
                    </tr>
                  </thead>
                  <tbody>
                    {res.flagged.map((f, i) => (
                      <tr key={i} className="border-t border-[#cfc9bf]">
                        <td className="p-2.5">{f.name}</td>
                        <td className="p-2.5 text-[#6b675f]">{softCat(f.cat)}</td>
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

          {/* 분석창 바로 아래 안내문 */}
          <p className="mt-7 max-w-xl text-xs leading-relaxed text-[#6b675f]">
            본 분석은 말라세지아가 이용할 수 있다고 알려진 C11–C24 지방산, 지방산 에스터, 폴리소르베이트,
            식물성 오일·버터, 일부 발효·효모 성분 등을 기준으로 합니다. 해외 말라세지아 성분 체커와 관련 논문
            자료를 함께 참고해 성분별 주의도를 분류하였으며, 결과는 의학적 진단이 아닌 제품 선택의 참고용입니다.
            실제 반응은 개인차가 있을 수 있으므로 적절한 패치 테스트 후 사용해 주세요.
          </p>
        </div>

        {/* 오른쪽: 인물 사진 (public/malassezia-hero.png) */}
        <div className="relative min-h-[280px] md:min-h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/malassezia-hero.png" alt="AsYun 말라세지아 체커" className="absolute inset-0 h-full w-full object-cover object-top" />
        </div>
      </div>

      {/* 사용법(검색 가이드) 팝업 */}
      {guideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 p-4 py-10"
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
                <p className="text-[#54504a]">검색 버튼을 누르면 입력한 성분 중 말라세지아 모낭염의 주의가 필요하다고 알려진 성분을 찾아 보여줍니다.</p>
              </div>
              <div>
                <p className="font-bold"><span className="underline">Step 4</span>: 결과는 참고 기준으로 확인해 주세요.</p>
                <p className="text-[#54504a]">본 체커는 말라세지아 피부염에 주의가 필요하다고 알려진 성분을 보다 쉽게 확인할 수 있도록 만든 참고 도구입니다.</p>
                <p className="mt-3 text-[#54504a]">분석 기준은 말라세지아가 이용할 수 있는 C11–C24 지방산, 지방산 에스터, 폴리소르베이트, 소르비탄 계열, 식물성 오일·버터, 일부 발효·효모 성분 등을 중심으로 구성했습니다. 여기에 해외 말라세지아 성분 체커와 관련 논문 자료를 함께 참고해, 성분별 주의도를 가능성 높음·중간·개인차(출처마다 평가가 갈림 · 패치테스트 권장) 단계로 나누어 분류했습니다.</p>
                <p className="mt-3 text-[#54504a]">다만 성분 반응은 개인의 피부 상태, 성분의 농도, 제품의 유형, 함께 사용한 제품에 따라 달라질 수 있습니다. 따라서 본 결과는 의학적 진단이나 절대적인 안전 확인이 아니라, 제품 고를 때 더 참고할 수 있는 성분 체크 기준으로 봐주세요.</p>
                <p className="mt-3 text-[#54504a]">새로운 제품을 얼굴 전체에 사용하기 전 패치 테스트를 권장하며, 가려움·붉어짐·모낭 등 증상이 지속되거나 악화될 경우에는 피부과 전문의에 상담해 주세요.</p>
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
    </main>
  );
}
