// 초기 설정값
let defaultTotalTiles = 9; // 기본 총 칸수 (3의 배수로 설정)
const minTileSize = 140;
const maxBoardWidth = 810; // 가로 최대
const maxBoardHeight = 810; // 세로 최대
const gapSize = 20; // 타일 간격

// 타일 클릭 이벤트 처리 함수
function handleTileClick(tile) {
  return function () {
    if (tile.classList.contains("winner")) {
      tile.classList.replace("tile-default", "tile-win");
      tile.textContent = "🎯"; // 당첨 표시
    } else {
      tile.classList.replace("tile-default", "tile-lose");
      tile.textContent = "❌"; // 꽝 표시
    }
    tile.removeEventListener("click", handleTileClick(tile));
  };
}

// 시작 버튼 클릭 시 실행할 함수
function startGame() {
  const totalInput = document.getElementById("totalTiles");
  const winnerInput = document.getElementById("winnerTiles");
  let totalTiles = parseInt(totalInput?.value) || defaultTotalTiles;
  const winnerTiles = Math.min(parseInt(winnerInput?.value) || 1, totalTiles);

  // totalTiles를 3의 배수로 맞춤
  totalTiles = Math.max(3, Math.floor(totalTiles / 3) * 3);
  defaultTotalTiles = totalTiles;
  totalInput.value = totalTiles;
  winnerInput.value = winnerTiles;

  generateGrid(totalTiles, winnerTiles);
}

// 그리드 생성 함수
function generateGrid(totalTiles, winnerTiles) {
  const board = document.getElementById("board");
  board.innerHTML = ""; // 기존 타일 초기화

  // 3의 배수로 행과 열 계산 (정사각형에 가깝게)
  const tilesPerSide = Math.sqrt(totalTiles);
  const cols = tilesPerSide;
  const rows = tilesPerSide;

  // 타일 크기 계산
  const tentativeTileWidth = (maxBoardWidth - (cols - 1) * gapSize) / cols;
  const tentativeTileHeight = (maxBoardHeight - (rows - 1) * gapSize) / rows;
  let tileSize = Math.min(tentativeTileWidth, tentativeTileHeight);
  tileSize = Math.max(tileSize, minTileSize);

  // 보드 스타일 적용
  board.className = "grid";
  board.style.gridTemplateColumns = `repeat(${cols}, ${tileSize}px)`;
  board.style.gridTemplateRows = `repeat(${rows}, ${tileSize}px)`;
  board.style.gap = `${gapSize}px`;
  board.style.width = `${cols * tileSize + (cols - 1) * gapSize}px`;
  board.style.height = `${rows * tileSize + (rows - 1) * gapSize}px`;

  // 랜덤 당첨 타일 선택
  const winnerIndices = new Set();
  while (winnerIndices.size < winnerTiles) {
    const randomIndex = Math.floor(Math.random() * totalTiles);
    winnerIndices.add(randomIndex);
  }

  // 타일 생성 및 이벤트 추가
  for (let i = 0; i < totalTiles; i++) {
    const tile = document.createElement("div");
    tile.className = "tile tile-default flex items-center justify-center";
    tile.style.width = `${tileSize}px`;
    tile.style.height = `${tileSize}px`;
    tile.textContent = i + 1;

    if (winnerIndices.has(i)) {
      tile.classList.add("winner");
    }

    tile.addEventListener("click", () => {
      if (tile.classList.contains("winner")) {
        tile.classList.replace("tile-default", "tile-win");
        tile.textContent = "🎯"; // 당첨 표시
      } else {
        tile.classList.replace("tile-default", "tile-lose");
        tile.textContent = "❌"; // 꽝 표시
      }
      tile.style.pointerEvents = "none"; // 클릭 비활성화
    });

    board.appendChild(tile);
  }
}

// 게임 초기화 함수
function initializeGame() {
  const totalInput = document.getElementById("totalTiles");
  const winnerInput = document.getElementById("winnerTiles");
  totalInput.value = defaultTotalTiles;
  winnerInput.value = 1;
  startGame();
}

// 페이지 로딩 시 초기화
window.addEventListener("DOMContentLoaded", initializeGame);

// 버튼 연결
document.getElementById("resetBtn").addEventListener("click", initializeGame);
document.getElementById("startBtn").addEventListener("click", startGame);
