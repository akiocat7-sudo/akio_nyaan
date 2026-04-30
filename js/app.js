/**
 * app.js — ユーザーリスト読み込み & ワンクリックログイン
 *
 * users.json を fetch() で読み込み、ユーザーカードを生成します。
 * カードをクリックするだけでそのユーザーとしてログイン状態になります。
 *
 * GitHub Pages では同じリポジトリの users.json が自動的に読まれます。
 */

const USERS_JSON = 'users.json'; // ユーザーリストのパス

// ロールに対応するCSSクラスと表示名
const ROLE_MAP = {
  '管理者': 'role-admin',
  '編集者': 'role-editor',
  '閲覧者': 'role-viewer',
};

// --- DOM 要素 ---
const loginView    = document.getElementById('login-view');
const loggedInView = document.getElementById('logged-in-view');
const userList     = document.getElementById('user-list');
const userCount    = document.getElementById('user-count');
const searchInput  = document.getElementById('search');
const logoutBtn    = document.getElementById('logout-btn');

let allUsers = []; // 読み込んだ全ユーザー

// =============================================
// 初期化
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  loadUsers();

  searchInput.addEventListener('input', () => {
    renderUsers(filterUsers(searchInput.value));
  });

  logoutBtn.addEventListener('click', logout);
});

// =============================================
// ユーザー読み込み
// =============================================
async function loadUsers() {
  showLoading();

  try {
    const res = await fetch(USERS_JSON);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    allUsers = await res.json();
    renderUsers(allUsers);
  } catch (err) {
    console.error('ユーザー読み込みエラー:', err);
    showError('ユーザーリストを読み込めませんでした。<br>users.json が同じフォルダにあるか確認してください。');
  }
}

// =============================================
// フィルタリング
// =============================================
function filterUsers(query) {
  const q = query.trim().toLowerCase();
  if (!q) return allUsers;
  return allUsers.filter(u =>
    u.name.toLowerCase().includes(q) ||
    u.username.toLowerCase().includes(q) ||
    u.role.toLowerCase().includes(q)
  );
}

// =============================================
// レンダリング
// =============================================
function renderUsers(users) {
  userList.innerHTML = '';
  userCount.textContent = `${users.length} 人`;

  if (users.length === 0) {
    userList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>一致するユーザーが見つかりません</p>
      </div>`;
    return;
  }

  users.forEach((user, i) => {
    const card = createUserCard(user, i);
    userList.appendChild(card);
  });
}

function createUserCard(user, index) {
  const roleClass = ROLE_MAP[user.role] || 'role-viewer';

  const card = document.createElement('div');
  card.className = 'user-card';
  card.style.animationDelay = `${index * 0.05}s`;
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `${user.name} としてログイン`);

  card.innerHTML = `
    <div class="avatar">${escapeHtml(user.avatar || user.name.slice(0, 2))}</div>
    <div class="user-info">
      <div class="user-name">${escapeHtml(user.name)}</div>
      <div class="user-username">@${escapeHtml(user.username)}</div>
    </div>
    <span class="role-badge ${roleClass}">${escapeHtml(user.role)}</span>
    <svg class="login-arrow" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>`;

  card.addEventListener('click', () => login(user));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      login(user);
    }
  });

  return card;
}

// =============================================
// ログイン / ログアウト
// =============================================
function login(user) {
  // セッションにユーザー情報を保存（ページリロード後も維持）
  sessionStorage.setItem('currentUser', JSON.stringify(user));

  showLoggedInView(user);
}

function logout() {
  sessionStorage.removeItem('currentUser');
  searchInput.value = '';
  showLoginView();
  renderUsers(allUsers);
}

// =============================================
// 画面切り替え
// =============================================
function showLoginView() {
  loginView.style.display = 'block';
  loggedInView.style.display = 'none';
}

function showLoggedInView(user) {
  loginView.style.display = 'none';
  loggedInView.style.display = 'block';

  const roleClass = ROLE_MAP[user.role] || 'role-viewer';

  document.getElementById('li-avatar').textContent    = user.avatar || user.name.slice(0, 2);
  document.getElementById('li-name').textContent      = user.name;
  document.getElementById('li-username').textContent  = `@${user.username}`;

  const roleBadge = document.getElementById('li-role');
  roleBadge.textContent = user.role;
  roleBadge.className   = `role-badge ${roleClass}`;
}

// =============================================
// UI ヘルパー
// =============================================
function showLoading() {
  userList.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>読み込み中...</p>
    </div>`;
}

function showError(msg) {
  userList.innerHTML = `<div class="error-state">⚠️ ${msg}</div>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
