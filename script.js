// 초기 설정값
let defaultCols = 5;
let defaultRows = 5;
let defaultWinners = 1;

// 스케일 조정 전용 함수 (가로 기준만 적용, 세로는 비례)
function adjustBoardScale(cols, rows) {
  const tileSize = 140; // 기본 타일 크기
  const gapSize = 20;   // 타일 간격
  const totalWidth = cols * tileSize + (cols - 1) * gapSize;
  const board = document.getElementById("board");

  const maxWidth = 1600; // 무조건 가로 기준

  let scale = 1;
  if (totalWidth > maxWidth) {
    scale = maxWidth / totalWidth;
  }

  board.style.transform = `scale(${scale})`;
}

// 시작 버튼 클릭 시 실행할 함수
function startGame() {
  const colsInput = document.getElementById("cols");
  const rowsInput = document.getElementById("rows");
  const winnersInput = document.getElementById("winners");

  const cols = parseInt(colsInput?.value) || defaultCols;
  const rows = parseInt(rowsInput?.value) || defaultRows;
  const winners = parseInt(winnersInput?.value) || defaultWinners;

  generateGrid(cols, rows, winners);
}

// 그리드 생성 함수
function generateGrid(cols, rows, winners) {
  const board = document.getElementById("board");
  board.innerHTML = ""; // 기존 타일 초기화

  // 기존 클래스 초기화 및 grid 기본 설정
  board.className = "grid gap-5"; // gap 20px 유지
  board.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`; // 인라인 스타일로 컬럼 설정

  // 타일 생성
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = document.createElement("div");
      tile.className = "tile tile-default"; // tile과 tile-default 클래스 동시에 적용
      tile.textContent = r * cols + c + 1; // 기본 번호 부여
      board.appendChild(tile);
    }
  }

  const tiles = board.querySelectorAll(".tile");
  let totalTiles = cols * rows;
  let winnerIndices = new Set();

  while (winnerIndices.size < Math.min(totalTiles, winners)) {
    const randomIndex = Math.floor(Math.random() * totalTiles);
    winnerIndices.add(randomIndex);
  }

  tiles.forEach((tile, index) => {
    if (winnerIndices.has(index)) {
      tile.classList.add("winner");
    }
  });

  // 타일 클릭 이벤트 추가
  tiles.forEach((tile, index) => {
    tile.addEventListener("click", function handleTileClick() {
      if (tile.classList.contains("winner")) {
        tile.classList.remove("tile-default");
        tile.classList.add("tile-win");
        tile.textContent = "🎯"; // 당첨된 타일 클릭 시 🎯 표시
      } else {
        tile.classList.remove("tile-default");
        tile.classList.add("tile-lose");
        tile.textContent = "❌"; // 꽝 타일 클릭 시 ❌ 표시
      }
      tile.removeEventListener("click", handleTileClick); // 한 번 클릭 후 비활성화
    });
  });

  requestAnimationFrame(() => {
    adjustBoardScale(cols, rows);
  });
}

// 페이지 로딩 시 기본 5x5 설정
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("cols").value = defaultCols;
  document.getElementById("rows").value = defaultRows;
  document.getElementById("winners").value = defaultWinners;
  startGame();
});

// 시작 버튼 연결

// 리셋 버튼 연결
document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("cols").value = defaultCols;
  document.getElementById("rows").value = defaultRows;
  document.getElementById("winners").value = defaultWinners;
  startGame();
});

document.getElementById("startBtn").addEventListener("click", startGame);
