// 実際のAPIレスポンスで変換処理を直接テスト（サーバーコンポーネント）
import { transformWordPressResponse } from "@/lib/wordpress";

export default async function TestTransformPage() {
  let result: any = null;
  let error: string | null = null;

  try {
    // 実際のAPIレスポンスを取得
    const response = await fetch("https://wanplus-admin.com/wp-json/wp/v2/dog_run?per_page=1", {
      next: { revalidate: 0 },
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; WanPlus/1.0; +https://wanplus.vercel.app)',
        'Referer': 'https://wanplus.vercel.app',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.length === 0) {
      throw new Error("No data returned from API");
    }
    
    // 変換処理をテスト
    try {
      // @ts-ignore
      const transformed = transformWordPressResponse(data[0]);
      result = { success: true, data: transformed, raw: data[0] };
    } catch (transformError) {
      error = `Transform error: ${transformError instanceof Error ? transformError.message : String(transformError)}`;
      result = { success: false, raw: data[0], transformError: transformError instanceof Error ? transformError.message : String(transformError) };
    }
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>変換処理テスト</h1>
      
      {error && (
        <div style={{ background: "#ffebee", padding: "15px", marginBottom: "20px", borderRadius: "5px" }}>
          <h2 style={{ color: "red" }}>エラー:</h2>
          <pre style={{ background: "#fff", padding: "10px", overflow: "auto", color: "red" }}>
            {error}
          </pre>
        </div>
      )}
      
      {result && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <h2>生のAPIレスポンス:</h2>
            <pre style={{ background: "#f5f5f5", padding: "10px", overflow: "auto", maxHeight: "400px" }}>
              {JSON.stringify(result.raw, null, 2)}
            </pre>
          </div>
          
          {result.success ? (
            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ color: "green" }}>変換成功:</h2>
              <pre style={{ background: "#e8f5e9", padding: "10px", overflow: "auto", maxHeight: "400px" }}>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          ) : (
            <div style={{ marginBottom: "20px", background: "#ffebee", padding: "15px", borderRadius: "5px" }}>
              <h2 style={{ color: "red" }}>変換失敗</h2>
              {result.transformError && (
                <pre style={{ background: "#fff", padding: "10px", overflow: "auto", color: "red" }}>
                  {result.transformError}
                </pre>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
