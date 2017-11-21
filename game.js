const MASTERMIND_TURN = true;
const buttonBG = "rgb(194, 194, 194)";
const buttonDisabled = "rgb(102, 102, 102)";
const pinColors = ["black", "white", "red", "#00b359", "#0099ff", "#ffff66"];

var codeButtons = null;
var guessButtons = null;
var resultButtons = null;
var colorButtons = null;
var bwButtons = null;

function createGame() {
    document.getElementById("game-div").style.height = (window.innerHeight-300) + "px";
    codeButtons = new Array(4);
    guessButtons = new Array(10);
    resultButtons = new Array(10);
    colorButtons = new Array(6);
    bwButtons = new Array(2);
    if(isMastermind) createMastermindWindow();
    else createGuesserWindow();
    createColorDiv();
    createBWColorDiv();
    setButtonSizes();
}

function createMastermindWindow() {
    createMastermindDiv();
    createCodeArea();
    setReadyAction(masterCodeSet);

    document.getElementById("game-div-mastermind").style.display = "block";
    swapWindow("pvp-setup-div", "game-div");
}

function createGuesserWindow() {
    createGuesserDiv();
    setReadyAction(guessPlaced);

    document.getElementById("game-div-guesser").style.display = "block";
    swapWindow("pvp-setup-div", "game-div");

    checkGuesserUpdate();
}

function createCodeArea() {
    let gameDiv = document.getElementById("game-div");
    let row = document.getElementById("m-code-div");
    let button = document.getElementById("code-button");

    for(let i = 0; i < 4; i++) {
        let buttonClone = button.cloneNode();
        let buttonObj = createButtonObj(buttonClone, buttonBG);
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
            let buttonObj = createButtonObj(gButtonClone, buttonBG);
            buttonObj.button.onclick = () => {
                showColorSelection(guessButtonSelected, buttonObj);
            }
            buttonObj.setDisabled(true);
            let altObject = createButtonObj(rButtonClone, buttonBG);
            altObject.setDisabled(true);
            
            gRowClone.appendChild(gButtonClone);
            rRowClone.appendChild(rButtonClone);
            guessButtons[i][j] = buttonObj;
            resultButtons[i][j] = altObject;
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
    let gameDiv = document.getElementById("game-div");
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
            
            let buttonObj = createButtonObj(rButtonClone, buttonBG);
            buttonObj.button.onclick = () => {
                showBWColorSelection(resultButtonSelected, buttonObj);
            }
            buttonObj.setDisabled(true);
            let altObject = createButtonObj(gButtonClone, buttonBG);
            altObject.setDisabled(true);

            gRowClone.appendChild(gButtonClone);
            rRowClone.appendChild(rButtonClone);
            guessButtons[i][j] = altObject;
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

function createButtonObj(btn, clr) {
    return {
        button: btn,
        color: clr,
        setColor: function(c) {
            this.color = c;
            this.button.style.backgroundColor = c;
        },
        setDisabled: function(disabled) {
            this.button.disabled = disabled;
            if(disabled) this.button.style.backgroundColor = buttonDisabled;
            else this.button.style.backgroundColor = this.color;
        },
        equalColor: function(otherButton) {
            return this.color == otherButton.color;
        }
    }
}

function getColorAsIndex(color) {
    if(color == buttonBG) return -1;
    return pinColors.indexOf(color);
}

function enableCurrentRow() {
    if(isMastermind) {
        for(i = 0; i < resultButtons[round].length; i++) {
            resultButtons[round][i].setDisabled(false);
        }
    }
    else {
        for(i = 0; i < guessButtons[9-round].length; i++) {
            guessButtons[9-round][i].setDisabled(false);
        }
    }
}

function setButtonSizes() {
    let gameDiv = document.getElementById("game-div");
    if(isMastermind) {
        for(i = 0; i < codeButtons.length; i++) {
            let size = gameDiv.offsetHeight * 0.093;
            codeButtons[i].button.style.width = size + "px";
            codeButtons[i].button.style.height = size + "px";
        }
    }
    for(i = 0; i < guessButtons.length; i++) {
        for(j = 0; j < guessButtons[i].length; j++) {
            let size = gameDiv.offsetHeight * 0.065;
            guessButtons[i][j].button.style.width = size + "px";
            guessButtons[i][j].button.style.height = size + "px";
        }
    }
    for(i = 0; i < resultButtons.length; i++) {
        for(j = 0; j < resultButtons[i].length; j++) {
            let size = gameDiv.offsetHeight * 0.0323;
            resultButtons[i][j].button.style.width = size + "px";
            resultButtons[i][j].button.style.height = size + "px";
        }
    }
}

function setReadyAction(action) {
    document.getElementById("play-button").onclick = () => {
        action();
    }
}

function guessPlaced() {
    saveGuessToDB();
    round++;
    turn = !turn;
    saveGameToDB();
}

function resultPlaced() {
    saveResultToDB();
    turn = !turn;
    saveGameToDB();
}

function masterCodeSet() {
    let code = "";
    for(i = 0; i < codeButtons.length; i++) {
        code += getColorAsIndex(codeButtons[i].color);
    }
    masterCode = code;
    turn = !turn;
    saveGameToDB();
    checkMastermindUpdate();
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
    let readyButton = document.getElementById("ready-button");
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

    for(let i = 0; i < 6; i++) {
        let button = document.createElement("button");
        button.style.backgroundColor = pinColors[i];

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

function checkGuesserUpdate() {

}

function checkMastermindUpdate() {

}

function guessesLoaded(guesses) {
    for(i = 0; i < guesses.length; i++) {

    }
}

function resultsLoaded(results) {
    
}

function loadGuessesFromDB() {
    var http = new XMLHttpRequest();
    
    http.onreadystatechange = function() {
        let valid = checkValidity(this);
        if(valid == "wait") return;
        else if(valid == "error") {
            console.log("Error: " + this.responseText);
            return;
        }
        else if(valid == "empty") {
            console.log("Empty");
            return;
        }
        guessesLoaded(JSON.parse(this.responseText));
    };

    http.open("POST", "/projects/mastermind/load_guesses.php", true);
    http.send("id=" + gameId);
}

function loadResultsFromDB() {
    var http = new XMLHttpRequest();
    
    http.onreadystatechange = function() {
        let valid = checkValidity(this);
        if(valid == "wait") return;
        else if(valid == "error") {
            console.log("Error: " + this.responseText);
            return;
        }
        else if(valid == "empty") {
            console.log("Empty");
            return;
        }
        resultsLoaded(JSON.parse(this.responseText));
    };

    http.open("POST", "/projects/mastermind/load_results.php", true);
    http.send("id=" + gameId);
}

function getCurrentGuess() {
    let guess = "";
    for(i = 0; i < guessButtons[9-round].length; i++) {
        guess += getColorAsIndex(guessButtons[9-round][i].color);
    }

    return guess;
}

function getCurrentResult() {
    let result = "";
    for(i = 0; i < resultButtons[round].length; i++) {
        result += getColorAsIndex(resultButtons[round][i].color);
    }

    return result;
}

function packGuessToJSON() {
    return { "gameId":gameId, "guess": getCurrentGuess() };
}

function packResultToJSON() {
    return { "gameId":gameId, "result": getCurrentResult() };
}

function saveGuessToDB() {
    var http = new XMLHttpRequest();
    let jsonMsg = packGuessToJSON();

    http.onreadystatechange = function() {
        let valid = checkValidity(this);
        if(valid == "wait") return;
        else if(valid == "error") {
            console.log("Error: " + this.responseText);
            return;
        }
    };

    http.open("POST", "/projects/mastermind/save_guesses.php", true);
    http.send("guess=" + jsonMsg);
}

function saveResultToDB() {
    var http = new XMLHttpRequest();
    let jsonMsg = packResultToJSON();

    http.onreadystatechange = function() {
        let valid = checkValidity(this);
        if(valid == "wait") return;
        else if(valid == "error") {
            console.log("Error: " + this.responseText);
            return;
        }
    };

    http.open("POST", "/projects/mastermind/save_results.php", true);
    http.send("result=" + jsonMsg);
}