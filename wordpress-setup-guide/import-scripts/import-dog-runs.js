/**
 * WordPress REST API経由でドッグランデータを一括登録
 * 
 * 使用方法:
 * npm install axios
 * node import-dog-runs.js
 */

const fs = require('fs');
const axios = require('axios');
const path = require('path');

// WordPressの設定（変更してください）
const wpUrl = 'https://your-site.com'; // WordPressサイトのURL
const username = 'admin'; // WordPressのユーザー名
const appPassword = 'xxxx xxxx xxxx xxxx'; // アプリケーションパスワード

// 認証情報の設定
const auth = Buffer.from(`${username}:${appPassword}`).toString('base64');

// JSONファイルのパス
const jsonFile = path.join(__dirname, '../wordpress-sample-data/dog-runs-sample.json');

// JSONファイルの読み込み
let data;
try {
    const jsonContent = fs.readFileSync(jsonFile, 'utf8');
    data = JSON.parse(jsonContent);
    
    if (!Array.isArray(data)) {
        throw new Error('JSONデータが配列形式ではありません');
    }
} catch (error) {
    console.error('エラー: JSONファイルの読み込みに失敗しました');
    console.error(error.message);
    process.exit(1);
}

console.log('インポート開始...');
console.log(`データ件数: ${data.length}件\n`);

let successCount = 0;
let errorCount = 0;

// 各データを登録
async function importData() {
    for (let index = 0; index < data.length; index++) {
        const item = data[index];
        process.stdout.write(`[${index + 1}/${data.length}] ${item.name} ... `);
        
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
                    },
                    validateStatus: function (status) {
                        return status === 201; // 201 Created のみ成功とする
                    }
                }
            );

            console.log(`✓ 成功 (ID: ${response.data.id})`);
            successCount++;
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || '不明なエラー';
                console.log(`✗ 失敗 (HTTP ${status})`);
                console.log(`  エラー: ${message}`);
            } else {
                console.log(`✗ 失敗`);
                console.log(`  エラー: ${error.message}`);
            }
            errorCount++;
        }

        // サーバーに負荷をかけないように少し待機
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n========================================');
    console.log('インポート完了');
    console.log(`成功: ${successCount}件`);
    console.log(`失敗: ${errorCount}件`);
    console.log('========================================');
}

importData().catch(error => {
    console.error('予期しないエラーが発生しました:');
    console.error(error);
    process.exit(1);
});
