// ===============================
// Firestore 同期版 counter.js
// ===============================

// Firebase 初期化は HTML 側の <script type="module"> に記述済み
// ここでは db を使う前提で進める
// const db = getFirestore(app);

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
    // 初回ユーザーなら Firestore に作成
    await setDoc(ref, {
      total: 0,
      history: [],
      past: []
    });
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
  await setDoc(ref, {
    total: total,
    history: history,
    past: past
  });
}

// -------------------------------
// カウンター処理
// -------------------------------
let total = 0;
let history = [];
let past = [];

// +1
async function addNumber(num) {
  total += num;

  const now = new Date();
  history.unshift(now.toLocaleString());
  history = history.slice(0, 10);

  document.getElementById("total").textContent = total;

  await saveAll();
  renderHistory();
}

// -1（undo）
async function undo() {
  if (total > 0) total -= 1;

  document.getElementById("total").textContent = total;

  await saveAll();
}

// 月締め
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
// ユーザー切り替え
// -------------------------------
async function switchUser(name) {
  currentUser = name;
  localStorage.setItem("currentUser", name);
  await loadUserData();
}

// -------------------------------
// 初期読み込み
// -------------------------------
loadUserData();
