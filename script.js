// 그리드 크기 및 간격 상수
const GRID_SIZE_WIDTH = 810;
const GRID_SIZE_HEIGHT = 600;
const TILE_GAP = 15;
const MIN_TILE_SIZE = 30;

// 홀수로 만들기 위한 도움 함수
function makeOdd(n) {
  return n % 2 === 0 ? n - 1 : n;
}

// 타일을 포함한 그리드 생성 함수, totalTiles와 winnerTiles를 지정
function generateGrid(totalTiles, winnerTiles) {
  const board = document.getElementById('board');
  if (!board) return;

  // 이전 타일 제거
  board.innerHTML = '';

  // 주어진 totalTiles에 가장 적합한 그리드 배치 찾기
  // 가능한 한 정사각형 레이아웃을 원하며, GRID_SIZE x GRID_SIZE px 내에 맞아야 함
  // 가능한 모든 (cols, rows) 쌍을 시도하여 가장 큰 타일 크기 선택
  let best = null;
  let maxTileSize = 0;
  // 1부터 totalTiles까지 가능한 열 수 시도
  for (let cols = 1; cols <= totalTiles; cols++) {
    let rows = Math.ceil(totalTiles / cols);
    // 너비 및 높이 제약에 따른 타일 크기 계산
    let tileSizeW = Math.floor((GRID_SIZE_WIDTH - TILE_GAP * (cols - 1)) / cols);
    let tileSizeH = Math.floor((GRID_SIZE_HEIGHT - TILE_GAP * (rows - 1)) / rows);
    let tileSize = Math.min(tileSizeW, tileSizeH);
    if (tileSize < MIN_TILE_SIZE) continue;
    // 타일 크기를 최대화하고, 더 정사각형에 가까운 레이아웃 선호
    let squareScore = -Math.abs(cols - rows); // 정사각형에 가까울수록 점수 높음
    if (
      tileSize > maxTileSize ||
      (tileSize === maxTileSize && (!best || squareScore > best.squareScore))
    ) {
      maxTileSize = tileSize;
      best = { cols, rows, tileSize, squareScore };
    }
  }
  // 유효한 결과가 없으면 최소 타일 크기로 강제 설정하고 가능한 많은 타일 배치
  let cols, rows, tileSize;
  if (best) {
    cols = best.cols;
    rows = best.rows;
    tileSize = best.tileSize;
  } else {
    tileSize = MIN_TILE_SIZE;
    // 가능한 최대 열 수 계산
    cols = Math.floor((GRID_SIZE_WIDTH + TILE_GAP) / (MIN_TILE_SIZE + TILE_GAP));
    if (cols < 1) cols = 1;
    rows = Math.ceil(totalTiles / cols);
  }

  // CSS 그리드 속성 설정
  board.style.width = (cols * tileSize + TILE_GAP * (cols - 1)) + 'px';
  board.style.height = (rows * tileSize + TILE_GAP * (rows - 1)) + 'px';
  board.style.display = 'grid';
  board.style.gridTemplateColumns = `repeat(${cols}, ${tileSize}px)`;
  board.style.gridTemplateRows = `repeat(${rows}, ${tileSize}px)`;
  board.style.gap = TILE_GAP + 'px';
  board.style.position = 'absolute';
  board.style.left = '50%';
  board.style.top = '50%';
  board.style.transform = 'translate(-50%, -50%)';

  // "승리" 타일 무작위 선택
  let winners = new Set();
  winnerTiles = Math.max(1, Math.min(winnerTiles, totalTiles));
  while (winners.size < winnerTiles) {
    winners.add(Math.floor(Math.random() * totalTiles));
  }

  // 타일 생성 및 보드에 추가
  for (let i = 0; i < totalTiles; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.style.width = tile.style.height = tileSize + 'px';

    // 가장자리 정렬: 각 행의 첫 번째 및 마지막 타일
    const rowIdx = Math.floor(i / cols);
    const colIdx = i % cols;
    if (colIdx === 0) {
      tile.style.justifySelf = 'start';
    } else if (colIdx === cols - 1 || i === totalTiles - 1) {
      tile.style.justifySelf = 'end';
    } else {
      tile.style.justifySelf = 'center';
    }

    // 승리 또는 패배 상태 설정
    if (winners.has(i)) {
      tile.classList.add('tile-win');
      tile.dataset.status = 'winner';
    } else {
      tile.classList.add('tile-lose');
      tile.dataset.status = 'loser';
    }

    // 타일 번호 표시
    tile.textContent = i + 1;

    // 클릭 이벤트 추가
    tile.addEventListener('click', function () {
      if (this.dataset.status === 'winner') {
        this.textContent = "🎯";
      } else {
        this.textContent = "❌";
      }
      this.style.pointerEvents = 'none'; // 추가 클릭 방지
    });

    board.appendChild(tile);
  }
}

// 초기 그리드 설정 및 UI 연결
document.addEventListener('DOMContentLoaded', function () {
  // 기본 값
  const DEFAULT_TOTAL_TILES = 12;
  const DEFAULT_WINNER_TILES = 1;

  // 입력 및 버튼 요소
  const totalTilesInput = document.getElementById('totalTiles') || document.getElementById('numTiles');
  const winnerTilesInput = document.getElementById('winnerTiles');
  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');

  // 입력값 또는 기본값 가져오기 도움 함수
  function getInputValue(input, def) {
    return input ? Number(input.value) : def;
  }

  // 초기 그리드 렌더링
  generateGrid(DEFAULT_TOTAL_TILES, DEFAULT_WINNER_TILES);

  // 시작 버튼 핸들러
  if (startBtn) {
    startBtn.addEventListener('click', function () {
      const total = getInputValue(totalTilesInput, DEFAULT_TOTAL_TILES);
      const winners = getInputValue(winnerTilesInput, DEFAULT_WINNER_TILES);
      generateGrid(total, winners);
    });
  }

  // 리셋 버튼 핸들러
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      // 입력 필드를 기본값으로 리셋
      if (totalTilesInput) totalTilesInput.value = DEFAULT_TOTAL_TILES;
      if (winnerTilesInput) winnerTilesInput.value = DEFAULT_WINNER_TILES;
      generateGrid(DEFAULT_TOTAL_TILES, DEFAULT_WINNER_TILES);
    });
  }
});
