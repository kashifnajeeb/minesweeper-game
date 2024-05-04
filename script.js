const CHEAT_REVEAL_ALL = false;

const ROWS_COUNT = 14;
const COLS_COUNT = 14;
const BOMBS_COUNT = 13;

var defeat = false;
var victory = false;

function Cell() {
  this.discovered = false;
  this.isBomb = false;
  this.hasBeenFlagged = false;
}

var cells = Array(ROWS_COUNT);
for (var row = 0; row < ROWS_COUNT; row++) {
  cells[row] = Array(COLS_COUNT);
  for (var col = 0; col < COLS_COUNT; col++) {
    cells[row][col] = new Cell();
  }
}

for (let i = 0; i < BOMBS_COUNT; i++) {
  cells[Math.floor(Math.random() * ROWS_COUNT)][
    Math.floor(Math.random() * COLS_COUNT)
  ].isBomb = true;
}

render();

function discoverCell(row, col) {
  function discoverNeighbors(row, col) {
    for (
      let i = Math.max(0, row - 1);
      i <= Math.min(row + 1, ROWS_COUNT - 1);
      i++
    ) {
      for (
        let j = Math.max(0, col - 1);
        j <= Math.min(col + 1, COLS_COUNT - 1);
        j++
      ) {
        if (i === row && j === col) continue;

        if (
          !cells[i][j].discovered &&
          !cells[i][j].hasBeenFlagged & !cells[i][j].isBomb
        ) {
          cells[i][j].discovered = true;

          if (countAdjacentBombs(i, j) === 0) {
            discoverNeighbors(i, j);
          }
        }
      }
    }
  }

  discoverNeighbors(row, col);

  cells[row][col].isBomb && (defeat = true);
}

function flagCell(row, col) {
  cells[row][col].hasBeenFlagged = true;
}

function countAdjacentBombs(row, col) {
  let adjacentBombs = 0;

  for (
    let i = Math.max(0, row - 1);
    i <= Math.min(row + 1, ROWS_COUNT - 1);
    i++
  ) {
    for (
      let j = Math.max(0, col - 1);
      j <= Math.min(col + 1, COLS_COUNT - 1);
      j++
    ) {
      if (i === row && j === col) continue;

      if (cells[i][j].isBomb) {
        adjacentBombs++;
      }
    }
  }

  return adjacentBombs;
}

function getBombsCount() {
  return BOMBS_COUNT;
}

function getClearedCells() {
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
  return ROWS_COUNT * COLS_COUNT - getBombsCount();
}

function checkForVictory() {
  const totalCells = ROWS_COUNT * COLS_COUNT;
  const totalNonBombCells = totalCells - BOMBS_COUNT;

  if (totalNonBombCells === getClearedCells() && !defeat) {
    victory = true;
  }
}

//
// Rendering functions
//
function getMessage() {
  if (victory == true) {
    return "Well done! 👏🏼<br><br>Refresh the page to start again.";
  } else if (defeat) {
    return "Boom! 💥<br><br>Refresh the page to try again.";
  }
  return "";
}

// "Render" the game. Update the content of the page to reflect any changes to the game state.
function render() {
  var playfield = document.getElementById("playfield");
  var html = "";
  for (var row = 0; row < ROWS_COUNT; row++) {
    html += '<div class="row">';
    for (var col = 0; col < COLS_COUNT; col++) {
      var cell = cells[row][col];
      var cellText = "";
      var cssClass = "";
      var textColor = "";
      if (cell.discovered || CHEAT_REVEAL_ALL || defeat) {
        cssClass = "discovered";
        if (cell.isBomb) {
          cellText = "💣";
        } else {
          var adjBombs = countAdjacentBombs(row, col);
          if (adjBombs > 0) {
            cellText = adjBombs.toString();
            if (adjBombs == 1) {
              textColor = "blue";
            } else if (adjBombs == 2) {
              textColor = "green";
            } else if (adjBombs == 3) {
              textColor = "red";
            } else if (adjBombs == 4) {
              textColor = "black";
            }
          }
        }
      } else {
        if (cell.hasBeenFlagged) {
          cellText = "🚩";
        }
      }
      html += `<div class="cell ${cssClass}" style="color:${textColor}" onclick="onCellClicked(${row}, ${col}, event)">${cellText}</div>`;
    }
    html += "</div>";
  }
  playfield.innerHTML = html;

  // Defeat screen
  var body = document.getElementsByTagName("body")[0];
  if (defeat) {
    body.classList.add("defeat");
  }

  // Victory screen
  if (victory) {
    body.classList.add("victory");
  }

  // Update stats
  document.getElementById("bombs-count").innerText = getBombsCount().toString();
  document.getElementById("cleared-cells-count").innerText =
    getClearedCells().toString();
  document.getElementById("total-cells-to-clear").innerText =
    getTotalCellsToClear().toString();

  // Update message
  document.getElementById("message").innerHTML = getMessage();
}

// This function gets called each time a cell is clicked. Arguments "row" and "col" will be set to the relevant
// values. Argument "event" is used to check if the shift key was held during the click.
function onCellClicked(row, col, event) {
  if (event.shiftKey) {
    flagCell(row, col);
  } else {
    discoverCell(row, col);
  }
  checkForVictory();
  render();
}
