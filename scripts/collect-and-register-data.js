/**
 * カフェ・動物病院・宿泊施設・ドッグランの情報を収集してWordPressに登録するスクリプト
 *
 * 使い方:
 *   node scripts/collect-and-register-data.js dog_run --query-file=scripts/query.txt --count=20 --dry-run
 *   node scripts/collect-and-register-data.js cafe --query-file=scripts/query.txt --count=10
 *   node scripts/collect-and-register-data.js clinic --query-file=scripts/query.txt --count=10
 *   node scripts/collect-and-register-data.js stay --query-file=scripts/query.txt --count=10
 *
 * エリア分割検索（東京都の各エリアで自動検索）:
 *   node scripts/collect-and-register-data.js dog_run --query-file=scripts/query.txt --count=60 --split-areas --dry-run
 *
 * 環境変数:
 *   GOOGLE_PLACES_API_KEY - Google Places APIキー
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
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

function getAuthHeader() {
  if (!WORDPRESS_USER || !WORDPRESS_APP_PASSWORD) {
    console.error("エラー: WORDPRESS_USER と WORDPRESS_APP_PASSWORD を設定してください。");
    process.exit(1);
  }
  const token = Buffer.from(`${WORDPRESS_USER}:${WORDPRESS_APP_PASSWORD}`, "utf8").toString("base64");
  return `Basic ${token}`;
}

async function wpFetch(method, pathname, body = undefined) {
  const url = `${WORDPRESS_URL}/wp-json/wp/v2${pathname}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
      "User-Agent": "WanPlus-DataCollector/1.0",
    },
  };
  if (body !== undefined) options.body = JSON.stringify(body);
  const res = await fetch(url, options);
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`WordPress API ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

// ----- Google Places API -----

/**
 * Google Places Text Search（ページネーション対応、最大60件）
 * typeを指定しない場合は全カテゴリから検索
 */
async function searchGooglePlaces(query, type, maxResults = 20) {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error("GOOGLE_PLACES_API_KEY が設定されていません。");
  }

  let allResults = [];
  let nextPageToken = null;
  let page = 1;

  while (allResults.length < maxResults && page <= 3) {
    // typeが空の場合はtypeパラメータを省略（ドッグランなど標準カテゴリにないもの用）
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_API_KEY}&language=ja`;
    if (type) {
      url += `&type=${type}`;
    }
    if (nextPageToken) {
      url += `&pagetoken=${nextPageToken}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(`Google Places API エラー: ${data.status} - ${data.error_message || ""}`);
    }

    const results = data.results || [];
    allResults = allResults.concat(results);

    console.log(`  ページ${page}: ${results.length}件取得（累計: ${allResults.length}件）`);

    // 次のページがあるか確認
    nextPageToken = data.next_page_token || null;
    if (!nextPageToken) break;

    // Google APIはnext_page_tokenが利用可能になるまで少し待つ必要がある
    await new Promise(resolve => setTimeout(resolve, 2000));
    page++;
  }

  return allResults.slice(0, maxResults);
}

async function getPlaceDetails(placeId) {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error("GOOGLE_PLACES_API_KEY が設定されていません。");
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,opening_hours,photos,rating,reviews,types&key=${GOOGLE_PLACES_API_KEY}&language=ja`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== "OK") {
    throw new Error(`Google Places API エラー: ${data.status}`);
  }

  return data.result;
}

// ----- 住所パーサー -----

function parseAddress(address) {
  // 「日本、〒XXX-XXXX」を除去
  let cleaned = address.replace(/日本、?/g, "").replace(/〒\d{3}-\d{4}/g, "").trim();

  const prefectureMatch = cleaned.match(/(.{2,3}[都道府県])/);
  const prefecture = prefectureMatch ? prefectureMatch[1] : "";

  let rest = cleaned;
  if (prefecture) {
    rest = cleaned.slice(cleaned.indexOf(prefecture) + prefecture.length);
  }

  // 市区町村を抽出（「○○市」「○○区」「○○町」「○○村」）
  const cityMatch = rest.match(/^([^\d]+?[市区町村])/);
  const city = cityMatch ? cityMatch[1] : "";

  const line1 = rest.replace(city, "").trim();

  return { prefecture: prefecture.trim(), city: city.trim(), line1: line1.trim() };
}

// ----- ACF変換 -----

function convertToACF(place, details, type) {
  const address = parseAddress(details.formatted_address || place.formatted_address || "");
  const photo = details.photos && details.photos[0]
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${details.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
    : "";

  // レビューから説明文を生成（最大200文字、複数レビューを結合）
  let description = "";
  if (details.reviews && details.reviews.length > 0) {
    description = details.reviews[0].text.substring(0, 200);
  } else {
    description = `${details.name || place.name}の情報です。`;
  }

  const base = {
    name: details.name || place.name,
    description,
    image: photo,
    prefecture: address.prefecture,
    city: address.city,
    line1: address.line1,
    hours: details.opening_hours?.weekday_text?.join(" / ") || "",
    phone: details.formatted_phone_number || "",
    website: details.website || "",
  };

  // image フィールドはWordPress添付ファイルIDが必要なので、URL文字列は除外
  if (base.image && typeof base.image === "string" && !/^\d+$/.test(base.image)) {
    delete base.image;
  }

  if (type === "dog_run") {
    return {
      ...base,
      parking: "不明",
      zone: "共用のみ",
      ground: "不明",
      facility_water: "不明",
      facility_foot_wash: "不明",
      facility_agility: "不明",
      facility_lights: "不明",
      fee: "",
      conditions: "",
      manners_wear: "不明",
    };
  } else if (type === "cafe") {
    return {
      ...base,
      parking: "不明",
      companion_area: "店内OK",
      size_limit: "大型犬OK",
      dog_menu: "無し",
    };
  } else if (type === "clinic") {
    return {
      ...base,
      pet_hotel: "不明",
      trimming: "不明",
    };
  } else if (type === "stay") {
    return {
      ...base,
      parking: "不明",
      allowed_size: "大型犬OK",
      has_dog_run: "不明",
      companion_range: "客室内のみ",
      amenities: "",
    };
  }

  return base;
}

// ----- WordPress登録 -----

async function registerToWordPress(type, acfData) {
  const body = {
    title: acfData.name,
    status: "draft",
    content: acfData.description || "",
    acf: acfData,
  };

  // 画像がURLの場合は除外（ACFが添付ファイルIDを要求するため）
  if (body.acf.image && typeof body.acf.image === "string" && !/^\d+$/.test(body.acf.image)) {
    delete body.acf.image;
  }

  return await wpFetch("POST", `/${type}`, body);
}

// ----- エリア分割 -----

// 東京23区 + 主要エリア（エリア分割検索用）
const TOKYO_AREAS = [
  "渋谷区", "新宿区", "世田谷区", "目黒区", "港区",
  "品川区", "大田区", "杉並区", "練馬区", "板橋区",
  "豊島区", "中野区", "北区", "足立区", "江戸川区",
  "葛飾区", "荒川区", "墨田区", "江東区", "台東区",
  "文京区", "千代田区", "中央区",
  "八王子市", "町田市", "府中市", "調布市", "立川市",
];

// 神奈川の主要エリア
const KANAGAWA_AREAS = [
  "横浜市", "川崎市", "相模原市", "藤沢市", "鎌倉市",
  "茅ヶ崎市", "厚木市", "大和市", "横須賀市",
];

// 埼玉の主要エリア
const SAITAMA_AREAS = [
  "さいたま市", "川口市", "川越市", "所沢市", "越谷市",
  "草加市", "春日部市", "上尾市", "熊谷市",
];

// 千葉の主要エリア
const CHIBA_AREAS = [
  "千葉市", "船橋市", "市川市", "松戸市", "柏市",
  "浦安市", "習志野市", "八千代市", "流山市",
];

/**
 * クエリに含まれる地域名からエリアリストを取得
 */
function getAreasForQuery(query) {
  if (query.includes("東京") || query.includes("東京都")) return TOKYO_AREAS;
  if (query.includes("神奈川")) return KANAGAWA_AREAS;
  if (query.includes("埼玉")) return SAITAMA_AREAS;
  if (query.includes("千葉")) return CHIBA_AREAS;
  // 関東全域
  if (query.includes("関東")) return [...TOKYO_AREAS, ...KANAGAWA_AREAS, ...SAITAMA_AREAS, ...CHIBA_AREAS];
  return null;
}

// ----- 引数解析 -----

function parseArgs(argv) {
  const parsed = { _: [], flags: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const eqIdx = arg.indexOf("=");
      if (eqIdx > 0) {
        const key = arg.slice(2, eqIdx);
        parsed[key] = arg.slice(eqIdx + 1);
      } else {
        const key = arg.slice(2);
        if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) {
          parsed[key] = argv[i + 1];
          i++;
        } else {
          parsed[key] = true;
          parsed.flags.push(key);
        }
      }
    } else {
      parsed._.push(arg);
    }
  }
  return parsed;
}

// ----- メイン -----

async function main() {
  const args = process.argv.slice(2);
  const parsed = parseArgs(args);

  // --query-file でファイルからクエリを読み込む（日本語文字化け対策）
  if (parsed["query-file"] && typeof parsed["query-file"] === "string") {
    const qfPath = path.isAbsolute(parsed["query-file"])
      ? parsed["query-file"]
      : path.join(process.cwd(), parsed["query-file"]);
    if (fs.existsSync(qfPath)) {
      parsed.query = fs.readFileSync(qfPath, "utf8").trim();
    }
  }

  if (parsed._.length === 0 || !parsed.query) {
    console.error(`
使い方:
  node scripts/collect-and-register-data.js <dog_run|cafe|clinic|stay> --query-file=scripts/query.txt [--count=20] [--dry-run]
  node scripts/collect-and-register-data.js <dog_run|cafe|clinic|stay> --query-file=scripts/query.txt --split-areas [--dry-run]

例:
  node scripts/collect-and-register-data.js dog_run --query-file=scripts/query.txt --count=20 --dry-run
  node scripts/collect-and-register-data.js dog_run --query-file=scripts/query.txt --split-areas --dry-run
  node scripts/collect-and-register-data.js cafe --query-file=scripts/query.txt --count=10
  node scripts/collect-and-register-data.js clinic --query-file=scripts/query.txt --count=10

オプション:
  --query        検索クエリ（日本語が化ける場合は --query-file を使用）
  --query-file   検索クエリをファイルから読み込む（UTF-8）
  --count        取得件数（デフォルト: 20、最大60）
  --split-areas  エリア分割検索（東京23区+主要都市を個別に検索して網羅的に収集）
  --dry-run      実際には登録せず、収集したデータを表示するだけ
  --save-json    収集データをJSONファイルに保存（例: --save-json=collected-data.json）
    `);
    process.exit(1);
  }

  const type = parsed._[0];
  if (!["dog_run", "cafe", "clinic", "stay"].includes(type)) {
    console.error("エラー: タイプは dog_run, cafe, clinic, stay のいずれかである必要があります。");
    process.exit(1);
  }

  const query = parsed.query;
  if (!query || query === true) {
    console.error("エラー: --query または --query-file を指定してください。");
    process.exit(1);
  }

  const count = parsed.count ? parseInt(parsed.count) || 20 : 20;
  const dryRun = parsed["dry-run"] === true;
  const splitAreas = parsed["split-areas"] === true;
  const saveJson = parsed["save-json"];

  if (!GOOGLE_PLACES_API_KEY) {
    console.error("\n警告: GOOGLE_PLACES_API_KEY が設定されていません。");
    console.error(".env.local に GOOGLE_PLACES_API_KEY=your_key を追加してください。");
    process.exit(1);
  }

  // Google Placesのtypeマッピング（ドッグランはtypeなしで検索）
  const placeTypeMap = {
    dog_run: "",           // 標準カテゴリにないのでtype指定なし
    cafe: "",              // 「犬 カフェ」等のクエリで十分
    clinic: "veterinary_care",
    stay: "lodging",
  };
  const googleType = placeTypeMap[type] || "";

  const typeLabels = {
    dog_run: "ドッグラン",
    cafe: "カフェ",
    clinic: "動物病院",
    stay: "宿泊施設",
  };

  console.log(`\n${typeLabels[type]}の情報を収集中: "${query}"`);
  console.log("=".repeat(60));

  const allCollected = [];
  const seenPlaceIds = new Set(); // 重複排除用

  try {
    if (splitAreas) {
      // ----- エリア分割検索 -----
      const areas = getAreasForQuery(query);
      if (!areas) {
        console.log("エリア分割検索は東京都/神奈川/埼玉/千葉/関東に対応しています。");
        console.log("クエリに地域名を含めてください（例: 東京都 ドッグラン）");
        process.exit(1);
      }

      // クエリから地域名を除去して、キーワード部分だけ取得
      const keyword = query
        .replace(/東京都?/g, "").replace(/神奈川県?/g, "")
        .replace(/埼玉県?/g, "").replace(/千葉県?/g, "")
        .replace(/関東/g, "").trim();

      console.log(`エリア分割検索: ${areas.length}エリア × キーワード「${keyword}」\n`);

      for (let i = 0; i < areas.length; i++) {
        const area = areas[i];
        const areaQuery = `${area} ${keyword}`;
        console.log(`[エリア ${i + 1}/${areas.length}] ${area}`);

        try {
          const places = await searchGooglePlaces(areaQuery, googleType, 20);

          // 重複排除
          let newCount = 0;
          for (const place of places) {
            if (!seenPlaceIds.has(place.place_id)) {
              seenPlaceIds.add(place.place_id);
              allCollected.push(place);
              newCount++;
            }
          }
          console.log(`  → 新規 ${newCount}件（重複除外済み、累計: ${allCollected.length}件）`);
        } catch (error) {
          console.error(`  ✗ エラー: ${error.message}`);
        }

        // API制限回避
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log(`\n合計 ${allCollected.length}件のユニークな場所が見つかりました。\n`);

    } else {
      // ----- 通常検索（ページネーション対応） -----
      console.log(`最大${count}件を取得します...\n`);
      const places = await searchGooglePlaces(query, googleType, count);
      for (const place of places) {
        if (!seenPlaceIds.has(place.place_id)) {
          seenPlaceIds.add(place.place_id);
          allCollected.push(place);
        }
      }
      console.log(`\n${allCollected.length}件のユニークな場所が見つかりました。\n`);
    }

    if (allCollected.length === 0) {
      console.log("検索結果が見つかりませんでした。");
      return;
    }

    // ----- 詳細取得 & 変換 -----
    const convertedData = [];

    for (let i = 0; i < allCollected.length; i++) {
      const place = allCollected[i];
      console.log(`[${i + 1}/${allCollected.length}] ${place.name}`);

      try {
        const details = await getPlaceDetails(place.place_id);
        const acfData = convertToACF(place, details, type);
        convertedData.push(acfData);

        if (dryRun) {
          console.log(`  ${acfData.prefecture} ${acfData.city} | ${acfData.phone || "-"} | ${acfData.website ? "Web有" : "-"}`);
        } else {
          const result = await registerToWordPress(type, acfData);
          console.log(`  ✓ 登録しました (ID: ${result.id}, スラッグ: ${result.slug})`);
        }

        // API制限回避（Details APIは1秒あたり10リクエストまで）
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`  ✗ エラー: ${error.message}`);
      }
    }

    // ----- JSON保存 -----
    if (saveJson && convertedData.length > 0) {
      const savePath = path.isAbsolute(saveJson) ? saveJson : path.join(process.cwd(), saveJson);
      fs.writeFileSync(savePath, JSON.stringify(convertedData, null, 2), "utf8");
      console.log(`\n収集データを ${savePath} に保存しました（${convertedData.length}件）`);
    }

    // ----- 完了 -----
    console.log(`\n${"=".repeat(60)}`);
    console.log(`完了: ${convertedData.length}件の${typeLabels[type]}情報を${dryRun ? "収集" : "登録"}しました。`);
    if (!dryRun) {
      console.log("WordPress管理画面で下書きを確認し、必要に応じて編集してから公開してください。");
    }
  } catch (error) {
    console.error(`\nエラー: ${error.message}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
