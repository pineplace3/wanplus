import { DogRun } from "@/types";

// WordPress REST APIのベースURL
const WORDPRESS_API_URL = "https://wanplus-admin.com/wp-json/wp/v2";

// WordPress APIのレスポンス型
interface WordPressDogRunResponse {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  acf?: {
    name?: string;
    description?: string;
    image?: string;
    prefecture?: string;
    city?: string;
    line1?: string;
    hours?: string;
    holidays?: string;
    phone?: string;
    website?: string;
    x_account?: string;
    instagram_account?: string;
    fee?: string;
    parking?: boolean;
    zone?: string;
    ground?: string;
    facility_water?: string;
    facility_foot_wash?: string;
    facility_agility?: string;
    facility_lights?: string;
    conditions?: string;
    manners_wear?: string;
  };
}

// 文字列をboolean | "不明"に変換
function parseFacilityValue(value?: string): boolean | "不明" {
  if (!value) return "不明";
  if (value === "あり") return true;
  if (value === "なし") return false;
  return "不明";
}

// 文字列をboolean | "不明"に変換（マナーウェア用）
function parseMannersWear(value?: string): boolean | "不明" {
  if (!value) return "不明";
  if (value === "義務あり") return true;
  if (value === "義務なし") return false;
  return "不明";
}

// WordPressレスポンスをDogRun型に変換
function transformWordPressResponse(item: WordPressDogRunResponse): DogRun {
  const acf = item.acf || {};
  
  return {
    id: item.slug || `dr-${item.id}`,
    name: acf.name || item.title.rendered,
    description: acf.description || "",
    image: acf.image || "",
    address: {
      prefecture: acf.prefecture || "",
      city: acf.city || "",
      line1: acf.line1,
    },
    hours: acf.hours,
    holidays: acf.holidays,
    contact: {
      phone: acf.phone,
      website: acf.website,
      xAccount: acf.x_account,
      instagramAccount: acf.instagram_account,
    },
    parking: acf.parking || false,
    zone: (acf.zone as any) || "共用のみ",
    ground: (acf.ground as any) || "芝",
    facilities: {
      water: parseFacilityValue(acf.facility_water),
      footWash: parseFacilityValue(acf.facility_foot_wash),
      agility: parseFacilityValue(acf.facility_agility),
      lights: parseFacilityValue(acf.facility_lights),
    },
    conditions: acf.conditions,
    mannersWear: parseMannersWear(acf.manners_wear),
    fee: acf.fee,
  };
}

// WordPress REST APIからドッグランデータを取得
export async function fetchDogRuns(): Promise<DogRun[]> {
  try {
    const apiUrl = `${WORDPRESS_API_URL}/dog_run?per_page=100`;
    console.log("Fetching from WordPress API:", apiUrl);
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // 1時間キャッシュ
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log("WordPress API response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("WordPress API error response:", errorText);
      throw new Error(`WordPress API error: ${response.status} - ${errorText}`);
    }

    const data: WordPressDogRunResponse[] = await response.json();
    console.log(`Fetched ${data.length} dog runs from WordPress`);
    
    if (data.length === 0) {
      console.warn("No dog runs found in WordPress API");
    }
    
    return data.map(transformWordPressResponse);
  } catch (error) {
    console.error("Error fetching dog runs from WordPress:", error);
    // エラー詳細をログに出力
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    // エラー時は空配列を返す（またはフォールバックデータを返す）
    return [];
  }
}

// 特定のIDのドッグランを取得
export async function fetchDogRunById(id: string): Promise<DogRun | null> {
  try {
    // スラッグで検索
    const response = await fetch(
      `${WORDPRESS_API_URL}/dog_run?slug=${id}&per_page=1`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const data: WordPressDogRunResponse[] = await response.json();
    
    if (data.length === 0) {
      return null;
    }

    return transformWordPressResponse(data[0]);
  } catch (error) {
    console.error("Error fetching dog run from WordPress:", error);
    return null;
  }
}
