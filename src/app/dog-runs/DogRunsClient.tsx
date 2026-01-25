"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DogRun } from "@/types";
import { SectionHeader } from "@/components/SectionHeader";
import { Badge } from "@/components/Badge";

const groundOptions = ["すべて", "芝", "砂", "土"] as const;
const zoneOptions = ["すべて", "共用のみ", "小型犬専用あり", "大型犬専用あり", "共用あり"] as const;

interface DogRunsClientProps {
  initialData: DogRun[];
}

export default function DogRunsClient({ initialData }: DogRunsClientProps) {
  const [prefecture, setPrefecture] = useState<string>("すべて");
  const [city, setCity] = useState<string>("すべて");
  const [ground, setGround] = useState<(typeof groundOptions)[number]>("すべて");
  const [zone, setZone] = useState<(typeof zoneOptions)[number]>("すべて");
  const [keyword, setKeyword] = useState<string>("");

  const prefectures = useMemo(
    () => ["すべて", ...new Set(initialData.map((d) => d.address.prefecture))],
    [initialData],
  );

  const cities = useMemo(() => {
    if (prefecture === "すべて") return ["すべて"];
    const filtered = initialData
      .filter((d) => d.address.prefecture === prefecture)
      .map((d) => d.address.city);
    return ["すべて", ...new Set(filtered)];
  }, [prefecture, initialData]);

  const filtered = useMemo(() => {
    return initialData.filter((d) => {
      const matchPref =
        prefecture === "すべて" || d.address.prefecture === prefecture;
      const matchCity = city === "すべて" || d.address.city === city;
      const matchGround = ground === "すべて" || d.ground === ground;
      const matchZone = zone === "すべて" || d.zone === zone;
      const matchKeyword =
        keyword.trim().length === 0 ||
        `${d.name}${d.description}${d.address.city}${d.address.prefecture}`
          .toLowerCase()
          .includes(keyword.toLowerCase());
      return matchPref && matchCity && matchGround && matchZone && matchKeyword;
    });
  }, [prefecture, city, ground, zone, keyword, initialData]);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6">
      <section className="section p-6 sm:p-8">
        <SectionHeader
          title="ドッグラン一覧"
          subtitle="住所・エリア分け・地面の素材で絞り込みできます"
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-5">
          <FilterSelect
            label="都道府県"
            value={prefecture}
            onChange={setPrefecture}
            options={prefectures}
          />
          <FilterSelect label="市区町村" value={city} onChange={setCity} options={cities} />
          <FilterSelect
            label="地面の素材"
            value={ground}
            onChange={(v) => setGround(v as typeof ground)}
            options={groundOptions}
          />
          <FilterSelect label="エリア分け" value={zone} onChange={(v) => setZone(v as typeof zone)} options={zoneOptions} />
          <FilterInput
            label="フリーワード"
            placeholder="例: 芝生 / 駅近"
            value={keyword}
            onChange={setKeyword}
          />
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-sm text-gray-600">
          {filtered.length} 件ヒット（{prefecture} / {city}）
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/dog-runs/${item.id}`}
              className="card overflow-hidden transition hover:-translate-y-1 hover:shadow-xl rounded-xl"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                  <Badge tone="primary">{item.zone}</Badge>
                  <Badge tone="warning">{item.ground}</Badge>
                  {item.parking ? (
                    <Badge tone="success">駐車場あり</Badge>
                  ) : (
                    <Badge tone="muted">駐車場なし</Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 p-4">
                <h3 className="text-lg font-semibold text-[#2D2D2D]">{item.name}</h3>
                <p className="line-clamp-2 text-sm text-gray-600">{item.description}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="pill bg-[#D1D1CA] text-[#2D2D2D]">
                    {item.address.prefecture} {item.address.city}
                  </span>
                  {item.facilities.agility ? <span className="pill bg-[#D1D1CA] text-[#2D2D2D]">アジリティ</span> : null}
                  {item.facilities.lights ? <span className="pill bg-[#D1D1CA] text-[#2D2D2D]">照明あり</span> : null}
                </div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 ? (
            <div className="section p-8 text-center text-gray-600">
              条件に合うドッグランがありませんでした。条件を緩めて再検索してください。
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-[#2D2D2D]">
      <span className="font-semibold">{label}</span>
      <select
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#4A5844] focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function FilterInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-[#2D2D2D]">
      <span className="font-semibold">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#4A5844] focus:outline-none"
      />
    </label>
  );
}
