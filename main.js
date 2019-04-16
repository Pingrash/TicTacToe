/*
v1.1

To-Do list:
- Additional AI difficulties
- Improve visuals
- Fix responsive layout for phone screens
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

let playerScore = 0;
let drawScore = 0;
let computerScore = 0;
let playerName = 'Player';

// Create an array of each grid square
const grid = () => Array.from(document.getElementsByClassName('square'));

// Removes the 'q' from the square id tag and parses the remaining id number to an integer
const squareNumId = (square) => Number.parseInt(square.id.replace('q', ''));

// Returns the elements within the grid array that are empty
const emptySquares = () => grid().filter(_square => _square.innerText === "");

// returns the elements within the grid array that the player has taken
const playerSquares = () => grid().filter(_square => _square.innerText === "x");

// Checks an array of squares if they are all x's or o's
const allSame = (arr) => arr.every(_square => _square.innerText === arr[0].innerText && _square.innerText !== '');

// Check for draw
const drawCheck = () => grid().every(_square => _square.innerText !== '');

// Player turn function
// Gets the square that was clicked on and sets it to 'x'
let turnSuccessful = true;
let playerTurn = true;
const takeTurn = (index, letter) => {
  if (!grid()[index].innerText == '') {
    turnSuccessful = false;
    return;
  }
  grid()[index].innerText = letter;
  // Set playerTurn for use in endGame function
  switch (letter) {
    case "x":
      playerTurn = true;
      break;
  
    case "o":
      playerTurn = false;
      break;
  }
  turnSuccessful = true;
}
// AI turn function
// In current form uses the emptySquares function to get an array of all empty squares then chooses one at random to set to 'o' 
const opponentChoice = () => squareNumId(emptySquares()[Math.floor(Math.random() * emptySquares().length)]);

// Change opponentChoice to first compare playerSquares to emptySquares to block player win for hard difficulty

// Function that changes the colours of the winning squares and disables click event listeners
const endGame = (winningSequance) => {
  disableListeners();
  let victoryMessage = document.querySelector('#victoryMessage');

  winningSequance.forEach(_square => _square.style.color = 'red');
  if (playerTurn) {
    victoryMessage.innerText = `${playerName} Wins!`;
    updateScore('player');
  } else if (!playerTurn) {
    victoryMessage.innerText = 'Computer Wins!';
    updateScore('computer');
  }

  if (winningSequance === 'draw') {
    victoryMessage.innerText = "It's a draw!";
    updateScore('draw');
    return;
  }
}

// Function that takes each array in winningCombos and checks them against each square in it's current state
// If any sequance returns all the same results it is sent to the endGame function
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

  if (drawCheck()) {
    console.log(drawCheck());
    victory = true;
    endGame('draw');
  }

  return victory;
}

// Function for opponents turn
// Disables listeners so the player can't continue until computer is done
// Opponents choice is run within a one second timeout to add a bit more of realistic feel instead of it just instantly running
const opponentTurn = () => {
  disableListeners();
  setTimeout(() => {
    takeTurn(opponentChoice(), 'o');
    if (!checkForVictory()) {
      enableListeners();
    }
  }, 1000);
}

// Players turn function
// Sets the clicked on square to 'x' and runs victory checks
const clickFunction = (event) => {
  takeTurn(squareNumId(event.target), 'x');
  if (!checkForVictory() && turnSuccessful) {
    opponentTurn();
  }
}

// Enables all click event listeners for the grid
const enableListeners = () => grid().forEach(_square => _square.addEventListener('click', clickFunction));

// Disables all click event listeners for the grid
const disableListeners = () => grid().forEach(_square => _square.removeEventListener('click', clickFunction));

// Function to clear the grid and victory message for a new game
const newGame = () => {
  grid().forEach(_square => _square.innerText = '');
  grid().forEach(_square => _square.style.color = 'black');
  victoryMessage.innerText = '';
  enableListeners();
}
// Add click event listener to the New Game button
document.querySelector('#newGame').addEventListener('click', newGame);

// Sets the grid to the centre of the screen
const setPostionForGrid = () => {
  let gameContainer = document.querySelector(".game-container");

  gameContainer.style.left = `calc(50% - ${gameContainer.clientWidth/2}px)`;
  gameContainer.style.top = `calc(50% - ${gameContainer.clientHeight/1.5}px)`;
}

// Span variables for score related functions
let playerScoreSpan = document.querySelector('#playerScore');
let drawScoreSpan = document.querySelector('#drawScore');
let computerScoreSpan = document.querySelector('#computerScore');

// Update relavent score span based on winner result
const updateScore = (winner) => {
  switch (winner) {
    case 'player':
      playerScore++;
      playerScoreSpan.innerText = playerScore.toString();
      break;
    
    case 'draw':
      drawScore++;
      drawScoreSpan.innerText = drawScore.toString();
      break;

    case 'computer':
      computerScore++;
      computerScoreSpan.innerText = computerScore.toString();
      break;
  }
}

// Menu Functions
let menuPane = document.querySelector('#menuPane');
let menuVisible = false;
let changeConfirmSpan = document.querySelector('#changeConfirm');

// Function to open or close the menu depending on the state of menuVisible
const openMenu = () => {
  if (menuVisible) {
    menuPane.style.visibility = 'hidden';
    changeConfirmSpan.innerText = '';
    menuVisible = false;
  } else if (!menuVisible) {
    menuPane.style.visibility = 'visible';
    menuVisible = true;
  }
}

// Add event listeners to menu open and close buttons
document.querySelector('#menuClose').addEventListener('click', openMenu);
document.querySelector('#menuButton').addEventListener('click', openMenu);

// Reset all scores and score counter spans
const resetScores = () => {
  playerScore = 0;
  drawScore = 0;
  computerScore = 0;

  playerScoreSpan.innerText = '0';
  drawScoreSpan.innerText = '0';
  computerScoreSpan.innerText = '0';
}
// Add event listener to reset score button
document.querySelector('#resetScore').addEventListener('click', resetScores);

// change player name to player's input in menu
const setPlayerName = () => {
  let nameField = document.querySelector('#playerNameInput');
  playerName = nameField.value;
  // Update the player's name in the score table
  document.querySelector('#scorePlayerName').innerText = playerName;
  // Set confirmation message in the menu pane and set it's left position based on it's width, this means it will always be centered despite the length of the player's name
  changeConfirmSpan.innerText = `Name changed to ${playerName}`;
  changeConfirmSpan.style.left = `calc(50% - ${changeConfirmSpan.clientWidth/2}px)`
  // Clear nameField
  nameField.value = '';
}

// Add event listener to the 'Set Player Name' button
document.querySelector('#playerNameSubmit').addEventListener('click', setPlayerName);

// Start Game
setPostionForGrid();
enableListeners();