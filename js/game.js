const game = document.getElementById("game");

const scenes = {
  start: {
    text: "深夜0時。あなたは人気のないビルの一室で、倒れている人物を発見した。",
    choices: [
      { text: "周囲を調べる", next: "search" },
      { text: "警察に通報する", next: "call" }
    ]
  },
  search: {
    text: "部屋にはコーヒーの香りと、机の上に開いたノートPC。画面には『最後のログ』という文字。",
    choices: [
      { text: "ノートPCを調べる", next: "pc" },
      { text: "部屋の外に出る", next: "hall" }
    ]
  },
  call: {
    text: "あなたは警察に通報した。しかし、電話の向こうで妙な沈黙が続く…。",
    choices: [
      { text: "もう一度話しかける", next: "weird" },
      { text: "電話を切る", next: "start" }
    ]
  },
  pc: {
    text: "PCには暗号化されたファイルが1つだけ残っていた。タイトルは『真相』。",
    choices: [
      { text: "ファイルを開く", next: "truth" },
      { text: "部屋を出る", next: "hall" }
    ]
  },
  hall: {
    text: "廊下は静まり返っている。非常灯だけがぼんやり光っている。",
    choices: [
      { text: "エレベーターへ向かう", next: "elevator" },
      { text: "階段を降りる", next: "stairs" }
    ]
  },
  truth: {
    text: "画面に映し出されたのは、あなた自身の名前だった。『犯人は…あなた』",
    choices: [
      { text: "最初に戻る", next: "start" }
    ]
  },
  weird: {
    text: "電話の向こうから、あなたの名前を呼ぶ声がした。『後ろを見て』",
    choices: [
      { text: "振り返る", next: "truth" }
    ]
  },
  elevator: {
    text: "エレベーターは停止中。階数表示が『？』になっている。",
    choices: [
      { text: "階段に戻る", next: "stairs" }
    ]
  },
  stairs: {
    text: "階段を降りようとした瞬間、下の階から足音が聞こえた。",
    choices: [
      { text: "隠れる", next: "truth" },
      { text: "声をかける", next: "truth" }
    ]
  }
};

function render(sceneKey) {
  const scene = scenes[sceneKey];
  game.innerHTML = `<p>${scene.text}</p>`;
  scene.choices.forEach(choice => {
    const div = document.createElement("div");
    div.className = "choice";
    div.textContent = choice.text;
    div.onclick = () => render(choice.next);
    game.appendChild(div);
  });
}

render("start");
