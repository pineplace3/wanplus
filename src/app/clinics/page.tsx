// 動物病院一覧
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { clinics } from "@/data/clinics";
import { SectionHeader } from "@/components/SectionHeader";
import { Badge } from "@/components/Badge";

const afterHoursOptions = ["すべて", "対応あり", "対応なし"] as const;

export default function ClinicsPage() {
  const [prefecture, setPrefecture] = useState<string>("すべて");
  const [city, setCity] = useState<string>("すべて");
  const [afterHours, setAfterHours] =
    useState<(typeof afterHoursOptions)[number]>("すべて");
  const [keyword, setKeyword] = useState<string>("");

  const prefectures = useMemo(
    () => ["すべて", ...new Set(clinics.map((c) => c.address.prefecture))],
    [],
  );

  const cities = useMemo(() => {
    if (prefecture === "すべて") return ["すべて"];
    const filtered = clinics
      .filter((c) => c.address.prefecture === prefecture)
      .map((c) => c.address.city);
    return ["すべて", ...new Set(filtered)];
  }, [prefecture]);

  const filtered = useMemo(() => {
    return clinics.filter((c) => {
      const matchPref =
        prefecture === "すべて" || c.address.prefecture === prefecture;
      const matchCity = city === "すべて" || c.address.city === city;
      const matchAfter =
        afterHours === "すべて" || c.afterHours === afterHours;
      const matchKeyword =
        keyword.trim().length === 0 ||
        `${c.name}${c.description}${c.specialists ?? ""}${(c.equipment ?? []).join(",")}`
          .toLowerCase()
          .includes(keyword.toLowerCase());
      return matchPref && matchCity && matchAfter && matchKeyword;
    });
  }, [prefecture, city, afterHours, keyword]);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6">
      <section className="section p-6 sm:p-8">
        <SectionHeader
          title="動物病院一覧"
          subtitle="住所、夜間対応、専門・機器の情報を確認できます"
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-5">
          <FilterSelect label="都道府県" value={prefecture} onChange={setPrefecture} options={prefectures} />
          <FilterSelect label="市区町村" value={city} onChange={setCity} options={cities} />
          <FilterSelect
            label="時間外対応"
            value={afterHours}
            onChange={(v) => setAfterHours(v as typeof afterHours)}
            options={afterHoursOptions}
          />
          <FilterInput
            label="フリーワード"
            value={keyword}
            onChange={setKeyword}
            placeholder="例: 整形 / 画像診断 / CT"
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
              href={`/clinics/${item.id}`}
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
                  <Badge tone="primary">{item.afterHours ?? "不明"}</Badge>
                  {item.petHotel ? <Badge tone="success">ペットホテル</Badge> : null}
                  {item.trimming ? <Badge tone="success">トリミング</Badge> : null}
                </div>
              </div>
              <div className="flex flex-col gap-2 p-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="line-clamp-2 text-sm text-slate-600">{item.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                  <span className="pill bg-slate-100">
                    {item.address.prefecture} {item.address.city}
                  </span>
                  {item.specialists ? (
                    <span className="pill bg-orange-100">{item.specialists}</span>
                  ) : null}
                  {item.equipment && item.equipment.length > 0 ? (
                    <span className="pill bg-amber-100">{item.equipment.slice(0, 2).join(" / ")}</span>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 ? (
            <div className="section p-8 text-center text-slate-600">
              条件に合う動物病院がありませんでした。条件を緩めて再検索してください。
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
