let boardData = []

function generateBoard() {
  const rows = parseInt(document.getElementById("rows").value)
  const cols = parseInt(document.getElementById("cols").value)
  const winners = parseInt(document.getElementById("winners").value)
  const total = rows * cols

  boardData = Array(total).fill("꽝")
  const indices = [...Array(total).keys()]
  for (let i = 0; i < winners; i++) {
    const rand = Math.floor(Math.random() * indices.length)
    const selected = indices.splice(rand, 1)[0]
    boardData[selected] = "당첨"
  }

  const board = document.getElementById("board")
  board.innerHTML = ""
  board.style.gridTemplateColumns = `repeat(${cols}, minmax(60px, 1fr))`

  for (let i = 0; i < total; i++) {
    const tile = document.createElement("div")
    tile.className = "tile tile-default"
    tile.innerText = i + 1
    tile.onclick = function () {
      if (tile.dataset.clicked) return
      tile.dataset.clicked = true
      const result = boardData[i]
      setTimeout(() => {
        tile.classList.remove("tile-default")
        if (result === "당첨") {
          tile.classList.add("tile-win")
          tile.innerText = "🎉"
        } else {
          tile.classList.add("tile-lose")
          tile.innerText = "❌"
        }
      }, 150)
    }
    board.appendChild(tile)
  }
}
