// Variables
const board = document.querySelectorAll("#tic-tac-toe-board td");
let playerTurn = true;
let gameOver = false;
let startTime, timerInterval;
let playerMoves = [];
let computerMoves = [];
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
const scoreList = document.getElementById('high-scores');
const playAgainButton = document.getElementById('play-again-button');
const resetScoresButton = document.getElementById('reset-scores-button'); // Botón de restablecer puntajes

// Función para iniciar el juego
function startGame() {
    playerTurn = true;
    gameOver = false;
    playerMoves = [];
    computerMoves = [];
    startTime = Date.now();
    clearInterval(timerInterval);
    document.getElementById('timer').textContent = 'Tiempo: 0s';
    timerInterval = setInterval(updateTimer, 1000);
    board.forEach(cell => {
        cell.textContent = '';
        cell.addEventListener('click', playerMove);
    });
    playAgainButton.style.display = 'none'; // Asegúrate de ocultar el botón al iniciar
}

// Actualiza el cronómetro
function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timer').textContent = `Tiempo: ${elapsedTime}s`;
}

// Movimiento del jugador
function playerMove(event) {
    if (!playerTurn || gameOver || event.target.textContent) return;
    event.target.textContent = 'X';
    playerMoves.push(Number(event.target.getAttribute('data-index')));
    if (checkWin(playerMoves)) {
        endGame(true);
        return;
    }
    playerTurn = false;
    computerMove();
}

// Movimiento de la computadora (aleatorio)
function computerMove() {
    let availableCells = Array.from(board).filter(cell => !cell.textContent);
    if (availableCells.length === 0) {
        endGame(false);
        return;
    }
    let randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    randomCell.textContent = 'O';
    computerMoves.push(Number(randomCell.getAttribute('data-index')));
    if (checkWin(computerMoves)) {
        endGame(false);
    } else {
        playerTurn = true;
    }
}

// Verifica si hay un ganador
function checkWin(moves) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winningCombinations.some(combination => combination.every(index => moves.includes(index)));
}

// Finaliza el juego
function endGame(playerWon) {
    clearInterval(timerInterval);
    gameOver = true;
    board.forEach(cell => cell.removeEventListener('click', playerMove));
    if (playerWon) {
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        const playerName = prompt("¡Ganaste! Ingresa tu nombre:");
        saveHighScore(playerName, timeTaken);
        displayHighScores();
        document.getElementById('winner-message').textContent = '¡Ganaste!';
    } else {
        document.getElementById('winner-message').textContent = 'La computadora ganó';
    }
    playAgainButton.style.display = 'block'; // Mostrar el botón de "Jugar de nuevo"
}

// Guarda el puntaje en LocalStorage
function saveHighScore(name, time) {
    highScores.push({ name, time, date: new Date().toLocaleString() });
    highScores.sort((a, b) => a.time - b.time);
    if (highScores.length > 10) highScores.pop();
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

// Muestra los mejores tiempos
function displayHighScores() {
    scoreList.innerHTML = '';
    highScores.forEach(score => {
        const listItem = document.createElement('li');
        listItem.textContent = `${score.name} - ${score.time}s (Fecha: ${score.date})`;
        scoreList.appendChild(listItem);
    });
}

// Reiniciar el juego
function resetGame() {
    board.forEach(cell => {
        cell.textContent = '';
        cell.style.pointerEvents = 'auto'; // Habilitar clics nuevamente
    });
    document.getElementById('winner-message').textContent = '';
    playAgainButton.style.display = 'none'; // Ocultar el botón
    gameActive = true; // Reactivar el juego
    startGame(); // Reinicia el juego
}

// Evento para el botón "Jugar de nuevo"
playAgainButton.addEventListener('click', resetGame);

// Evento para el botón "Restablecer Puntajes"
resetScoresButton.addEventListener('click', () => {
    localStorage.removeItem('highScores'); // Limpiar los puntajes del LocalStorage
    while (scoreList.firstChild) {
        scoreList.removeChild(scoreList.firstChild); // Limpiar la lista de puntajes
    }
});

// Inicia el juego
startGame();
displayHighScores();
