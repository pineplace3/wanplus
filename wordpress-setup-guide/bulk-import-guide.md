# サンプルデータ一括登録ガイド

このガイドでは、`wordpress-sample-data/dog-runs-sample.json` のサンプルデータをWordPressに一括登録する方法を3通り紹介します。

## 方法1: WP All Importプラグインを使用（推奨：最も簡単）

### 必要なプラグイン

- **WP All Import** - 有料プラグイン（無料版でも基本機能は使用可能）
- **ACF Add-on for WP All Import** - ACFフィールド対応アドオン（有料）

### 手順

#### ステップ1: プラグインのインストール

1. WordPress管理画面にログイン
2. 「プラグイン」→「新規追加」をクリック
3. 「WP All Import」を検索してインストール・有効化
4. ACFフィールドをインポートする場合は「ACF Add-on for WP All Import」もインストール

#### ステップ2: JSONファイルの準備

1. `wordpress-sample-data/dog-runs-sample.json` を開く
2. JSONファイルをそのまま使用可能

#### ステップ3: インポートの実行

1. WordPress管理画面で「All Import」→「New Import」をクリック
2. 「Upload a file」タブを選択
3. `dog-runs-sample.json` をアップロード
4. 「Continue to Step 2」をクリック

#### ステップ4: インポート設定

1. **Import Type**: 「Posts」を選択
2. **Post Type**: 「ドッグラン」を選択
3. 「Continue to Step 3」をクリック

#### ステップ5: フィールドマッピング

1. **Title**: `name` フィールドをマッピング
2. **Content**: `description` フィールドをマッピング（任意）
3. **ACF Fields**: 各ACFフィールドをJSONの対応するフィールドにマッピング
   - `name` → ACF `name`
   - `description` → ACF `description`
   - `image` → ACF `image`
   - `prefecture` → ACF `prefecture`
   - `city` → ACF `city`
   - `line1` → ACF `line1`
   - `hours` → ACF `hours`
   - `holidays` → ACF `holidays`
   - `phone` → ACF `phone`
   - `website` → ACF `website`
   - `x_account` → ACF `x_account`
   - `instagram_account` → ACF `instagram_account`
   - `fee` → ACF `fee`
   - `parking` → ACF `parking`
   - `zone` → ACF `zone`
   - `ground` → ACF `ground`
   - `facility_water` → ACF `facility_water`
   - `facility_foot_wash` → ACF `facility_foot_wash`
   - `facility_agility` → ACF `facility_agility`
   - `facility_lights` → ACF `facility_lights`
   - `conditions` → ACF `conditions`
   - `manners_wear` → ACF `manners_wear`

4. 「Continue to Step 4」をクリック

#### ステップ6: インポート実行

1. 「Import」ボタンをクリック
2. インポートが完了するまで待機
3. 完了後、投稿一覧で確認

---

## 方法2: REST API経由でプログラム的に登録（開発者向け）

WordPress REST APIを使用して、プログラムから一括登録する方法です。

### 必要な準備

- WordPress REST APIが有効になっていること
- 認証トークンまたはアプリケーションパスワード

### 手順

#### ステップ1: アプリケーションパスワードの作成

1. WordPress管理画面で「ユーザー」→「プロフィール」を開く
2. 「アプリケーションパスワード」セクションまでスクロール
3. 新しいアプリケーションパスワード名を入力（例: `Import Script`）
4. 「新しいパスワードを追加」をクリック
5. 表示されたパスワードをコピー（一度しか表示されません）

#### ステップ2: インポートスクリプトの作成

以下のようなPHPスクリプトまたはNode.jsスクリプトを作成します。

##### PHPスクリプト例

```php
<?php
/**
 * WordPress REST API経由でドッグランデータを一括登録
 * 
 * 使用方法:
 * php import-dog-runs.php
 */

// WordPressの設定
$wp_url = 'https://your-site.com'; // WordPressサイトのURL
$username = 'admin'; // WordPressのユーザー名
$app_password = 'xxxx xxxx xxxx xxxx'; // アプリケーションパスワード

// JSONファイルの読み込み
$json_file = __DIR__ . '/wordpress-sample-data/dog-runs-sample.json';
$data = json_decode(file_get_contents($json_file), true);

if (!$data) {
    die("JSONファイルの読み込みに失敗しました\n");
}

// 認証情報の設定
$auth = base64_encode($username . ':' . $app_password);

// 各データを登録
foreach ($data as $item) {
    // 投稿データの準備
    $post_data = array(
        'title' => $item['name'],
        'status' => 'publish',
        'meta' => array(
            'acf' => array(
                'name' => $item['name'],
                'description' => $item['description'],
                'image' => $item['image'],
                'prefecture' => $item['prefecture'],
                'city' => $item['city'],
                'line1' => $item['line1'] ?? '',
                'hours' => $item['hours'] ?? '',
                'holidays' => $item['holidays'] ?? '',
                'phone' => $item['phone'] ?? '',
                'website' => $item['website'] ?? '',
                'x_account' => $item['x_account'] ?? '',
                'instagram_account' => $item['instagram_account'] ?? '',
                'fee' => $item['fee'] ?? '',
                'parking' => $item['parking'] ? 1 : 0,
                'zone' => $item['zone'],
                'ground' => $item['ground'],
                'facility_water' => $item['facility_water'],
                'facility_foot_wash' => $item['facility_foot_wash'],
                'facility_agility' => $item['facility_agility'],
                'facility_lights' => $item['facility_lights'],
                'conditions' => $item['conditions'] ?? '',
                'manners_wear' => $item['manners_wear'] ?? '',
            )
        )
    );

    // REST APIで投稿を作成
    $url = $wp_url . '/wp-json/wp/v2/dog_run';
    $ch = curl_init($url);
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($post_data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Authorization: Basic ' . $auth
    ));

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code === 201) {
        $result = json_decode($response, true);
        echo "✓ 登録成功: {$item['name']} (ID: {$result['id']})\n";
    } else {
        echo "✗ 登録失敗: {$item['name']} (HTTP {$http_code})\n";
        echo "  レスポンス: {$response}\n";
    }
    
    // サーバーに負荷をかけないように少し待機
    sleep(1);
}

echo "\nインポート完了\n";
```

##### Node.jsスクリプト例

```javascript
/**
 * WordPress REST API経由でドッグランデータを一括登録
 * 
 * 使用方法:
 * npm install axios
 * node import-dog-runs.js
 */

const fs = require('fs');
const axios = require('axios');

// WordPressの設定
const wpUrl = 'https://your-site.com'; // WordPressサイトのURL
const username = 'admin'; // WordPressのユーザー名
const appPassword = 'xxxx xxxx xxxx xxxx'; // アプリケーションパスワード

// 認証情報の設定
const auth = Buffer.from(`${username}:${appPassword}`).toString('base64');

// JSONファイルの読み込み
const jsonFile = './wordpress-sample-data/dog-runs-sample.json';
const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

// 各データを登録
async function importData() {
    for (const item of data) {
        // 投稿データの準備
        const postData = {
            title: item.name,
            status: 'publish',
            meta: {
                acf: {
                    name: item.name,
                    description: item.description,
                    image: item.image,
                    prefecture: item.prefecture,
                    city: item.city,
                    line1: item.line1 || '',
                    hours: item.hours || '',
                    holidays: item.holidays || '',
                    phone: item.phone || '',
                    website: item.website || '',
                    x_account: item.x_account || '',
                    instagram_account: item.instagram_account || '',
                    fee: item.fee || '',
                    parking: item.parking ? 1 : 0,
                    zone: item.zone,
                    ground: item.ground,
                    facility_water: item.facility_water,
                    facility_foot_wash: item.facility_foot_wash,
                    facility_agility: item.facility_agility,
                    facility_lights: item.facility_lights,
                    conditions: item.conditions || '',
                    manners_wear: item.manners_wear || '',
                }
            }
        };

        try {
            // REST APIで投稿を作成
            const response = await axios.post(
                `${wpUrl}/wp-json/wp/v2/dog_run`,
                postData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${auth}`
                    }
                }
            );

            console.log(`✓ 登録成功: ${item.name} (ID: ${response.data.id})`);
        } catch (error) {
            console.error(`✗ 登録失敗: ${item.name}`);
            console.error(`  エラー: ${error.response?.data?.message || error.message}`);
        }

        // サーバーに負荷をかけないように少し待機
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\nインポート完了');
}

importData();
```

#### ステップ3: スクリプトの実行

```bash
# PHPの場合
php import-dog-runs.php

# Node.jsの場合
node import-dog-runs.js
```

**注意**: REST API経由でACFフィールドを直接登録する場合、ACFのメタデータ構造を正しく設定する必要があります。上記の例は基本的な構造ですが、実際のACFの設定によって調整が必要な場合があります。

---

## 方法3: CSVに変換してインポート

JSONをCSVに変換して、WordPressの標準機能やプラグインでインポートする方法です。

### 手順

#### ステップ1: JSONをCSVに変換

以下のような変換スクリプトを使用します：

```javascript
// json-to-csv.js
const fs = require('fs');

const jsonData = JSON.parse(fs.readFileSync('./wordpress-sample-data/dog-runs-sample.json', 'utf8'));

// CSVヘッダー
const headers = [
    'name', 'description', 'image', 'prefecture', 'city', 'line1',
    'hours', 'holidays', 'phone', 'website', 'x_account', 'instagram_account',
    'fee', 'parking', 'zone', 'ground', 'facility_water', 'facility_foot_wash',
    'facility_agility', 'facility_lights', 'conditions', 'manners_wear'
];

// CSV行の生成
const csvRows = [headers.join(',')];

jsonData.forEach(item => {
    const row = headers.map(header => {
        const value = item[header];
        // カンマや改行を含む場合はダブルクォートで囲む
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
    });
    csvRows.push(row.join(','));
});

// CSVファイルに書き込み
fs.writeFileSync('./wordpress-sample-data/dog-runs-sample.csv', csvRows.join('\n'), 'utf8');
console.log('CSVファイルを作成しました: dog-runs-sample.csv');
```

#### ステップ2: CSVをインポート

1. 「WP All Import」プラグインを使用
2. CSVファイルをアップロード
3. フィールドマッピングを設定
4. インポートを実行

---

## 推奨方法

- **初心者**: 方法1（WP All Importプラグイン）
- **開発者**: 方法2（REST API経由）
- **CSV形式が必要な場合**: 方法3（JSON→CSV変換）

## トラブルシューティング

### ACFフィールドが登録されない場合

1. 「ACF to REST API」プラグインが有効化されているか確認
2. ACFフィールドグループの設定で「REST APIに表示」が有効になっているか確認
3. フィールド名が正しくマッピングされているか確認

### 認証エラーが発生する場合

1. アプリケーションパスワードが正しく設定されているか確認
2. WordPressのユーザー名とパスワードが正しいか確認
3. REST APIが有効になっているか確認

### 画像が表示されない場合

1. 画像URLが有効か確認
2. 外部URLの場合は、CORS設定を確認
3. WordPressのメディアライブラリにアップロードすることを推奨

## 次のステップ

1. インポートが完了したら、投稿一覧で確認
2. REST APIでデータが正しく取得できるか確認
3. Next.js側でAPI連携を実装
