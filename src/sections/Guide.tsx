const Guide = ({
  refItem,
}: {
  refItem: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <div
      className="w-full sm:h-[calc(100dvh-50px)] md:h-[calc(100dvh-60px)] bg-primary"
      ref={refItem}
    >
      <section className="h-full">
        <div className="w-full h-full flex flex-col justify-center items-center py-10 sm:py-0">
          <div className="flex justify-center items-center text-white text-4xl lg:text-5xl leading-none mb-5 font-bold">
            <span className="pr-3 sm:pr-5 hidden sm:inline">[</span>Free
            <span className="pl-1 sm:pl-3 italic"> Guides </span>
            <span className="pl-3 sm:pl-5 hidden sm:inline">]</span>
          </div>
          <div className="text-center text-white text-base sm:text-lg">
            민감성 피부를 위한 무료 자료집
          </div>
          <div className="w-full flex md:flex-row flex-col items-center justify-evenly md:pt-10">
            <div className="w-full md:w-[45%] hidden md:block md:pl-10">
              <div className="w-full">
                <iframe
                  src="https://www.youtube.com/embed/biRAo_91AMo"
                  className="w-full"
                  style={{
                    aspectRatio: "auto",
                    height: "auto",
                    minHeight: "250px",
                  }}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube video player"
                ></iframe>
              </div>
            </div>
            <div className="flex flex-col items-center md:mx-20 pt-7 md:pt-0 md:w-[15%]">
              <img
                src="/img/bookCover.png"
                alt=""
                className="w-[100px] md:w-[140px] mb-7"
              />
              <button className="p-4 bg-red-100 text-primary w-[250px] sm:w-[280px] rounded-3xl font-bold">
                <a
                  href="https://bit.ly/43Id0lh"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  자료집 무료 신청하기
                </a>
              </button>
            </div>
            <div className="w-full md:w-[40%]">
              <div className="h-full flex flex-col text-base sm:text-sm md:text-base leading-7 text-white px-10 pt-5 md:p-0 break-keep">
                <p>
                  민감성 피부로 힘든 시간을 보낼 때,
                  <br />
                  '어디서부터 케어를 시작해야 할지' 막막한 순간이 많죠.
                </p>
                <p className="mt-3">
                  같은 고민을 하고 계신 분들이
                  <br />
                  조금이라도 덜 헤매셨으면 하는 마음으로,
                  <br />
                  에즈윤 채널에서 다뤄온 핵심 내용을 보기 쉽게
                  <br />
                  정리한 작은 안내서를 만들었습니다.
                </p>
                <div className="p-7 mt-3">
                  <ul>
                    <li className="list-disc">
                      말라세지아 모낭염 유발 성분 피하는 법
                    </li>
                    <li className="list-disc">저자극 클렌징 방법</li>
                    <li className="list-disc">
                      클렌저 타입별 말라세지아 유발 성분 체크 리스트
                    </li>
                    <li className="list-disc">알레르기 유발 착향제 25가지</li>
                  </ul>
                </div>
                <p className="mt-3">
                  이 자료집에서는 민감성 피부의 관리 방법,
                  <br />
                  추천 제품까지 알차게 담았습니다.
                </p>
                <p className="mt-3">
                  피부와 나를 위한 첫걸음,
                  <br />
                  지금 바로 무료로 받아보세요 :)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Guide;
