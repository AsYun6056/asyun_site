import SlideLine from "@/components/SlideLine";

const Main = () => {
  return (
    <section className="w-full h-[calc(100dvh-50px)] md:h-[calc(100dvh-60px)] bg-white">
      <div className="w-full h-full">
        <div
          className="
        flex flex-col justify-between
        bg-[url('/img/mainImg.png')] bg-cover bg-no-repeat md:bg-center bg-[position:40%_center]
        px-4 sm:px-6 md:px-12 py-6 md:py-8 lg:py-12
        text-right h-full
      "
        >
          <div>
            <SlideLine
              text="The Journey To"
              from="right"
              delay={100}
              isHighlight={false}
            />
            <SlideLine
              text="My True Skin"
              from="right"
              delay={100}
              isHighlight={false}
            />
            <SlideLine
              text="─ with AsYun"
              from="left"
              delay={600}
              isHighlight={true}
            />
          </div>
          <div>
            <button className="group relative inline-block text-secondary text-2xl lg:text-3xl">
              <span className="relative z-10">
                <a
                  href="https://www.youtube.com/@%EC%97%90%EC%A6%88%EC%9C%A4Asyun-w7d"
                  className="inline-block group align-middle"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Started
                  <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </span>
              <span className="absolute bottom-0 left-1/2 h-[2px] w-0 bg-secondary transition-all duration-300 group-hover:left-0 group-hover:w-full" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Main;
