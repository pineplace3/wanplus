/**
 * WordPress REST API 用 MCP サーバー（ドッグラン・記事の登録・一覧）
 * Cursor の MCP に追加して使用します。
 *
 * 環境変数: WORDPRESS_URL, WORDPRESS_USER, WORDPRESS_APP_PASSWORD
 * 未設定時はプロジェクト直下の .env.local を読み込みます。
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

function loadEnvLocal() {
  const envPath = path.join(projectRoot, ".env.local");
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
    throw new Error("WORDPRESS_USER と WORDPRESS_APP_PASSWORD を .env.local または環境変数に設定してください。");
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
      "User-Agent": "WanPlus-MCP/1.0",
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

const server = new McpServer({
  name: "wanplus-wordpress",
  version: "1.0.0",
});

// ドッグランを1件作成
server.tool(
  "create_dog_run",
  "WordPress にドッグランを1件登録する。ACF フィールドを JSON で渡す。",
  {
    title: z.string().optional().describe("投稿タイトル（省略時は name を使用）"),
    acf_json: z.string().describe("ACF フィールドの JSON 文字列（name, description, prefecture, city など）"),
    status: z.enum(["publish", "draft"]).optional().default("publish").describe("公開状態"),
  },
  async ({ title, acf_json, status }) => {
    let acf;
    try {
      acf = JSON.parse(acf_json);
    } catch (e) {
      return { content: [{ type: "text", text: `JSON 解析エラー: ${e.message}` }], isError: true };
    }
    const postTitle = title || acf.name || acf.title || "無題";
    const body = { title: postTitle, status, content: acf.description || "", acf };
    try {
      const result = await wpFetch("POST", "/dog_run", body);
      const text = `登録しました（ドッグラン）。ID: ${result.id}, スラッグ: ${result.slug}${result.link ? `, URL: ${result.link}` : ""}`;
      return { content: [{ type: "text", text }] };
    } catch (e) {
      return { content: [{ type: "text", text: `登録失敗: ${e.message}` }], isError: true };
    }
  }
);

// 通常の記事を1件作成
server.tool(
  "create_post",
  "WordPress に通常の記事（投稿）を1件登録する。",
  {
    title: z.string().describe("タイトル"),
    content: z.string().optional().default("").describe("本文（HTML 可）"),
    excerpt: z.string().optional().describe("抜粋"),
    status: z.enum(["publish", "draft"]).optional().default("publish").describe("公開状態"),
  },
  async ({ title, content, excerpt, status }) => {
    try {
      const body = { title, content, excerpt: excerpt || "", status };
      const result = await wpFetch("POST", "/posts", body);
      const text = `登録しました（記事）。ID: ${result.id}${result.link ? `, URL: ${result.link}` : ""}`;
      return { content: [{ type: "text", text }] };
    } catch (e) {
      return { content: [{ type: "text", text: `登録失敗: ${e.message}` }], isError: true };
    }
  }
);

// ドッグラン一覧を取得
server.tool(
  "list_dog_runs",
  "WordPress のドッグラン一覧を取得する。",
  {
    per_page: z.number().min(1).max(100).optional().default(10).describe("取得件数"),
  },
  async ({ per_page }) => {
    try {
      const list = await wpFetch("GET", `/dog_run?per_page=${per_page}`);
      const items = Array.isArray(list) ? list : [];
      const summary = items.map((p) => `- ID ${p.id}: ${p.title?.rendered || p.slug} (${p.slug})`).join("\n");
      const text = summary ? `ドッグラン ${items.length} 件:\n${summary}` : "ドッグランは0件です。";
      return { content: [{ type: "text", text }] };
    } catch (e) {
      return { content: [{ type: "text", text: `取得失敗: ${e.message}` }], isError: true };
    }
  }
);

// カフェを1件作成
server.tool(
  "create_cafe",
  "WordPress にカフェを1件登録する。ACF フィールドを JSON で渡す。",
  {
    title: z.string().optional().describe("投稿タイトル（省略時は name を使用）"),
    acf_json: z.string().describe("ACF フィールドの JSON 文字列（name, description, prefecture, city など）"),
    status: z.enum(["publish", "draft"]).optional().default("publish").describe("公開状態"),
  },
  async ({ title, acf_json, status }) => {
    let acf;
    try {
      acf = JSON.parse(acf_json);
    } catch (e) {
      return { content: [{ type: "text", text: `JSON 解析エラー: ${e.message}` }], isError: true };
    }
    const postTitle = title || acf.name || acf.title || "無題";
    const body = { title: postTitle, status, content: acf.description || "", acf };
    try {
      const result = await wpFetch("POST", "/cafe", body);
      const text = `登録しました（カフェ）。ID: ${result.id}, スラッグ: ${result.slug}${result.link ? `, URL: ${result.link}` : ""}`;
      return { content: [{ type: "text", text }] };
    } catch (e) {
      return { content: [{ type: "text", text: `登録失敗: ${e.message}` }], isError: true };
    }
  }
);

// 動物病院を1件作成
server.tool(
  "create_clinic",
  "WordPress に動物病院を1件登録する。ACF フィールドを JSON で渡す。",
  {
    title: z.string().optional().describe("投稿タイトル（省略時は name を使用）"),
    acf_json: z.string().describe("ACF フィールドの JSON 文字列（name, description, prefecture, city など）"),
    status: z.enum(["publish", "draft"]).optional().default("publish").describe("公開状態"),
  },
  async ({ title, acf_json, status }) => {
    let acf;
    try {
      acf = JSON.parse(acf_json);
    } catch (e) {
      return { content: [{ type: "text", text: `JSON 解析エラー: ${e.message}` }], isError: true };
    }
    const postTitle = title || acf.name || acf.title || "無題";
    const body = { title: postTitle, status, content: acf.description || "", acf };
    try {
      const result = await wpFetch("POST", "/clinic", body);
      const text = `登録しました（動物病院）。ID: ${result.id}, スラッグ: ${result.slug}${result.link ? `, URL: ${result.link}` : ""}`;
      return { content: [{ type: "text", text }] };
    } catch (e) {
      return { content: [{ type: "text", text: `登録失敗: ${e.message}` }], isError: true };
    }
  }
);

// 宿泊施設を1件作成
server.tool(
  "create_stay",
  "WordPress に宿泊施設を1件登録する。ACF フィールドを JSON で渡す。",
  {
    title: z.string().optional().describe("投稿タイトル（省略時は name を使用）"),
    acf_json: z.string().describe("ACF フィールドの JSON 文字列（name, description, prefecture, city など）"),
    status: z.enum(["publish", "draft"]).optional().default("publish").describe("公開状態"),
  },
  async ({ title, acf_json, status }) => {
    let acf;
    try {
      acf = JSON.parse(acf_json);
    } catch (e) {
      return { content: [{ type: "text", text: `JSON 解析エラー: ${e.message}` }], isError: true };
    }
    const postTitle = title || acf.name || acf.title || "無題";
    const body = { title: postTitle, status, content: acf.description || "", acf };
    try {
      const result = await wpFetch("POST", "/stay", body);
      const text = `登録しました（宿泊施設）。ID: ${result.id}, スラッグ: ${result.slug}${result.link ? `, URL: ${result.link}` : ""}`;
      return { content: [{ type: "text", text }] };
    } catch (e) {
      return { content: [{ type: "text", text: `登録失敗: ${e.message}` }], isError: true };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
