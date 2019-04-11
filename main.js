/*
v1.0

TicTacToe Project by Lachlan Mackenzie

The base of this project is based on a tutorial by Youtuber PortExe (https://youtu.be/yaPUl31nypk).

Features added by me:
- Added checks to stop player from choosing a square that is already taken

To-Do list:
- Menu system
- Additional AI difficulties
- Improve visuals
- Responsive layout for mobile and tablet
*/

const winningCombos = [
  [0,1,2], // Top Horizontal
  [3,4,5], // Middle Horizontal
  [6,7,8], // Bottom Horizontal
  [0,3,6], // Left Vertical
  [1,4,7], // Middle Vertical
  [2,5,8], // Bottom Vertical
  [0,4,8], // Top-Left to Bottom-Right Diagonal
  [2,4,6]  // Top-Right to Bottom-Left Diagonal
];

// Create an array of each grid square
const grid = () => Array.from(document.getElementsByClassName('square'));

// Removes the 'q' from the square id tag and parses the remaining id number to an integer
const squareNumId = (square) => Number.parseInt(square.id.replace('q', ''));

// Returns the elements within the grid array that are empty
const emptySquares = () => grid().filter(_square => _square.innerText === "");

// Checks an array of squares if they are all x's or o's
const allSame = (arr) => arr.every(_square => _square.innerText === arr[0].innerText && _square.innerText !== '');

// Player turn function
// Gets the square that was clicked on and sets it to 'x'
let turnSuccessful = true;
const takeTurn = (index, letter) => {
  if (!grid()[index].innerText == '') {
    turnSuccessful = false;
    return;
  }
  grid()[index].innerText = letter;
  turnSuccessful = true;
}
// AI turn function
// In current form uses the emptySquares function to get an array of all empty squares then chooses one at random to set to 'o' 
const opponentChoice = () => squareNumId(emptySquares()[Math.floor(Math.random() * emptySquares().length)]);

const endGame = (winningSequance) => {
  winningSequance.forEach(_square => _square.classList.add('winner'));
  disableListeners();
}

const checkForVictory = () => {
  let victory = false;

  winningCombos.forEach(_combo => {
    const _grid = grid();
    const sequence = [_grid[_combo[0]], _grid[_combo[1]], _grid[_combo[2]]];
    if (allSame(sequence)) {
      victory = true;
      endGame(sequence);
    }
  });

  return victory;
}

const opponentTurn = () => {
  disableListeners();
  setTimeout(() => {
    takeTurn(opponentChoice(), 'o');
    if (!checkForVictory()) {
      enableListeners();
    }
  }, 1000);
}

const clickFunction = (event) => {
  takeTurn(squareNumId(event.target), 'x');
  if (!checkForVictory() && turnSuccessful) {
    opponentTurn();
  }
}

const enableListeners = () => grid().forEach(_square => _square.addEventListener('click', clickFunction));

const disableListeners = () => grid().forEach(_square => _square.removeEventListener('click', clickFunction));

enableListeners();