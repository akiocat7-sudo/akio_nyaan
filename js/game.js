const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// キャラクター
const player = {
  x: 50,
  y: 150,
  width: 40,
  height: 40,
  speed: 3,
  moving: { up: false, down: false, left: false, right: false }
};

// キーボード入力
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") player.moving.up = true;
  if (e.key === "ArrowDown") player.moving.down = true;
  if (e.key === "ArrowLeft") player.moving.left = true;
  if (e.key === "ArrowRight") player.moving.right = true;
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowUp") player.moving.up = false;
  if (e.key === "ArrowDown") player.moving.down = false;
  if (e.key === "ArrowLeft") player.moving.left = false;
  if (e.key === "ArrowRight") player.moving.right = false;
});

// 十字キー（スマホ用）
const bindButton = (selector, direction) => {
  const btn = document.querySelector(selector);
  btn.addEventListener("touchstart", () => player.moving[direction] = true);
  btn.addEventListener("touchend", () => player.moving[direction] = false);
  btn.addEventListener("mousedown", () => player.moving[direction] = true);
  btn.addEventListener("mouseup", () => player.moving[direction] = false);
};

bindButton(".up", "up");
bindButton(".down", "down");
bindButton(".left", "left");
bindButton(".right", "right");

// ゲームループ
function update() {
  if (player.moving.up) player.y -= player.speed;
  if (player.moving.down) player.y += player.speed;
  if (player.moving.left) player.x -= player.speed;
  if (player.moving.right) player.x += player.speed;

  // 画面外に出ないように
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
