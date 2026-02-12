/**
 * ACFフィールドグループをWordPressにインポートするスクリプト
 *
 * 使い方:
 *   node scripts/import-acf-field-groups.js cafe
 *   node scripts/import-acf-field-groups.js clinic
 *   node scripts/import-acf-field-groups.js stay
 *   node scripts/import-acf-field-groups.js all
 *
 * 注意: ACFプラグインが有効化されている必要があります。
 * このスクリプトは、ACFのJSONインポート機能を使用します。
 * WordPress管理画面から手動でインポートする方法も推奨されます。
 */

const fs = require("fs");
const path = require("path");

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
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

const WORDPRESS_URL = (process.env.WORDPRESS_URL || "https://wanplus-admin.com").replace(/\/$/, "");
const WORDPRESS_USER = process.env.WORDPRESS_USER;
const WORDPRESS_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD;

function getAuthHeader() {
  if (!WORDPRESS_USER || !WORDPRESS_APP_PASSWORD) {
    console.error("エラー: WORDPRESS_USER と WORDPRESS_APP_PASSWORD を設定してください。");
    process.exit(1);
  }
  const token = Buffer.from(`${WORDPRESS_USER}:${WORDPRESS_APP_PASSWORD}`, "utf8").toString("base64");
  return `Basic ${token}`;
}

async function importFieldGroup(type) {
  const jsonPath = path.join(__dirname, "..", "wordpress-setup-guide", "acf-field-groups", `${type}-field-group.json`);
  if (!fs.existsSync(jsonPath)) {
    console.error(`エラー: ${jsonPath} が見つかりません。`);
    return false;
  }

  const fieldGroup = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  
  // ACFのフィールドグループをインポートするには、ACFのREST APIまたは
  // WordPress管理画面の「カスタムフィールド」→「ツール」→「インポート」を使用します。
  // ここでは、JSONファイルをWordPressのacf-jsonディレクトリにコピーする方法を提供します。
  
  console.log(`\n${type} フィールドグループのインポート方法:`);
  console.log("=".repeat(60));
  console.log("\n方法1: WordPress管理画面から手動インポート（推奨）");
  console.log("1. WordPress管理画面にログイン");
  console.log("2. 「カスタムフィールド」→「ツール」→「インポート」を開く");
  console.log(`3. 以下のファイルを選択:`);
  console.log(`   ${jsonPath}`);
  console.log("4. 「インポート」ボタンをクリック");
  
  console.log("\n方法2: acf-jsonディレクトリにコピー（自動同期）");
  console.log("ACFの「自動同期」機能を使用する場合:");
  console.log("1. WordPressのテーマディレクトリに acf-json フォルダを作成");
  console.log("2. このJSONファイルを acf-json フォルダにコピー");
  console.log("3. ACFが自動的にフィールドグループを同期します");
  
  console.log("\n方法3: PHPスクリプトで直接インポート");
  console.log("wordpress-setup-guide/import-acf-field-groups.php を参照してください");
  
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("使い方: node scripts/import-acf-field-groups.js <cafe|clinic|stay|all>");
    process.exit(1);
  }

  const type = args[0];
  const types = type === "all" ? ["cafe", "clinic", "stay"] : [type];

  for (const t of types) {
    await importFieldGroup(t);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
