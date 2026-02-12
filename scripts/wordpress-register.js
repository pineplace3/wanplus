/**
 * Cursor から WordPress にドッグランまたは記事を登録するスクリプト
 *
 * 使い方:
 *   node scripts/wordpress-register.js dog_run scripts/sample-dogrun.json
 *   node scripts/wordpress-register.js post scripts/sample-post.json
 *
 * 環境変数: WORDPRESS_URL, WORDPRESS_USER, WORDPRESS_APP_PASSWORD
 * 省略時は .env.local を読み込みます（存在すれば）。
 */

const fs = require("fs");
const path = require("path");

// プロジェクト直下の .env.local を読み込む（dotenv なしで対応）
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
const STATUS = process.env.WORDPRESS_STATUS || "publish";

function usage() {
  console.error(`
使い方:
  node scripts/wordpress-register.js <dog_run|cafe|clinic|stay|post> <JSONファイルパス> [--draft]

例:
  node scripts/wordpress-register.js dog_run scripts/sample-dogrun.json
  node scripts/wordpress-register.js cafe scripts/sample-cafe.json
  node scripts/wordpress-register.js clinic scripts/sample-clinic.json
  node scripts/wordpress-register.js stay scripts/sample-stay.json
  node scripts/wordpress-register.js post scripts/sample-post.json
  node scripts/wordpress-register.js dog_run scripts/sample-dogrun.json --draft

環境変数（または .env.local）:
  WORDPRESS_URL          ... WordPress のURL（例: https://wanplus-admin.com）
  WORDPRESS_USER         ... 管理者のユーザー名
  WORDPRESS_APP_PASSWORD ... アプリケーションパスワード（WP プロフィールで発行）
  WORDPRESS_STATUS       ... 省略時は publish。draft にすると下書きで登録
`);
}

function getAuthHeader() {
  if (!WORDPRESS_USER || !WORDPRESS_APP_PASSWORD) {
    console.error("エラー: WORDPRESS_USER と WORDPRESS_APP_PASSWORD を設定してください。");
    console.error("  .env.local に書くか、ターミナルで export してください。");
    process.exit(1);
  }
  const token = Buffer.from(`${WORDPRESS_USER}:${WORDPRESS_APP_PASSWORD}`, "utf8").toString("base64");
  return `Basic ${token}`;
}

function readJson(filePath) {
  const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  if (!fs.existsSync(abs)) {
    console.error("エラー: ファイルが見つかりません:", abs);
    process.exit(1);
  }
  const raw = fs.readFileSync(abs, "utf8");
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("エラー: JSON の解析に失敗しました:", e.message);
    process.exit(1);
  }
}

async function registerCustomPostType(jsonPath, postType, isDraft) {
  const data = readJson(jsonPath);
  const status = isDraft ? "draft" : STATUS;

  // データが { title, acf } 形式か、フラットな ACF のみか
  let title = data.title;
  let acf = data.acf;

  if (acf == null) {
    acf = { ...data };
    if (!title && acf.name) title = acf.name;
    if (acf.title) {
      title = acf.title;
      delete acf.title;
    }
    // 画像フィールドが空文字列、URL、または数値でない場合は除外
    // ACFの画像フィールドは通常、WordPressのメディアライブラリの添付ファイルIDを要求します
    if (acf.image === "" || (acf.image && typeof acf.image === "string" && !/^\d+$/.test(acf.image))) {
      delete acf.image;
    }
  }

  if (!title) {
    console.error("エラー: タイトルまたは name がありません。");
    process.exit(1);
  }

  const body = {
    title,
    status,
    content: acf.description || "",
    acf,
  };

  const url = `${WORDPRESS_URL}/wp-json/wp/v2/${postType}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
      "User-Agent": "WanPlus-Register/1.0 (Cursor)",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let result;
  try {
    result = JSON.parse(text);
  } catch {
    result = { raw: text };
  }

  if (!response.ok) {
    console.error("登録に失敗しました:", response.status, response.statusText);
    console.error(result);
    process.exit(1);
  }

  const typeLabels = {
    dog_run: "ドッグラン",
    cafe: "カフェ",
    clinic: "動物病院",
    stay: "宿泊施設",
  };
  const label = typeLabels[postType] || postType;
  console.log(`登録しました（${label}）:`);
  console.log("  ID:", result.id);
  console.log("  タイトル:", result.title?.rendered || title);
  console.log("  スラッグ:", result.slug);
  if (result.link) console.log("  URL:", result.link);
  return result;
}

async function registerPost(jsonPath, isDraft) {
  const data = readJson(jsonPath);
  const status = isDraft ? "draft" : data.status || STATUS;

  const body = {
    title: data.title,
    content: data.content || "",
    excerpt: data.excerpt || "",
    status,
  };

  if (!body.title) {
    console.error("エラー: title がありません。");
    process.exit(1);
  }

  const url = `${WORDPRESS_URL}/wp-json/wp/v2/posts`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
      "User-Agent": "WanPlus-Register/1.0 (Cursor)",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let result;
  try {
    result = JSON.parse(text);
  } catch {
    result = { raw: text };
  }

  if (!response.ok) {
    console.error("登録に失敗しました:", response.status, response.statusText);
    console.error(result);
    process.exit(1);
  }

  console.log("登録しました（記事）:");
  console.log("  ID:", result.id);
  console.log("  タイトル:", result.title?.rendered || body.title);
  if (result.link) console.log("  URL:", result.link);
  return result;
}

async function main() {
  const args = process.argv.slice(2);
  const useDraft = args.includes("--draft");
  const filtered = args.filter((a) => a !== "--draft");

  if (filtered.length < 2) {
    usage();
    process.exit(1);
  }

  const [type, filePath] = filtered;
  const customPostTypes = ["dog_run", "cafe", "clinic", "stay"];
  
  if (!customPostTypes.includes(type) && type !== "post") {
    console.error(`エラー: 第1引数は ${customPostTypes.join(", ")} または post にしてください。`);
    usage();
    process.exit(1);
  }

  if (customPostTypes.includes(type)) {
    await registerCustomPostType(filePath, type, useDraft);
  } else {
    await registerPost(filePath, useDraft);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
