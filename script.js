


// 초기 설정값
let defaultCols = 5;
let defaultRows = 5;
let defaultWinners = 1;

// 시작 버튼 클릭 시 실행할 함수
function startGame() {
  const colsInput = document.getElementById("cols");
  const rowsInput = document.getElementById("rows");
  const winnersInput = document.getElementById("winners");

  const cols = parseInt(colsInput?.value) || defaultCols;
  const rows = parseInt(rowsInput?.value) || defaultRows;
  const winners = parseInt(winnersInput?.value) || defaultWinners;

  generateGrid(cols, rows);
}

// 그리드 생성 함수
function generateGrid(cols, rows) {
  const board = document.getElementById("board");
  board.innerHTML = ""; // 기존 타일 초기화

  // 가로 세로 길이에 따라 스케일 체크
  const totalWidth = cols * 140 + (cols - 1) * 20;
  const totalHeight = rows * 140 + (rows - 1) * 20;
  const maxSize = Math.max(totalWidth, totalHeight);
  const boardContainer = document.getElementById("board-container");

  if (maxSize > 2000) {
    const scale = 1200 / maxSize;
    boardContainer.style.transform = `scale(${scale})`;
  } else {
    boardContainer.style.transform = `scale(1)`;
  }

  // 타일 생성
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.textContent = r * cols + c + 1; // 기본 번호 부여
      board.appendChild(tile);
    }
  }

  // 당첨 타일 랜덤 지정
  let totalTiles = cols * rows;
  let winnerIndices = new Set();

  while (winnerIndices.size < Math.min(totalTiles, defaultWinners)) {
    const randomIndex = Math.floor(Math.random() * totalTiles);
    winnerIndices.add(randomIndex);
  }

  const tiles = board.querySelectorAll(".tile");
  tiles.forEach((tile, index) => {
    if (winnerIndices.has(index)) {
      tile.classList.add("winner");
      tile.textContent = "🎉"; // 당첨 표시
    }
  });

  // 타일 클릭 이벤트 추가
  tiles.forEach((tile) => {
    tile.addEventListener("click", function handleTileClick() {
      if (tile.classList.contains("winner")) {
        tile.classList.add("hit");
        tile.textContent = "🎯"; // 당첨된 타일 클릭 시 표시 변경
      } else {
        tile.classList.add("miss");
        tile.textContent = "❌"; // 꽝 타일 클릭 시 표시 변경
      }
      tile.removeEventListener("click", handleTileClick); // 한 번 클릭 후 비활성화
    });
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
document.getElementById("startBtn").addEventListener("click", startGame);
