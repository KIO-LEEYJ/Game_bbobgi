// 초기 설정값
let defaultTotalTiles = 25; // 기본 총 칸수
const minTileSize = 140;
const maxBoardWidth = 1600;
const gapSize = 20; // 타일 간격

// 시작 버튼 클릭 시 실행할 함수
function startGame() {
  const totalInput = document.getElementById("totalTiles");
  const totalTiles = parseInt(totalInput?.value) || defaultTotalTiles;
  generateGrid(totalTiles);
}

// 그리드 생성 함수
function generateGrid(totalTiles) {
  const board = document.getElementById("board");
  board.innerHTML = ""; // 기존 타일 초기화

  // 최적 가로열수 찾기
  let bestCols = 1;
  let bestTileSize = minTileSize;

  for (let cols = 1; cols <= totalTiles; cols++) {
    const tentativeTileSize = (maxBoardWidth - (cols - 1) * gapSize) / cols;
    if (tentativeTileSize >= minTileSize) {
      bestCols = cols;
      bestTileSize = tentativeTileSize;
    } else {
      break;
    }
  }

  const rows = Math.ceil(totalTiles / bestCols);

  // 그리드 스타일 적용
  board.className = "grid gap-5";
  board.style.gridTemplateColumns = `repeat(${bestCols}, ${bestTileSize}px)`;
  board.style.width = `${maxBoardWidth}px`;

  // 랜덤 당첨 타일 선택
  let winnerIndices = new Set();
  while (winnerIndices.size < Math.min(totalTiles, 1)) {
    const randomIndex = Math.floor(Math.random() * totalTiles);
    winnerIndices.add(randomIndex);
  }

  // 타일 생성 및 이벤트 추가
  for (let i = 0; i < totalTiles; i++) {
    const tile = document.createElement("div");
    tile.className = "tile tile-default flex items-center justify-center";
    tile.style.width = `${bestTileSize}px`;
    tile.style.height = `${bestTileSize}px`;
    tile.textContent = i + 1;

    if (winnerIndices.has(i)) {
      tile.classList.add("winner");
    }

    tile.addEventListener("click", function handleTileClick() {
      if (tile.classList.contains("winner")) {
        tile.classList.remove("tile-default");
        tile.classList.add("tile-win");
        tile.textContent = "🎯"; // 당첨 표시
      } else {
        tile.classList.remove("tile-default");
        tile.classList.add("tile-lose");
        tile.textContent = "❌"; // 꽝 표시
      }
      tile.removeEventListener("click", handleTileClick); // 클릭 한 번만 허용
    });

    board.appendChild(tile);
  }
}

// 페이지 로딩 시 기본 25칸 설정
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("totalTiles").value = defaultTotalTiles;
  startGame();
});

// 버튼 연결
document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("totalTiles").value = defaultTotalTiles;
  startGame();
});

document.getElementById("startBtn").addEventListener("click", startGame);
