// デバッグ用: 実際のAPIレスポンスで変換処理をテスト
import { transformWordPressResponse } from "@/lib/wordpress";

// 実際のAPIレスポンスのサンプルデータ
const sampleApiResponse = {
  "id": 54,
  "date": "2026-01-23T12:09:09",
  "date_gmt": "2026-01-23T03:09:09",
  "slug": "ab%e3%83%89%e3%83%83%e3%82%b0%e3%83%a9%e3%83%b3",
  "status": "publish",
  "type": "dog_run",
  "title": {
    "rendered": "ABドッグラン"
  },
  "acf": {
    "name": "ABドッグラン",
    "description": "アメリカンなドッグランです",
    "image": "https://wanplus-admin.com/wp-content/uploads/2026/01/ドッグラン.webp",
    "prefecture": "栃木県",
    "city": "日光市",
    "line1": "1-1-1",
    "hours": "10:00-20:00",
    "holidays": "水曜日",
    "phone": "",
    "x_account": "",
    "instagram_account": "",
    "fee": "１頭あたり800円",
    "parking": "あり",
    "zone": ["小型犬専用あり", "大型犬専用あり"],
    "ground": "砂",
    "facility_water": "あり",
    "facility_agility": "あり",
    "facility_lights": "あり",
    "conditions": "狂犬病ワクチン",
    "manners_wear": "義務なし"
  }
};

export default async function DebugTransformTestPage() {
  let transformResult = null;
  let transformError = null;
  
  try {
    // @ts-ignore - テスト用なので型チェックを無視
    transformResult = transformWordPressResponse(sampleApiResponse);
  } catch (error) {
    transformError = error instanceof Error ? error.message : String(error);
  }
  
  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>変換処理テスト</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <h2>入力データ（APIレスポンス）:</h2>
        <pre style={{ background: "#f5f5f5", padding: "10px", overflow: "auto", maxHeight: "400px" }}>
          {JSON.stringify(sampleApiResponse, null, 2)}
        </pre>
      </div>
      
      {transformError ? (
        <div style={{ marginBottom: "20px", background: "#ffebee", padding: "15px", borderRadius: "5px" }}>
          <h2 style={{ color: "red" }}>変換エラー:</h2>
          <pre style={{ background: "#fff", padding: "10px", overflow: "auto", color: "red" }}>
            {transformError}
          </pre>
        </div>
      ) : transformResult ? (
        <div style={{ marginBottom: "20px" }}>
          <h2>変換結果:</h2>
          <pre style={{ background: "#e8f5e9", padding: "10px", overflow: "auto", maxHeight: "400px" }}>
            {JSON.stringify(transformResult, null, 2)}
          </pre>
        </div>
      ) : (
        <p>変換結果がありません</p>
      )}
    </div>
  );
}
