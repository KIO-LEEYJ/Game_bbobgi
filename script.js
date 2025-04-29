

// Constants for grid dimensions and gap
const GRID_SIZE = 810;
const TILE_GAP = 15;
const MIN_TILE_SIZE = 100;

// Helper to make odd number
function makeOdd(n) {
  return n % 2 === 0 ? n - 1 : n;
}

// Generate the grid with tiles
function generateGrid(numTiles) {
  const board = document.getElementById('board');
  if (!board) return;
  // Remove previous tiles
  board.innerHTML = '';
  // Ensure odd number of tiles horizontally
  let cols = makeOdd(Number(numTiles));
  if (cols < 1) cols = 1;
  // Compute tile size so that all tiles fit, with gaps
  let tileSize = Math.floor((GRID_SIZE - TILE_GAP * (cols - 1)) / cols);
  if (tileSize < MIN_TILE_SIZE) {
    tileSize = MIN_TILE_SIZE;
    cols = Math.floor((GRID_SIZE + TILE_GAP) / (MIN_TILE_SIZE + TILE_GAP));
    cols = makeOdd(cols);
    tileSize = Math.floor((GRID_SIZE - TILE_GAP * (cols - 1)) / cols);
  }
  // Calculate rows needed to fill the grid
  let rows = Math.floor((GRID_SIZE + TILE_GAP) / (tileSize + TILE_GAP));
  // Set CSS grid properties
  board.style.width = board.style.height = GRID_SIZE + 'px';
  board.style.display = 'grid';
  board.style.gridTemplateColumns = `repeat(${cols}, ${tileSize}px)`;
  board.style.gridTemplateRows = `repeat(${rows}, ${tileSize}px)`;
  board.style.gap = TILE_GAP + 'px';
  // Generate tiles
  const totalTiles = cols * rows;
  for (let i = 0; i < totalTiles; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.style.width = tile.style.height = tileSize + 'px';
    board.appendChild(tile);
  }
}

// Example: Initial grid setup
document.addEventListener('DOMContentLoaded', function() {
  // Default number of tiles horizontally
  let tileInput = document.getElementById('numTiles');
  let numTiles = tileInput ? tileInput.value : 7;
  generateGrid(numTiles);
  // Listen for changes to tile input
  if (tileInput) {
    tileInput.addEventListener('input', function() {
      generateGrid(this.value);
    });
  }
});
