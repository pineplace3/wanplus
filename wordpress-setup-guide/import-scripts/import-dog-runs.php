<?php
/**
 * WordPress REST API経由でドッグランデータを一括登録
 * 
 * 使用方法:
 * 1. このファイルをWordPressのルートディレクトリに配置
 * 2. WordPressの設定を変更（$wp_url, $username, $app_password）
 * 3. ブラウザでアクセス: https://your-site.com/import-dog-runs.php
 * またはコマンドラインで実行: php import-dog-runs.php
 */

// WordPressの設定
$wp_url = 'https://your-site.com'; // WordPressサイトのURL（変更してください）
$username = 'admin'; // WordPressのユーザー名（変更してください）
$app_password = 'xxxx xxxx xxxx xxxx'; // アプリケーションパスワード（変更してください）

// JSONファイルのパス（このファイルと同じディレクトリに配置）
$json_file = __DIR__ . '/../wordpress-sample-data/dog-runs-sample.json';

// JSONファイルの読み込み
if (!file_exists($json_file)) {
    die("エラー: JSONファイルが見つかりません: {$json_file}\n");
}

$json_content = file_get_contents($json_file);
$data = json_decode($json_content, true);

if (!$data || !is_array($data)) {
    die("エラー: JSONファイルの読み込みに失敗しました\n");
}

echo "インポート開始...\n";
echo "データ件数: " . count($data) . "件\n\n";

// 認証情報の設定
$auth = base64_encode($username . ':' . $app_password);

$success_count = 0;
$error_count = 0;

// 各データを登録
foreach ($data as $index => $item) {
    echo "[" . ($index + 1) . "/" . count($data) . "] {$item['name']} ... ";
    
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
                'line1' => isset($item['line1']) ? $item['line1'] : '',
                'hours' => isset($item['hours']) ? $item['hours'] : '',
                'holidays' => isset($item['holidays']) ? $item['holidays'] : '',
                'phone' => isset($item['phone']) ? $item['phone'] : '',
                'website' => isset($item['website']) ? $item['website'] : '',
                'x_account' => isset($item['x_account']) ? $item['x_account'] : '',
                'instagram_account' => isset($item['instagram_account']) ? $item['instagram_account'] : '',
                'fee' => isset($item['fee']) ? $item['fee'] : '',
                'parking' => isset($item['parking']) && $item['parking'] ? 1 : 0,
                'zone' => $item['zone'],
                'ground' => $item['ground'],
                'facility_water' => $item['facility_water'],
                'facility_foot_wash' => $item['facility_foot_wash'],
                'facility_agility' => $item['facility_agility'],
                'facility_lights' => $item['facility_lights'],
                'conditions' => isset($item['conditions']) ? $item['conditions'] : '',
                'manners_wear' => isset($item['manners_wear']) ? $item['manners_wear'] : '',
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
    $curl_error = curl_error($ch);
    curl_close($ch);

    if ($http_code === 201) {
        $result = json_decode($response, true);
        echo "✓ 成功 (ID: {$result['id']})\n";
        $success_count++;
    } else {
        echo "✗ 失敗 (HTTP {$http_code})\n";
        if ($curl_error) {
            echo "  CURLエラー: {$curl_error}\n";
        } else {
            $error_data = json_decode($response, true);
            if (isset($error_data['message'])) {
                echo "  エラー: {$error_data['message']}\n";
            } else {
                echo "  レスポンス: " . substr($response, 0, 200) . "\n";
            }
        }
        $error_count++;
    }
    
    // サーバーに負荷をかけないように少し待機
    usleep(500000); // 0.5秒待機
}

echo "\n";
echo "========================================\n";
echo "インポート完了\n";
echo "成功: {$success_count}件\n";
echo "失敗: {$error_count}件\n";
echo "========================================\n";
