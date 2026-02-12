# WordPress を MCP で接続する

MCP（Model Context Protocol）を使うと、Cursor などの AI クライアントから WordPress に「ツール」としてアクセスできます。主に次の2通りがあります。

---

## 方法1: 公式リモート接続（WordPress 側に MCP を入れる）

WordPress サイト側に **MCP アダプター** を導入し、Cursor から HTTP でそのサイトに接続する方法です。

### WordPress 側の準備

1. **WordPress Abilities API と MCP Adapter を導入**
   - 公式: [WordPress/mcp-adapter](https://github.com/WordPress/mcp-adapter)
   - Composer でインストール:  
     `composer require wordpress/abilities-api wordpress/mcp-adapter`
   - またはプラグインとして [Releases](https://github.com/WordPress/mcp-adapter/releases) からインストール

2. **アビリティの公開**
   - 投稿の取得・作成などは、アビリティとして登録すると MCP の「ツール」になります。
   - ドッグラン（カスタム投稿）用の作成・一覧などは、PHP でカスタムアビリティを登録する必要があります。

### Cursor 側の設定

[Automattic の MCP リモートクライアント](https://www.npmjs.com/package/@automattic/mcp-wordpress-remote) を使い、Cursor の MCP 設定に追加します。

1. **Cursor** → **Settings** → **MCP** で「Add new MCP server」を開く  
   またはプロジェクト／ユーザー設定の MCP 設定ファイルを編集する。

2. 次のように追加（`WP_API_URL` はあなたの WordPress の MCP エンドポイントに変更）:

```json
{
  "mcpServers": {
    "wordpress": {
      "command": "npx",
      "args": ["-y", "@automattic/mcp-wordpress-remote"],
      "env": {
        "WP_API_URL": "https://wanplus-admin.com/wp-json/mcp/mcp-adapter-default-server",
        "WP_API_USERNAME": "あなたのWPユーザー名",
        "WP_API_PASSWORD": "アプリケーションパスワード"
      }
    }
  }
}
```

- **注意**: `WP_API_URL` は、mcp-adapter を有効にしたときにできる MCP 用 REST の URL にしてください（上記はデフォルトサーバーの例）。
- Node.js 22 以上が必要な場合があります。

この方法では、WordPress 側で用意したアビリティ（ツール・リソース・プロンプト）だけが Cursor から使えます。ドッグラン登録をしたい場合は、WordPress 側で「ドッグラン作成」用のアビリティを PHP で追加する必要があります。

---

## 方法2: このプロジェクトの「WordPress MCP サーバー」を使う（おすすめ）

WordPress に **MCP 用プラグインを入れず**、このリポジトリに含まれる **簡易 MCP サーバー** が WordPress REST API を叩く方法です。

- 既存の **REST API ＋ アプリケーションパスワード** のまま使える
- **ドッグラン登録** と **記事登録** を Cursor の MCP ツールから実行できる

### 準備

1. **依存関係のインストール**（プロジェクト直下で）:
   ```bash
   npm install @modelcontextprotocol/sdk zod
   ```

2. **`.env.local` に WordPress 認証を書く**（既に登録スクリプト用で用意していればそのまま）:
   ```env
   WORDPRESS_URL=https://wanplus-admin.com
   WORDPRESS_USER=あなたのWPユーザー名
   WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
   ```

### Cursor の MCP に追加する

1. **Cursor** → **Settings** → **MCP** を開く。
2. **「Add new MCP server」** で新規サーバーを追加する。
3. サーバー名は任意（例: `wanplus-wordpress`）。
4. 設定は次のどちらかで。

**A. 設定画面で「Command」を選ぶ場合**

- **Command**: `node`
- **Args**:  
  `scripts/mcp-server-wordpress.mjs` の **絶対パス** を指定  
  （例: `C:\Users\willi\my-nextjs-app\scripts\mcp-server-wordpress.mjs`）
- **Env**（任意）:  
  - `WORDPRESS_URL`, `WORDPRESS_USER`, `WORDPRESS_APP_PASSWORD` を設定してもよい  
  - 未設定の場合は、スクリプトがプロジェクト直下の `.env.local` を読みにいきます（スクリプトの実行時のカレントディレクトリがプロジェクト直下である必要があります）。

**B. 設定ファイルを直接編集する場合**

MCP の設定ファイル（例: `%USERPROFILE%\.cursor\mcp.json` やプロジェクトの `.cursor/mcp.json`）に次を追加:

```json
{
  "mcpServers": {
    "wanplus-wordpress": {
      "command": "node",
      "args": ["C:\\Users\\willi\\my-nextjs-app\\scripts\\mcp-server-wordpress.mjs"],
      "cwd": "C:\\Users\\willi\\my-nextjs-app",
      "env": {
        "WORDPRESS_URL": "https://wanplus-admin.com",
        "WORDPRESS_USER": "あなたのWPユーザー名",
        "WORDPRESS_APP_PASSWORD": "アプリケーションパスワード"
      }
    }
  }
}
```

- `cwd` をプロジェクト直下にしておくと、`.env.local` が読みやすくなります。
- パスはご自身の環境に合わせて変更してください。

### 使えるツール（方法2）

| ツール名 | 説明 |
|----------|------|
| `create_dog_run` | ドッグランを1件作成（ACF フィールドを JSON で渡す） |
| `create_cafe` | カフェを1件作成（ACF フィールドを JSON で渡す） |
| `create_clinic` | 動物病院を1件作成（ACF フィールドを JSON で渡す） |
| `create_stay` | 宿泊施設を1件作成（ACF フィールドを JSON で渡す） |
| `create_post` | 通常の記事を1件作成（タイトル・本文など） |
| `list_dog_runs` | ドッグラン一覧を取得（件数指定可） |

Cursor のチャットで「ドッグランを登録して」「記事を投稿して」などと依頼すると、これらのツールが呼ばれ、WordPress に登録されます。

---

## まとめ

| 方法 | WordPress 側 | できること |
|------|--------------|------------|
| **方法1** 公式 MCP | mcp-adapter + Abilities API を導入 | WordPress が公開するアビリティ（投稿取得など）。ドッグランはアビリティを自作すれば可能 |
| **方法2** このプロジェクトの MCP | 変更不要（REST API のまま） | ドッグラン作成・記事作成・ドッグラン一覧（すぐ使える） |

「Cursor から MCP で WordPress にドッグランや記事を登録したいだけ」であれば、**方法2** が手軽です。  
WordPress をそのまま「MCP サーバー」として公開したい場合は **方法1** を検討してください。
