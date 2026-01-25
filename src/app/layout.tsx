import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ワンプラス | WanPlus",
  description:
    "犬と暮らす人のための情報ポータル。ドッグラン、犬と行けるカフェ、動物病院、犬と泊まれる宿の情報をまとめて探せるサイト。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} antialiased bg-[#F5F5F3] text-[#2D2D2D]`}
      >
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
