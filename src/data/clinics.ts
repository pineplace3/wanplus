import { Clinic } from "@/types";

export const clinics: Clinic[] = [
  {
    id: "cl-harbor",
    name: "ハーバー動物病院",
    description:
      "夜間対応も行う総合動物病院。内科・外科の専門医が常駐し、最新の画像診断機器を導入。",
    image:
      "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=1200&q=80",
    address: { prefecture: "神奈川県", city: "横浜市", line1: "中区 3-2-8" },
    hours: "9:00 - 19:00",
    holidays: "年中無休",
    contact: { phone: "045-222-3333", website: "https://example.com/harbor" },
    afterHours: "対応あり",
    petHotel: true,
    trimming: true,
    specialists: "総合診療 / 画像診断 / 循環器",
    equipment: ["CT", "内視鏡", "超音波エコー", "血液検査機器"],
    associations: ["日本獣医画像診断学会", "日本獣医循環器学会"],
  },
  {
    id: "cl-momiji",
    name: "もみじアニマルクリニック",
    description:
      "地域密着のホームドクター。予防医療と皮膚科に強く、トリミング併設で相談しやすい。",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    address: { prefecture: "東京都", city: "杉並区", line1: "高円寺 5-10-6" },
    hours: "9:00 - 12:00 / 15:00 - 18:00",
    holidays: "木曜午後・日曜午後",
    contact: { phone: "03-6789-1234" },
    afterHours: "対応なし",
    petHotel: false,
    trimming: true,
    specialists: "皮膚科・予防医療",
    equipment: ["超音波エコー", "レントゲン"],
    associations: ["日本獣医皮膚科学会"],
  },
  {
    id: "cl-midori",
    name: "みどり丘どうぶつ病院",
    description:
      "整形とリハビリに強みがある郊外型クリニック。水中トレッドミルを備え、リハビリ専門スタッフが在籍。",
    image:
      "https://images.unsplash.com/photo-1504204267155-aaad8e81290f?auto=format&fit=crop&w=1200&q=80",
    address: { prefecture: "愛知県", city: "長久手市", line1: "緑台 1-9-1" },
    hours: "9:00 - 12:00 / 16:00 - 19:00",
    holidays: "火曜・祝日",
    contact: { phone: "0561-555-9999", website: "https://example.com/midori" },
    afterHours: "対応なし",
    petHotel: true,
    trimming: false,
    specialists: "整形外科・リハビリテーション",
    equipment: ["水中トレッドミル", "デジタルレントゲン"],
    associations: ["日本獣医麻酔外科学会"],
  },
];
