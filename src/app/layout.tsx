import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "민감피부와 함께, AsYun",
  description: "솔직한 피부 이야기와 믿음직한 정보로, 민감피부와 함께합니다 :)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
