# Cursor から WordPress へドッグラン・記事を登録する

Cursor 上でスクリプトを実行し、WordPress のドッグラン（カスタム投稿）や通常の記事を登録できます。

**MCP で接続する**: Cursor の MCP から「ツール」として登録したい場合は [wordpress-mcp-connection.md](wordpress-mcp-connection.md) を参照してください。

## 前提条件

- WordPress 側で **アプリケーションパスワード** を発行する
- カスタム投稿タイプ `dog_run` が REST API で作成可能になっている（`show_in_rest` が true）
- ACF のカスタムフィールドが REST API で読み書き可能（「ACF to REST API」などで `acf` が送受信できること）

---

## 1. WordPress でアプリケーションパスワードを発行する

1. WordPress 管理画面にログインする  
   （例: `https://wanplus-admin.com/wp-admin`）
2. **ユーザー** → **プロフィール** を開く
3. 下へスクロールし、**「アプリケーションパスワード」** の欄を探す  
   （表示されない場合は、[この手順](https://ja.wordpress.org/support/article/application-passwords/) で「アプリケーションパスワード」を有効化する）
4. **新しいアプリケーションパスワード名** に任意の名前を入力（例: `Cursor登録用`）
5. **「新しいアプリケーションパスワードを追加」** をクリック
6. 表示された **パスワードを1回だけコピー** して安全な場所に保存する  
   （このパスワードは再度表示されません）

この「ユーザー名」と「アプリケーションパスワード」を、次のステップで環境変数に設定します。

---

## 2. プロジェクトで環境変数を設定する

スクリプトは次の環境変数を使います。**リポジトリにコミットしないでください。**

### 方法A: ターミナルでその都度指定（テスト向け）

```bash
set WORDPRESS_URL=https://wanplus-admin.com
set WORDPRESS_USER=あなたのWPユーザー名
set WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
node scripts/wordpress-register.js dog_run scripts/sample-dogrun.json
```

（Mac/Linux の場合は `set` の代わりに `export` を使います。）

### 方法B: `.env.local` に書く（推奨）

プロジェクト直下に `.env.local` を作成し、以下を記述します。  
**.gitignore に `.env.local` が含まれていることを確認してください。**

```env
WORDPRESS_URL=https://wanplus-admin.com
WORDPRESS_USER=あなたのWPユーザー名
WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

スクリプトは Node の `process.env` を読むだけなので、実行時に次のように読み込めます。

- **Windows (PowerShell):**  
  ```powershell
  Get-Content .env.local | ForEach-Object { if ($_ -match '^([^#][^=]+)=(.*)$') { [Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), 'Process') } }; node scripts/wordpress-register.js dog_run scripts/sample-dogrun.json
  ```
- または **dotenv** をスクリプト内で使う（後述のスクリプトでは `dotenv` をオプションで読み込む想定です）。

簡単にするため、スクリプト内で `dotenv` を使って `.env.local` を読むようにしてもよいです。その場合は `npm install dotenv` を実行し、スクリプト先頭で `require('dotenv').config({ path: '.env.local' })` を呼びます。

---

## 3. スクリプトの使い方（Cursor のターミナルで実行）

### ドッグランを1件登録する

登録したい内容を JSON で用意し、次のように実行します。

```bash
node scripts/wordpress-register.js dog_run scripts/sample-dogrun.json
```

- 先頭の `dog_run` は「ドッグラン（カスタム投稿）」を登録する指定です。
- 最後の引数は、ドッグラン1件分のデータが入った JSON ファイルのパスです。
- サンプルは `scripts/sample-dogrun.json` を編集して使えます。

### 下書きとして登録する

環境変数で `WORDPRESS_STATUS=draft` を指定するか、スクリプトが対応していれば「下書き」で投稿できます。スクリプトのオプションで `--draft` を付ける実装にすることもできます。

### 通常の記事（ブログ記事）を1件登録する

```bash
node scripts/wordpress-register.js post scripts/sample-post.json
```

- `post` は通常の「投稿」を登録する指定です。
- `scripts/sample-post.json` には、`title` と `content`（本文）などを入れます。

---

## 4. JSON の形式

### ドッグラン用（`dog_run`）

`WORDPRESS_INTEGRATION.md` の「ドッグラン専用フィールド」および  
`wordpress-sample-data/dog-runs-sample.json` の1件分の形式に合わせます。

- 施設名は必須。タイトルとしても使われます。
- ACF のフィールド名は **スネークケース**（例: `x_account`, `facility_water`）で送ります。
- 例: `scripts/sample-dogrun.json`

### 記事用（`post`）

- `title`: タイトル（必須）
- `content`: 本文（HTML 可）
- `status`: `"publish"` または `"draft"`（省略時はスクリプトの既定値）
- `excerpt`: 抜粋（任意）

---

## 5. エラーが出たとき

- **401 Unauthorized**  
  - ユーザー名またはアプリケーションパスワードが違う  
  - アプリケーションパスワードが無効になっていないか確認
- **403 Forbidden**  
  - このユーザーに「投稿の作成」権限がない  
  - カスタム投稿タイプ `dog_run` の作成権限が付与されているか確認
- **404**  
  - `WORDPRESS_URL` が誤っている、または `dog_run` の REST ルートが有効でない  
  - パーマリンク設定を「投稿名」などにし、管理画面で「設定」→「パーマリンク」を「変更を保存」し直すと直ることがあります
- **ACF が保存されない**  
  - 「ACF to REST API」などで REST に ACF が露出しているか確認  
  - 送っている JSON のキー名が ACF のフィールド名（スネークケース）と一致しているか確認

---

## まとめ

| やりたいこと           | コマンド例 |
|------------------------|------------|
| ドッグラン1件登録      | `node scripts/wordpress-register.js dog_run scripts/sample-dogrun.json` |
| 記事1件登録            | `node scripts/wordpress-register.js post scripts/sample-post.json`     |

Cursor のターミナルで、上記のように環境変数を設定したうえでコマンドを実行すると、WordPress にドッグラン情報や記事を登録できます。
