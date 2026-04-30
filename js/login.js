function loginAs(user) {
  const message = document.getElementById("message");

  message.style.color = "green";
  message.textContent = "ログイン成功しました！";

  // ユーザーごとの遷移先
  const pages = {
    user1: "menu_user1.html",
    user2: "menu_user2.html",
    user3: "menu_user3.html",
    user4: "menu_user4.html"
  };

  // 1秒後に遷移
  setTimeout(() => {
    window.location.href = pages[user];
  }, 1000);
}
