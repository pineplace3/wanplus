// デバッグ用: WordPress APIのレスポンスを直接確認
export default async function DebugPage() {
  const apiUrl = "https://wanplus-admin.com/wp-json/wp/v2/dog_run?per_page=100";
  
  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 0 }, // キャッシュしない
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; WanPlus/1.0; +https://wanplus.vercel.app)',
        'Referer': 'https://wanplus.vercel.app',
      },
    });
    
    const status = response.status;
    const statusText = response.statusText;
    const contentType = response.headers.get("content-type");
    
    // レスポンスのテキストを先に取得
    const responseText = await response.text();
    
    // Content-Typeを確認
    let data;
    let parseError = null;
    
    if (contentType && contentType.includes("application/json")) {
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        parseError = e instanceof Error ? e.message : String(e);
        data = null;
      }
    } else {
      parseError = `Expected JSON but got: ${contentType}`;
      data = null;
    }
    
    return (
      <div style={{ padding: "20px", fontFamily: "monospace" }}>
        <h1>WordPress API デバッグ</h1>
        <div style={{ marginBottom: "20px" }}>
          <h2>API URL:</h2>
          <code>{apiUrl}</code>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <h2>Response Status:</h2>
          <p>{status} {statusText}</p>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <h2>Content-Type:</h2>
          <p>{contentType || "Not set"}</p>
        </div>
        {parseError && (
          <div style={{ marginBottom: "20px", background: "#ffebee", padding: "10px" }}>
            <h2 style={{ color: "red" }}>Parse Error:</h2>
            <p>{parseError}</p>
          </div>
        )}
        <div style={{ marginBottom: "20px" }}>
          <h2>Raw Response (first 500 chars):</h2>
          <pre style={{ background: "#f5f5f5", padding: "10px", overflow: "auto" }}>
            {responseText.substring(0, 500)}
          </pre>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <h2>Data Count:</h2>
          <p>{data && Array.isArray(data) ? data.length : data ? "Not an array" : "No data"}</p>
        </div>
        {data && Array.isArray(data) && data.length > 0 && (
          <>
            <div style={{ marginBottom: "20px" }}>
              <h2>First Item:</h2>
              <pre style={{ background: "#f5f5f5", padding: "10px", overflow: "auto" }}>
                {JSON.stringify(data[0] || {}, null, 2)}
              </pre>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <h2>All Data:</h2>
              <pre style={{ background: "#f5f5f5", padding: "10px", overflow: "auto", maxHeight: "500px" }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: "20px", fontFamily: "monospace" }}>
        <h1>WordPress API デバッグ - エラー</h1>
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
