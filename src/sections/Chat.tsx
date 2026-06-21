const Chat = ({
  refItem,
}: {
  refItem: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <div
      className="w-full sm:h-[calc(100dvh-50px)] md:h-[calc(100dvh-60px)] bg-white"
      ref={refItem}
    >
      <section className="h-full">
        <div className="w-full h-full flex flex-col justify-center items-center py-10 sm:py-0">
          <div className="text-center text-4xl lg:text-5xl leading-none mb-5 font-bold">
            <span className="pr-3 sm:pr-5 hidden md:inline">[</span>
            <span className="pl-1 sm:pl-3 italic block sm:inline">
              Let's Chat
            </span>
            <span className="pl-1 sm:pl-3 italic block sm:inline">
              Together
            </span>
            <span className="pl-3 sm:pl-5 hidden md:inline">]</span>
          </div>
          <div className="text-center text-primary text-base sm:text-lg">
            민감피부, 이제 혼자 고민하지 마세요!
          </div>
          <div className="w-full flex md:flex-row flex-col items-center justify-center md:pt-10">
            <div className="flex flex-col items-center pt-7 md:pt-0 w-full">
              <img
                src="/img/chatImg.png"
                alt=""
                className="w-[300px] md:w-[340px] mb-7"
              />
              <button className="p-4 bg-red-100 text-primary w-[250px] sm:w-[280px] rounded-3xl font-bold">
                <a
                  href="https://cafe.naver.com/tomatoskinclub/3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  민감피부 채팅방 함께하기
                </a>
              </button>
            </div>
            <div className="w-full">
              <div className="h-full flex flex-col text-base sm:text-sm md:text-base leading-7 px-10 pt-5 md:p-0 break-keep">
                <span className="bg-red-100 w-72">
                  &nbsp;&nbsp;📍 "에즈윤 민감피부케어 카톡방"이란?
                </span>
                <p className="mt-3">
                  홍조, 여드름, 모낭염, 지루성피부염 등
                  <br />
                  민감한 피부 고민이 있는 우리들이 모여
                  <br />
                  서로의 경험과 정보를 나누는 따뜻한 소통 공간입니다.
                </p>
                <p className="mt-3">
                  피부에는 정답이 없지만,
                  <br />
                  함께라면 더 많은 가능성을 발견할 수 있어요!
                </p>
                <p className="mt-3">
                  혼자서는 막막했던 부분도 우리의 작은 경험이 모이면,
                  <br />더 많은 사람들이 피부 고민에서 자유로워질 수 있을 거라
                  믿어요 :)
                </p>
                <p className="mt-3">
                  함께 정보를 주고받으며, 서로에게 힘이 되는 선순환을 만들어
                  가요🌱
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Chat;
