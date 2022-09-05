var state = {board: [], currentGame: [], savedGames: []};

function start() {
    readLocalStorage();
    createBoard();
    newGame();
}

function readLocalStorage() {
    var savedGamesFromLocalStorage = window.localStorage.getItem('saved-games');

    if (savedGamesFromLocalStorage) {
        state.savedGames = JSON.parse(savedGamesFromLocalStorage);
    }
}

function writeLocalStorage() {
    window.localStorage.setItem("saved-games", JSON.stringify(state.savedGames));
}


function createBoard() {
    state.board = []
    for(var i = 1; i <= 60; i++) {
        state.board.push(i);
    }
}

function newGame() {
    resetGame();
    render();
    console.log(state.currentGame);
}


function render() {
    renderBoard();
    renderButtons();
    renderSavedGames();
}

function renderBoard() {
    var divBoard = document.querySelector("#megasena-board");
    divBoard.innerHTML = "";

    var ulNumbers = document.createElement('ul');
    ulNumbers.classList.add('numbers');

    for(var i = 0; i < state.board.length; i++) {
        var currentNumber = state.board[i];

        var liNumber = document.createElement('li');
        liNumber.textContent = currentNumber;
        liNumber.classList.add("number");

        liNumber.addEventListener('click', handleNumberClick);

        if (state.currentGame.includes(currentNumber)) {
            liNumber.classList.add('selected-number');
        }

        ulNumbers.appendChild(liNumber);
    }
    divBoard.appendChild(ulNumbers);
}

function handleNumberClick(event) {
    var value = Number(event.currentTarget.textContent)

    if(state.currentGame.includes(value)){
        removeNumberFromGame(value);
    } else {
        addNumberToGame(value);
    }

    console.log(state.currentGame);
    render();
}

function renderButtons() {
    var divButtons = document.querySelector("#megasena-buttons");
    divButtons.innerHTML = "";
    
    var buttonNewGame = createNewGameButton();
    var buttonRandomGame = createRandomGameButton();
    var buttonSaveGame = createSaveGameButton();

    divButtons.appendChild(buttonNewGame);
    divButtons.appendChild(buttonRandomGame);
    divButtons.appendChild(buttonSaveGame);
    
}

function createNewGameButton() {
    var button = document.createElement("button");
    button.textContent = "Novo Jogo";

    button.addEventListener('click', newGame);

    return button;
}

function createRandomGameButton() {
    var button = document.createElement("button");
    button.textContent = "Jogo Aleatório";

    button.addEventListener('click', randomGame);

    return button
}

function createSaveGameButton() {
    var button = document.createElement("button");
    button.textContent = "Salvar Jogo";
    button.disabled = !isGameComplete();

    button.addEventListener('click', saveGame)

    return button
}

function renderSavedGames() {
    var divSavedGames = document.querySelector("#megasena-saved-games");
    divSavedGames.innerHTML = "";
    
    if (state.savedGames.length === 0) {
        divSavedGames.innerHTML = "<p>Nenhum jogo Salvo<p/>";
    } else {
        var ulSavedGames = document.createElement('ul');

        for (var i = 0; i < state.savedGames.length; i++) {
            var currentGame = state.savedGames[i];

            var liGame = document.createElement("li");
            liGame.textContent = currentGame;

            ulSavedGames.appendChild(liGame);
        }
        divSavedGames.appendChild(ulSavedGames);
    }

}

function addNumberToGame(numberToAdd) {
    if (state.currentGame.length >= 6) {
        console.error("O jogo já está completo.")
        return;
    } else if (numberToAdd > 60 || numberToAdd < 1){
        console.error("Numero inválido", numberToAdd);
        return;
    } else if (state.currentGame.includes(numberToAdd)){
        console.error("Número já está no jogo atual.");
        return;    
    } else {
        state.currentGame.push(numberToAdd);
    }
}

function removeNumberFromGame(numberToRemove) {
    var newGame = [];
    for(var i = 0; i < state.currentGame.length; i++) {
        if(state.currentGame[i] === numberToRemove) {
            continue;
        } 
        newGame.push(state.currentGame[i]);
    }
    state.currentGame = newGame;
}

function isGameComplete() {
    return state.currentGame.length === 6;
}

function saveGame() {
    if(!isGameComplete()) {
        console.error('Jogo incompleto');
        return
    }
    state.savedGames.push(state.currentGame);
    console.log("Jogo " + state.currentGame + " salvo");
    writeLocalStorage();
    newGame();
}

function resetGame() {
    state.currentGame = [];
}

function randomGame() {
    resetGame();
    while(!isGameComplete()) {
        var randonNumber = Math.ceil(Math.random() * 60);
        addNumberToGame(randonNumber);
    }
    console.log(state.currentGame);
    render();
}

start();