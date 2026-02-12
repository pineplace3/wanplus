<?php
/**
 * ACFフィールドグループをWordPressに直接インポートするPHPスクリプト
 *
 * 使い方:
 *   1. このファイルをWordPressのルートディレクトリに配置
 *   2. ブラウザで https://your-site.com/import-acf-field-groups.php にアクセス
 *   3. または、WP-CLIで実行: wp eval-file import-acf-field-groups.php
 *
 * 注意: ACFプラグインが有効化されている必要があります。
 */

// WordPressを読み込む
require_once(__DIR__ . '/wp-load.php');

if (!function_exists('acf_import_field_group')) {
    die('エラー: ACFプラグインが有効化されていません。');
}

// JSONファイルのパス（このスクリプトをWordPressルートに配置した場合）
$json_dir = __DIR__ . '/wordpress-setup-guide/acf-field-groups/';

$field_groups = [
    'cafe' => 'cafe-field-group.json',
    'clinic' => 'clinic-field-group.json',
    'stay' => 'stay-field-group.json',
];

$results = [];

foreach ($field_groups as $type => $filename) {
    $json_path = $json_dir . $filename;
    
    if (!file_exists($json_path)) {
        $results[$type] = [
            'success' => false,
            'message' => "ファイルが見つかりません: {$json_path}"
        ];
        continue;
    }
    
    $json_content = file_get_contents($json_path);
    $field_group = json_decode($json_content, true);
    
    if (!$field_group) {
        $results[$type] = [
            'success' => false,
            'message' => "JSONの解析に失敗しました: {$filename}"
        ];
        continue;
    }
    
    // 既存のフィールドグループをチェック
    $existing = acf_get_field_group($field_group['key']);
    
    if ($existing) {
        // 既存の場合は更新
        $field_group['ID'] = $existing['ID'];
        $result = acf_update_field_group($field_group);
        $action = '更新';
    } else {
        // 新規の場合はインポート
        $result = acf_import_field_group($field_group);
        $action = '作成';
    }
    
    if ($result) {
        $results[$type] = [
            'success' => true,
            'message' => "{$type} フィールドグループを{$action}しました。"
        ];
    } else {
        $results[$type] = [
            'success' => false,
            'message' => "{$type} フィールドグループの{$action}に失敗しました。"
        ];
    }
}

// 結果を表示
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>ACFフィールドグループインポート結果</title>
    <style>
        body { font-family: sans-serif; padding: 20px; }
        .success { color: green; }
        .error { color: red; }
        .result { margin: 10px 0; padding: 10px; border: 1px solid #ccc; }
    </style>
</head>
<body>
    <h1>ACFフィールドグループインポート結果</h1>
    <?php foreach ($results as $type => $result): ?>
        <div class="result">
            <strong><?php echo esc_html($type); ?>:</strong>
            <span class="<?php echo $result['success'] ? 'success' : 'error'; ?>">
                <?php echo esc_html($result['message']); ?>
            </span>
        </div>
    <?php endforeach; ?>
</body>
</html>
