# スクリプト

## MCP サーバー（Cursor から WordPress にツールでアクセス）

WordPress にプラグインを入れず、このリポジトリの MCP サーバーで「ドッグラン登録」「記事登録」「ドッグラン一覧」を Cursor のツールとして使えます。

- スクリプト: `scripts/mcp-server-wordpress.mjs`
- 設定手順: [wordpress-setup-guide/wordpress-mcp-connection.md](../wordpress-setup-guide/wordpress-mcp-connection.md) の「方法2」を参照
- Cursor → Settings → MCP で、`node` コマンドと `scripts/mcp-server-wordpress.mjs` のパスを指定して追加

---

## ACFフィールドグループのインポート

カフェ、動物病院、宿泊施設のACFフィールドグループをWordPressにインポートします。

```bash
# インポート方法を表示
node scripts/import-acf-field-groups.js cafe
node scripts/import-acf-field-groups.js clinic
node scripts/import-acf-field-groups.js stay
node scripts/import-acf-field-groups.js all
```

詳しくは [wordpress-setup-guide/data-collection-guide.md](../wordpress-setup-guide/data-collection-guide.md) を参照してください。

---

## データ収集と自動登録（Google Places API）

Google Places APIを使用して、カフェ・動物病院・宿泊施設の情報を自動収集し、WordPressに登録します。

### 準備

`.env.local` に Google Places API キーを追加:

```env
GOOGLE_PLACES_API_KEY=your_api_key_here
```

### 実行

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

詳しくは [wordpress-setup-guide/data-collection-guide.md](../wordpress-setup-guide/data-collection-guide.md) を参照してください。

---

## WordPress へドッグラン・記事を登録する（CLI）

Cursor のターミナルから、WordPress にドッグラン情報や記事を登録できます。

### 準備

1. WordPress でアプリケーションパスワードを発行する（ユーザー → プロフィール）
2. プロジェクト直下に `.env.local` を作成し、次を記入する（**コミットしないこと**）:

```env
WORDPRESS_URL=https://wanplus-admin.com
WORDPRESS_USER=あなたのWPユーザー名
WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

詳しくは [wordpress-setup-guide/register-from-cursor.md](../wordpress-setup-guide/register-from-cursor.md) を参照してください。

### 実行例

```bash
# ドッグランを1件登録（公開）
node scripts/wordpress-register.js dog_run scripts/sample-dogrun.json

# ドッグランを下書きで登録
node scripts/wordpress-register.js dog_run scripts/sample-dogrun.json --draft

# 記事を1件登録
node scripts/wordpress-register.js post scripts/sample-post.json
```

- ドッグラン用データ: `scripts/sample-dogrun.json` を編集してから実行
- カフェ用データ: `scripts/sample-cafe.json` を編集してから実行（`scripts/sample-dogrun.json` を参考に作成）
- 動物病院用データ: `scripts/sample-clinic.json` を編集してから実行
- 宿泊施設用データ: `scripts/sample-stay.json` を編集してから実行
- 記事用データ: `scripts/sample-post.json` を編集してから実行

### カフェ・動物病院・宿泊施設を登録する

```bash
# カフェを1件登録
node scripts/wordpress-register.js cafe scripts/sample-cafe.json

# 動物病院を1件登録
node scripts/wordpress-register.js clinic scripts/sample-clinic.json

# 宿泊施設を1件登録
node scripts/wordpress-register.js stay scripts/sample-stay.json
```

**注意**: `wordpress-register.js` は `dog_run`, `cafe`, `clinic`, `stay`, `post` に対応しています。
