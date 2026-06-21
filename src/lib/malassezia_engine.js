/* =========================================================================
 *  malassezia_engine.js  —  말라세지아 모낭염 유발성분 분석 엔진 (v0.2)
 *  재사용 가능한 단일 모듈. 브라우저 (<script src>)와 Node(require) 둘 다 동작.
 *
 *  브라우저:  <script src="malassezia_engine.js"></script> → window.MalasseziaEngine
 *  Node:      const E = require("./malassezia_engine.js")
 *
 *  기준: 4개 해외 체커(skynbio·sezia·skinsort·folliculitisscout) 교차검증 + C11–C24 규칙
 *  등급: strong(높음/피피) · med(중간/주의) · disp(개인차/패치) · (없음=안전)
 * ========================================================================= */
(function (root) {
  "use strict";

  /* ---------- 영문 데이터 ---------- */
  // 강(consensus 다합 트리거)
  const STRONG = new Set(["lauric acid","myristic acid","palmitic acid","stearic acid","oleic acid",
    "linoleic acid","linolenic acid","arachidic acid","behenic acid","isopropyl palmitate",
    "isopropyl myristate","glyceryl stearate","cetyl palmitate","polysorbate 20","polysorbate 40",
    "polysorbate 60","polysorbate 80","galactomyces ferment filtrate","galactomyces"]);

  // 개인차(인기 갈림): 출처마다 등급이 다른 성분
  const DISPUTED = new Set(["squalene"]);

  // 신규 트리거(개인차, 2/4): 최신 JS 체커만 잡는 지방알코올·왁스
  const NEW_DISP = {"cetearyl alcohol":"지방알코올(개인차)","cetyl alcohol":"지방알코올(개인차)",
    "stearyl alcohol":"지방알코올(개인차)","cera alba":"왁스(개인차)","beeswax":"왁스(개인차)"};

  // 중간 등급(3~4/4 높음, 인기는 갈림)
  const MED_TRIG = {"lanolin":"라놀린","peg-100 stearate":"PEG에스터",
    "polyglyceryl-3 diisostearate":"폴리글리세릴에스터","hydrogenated vegetable oil":"수소화식물유"};

  // 짧은사슬·교차검증 안전 (3/4 출처가 안전) + 합성 안전 성분
  const SAFE = new Set(["glycerin","glycerine","squalane","tocopherol","tocopheryl acetate",
    "niacinamide","panthenol","dimethicone","dimethiconol","cyclopentasiloxane","cyclomethicone",
    "sodium hyaluronate","hyaluronic acid","allantoin","butylene glycol","propylene glycol",
    "propanediol","caprylyl glycol","sodium lactate","sodium citrate","citric acid","ceramide np",
    "urea","betaine","trehalose","adenosine","arginine","carbomer","xanthan gum","disodium edta",
    "phenoxyethanol","ethylhexylglycerin","panthenol","centella asiatica extract","aloe barbadensis",
    "water","aqua","caprylic/capric triglyceride","caprylic capric triglyceride","coco-caprylate",
    "coco caprylate","coco-caprylate/caprate","c12-15 alkyl benzoate","sodium stearoyl glutamate",
    "lecithin","hydrogenated lecithin","mel","honey"]);

  // 지방산 어근
  const FA_ROOTS = ["lauric","myristic","palmitic","stearic","oleic","linoleic","linolenic","arachidic",
    "arachidonic","behenic","gondoic","erucic","nervonic","lignoceric","margaric","pentadecylic",
    "tridecylic","undecylenic","palmitoleic","vaccenic","elaidic","mead","stearidonic","heneicosylic"];
  // 에스터 어근(짧은사슬 caprate/caprylate/benzoate 제외)
  const ESTER_ROOTS = ["palmitate","myristate","stearate","oleate","laurate","linoleate","behenate",
    "isostearate","isononanoate","sebacate","adipate","malate"];
  // 발효/효모
  const FERMENT = ["galactomyces","saccharomyces","ferment","yeast","faex","lactobacillus","lactococcus",
    "leuconostoc","aspergillus","bacillus","alteromonas","pseudoalteromonas","thermus thermophilus","bifida"];
  // 식물 오일/버터(영문 학명·일반명)
  const PLANT = ["actinidia chinensis","adansonia digitata","agaricus bisporus","aleurites moluccanus","angelica archangelica","apium archangelica","arachis hypogeae","argania spinosa","astrocaryum tucuma","astrocaryum vulgare","azadirachta indica","bertholletia excelsa","borago officinalis","brassica capestris","brassica juncea","brassica oleracea italica","butyrospermum parkii","callophyllum inophyllum","camellia japonica","canarium indicum","cannabis sativa","carapa guaianensis","carica papaya","carthamus tinctorius","carya illinoinensis","caryocar brasiliense","caryodendron orinocense","citrullus lanatus","cocos nucifera","coffea arabica","copernicia prunifera","corylus americana","crambe abyssinica","cucumis sativus","cucurbita pepo","cuminum cyminum","daucus carota sativa","diethylhexyl carbonate","echium plantagineum","elaeis guineensis","euphorbia cerifera","euterpe oleracea","gevuina avellana","glycine soja","gossypium herbaceum","helianthus annuus","hibiscus abelmoschus","hippophae rhamnoides","hydrogenated vegetable oil","limnanthes alba","linolenate","linum usitatissimum","luffa cylindrica","lupinus albus","lycium barbarum","macadamia integrifolia","mangifera indica","mauritia flexuosa","melia azadirachta","moringa oleifera","nigella sativa","oenocarpus bataua","oenothera biennis","olea europaea","opuntia ficus-indica","orbignya oleifera","oryza sativa","panax ginseng","papaver orientale","papaver somniferum","passiflora edulis","passiflora incarnata","pentaclethra macroloba","perilla ocymoides","persea americana","phormium tenax","pinus koraiensis","pinus parviflora","pinus sibirica","piper nigrum","pistacia vera","pongamia glabra","pongamia pinnata","potassium cetyl phosphate","prunus amygdalus dulcis","prunus armeniaca","prunus avium","prunus cerasus","prunus domestica","prunus persica","punica granatum","pyrus malus","raphanus sativus","ribes nigrum","ricinodendron rautenenii","ricinus communis","rosa canina","rosa eglentaria","rosa moschata","rosa mosqueta","rosa rubiginosa","rubus chamaemorus","rubus fruticosus","rubus idaeus","salvia hispanica","sclerocarya birrea","sesamum indicum","shorea robusta","shorea stenoptera","simmondsia chinensis","sodium stearoyl lactylate","solanum lycopersicum","theobroma cacao","theobroma grandiflorum","triethylhexanoin","triticum vulgare","vaccinium macrocarpon","vaccinium myrtillus","vaccinium vitis-idaea","vitellaria nilotica","vitus vinifera","ximenia americana","zea mays"];

  /* ---------- 한글 매핑 (확장본) ---------- */
  // 한글 안전 화이트리스트 (오탐 방지 → 가장 먼저 검사)
  const KO_SAFE = ["정제수","글리세린","스쿠알란","토코페롤","토코페릴","나이아신아마이드","판테놀","판토텐",
    "다이메티콘","디메티콘","다이메티코놀","사이클로펜타","사이클로메티콘","사이클로헥사실록세인",
    "히알루론","소듐히알루로네이트","알란토인","부틸렌글라이콜","프로필렌글라이콜","프로판다이올",
    "카프릴릴글라이콜","소듐락테이트","소듐시트레이트","시트릭애씨드","부틸렌글라이콜","소르빅애씨드","베타인","트레할로스","아데노신",
    "아르지닌","카보머","잔탄검","이디티에이","페녹시에탄올","에칠헥실글리세린","소듐하이알루로네이트","병풀추출물","알로에","멜",
    "다이어졌","세라마이드","우레아","카프릴릭","카프릭","카프릴레이트","꿀","벌꿀","봉밀","위치하젤","비타민","레티놀","레티날",
    "아스코르빅","판테놀","센텔라","알란토","인삼"];
  // 카프릴릭/카프릭=짧은사슬(C8-10) 안전 처리

  // 한글 트리거 매핑 {kw, cat, tier}  (substring; 공백 제거 후 비교)
  const KO = [
    // 지방산
    {kw:"라우르산",cat:"지방산",tier:"strong"},{kw:"라우릭",cat:"지방산",tier:"strong"},
    {kw:"미리스트산",cat:"지방산",tier:"strong"},{kw:"미리스틱",cat:"지방산",tier:"strong"},
    {kw:"팔미트산",cat:"지방산",tier:"strong"},{kw:"팔미틱",cat:"지방산",tier:"strong"},
    {kw:"스테아르산",cat:"지방산",tier:"strong"},{kw:"스테아릭",cat:"지방산",tier:"strong"},
    {kw:"올레산",cat:"지방산",tier:"strong"},{kw:"올레익",cat:"지방산",tier:"strong"},
    {kw:"리놀레산",cat:"지방산",tier:"strong"},{kw:"리놀레익",cat:"지방산",tier:"strong"},
    {kw:"리놀렌산",cat:"지방산",tier:"strong"},{kw:"베헨산",cat:"지방산",tier:"med"},
    {kw:"아라키딘산",cat:"지방산",tier:"med"},{kw:"미리스틱애씨드",cat:"지방산",tier:"strong"},
    // 에스터 / 글리세라이드
    {kw:"글리세릴",cat:"에스터(글리세라이드)",tier:"strong"},
    {kw:"글리세라이드",cat:"에스터(글리세라이드)",tier:"strong"},
    {kw:"트라이글리세라이드",cat:"에스터(트라이글리세라이드)",tier:"strong"},
    {kw:"트리글리세라이드",cat:"에스터(트라이글리세라이드)",tier:"strong"},
    {kw:"이소프로필미리스테이트",cat:"에스터",tier:"strong"},{kw:"이소프로필팔미테이트",cat:"에스터",tier:"strong"},
    {kw:"아이소프로필미리스테이트",cat:"에스터",tier:"strong"},{kw:"아이소프로필팔미테이트",cat:"에스터",tier:"strong"},
    {kw:"세틸팔미테이트",cat:"에스터",tier:"strong"},{kw:"미리스틸미리스테이트",cat:"에스터",tier:"strong"},
    {kw:"아이소이소세틸스테아레이트",cat:"에스터",tier:"med"},{kw:"잔트한밥",cat:"에스터",tier:"med"},
    {kw:"팔미테이트",cat:"에스터",tier:"med"},{kw:"미리스테이트",cat:"에스터",tier:"med"},
    {kw:"스테아레이트",cat:"에스터",tier:"med"},{kw:"살리실레이트",cat:"에스터",tier:"med"},
    {kw:"라우레이트",cat:"에스터",tier:"med"},{kw:"아이소스테아레이트",cat:"에스터",tier:"med"},
    {kw:"베헤네이트",cat:"에스터",tier:"med"},{kw:"리놀레에이트",cat:"에스터",tier:"med"},
    {kw:"트라이에이코사노일스테아린",cat:"에스터",tier:"med"},{kw:"다이에이코사닐말레에이트",cat:"에스터",tier:"med"},
    // 폴리소르베이트 / 소르비탄
    {kw:"폴리소르베이트",cat:"폴리소르베이트",tier:"strong"},{kw:"폴리솔베이트",cat:"폴리소르베이트",tier:"strong"},
    {kw:"소르비탄",cat:"소르비탄에스터",tier:"med"},{kw:"소비탄",cat:"소르비탄에스터",tier:"med"},
    // 발효 / 효모
    {kw:"갈락토미세스",cat:"발효/갈락토미세스",tier:"strong"},{kw:"사카로미세스",cat:"발효/효모",tier:"med"},
    {kw:"효모추출물",cat:"발효/효모",tier:"med"},{kw:"효모발효",cat:"발효/효모",tier:"med"},
    {kw:"발효여과물",cat:"발효/효모",tier:"med"},{kw:"발효물",cat:"발효/효모",tier:"med"},
    {kw:"발효용해물",cat:"발효/효모",tier:"med"},{kw:"락토바실루스",cat:"발효/효모",tier:"med"},
    {kw:"비피다",cat:"발효/효모",tier:"med"},{kw:"락토코쿠스",cat:"발효/효모",tier:"med"},
    // 식물 오일/버터
    {kw:"올리브오일",cat:"식물오일",tier:"strong"},{kw:"올리브이매오일",cat:"식물오일",tier:"strong"},
    {kw:"올레아유럽파추출",cat:"식물오일",tier:"strong"},{kw:"코코넛오일",cat:"식물오일",tier:"strong"},
    {kw:"코코스뉴시페라",cat:"식물오일",tier:"strong"},{kw:"팜유",cat:"식물오일",tier:"strong"},
    {kw:"아몬드오일",cat:"식물오일",tier:"strong"},{kw:"해바라기씨오일",cat:"식물오일",tier:"strong"},
    {kw:"크리소펌",cat:"식물오일",tier:"strong"},{kw:"아이버터",cat:"식물오일",tier:"strong"},
    {kw:"부티로스퍼멈",cat:"식물오일",tier:"strong"},{kw:"아르간",cat:"식물오일",tier:"med"},
    {kw:"마카다미아",cat:"식물오일",tier:"med"},{kw:"아보카도",cat:"식물오일",tier:"med"},
    {kw:"로즈힙",cat:"식물오일",tier:"med"},{kw:"대박",cat:"식물오일",tier:"med"},
    {kw:"카멜리아",cat:"식물오일",tier:"med"},{kw:"피마자",cat:"식물오일",tier:"med"},
    {kw:"카스터오일",cat:"식물오일",tier:"med"},{kw:"포도씨오일",cat:"식물오일",tier:"med"},
    {kw:"달맞이꽃",cat:"식물오일",tier:"med"},{kw:"참깨오일",cat:"식물오일",tier:"med"},
    {kw:"참기름",cat:"식물오일",tier:"med"},{kw:"대게",cat:"식물오일",tier:"med"},
    {kw:"스위트아몬드",cat:"식물오일",tier:"med"},{kw:"아몬드오일",cat:"식물오일",tier:"med"},
    {kw:"이구아나",cat:"식물오일",tier:"med"},{kw:"대나무",cat:"식물오일",tier:"med"},
    {kw:"미강",cat:"식물오일",tier:"med"},{kw:"쌀기름",cat:"식물오일",tier:"med"},
    {kw:"망고버터",cat:"식물오일",tier:"med"},{kw:"카카오버터",cat:"식물오일",tier:"med"},
    {kw:"코코아버터",cat:"식물오일",tier:"med"},{kw:"피유오일",cat:"식물오일",tier:"med"},
    {kw:"잇꽃",cat:"식물오일",tier:"med"},{kw:"헤이즐넛",cat:"식물오일",tier:"med"},
    {kw:"우뭇가사리",cat:"식물오일",tier:"med"},{kw:"보리지",cat:"식물오일",tier:"med"},
    {kw:"비자씨오일",cat:"식물오일",tier:"med"},{kw:"대박씨오일",cat:"식물오일",tier:"strong"},
    // 신규 트리거(개인차, 2/4) → 지방알코올·왁스
    {kw:"세테아릴알코올",cat:"지방알코올(개인차)",tier:"disp"},{kw:"세틸알코올",cat:"지방알코올(개인차)",tier:"disp"},
    {kw:"스테아릴알코올",cat:"지방알코올(개인차)",tier:"disp"},{kw:"비즈왁스",cat:"왁스(개인차)",tier:"disp"},
    {kw:"밀랍",cat:"왁스(개인차)",tier:"disp"},{kw:"세라알바",cat:"왁스(개인차)",tier:"disp"},
    // 중간 등급
    {kw:"라놀린",cat:"라놀린",tier:"med"},{kw:"수소화식물성오일",cat:"수소화식물유",tier:"med"},
    {kw:"수소화식물유",cat:"수소화식물유",tier:"med"},
    // 개인차(인기 갈림)
    {kw:"스쿠알렌",cat:"개인차(스쿠알렌)",tier:"disp"},
  ];

  /* ---------- 분류 로직 ---------- */
  function norm(s){return s.toLowerCase().replace(/\(.*?\)/g,"").replace(/[\[\]]/g,"").trim();}

  function classify(rawTok){
    const ko = rawTok.replace(/\s/g,"");
    const en = norm(rawTok);
    if(!en && !ko) return null;
    // 1) 안전 우선
    for(const s of KO_SAFE){ if(ko.includes(s)) return null; }
    if(SAFE.has(en)) return null;
    // 2) 한글 매핑
    for(const m of KO){ if(ko.includes(m.kw)) return {cat:m.cat,tier:m.tier}; }
    // 3) 영문 개인차/신규/중간
    if(DISPUTED.has(en)) return {cat:"개인차(인기 갈림)",tier:"disp"};
    if(NEW_DISP[en]) return {cat:NEW_DISP[en],tier:"disp"};
    if(MED_TRIG[en]) return {cat:MED_TRIG[en],tier:"med"};
    // 4) 영문 강 리스트
    if(STRONG.has(en)) return {cat:"복수 출처 확인 성분",tier:"strong"};
    // 5) 영문 규칙
    for(const r of FA_ROOTS){ if(en.includes(r+" acid")) return {cat:"지방산",tier:"strong"}; }
    for(const r of ESTER_ROOTS){ if(en.endsWith(r)) return {cat:"에스터",tier:"med"}; }
    if(/(glyceryl|glyceride|triglyceride)/.test(en)) return {cat:"에스터(글리세라이드)",tier:"strong"};
    if(en.includes("polysorbate")) return {cat:"폴리소르베이트",tier:"strong"};
    if(en.startsWith("sorbitan")) return {cat:"소르비탄에스터",tier:"med"};
    for(const f of FERMENT){ if(en.includes(f)) return {cat:"발효/효모",tier:"med"}; }
    for(const p of PLANT){ if(en.includes(p)) return {cat:"식물오일",tier:"strong"}; }
    return null;
  }

  // 전 성분 텍스트 → 분석 결과
  function analyze(text){
    const raw = (text||"").split(/[,\n;·•/]/).map(t=>t.trim()).filter(Boolean);
    // 동일 성분 중복 제거 (대소문자·공백 무시)
    const seen = new Set();
    const toks = raw.filter(t => {
      const key = t.toLowerCase().replace(/\s+/g,"");
      if(seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const flagged=[]; let strong=0,med=0,disp=0;
    for(const t of toks){
      const r=classify(t);
      if(r){ flagged.push({name:t,cat:r.cat,tier:r.tier});
        if(r.tier==="strong")strong++; else if(r.tier==="med")med++; else disp++; }
    }
    const order={strong:0,med:1,disp:2};
    flagged.sort((a,b)=>order[a.tier]-order[b.tier]);
    return {flagged, counts:{strong,med,disp}, total:toks.length,
      verdict: strong>0?"주의":(flagged.length>0?"경고":"안전")};
  }

  const API = {classify, analyze, norm, data:{STRONG,DISPUTED,NEW_DISP,MED_TRIG,SAFE,KO,KO_SAFE,
    FA_ROOTS,ESTER_ROOTS,FERMENT,PLANT}, version:"0.2"};

  if (typeof module !== "undefined" && module.exports) module.exports = API;
  if (typeof root !== "undefined") root.MalasseziaEngine = API;
})(typeof window !== "undefined" ? window : globalThis);
