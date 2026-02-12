/**
 * WordPress REST API への接続テストスクリプト
 *
 * 使い方:
 *   node scripts/test-wordpress-connection.js
 *
 * .env.local の以下の環境変数を確認します:
 *   WORDPRESS_URL
 *   WORDPRESS_USER
 *   WORDPRESS_APP_PASSWORD
 */

const fs = require("fs");
const path = require("path");

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("エラー: .env.local が見つかりません。");
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eq = trimmed.indexOf("=");
      if (eq > 0) {
        const key = trimmed.slice(0, eq).trim();
        let value = trimmed.slice(eq + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  });
}

loadEnvLocal();

const WORDPRESS_URL = (process.env.WORDPRESS_URL || "").replace(/\/$/, "");
const WORDPRESS_USER = process.env.WORDPRESS_USER;
const WORDPRESS_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD;

console.log("WordPress 接続テスト");
console.log("=".repeat(60));
console.log(`URL: ${WORDPRESS_URL || "(未設定)"}`);
console.log(`ユーザー名: ${WORDPRESS_USER || "(未設定)"}`);
console.log(`アプリパスワード: ${WORDPRESS_APP_PASSWORD ? "***設定済み***" : "(未設定)"}`);
console.log("");

if (!WORDPRESS_URL || !WORDPRESS_USER || !WORDPRESS_APP_PASSWORD) {
  console.error("エラー: 必要な環境変数が設定されていません。");
  console.error("  .env.local に以下を設定してください:");
  console.error("  - WORDPRESS_URL");
  console.error("  - WORDPRESS_USER");
  console.error("  - WORDPRESS_APP_PASSWORD");
  process.exit(1);
}

function getAuthHeader() {
  const token = Buffer.from(`${WORDPRESS_USER}:${WORDPRESS_APP_PASSWORD}`, "utf8").toString("base64");
  return `Basic ${token}`;
}

async function testConnection() {
  console.log("接続テストを開始します...\n");

  // テスト1: WordPress REST API の基本エンドポイント
  console.log("[テスト1] WordPress REST API の基本エンドポイントにアクセス");
  try {
    const response = await fetch(`${WORDPRESS_URL}/wp-json/`, {
      headers: {
        Authorization: getAuthHeader(),
        "User-Agent": "WanPlus-ConnectionTest/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✓ 接続成功");
    console.log(`  WordPress バージョン: ${data.version || "不明"}`);
    console.log(`  REST API 名前空間: ${data.namespaces?.join(", ") || "不明"}`);
  } catch (error) {
    console.error(`✗ 接続失敗: ${error.message}`);
    return false;
  }

  console.log("");

  // テスト2: カスタム投稿タイプの確認
  const postTypes = ["dog_run", "cafe", "clinic", "stay"];
  console.log("[テスト2] カスタム投稿タイプの確認");

  for (const postType of postTypes) {
    try {
      const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/${postType}?per_page=1`, {
        headers: {
          Authorization: getAuthHeader(),
          "User-Agent": "WanPlus-ConnectionTest/1.0",
        },
      });

      if (response.status === 404) {
        console.log(`  ⚠ ${postType}: カスタム投稿タイプが見つかりません（まだ作成されていない可能性があります）`);
      } else if (!response.ok) {
        console.log(`  ✗ ${postType}: HTTP ${response.status} - ${response.statusText}`);
      } else {
        const data = await response.json();
        const count = Array.isArray(data) ? data.length : 0;
        console.log(`  ✓ ${postType}: アクセス可能（${count}件のデータ）`);
      }
    } catch (error) {
      console.log(`  ✗ ${postType}: ${error.message}`);
    }
  }

  console.log("");

  // テスト3: 認証情報の確認（ユーザー情報の取得）
  console.log("[テスト3] 認証情報の確認");
  try {
    const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: getAuthHeader(),
        "User-Agent": "WanPlus-ConnectionTest/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const user = await response.json();
    console.log("✓ 認証成功");
    console.log(`  ユーザー名: ${user.name || user.slug}`);
    console.log(`  ユーザーID: ${user.id}`);
    console.log(`  権限: ${user.capabilities ? Object.keys(user.capabilities).join(", ") : "不明"}`);
  } catch (error) {
    console.error(`✗ 認証失敗: ${error.message}`);
    console.error("  アプリケーションパスワードが正しくない可能性があります。");
    return false;
  }

  console.log("");
  console.log("=".repeat(60));
  console.log("✓ すべてのテストが完了しました！");
  console.log("WordPress REST API への接続は正常に動作しています。");
  return true;
}

testConnection().catch((err) => {
  console.error("\n予期しないエラーが発生しました:");
  console.error(err);
  process.exit(1);
});
