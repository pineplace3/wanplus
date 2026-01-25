// ドッグラン一覧ページ
import { getDogRuns } from "@/data/dogRuns";
import DogRunsClient from "./DogRunsClient";

export default async function DogRunsPage() {
  const dogRuns = await getDogRuns();

  return <DogRunsClient initialData={dogRuns} />;
}
