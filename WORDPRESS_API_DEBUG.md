# WordPress API接続確認手順

## 1. WordPress APIの直接確認

ブラウザで以下のURLにアクセスして、APIが正常に動作しているか確認してください：

```
https://wanplus-admin.com/wp-json/wp/v2/dog_run
```

### 期待される結果

正常な場合、以下のようなJSON形式のデータが表示されます：

```json
[
  {
    "id": 1,
    "slug": "dr-hokuto",
    "title": {
      "rendered": "ドッグラン名"
    },
    "acf": {
      "name": "ドッグラン名",
      "description": "説明",
      ...
    }
  }
]
```

### エラーの場合

- **404 Not Found**: カスタム投稿タイプがREST APIに登録されていない
- **空の配列 []**: データが登録されていない、またはACFフィールドが公開されていない
- **CORSエラー**: CORS設定が正しく動作していない

## 2. カスタム投稿タイプのREST API設定確認

### Custom Post Type UIでの設定

1. WordPress管理画面にログイン
2. 「CPT UI」→「投稿タイプを追加/編集」を開く
3. 「dog_run」を選択して編集
4. 以下の設定を確認：
   - **REST API**: `True` に設定されているか
   - **REST APIベーススラッグ**: `dog_run` が入力されているか
5. 「保存」をクリック

### コードで確認する場合

WordPressの `functions.php` に以下が含まれているか確認：

```php
register_post_type('dog_run', array(
    'public' => true,
    'show_in_rest' => true,  // これが重要
    'rest_base' => 'dog_run',
    // ... その他の設定
));
```

## 3. ACF to REST APIプラグインの確認

1. WordPress管理画面で「プラグイン」を開く
2. 「ACF to REST API」がインストール・有効化されているか確認
3. 有効化されていない場合は、インストールして有効化

### ACFフィールドグループの設定確認

1. WordPress管理画面で「カスタムフィールド」→「フィールドグループ」を開く
2. ドッグラン用のフィールドグループを編集
3. 「設定」タブを開く
4. 「REST API」セクションで「REST APIに公開」が有効になっているか確認

## 4. パーマリンク設定の確認

1. WordPress管理画面で「設定」→「パーマリンク設定」を開く
2. 設定を確認（「投稿名」が推奨）
3. 「変更を保存」をクリック（これでREST APIが有効化されます）

## 5. Vercelのログ確認

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. 「Logs」タブを開く
4. 以下のようなメッセージを確認：
   - `Fetching from WordPress API: https://wanplus-admin.com/wp-json/wp/v2/dog_run?per_page=100`
   - `WordPress API response status: 200`（正常な場合）
   - `WordPress API response status: 404`（エラーの場合）
   - `Error fetching dog runs from WordPress: ...`（エラーの詳細）

## 6. テスト用の簡単な確認方法

WordPressのREST APIが正しく動作しているか、以下のURLで確認できます：

### 基本のREST APIエンドポイント
```
https://wanplus-admin.com/wp-json/wp/v2
```

### カスタム投稿タイプのエンドポイント
```
https://wanplus-admin.com/wp-json/wp/v2/dog_run
```

### 特定の投稿を取得
```
https://wanplus-admin.com/wp-json/wp/v2/dog_run/1
```

## 7. よくある問題と解決法

### 問題1: REST APIが404を返す

**原因**: カスタム投稿タイプがREST APIに登録されていない

**解決法**: Custom Post Type UIで「REST API」を `True` に設定

### 問題2: データは返るがACFフィールドが空

**原因**: ACF to REST APIプラグインが有効化されていない、またはフィールドグループがREST APIに公開されていない

**解決法**: 
- ACF to REST APIプラグインをインストール・有効化
- フィールドグループの設定で「REST APIに公開」を有効化

### 問題3: CORSエラー（ブラウザコンソールに表示）

**原因**: WordPress側のCORS設定が正しく動作していない

**解決法**: `functions.php` に以下を追加：

```php
function add_cors_headers() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    
    // OPTIONSリクエストの処理
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit();
    }
}
add_action('init', 'add_cors_headers');
```

**注意**: Next.jsのサーバーコンポーネントからのfetchはサーバーサイドで実行されるため、通常CORSの問題は発生しません。ブラウザからの直接アクセスでCORSエラーが出る場合は、上記の設定が必要です。

### 問題4: データが空の配列を返す

**原因**: 
- データが登録されていない
- フィルター条件に合うデータがない
- ACFフィールドが正しく設定されていない

**解決法**: 
- WordPress管理画面でデータが正しく登録されているか確認
- REST APIのレスポンスでACFフィールドが含まれているか確認

## 8. デバッグ用のコード追加

WordPressの `functions.php` に以下を追加して、REST APIのレスポンスをログに出力：

```php
add_filter('rest_prepare_dog_run', function($response, $post, $request) {
    error_log('REST API Response: ' . print_r($response->get_data(), true));
    return $response;
}, 10, 3);
```

## 次のステップ

1. 上記の確認手順を実行
2. WordPress APIのURLに直接アクセスして、データが返るか確認
3. Vercelのログで具体的なエラーメッセージを確認
4. 問題が特定できたら、適切な対処法を実施

具体的なエラーメッセージや、WordPress APIのレスポンスを共有していただければ、より詳細な対処法を提案できます。
