const MASTERMIND_TURN = true;
var codeButtons = null;
var guessButtons = null;
var resultButtons = null;
var colorButtons = null;
var bwButtons = null;

function createGame() {
    document.getElementById("game-div-mastermind").style.height = (window.innerHeight*0.7) + "px";
    document.getElementById("game-div-guesser").style.height = (window.innerHeight*0.7) + "px";
    codeButtons = new Array(4);
    guessButtons = new Array(10);
    resultButtons = new Array(10);
    colorButtons = new Array(6);
    bwButtons = new Array(2);
    if(isMastermind) createMastermindWindow();
    else createGuesserWindow();
    createColorDiv();
    createBWColorDiv();
}

function createMastermindWindow() {
    createMastermindDiv();
    createCodeArea();

    document.getElementById("game-div-mastermind").style.display = "block";
    swapWindow("pvp-setup-div", "game-div");
}

function createGuesserWindow() {
    createGuesserDiv();

    document.getElementById("game-div-guesser").style.display = "block";
    swapWindow("pvp-setup-div", "game-div");
}

function createCodeArea() {
    let row = document.getElementById("m-code-div");
    let button = document.getElementById("code-button");

    for(let i = 0; i < 4; i++) {
        let buttonClone = button.cloneNode();
        let buttonObj = {
            button: buttonClone,
            color: "rgb(194, 194, 194)",
            setColor: function(c) {
                this.color = c;
                this.button.style.backgroundColor = c;
            }
        };
        buttonObj.button.onclick = (e) => {
            showColorSelection(codeButtonSelected, buttonObj);
        }
        codeButtons[i] = buttonObj;
        row.appendChild(buttonClone);
    }
    row.removeChild(button);
}

function createGuesserDiv() {
    let guessesDiv = document.getElementById("g-guesses-div");
    let resultsDiv = document.getElementById("g-results-div"); 
    let guessRow = document.getElementById("g-guesses-row");
    let resultRow = document.getElementById("g-results-row");
    let guessButton = document.getElementById("g-guesses-button");
    let resultButton = document.getElementById("g-results-button");

    for(let i = 0; i < 10; i++) {
        let gRowClone = guessRow.cloneNode();
        let rRowClone = resultRow.cloneNode();
        guessButtons[i] = new Array(4);
        resultButtons[i] = new Array(4);
        for(let j = 0; j < 4; j++) {
            let gButtonClone = guessButton.cloneNode();
            let rButtonClone = resultButton.cloneNode();
            let buttonObj = {
                button: gButtonClone,
                color: "rgb(194, 194, 194)",
                setColor: function(c) {
                    this.color = c;
                    this.button.style.backgroundColor = c;
                }
            };
            buttonObj.button.onclick = () => {
                showColorSelection(guessButtonSelected, buttonObj);
            }
            
            gRowClone.appendChild(gButtonClone);
            rRowClone.appendChild(rButtonClone);
            guessButtons[i][j] = buttonObj;
            resultButtons[i][j] = {
                button: rButtonClone,
                color: "rgb(194, 194, 194)",
                setColor: function(c) {
                    this.color = c;
                    this.button.style.backgroundColor = c;
                }
            };
        }
        guessesDiv.appendChild(gRowClone);
        resultsDiv.appendChild(rRowClone);
    }
    guessRow.removeChild(guessButton);
    resultRow.removeChild(resultButton);
    guessesDiv.removeChild(guessRow);
    resultsDiv.removeChild(resultRow);
}

function createMastermindDiv() {
    let guessesDiv = document.getElementById("m-guesses-div");
    let resultsDiv = document.getElementById("m-results-div"); 
    let guessRow = document.getElementById("m-guesses-row");
    let resultRow = document.getElementById("m-results-row");
    let guessButton = document.getElementById("m-guesses-button");
    let resultButton = document.getElementById("m-results-button");

    for(let i = 0; i < 10; i++) {
        let gRowClone = guessRow.cloneNode();
        let rRowClone = resultRow.cloneNode();
        guessButtons[i] = new Array(4);
        resultButtons[i] = new Array(4);
        for(let j = 0; j < 4; j++) {
            let gButtonClone = guessButton.cloneNode();
            let rButtonClone = resultButton.cloneNode();
            let buttonObj = {
                button: rButtonClone,
                color: "rgb(194, 194, 194)",
                setColor: function(c) {
                    this.color = c;
                    this.button.style.backgroundColor = c;
                }
            };
            buttonObj.button.onclick = () => {
                showBWColorSelection(resultButtonSelected, buttonObj);
            }

            gRowClone.appendChild(gButtonClone);
            rRowClone.appendChild(rButtonClone);
            guessButtons[i][j] = {
                button: gButtonClone,
                color: "rgb(194, 194, 194)",
                setColor: function(c) {
                    this.color = c;
                    this.button.style.backgroundColor = c;
                }
            };
            resultButtons[i][j] = buttonObj;
        }
        guessesDiv.appendChild(gRowClone);
        resultsDiv.appendChild(rRowClone);
    }
    guessRow.removeChild(guessButton);
    resultRow.removeChild(resultButton);
    guessesDiv.removeChild(guessRow);
    resultsDiv.removeChild(resultRow);
}

function codeButtonSelected(button, color) {
    colorButton(button, color);
    let readyButton = document.getElementById("ready-button");
    if(emptyPins) readyButton.disabled = false;
    else {
        let done = true;
        for(i = 0; i < codeButtons.length; i++) if(codeButtons[i].color == "rgb(194, 194, 194)") done = false;
        if(done) readyButton.disabled = false;
    }
}

function resultButtonSelected(button, color) {
    colorButton(button, color);
}

function guessButtonSelected(button, color) {
    colorButton(button, color);
    if(emptyPins) readyButton.disabled = false;
    else {
        let done = true;
        for(i = 0; i < guessButtons[9-round].length; i++) if(guessButtons[9-round][i].color == "rgb(194, 194, 194)") done = false;
        if(done) readyButton.disabled = false;
    }
}

function colorButton(button, color) {
    button.setColor(color);
}

function createColorDiv() {
    let div = document.getElementById("color-all-div");
    if(isMastermind) {
        div.style.left = "0%";
    }
    else div.style.left = "100%";
    const colors = ["black", "white", "red", "#00b359", "#0099ff", "#ffff66"];

    for(let i = 0; i < 6; i++) {
        let button = document.createElement("button");
        button.style.backgroundColor = colors[i];

        colorButtons[i] = button;

        div.appendChild(button);
    }
}

function createBWColorDiv() {
    let div = document.getElementById("color-bw-div");
    const colors = ["black", "white"];

    for(let i = 0; i < 2; i++) {
        let button = document.createElement("button");
        button.style.backgroundColor = colors[i];

        bwButtons[i] = button;

        div.appendChild(button);
    }
}

function checkIsRepeated(color) {
    if(isMastermind) {
        for(i = 0; i < codeButtons.length; i++) {
            if(color == codeButtons[i].color) return true;
        }
        return false;
    }
    else {
        for(i = 0; i < guessButtons[9-round].length; i++) {
            if(color == guessButtons[9-round][i].color) return true;
        }
        return false;
    }
}

function showColorSelection(func, selectedButton) {
    let animation = "color-popup-right";
    if(isMastermind) animation = "color-popup-left";

    for(let i = 0; i < colorButtons.length; i++) {
        let button = colorButtons[i];
        if(repeatPins && checkIsRepeated(button.style.backgroundColor)) {
            button.disabled = true;
            continue;
        }
        button.disabled = false;

        button.onclick = () => {
            func(selectedButton, button.style.backgroundColor);
            hideColorSelection();
        }
    }

    document.getElementById("color-all-div").style.display = "block";
    document.getElementById("color-all-div").style.animationName = animation;
}

function showBWColorSelection(func, selectedButton) {
    for(let i = 0; i < bwButtons.length; i++) {
        bwButtons[i].onclick = () => {
            func(selectedButton, bwButtons[i].style.backgroundColor);
            hideBWColorSelection();
        }
    }

    document.getElementById("color-bw-div").style.display = "block";
    document.getElementById("color-bw-div").style.animationName = "color-popup-right";
}

function hideColorSelection() {
    let animation = "color-popup-right";
    if(!isMastermind) animation = "color-popup-left";

    document.getElementById("color-all-div").style.animationName = animation;
}

function hideBWColorSelection() {
    document.getElementById("color-bw-div").style.animationName = "color-popup-left";
}