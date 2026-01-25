// デバッグ用: データ変換処理の確認
import { fetchDogRuns } from "@/lib/wordpress";

export default async function DebugTransformPage() {
  try {
    console.error("[DebugTransform] Starting fetchDogRuns...");
    const dogRuns = await fetchDogRuns();
    console.error(`[DebugTransform] Received ${dogRuns.length} dog runs`);
    
    // 生のAPIレスポンスも取得して比較
    const apiUrl = "https://wanplus-admin.com/wp-json/wp/v2/dog_run?per_page=100";
    let rawData = null;
    let rawError = null;
    
    try {
      const rawResponse = await fetch(apiUrl, {
        next: { revalidate: 0 },
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; WanPlus/1.0; +https://wanplus.vercel.app)',
          'Referer': 'https://wanplus.vercel.app',
        },
      });
      
      if (rawResponse.ok) {
        rawData = await rawResponse.json();
      } else {
        rawError = `Status: ${rawResponse.status} ${rawResponse.statusText}`;
      }
    } catch (e) {
      rawError = e instanceof Error ? e.message : String(e);
    }
    
    return (
      <div style={{ padding: "20px", fontFamily: "monospace" }}>
        <h1>WordPress API データ変換デバッグ</h1>
        
        <div style={{ marginBottom: "20px" }}>
          <h2>生のAPIレスポンス:</h2>
          {rawError ? (
            <div style={{ background: "#ffebee", padding: "10px", marginBottom: "10px" }}>
              <p style={{ color: "red" }}>エラー: {rawError}</p>
            </div>
          ) : rawData ? (
            <>
              <p>データ数: {Array.isArray(rawData) ? rawData.length : "Not an array"}</p>
              {Array.isArray(rawData) && rawData.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <h3>最初のアイテム（変換前）:</h3>
                  <pre style={{ background: "#f5f5f5", padding: "10px", overflow: "auto", maxHeight: "300px" }}>
                    {JSON.stringify(rawData[0], null, 2)}
                  </pre>
                </div>
              )}
            </>
          ) : (
            <p>データを取得できませんでした</p>
          )}
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <h2>変換後のデータ数:</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{dogRuns.length}</p>
        </div>
        
        {dogRuns.length > 0 ? (
          <>
            <div style={{ marginBottom: "20px" }}>
              <h2>最初のアイテム（変換後）:</h2>
              <pre style={{ background: "#f5f5f5", padding: "10px", overflow: "auto" }}>
                {JSON.stringify(dogRuns[0], null, 2)}
              </pre>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <h2>すべてのデータ（変換後）:</h2>
              <pre style={{ background: "#f5f5f5", padding: "10px", overflow: "auto", maxHeight: "500px" }}>
                {JSON.stringify(dogRuns, null, 2)}
              </pre>
            </div>
          </>
        ) : (
          <div style={{ marginBottom: "20px", background: "#ffebee", padding: "15px", borderRadius: "5px" }}>
            <h2 style={{ color: "red" }}>警告:</h2>
            <p style={{ color: "red", fontWeight: "bold" }}>データが取得できませんでした</p>
            {rawData && Array.isArray(rawData) && rawData.length > 0 && (
              <div style={{ marginTop: "15px" }}>
                <p style={{ color: "red" }}>生のAPIレスポンスには {rawData.length} 件のデータがありますが、変換処理でエラーが発生している可能性があります。</p>
                <p style={{ color: "red" }}>Vercelのログで「[WordPress API] Error transforming item」というメッセージを確認してください。</p>
              </div>
            )}
          </div>
        )}
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
