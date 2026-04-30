function loginAs(user) {
  // ログインしたユーザー名を保存
  localStorage.setItem("currentUser", user);

  // カウンター画面へ遷移
  window.location.href = "counter.html";
}
