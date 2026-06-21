"use client";
import { useEffect, useState } from "react";
const Header = ({
  aboutRef,
  videoRef,
  shopRef,
  guideRef,
  malasseziaRef,
  chatRef,
  communityRef,
  contactRef,
}: {
  aboutRef: React.RefObject<HTMLDivElement | null>;
  videoRef: React.RefObject<HTMLDivElement | null>;
  shopRef: React.RefObject<HTMLDivElement | null>;
  guideRef: React.RefObject<HTMLDivElement | null>;
  malasseziaRef: React.RefObject<HTMLDivElement | null>;
  chatRef: React.RefObject<HTMLDivElement | null>;
  communityRef: React.RefObject<HTMLDivElement | null>;
  contactRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;

    const offset = window.innerWidth < 768 ? 50 : 60;
    const top =
      ref.current.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div
      className={`sticky top-0 w-full bg-white z-50 ${
        isScrolled ? "border-b border-gray-200 shadow-xm" : ""
      }`}
    >
      {/* 데스크탑 */}
      <section className="hidden md:flex items-center h-[60px] justify-between px-12">
        <h1 className="font-allura text-primary !text-xl">
          <a href="/">AsYun</a>
        </h1>
        <ul className="flex flex-row text-primary text-lg font-semibold">
          <li
            className="cursor-pointer"
            onClick={() => scrollToSection(aboutRef)}
          >
            About Me
          </li>
          <li
            className="cursor-pointer pl-7"
            onClick={() => scrollToSection(videoRef)}
          >
            Videos
          </li>
          <li
            className="cursor-pointer pl-7"
            onClick={() => scrollToSection(shopRef)}
          >
            Shop
          </li>
          <li
            className="cursor-pointer pl-7"
            onClick={() => scrollToSection(guideRef)}
          >
            Guide
          </li>
          <li
            className="cursor-pointer pl-7"
            onClick={() => scrollToSection(malasseziaRef)}
          >
            Malassezia
          </li>
          <li
            className="cursor-pointer pl-7"
            onClick={() => scrollToSection(chatRef)}
          >
            Chat
          </li>
          <li
            className="cursor-pointer pl-7"
            onClick={() => scrollToSection(communityRef)}
          >
            Community
          </li>
          <li
            className="cursor-pointer pl-7"
            onClick={() => scrollToSection(contactRef)}
          >
            Contact
          </li>
        </ul>
      </section>
      {/* 모바일 헤더 */}
      <section className="flex md:hidden items-center h-[50px] justify-between px-4 w-full">
        <h2 className="font-allura text-primary text-3xl">
          <a href="/">AsYun</a>
        </h2>
        <button onClick={toggleMenu}>
          {isOpen ? (
            <img
              src="/icons/x.svg"
              alt="YouTube"
              className="w-8 h-8 block object-contain"
            />
          ) : (
            <img
              src="/icons/hamburger.svg"
              alt="YouTube"
              className="w-8 h-8 block object-contain"
            />
          )}
        </button>
      </section>

      {/* 모바일 메뉴 */}
      <div
        className={`
          absolute top-[50px] left-0 w-full bg-white shadow-md
          px-6 py-4 text-primary text-lg font-semibold
          transform transition-all duration-200 ease-in-out
          ${
            isOpen
              ? "translate-y-0 opacity-100 max-h-96"
              : "-translate-y-full opacity-0 pointer-events-none max-h-0"
          }
        `}
      >
        <ul className="flex flex-col gap-4 text-primary text-lg font-semibold">
          <li
            className="cursor-pointer"
            onClick={() => { scrollToSection(aboutRef); setIsOpen(false); }}
          >
            About Me
          </li>
          <li
            className="cursor-pointer"
            onClick={() => { scrollToSection(videoRef); setIsOpen(false); }}
          >
            Videos
          </li>
          <li
            className="cursor-pointer"
            onClick={() => { scrollToSection(shopRef); setIsOpen(false); }}
          >
            Shop
          </li>
          <li
            className="cursor-pointer"
            onClick={() => { scrollToSection(guideRef); setIsOpen(false); }}
          >
            Guide
          </li>
          <li
            className="cursor-pointer"
            onClick={() => { scrollToSection(malasseziaRef); setIsOpen(false); }}
          >
            Malassezia
          </li>
          <li
            className="cursor-pointer"
            onClick={() => { scrollToSection(chatRef); setIsOpen(false); }}
          >
            Chat
          </li>
          <li
            className="cursor-pointer"
            onClick={() => { scrollToSection(communityRef); setIsOpen(false); }}
          >
            Community
          </li>
          <li
            className="cursor-pointer"
            onClick={() => { scrollToSection(contactRef); setIsOpen(false); }}
          >
            Contact
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
