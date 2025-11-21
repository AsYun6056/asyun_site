"use client";
import { useEffect, useState } from "react";
import shopItemList from "dist/shopItems.json";

type Category = "크림" | "클렌저" | "선크림" | "전체";

function chunkArrayWithPadding<T>(arr: T[], size: number): (T | null)[][] {
  const result: (T | null)[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    const chunk: (T | null)[] = arr.slice(i, i + size);
    while (chunk.length < size) {
      chunk.push(null);
    }
    result.push(chunk);
  }
  return result;
}

const ShopList = ({ category }: { category: Category }) => {
  const [chunkSize, setChunkSize] = useState(5);
  const filteredShopItemList =
    category === "전체" ? shopItemList.list : shopItemList.byCategory[category];
  const slides = chunkArrayWithPadding(filteredShopItemList, chunkSize);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex === slides.length - 1;

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, slides.length - 1));
  };
  useEffect(() => {
    setCurrentIndex(0);
  }, [category]);

  useEffect(() => {
    const handleResize = () => {
      setChunkSize(window.innerWidth < 768 ? 1 : 5);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <div className="relative w-full overflow-hidden px-6">
      <button
        onClick={isPrevDisabled ? undefined : handlePrev}
        className={`
          absolute top-1/2 -translate-y-1/2 left-0 z-10 px-3 py-2 bg-gray-200 rounded-full shadow cursor-pointer
          transition-opacity duration-200
          ${
            isPrevDisabled
              ? "opacity-20 cursor-not-allowed"
              : "opacity-70 hover:opacity-100"
          }
        `}
      >
        ←
      </button>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / slides.length)}%)`,
            width: `${slides.length * 100}%`,
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-5 px-2 my-2"
              style={{ width: `${100 / slides.length}%` }}
            >
              {slide.map((item, idx) =>
                item ? (
                  <div
                    key={idx}
                    className="relative bg-white outline-2 outline-primary h-[400px] group hover:bg-primary pt-4 overflow-hidden"
                  >
                    <div
                      className="w-full h-[120px] md:h-[150px] bg-contain bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(/img/shop/${encodeURIComponent(
                          item.name
                        )}.png)`,
                      }}
                    >
                      <div className="text-sm sm:text-sm md:text-base lg:text-lg font-nanum mx-5 group-hover:text-white">
                        {`${i * chunkSize + idx + 1}`.padStart(2, "0")}
                      </div>
                    </div>

                    <div className="mx-4 py-5 text-center relative z-10 break-keep">
                      <span className="text-sm sm:text-sm md:text-base lg:text-base font-bold group-hover:text-white">
                        {item.name}
                      </span>
                      <p
                        className="mt-2 text-sm sm:text-sm md:text-base lg:text-base group-hover:text-white/60 relative z-10 h-full"
                        dangerouslySetInnerHTML={{ __html: item.desc }}
                      ></p>

                      <div
                        className={`
                          mt-4 
                          flex justify-center
                          md:absolute md:inset-0 md:items-center md:justify-center md:z-20 
                          md:opacity-0 md:translate-y-2 
                          md:group-hover:opacity-100 md:group-hover:translate-y-0 
                          transition-all duration-300 ease-out
                        `}
                      >
                        <button className="px-5 py-2 text-base font-nanum rounded-xl bg-primary text-white border border-white cursor-pointer">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            SHOP NOW
                          </a>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-2" key={idx}></div>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={isNextDisabled ? undefined : handleNext}
        className={`
          absolute top-1/2 -translate-y-1/2 right-0 z-10 px-3 py-2 bg-gray-200 rounded-full shadow cursor-pointer
          transition-opacity duration-200
          ${
            isNextDisabled
              ? "opacity-20 cursor-not-allowed"
              : "opacity-70 hover:opacity-100"
          }
        `}
      >
        →
      </button>
    </div>
  );
};

export default ShopList;
