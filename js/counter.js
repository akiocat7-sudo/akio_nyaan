// ===============================
// Firebase 初期化
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3z0Qxj0u6y8x0qY6qv1t8o0x0x0x0x0",
  authDomain: "seal-counter.firebaseapp.com",
  projectId: "seal-counter",
  storageBucket: "seal-counter.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:xxxxxxxxxxxx"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===============================
// ユーザー判定
// ===============================
const currentUser = localStorage.getItem("currentUser") || "haruhito";
const userDoc = doc(db, "counters", currentUser);

// ===============================
// 月名を自動表示（例：4月のシール枚数）
// ===============================
const monthNames = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
const now = new Date();
const currentMonth = monthNames[now.getMonth()];
document.getElementById("month-title").textContent = `${currentMonth}のシール枚数`;

// ===============================
// UI 要素
// ===============================
const totalEl = document.getElementById("total");
const historyEl = document.getElementById("history");
const pastEl = document.getElementById("past");

let total = 0;
let history = [];
let past = [];

// ===============================
// Firestore からデータ読み込み
// ===============================
async function loadData() {
  const snap = await getDoc(userDoc);

  if (snap.exists()) {
    const data = snap.data();
    total = data.total || 0;
    history = data.history || [];
    past = data.past || [];
  } else {
    await setDoc(userDoc, {
      total: 0,
      history: [],
      past: []
    });
  }

  render();
}

// ===============================
// Firestore に保存
// ===============================
async function saveAll() {
  await updateDoc(userDoc, {
    total: total,
    history: history,
    past: past
  });
}

// ===============================
// 画面描画
// ===============================
function render() {
  totalEl.textContent = total;

  historyEl.innerHTML = "";
  history.slice().reverse().forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    historyEl.appendChild(li);
  });

  pastEl.innerHTML = "";
  past.slice().reverse().forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    pastEl.appendChild(li);
  });
}

// ===============================
// シール追加（メインボタン）
// ===============================
document.getElementById("add-btn").addEventListener("click", async () => {
  total++;
  const time = new Date().toLocaleString("ja-JP");
  history.push(`${time}：+1枚`);

  render();
  await saveAll();
});

// ===============================
// Undo（シールを剥がす）
// ===============================
document.getElementById("undo-btn").addEventListener("click", async () => {
  if (total > 0) {
    total--;
    const time = new Date().toLocaleString("ja-JP");
    history.push(`${time}：-1枚`);

    render();
    await saveAll();
  }
});

// ===============================
// 月締め（履歴の下に配置）
// ===============================
document.getElementById("close-btn").addEventListener("click", async () => {
  const monthLabel = `${currentMonth}：${total}枚`;

  past.push(monthLabel);

  // 今月のデータをリセット
  total = 0;
  history = [];

  render();
  await saveAll();
});

// ===============================
// 初期読み込み
// ===============================
loadData();
