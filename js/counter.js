// ログイン中のユーザー名を取得
const currentUser = localStorage.getItem("currentUser");

// ユーザーごとの保存キー
const keyName = "total_" + currentUser;

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

// 直前の操作
let lastAdded = 0;

// 画面に反映
document.getElementById("total").textContent = total;

function addNumber(num) {
  lastAdded = num;
  total += num;

  document.getElementById("total").textContent = total;

  // ユーザーごとに保存
  localStorage.setItem(keyName, total);
}

function undo() {
  if (lastAdded === 0) return;

  total -= lastAdded;
  lastAdded = 0;

  document.getElementById("total").textContent = total;
  localStorage.setItem(keyName, total);
}

function resetTotal() {
  total = 0;
  lastAdded = 0;

  document.getElementById("total").textContent = total;
  localStorage.setItem(keyName, total);
}
