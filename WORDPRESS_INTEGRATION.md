# WordPress連携ガイド

このドキュメントでは、WordPressにデータを登録して、Next.jsサイトで表示するために必要な情報をまとめています。

## 必要なWordPress設定

### 1. カスタム投稿タイプの作成

以下の4つのカスタム投稿タイプを作成してください：

1. **ドッグラン** (`dog_run`)
2. **犬と行けるカフェ** (`cafe`)
3. **動物病院** (`clinic`)
4. **犬と泊まれる宿** (`stay`)

### 2. 必要なカスタムフィールド（ACF推奨）

#### ドッグラン専用フィールド

| フィールド名 | フィールドキー | 型 | 必須 | 説明 |
|------------|--------------|----|----|----|
| 名前 | `name` | テキスト | ✅ | 施設名 |
| 説明 | `description` | テキストエリア | ✅ | 施設の説明文 |
| 画像URL | `image` | 画像/URL | ✅ | メイン画像のURL |
| 都道府県 | `prefecture` | テキスト | ✅ | 例: "東京都" |
| 市区町村 | `city` | テキスト | ✅ | 例: "昭島市" |
| 住所詳細 | `line1` | テキスト | ❌ | 例: "昭和町 2-10" |
| 営業時間 | `hours` | テキスト | ❌ | 例: "9:00 - 18:00" |
| 定休日 | `holidays` | テキスト | ❌ | 例: "火曜" |
| 電話番号 | `phone` | テキスト | ❌ | 例: "042-000-1234" |
| ウェブサイト | `website` | URL | ❌ | 公式サイトURL |
| Xアカウント | `x_account` | テキスト | ❌ | 例: "@azukawa_dogrun" |
| Instagramアカウント | `instagram_account` | テキスト | ❌ | 例: "@azukawa_dogrun" |
| 料金 | `fee` | テキスト | ❌ | 例: "無料" / "1回 500円" |
| 駐車場 | `parking` | 真偽値 | ✅ | 駐車場の有無 |
| エリア分け | `zone` | セレクト | ✅ | "共用のみ" / "小型犬専用あり" / "大型犬専用あり" / "共用あり" |
| 地面の素材 | `ground` | セレクト | ✅ | "土" / "砂" / "芝" |
| 水飲み場 | `facility_water` | セレクト | ✅ | "あり" / "なし" / "不明" |
| 足洗い場 | `facility_foot_wash` | セレクト | ✅ | "あり" / "なし" / "不明" |
| アジリティ | `facility_agility` | セレクト | ✅ | "あり" / "なし" / "不明" |
| 照明施設 | `facility_lights` | セレクト | ✅ | "あり" / "なし" / "不明" |
| 利用条件 | `conditions` | テキストエリア | ❌ | 利用時の条件や注意事項 |
| マナーウェア | `manners_wear` | セレクト | ❌ | "義務あり" / "義務なし" / "不明" |

#### カフェ専用フィールド

| フィールド名 | フィールドキー | 型 | 必須 | 説明 |
|------------|--------------|----|----|----|
| 名前 | `name` | テキスト | ✅ | 施設名 |
| 説明 | `description` | テキストエリア | ✅ | 施設の説明文 |
| 画像URL | `image` | 画像/URL | ✅ | メイン画像のURL |
| 都道府県 | `prefecture` | テキスト | ✅ | 例: "東京都" |
| 市区町村 | `city` | テキスト | ✅ | 例: "世田谷区" |
| 住所詳細 | `line1` | テキスト | ❌ | 例: "用賀 3-8-2" |
| 営業時間 | `hours` | テキスト | ❌ | 例: "9:00 - 20:00" |
| 定休日 | `holidays` | テキスト | ❌ | 例: "月曜" |
| 電話番号 | `phone` | テキスト | ❌ | 例: "03-5000-1234" |
| ウェブサイト | `website` | URL | ❌ | 公式サイトURL |
| Xアカウント | `x_account` | テキスト | ❌ | 例: "@cafe_hidamari" |
| Instagramアカウント | `instagram_account` | テキスト | ❌ | 例: "@cafe_hidamari" |
| 駐車場 | `parking` | 真偽値 | ✅ | 駐車場の有無 |
| 同伴可能エリア | `companion_area` | セレクト | ✅ | "店内OK" / "テラスのみ" |
| サイズ制限 | `size_limit` | セレクト | ✅ | "小型犬のみ" / "大型犬OK" |
| 犬用メニュー | `dog_menu` | セレクト | ✅ | "有り" / "無し" |
| サービス | `services` | テキスト | ❌ | 例: "お水サービス、ブランケット貸出" |
| 利用条件 | `conditions` | テキストエリア | ❌ | 利用時の条件や注意事項 |
| マナーウェア | `manners_wear` | セレクト | ❌ | "義務あり" / "義務なし" / "不明" |

#### 動物病院専用フィールド

| フィールド名 | フィールドキー | 型 | 必須 | 説明 |
|------------|--------------|----|----|----|
| 名前 | `name` | テキスト | ✅ | 施設名 |
| 説明 | `description` | テキストエリア | ✅ | 施設の説明文 |
| 画像URL | `image` | 画像/URL | ✅ | メイン画像のURL |
| 都道府県 | `prefecture` | テキスト | ✅ | 例: "神奈川県" |
| 市区町村 | `city` | テキスト | ✅ | 例: "横浜市" |
| 住所詳細 | `line1` | テキスト | ❌ | 例: "中区 3-2-8" |
| 営業時間 | `hours` | テキスト | ❌ | 例: "9:00 - 19:00" |
| 定休日 | `holidays` | テキスト | ❌ | 例: "年中無休" |
| 電話番号 | `phone` | テキスト | ❌ | 例: "045-222-3333" |
| ウェブサイト | `website` | URL | ❌ | 公式サイトURL |
| Xアカウント | `x_account` | テキスト | ❌ | 例: "@harbor_clinic" |
| Instagramアカウント | `instagram_account` | テキスト | ❌ | 例: "@harbor_clinic" |
| 時間外対応 | `after_hours` | セレクト | ❌ | "対応あり" / "対応なし" |
| ペットホテル | `pet_hotel` | 真偽値 | ✅ | ペットホテルの有無 |
| トリミング | `trimming` | 真偽値 | ✅ | トリミングサービスの有無 |
| 専門医/所属 | `specialists` | テキスト | ❌ | 例: "総合診療 / 画像診断 / 循環器" |
| 医療機器 | `equipment` | リピーター/配列 | ❌ | 例: ["CT", "内視鏡", "超音波エコー"] |
| 登録学会 | `associations` | リピーター/配列 | ❌ | 例: ["日本獣医画像診断学会"] |

#### 宿泊施設専用フィールド

| フィールド名 | フィールドキー | 型 | 必須 | 説明 |
|------------|--------------|----|----|----|
| 名前 | `name` | テキスト | ✅ | 施設名 |
| 説明 | `description` | テキストエリア | ✅ | 施設の説明文 |
| 画像URL | `image` | 画像/URL | ✅ | メイン画像のURL |
| 都道府県 | `prefecture` | テキスト | ✅ | 例: "長野県" |
| 市区町村 | `city` | テキスト | ✅ | 例: "軽井沢町" |
| 住所詳細 | `line1` | テキスト | ❌ | 住所の詳細 |
| 営業時間/案内 | `hours` | テキスト | ❌ | 例: "チェックイン 15:00 / チェックアウト 11:00" |
| 営業日 | `holidays` | テキスト | ❌ | 例: "不定休" |
| 電話番号 | `phone` | テキスト | ❌ | 例: "0267-00-2222" |
| ウェブサイト | `website` | URL | ❌ | 公式サイトURL |
| Xアカウント | `x_account` | テキスト | ❌ | 例: "@haku_dogstay" |
| Instagramアカウント | `instagram_account` | テキスト | ❌ | 例: "@haku_dogstay" |
| 駐車場 | `parking` | 真偽値 | ✅ | 駐車場の有無 |
| 宿泊可能サイズ | `allowed_size` | セレクト | ✅ | "小型犬のみ" / "大型犬OK" |
| ドッグラン有無 | `has_dog_run` | 真偽値 | ✅ | ドッグランの有無 |
| ドッグランタイプ | `dog_run_type` | セレクト | ❌ | "共有ドッグラン" / "部屋併設ドッグラン" |
| 同伴可能範囲 | `companion_range` | セレクト | ✅ | "客室内のみ" / "レストラン同伴可" / "ロビー歩行可" |
| ペット専用アメニティ | `amenities` | リピーター/配列 | ✅ | 例: ["トイレシーツ", "足拭きタオル", "食器"] |
| 1頭あたり追加料金 | `extra_fee_per_dog` | テキスト | ❌ | 例: "1頭 3,000円/泊" |
| 清掃代 | `extra_fee_cleaning` | テキスト | ❌ | 例: "大型犬は+1,000円" |
| 宿泊条件 | `conditions` | テキストエリア | ❌ | 宿泊時の条件や注意事項 |
| 周辺環境 | `environment` | テキスト | ❌ | 例: "森と小川に囲まれた静かな立地" |
| 近隣の動物病院 | `nearby_clinic` | テキスト | ❌ | 例: "軽井沢動物病院（車10分）" |

## WordPress REST API エンドポイント

Next.js側から以下のエンドポイントでデータを取得します：

```
GET /wp-json/wp/v2/dog_run
GET /wp-json/wp/v2/cafe
GET /wp-json/wp/v2/clinic
GET /wp-json/wp/v2/stay
```

### レスポンス形式の例

#### ドッグランのレスポンス例

```json
[
  {
    "id": 123,
    "slug": "dr-azukawa",
    "title": {
      "rendered": "あずかわ森のドッグラン"
    },
    "acf": {
      "name": "あずかわ森のドッグラン",
      "description": "木陰が気持ちいい森のドッグラン...",
      "image": "https://example.com/image.jpg",
      "prefecture": "東京都",
      "city": "昭島市",
      "line1": "昭和町 2-10",
      "hours": "9:00 - 18:00",
      "holidays": "火曜",
      "phone": "042-000-1234",
      "website": "https://example.com/azukawa-dogrun",
      "x_account": "@azukawa_dogrun",
      "instagram_account": "@azukawa_dogrun",
      "fee": "無料",
      "parking": true,
      "zone": "小型犬専用あり",
      "ground": "芝",
      "facility_water": "あり",
      "facility_foot_wash": "あり",
      "facility_agility": "あり",
      "facility_lights": "なし",
      "conditions": "一年以内の狂犬病・混合ワクチン接種証明の提示",
      "manners_wear": "不明"
    }
  }
]
```

#### カフェのレスポンス例

```json
[
  {
    "id": 456,
    "slug": "cafe-hinata",
    "title": {
      "rendered": "カフェ陽だまり"
    },
    "acf": {
      "name": "カフェ陽だまり",
      "description": "木の温もりが心地よいローカルカフェ...",
      "image": "https://example.com/cafe-image.jpg",
      "prefecture": "東京都",
      "city": "世田谷区",
      "line1": "用賀 3-8-2",
      "hours": "9:00 - 20:00",
      "holidays": "月曜",
      "phone": "03-5000-1234",
      "website": "https://example.com/hidamari",
      "x_account": "@cafe_hidamari",
      "instagram_account": "@cafe_hidamari",
      "parking": false,
      "companion_area": "店内OK",
      "size_limit": "大型犬OK",
      "dog_menu": "有り",
      "services": "お水サービス、ブランケット貸出",
      "conditions": "混雑時は2時間制。マナーウェア着用推奨。",
      "manners_wear": "不明"
    }
  }
]
```

#### 動物病院のレスポンス例

```json
[
  {
    "id": 789,
    "slug": "cl-harbor",
    "title": {
      "rendered": "ハーバー動物病院"
    },
    "acf": {
      "name": "ハーバー動物病院",
      "description": "夜間対応も行う総合動物病院...",
      "image": "https://example.com/clinic-image.jpg",
      "prefecture": "神奈川県",
      "city": "横浜市",
      "line1": "中区 3-2-8",
      "hours": "9:00 - 19:00",
      "holidays": "年中無休",
      "phone": "045-222-3333",
      "website": "https://example.com/harbor",
      "x_account": "@harbor_clinic",
      "instagram_account": "@harbor_clinic",
      "after_hours": "対応あり",
      "pet_hotel": true,
      "trimming": true,
      "specialists": "総合診療 / 画像診断 / 循環器",
      "equipment": ["CT", "内視鏡", "超音波エコー", "血液検査機器"],
      "associations": ["日本獣医画像診断学会", "日本獣医循環器学会"]
    }
  }
]
```

#### 宿泊施設のレスポンス例

```json
[
  {
    "id": 101,
    "slug": "stay-haku",
    "title": {
      "rendered": "泊まれる森 HAKU"
    },
    "acf": {
      "name": "泊まれる森 HAKU",
      "description": "森に囲まれた温泉付きオーベルジュ...",
      "image": "https://example.com/stay-image.jpg",
      "prefecture": "長野県",
      "city": "軽井沢町",
      "line1": null,
      "hours": "チェックイン 15:00 / チェックアウト 11:00",
      "holidays": "不定休",
      "phone": "0267-00-2222",
      "website": "https://example.com/haku",
      "x_account": "@haku_dogstay",
      "instagram_account": "@haku_dogstay",
      "parking": true,
      "allowed_size": "大型犬OK",
      "has_dog_run": true,
      "dog_run_type": "共有ドッグラン",
      "companion_range": "レストラン同伴可",
      "amenities": ["トイレシーツ", "足拭きタオル", "食器", "消臭剤", "ケージ/サークル貸出"],
      "extra_fee_per_dog": "1頭 3,000円/泊",
      "extra_fee_cleaning": "大型犬は+1,000円",
      "conditions": "ワクチン証明提出。館内はリード着用。",
      "environment": "森と小川に囲まれた静かな立地",
      "nearby_clinic": "軽井沢動物病院（車10分）"
    }
  }
]
```

## Next.js側での実装

### 1. APIルートの作成

`src/app/api/dog-runs/route.ts` などのAPIルートを作成し、WordPress REST APIからデータを取得して変換します。

### 2. データ変換関数

WordPressのレスポンスを、Next.js側の型定義に合わせて変換する関数を作成します。

### 3. キャッシュ設定

WordPress APIのレスポンスを適切にキャッシュして、パフォーマンスを最適化します。

## 推奨プラグイン

- **Advanced Custom Fields (ACF)** - カスタムフィールドの管理
- **Custom Post Type UI** - カスタム投稿タイプの作成
- **ACF to REST API** - ACFフィールドをREST APIに公開

## セキュリティ考慮事項

- WordPress REST APIへのアクセスを制限する（認証キーやIP制限）
- CORS設定を適切に行う
- 画像URLの検証を行う

## 次のステップ

1. WordPressにカスタム投稿タイプとカスタムフィールドを設定
2. REST APIでデータが正しく取得できるか確認
3. Next.js側でAPIルートを作成してデータを取得・変換
4. 既存のデータファイル（`src/data/*.ts`）をAPIから取得する形式に変更
