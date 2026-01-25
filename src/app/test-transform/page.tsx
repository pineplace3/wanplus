// 実際のAPIレスポンスで変換処理を直接テスト
"use client";

import { useState, useEffect } from "react";
import { transformWordPressResponse } from "@/lib/wordpress";

export default function TestTransformPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function test() {
      try {
        // 実際のAPIレスポンスを取得
        const response = await fetch("https://wanplus-admin.com/wp-json/wp/v2/dog_run?per_page=1", {
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.length === 0) {
          throw new Error("No data returned from API");
        }
        
        // 変換処理をテスト
        try {
          // @ts-ignore
          const transformed = transformWordPressResponse(data[0]);
          setResult({ success: true, data: transformed, raw: data[0] });
        } catch (transformError) {
          setError(`Transform error: ${transformError instanceof Error ? transformError.message : String(transformError)}`);
          setResult({ success: false, raw: data[0] });
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }
    
    test();
  }, []);

  if (loading) {
    return <div style={{ padding: "20px" }}>読み込み中...</div>;
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
            </div>
          )}
        </>
      )}
    </div>
  );
}
