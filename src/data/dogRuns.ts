import { DogRun } from "@/types";
import { fetchDogRuns } from "@/lib/wordpress";

// WordPress APIからデータを取得
export async function getDogRuns(): Promise<DogRun[]> {
  console.error("[getDogRuns] Calling fetchDogRuns...");
  try {
    const result = await fetchDogRuns();
    console.error(`[getDogRuns] Received ${result.length} dog runs`);
    return result;
  } catch (error) {
    console.error("[getDogRuns] ERROR:", error);
    throw error;
  }
}

// 後方互換性のため、空配列をエクスポート（非推奨）
// 実際のデータはWordPress APIから取得されます
export const dogRuns: DogRun[] = [];
