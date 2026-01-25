// デバッグ用: WordPress APIのレスポンスを直接確認
export default async function DebugPage() {
  const apiUrl = "https://wanplus-admin.com/wp-json/wp/v2/dog_run?per_page=100";
  
  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 0 }, // キャッシュしない
    });
    
    const status = response.status;
    const statusText = response.statusText;
    const data = await response.json();
    
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
          <h2>Data Count:</h2>
          <p>{Array.isArray(data) ? data.length : "Not an array"}</p>
        </div>
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
