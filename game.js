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
}

function doAutomaticGame() {
    var readyButton = document.getElementById("ready-button");
    for(i = 0; i < codeButtons.length; i++) {
        codeButtonSelected(codeButtons[i], pinColors[1+i]);
    }
    readyButton.click();

    let interval = setInterval(() => {
        for(i = 0; i < guessButtons[round].length; i++) {
            guessButtonSelected(codeButtons[round][i], pinColors[i]);
        }
        readyButton.click();
        setTimeout(() => {
            let result = getResultForCurrentGuess(codeButtons, guessButtons[round]);
            for(i = 0; i < resultButtons[round].length; i++) {
                resultButtonSelected(resultButtons[round][i], result[i] == undefined ? buttonBG : result[i]);
            }
            readyButton.click();
        }, 1500);
        round++;
        if(checkGameOver()) clearInterval(interval);
    }, 2000);
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
        equalColor: function(otherColor) {
            return this.color == otherColor;
        },
        isEmpty: function() {
            return this.color == buttonBG;
        }
    }
    obj.setColor(clr);
    return obj;
}

function getColorAsIndex(color) {
    if(color == buttonBG) return 6;
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
            let size = window.outerHeight * 0.06;
            codeButtons[i].button.style.width = size + "px";
            codeButtons[i].button.style.height = size + "px";
        }
    }
    for(i = 0; i < guessButtons.length; i++) {
        for(j = 0; j < guessButtons[i].length; j++) {
            let size = window.outerHeight * 0.04;
            guessButtons[i][j].button.style.width = size + "px";
            guessButtons[i][j].button.style.height = size + "px";
        }
    }
    for(i = 0; i < resultButtons.length; i++) {
        for(j = 0; j < resultButtons[i].length; j++) {
            let size = window.outerHeight * 0.0202;
            resultButtons[i][j].button.style.width = size + "px";
            resultButtons[i][j].button.style.height = size + "px";
        }
    }
}

function setReadyAction(action) {
    let button = document.getElementById("ready-button");
    button.onclick = () => {
        button.disabled = true;
        action();
    }
}

function guessPlaced() {
    if(isOnline) saveGuessToDB();
    saveGameToDB();
    if(isOnline) checkGuesserUpdate();
}

function resultPlaced() {
    if(isOnline) saveResultToDB();
    round++;
    saveGameToDB();
    if(checkGameOver()) return;
    if(isOnline) checkMastermindUpdate();
}

function masterCodeSet() {
    let code = "";
    for(i = 0; i < codeButtons.length; i++) {
        code += ""+getColorAsIndex(codeButtons[i].color);
    }
    masterCode = code;
    if(isOnline) saveGameToDB();
    setReadyAction(resultPlaced);
    if(isOnline) checkMastermindUpdate();
}

function checkGameOver() {
    if(!isMastermind && status == "ended") {
        if(round > 9) masterMindWon();
        else guesserWon();
    }
    else if(round > 9) {
        masterMindWon();
        return true;
    }
    else {
        let gameOver = true;
        let guess = guessButtons[round-1];
        for(i = 0; i < codeButtons.length; i++) {
            if(!guess[i].equalColor(codeButtons[i].color)) {
                gameOver = false;
                break;
            }
        }
        if(gameOver) guesserWon();
        return gameOver;
    }
}

function guesserWon() {
    gameOver();
    if(isMastermind) alert("You lost!");
    else alert("You won!");
}

function masterMindWon() {
    gameOver();
    if(isMastermind) alert("You won!");
    else alert("You lost!");
}

function gameOver() {
    status = "ended";
    saveGameToDB();
}

function getResultForCurrentGuess(code, guess) {
    var outcome = new Array(4);
    var tempArr = new Array(4);
    for(i = 0; i < tempArr.length; i++) tempArr[i] = code[i];
    for(i = 0; i < guess.length; i++) {
        var guessPin = guess[i];
        if(tempArr[i] != null && guessPin.equalColor(tempArr[i].color)) {
            outcome[i] = "black";
            tempArr[i] = null;
        }
        else {
            for(j = 0; j < tempArr.length; j++) {
                if(tempArr[j] == null) continue;
                else if(guessPin.equalColor(tempArr[j].color)) {
                    outcome[i] = "white";
                    tempArr[j] = null;
                    break;
                }
            }
        }
    }
    return outcome;
}

function isResultValid(code, guess, results) {
    var outcome = getResultForCurrentGuess(code, guess);
    for(i = 0; i < results.length; i++) {
        for(j = 0; j < outcome.length; j++) {
            if(outcome[j] != undefined && outcome[j] == null) continue;
            if(results[i].isEmpty() && outcome[j] == undefined || results[i].equalColor(outcome[j])) {
                outcome[j] = null;
                break;
            }
        }
    }
    for(i = 0; i < outcome.length; i++) {
        if(outcome[i] != null) return false;
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
    if(isResultValid(codeButtons, guessButtons[round], resultButtons[round])) {
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
    let interval = setInterval(() => {
        let http = prepareLoad(gameId);
        http.onreadystatechange = function() {
            if(this.readyState == 4) {
                if(this.status == 200) {
                    let currentRound = round;
                    let code = masterCode;
                    unpackFromJSON(this.responseText);
                    if(currentRound != round) {
                        loadResultsFromDB(interval);
                    }
                    else if(round == 0 && code != masterCode) {
                        enableCurrentRow();
                        clearInterval(interval);
                    }
                }
                else if(this.status == 500) {
                    console.log(this.responseText);
                }
            }
        };
        http.send();
    }, 1000);
}

function checkMastermindUpdate() {
    let interval = setInterval(() => {
        loadGuessesFromDB(interval);
    }, 1000);
}

function guessesLoaded(guesses, interval) {
    if(guesses.length == round + 1) {
        clearInterval(interval);
        let guessString = ""+guesses[round][0]; 
        for(i = 0; i < guessString.length; i++) {
            let char = guessString.charAt(i);
            let color = buttonBG;
            if(char != '6') color = pinColors[parseInt(char)];
            colorButton(guessButtons[round][i], color);
        }
        enableCurrentRow();
    }
}

function resultsLoaded(results) {
    let resultString = ""+results[round-1][0];
    for(i = 0; i < resultString.length; i++) {
        let char = resultString.charAt(i);
        let color = buttonBG;
        if(char != '6') color = pinColors[parseInt(char)];
        colorButton(resultButtons[10-round][i], color);
    }
    if(checkGameOver()) return;
    enableCurrentRow();
}

function prepareLoadGuesses() {
    var http = new XMLHttpRequest();
    http.open("POST", "/projects/mastermind/load_guesses.php", true);

    return http;
}

function loadGuessesFromDB(interval) {
    let http = prepareLoadGuesses();
    
    http.onreadystatechange = function() {
        let valid = checkValidity(this);
        if(valid == "wait") return;
        else if(valid == "error") {
            console.log("Error: " + this.responseText);
            return;
        }
        else if(this.responseText == "empty") {
            return;
        }
        guessesLoaded(JSON.parse(this.responseText), interval);
    };

    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send("id=" + gameId);
}

function prepareLoadResults() {
    var http = new XMLHttpRequest();
    http.open("POST", "/projects/mastermind/load_results.php", true);

    return http;
}

function loadResultsFromDB(interval) {
    var http = prepareLoadResults();
    
    http.onreadystatechange = function() {
        let valid = checkValidity(this);
        if(valid == "wait") return;
        else if(valid == "error") {
            console.log("Error: " + this.responseText);
            return;
        }
        else if(this.responseText == "empty") {
            console.log("Empty");
            return;
        }
        resultsLoaded(JSON.parse(this.responseText));
        clearInterval(interval);
    };

    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send("id=" + gameId);
}

function getCurrentGuess() {
    let guess = "";
    for(i = 0; i < guessButtons[9-round].length; i++) {
        guess += ""+getColorAsIndex(guessButtons[9-round][i].color);
    }

    return guess;
}

function getCurrentResult() {
    let result = "";
    for(i = 0; i < resultButtons[round].length; i++) {
        result += ""+getColorAsIndex(resultButtons[round][i].color);
    }

    return result;
}

function packGuessToJSON() {
    let json = { "id":gameId, "guess": getCurrentGuess() };
    return JSON.stringify(json);
}

function packResultToJSON() {
    let json = { "id":gameId, "result": getCurrentResult() };
    return JSON.stringify(json);
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