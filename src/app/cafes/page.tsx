// 犬と行けるカフェ一覧
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cafes } from "@/data/cafes";
import { SectionHeader } from "@/components/SectionHeader";
import { Badge } from "@/components/Badge";

const companionOptions = ["すべて", "店内OK", "テラスのみ"] as const;
const sizeOptions = ["すべて", "小型犬のみ", "大型犬OK"] as const;

export default function CafesPage() {
  const [prefecture, setPrefecture] = useState<string>("すべて");
  const [city, setCity] = useState<string>("すべて");
  const [companion, setCompanion] =
    useState<(typeof companionOptions)[number]>("すべて");
  const [size, setSize] = useState<(typeof sizeOptions)[number]>("すべて");
  const [keyword, setKeyword] = useState<string>("");

  const prefectures = useMemo(
    () => ["すべて", ...new Set(cafes.map((c) => c.address.prefecture))],
    [],
  );

  const cities = useMemo(() => {
    if (prefecture === "すべて") return ["すべて"];
    const filtered = cafes
      .filter((c) => c.address.prefecture === prefecture)
      .map((c) => c.address.city);
    return ["すべて", ...new Set(filtered)];
  }, [prefecture]);

  const filtered = useMemo(() => {
    return cafes.filter((c) => {
      const matchPref =
        prefecture === "すべて" || c.address.prefecture === prefecture;
      const matchCity = city === "すべて" || c.address.city === city;
      const matchCompanion = companion === "すべて" || c.companionArea === companion;
      const matchSize = size === "すべて" || c.sizeLimit === size;
      const matchKeyword =
        keyword.trim().length === 0 ||
        `${c.name}${c.description}${c.address.city}${c.address.prefecture}`
          .toLowerCase()
          .includes(keyword.toLowerCase());
      return matchPref && matchCity && matchCompanion && matchSize && matchKeyword;
    });
  }, [prefecture, city, companion, size, keyword]);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6">
      <section className="section p-6 sm:p-8">
        <SectionHeader
          title="犬と行けるカフェ一覧"
          subtitle="住所、同伴可能エリア、サイズ制限で絞り込みできます"
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-5">
          <FilterSelect label="都道府県" value={prefecture} onChange={setPrefecture} options={prefectures} />
          <FilterSelect label="市区町村" value={city} onChange={setCity} options={cities} />
          <FilterSelect
            label="同伴可能エリア"
            value={companion}
            onChange={(v) => setCompanion(v as typeof companion)}
            options={companionOptions}
          />
          <FilterSelect
            label="サイズ制限"
            value={size}
            onChange={(v) => setSize(v as typeof size)}
            options={sizeOptions}
          />
          <FilterInput
            label="フリーワード"
            value={keyword}
            onChange={setKeyword}
            placeholder="例: 店内OK / 犬用メニュー"
          />
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-sm text-slate-600">
          {filtered.length} 件ヒット（{prefecture} / {city}）
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/cafes/${item.id}`}
              className="card overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
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
                  <Badge tone="primary">{item.companionArea}</Badge>
                  <Badge tone="warning">{item.sizeLimit}</Badge>
                  {item.dogMenu === "有り" ? (
                    <Badge tone="success">犬用メニュー</Badge>
                  ) : (
                    <Badge tone="muted">犬用メニューなし</Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 p-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="line-clamp-2 text-sm text-slate-600">{item.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                  <span className="pill bg-slate-100">
                    {item.address.prefecture} {item.address.city}
                  </span>
                  {item.parking ? <span className="pill bg-emerald-100">駐車場あり</span> : null}
                  {item.services ? <span className="pill bg-orange-100">{item.services}</span> : null}
                </div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 ? (
            <div className="section p-8 text-center text-slate-600">
              条件に合うカフェがありませんでした。条件を緩めて再検索してください。
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
    <label className="flex flex-col gap-1 text-sm text-slate-700">
      <span className="font-semibold text-slate-800">{label}</span>
      <select
        className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none"
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
    <label className="flex flex-col gap-1 text-sm text-slate-700">
      <span className="font-semibold text-slate-800">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none"
      />
    </label>
  );
}
