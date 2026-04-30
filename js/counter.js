// 保存されている値を読み込む（なければ0）
let total = Number(localStorage.getItem("totalValue")) || 0;

// 直前に押した数値を保存する変数
let lastAdded = 0;

// 画面に反映
document.getElementById("total").textContent = total;

function addNumber(num) {
  lastAdded = num; // 直前の操作を記録
  total += num;

  document.getElementById("total").textContent = total;
  localStorage.setItem("totalValue", total);
}

function resetTotal() {
  total = 0;
  lastAdded = 0;
  document.getElementById("total").textContent = total;
  localStorage.setItem("totalValue", total);
}

function undo() {
  // 直前の操作がない場合は何もしない
  if (lastAdded === 0) return;

  total -= lastAdded;   // 直前の操作を取り消す
  lastAdded = 0;        // 取り消したのでリセット

  document.getElementById("total").textContent = total;
  localStorage.setItem("totalValue", total);
}
