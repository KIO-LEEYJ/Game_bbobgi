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

async function updateBanner(type, imgId, linkId) {
  try {
    const res = await fetch(`https://script.google.com/macros/s/AKfycbycPlbKIdi871uncqIz2ApYZ9C5GN4DKbUoqQP76cIlshJbwtYWVgfxI1c5akaEW9ajQA/exec?type=${type}`);
    const data = await res.json();
    document.getElementById(imgId).src = data.imageUrl;
    document.getElementById(linkId).href = data.linkUrl;
  } catch (e) {
    console.error(`[${type}] 배너 불러오기 실패:`, e);
  }
}

// A/B 배너 초기 로딩 및 10초마다 자동 갱신
updateBanner('A', 'banner-a-img', 'banner-a-link');
setInterval(() => updateBanner('A', 'banner-a-img', 'banner-a-link'), 10000);

updateBanner('B', 'banner-b-img', 'banner-b-link');
setInterval(() => updateBanner('B', 'banner-b-img', 'banner-b-link'), 10000);
