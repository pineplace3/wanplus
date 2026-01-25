# 403 Forbidden エラーの解決方法

## 問題

VercelのサーバーからWordPress APIにアクセスしようとすると、403 Forbiddenエラーが発生しています。これは、WordPressサイト（またはホスティングサーバー）がVercelのサーバーからのアクセスをブロックしているためです。

## 原因

403エラーの主な原因：

1. **XSERVERのセキュリティ設定**: IPアドレス制限が設定されている
2. **WordPressのセキュリティプラグイン**: Wordfence、iThemes SecurityなどがVercelのIPアドレスをブロックしている
3. **.htaccessファイル**: REST APIへのアクセスが制限されている
4. **WordPressの設定**: REST APIへのアクセスが制限されている

## 解決方法

### 方法1: WordPressのセキュリティプラグインの設定を確認

#### Wordfenceの場合

1. WordPress管理画面で「Wordfence」→「ファイアウォール」を開く
2. 「ファイアウォールオプション」を開く
3. 「REST APIへのアクセスを許可」を有効にする
4. または、「ホワイトリスト」にVercelのIPアドレスを追加

#### iThemes Securityの場合

1. WordPress管理画面で「セキュリティ」→「設定」を開く
2. 「REST API」セクションを確認
3. REST APIへのアクセスを許可する設定を確認

### 方法2: .htaccessファイルを確認

WordPressのルートディレクトリにある `.htaccess` ファイルを確認してください。

**問題のある設定例**:
```apache
# REST APIをブロックしている場合
<Files "wp-json">
    Order allow,deny
    Deny from all
</Files>
```

**修正方法**:
上記のような設定があれば削除するか、以下のように修正：

```apache
# REST APIへのアクセスを許可
<Files "wp-json">
    Order allow,deny
    Allow from all
</Files>
```

### 方法3: WordPressのfunctions.phpにアクセス許可を追加

WordPressの `functions.php` に以下を追加：

```php
// REST APIへのアクセスを許可
add_filter('rest_authentication_errors', function($result) {
    // ログインしていないユーザーでもREST APIにアクセス可能にする
    if (!empty($result)) {
        return $result;
    }
    if (!is_user_logged_in()) {
        return new WP_Error('rest_not_logged_in', 'You are not currently logged in.', array('status' => 401));
    }
    return $result;
}, 20);
```

または、REST APIへのアクセスを完全に許可する場合：

```php
// REST APIへのアクセスを完全に許可（セキュリティに注意）
add_filter('rest_authentication_errors', function($result) {
    return null; // すべてのアクセスを許可
}, 20);
```

### 方法4: XSERVERのセキュリティ設定を確認

1. XSERVERのコントロールパネルにログイン
2. 「セキュリティ」→「アクセス制限」を確認
3. VercelのIPアドレスを許可リストに追加

**VercelのIPアドレス範囲**:
Vercelは動的IPアドレスを使用しているため、特定のIPアドレスを許可するのは困難です。代わりに、WordPress側でREST APIへのアクセスを許可する設定を行う必要があります。

### 方法5: 一時的な回避策（推奨しない）

セキュリティ上の理由から推奨しませんが、一時的な回避策として：

1. WordPressのセキュリティプラグインを一時的に無効化
2. REST APIへのアクセスが正常に動作するか確認
3. 動作確認後、適切な設定を行う

## 推奨される解決方法

1. **WordPressのセキュリティプラグインの設定を確認**
   - REST APIへのアクセスを許可する設定を有効化
   - または、REST APIエンドポイントをホワイトリストに追加

2. **.htaccessファイルを確認**
   - REST APIをブロックしている設定がないか確認
   - 必要に応じて修正

3. **WordPressのfunctions.phpにアクセス許可を追加**
   - 上記のコードを追加して、REST APIへのアクセスを許可

## 確認方法

修正後、以下のURLにアクセスして確認してください：

```
https://wanplus-admin.com/wp-json/wp/v2/dog_run
```

- ブラウザからアクセス: JSONが表示される（正常）
- Vercelからアクセス: 403エラーが発生する（問題あり）

Vercelからも正常にアクセスできるようになれば、問題は解決です。

## 次のステップ

1. 上記の解決方法を試す
2. `/debug` ページで再度確認
3. 403エラーが解消されたら、`/dog-runs` ページでデータが表示されるか確認

問題が解決しない場合は、WordPressのセキュリティプラグインの設定や、.htaccessファイルの内容を共有してください。
