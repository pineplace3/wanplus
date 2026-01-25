# インポートスクリプト

このディレクトリには、サンプルデータをWordPressに一括登録するためのスクリプトが含まれています。

## ファイル一覧

- `import-dog-runs.php` - PHP版インポートスクリプト
- `import-dog-runs.js` - Node.js版インポートスクリプト
- `json-to-csv.js` - JSONをCSVに変換するスクリプト

## 使用方法

### PHP版インポートスクリプト

1. `import-dog-runs.php` を開いて、以下の設定を変更：
   ```php
   $wp_url = 'https://your-site.com';
   $username = 'admin';
   $app_password = 'xxxx xxxx xxxx xxxx';
   ```

2. WordPressのルートディレクトリに配置

3. ブラウザでアクセス、またはコマンドラインで実行：
   ```bash
   php import-dog-runs.php
   ```

### Node.js版インポートスクリプト

1. 必要なパッケージをインストール：
   ```bash
   npm install axios
   ```

2. `import-dog-runs.js` を開いて、以下の設定を変更：
   ```javascript
   const wpUrl = 'https://your-site.com';
   const username = 'admin';
   const appPassword = 'xxxx xxxx xxxx xxxx';
   ```

3. 実行：
   ```bash
   node import-dog-runs.js
   ```

### JSON to CSV変換スクリプト

1. 実行：
   ```bash
   node json-to-csv.js
   ```

2. `wordpress-sample-data/dog-runs-sample.csv` が生成されます

## 注意事項

- アプリケーションパスワードは、WordPress管理画面の「ユーザー」→「プロフィール」→「アプリケーションパスワード」で作成できます
- スクリプトを実行する前に、WordPressのURL、ユーザー名、アプリケーションパスワードを正しく設定してください
- 本番環境で実行する前に、テスト環境で動作確認することを推奨します
