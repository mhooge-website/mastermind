const MASTERMIND_TURN = true;

function createGame() {
    if(isMastermind) createMastermindWindow();
    else createGuesserDiv();
}

function createMastermindWindow() {
    console.log("Mastermind for u");
    
    createRows("m-guesses");
    createRows("m-results");
    createCodeArea();

    swapWindow("pvp-setup-div", "game-div-mastermind");
}

function createGuesserDiv() {
    console.log("Guesser for u");

    createRows("g-guesses");
    createRows("g-results");

    swapWindow("pvp-setup-div", "game-div-guesser");
}

function createCodeArea() {

}

function createRows(id) {
    let div = document.getElementById(id+"-div");
    let row = document.getElementById(id+"-row");
    let button = document.getElementById(id+"-button");
    for(i = 0; i < 10; i++) {
        let rowClone = row.cloneNode();
        for(j = 0; j < 4; j++) {
            let buttonClone = button.cloneNode();
            buttonClone.textContent = "P";
            rowClone.appendChild(buttonClone);
        }
        div.appendChild(rowClone);
    }
    row.removeChild(button);
    div.removeChild(row);
}