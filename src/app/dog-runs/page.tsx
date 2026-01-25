// ドッグラン一覧ページ
import { getDogRuns } from "@/data/dogRuns";
import DogRunsClient from "./DogRunsClient";

export default async function DogRunsPage() {
  console.error("[DogRunsPage] Starting to fetch dog runs...");
  
  try {
    const dogRuns = await getDogRuns();
    console.error(`[DogRunsPage] Fetched ${dogRuns.length} dog runs`);
    
    if (dogRuns.length === 0) {
      console.error("[DogRunsPage] WARNING: No dog runs returned from API");
    }
    
    return <DogRunsClient initialData={dogRuns} />;
  } catch (error) {
    console.error("[DogRunsPage] ERROR:", error);
    if (error instanceof Error) {
      console.error("[DogRunsPage] Error message:", error.message);
      console.error("[DogRunsPage] Error stack:", error.stack);
    }
    // エラー時も空配列で表示を試みる
    return <DogRunsClient initialData={[]} />;
  }
}
