// デバッグ用: データ変換処理の確認
import { fetchDogRuns } from "@/lib/wordpress";

export default async function DebugTransformPage() {
  try {
    const dogRuns = await fetchDogRuns();
    
    return (
      <div style={{ padding: "20px", fontFamily: "monospace" }}>
        <h1>WordPress API データ変換デバッグ</h1>
        <div style={{ marginBottom: "20px" }}>
          <h2>変換後のデータ数:</h2>
          <p>{dogRuns.length}</p>
        </div>
        {dogRuns.length > 0 ? (
          <div style={{ marginBottom: "20px" }}>
            <h2>最初のアイテム（変換後）:</h2>
            <pre style={{ background: "#f5f5f5", padding: "10px", overflow: "auto" }}>
              {JSON.stringify(dogRuns[0], null, 2)}
            </pre>
          </div>
        ) : (
          <div style={{ marginBottom: "20px", color: "red" }}>
            <h2>警告:</h2>
            <p>データが取得できませんでした</p>
          </div>
        )}
        <div style={{ marginBottom: "20px" }}>
          <h2>すべてのデータ（変換後）:</h2>
          <pre style={{ background: "#f5f5f5", padding: "10px", overflow: "auto", maxHeight: "500px" }}>
            {JSON.stringify(dogRuns, null, 2)}
          </pre>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: "20px", fontFamily: "monospace" }}>
        <h1>WordPress API データ変換デバッグ - エラー</h1>
        <div style={{ marginBottom: "20px" }}>
          <h2>Error:</h2>
          <pre style={{ background: "#ffebee", padding: "10px", overflow: "auto" }}>
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <h2>Stack:</h2>
          <pre style={{ background: "#ffebee", padding: "10px", overflow: "auto" }}>
            {error instanceof Error ? error.stack : "No stack trace"}
          </pre>
        </div>
      </div>
    );
  }
}
