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
  try {
    const acf = item.acf || {};
    
    // デバッグ: 必須フィールドの確認
    if (!item.slug && !item.id) {
      console.warn("Item missing both slug and id:", item);
    }
    
    const result: DogRun = {
      id: item.slug || `dr-${item.id}`,
      name: acf.name || item.title.rendered || "名称未設定",
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
    
    return result;
  } catch (error) {
    console.error("Error in transformWordPressResponse:", error);
    console.error("Item data:", JSON.stringify(item, null, 2));
    throw error;
  }
}

// WordPress REST APIからドッグランデータを取得
export async function fetchDogRuns(): Promise<DogRun[]> {
  const apiUrl = `${WORDPRESS_API_URL}/dog_run?per_page=100`;
  
  // エラーを明示的にログに出力（Vercelのログに表示されるように）
  console.error("[WordPress API] Starting fetch:", apiUrl);
  
  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // 1時間キャッシュ
      headers: {
        'Accept': 'application/json',
      },
    });

    console.error("[WordPress API] Response status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[WordPress API] Error response:", errorText);
      const error = new Error(`WordPress API error: ${response.status} - ${errorText}`);
      console.error("[WordPress API] Throwing error:", error.message);
      throw error;
    }

    const data: WordPressDogRunResponse[] = await response.json();
    console.error(`[WordPress API] Fetched ${data.length} dog runs`);
    
    if (data.length === 0) {
      console.error("[WordPress API] WARNING: No dog runs found in API response");
      return [];
    }
    
    // デバッグ: 最初のアイテムの構造をログに出力
    if (data.length > 0) {
      console.error("[WordPress API] First item has ACF:", data[0].acf ? "Yes" : "No");
      if (data[0].acf) {
        console.error("[WordPress API] ACF keys:", Object.keys(data[0].acf).join(", "));
      }
    }
    
    // データ変換処理（エラーが発生しても続行）
    const transformed: DogRun[] = [];
    for (let i = 0; i < data.length; i++) {
      try {
        const transformedItem = transformWordPressResponse(data[i]);
        transformed.push(transformedItem);
      } catch (error) {
        console.error(`[WordPress API] Error transforming item ${i} (ID: ${data[i].id}, Slug: ${data[i].slug}):`, error);
        if (error instanceof Error) {
          console.error("[WordPress API] Transformation error:", error.message);
        }
        // エラーが発生したアイテムはスキップして続行
      }
    }
    
    console.error(`[WordPress API] Successfully transformed ${transformed.length} out of ${data.length} items`);
    
    if (transformed.length === 0 && data.length > 0) {
      const errorMsg = "All WordPress items failed to transform. Check transformation logic.";
      console.error("[WordPress API] ERROR:", errorMsg);
      // エラーをthrowしてVercelのログに表示されるようにする
      throw new Error(errorMsg);
    }
    
    if (transformed.length === 0) {
      const errorMsg = "No dog runs data available from WordPress API";
      console.error("[WordPress API] ERROR:", errorMsg);
      // データが空の場合もエラーとして扱う（デバッグ用）
      // 本番環境では空配列を返す方が良い場合もあるが、デバッグのためエラーをthrow
      // throw new Error(errorMsg);
    }
    
    return transformed;
  } catch (error) {
    // エラーを明示的にログに出力（Vercelのログに表示されるように）
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[WordPress API] FATAL ERROR fetching dog runs:", errorMessage);
    console.error("[WordPress API] Error object:", error);
    if (error instanceof Error) {
      console.error("[WordPress API] Error stack:", error.stack);
    }
    // エラーを再throwして、Vercelのログに表示されるようにする
    // ただし、ページが表示されなくなる可能性があるため、コメントアウト
    // throw error;
    // エラー時は空配列を返す
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
