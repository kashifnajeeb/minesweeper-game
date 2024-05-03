function getBombsCount() {
  // Calculate the number of bombs by iterating over all cells and counting the ones that are bombs
  let bombCount = 0;
  for (let row = 0; row < ROWS_COUNT; row++) {
    for (let col = 0; col < COLS_COUNT; col++) {
      if (cells[row][col].isBomb) {
        bombCount++;
      }
    }
  }
  return bombCount;
}

function getClearedCells() {
  // Calculate the number of cleared cells by counting the ones that have been discovered
  let clearedCount = 0;
  for (let row = 0; row < ROWS_COUNT; row++) {
    for (let col = 0; col < COLS_COUNT; col++) {
      if (cells[row][col].discovered) {
        clearedCount++;
      }
    }
  }
  return clearedCount;
}

function getTotalCellsToClear() {
  // Calculate the total number of cells to clear, which is the total number of cells minus the number of bombs
  return ROWS_COUNT * COLS_COUNT - getBombsCount();
}
