const About = ({
  refItem,
}: {
  refItem: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <section
      className="w-full sm:h-[calc(100dvh-50px)] md:h-[calc(100dvh-60px)]"
      ref={refItem}
    >
      <div className="mx-auto w-full md:max-w-[calc(100dvw-250px)] px-4 py-12 sm:py-4 flex flex-col justify-center md:flex-row md:items-center h-full">
        <div className="order-1 w-full md:w-1/2 py-5 md:py-36">
          <div className="border-r-0 md:border-r-2 md:h-full w-full flex flex-col justify-center items-center">
            <div className="text-5xl md:text-7xl lg:text-8xl font-bold">
              About Me
            </div>
            <p className="font-bold text-primary text-center mt-5 sm:mt-10 md:mt-14 break-keep text-base sm:text-xl md:text-lg lg:text-xl">
              "타인의 시선보다, 내 피부의 소리에 귀 기울이는 시간"
              <br />
              에즈윤은 '나다운 아름다움'을 찾아가는 여정을 함께합니다.
            </p>
          </div>
        </div>

        <div className="order-2 w-full md:w-1/2 sm:px-7 md:py-36 md:px-0">
          <div className="h-full flex flex-col justify-center items-start text-base sm:text-sm md:text-base md:pl-20 leading-7 break-keep">
            <p>
              안녕하세요. 민감성 피부 여정을 함께하는 에즈윤입니다.
              <br />
              저는 오랜 시간 홍조, 모낭염, 주사피부염 등으로
              <br />
              매일의 피부 스트레스 속에서 살았습니다.
            </p>
            <p className="mt-3">
              화장으로 가리는 일상에 지쳐,
              <br />
              진짜 피부 개선을 선택한 순간, 이 채널이 시작되었습니다.
            </p>
            <p className="mt-3">
              내 피부가 원하는 것이 무엇인지 귀 기울이고,
              <br />
              진정으로 필요한 케어를 찾는 과정을 통해 조금씩 '진짜 나'를 만나고
              있어요.
            </p>
            <p className="mt-3">
              '신뢰할 수 있는 정보 + 솔직한 사용 경험'이라는 두 원칙을 지키며,
              <br />
              같은 고민을 가진 여러분과 진심 어린 소통을 나누고 있습니다.
              <br />
              에즈윤은 여러분의 피부 여정을 함께하는 친구 같은 채널이 되고자
              합니다.
            </p>
            <div className="bg-red-100 w-full md:w-2/3 p-5 rounded-xl mt-3">
              <span className="text-primary">
                이런 분들을 위해 만들었습니다
              </span>
              <ul className="whitespace-nowrap">
                <li>✔️ 화장을 안하면 외출이 불안한 분들</li>
                <li>✔️ 피부가 좋아지는 법을 제대로 알고 싶은 분들</li>
                <li>✔️ 수많은 정보 사이에서 방향을 잃은 분들</li>
              </ul>
            </div>
            <p className="mt-3">
              매일 조금씩, 나를 더 이해하고 내 피부와 가까워지는 시간.
              <br />그 여정을 에즈윤과 함께해요. ✨
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
