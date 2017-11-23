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
    console.log("Master: " + isMastermind);
    let height = window.outerHeight - 330;
    document.getElementById("game-div").style.height = height + "px";
    document.getElementById("game-div").style.width = (height * 0.5) + "px";
    document.getElementById("ready-button").addEventListener("click", () => document.getElementById("ready-button").disabled = true);
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
    document.getElementById("exit-button").onclick = exitGame;
    if(debug && isMastermind) {
        colorButton(guessButtons[0][0], pinColors[0]);
        colorButton(guessButtons[0][1], pinColors[2]);
        colorButton(guessButtons[0][2], pinColors[4]);
        colorButton(guessButtons[0][3], pinColors[1]);

        colorButton(codeButtons[0], pinColors[0]);
        colorButton(codeButtons[1], pinColors[3]);
        colorButton(codeButtons[2], pinColors[1]);
        colorButton(codeButtons[3], pinColors[4]);
    }
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
            if(!debug) buttonObj.setDisabled(true);
            let altObject = createButtonObj(rButtonClone, buttonBG);
            if(!debug) altObject.setDisabled(true);
            
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
            if(!debug) buttonObj.setDisabled(true);
            let altObject = createButtonObj(gButtonClone, buttonBG);
            if(!debug) altObject.setDisabled(true);

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
    let obj = {
        button: btn,
        color: null,
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
    obj.setColor(clr);
    return obj;
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
            let size = gameDiv.offsetHeight * 0.09;
            codeButtons[i].button.style.width = size + "px";
            codeButtons[i].button.style.height = size + "px";
        }
    }
    for(i = 0; i < guessButtons.length; i++) {
        for(j = 0; j < guessButtons[i].length; j++) {
            let size = gameDiv.offsetHeight * 0.055;
            guessButtons[i][j].button.style.width = size + "px";
            guessButtons[i][j].button.style.height = size + "px";
        }
    }
    for(i = 0; i < resultButtons.length; i++) {
        for(j = 0; j < resultButtons[i].length; j++) {
            let size = gameDiv.offsetHeight * 0.034;
            resultButtons[i][j].button.style.width = size + "px";
            resultButtons[i][j].button.style.height = size + "px";
        }
    }
}

function setReadyAction(action) {
    document.getElementById("ready-button").onclick = () => {
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

function isResultValid() {
    let results = new Array(4);
    let tempArr = codeButtons;
    for(i = 0; i < guessButtons[round].length; i++) {
        let guess = guessButtons[round][i];
        if(tempArr[i] == null) continue;
        if(guess == undefined && tempArr[i] == undefined || guess.equalColor(tempArr[i].color)) {
            results[i] = "black";
            tempArr[i] = null;
        }
        else {
            for(j = 0; j < tempArr.length; j++) {
                if(tempArr[i] != null && guess == undefined && tempArr[i] == undefined || guess.equalColor(tempArr[i].color)) {
                    results[i] = "white";
                    tempArr[i] = null;
                    break;
                }
            }
        }
    }
    for(j = 0; j < resultButtons[round].length; j++) {
        for(i = 0; i < results.length; i++) {
            if(results[i] == null) continue;
            if(resultButtons[round][j] == undefined && results[i] == undefined || resultButtons[round][j].equalColor(results[i])) {
                results[i] == null;
            }
        }
    }
    for(i = 0; i < results.length; i++) {
        if(results[i] != null) return false;
    }
    return true;
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
    if(isResultValid()) {
        console.log("Valid");
        document.getElementById("ready-button").disabled = false;
    }
    else console.log("Invalid");
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
        colorButtons[i] = createButtonObj(button, pinColors[i]);

        div.appendChild(button);
    }
}

function createBWColorDiv() {
    let div = document.getElementById("color-bw-div");

    for(let i = 0; i < bwButtons.length; i++) {
        let button = document.createElement("button");
        bwButtons[i] = createButtonObj(button, pinColors[i]);

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
        if(!repeatPins && checkIsRepeated(button.color)) {
            button.setDisabled(true);
            continue;
        }
        button.setDisabled(false);

        button.button.onclick = () => {
            func(selectedButton, button.color);
            hideColorSelection();
        }
    }

    document.getElementById("color-all-div").style.display = "block";
    document.getElementById("color-all-div").style.animationName = animation;
}

function showBWColorSelection(func, selectedButton) {
    for(let i = 0; i < bwButtons.length; i++) {
        bwButtons[i].button.onclick = () => {
            func(selectedButton, bwButtons[i].color);
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

function exitGame() {

}

function checkGuesserUpdate() {
    setInterval(() => {
        if(round > 0) {
            loadResultsFromDB();
        }
        else {
            let http = prepareLoad(gameId);
            http.onreadystatechange = function() {
                if(this.readyState == 4) {
                    if(this.status == 200) {
                        unpackFromJSON(this.responseText);
                        if(masterCode != null) {
                            enableCurrentRow();
                        }
                    }
                    else if(this.status == 500) {
                        console.log(this.responseText);
                    }
                }
            };
            http.send();
        }
    }, 1000);
}

function checkMastermindUpdate() {
    setInterval(() => {
        let currentRound = round;
        loadGameFromDB(gameId);
        if(currentRound != round) {
            loadGuessesFromDB();
            enableCurrentRow();
        }
    }, 1000);
}

function guessesLoaded(guesses) {
    for(i = 0; i < guesses[round]; i++) {
        let color = pinColors[guesses[round][i].charAt(i)];
        colorButton(guessButtons[round][i], color);
    }
}

function resultsLoaded(results) {
    if(results.length == round) {
        for(i = 0; i < results[round-1]; i++) {
            let color = pinColors[results[round-1][i].charAt(i)];
            colorButton(resultButtons[round-1][i], color);
        }
    }
}

function prepareLoadGuesses() {
    var http = new XMLHttpRequest();
    http.open("POST", "/projects/mastermind/load_guesses.php", true);

    return http;
}

function loadGuessesFromDB() {
    let http = prepareLoadGuesses();
    
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

    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send("id=" + gameId);
}

function prepareLoadResults() {
    var http = new XMLHttpRequest();
    http.open("POST", "/projects/mastermind/load_results.php", true);

    return http;
}

function loadResultsFromDB() {
    var http = prepareLoadResults();
    
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

    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
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
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
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
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send("result=" + jsonMsg);
}