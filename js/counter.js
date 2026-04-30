// ===============================
// Firestore 同期版 counter.js
// ===============================

// ★ Firebase SDKをここでimport（HTMLのscriptは不要になる）
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

// Firebase設定・初期化
const firebaseConfig = {
  apiKey: "AIzaSyCM7YuhH5I3WGOkV7fbWTGvL4ZZYx46l2Q",
  authDomain: "akionyaan.firebaseapp.com",
  projectId: "akionyaan",
  storageBucket: "akionyaan.firebasestorage.app",
  messagingSenderId: "684249924744",
  appId: "1:684249924744:web:4e6e449d2310c9a9024b3d",
  measurementId: "G-8CMM9BC2B5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// -------------------------------
// ユーザー管理
// -------------------------------
let currentUser = localStorage.getItem("currentUser") || "haruhito";

// -------------------------------
// Firestore からデータを読み込む
// -------------------------------
async function loadUserData() {
  const ref = doc(db, "counters", currentUser);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    total = data.total || 0;
    history = data.history || [];
    past = data.past || [];
  } else {
    await setDoc(ref, { total: 0, history: [], past: [] });
    total = 0;
    history = [];
    past = [];
  }

  document.getElementById("total").textContent = total;
  renderHistory();
  renderPast();
}

// -------------------------------
// Firestore に保存
// -------------------------------
async function saveAll() {
  const ref = doc(db, "counters", currentUser);
  await setDoc(ref, { total, history, past });
}

// -------------------------------
// カウンター処理
// -------------------------------
let total = 0;
let history = [];
let past = [];

async function addNumber(num) {
  total += num;
  const now = new Date();
  history.unshift(now.toLocaleString());
  history = history.slice(0, 10);
  document.getElementById("total").textContent = total;
  await saveAll();
  renderHistory();
}

async function undo() {
  if (total > 0) total -= 1;
  document.getElementById("total").textContent = total;
  await saveAll();
}

async function closeMonth() {
  const now = new Date();
  const month = `${now.getMonth() + 1}月`;
  past.unshift(`${month}：${total}枚`);
  past = past.slice(0, 12);
  total = 0;
  document.getElementById("total").textContent = total;
  await saveAll();
  renderPast();
}

// -------------------------------
// 表示処理
// -------------------------------
function renderHistory() {
  const list = document.getElementById("history");
  list.innerHTML = "";
  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

function renderPast() {
  const list = document.getElementById("past");
  list.innerHTML = "";
  past.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

// -------------------------------
// ★ onclickの代わりにaddEventListenerを使う（moduleではonclickが使えないため）
// -------------------------------
document.getElementById("add-btn").addEventListener("click", () => addNumber(1));
document.getElementById("undo-btn").addEventListener("click", undo);
document.getElementById("close-btn").addEventListener("click", closeMonth);

// リセットボタン（元コードにはなかったので追加）
document.getElementById("reset-btn").addEventListener("click", async () => {
  total = 0;
  document.getElementById("total").textContent = total;
  await saveAll();
});

// -------------------------------
// 初期読み込み
// -------------------------------
loadUserData();