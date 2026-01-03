import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "생각 마라톤 - 사전 질문 기반 진단 시스템",
  description: "당신의 직업, 커리어, 소득, 자산을 기반으로 사고 패턴 중심의 구조화된 진단 결과를 제공합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

