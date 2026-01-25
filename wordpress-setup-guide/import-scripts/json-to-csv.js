/**
 * JSONファイルをCSVファイルに変換
 * 
 * 使用方法:
 * node json-to-csv.js
 */

const fs = require('fs');
const path = require('path');

// ファイルパス
const jsonFile = path.join(__dirname, '../wordpress-sample-data/dog-runs-sample.json');
const csvFile = path.join(__dirname, '../wordpress-sample-data/dog-runs-sample.csv');

// JSONファイルの読み込み
let data;
try {
    const jsonContent = fs.readFileSync(jsonFile, 'utf8');
    data = JSON.parse(jsonContent);
} catch (error) {
    console.error('エラー: JSONファイルの読み込みに失敗しました');
    console.error(error.message);
    process.exit(1);
}

// CSVヘッダー
const headers = [
    'name',
    'description',
    'image',
    'prefecture',
    'city',
    'line1',
    'hours',
    'holidays',
    'phone',
    'website',
    'x_account',
    'instagram_account',
    'fee',
    'parking',
    'zone',
    'ground',
    'facility_water',
    'facility_foot_wash',
    'facility_agility',
    'facility_lights',
    'conditions',
    'manners_wear'
];

// CSVエスケープ関数
function escapeCsvValue(value) {
    if (value === null || value === undefined) {
        return '';
    }
    
    const stringValue = String(value);
    
    // カンマ、改行、ダブルクォートを含む場合はダブルクォートで囲む
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
}

// CSV行の生成
const csvRows = [headers.join(',')];

data.forEach(item => {
    const row = headers.map(header => {
        const value = item[header];
        return escapeCsvValue(value);
    });
    csvRows.push(row.join(','));
});

// CSVファイルに書き込み
try {
    fs.writeFileSync(csvFile, csvRows.join('\n'), 'utf8');
    console.log('✓ CSVファイルを作成しました');
    console.log(`  ファイル: ${csvFile}`);
    console.log(`  データ件数: ${data.length}件`);
} catch (error) {
    console.error('エラー: CSVファイルの書き込みに失敗しました');
    console.error(error.message);
    process.exit(1);
}
