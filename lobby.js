function setMastermind(id) {
    creatorMastermind = document.getElementById(id).checked;
    saveGameToDB();
}

function setRepeatPins(id) {
    repeatPins = document.getElementById(id).checked;
    saveGameToDB();
}

function setEmptyPins(id) {
    emptyPins = document.getElementById(id).checked;
    saveGameToDB();
}

function setShownID() {
    document.getElementById("game-id").innerText = "Game ID: " + gameId;
}

function exitLobby() {
    if(status == "lobby") status = "dead";
    else status = "lobby";
    let readyButton = document.getElementById("play-button");
    if(readyButton != null) document.getElementById("game-setup-div").removeChild(readyButton);
    
    saveGameToDB();
}

function editGameName() {
    let button = document.getElementById("edit-game-name");
    let txtField = document.getElementById("game-name");

    if(button.textContent == "Edit") {
        txtField.readOnly = false;
        button.textContent = "OK";
    }
    else {
        button.textContent = "Edit";
        name = txtField.value;
        txtField.readOnly = true;
        saveGameToDB();
    }
}

function setInitialAIValues() {
    isOnline = false;
    setInitialSharedValues();
}

function setInitialPVPValues() {
    setInitialSharedValues();
    status = "lobby";
    isOnline = true;
    gameId = null
    name = document.getElementById("game-name").value;
}

function setInitialSharedValues() {
    creatorMastermind = true;
    round = 0;
    masterCode = null;
    repeatPins = false;
    emptyPins = false;

    document.getElementById("check-mastermind").checked = creatorMastermind;
    document.getElementById("check-repeat").checked = repeatPins;
    document.getElementById("check-empty").checked = emptyPins;
}

function createAIGame() {
    setInitialAIValues();
    let items = document.getElementsByClassName("pvp-settings-content");
    for(i = 0; i < items.length; i++) {
        items.item(i).style.display = "none";
    }
    document.getElementById("game-mode").textContent = "Player vs. AI";

    addStartGameButton();
}

function createPVPGame() {
    setInitialPVPValues();
    document.getElementById("game-mode").textContent = "Player vs. Player";

    if(debug) {
        isMastermind = true;
        isOnline = false
        createGame();
        return;
    }

    let http = prepareSave();
    http.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                let oldId = gameId;
                gameId = this.responseText;

                if(oldId == null) {
                    setShownID();
                }
            }
            else if(this.status == 500) {
                console.log(this.responseText);
            }
        }
    };
    http.send();

    waitForJoin();
}

function addStartGameButton() {
    let startButton = document.createElement("button");
    startButton.id = "play-button";
    startButton.className = "btn btn-primary";
    startButton.textContent = "Play";
    startButton.onclick = function() {
        isMastermind = creatorMastermind;
        if(isOnline) {
            status = "underway";
            saveGameToDB();
        }
        createGame();
    };

    let setupDiv = document.getElementById("game-setup-div");
    setupDiv.insertBefore(startButton, document.getElementById("exit-lobby-button"));
}

function waitForJoin() {
    let statusLabel = document.getElementById("status-text");
    var dots = 0;
    var interval = setInterval(() => {
        statusLabel.innerText = statusLabel.innerText + ".";
        dots++;
        if(dots == 3) {
            statusLabel.innerText = "Waiting for opponent.";
            dots = 0;
        }

        loadAndWait(checkJoined, interval);
        
    }, 1000);
}

function loadAndWait(func, interval) {
    let http = prepareLoad(gameId);
    http.onreadystatechange = function() {
        let valid = checkValidity(this);
        if(valid == "wait") return;
        else if(valid == "error") {
            console.log("Error!");
            return;
        }
        else if(this.responseText == "empty") {
            return "empty";
        }

        unpackFromJSON(this.responseText);
        func(interval);
    }
    http.send();
}

function checkJoined(interval) {
    if(status == "full") {
        document.getElementById("status-text").innerHTML = "Someone joined! Press 'Play'<br>to start the game.";
        addStartGameButton();
        
        var ded = setInterval(() => {
            loadAndWait(checkDead, ded);
        }, 1000);
        clearInterval(interval);
    }
}

function checkDead(interval) {
    if(status == "underway" || status == "dead") {
        clearInterval(interval);
    }
}

function checkStarted(interval) {
    if(status == "underway") {
        isMastermind = !creatorMastermind;
        clearInterval(interval);
        createGame();
    }
    else if(status == "lobby") {
        document.getElementById("status-text").innerHTML = "Lobby leader left the lobby,<br>you are now the leader.";
        clearInterval(interval);
        newLobbyLeader();
    }
    else if(status == "dead") {
        clearInterval(interval);
        saveGameToDB();
    }
}

function joinLobby(id) {
    setInitialPVPValues();
    let http = prepareLoad(id);
    http.onreadystatechange = function() {
        let valid = checkValidity(this);
        if(valid == "wait") return;
        else if(valid == "error") {
            console.log("Error!");
            return;
        }
        else if(this.responseText == "empty") {
            return "empty";
        }
        gameId = id;

        unpackFromJSON(this.responseText);
        swapWindow("search-game-div", "pvp-setup-div");
        updateLobbyValues();
        lockLobby(true);
        saveGameToDB();

        waitForStart();
    };
    http.send();
}

function waitForStart() {
    var interval = setInterval(() => {
        loadAndWait(checkStarted, interval);
    }, 1000);
}

function newLobbyLeader() {
    lockLobby(false);
    document.getElementById("check-mastermind").checked = !creatorMastermind;
    setMastermind("check-mastermind");
    waitForJoin();
}

function lockLobby(locked) {
    document.getElementById("check-mastermind").disabled = locked;
    document.getElementById("game-name").readOnly = locked;
    document.getElementById("check-repeat").disabled = locked;
    document.getElementById("check-empty").disabled = locked;
}

function updateLobbyValues() {
    document.getElementById("check-mastermind").checked = !creatorMastermind;
    document.getElementById("game-name").value = name;
    document.getElementById("game-id").textContent = gameId;
    document.getElementById("check-repeat").checked = repeatPins;
    document.getElementById("check-empty").checked = emptyPins;
    round = 0;

    document.getElementById("status-text").innerHTML = "Waiting for lobby leader<br>to start the game...";
    status = "full";
}