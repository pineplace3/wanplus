import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cafes } from "@/data/cafes";
import { Badge } from "@/components/Badge";
import { DetailList } from "@/components/DetailList";

export default async function CafeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = cafes.find((c) => c.id === id);
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
              <Badge tone="primary">{data.companionArea}</Badge>
              <Badge tone="warning">{data.sizeLimit}</Badge>
              {data.parking ? <Badge tone="success">駐車場あり</Badge> : <Badge tone="muted">駐車場なし</Badge>}
              {data.dogMenu === "有り" ? <Badge tone="success">犬用メニュー</Badge> : null}
            </div>
            <h1 className="text-2xl font-semibold text-[#2D2D2D]">{data.name}</h1>
            <p className="text-sm text-gray-700">{data.description}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="pill bg-[#D1D1CA] text-[#2D2D2D]">
                {data.address.prefecture} {data.address.city} {data.address.line1 ?? ""}
              </span>
              {data.services ? <span className="pill bg-[#D1D1CA] text-[#2D2D2D]">{data.services}</span> : null}
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
            { label: "営業時間", value: data.hours },
            { label: "定休日", value: data.holidays },
            { label: "電話番号", value: data.contact.phone },
            { label: "HP", value: data.contact.website },
            { label: "Xアカウント", value: data.contact.xAccount },
            { label: "Instagramアカウント", value: data.contact.instagramAccount },
            { label: "同伴可能エリア", value: data.companionArea },
            { label: "サイズ制限", value: data.sizeLimit },
            { label: "犬用メニュー", value: data.dogMenu },
            { label: "サービス", value: data.services },
            { label: "利用条件", value: data.conditions },
            {
              label: "マナーウェア",
              value:
                data.mannersWear === "不明"
                  ? "不明"
                  : data.mannersWear
                    ? "着用義務あり"
                    : "義務なし",
            },
          ]}
        />
      </section>

      <div className="flex gap-4 text-sm">
        <Link
          href="/cafes"
          className="rounded-full bg-white px-4 py-2 font-semibold text-[#4A5844] shadow-sm ring-1 ring-gray-200 transition hover:bg-[#4A5844] hover:text-white"
        >
          一覧に戻る
        </Link>
      </div>
    </main>
  );
}
