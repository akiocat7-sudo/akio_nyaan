// js/counter.js

// ログイン中のユーザー名を取得（login画面などでセットされている想定）
const currentUser = localStorage.getItem("currentUser");

// ユーザーごとの保存キー
const keyName = "total_" + currentUser;      // 今月の合計
const historyKey = "history_" + currentUser; // ボタン押下履歴（最新10件）
const pastKey = "past_" + currentUser;       // 過去12ヶ月分

// 2人用テーマカラー
const themes = {
  haruhito: "#1E88E5", // Tokyo Blue
  chika: "#7E57C2"     // Metro Purple
};

// 選択されたテーマカラー
const themeColor = themes[currentUser] || "#1E88E5";

// ページにテーマを適用
document.documentElement.style.setProperty("--theme-color", themeColor);

// 保存されている値を読み込む（なければ0）
let total = Number(localStorage.getItem(keyName)) || 0;

// 履歴を読み込む（なければ空配列）
let history = JSON.parse(localStorage.getItem(historyKey)) || [];

// 過去の月締め履歴（最大12件）
let past = JSON.parse(localStorage.getItem(pastKey)) || [];

// 直前の操作（今は -1 ボタンでは使わないが残しておく）
let lastAdded = 0;

// 画面に反映
document.getElementById("total").textContent = total;

// 月名をタイトルに反映
const monthNames = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
const nowForTitle = new Date();
const currentMonthForTitle = monthNames[nowForTitle.getMonth()];
document.getElementById("month-title").textContent = `${currentMonthForTitle}のシール枚数`;

// 履歴・過去履歴を描画
renderHistory();
renderPast();


// --------------------------------------
//  シールを1枚貼る（+1）
// --------------------------------------
function addNumber(num) {
  lastAdded = num;
  total += num;

  document.getElementById("total").textContent = total;
  localStorage.setItem(keyName, total);

  // --- 履歴追加（日時記録） ---
  const now = new Date();
  const timestamp =
    now.getFullYear() + "/" +
    String(now.getMonth() + 1).padStart(2, "0") + "/" +
    String(now.getDate()).padStart(2, "0") + " " +
    String(now.getHours()).padStart(2, "0") + ":" +
    String(now.getMinutes()).padStart(2, "0") + ":" +
    String(now.getSeconds()).padStart(2, "0");

  history.unshift(timestamp);        // 先頭に追加
  history = history.slice(0, 10);    // 最新10件だけ保持

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
  if (!list) return;
  list.innerHTML = "";

  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}


// --------------------------------------
//  シールを剥がす（-1）
// --------------------------------------
function undo() {
  if (total > 0) {
    total -= 1;
  }

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


// --------------------------------------
//  今月のシール枚数を確定する
//  ・「4月：23枚」のように記録
//  ・最大12件保持
//  ・今月のカウンターを0にリセット
// --------------------------------------
function closeMonth() {
  const now = new Date();
  const currentMonth = monthNames[now.getMonth()];

  // 記録を追加（例： "4月：23枚"）
  past.unshift(`${currentMonth}：${total}枚`);

  // 最大12件に制限
  past = past.slice(0, 12);

  // 保存
  localStorage.setItem(pastKey, JSON.stringify(past));

  // カウンターをリセット
  total = 0;
  document.getElementById("total").textContent = total;
  localStorage.setItem(keyName, total);

  // 表示更新
  renderPast();
}


// --------------------------------------
//  過去の枚数を画面に表示（最大12件）
// --------------------------------------
function renderPast() {
  const list = document.getElementById("past-list");
  if (!list) return;
  list.innerHTML = "";

  past.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}
