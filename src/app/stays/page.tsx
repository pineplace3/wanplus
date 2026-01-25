// 犬と泊まれる宿一覧
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { stays } from "@/data/stays";
import { SectionHeader } from "@/components/SectionHeader";
import { Badge } from "@/components/Badge";

const sizeOptions = ["すべて", "小型犬のみ", "大型犬OK"] as const;
const dogRunOptions = ["すべて", "あり", "なし"] as const;
const companionOptions = ["すべて", "客室内のみ", "レストラン同伴可", "ロビー歩行可"] as const;

export default function StaysPage() {
  const [prefecture, setPrefecture] = useState<string>("すべて");
  const [city, setCity] = useState<string>("すべて");
  const [size, setSize] = useState<(typeof sizeOptions)[number]>("すべて");
  const [dogRun, setDogRun] =
    useState<(typeof dogRunOptions)[number]>("すべて");
  const [companion, setCompanion] =
    useState<(typeof companionOptions)[number]>("すべて");
  const [keyword, setKeyword] = useState<string>("");

  const prefectures = useMemo(
    () => ["すべて", ...new Set(stays.map((s) => s.address.prefecture))],
    [],
  );

  const cities = useMemo(() => {
    if (prefecture === "すべて") return ["すべて"];
    const filtered = stays
      .filter((s) => s.address.prefecture === prefecture)
      .map((s) => s.address.city);
    return ["すべて", ...new Set(filtered)];
  }, [prefecture]);

  const filtered = useMemo(() => {
    return stays.filter((s) => {
      const matchPref =
        prefecture === "すべて" || s.address.prefecture === prefecture;
      const matchCity = city === "すべて" || s.address.city === city;
      const matchSize = size === "すべて" || s.allowedSize === size;
      const matchRun =
        dogRun === "すべて" ||
        (dogRun === "あり" ? s.hasDogRun : s.hasDogRun === false);
      const matchCompanion =
        companion === "すべて" || s.companionRange === companion;
      const matchKeyword =
        keyword.trim().length === 0 ||
        `${s.name}${s.description}${s.environment ?? ""}${s.address.city}${s.address.prefecture}`
          .toLowerCase()
          .includes(keyword.toLowerCase());
      return matchPref && matchCity && matchSize && matchRun && matchCompanion && matchKeyword;
    });
  }, [prefecture, city, size, dogRun, companion, keyword]);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6">
      <section className="section p-6 sm:p-8">
        <SectionHeader
          title="犬と泊まれる宿・ホテル"
          subtitle="宿泊可能サイズ、ドッグラン有無、同伴可能範囲で絞り込みできます"
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-6">
          <FilterSelect label="都道府県" value={prefecture} onChange={setPrefecture} options={prefectures} />
          <FilterSelect label="市区町村" value={city} onChange={setCity} options={cities} />
          <FilterSelect label="宿泊可能サイズ" value={size} onChange={(v) => setSize(v as typeof size)} options={sizeOptions} />
          <FilterSelect label="ドッグラン" value={dogRun} onChange={(v) => setDogRun(v as typeof dogRun)} options={dogRunOptions} />
          <FilterSelect
            label="同伴可能範囲"
            value={companion}
            onChange={(v) => setCompanion(v as typeof companion)}
            options={companionOptions}
          />
          <FilterInput
            label="フリーワード"
            value={keyword}
            onChange={setKeyword}
            placeholder="例: ドッグラン / 温泉 / 高原"
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
              href={`/stays/${item.id}`}
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
                  <Badge tone="warning">{item.allowedSize}</Badge>
                  {item.hasDogRun ? (
                    <Badge tone="success">ドッグランあり</Badge>
                  ) : (
                    <Badge tone="muted">ドッグランなし</Badge>
                  )}
                  <Badge tone="primary">{item.companionRange}</Badge>
                </div>
              </div>
              <div className="flex flex-col gap-2 p-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="line-clamp-2 text-sm text-slate-600">{item.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                  <span className="pill bg-slate-100">
                    {item.address.prefecture} {item.address.city}
                  </span>
                  {item.hasDogRun && item.dogRunType ? (
                    <span className="pill bg-emerald-100">{item.dogRunType}</span>
                  ) : null}
                  {item.environment ? <span className="pill bg-orange-100">{item.environment}</span> : null}
                </div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 ? (
            <div className="section p-8 text-center text-slate-600">
              条件に合う宿泊施設がありませんでした。条件を緩めて再検索してください。
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
