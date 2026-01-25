// デバッグ用: データ変換処理の確認
import { fetchDogRuns, transformWordPressResponse } from "@/lib/wordpress";

export default async function DebugTransformPage() {
  try {
    let dogRuns: any[] = [];
    let fetchError: string | null = null;
    
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
    
    // fetchDogRunsを呼び出し
    try {
      console.error("[DebugTransform] Starting fetchDogRuns...");
      dogRuns = await fetchDogRuns();
      console.error(`[DebugTransform] Received ${dogRuns.length} dog runs`);
    } catch (error) {
      fetchError = error instanceof Error ? error.message : String(error);
      console.error("[DebugTransform] Error fetching:", fetchError);
    }
    
    // 生のAPIレスポンスで直接変換処理をテスト
    let directTransformResults: any[] = [];
    let directTransformErrors: Array<{ index: number; error: string }> = [];
    
    if (rawData && Array.isArray(rawData) && rawData.length > 0) {
      for (let i = 0; i < rawData.length; i++) {
        try {
          // @ts-ignore - テスト用なので型チェックを無視
          const transformed = transformWordPressResponse(rawData[i]);
          directTransformResults.push(transformed);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          directTransformErrors.push({ index: i, error: errorMsg });
        }
      }
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
            {fetchError && (
              <div style={{ marginTop: "15px" }}>
                <h3 style={{ color: "red" }}>エラー詳細:</h3>
                <pre style={{ background: "#fff", padding: "10px", overflow: "auto", color: "red" }}>
                  {fetchError}
                </pre>
              </div>
            )}
            {rawData && Array.isArray(rawData) && rawData.length > 0 && (
              <div style={{ marginTop: "15px" }}>
                <p style={{ color: "red" }}>生のAPIレスポンスには {rawData.length} 件のデータがありますが、変換処理でエラーが発生している可能性があります。</p>
                <p style={{ color: "red" }}>Vercelのログで「[WordPress API] Error transforming item」というメッセージを確認してください。</p>
              </div>
            )}
          </div>
        )}
        
        {rawData && Array.isArray(rawData) && rawData.length > 0 ? (
          <div style={{ marginBottom: "20px", border: "2px solid #4A5844", padding: "15px", borderRadius: "5px", background: "#f9f9f9" }}>
            <h2 style={{ color: "#4A5844", marginBottom: "10px" }}>直接変換テスト（生のAPIレスポンスを使用）:</h2>
            <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
              成功: <span style={{ color: "green" }}>{directTransformResults.length}</span>件 / 
              エラー: <span style={{ color: "red" }}>{directTransformErrors.length}</span>件 / 
              合計: {rawData.length}件
            </p>
            {directTransformErrors.length > 0 && (
              <div style={{ marginTop: "15px", background: "#ffebee", padding: "10px", borderRadius: "5px" }}>
                <h3 style={{ color: "red", marginBottom: "10px" }}>変換エラー詳細:</h3>
                <pre style={{ background: "#fff", padding: "10px", overflow: "auto", color: "red", maxHeight: "300px", fontSize: "12px" }}>
                  {JSON.stringify(directTransformErrors, null, 2)}
                </pre>
              </div>
            )}
            {directTransformResults.length > 0 && (
              <div style={{ marginTop: "15px" }}>
                <h3 style={{ color: "green", marginBottom: "10px" }}>最初のアイテム（直接変換結果）:</h3>
                <pre style={{ background: "#e8f5e9", padding: "10px", overflow: "auto", maxHeight: "400px", fontSize: "12px" }}>
                  {JSON.stringify(directTransformResults[0], null, 2)}
                </pre>
              </div>
            )}
            {directTransformResults.length === 0 && directTransformErrors.length === 0 && (
              <p style={{ color: "orange", marginTop: "10px" }}>変換処理が実行されていません</p>
            )}
          </div>
        ) : (
          <div style={{ marginBottom: "20px", border: "2px solid #ff9800", padding: "15px", borderRadius: "5px", background: "#fff3e0" }}>
            <h2 style={{ color: "#ff9800" }}>直接変換テスト:</h2>
            <p style={{ color: "#ff9800" }}>生のAPIレスポンスが取得できていないため、直接変換テストを実行できませんでした。</p>
            {rawError && (
              <p style={{ color: "red", marginTop: "10px" }}>エラー: {rawError}</p>
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
