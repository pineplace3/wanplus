# サイト公開ガイド

このガイドでは、Next.jsサイトを公開する方法を説明します。

## 公開前の準備

### 1. ビルドの確認

まず、ローカルでビルドが成功することを確認してください：

```bash
npm run build
```

ビルドが成功したら、以下を確認：
- エラーがないこと
- 警告があれば確認すること

### 2. 本番環境での動作確認

ビルド後、ローカルで本番モードで起動して確認：

```bash
npm run build
npm run start
```

`http://localhost:3000` で動作を確認してください。

---

## 公開方法

### 方法1: Vercel（推奨・最も簡単）

VercelはNext.jsの開発元が提供するホスティングサービスで、最も簡単に公開できます。

#### 手順

1. **Vercelアカウントの作成**
   - https://vercel.com にアクセス
   - GitHubアカウントでサインアップ（推奨）

2. **プロジェクトのインポート**
   - Vercelダッシュボードで「Add New Project」をクリック
   - GitHubリポジトリを選択、または手動でアップロード
   - プロジェクトをインポート

3. **設定**
   - Framework Preset: Next.js（自動検出される）
   - Root Directory: `./`（そのまま）
   - Build Command: `npm run build`（デフォルト）
   - Output Directory: `.next`（デフォルト）
   - Install Command: `npm install`（デフォルト）

4. **環境変数（必要に応じて）**
   - 現在はWordPress APIのURLがハードコードされていますが、
     将来的に環境変数化する場合はここで設定

5. **デプロイ**
   - 「Deploy」ボタンをクリック
   - 数分でデプロイが完了
   - 自動的にURLが発行されます（例: `your-project.vercel.app`）

#### カスタムドメインの設定

1. Vercelダッシュボードでプロジェクトを開く
2. 「Settings」→「Domains」を選択
3. ドメインを追加してDNS設定を行う

#### メリット
- ✅ 無料プランあり
- ✅ 自動デプロイ（GitHub連携時）
- ✅ 高速なCDN
- ✅ SSL証明書が自動で設定される
- ✅ Next.jsに最適化されている

---

### 方法2: Netlify

Netlifyも人気のホスティングサービスです。

#### 手順

1. **Netlifyアカウントの作成**
   - https://www.netlify.com にアクセス
   - サインアップ

2. **プロジェクトのデプロイ**
   - 「Add new site」→「Import an existing project」
   - GitHubリポジトリを選択、または手動でアップロード

3. **ビルド設定**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - 注意: Next.jsの場合は、Netlify用の設定が必要な場合があります

4. **デプロイ**
   - 「Deploy site」をクリック

#### Netlify用の設定ファイル作成

`netlify.toml` を作成：

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

### 方法3: その他のホスティングサービス

#### AWS Amplify
- AWSアカウントが必要
- GitHub連携で自動デプロイ可能

#### Azure Static Web Apps
- Azureアカウントが必要
- GitHub連携で自動デプロイ可能

#### 自前のサーバー（VPS/専用サーバー）

1. **サーバーの準備**
   - Node.js 18以上をインストール
   - PM2などのプロセスマネージャーをインストール

2. **デプロイ手順**
   ```bash
   # サーバーにSSH接続
   git clone <your-repository>
   cd my-nextjs-app
   npm install
   npm run build
   npm run start
   ```

3. **PM2で常時起動**
   ```bash
   npm install -g pm2
   pm2 start npm --name "wanplus" -- start
   pm2 save
   pm2 startup
   ```

4. **Nginxでリバースプロキシ設定**
   - Nginxをインストール
   - 設定ファイルでポート3000にプロキシ

---

## 公開前のチェックリスト

### 必須項目

- [ ] `npm run build` が成功する
- [ ] `npm run start` で正常に動作する
- [ ] WordPress APIが正しく動作する
- [ ] 画像が正しく表示される
- [ ] すべてのページが正常に表示される
- [ ] モバイル表示が正常である

### 推奨項目

- [ ] カスタムドメインの設定
- [ ] Google Analyticsなどの分析ツールの設定
- [ ] サイトマップの生成（`next-sitemap`など）
- [ ] robots.txtの設定
- [ ] メタタグの最適化（SEO）
- [ ] パフォーマンスの最適化

---

## トラブルシューティング

### ビルドエラーが発生する場合

1. **依存関係の確認**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScriptエラーの確認**
   ```bash
   npm run lint
   ```

3. **環境変数の確認**
   - 本番環境で必要な環境変数が設定されているか確認

### WordPress APIに接続できない場合

1. **CORS設定の確認**
   - WordPress側でCORSが許可されているか確認
   - `wanplus-admin.com` からのアクセスが許可されているか確認

2. **API URLの確認**
   - 本番環境でも正しいURLが使用されているか確認

3. **SSL証明書の確認**
   - WordPress APIがHTTPSで提供されているか確認

---

## 継続的なデプロイ（CI/CD）

### GitHub Actionsを使用する場合

`.github/workflows/deploy.yml` を作成：

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      # VercelやNetlifyの場合は、それぞれのアクションを使用
```

---

## パフォーマンス最適化

### 画像の最適化

- Next.jsのImageコンポーネントを使用（既に実装済み）
- 画像のサイズを最適化

### キャッシュ設定

- WordPress APIのレスポンスをキャッシュ（既に実装済み：1時間）
- 必要に応じてISR（Incremental Static Regeneration）を検討

---

## セキュリティ

### 推奨事項

1. **環境変数の管理**
   - 機密情報は環境変数として管理
   - Vercel/Netlifyの環境変数設定を使用

2. **HTTPSの使用**
   - すべてのホスティングサービスで自動的にHTTPSが有効化されます

3. **WordPress APIの保護**
   - 必要に応じてAPIキーや認証を追加

---

## 次のステップ

1. サイトを公開
2. Google Search Consoleに登録
3. パフォーマンスを監視
4. ユーザーフィードバックを収集
5. 継続的な改善
