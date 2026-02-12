document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const statusDiv = document.getElementById('status');
  const dirBtns = document.querySelectorAll('.dir-btn');
  const directionSelect = document.getElementById('directionSelect');
  const waitBtns = document.querySelectorAll('.wait-btn');
  const waitTimeSelect = document.getElementById('waitTimeSelect');
  let selectedDirection = 'right';
  let selectedWaitTime = 3;

  function updateStatus(message, isActive = false) {
    statusDiv.textContent = message;
    statusDiv.className = isActive ? 'status-active' : '';
  }

  function setCapturing(active) {
    startBtn.disabled = active;
    startBtn.style.display = active ? 'none' : 'block';
    stopBtn.style.display = active ? 'block' : 'none';
    directionSelect.style.display = active ? 'none' : 'block';
    waitTimeSelect.style.display = active ? 'none' : 'block';
  }

  // 方向選択ボタン
  dirBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedDirection = btn.dataset.dir;
      dirBtns.forEach(b => {
        b.classList.remove('selected');
        b.style.backgroundColor = '#888';
      });
      btn.classList.add('selected');
      btn.style.backgroundColor = '#4CAF50';
    });
  });

  // 待機時間選択ボタン
  waitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedWaitTime = parseInt(btn.dataset.wait);
      waitBtns.forEach(b => {
        b.classList.remove('selected');
        b.style.backgroundColor = '#888';
      });
      btn.classList.add('selected');
      btn.style.backgroundColor = '#4CAF50';
    });
  });

  // バックグラウンドスクリプトとの通信
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'status') {
      updateStatus(message.text, message.isActive);
    } else if (message.type === 'completed') {
      updateStatus('完了！PDFをダウンロードしました。', false);
      setCapturing(false);
    } else if (message.type === 'error') {
      updateStatus('エラー: ' + message.text, false);
      setCapturing(false);
    }
  });

  // 開始ボタン
  startBtn.addEventListener('click', async () => {
    try {
      setCapturing(true);
      updateStatus('キャプチャを開始しています...', true);

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.runtime.sendMessage({
        type: 'startCapture',
        tabId: tab.id,
        direction: selectedDirection,
        waitTime: selectedWaitTime
      });
    } catch (error) {
      updateStatus('エラー: ' + error.message, false);
      setCapturing(false);
    }
  });

  // 停止ボタン
  stopBtn.addEventListener('click', () => {
    updateStatus('停止中...ここまでのキャプチャをPDF化します', true);
    chrome.runtime.sendMessage({ type: 'stopCapture' });
  });

  // 初期状態を確認
  chrome.runtime.sendMessage({ type: 'getStatus' }, (response) => {
    if (response && response.status) {
      updateStatus(response.status, response.isActive);
      setCapturing(response.isActive);
    }
  });
});
