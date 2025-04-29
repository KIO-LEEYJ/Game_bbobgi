// 초기 설정값
let defaultTotalTiles = 9; // 기본 총 칸수
const minTileSize = 140;
const maxBoardWidth = 810; // 가로 최대
const maxBoardHeight = 810; // 세로 최대
const gapSize = 20; // 타일 간격

// 시작 버튼 클릭 시 실행할 함수
function startGame() {
  const totalInput = document.getElementById("totalTiles");
  const winnerInput = document.getElementById("winnerTiles");
  const totalTiles = parseInt(totalInput?.value) || defaultTotalTiles;
  const winnerTiles = parseInt(winnerInput?.value) || 1;
  generateGrid(totalTiles, winnerTiles);
}

// 그리드 생성 함수
function generateGrid(totalTiles, winnerTiles) {
  const board = document.getElementById("board");
  board.innerHTML = ""; // 기존 타일 초기화

  let bestCols = 3; // 기본값을 3으로 설정 (3의 배수로 고정)
  let bestRows = totalTiles;
  let bestTileSize = 0;

  // 3의 배수로 가로줄의 타일 갯수를 설정하도록 수정
  for (let cols = 3; cols <= totalTiles; cols += 3) { // 3의 배수로만 증가
    const rows = Math.ceil(totalTiles / cols);
    const tentativeTileWidth = (maxBoardWidth - (cols - 1) * gapSize) / cols; // 타일 너비 계산
    const tentativeTileHeight = (maxBoardHeight - (rows - 1) * gapSize) / rows; // 타일 높이 계산
    const tentativeTileSize = Math.min(tentativeTileWidth, tentativeTileHeight);

    if (tentativeTileSize > bestTileSize) {
      bestCols = cols;
      bestRows = rows;
      bestTileSize = tentativeTileSize;
    }
  }

  // 보드 스타일 적용
  board.className = "grid gap-[20px]";
  board.style.gridTemplateColumns = `repeat(${bestCols}, ${bestTileSize}px)`;
  board.style.gridTemplateRows = `repeat(${bestRows}, ${bestTileSize}px)`;
  board.style.width = `${maxBoardWidth}px`;
  board.style.height = `${maxBoardHeight}px`;

  // 랜덤 당첨 타일 선택
  let winnerIndices = new Set();
  while (winnerIndices.size < Math.min(totalTiles, winnerTiles)) {
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
  document.getElementById("winnerTiles").value = 1;
  startGame();
});

// 버튼 연결
document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("totalTiles").value = defaultTotalTiles;
  document.getElementById("winnerTiles").value = 1;
  startGame();
});

document.getElementById("startBtn").addEventListener("click", startGame);
