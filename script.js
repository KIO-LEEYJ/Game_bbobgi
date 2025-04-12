function generateBoard() {
  const rows = parseInt(document.getElementById("rows").value, 10);
  const cols = parseInt(document.getElementById("cols").value, 10);
  const winners = parseInt(document.getElementById("winners").value, 10);
  const board = document.getElementById("board");

  if (isNaN(rows) || isNaN(cols) || isNaN(winners)) {
    alert("모든 값을 입력해주세요!");
    return;
  }

  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${cols}, minmax(40px, 1fr))`;

  const total = rows * cols;
  const winnerIndexes = new Set();
  while (winnerIndexes.size < winners) {
    winnerIndexes.add(Math.floor(Math.random() * total));
  }

  for (let i = 0; i < total; i++) {
    const cell = document.createElement("div");
    cell.className =
      "w-10 h-10 flex items-center justify-center border rounded cursor-pointer bg-white hover:bg-pink-200";
    cell.innerText = i + 1;
    cell.onclick = function () {
      if (winnerIndexes.has(i)) {
        this.classList.add("bg-yellow-300", "font-bold");
        this.innerText = "🎉";
      } else {
        this.classList.add("text-gray-300", "line-through");
      }
      this.onclick = null;
    };
    board.appendChild(cell);
  }
}
