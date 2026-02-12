# カスタム投稿タイプの権限を修正する方法

「Map Meta Cap」の設定が見当たらない場合、以下の方法で権限を修正できます。

## 方法1: functions.phpにコードを追加（推奨）

### 手順

1. WordPress管理画面にログイン
2. **「外観」** → **「テーマファイルエディター」** を開く
   - または、FTP/ファイルマネージャーで `wp-content/themes/your-theme-name/functions.php` を編集
3. `functions.php` の最後に、以下のコードを追加:

```php
// カスタム投稿タイプ（cafe, clinic, stay）の権限を修正
add_action('init', function() {
    // cafe の権限を修正
    $cafe_post_type = get_post_type_object('cafe');
    if ($cafe_post_type) {
        $cafe_post_type->capability_type = 'post';
        $cafe_post_type->map_meta_cap = true;
        register_post_type('cafe', (array) $cafe_post_type);
    }
    
    // clinic の権限を修正
    $clinic_post_type = get_post_type_object('clinic');
    if ($clinic_post_type) {
        $clinic_post_type->capability_type = 'post';
        $clinic_post_type->map_meta_cap = true;
        register_post_type('clinic', (array) $clinic_post_type);
    }
    
    // stay の権限を修正
    $stay_post_type = get_post_type_object('stay');
    if ($stay_post_type) {
        $stay_post_type->capability_type = 'post';
        $stay_post_type->map_meta_cap = true;
        register_post_type('stay', (array) $stay_post_type);
    }
}, 20);
```

4. **「ファイルを更新」** をクリック

### 注意事項

- テーマを更新すると、このコードが消える可能性があります
- テーマを更新してもコードを保持したい場合は、**子テーマ**を使用するか、**プラグイン**として作成してください

---

## 方法2: プラグインとして作成

1. WordPress管理画面 → **「プラグイン」** → **「新規追加」**
2. **「プラグインをアップロード」** をクリック
3. `wordpress-setup-guide/fix-permissions-via-functions.php.php` をプラグインとしてアップロード
   - または、手動で `wp-content/plugins/` にフォルダを作成して配置
4. プラグインを有効化

---

## 方法3: Custom Post Type UIの設定を確認（代替）

Custom Post Type UIのバージョンによって、設定項目の場所が異なる場合があります。

1. **「CPT UI」** → **「Add/Edit Post Types」**
2. `cafe` を編集
3. 以下の項目を確認:
   - **「高度なオプション」** または **「Advanced Options」** セクション
   - **「Capability Type」**: `post` に設定
   - **「Supports」**: Editor, Title, Custom Fields をチェック
   - **「Show in REST API」**: ✅ チェック
4. すべての設定を保存

---

## 設定後の確認

コードを追加した後、以下を実行して確認してください:

```bash
# 接続テスト
node scripts/test-wordpress-connection.js

# カフェの登録テスト
node scripts/wordpress-register.js cafe scripts/test-cafe-minimal.json --draft
```

エラーが解消されれば、正常に動作しています。
