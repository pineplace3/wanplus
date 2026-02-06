import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative w-full h-[500px] sm:h-[600px] overflow-hidden bg-[#F5F5F3]">
      <div className="relative w-full h-full">
        <Image
          src="/hero-dogs.png"
          alt="様々な犬種のイラスト"
          fill
          className="object-contain object-bottom"
          priority
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#2D2D2D] mb-4">
          愛犬との毎日に、プラスの喜びを。
        </h1>
        <p className="text-lg sm:text-xl text-[#2D2D2D]/90 max-w-2xl">
          全国のドッグランや犬と行けるカフェ、宿情報をお届け。
        </p>
      </div>
    </section>
  );
}
