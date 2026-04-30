// ログイン中のユーザー名を取得
const currentUser = localStorage.getItem("currentUser");

// ユーザーごとの保存キー
const keyName = "total_" + currentUser;
const historyKey = "history_" + currentUser; // ← 履歴用キー

// 2人用テーマカラー
const themes = {
  haruhito: "#1E88E5", // Tokyo Blue
  chika: "#7E57C2"     // Metro Purple
};

// 選択されたテーマカラー
const themeColor = themes[currentUser];

// ページにテーマを適用
document.documentElement.style.setProperty("--theme-color", themeColor);

// 保存されている値を読み込む（なければ0）
let total = Number(localStorage.getItem(keyName)) || 0;

// 履歴を読み込む（なければ空配列）
let history = JSON.parse(localStorage.getItem(historyKey)) || [];

// 直前の操作
let lastAdded = 0;

// 画面に反映
document.getElementById("total").textContent = total;
renderHistory();


// --------------------------------------
//  シール1枚貼る（+1）
// --------------------------------------
function addNumber(num) {
  lastAdded = num;
  total += num;

  document.getElementById("total").textContent = total;
  localStorage.setItem(keyName, total);

  // --- 履歴追加 ---
  const now = new Date();
  const timestamp =
    now.getFullYear() + "/" +
    String(now.getMonth() + 1).padStart(2, "0") + "/" +
    String(now.getDate()).padStart(2, "0") + " " +
    String(now.getHours()).padStart(2, "0") + ":" +
    String(now.getMinutes()).padStart(2, "0") + ":" +
    String(now.getSeconds()).padStart(2, "0");

  history.unshift(timestamp); // 先頭に追加
  history = history.slice(0, 10); // 最新10件だけ保持

  localStorage.setItem(historyKey, JSON.stringify(history));
  renderHistory();

  // --- シール演出 ---
  const area = document.getElementById("sticker-effect-area");
  const sticker = document.createElement("div");
  sticker.className = "sticker-pop";
  sticker.textContent = "🟡";
  area.appendChild(sticker);

  setTimeout(() => {
    sticker.remove();
  }, 600);
}


// --------------------------------------
//  履歴を画面に表示
// --------------------------------------
function renderHistory() {
  const list = document.getElementById("history-list");
  list.innerHTML = "";

  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}


// --------------------------------------
//  ひとつ前に戻る（UNDO）
// --------------------------------------
function undo() {
  if (lastAdded === 0) return;

  total -= lastAdded;
  lastAdded = 0;

  document.getElementById("total").textContent = total;
  localStorage.setItem(keyName, total);
}


// --------------------------------------
//  リセット（0に戻す）
// --------------------------------------
function resetTotal() {
  total = 0;
  lastAdded = 0;

  document.getElementById("total").textContent = total;
  localStorage.setItem(keyName, total);
}
