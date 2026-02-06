import { SectionHeader } from "@/components/SectionHeader";
import { NewArrivalsSection } from "@/components/NewArrivalsSection";
import { HeroSection } from "@/components/HeroSection";
import { getDogRuns } from "@/data/dogRuns";
import { cafes } from "@/data/cafes";

export default async function Home() {
  // WordPress APIからドッグランデータを取得
  const dogRuns = await getDogRuns();
  
  // 新着3件を取得（現在は配列の最初の3件を新着として扱う）
  const newDogRuns = dogRuns.slice(0, 3).map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    image: item.image,
    badges: [
      { label: item.zone, tone: "primary" as const },
      { label: item.ground, tone: "warning" as const },
      ...(item.parking ? [{ label: "駐車場あり", tone: "success" as const }] : []),
    ],
    address: item.address,
  }));

  const newCafes = cafes.slice(0, 3).map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    image: item.image,
    badges: [
      { label: item.companionArea, tone: "primary" as const },
      { label: item.sizeLimit, tone: "warning" as const },
      ...(item.dogMenu === "有り" ? [{ label: "犬用メニュー", tone: "success" as const }] : []),
    ],
    address: item.address,
  }));

  return (
    <>
      <HeroSection />
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-16 px-4 py-12 sm:px-6">
        <section className="space-y-12">
          <SectionHeader
            title="新着情報"
            subtitle="最新のドッグラン、カフェ、宿泊施設をご紹介"
          />
          <div className="space-y-16">
            <NewArrivalsSection
              title="新着ドッグラン"
              href="/dog-runs"
              items={newDogRuns}
            />
            <NewArrivalsSection
              title="新着カフェ"
              href="/cafes"
              items={newCafes}
            />
          </div>
        </section>
      </main>
    </>
  );
}
