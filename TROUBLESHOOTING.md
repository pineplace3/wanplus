# WordPress API接続トラブルシューティングガイド

## 問題: ドッグラン情報が表示されない

Vercelで公開したサイトで、WordPress APIから取得したドッグラン情報が表示されない場合の対処法です。

## 確認手順

### 1. Vercelのログを確認

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. 「Logs」タブをクリック
4. エラーメッセージを確認

### 2. WordPress APIの動作確認

ブラウザで以下のURLにアクセスして、APIが正常に動作しているか確認：

```
https://wanplus-admin.com/wp-json/wp/v2/dog_run
```

正常な場合、JSON形式でデータが表示されます。

### 3. よくある原因と対処法

#### 原因1: CORS（Cross-Origin Resource Sharing）エラー

**症状**: ブラウザのコンソールにCORSエラーが表示される

**対処法**: WordPress側でCORSを許可する必要があります。

WordPressの `functions.php` またはプラグインに以下を追加：

```php
// CORSヘッダーを追加
function add_cors_headers() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}
add_action('init', 'add_cors_headers');
```

または、`.htaccess` ファイルに追加：

```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type"
</IfModule>
```

#### 原因2: WordPress REST APIが無効化されている

**対処法**: WordPressの設定でREST APIが有効になっているか確認

1. WordPress管理画面にログイン
2. 「設定」→「パーマリンク設定」を開く
3. 「変更を保存」をクリック（これでREST APIが有効化されます）

#### 原因3: カスタム投稿タイプがREST APIに登録されていない

**対処法**: Custom Post Type UIプラグインで、REST APIを有効化

1. WordPress管理画面で「CPT UI」→「投稿タイプを追加/編集」を開く
2. 「dog_run」を編集
3. 「REST API」セクションで「True」を選択
4. 「REST APIベーススラッグ」に `dog_run` を入力
5. 保存

#### 原因4: ACFフィールドがREST APIに公開されていない

**対処法**: 「ACF to REST API」プラグインがインストール・有効化されているか確認

1. WordPress管理画面で「プラグイン」を開く
2. 「ACF to REST API」がインストールされているか確認
3. インストールされていない場合は、インストールして有効化

#### 原因5: SSL証明書の問題

**症状**: HTTPSでアクセスできない、または証明書エラー

**対処法**: WordPressサイトのSSL証明書が正しく設定されているか確認

### 4. デバッグ方法

#### ブラウザの開発者ツールで確認

1. 公開サイトを開く
2. F12キーで開発者ツールを開く
3. 「Console」タブでエラーメッセージを確認
4. 「Network」タブで、WordPress APIへのリクエストを確認

#### サーバーサイドのログを確認

Vercelのログで以下のようなメッセージを確認：

- `Fetching from WordPress API: ...`
- `WordPress API response status: ...`
- `Error fetching dog runs from WordPress: ...`

### 5. 一時的な対処法（フォールバックデータ）

WordPress APIが利用できない場合、一時的にローカルのサンプルデータを表示する方法：

`src/lib/wordpress.ts` の `fetchDogRuns` 関数を以下のように変更：

```typescript
export async function fetchDogRuns(): Promise<DogRun[]> {
  try {
    // ... 既存のコード ...
  } catch (error) {
    console.error("Error fetching dog runs from WordPress:", error);
    // フォールバック: ローカルのサンプルデータを返す
    return getFallbackDogRuns();
  }
}

function getFallbackDogRuns(): DogRun[] {
  // サンプルデータを返す
  return [
    // ... サンプルデータ ...
  ];
}
```

### 6. 環境変数の設定（必要に応じて）

WordPress APIのURLを環境変数として設定する場合：

1. Vercelダッシュボードでプロジェクトを開く
2. 「Settings」→「Environment Variables」を開く
3. 以下の変数を追加：
   - `NEXT_PUBLIC_WORDPRESS_API_URL` = `https://wanplus-admin.com/wp-json/wp/v2`

`src/lib/wordpress.ts` を以下のように変更：

```typescript
const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "https://wanplus-admin.com/wp-json/wp/v2";
```

## 次のステップ

1. 上記の確認手順を実行
2. Vercelのログでエラーメッセージを確認
3. WordPress側の設定を確認・修正
4. 修正後、Vercelで再デプロイ

問題が解決しない場合は、Vercelのログに表示されているエラーメッセージを共有してください。
