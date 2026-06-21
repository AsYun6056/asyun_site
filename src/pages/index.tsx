// src/pages/index.tsx
import Header from "@/components/Header";
import Main from "@/sections/Main";
import About from "@/sections/About";
import Contact from "@/sections/Contact";
import Guide from "@/sections/Guide";
import Chat from "@/sections/Chat";
import Community from "@/sections/Community";
import Shop from "@/sections/Shop";
import Video from "@/sections/Video";
import Malassezia from "@/sections/Malassezia";
import { useRef } from "react";

export default function Home() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const malasseziaRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  return (
    <div className="m-auto">
      <Header
        aboutRef={aboutRef}
        videoRef={videoRef}
        shopRef={shopRef}
        guideRef={guideRef}
        malasseziaRef={malasseziaRef}
        chatRef={chatRef}
        communityRef={communityRef}
        contactRef={contactRef}
      />
      <main>
        <Main />
        <About refItem={aboutRef} />
        <Video refItem={videoRef} />
        <Shop refItem={shopRef} />
        <Guide refItem={guideRef} />
        <Malassezia refItem={malasseziaRef} />
        <Chat refItem={chatRef} />
        <Community refItem={communityRef} />
        <Contact refItem={contactRef} />
      </main>
    </div>
  );
}
