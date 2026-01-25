import { Cafe } from "@/types";

export const cafes: Cafe[] = [
  {
    id: "cafe-hinata",
    name: "カフェ陽だまり",
    description:
      "木の温もりが心地よいローカルカフェ。店内OKで、犬用クッキーとヤギミルクが人気。",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    address: { prefecture: "東京都", city: "世田谷区", line1: "用賀 3-8-2" },
    hours: "9:00 - 20:00",
    holidays: "月曜",
    contact: {
      phone: "03-5000-1234",
      website: "https://example.com/hidamari",
      xAccount: "@cafe_hidamari",
    },
    parking: false,
    companionArea: "店内OK",
    dogMenu: "有り",
    sizeLimit: "大型犬OK",
    services: "お水サービス、ブランケット貸出",
    conditions: "混雑時は2時間制。マナーウェア着用推奨。",
    mannersWear: "不明",
  },
  {
    id: "cafe-terraceblue",
    name: "テラスブルー",
    description:
      "海風を感じるテラス席が人気のカフェ。テラスのみ同伴可だが席数が多く開放的。",
    image:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80",
    address: { prefecture: "神奈川県", city: "藤沢市", line1: "江の島 1-2-5" },
    hours: "10:00 - 19:30",
    holidays: "不定休",
    contact: { website: "https://example.com/terraceblue" },
    parking: true,
    companionArea: "テラスのみ",
    dogMenu: "無し",
    sizeLimit: "大型犬OK",
    services: "テラスにリードフック、足拭きタオル貸出",
    conditions: "店内通路では抱っこかキャリーで移動",
    mannersWear: false,
  },
  {
    id: "cafe-cocoro",
    name: "カフェこころ",
    description:
      "商店街の路地にある小さなカフェ。小型犬に優しい作りで、テラスと半屋外席を利用可能。",
    image:
      "https://images.unsplash.com/photo-1481391406205-74b6b1b4b9fb?auto=format&fit=crop&w=1200&q=80",
    address: { prefecture: "大阪府", city: "大阪市", line1: "北区 2-11-1" },
    hours: "8:30 - 18:00",
    holidays: "水曜",
    contact: { phone: "06-1111-2222", website: "https://example.com/cocoro" },
    parking: false,
    companionArea: "テラスのみ",
    dogMenu: "有り",
    sizeLimit: "小型犬のみ",
    services: "お水サービス、リードフック",
    conditions: "店内は不可。混雑時は1組1頭まで。",
    mannersWear: true,
  },
];
