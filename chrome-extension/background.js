// jsPDFをサービスワーカーに読み込む
importScripts('jspdf.umd.min.js');

// キャプチャ状態管理
let isCapturing = false;
let capturedImages = [];
let currentTabId = null;
let captureCount = 0;
let lastCaptureDataUrl = null;
let debuggerAttached = false;
let pageDirection = 'right'; // 'right' or 'left'
let waitTime = 3; // ページ遷移の待機時間（秒）
let isFinishing = false; // finishCapture 二重実行防止

// メッセージリスナー
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'startCapture') {
    pageDirection = message.direction || 'right';
    waitTime = message.waitTime || 3;
    startCaptureSequence(message.tabId);
    sendResponse({ success: true });
  } else if (message.type === 'stopCapture') {
    stopCaptureAndGeneratePDF();
    sendResponse({ success: true });
  } else if (message.type === 'getStatus') {
    sendResponse({
      status: isCapturing ? 'キャプチャ中...' : '準備完了',
      isActive: isCapturing
    });
  }
  return true;
});

// ========== メイン処理 ==========

async function startCaptureSequence(tabId) {
  if (isCapturing) {
    console.log('[BG] 既にキャプチャ中です');
    return;
  }

  console.log('[BG] キャプチャシーケンスを開始します', { tabId });
  isCapturing = true;
  capturedImages = [];
  currentTabId = tabId;
  captureCount = 0;
  lastCaptureDataUrl = null;

  try {
    sendStatusToPopup('デバッガーを接続中...', true);

    // デバッガーを接続
    await attachDebugger(tabId);

    sendStatusToPopup('最初のページをキャプチャ中...', true);

    // 最初のページをキャプチャ
    await captureCurrentPage(tabId);

    // 自動ループ開始
    await captureLoop(tabId);

  } catch (error) {
    console.error('[BG] キャプチャ開始エラー:', error);
    sendStatusToPopup('エラー: ' + error.message, false);
    await cleanup();
  }
}

// キャプチャループ（完全自動）
async function captureLoop(tabId) {
  while (isCapturing) {
    try {
      sendStatusToPopup(`ページ ${captureCount} キャプチャ済み。次のページに移動中...`, true);

      // 矢印キーを送信して次のページに移動
      await sendArrowKey(tabId, pageDirection);

      // 指定秒数待機（ページの読み込みを待つ）
      await sleep(waitTime * 1000);

      if (!isCapturing) break;

      // キャプチャ
      await captureCurrentPage(tabId);

      // 前回と同じ画像なら終了（最後のページに到達）
      if (capturedImages.length >= 2) {
        const current = capturedImages[capturedImages.length - 1].url;
        const previous = capturedImages[capturedImages.length - 2].url;
        if (current === previous) {
          console.log('[BG] 同じ画像を検出。最後のページに到達しました');
          // 重複を削除
          capturedImages.pop();
          captureCount--;
          break;
        }
      }

    } catch (error) {
      console.error('[BG] ループエラー:', error);
      break;
    }
  }

  // 終了処理
  await finishCapture();
}

// 途中停止してPDF化
async function stopCaptureAndGeneratePDF() {
  console.log('[BG] 停止要求を受信。ここまでのキャプチャをPDF化します');
  isCapturing = false;
  // finishCapture は captureLoop の while を抜けた後に呼ばれる
  // ただし sleep 中の場合があるので、直接 finishCapture を呼ぶ
  await finishCapture();
}

// ========== デバッガー API ==========

async function attachDebugger(tabId) {
  if (debuggerAttached) {
    try {
      await chrome.debugger.detach({ tabId });
    } catch (e) { /* ignore */ }
  }

  await chrome.debugger.attach({ tabId }, '1.3');
  debuggerAttached = true;
  console.log('[BG] デバッガー接続成功');
}

async function detachDebugger(tabId) {
  if (debuggerAttached && tabId) {
    try {
      await chrome.debugger.detach({ tabId });
    } catch (e) { /* ignore */ }
    debuggerAttached = false;
    console.log('[BG] デバッガー切断');
  }
}

// 矢印キーを送信（isTrusted: true になる）
async function sendArrowKey(tabId, direction) {
  const isRight = direction === 'right';
  const key = isRight ? 'ArrowRight' : 'ArrowLeft';
  const code = isRight ? 'ArrowRight' : 'ArrowLeft';
  const vkCode = isRight ? 39 : 37;

  console.log('[BG]', key, 'キーを送信します');

  await chrome.debugger.sendCommand({ tabId }, 'Input.dispatchKeyEvent', {
    type: 'keyDown',
    key, code,
    windowsVirtualKeyCode: vkCode,
    nativeVirtualKeyCode: vkCode
  });

  await sleep(50);

  await chrome.debugger.sendCommand({ tabId }, 'Input.dispatchKeyEvent', {
    type: 'keyUp',
    key, code,
    windowsVirtualKeyCode: vkCode,
    nativeVirtualKeyCode: vkCode
  });

  console.log('[BG]', key, 'キー送信完了');
}

// ========== キャプチャ ==========

async function captureCurrentPage(tabId) {
  const tab = await chrome.tabs.get(tabId).catch(() => null);
  if (!tab) {
    throw new Error('タブが見つかりません');
  }

  // CDP の Page.getLayoutMetrics でビューポートサイズを取得
  const metrics = await chrome.debugger.sendCommand({ tabId }, 'Page.getLayoutMetrics');
  const vw = metrics.cssVisualViewport.clientWidth;
  const vh = metrics.cssVisualViewport.clientHeight;

  // CDP の Page.captureScreenshot で高解像度キャプチャ（2倍スケール）
  const result = await chrome.debugger.sendCommand({ tabId }, 'Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: 0,
      y: 0,
      width: vw,
      height: vh,
      scale: 2  // 2倍解像度でキャプチャ
    },
    captureBeyondViewport: false
  });

  const dataUrl = 'data:image/png;base64,' + result.data;

  capturedImages.push({
    url: dataUrl,
    pageUrl: tab.url,
    timestamp: Date.now(),
    index: captureCount++
  });

  sendStatusToPopup(`ページ ${captureCount} をキャプチャしました`, true);
  console.log('[BG] ページ', captureCount, 'をキャプチャしました（高解像度）');
}

// ========== PDF生成 ==========

async function finishCapture() {
  // 二重実行防止
  if (isFinishing) {
    console.log('[BG] finishCapture は既に実行中です');
    return;
  }
  isFinishing = true;
  isCapturing = false;

  // デバッガーを切断
  await detachDebugger(currentTabId);

  if (capturedImages.length === 0) {
    sendStatusToPopup('キャプチャされた画像がありません。', false);
    sendMessageToPopup({ type: 'error', text: 'キャプチャされた画像がありません' });
    await cleanup();
    return;
  }

  sendStatusToPopup(`PDFを生成しています... (${capturedImages.length}ページ)`, true);

  try {
    await generatePDF();
    sendStatusToPopup('完了！PDFをダウンロードしました。', false);
    sendMessageToPopup({ type: 'completed' });
  } catch (error) {
    console.error('[BG] PDF生成エラー:', error);
    sendStatusToPopup('エラー: ' + error.message, false);
    sendMessageToPopup({ type: 'error', text: error.message });
  }

  await cleanup();
}

async function cleanup() {
  await detachDebugger(currentTabId);
  capturedImages = [];
  currentTabId = null;
  captureCount = 0;
  lastCaptureDataUrl = null;
  isCapturing = false;
  isFinishing = false;
}

// base64 PNGからピクセルサイズを取得
function getPngDimensions(dataUrl) {
  try {
    // data:image/png;base64,... から base64 部分を取得
    const base64 = dataUrl.split(',')[1];
    // base64 をバイト配列に変換（先頭部分だけでOK）
    const binary = atob(base64.substring(0, 100));
    // PNGヘッダー: 幅は16-19バイト目、高さは20-23バイト目（IHDRチャンク内）
    const width = (binary.charCodeAt(16) << 24) | (binary.charCodeAt(17) << 16) |
                  (binary.charCodeAt(18) << 8) | binary.charCodeAt(19);
    const height = (binary.charCodeAt(20) << 24) | (binary.charCodeAt(21) << 16) |
                   (binary.charCodeAt(22) << 8) | binary.charCodeAt(23);
    return { width, height };
  } catch (e) {
    console.error('[BG] PNG寸法取得エラー:', e);
    return null;
  }
}

// PDF生成（サービスワーカー内で直接実行、別タブ不要）
async function generatePDF() {
  console.log('[BG] PDF生成開始:', capturedImages.length, 'ページ');

  // 最初の画像からアスペクト比を取得してPDFページサイズを決定
  const dims = getPngDimensions(capturedImages[0].url);
  let pdfWidth, pdfHeight;

  if (dims && dims.width > 0 && dims.height > 0) {
    console.log('[BG] 画像サイズ:', dims.width, 'x', dims.height);
    // 画像のアスペクト比を維持したPDFページサイズ（mm単位）
    // 横幅を297mm（A4横）に合わせて高さを算出
    pdfWidth = 297;
    pdfHeight = (dims.height / dims.width) * pdfWidth;
  } else {
    // フォールバック: A4横
    pdfWidth = 297;
    pdfHeight = 210;
  }

  const { jsPDF } = jspdf;
  const pdf = new jsPDF({
    orientation: pdfWidth >= pdfHeight ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [pdfWidth, pdfHeight]
  });

  for (let i = 0; i < capturedImages.length; i++) {
    if (i > 0) pdf.addPage([pdfWidth, pdfHeight]);

    sendStatusToPopup(`PDF生成中... (${i + 1}/${capturedImages.length})`, true);

    try {
      // 画像をページ全体にぴったり配置（アスペクト比一致済み）
      pdf.addImage(capturedImages[i].url, 'PNG', 0, 0, pdfWidth, pdfHeight);
    } catch (e) {
      console.error('[BG] 画像追加エラー:', i, e);
    }
  }

  const pdfDataUri = pdf.output('datauristring');
  console.log('[BG] PDF生成完了。ダウンロードを開始します');

  await chrome.downloads.download({
    url: pdfDataUri,
    filename: 'kindle-capture-' + Date.now() + '.pdf',
    saveAs: false
  });

  console.log('[BG] PDFダウンロード開始');
}

// ========== ユーティリティ ==========

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sendStatusToPopup(message, isActive) {
  chrome.runtime.sendMessage({
    type: 'status',
    text: message,
    isActive: isActive
  }).catch(() => { });
}

function sendMessageToPopup(message) {
  chrome.runtime.sendMessage(message).catch(() => { });
}

// デバッガー切断の検出
chrome.debugger.onDetach.addListener((source, reason) => {
  console.log('[BG] デバッガーが切断されました:', reason);
  debuggerAttached = false;
  if (isCapturing) {
    isCapturing = false;
    finishCapture();
  }
});
