fetch("https://api.countapi.xyz/hit/aki-website/visits")
  .then(response => response.json())
  .then(data => {
    document.getElementById("count").textContent = data.value;
  })
  .catch(error => {
    console.error("カウンター取得エラー:", error);
  });
