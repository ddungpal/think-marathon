import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "생각 마라톤 - 당신의 고민을 깊게 생각하는 시간",
  description: "자신의 고민에 대해 깊게 생각하고 해결책을 가져갈 수 있는 생각하는 시간을 갖게 해드립니다.",
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

