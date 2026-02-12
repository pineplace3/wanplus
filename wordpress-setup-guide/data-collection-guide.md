# カフェ・動物病院・宿泊施設のデータ収集と登録ガイド

このガイドでは、カフェ、動物病院、宿泊施設の情報を自動的に収集してWordPressに登録する方法を説明します。

---

## 1. ACFフィールドグループの作成

まず、各カテゴリのACFフィールドグループをWordPressに作成します。

### 方法A: WordPress管理画面から手動インポート（推奨）

1. WordPress管理画面にログイン
2. **「カスタムフィールド」** → **「ツール」** → **「インポート」** を開く
3. 以下のJSONファイルを選択してインポート:
   - `wordpress-setup-guide/acf-field-groups/cafe-field-group.json` （カフェ用）
   - `wordpress-setup-guide/acf-field-groups/clinic-field-group.json` （動物病院用）
   - `wordpress-setup-guide/acf-field-groups/stay-field-group.json` （宿泊施設用）

### 方法B: PHPスクリプトで自動インポート

1. `wordpress-setup-guide/import-acf-field-groups.php` をWordPressのルートディレクトリにコピー
2. ブラウザで `https://your-site.com/import-acf-field-groups.php` にアクセス
3. または、WP-CLIで実行:
   ```bash
   wp eval-file import-acf-field-groups.php
   ```

### 方法C: acf-jsonディレクトリにコピー（自動同期）

1. WordPressのテーマディレクトリ（例: `wp-content/themes/your-theme/`）に `acf-json` フォルダを作成
2. `wordpress-setup-guide/acf-field-groups/` 内のJSONファイルを `acf-json` フォルダにコピー
3. ACFが自動的にフィールドグループを同期します

---

## 2. カスタム投稿タイプの作成

カフェ、動物病院、宿泊施設用のカスタム投稿タイプを作成します。

### Custom Post Type UIプラグインを使用する場合

1. WordPress管理画面 → **「CPT UI」** → **「Add/Edit Post Types」**
2. 以下の設定で3つのカスタム投稿タイプを作成:

#### カフェ (`cafe`)
- Post Type Slug: `cafe`
- Plural Label: `カフェ`
- Singular Label: `カフェ`
- ✅ Show in REST API: **必ずチェック**

#### 動物病院 (`clinic`)
- Post Type Slug: `clinic`
- Plural Label: `動物病院`
- Singular Label: `動物病院`
- ✅ Show in REST API: **必ずチェック**

#### 宿泊施設 (`stay`)
- Post Type Slug: `stay`
- Plural Label: `宿泊施設`
- Singular Label: `宿泊施設`
- ✅ Show in REST API: **必ずチェック**

---

## 3. データ収集と登録

### Google Places APIを使用する方法（推奨）

#### 準備

1. **Google Cloud Console** でプロジェクトを作成
2. **Places API** を有効化
3. APIキーを取得
4. `.env.local` に追加:
   ```env
   GOOGLE_PLACES_API_KEY=your_api_key_here
   ```

#### 実行

```bash
# カフェ情報を収集・登録（5件）
node scripts/collect-and-register-data.js cafe --query="犬連れカフェ 東京" --count=5

# 動物病院情報を収集・登録（5件）
node scripts/collect-and-register-data.js clinic --query="動物病院 横浜" --count=5

# 宿泊施設情報を収集・登録（3件）
node scripts/collect-and-register-data.js stay --query="ペット可 宿泊 軽井沢" --count=3

# 実際には登録せず、収集したデータを確認（dry-run）
node scripts/collect-and-register-data.js cafe --query="犬連れカフェ 東京" --count=5 --dry-run
```

#### 注意事項

- Google Places APIは有料です（月200ドル分の無料クレジットあり）
- API制限を避けるため、リクエスト間に1秒の待機時間を設けています
- 収集したデータは**下書き**として登録されます。WordPress管理画面で確認・編集してから公開してください
- Google Places APIから取得できない情報（例: 犬用メニューの有無、同伴可能エリアなど）はデフォルト値が設定されます。手動で編集が必要です

---

### 手動でデータを収集・登録する方法

Google Places APIを使わない場合、手動でデータを収集して登録できます。

#### ステップ1: サンプルJSONファイルを編集

1. `scripts/sample-cafe.json`、`scripts/sample-clinic.json`、`scripts/sample-stay.json` をコピー
2. 収集した情報を入力
3. 保存

#### ステップ2: WordPressに登録

```bash
# カフェを登録
node scripts/wordpress-register.js cafe scripts/your-cafe-data.json

# 動物病院を登録
node scripts/wordpress-register.js clinic scripts/your-clinic-data.json

# 宿泊施設を登録
node scripts/wordpress-register.js stay scripts/your-stay-data.json
```

---

## 4. データソースの候補

### カフェ
- Google Mapsで「犬連れカフェ」「ペット可 カフェ」などで検索
- 食べログ、ホットペッパーグルメなどのレビューサイト
- Instagramのハッシュタグ検索（例: #犬連れカフェ）

### 動物病院
- Google Mapsで「動物病院」で検索
- 各都道府県の獣医師会のウェブサイト
- ペット保険会社の病院検索サイト

### 宿泊施設
- Google Mapsで「ペット可 宿泊」「犬 宿泊」などで検索
- 楽天トラベル、じゃらんなどの宿泊予約サイト
- ペット可宿泊施設の専門サイト

---

## 5. データの品質向上

収集したデータは、以下の点を確認・編集してください:

- **必須フィールド**: name, description, prefecture, city が正しく入力されているか
- **画像**: 適切な画像URLが設定されているか（Google Places APIの画像は一時的なURLの可能性あり）
- **カテゴリ固有の情報**: 
  - カフェ: 同伴可能エリア、犬用メニューの有無
  - 動物病院: 時間外対応、ペットホテル、トリミングの有無
  - 宿泊施設: ドッグランの有無、同伴可能範囲、アメニティ
- **連絡先情報**: 電話番号、ウェブサイト、SNSアカウントが最新か

---

## トラブルシューティング

### ACFフィールドが表示されない
- カスタム投稿タイプが正しく作成されているか確認
- ACFフィールドグループの「位置設定」で、正しい投稿タイプが選択されているか確認
- 「ACF to REST API」プラグインが有効化されているか確認

### WordPress REST APIでデータが取得できない
- カスタム投稿タイプの「Show in REST API」が有効になっているか確認
- `.env.local` の `WORDPRESS_URL`、`WORDPRESS_USER`、`WORDPRESS_APP_PASSWORD` が正しいか確認

### Google Places APIエラー
- APIキーが正しく設定されているか確認
- Places APIが有効化されているか確認
- APIの使用制限に達していないか確認

---

## まとめ

1. ✅ ACFフィールドグループをインポート
2. ✅ カスタム投稿タイプ（cafe, clinic, stay）を作成
3. ✅ Google Places APIキーを設定（オプション）
4. ✅ データ収集スクリプトを実行
5. ✅ WordPress管理画面で下書きを確認・編集
6. ✅ 公開

これで、カフェ、動物病院、宿泊施設の情報を効率的に収集・登録できます。
