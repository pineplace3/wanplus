import { DogRun } from "@/types";
import { fetchDogRuns } from "@/lib/wordpress";

// WordPress APIからデータを取得
export async function getDogRuns(): Promise<DogRun[]> {
  return await fetchDogRuns();
}

// 後方互換性のため、空配列をエクスポート（非推奨）
// 実際のデータはWordPress APIから取得されます
export const dogRuns: DogRun[] = [];
