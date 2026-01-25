# WordPress ドッグラン用カスタム投稿タイプ設定ガイド

このガイドでは、WordPressにドッグラン用のカスタム投稿タイプを設定する方法を2通り紹介します。

## 方法1: プラグインを使用する方法（推奨：初心者向け）

### 必要なプラグイン

1. **Custom Post Type UI** - カスタム投稿タイプの作成
2. **Advanced Custom Fields (ACF)** - カスタムフィールドの管理
3. **ACF to REST API** - ACFフィールドをREST APIに公開

### 手順

#### ステップ1: プラグインのインストール

1. WordPress管理画面にログイン
2. 「プラグイン」→「新規追加」をクリック
3. 以下のプラグインを検索してインストール・有効化：
   - Custom Post Type UI
   - Advanced Custom Fields
   - ACF to REST API

#### ステップ2: カスタム投稿タイプの作成

1. WordPress管理画面の左メニューから「CPT UI」をクリック
2. 「Add/Edit Post Types」タブを選択
3. 以下の設定を入力：

**基本設定**
- Post Type Slug: `dog_run`
- Plural Label: `ドッグラン`
- Singular Label: `ドッグラン`
- Menu Name: `ドッグラン`

**設定オプション**
- ✅ Public: チェック
- ✅ Publicly Queryable: チェック
- ✅ Show UI: チェック
- ✅ Show in Menu: チェック
- ✅ Show in Nav Menus: チェック（必要に応じて）
- ✅ Show in Admin Bar: チェック
- ✅ Show in REST API: **必ずチェック**（重要）

**サポート機能**
- ✅ Title
- ✅ Editor
- ✅ Thumbnail
- ✅ Custom Fields

4. 「Add Post Type」ボタンをクリック

#### ステップ3: ACFフィールドグループの作成

1. WordPress管理画面の左メニューから「カスタムフィールド」→「フィールドグループ」をクリック
2. 「新規追加」をクリック
3. フィールドグループ名を入力（例：「ドッグラン情報」）

**フィールドグループの設定**
- 位置設定：
  - ルール: 「投稿タイプ」が「ドッグラン」と等しい

**フィールドの追加**

以下のフィールドを順番に追加してください：

##### 基本情報セクション

1. **名前** (`name`)
   - フィールドタイプ: テキスト
   - フィールド名: `name`
   - 必須: ✅

2. **説明** (`description`)
   - フィールドタイプ: テキストエリア
   - フィールド名: `description`
   - 必須: ✅

3. **画像URL** (`image`)
   - フィールドタイプ: 画像
   - フィールド名: `image`
   - 必須: ✅
   - 戻り値の形式: 画像URL

4. **都道府県** (`prefecture`)
   - フィールドタイプ: テキスト
   - フィールド名: `prefecture`
   - 必須: ✅

5. **市区町村** (`city`)
   - フィールドタイプ: テキスト
   - フィールド名: `city`
   - 必須: ✅

6. **住所詳細** (`line1`)
   - フィールドタイプ: テキスト
   - フィールド名: `line1`
   - 必須: ❌

7. **営業時間** (`hours`)
   - フィールドタイプ: テキスト
   - フィールド名: `hours`
   - 必須: ❌

8. **定休日** (`holidays`)
   - フィールドタイプ: テキスト
   - フィールド名: `holidays`
   - 必須: ❌

9. **電話番号** (`phone`)
   - フィールドタイプ: テキスト
   - フィールド名: `phone`
   - 必須: ❌

10. **ウェブサイト** (`website`)
    - フィールドタイプ: URL
    - フィールド名: `website`
    - 必須: ❌

11. **Xアカウント** (`x_account`)
    - フィールドタイプ: テキスト
    - フィールド名: `x_account`
    - 必須: ❌
    - プレースホルダー: `@username`

12. **Instagramアカウント** (`instagram_account`)
    - フィールドタイプ: テキスト
    - フィールド名: `instagram_account`
    - 必須: ❌
    - プレースホルダー: `@username`

13. **料金** (`fee`)
    - フィールドタイプ: テキスト
    - フィールド名: `fee`
    - 必須: ❌
    - プレースホルダー: `無料` / `1回 500円`

##### 施設情報セクション

14. **駐車場** (`parking`)
    - フィールドタイプ: 真偽値
    - フィールド名: `parking`
    - 必須: ✅
    - メッセージ: `駐車場あり`

15. **エリア分け** (`zone`)
    - フィールドタイプ: セレクト
    - フィールド名: `zone`
    - 必須: ✅
    - 選択肢:
      ```
      共用のみ : 共用のみ
      小型犬専用あり : 小型犬専用あり
      大型犬専用あり : 大型犬専用あり
      共用あり : 共用あり
      ```

16. **地面の素材** (`ground`)
    - フィールドタイプ: セレクト
    - フィールド名: `ground`
    - 必須: ✅
    - 選択肢:
      ```
      土 : 土
      砂 : 砂
      芝 : 芝
      ```

##### 設備情報セクション

17. **水飲み場** (`facility_water`)
    - フィールドタイプ: セレクト
    - フィールド名: `facility_water`
    - 必須: ✅
    - 選択肢:
      ```
      あり : あり
      なし : なし
      不明 : 不明
      ```

18. **足洗い場** (`facility_foot_wash`)
    - フィールドタイプ: セレクト
    - フィールド名: `facility_foot_wash`
    - 必須: ✅
    - 選択肢: 同上

19. **アジリティ** (`facility_agility`)
    - フィールドタイプ: セレクト
    - フィールド名: `facility_agility`
    - 必須: ✅
    - 選択肢: 同上

20. **照明施設** (`facility_lights`)
    - フィールドタイプ: セレクト
    - フィールド名: `facility_lights`
    - 必須: ✅
    - 選択肢: 同上

##### その他セクション

21. **利用条件** (`conditions`)
    - フィールドタイプ: テキストエリア
    - フィールド名: `conditions`
    - 必須: ❌

22. **マナーウェア** (`manners_wear`)
    - フィールドタイプ: セレクト
    - フィールド名: `manners_wear`
    - 必須: ❌
    - 選択肢:
      ```
      義務あり : 義務あり
      義務なし : 義務なし
      不明 : 不明
      ```

4. 「公開」ボタンをクリック

#### ステップ4: REST APIの有効化確認

1. 「ACF to REST API」プラグインが有効化されていることを確認
2. ブラウザで以下のURLにアクセスして確認：
   ```
   https://your-site.com/wp-json/wp/v2/dog_run
   ```
3. ACFフィールドが `acf` オブジェクト内に表示されていれば成功

---

## 方法2: コードで直接実装する方法（上級者向け）

### 実装方法

テーマの `functions.php` または専用プラグインに以下のコードを追加します。

```php
<?php
/**
 * ドッグラン用カスタム投稿タイプの登録
 */
function register_dog_run_post_type() {
    $labels = array(
        'name'                  => 'ドッグラン',
        'singular_name'         => 'ドッグラン',
        'menu_name'             => 'ドッグラン',
        'name_admin_bar'        => 'ドッグラン',
        'archives'              => 'ドッグランアーカイブ',
        'attributes'            => 'ドッグランの属性',
        'parent_item_colon'     => '親ドッグラン:',
        'all_items'             => 'すべてのドッグラン',
        'add_new_item'          => '新しいドッグランを追加',
        'add_new'               => '新規追加',
        'new_item'              => '新しいドッグラン',
        'edit_item'             => 'ドッグランを編集',
        'update_item'           => 'ドッグランを更新',
        'view_item'             => 'ドッグランを表示',
        'view_items'            => 'ドッグランを表示',
        'search_items'          => 'ドッグランを検索',
        'not_found'             => '見つかりませんでした',
        'not_found_in_trash'    => 'ゴミ箱にはありませんでした',
        'featured_image'        => 'アイキャッチ画像',
        'set_featured_image'    => 'アイキャッチ画像を設定',
        'remove_featured_image' => 'アイキャッチ画像を削除',
        'use_featured_image'    => 'アイキャッチ画像を使用',
        'insert_into_item'      => 'ドッグランに挿入',
        'uploaded_to_this_item' => 'このドッグランにアップロード',
        'items_list'            => 'ドッグラン一覧',
        'items_list_navigation' => 'ドッグラン一覧ナビゲーション',
        'filter_items_list'     => 'ドッグラン一覧をフィルタ',
    );

    $args = array(
        'label'                 => 'ドッグラン',
        'description'           => 'ドッグラン情報を管理します',
        'labels'                => $labels,
        'supports'              => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'taxonomies'            => array(),
        'hierarchical'          => false,
        'public'                 => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 5,
        'menu_icon'             => 'dashicons-pets',
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => true,
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'capability_type'       => 'post',
        'show_in_rest'          => true, // REST APIを有効化（重要）
        'rest_base'             => 'dog_run',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
    );

    register_post_type('dog_run', $args);
}
add_action('init', 'register_dog_run_post_type', 0);
```

### ACFフィールドのコード定義（オプション）

ACFフィールドをコードで定義することも可能です。`functions.php` または専用プラグインに追加：

```php
<?php
/**
 * ACFフィールドグループの登録（ドッグラン用）
 */
function register_dog_run_acf_fields() {
    if (function_exists('acf_add_local_field_group')) {
        acf_add_local_field_group(array(
            'key' => 'group_dog_run',
            'title' => 'ドッグラン情報',
            'fields' => array(
                // 基本情報
                array(
                    'key' => 'field_name',
                    'label' => '名前',
                    'name' => 'name',
                    'type' => 'text',
                    'required' => 1,
                ),
                array(
                    'key' => 'field_description',
                    'label' => '説明',
                    'name' => 'description',
                    'type' => 'textarea',
                    'required' => 1,
                ),
                // ... 他のフィールドも同様に定義
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => 'dog_run',
                    ),
                ),
            ),
        ));
    }
}
add_action('acf/init', 'register_dog_run_acf_fields');
```

---

## 動作確認

### 1. 管理画面での確認

1. WordPress管理画面の左メニューに「ドッグラン」が表示されているか確認
2. 「ドッグラン」→「新規追加」で新規投稿を作成できるか確認
3. ACFフィールドが表示されているか確認

### 2. REST APIでの確認

ブラウザまたはPostmanで以下のURLにアクセス：

```
https://your-site.com/wp-json/wp/v2/dog_run
```

レスポンスに以下のような形式でデータが返ってくれば成功：

```json
[
  {
    "id": 1,
    "slug": "sample-dog-run",
    "title": {
      "rendered": "サンプルドッグラン"
    },
    "acf": {
      "name": "サンプルドッグラン",
      "description": "...",
      "prefecture": "東京都",
      ...
    }
  }
]
```

---

## トラブルシューティング

### REST APIにACFフィールドが表示されない場合

1. 「ACF to REST API」プラグインが有効化されているか確認
2. ACFフィールドグループの設定で「REST APIに表示」が有効になっているか確認
3. カスタム投稿タイプの `show_in_rest` が `true` になっているか確認

### カスタム投稿タイプが表示されない場合

1. パーマリンク設定を更新（「設定」→「パーマリンク設定」→「変更を保存」）
2. ブラウザのキャッシュをクリア
3. WordPressのキャッシュプラグインを無効化して確認

---

## 次のステップ

1. サンプルデータ（`wordpress-sample-data/dog-runs-sample.json`）を参考に、実際のデータを登録
2. REST APIでデータが正しく取得できることを確認
3. Next.js側でAPI連携を実装
