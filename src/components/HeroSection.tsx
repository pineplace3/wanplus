import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative w-full h-[500px] sm:h-[600px] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&fit=crop&w=1920&q=80"
        alt="元気な犬"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          愛犬との毎日に、プラスの喜びを。
        </h1>
        <p className="text-lg sm:text-xl text-white/95 mb-8 max-w-2xl drop-shadow-md">
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
