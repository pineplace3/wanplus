"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { href: "/", label: "ホーム" },
  { href: "/dog-runs", label: "ドッグラン" },
  { href: "/cafes", label: "犬と行けるカフェ" },
  { href: "/clinics", label: "動物病院" },
  { href: "/stays", label: "犬と泊まれる宿" },
];

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#4A5844] border-b border-[#4A5844]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="WanPlus"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>
        
        {/* デスクトップナビゲーション */}
        <nav className="hidden md:flex items-center gap-8 text-base font-medium text-white">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:opacity-70"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* モバイルメニューボタン */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 text-white"
          aria-label="メニュー"
        >
          <span
            className={`block h-0.5 w-6 bg-white transition-all ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* モバイルメニュー */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-white/20 bg-[#4A5844]">
          <div className="mx-auto max-w-7xl px-6 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-base font-medium text-white py-2 transition hover:opacity-70"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
