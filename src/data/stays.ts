import { Stay } from "@/types";

export const stays: Stay[] = [
  {
    id: "stay-haku",
    name: "泊まれる森 HAKU",
    description:
      "森に囲まれた温泉付きオーベルジュ。客室内同伴OKで、敷地内に芝の共有ドッグランを備える。",
    image:
      "https://images.unsplash.com/photo-1501117716987-c8e1ecb210af?auto=format&fit=crop&w=1200&q=80",
    address: { prefecture: "長野県", city: "軽井沢町" },
    hours: "チェックイン 15:00 / チェックアウト 11:00",
    holidays: "不定休",
    contact: {
      phone: "0267-00-2222",
      website: "https://example.com/haku",
      xAccount: "@haku_dogstay",
    },
    parking: true,
    allowedSize: "大型犬OK",
    hasDogRun: true,
    dogRunType: "共有ドッグラン",
    companionRange: "レストラン同伴可",
    amenities: ["トイレシーツ", "足拭きタオル", "食器", "消臭剤", "ケージ/サークル貸出"],
    extraFees: { perDog: "1頭 3,000円/泊", cleaning: "大型犬は+1,000円" },
    conditions: "ワクチン証明提出。館内はリード着用。",
    environment: "森と小川に囲まれた静かな立地",
    nearbyClinic: "軽井沢動物病院（車10分）",
  },
  {
    id: "stay-harborhotel",
    name: "ハーバーシティホテル",
    description:
      "ベイエリアのシティホテル。客室内のみ同伴可だが、部屋併設の小さなドッグスペースあり。",
    image:
      "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80",
    address: { prefecture: "神奈川県", city: "横浜市" },
    hours: "チェックイン 14:00 / チェックアウト 10:00",
    holidays: "年中無休",
    contact: { phone: "045-888-7777", website: "https://example.com/harborhotel" },
    parking: true,
    allowedSize: "大型犬OK",
    hasDogRun: false,
    companionRange: "客室内のみ",
    amenities: ["トイレシーツ", "足拭きタオル", "食器", "消臭剤"],
    extraFees: { perDog: "1頭 4,000円/泊" },
    conditions: "ロビーはキャリーで移動。無駄吠えしやすい子は要相談。",
    environment: "ベイフロント / 公園まで徒歩5分",
    nearbyClinic: "ハーバー動物病院（徒歩8分）",
  },
  {
    id: "stay-sora",
    name: "空のヴィラ",
    description:
      "高原に建つ一棟貸しヴィラ。部屋併設ドッグランでプライベートに過ごせる。大型犬も歓迎。",
    image:
      "https://images.unsplash.com/photo-1512914890250-353c97c9e7c3?auto=format&fit=crop&w=1200&q=80",
    address: { prefecture: "北海道", city: "富良野市" },
    hours: "チェックイン 15:00 / チェックアウト 10:00",
    holidays: "不定休",
    contact: { website: "https://example.com/sora" },
    parking: true,
    allowedSize: "大型犬OK",
    hasDogRun: true,
    dogRunType: "部屋併設ドッグラン",
    companionRange: "レストラン同伴可",
    amenities: ["トイレシーツ", "足拭きタオル", "食器", "消臭剤", "ケージ/サークル貸出"],
    extraFees: { cleaning: "1滞在 3,000円" },
    conditions: "ベッドの上はNG。屋内はマナーウェア着用推奨。",
    environment: "高原・星空スポット",
    nearbyClinic: "富良野アニマルクリニック（車12分）",
  },
];
