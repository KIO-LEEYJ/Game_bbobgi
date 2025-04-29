// Constants for grid dimensions and gap
const GRID_SIZE_WIDTH = 810;
const GRID_SIZE_HEIGHT = 600;
const TILE_GAP = 15;
const MIN_TILE_SIZE = 30;

// Helper to make odd number
function makeOdd(n) {
  return n % 2 === 0 ? n - 1 : n;
}

// Generate the grid with tiles, specifying totalTiles and winnerTiles
function generateGrid(totalTiles, winnerTiles) {
  const board = document.getElementById('board');
  if (!board) return;

  // Remove previous tiles
  board.innerHTML = '';

  // Find best grid arrangement for given totalTiles
  // We want a square layout, as close as possible, but must fit in GRID_SIZE x GRID_SIZE px
  // Try all possible (cols, rows) pairs, choose the largest tileSize that fits
  let best = null;
  let maxTileSize = 0;
  // Try possible cols from 1 up to totalTiles
  for (let cols = 1; cols <= totalTiles; cols++) {
    let rows = Math.ceil(totalTiles / cols);
    // Calculate tile size based on both width and height constraints
    let tileSizeW = Math.floor((GRID_SIZE_WIDTH - TILE_GAP * (cols - 1)) / cols);
    let tileSizeH = Math.floor((GRID_SIZE_HEIGHT - TILE_GAP * (rows - 1)) / rows);
    let tileSize = Math.min(tileSizeW, tileSizeH);
    if (tileSize < MIN_TILE_SIZE) continue;
    // Try to maximize tileSize, prefer more square layouts
    let squareScore = -Math.abs(cols - rows); // closer to square is better
    if (
      tileSize > maxTileSize ||
      (tileSize === maxTileSize && (!best || squareScore > best.squareScore))
    ) {
      maxTileSize = tileSize;
      best = { cols, rows, tileSize, squareScore };
    }
  }
  // If no valid found, force min tile size and fit as many as possible
  let cols, rows, tileSize;
  if (best) {
    cols = best.cols;
    rows = best.rows;
    tileSize = best.tileSize;
  } else {
    tileSize = MIN_TILE_SIZE;
    // Fit as many cols as possible
    cols = Math.floor((GRID_SIZE_WIDTH + TILE_GAP) / (MIN_TILE_SIZE + TILE_GAP));
    if (cols < 1) cols = 1;
    rows = Math.ceil(totalTiles / cols);
  }

  // Set CSS grid properties
  board.style.width = GRID_SIZE_WIDTH + 'px';
  board.style.height = GRID_SIZE_HEIGHT + 'px';
  board.style.display = 'grid';
  board.style.gridTemplateColumns = `repeat(${cols}, ${tileSize}px)`;
  board.style.gridTemplateRows = `repeat(${rows}, ${tileSize}px)`;
  board.style.gap = TILE_GAP + 'px';

  // Randomly choose "winner" tiles
  let winners = new Set();
  winnerTiles = Math.max(1, Math.min(winnerTiles, totalTiles));
  while (winners.size < winnerTiles) {
    winners.add(Math.floor(Math.random() * totalTiles));
  }

  // Create tiles and add to the board
  for (let i = 0; i < totalTiles; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.style.width = tile.style.height = tileSize + 'px';

    // For edge alignment: first and last tile in each row
    const rowIdx = Math.floor(i / cols);
    const colIdx = i % cols;
    if (colIdx === 0) {
      tile.style.justifySelf = 'start';
    } else if (colIdx === cols - 1 || i === totalTiles - 1) {
      tile.style.justifySelf = 'end';
    } else {
      tile.style.justifySelf = 'center';
    }

    // Set winner or loser
    if (winners.has(i)) {
      tile.classList.add('tile-win');
      tile.dataset.status = 'winner';
      tile.textContent = ""; // Initially empty
    } else {
      tile.classList.add('tile-lose');
      tile.dataset.status = 'loser';
      tile.textContent = ""; // Initially empty
    }

    // Add click event for further actions
    tile.addEventListener('click', function () {
      if (this.dataset.status === 'winner') {
        this.textContent = "🎯";
      } else {
        this.textContent = "❌";
      }
      this.style.pointerEvents = 'none'; // Disable further clicking
    });

    board.appendChild(tile);
  }
}

// Initial grid setup and UI wiring
document.addEventListener('DOMContentLoaded', function () {
  // Default values
  const DEFAULT_TOTAL_TILES = 12;
  const DEFAULT_WINNER_TILES = 1;

  // Inputs and buttons
  const totalTilesInput = document.getElementById('totalTiles') || document.getElementById('numTiles');
  const winnerTilesInput = document.getElementById('winnerTiles');
  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');

  // Helper to get input value or default
  function getInputValue(input, def) {
    return input ? Number(input.value) : def;
  }

  // Render initial grid
  generateGrid(DEFAULT_TOTAL_TILES, DEFAULT_WINNER_TILES);

  // Start button handler
  if (startBtn) {
    startBtn.addEventListener('click', function () {
      const total = getInputValue(totalTilesInput, DEFAULT_TOTAL_TILES);
      const winners = getInputValue(winnerTilesInput, DEFAULT_WINNER_TILES);
      generateGrid(total, winners);
    });
  }

  // Reset button handler
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      // Reset input fields to default if they exist
      if (totalTilesInput) totalTilesInput.value = DEFAULT_TOTAL_TILES;
      if (winnerTilesInput) winnerTilesInput.value = DEFAULT_WINNER_TILES;
      generateGrid(DEFAULT_TOTAL_TILES, DEFAULT_WINNER_TILES);
    });
  }
});
