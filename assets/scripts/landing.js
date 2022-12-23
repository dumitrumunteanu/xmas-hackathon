const selectedGameMode = document.getElementById("game-modes").value;
const gameContainer = document.querySelector('.game-container');
const startFormContainer = document.querySelector('.form-container');

function showGameBoard() {
    gameContainer.style.display = "block";
    startFormContainer.style.display = "none";
}
