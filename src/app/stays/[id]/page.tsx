import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { stays } from "@/data/stays";
import { Badge } from "@/components/Badge";
import { DetailList } from "@/components/DetailList";

export default async function StayDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = stays.find((s) => s.id === id);
  if (!data) return notFound();

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6">
      <div className="section overflow-hidden">
        <div className="grid gap-6 sm:grid-cols-[1.2fr_1fr]">
          <div className="relative h-72 w-full">
            <Image
              src={data.image}
              alt={data.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
          <div className="flex flex-col gap-3 p-5">
            <div className="flex flex-wrap gap-2">
              <Badge tone="warning">{data.allowedSize}</Badge>
              {data.hasDogRun ? (
                <Badge tone="success">ドッグランあり</Badge>
              ) : (
                <Badge tone="muted">ドッグランなし</Badge>
              )}
              <Badge tone="primary">{data.companionRange}</Badge>
            </div>
            <h1 className="text-2xl font-semibold text-[#2D2D2D]">{data.name}</h1>
            <p className="text-sm text-gray-700">{data.description}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="pill bg-[#D1D1CA] text-[#2D2D2D]">
                {data.address.prefecture} {data.address.city} {data.address.line1 ?? ""}
              </span>
              {data.hasDogRun && data.dogRunType ? (
                <span className="pill bg-[#D1D1CA] text-[#2D2D2D]">{data.dogRunType}</span>
              ) : null}
              {data.environment ? <span className="pill bg-[#D1D1CA] text-[#2D2D2D]">{data.environment}</span> : null}
            </div>
            <div className="flex gap-3 text-sm text-[#4A5844]">
              {data.contact.website ? (
                <Link href={data.contact.website} target="_blank" className="underline hover:opacity-70">
                  HPを見る
                </Link>
              ) : null}
              {data.contact.xAccount ? (
                <Link href={`https://x.com/${data.contact.xAccount.replace("@", "")}`} target="_blank" className="underline hover:opacity-70">
                  X
                </Link>
              ) : null}
              {data.contact.instagramAccount ? (
                <Link href={`https://www.instagram.com/${data.contact.instagramAccount.replace("@", "")}`} target="_blank" className="underline hover:opacity-70">
                  Instagram
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <section className="section p-6 space-y-6">
        <h2 className="text-lg font-semibold text-[#2D2D2D]">基本情報</h2>
        <DetailList
          items={[
            { label: "住所", value: `${data.address.prefecture} ${data.address.city} ${data.address.line1 ?? ""}` },
            { label: "営業時間/案内", value: data.hours },
            { label: "営業日", value: data.holidays },
            { label: "電話番号", value: data.contact.phone },
            { label: "HP", value: data.contact.website },
            { label: "Xアカウント", value: data.contact.xAccount },
            { label: "Instagramアカウント", value: data.contact.instagramAccount },
            { label: "宿泊可能サイズ", value: data.allowedSize },
            { label: "ドッグラン", value: data.hasDogRun ? data.dogRunType ?? "あり" : "なし" },
            { label: "同伴可能範囲", value: data.companionRange },
            { label: "ペット専用アメニティ", value: data.amenities },
            {
              label: "追加料金",
              value: [
                data.extraFees?.perDog ? `1頭あたり: ${data.extraFees.perDog}` : null,
                data.extraFees?.cleaning ? `清掃代: ${data.extraFees.cleaning}` : null,
              ].filter(Boolean) as string[],
            },
            { label: "宿泊条件", value: data.conditions },
            { label: "周辺環境", value: data.environment },
            { label: "近隣の動物病院", value: data.nearbyClinic },
          ]}
        />
      </section>

      <div className="flex gap-4 text-sm">
        <Link
          href="/stays"
          className="rounded-full bg-white px-4 py-2 font-semibold text-[#4A5844] shadow-sm ring-1 ring-gray-200 transition hover:bg-[#4A5844] hover:text-white"
        >
          一覧に戻る
        </Link>
      </div>
    </main>
  );
}
