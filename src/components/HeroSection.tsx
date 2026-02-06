import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative w-full h-[500px] sm:h-[600px] overflow-hidden bg-[#F5F5F3]">
      <Image
        src="/hero-dogs.png"
        alt="様々な犬種のイラスト"
        fill
        className="object-contain object-bottom"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#F5F5F3] via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#2D2D2D] mb-4">
          愛犬との毎日に、プラスの喜びを。
        </h1>
        <p className="text-lg sm:text-xl text-[#2D2D2D]/90 mb-8 max-w-2xl">
          全国のドッグランや犬と行けるカフェ、宿情報をお届け。
        </p>
        <Link
          href="/dog-runs"
          className="inline-flex items-center justify-center rounded-full bg-[#B56952] px-8 py-3 text-lg font-semibold text-white transition hover:bg-[#9d5a45] shadow-lg"
        >
          ドッグランを探す
        </Link>
      </div>
    </section>
  );
}
