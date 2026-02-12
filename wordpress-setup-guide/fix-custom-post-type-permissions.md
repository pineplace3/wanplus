# カスタム投稿タイプの権限設定を修正する

カスタム投稿タイプ（`cafe`, `clinic`, `stay`）で401エラーが出る場合、権限設定を確認・修正してください。

## 方法1: Custom Post Type UIプラグインで設定を確認

1. WordPress管理画面 → **「CPT UI」** → **「Add/Edit Post Types」**
2. 各カスタム投稿タイプ（`cafe`, `clinic`, `stay`）を編集
3. **「高度なオプション」** セクションを開く
4. 以下の設定を確認・変更:

### 重要な設定項目

- **Capability Type**: `post` に設定（デフォルトは `post` のはずですが確認）
- **Map Meta Cap**: ✅ チェックを入れる（重要）
- **Supports**: ✅ Editor, ✅ Title, ✅ Custom Fields をチェック

### REST API設定

- **Show in REST API**: ✅ 必ずチェック
- **REST API base slug**: 空欄のまま（デフォルトのスラッグを使用）

5. **「Post Typeを更新」** をクリック

## 方法2: functions.phpで権限を明示的に設定

テーマの `functions.php` に以下のコードを追加（Custom Post Type UIを使わない場合）:

```php
// カスタム投稿タイプの権限を修正
add_action('init', function() {
    // cafe の権限を修正
    $cafe_args = get_post_type_object('cafe');
    if ($cafe_args) {
        $cafe_args->capability_type = 'post';
        $cafe_args->map_meta_cap = true;
        register_post_type('cafe', (array) $cafe_args);
    }
    
    // clinic の権限を修正
    $clinic_args = get_post_type_object('clinic');
    if ($clinic_args) {
        $clinic_args->capability_type = 'post';
        $clinic_args->map_meta_cap = true;
        register_post_type('clinic', (array) $clinic_args);
    }
    
    // stay の権限を修正
    $stay_args = get_post_type_object('stay');
    if ($stay_args) {
        $stay_args->capability_type = 'post';
        $stay_args->map_meta_cap = true;
        register_post_type('stay', (array) $stay_args);
    }
}, 20);
```

## 方法3: プラグインで権限を修正

「User Role Editor」などのプラグインを使用して、管理者権限にカスタム投稿タイプの権限を追加することもできます。

## 確認方法

設定を変更した後、再度テストを実行:

```bash
node scripts/test-wordpress-connection.js
node scripts/wordpress-register.js cafe scripts/test-cafe-minimal.json --draft
```
