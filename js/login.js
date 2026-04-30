function loginAs(user) {
  localStorage.setItem("currentUser", user);
  window.location.href = "counter.html";
}
