import Link from "next/link";
import { InfoCard } from "@/components/InfoCard";
import { SectionHeader } from "@/components/SectionHeader";
import { NewArrivalsSection } from "@/components/NewArrivalsSection";
import { HeroSection } from "@/components/HeroSection";
import { CategoryNav } from "@/components/CategoryNav";
import { getDogRuns } from "@/data/dogRuns";
import { cafes } from "@/data/cafes";
import { stays } from "@/data/stays";

const sections = [
  {
    title: "ドッグランを探す",
    href: "/dog-runs",
    description: "地面の素材やエリア分け情報で絞り込み。駐車場有無もチェック。",
    image:
      "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1200&q=80",
    meta: "芝 / 砂 / 土・小型専用あり",
  },
  {
    title: "犬と行けるカフェ",
    href: "/cafes",
    description: "店内OKかテラスのみか、犬用メニューの有無で探せます。",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    meta: "店内OK・テラスのみ・犬用メニュー",
  },
  {
    title: "動物病院を探す",
    href: "/clinics",
    description: "夜間対応や専門医、医療機器の情報を一覧で確認。",
    image:
      "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=1200&q=80",
    meta: "夜間対応 / 専門医 / 画像診断",
  },
  {
    title: "犬と泊まれる宿・ホテル",
    href: "/stays",
    description: "宿泊可能サイズやドッグラン有無、同伴可能範囲で比較。",
    image:
      "https://images.unsplash.com/photo-1512914890250-353c97c9e7c3?auto=format&fit=crop&w=1200&q=80",
    meta: "大型犬OK・ドッグラン併設",
  },
];

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

  const newStays = stays.slice(0, 3).map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    image: item.image,
    badges: [
      { label: item.allowedSize, tone: "warning" as const },
      ...(item.hasDogRun
        ? [{ label: "ドッグランあり", tone: "success" as const }]
        : [{ label: "ドッグランなし", tone: "muted" as const }]),
      { label: item.companionRange, tone: "primary" as const },
    ],
    address: item.address,
  }));

  return (
    <>
      <HeroSection />
      <CategoryNav />
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-12 px-6 py-12">
        <section className="section space-y-8 p-6 sm:p-8">
          <SectionHeader
            title="新着情報"
            subtitle="最新のドッグラン、カフェ、宿泊施設をご紹介"
          />
          <div className="space-y-10">
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
            <NewArrivalsSection
              title="新着宿泊施設"
              href="/stays"
              items={newStays}
            />
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeader
            title="カテゴリーから探す"
            subtitle="一覧→詳細ページで設備・条件を確認できます"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sections.map((section) => (
              <InfoCard key={section.href} {...section} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
