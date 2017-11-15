const MASTERMIND_TURN = true;

var isMastermind = false;
var isOnline = false;
var gameId;
var name;
var turn;
var status;
var round;
var repeatPins = false;
var emptyPins = false;

function hideWindow(id) {
    document.getElementById(id).style.display = "none";
}

function showWindow(id) {
    document.getElementById(id).style.display = "block";
}

function swapWindow(oldId, newId) {
    hideWindow(oldId);
    showWindow(newId);
}

function setMastermind(id) {
    isMastermind = document.getElementById(id).checked;
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

function editGameName() {
    let txtField = document.getElementById("game-name");
    txtField.readOnly = false;
    let button = document.getElementById("edit-game-name");
    button.textContent = "OK";
    button.addEventListener("click", function(e) {
        button.textContent = "Edit";
        button.removeEventListener("click", this);
        name = txtField.value;
        saveGameToDB();
    });
}

function setInitialPVPValues() {
    setInitialSharedValues();
    status = "lobby";
    isOnline = true;
    gameId = null
    name = document.getElementById("game-name").value;
}

function setInitialSharedValues() {
    turn = MASTERMIND_TURN;
    round = 0;
}

function createPVPGame() {
    startWaiting();
    setInitialPVPValues();
    saveGameToDB();
}

function startWaiting() {
    let statusLabel = document.getElementById("status-text");
    var dots = 0;
    let originalText = statusLabel.innerText;
    setInterval(() => {
        statusLabel.innerText = statusLabel.innerText + ".";
        dots++;
        if(dots == 3) {
            statusLabel.innerText = "Waiting for opponent.";
            dots = 0;
        }
    }, 1000);
}

function saveGameToDB() {
    let gameInfo = { "id":gameId, "name":name, "turn":turn, "status":status, "round": round, "repeat":repeatPins, "empty":emptyPins };
    let jsonMsg = JSON.stringify(gameInfo);

    var http = new XMLHttpRequest();
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
    http.open("GET", "/projects/mastermind/save_game.php?game=" + jsonMsg, true);
    http.send();
}

function populateList(search) {
    let results = loadGameFromDB(search);
    if(results == null) {
        console.log("Error!");
        return;
    }
    else if(results == "empty") {
        console.log("Empty!");
        return;
    }

    for(i = 0; i < results.length; i++) {
        let listDiv = document.createElement("div");
        listDiv.id = "search-result-div";

        let pId = document.createElement("p");
        pId.textContent = "ID: " + results[i][0];
        listDiv.appendChild(pId);

        let pName = document.createElement("p");
        pName.textContent = "Name: " + results[i][1];
        listDiv.appendChild(pName);  
        
        let pStatus = document.createElement("p");
        pStatus.textContent = "Status: " + results[i][2];
        listDiv.appendChild(pStatus);

        let pRound = document.createElement("p");
        pRound.textContent = "Round: " + results[i][3];
        listDiv.appendChild(pRound);

        let pRepeat = document.createElement("p");
        pRepeat.textContent = "Repeat Pins: " + results[i][4];
        listDiv.appendChild(pRepeat);

        let pEmpty = document.createElement("p");
        pEmpty.textContent = "Empty Pins: " + results[i][5];
        listDiv.appendChild(pEmpty);

        document.getElementById("game-list").appendChild(listDiv);
    }
}

function loadGameFromDB(search) {
    var http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                if(this.responseText != "empty") {
                    return JSON.parse(this.responseText);
                }
                return "empty";
            }
            else {
                return null;
            }
        }
    };
    http.open("GET", "/projects/mastermind/load_game.php?search=" + search);
    http.send();
}

function showLogin() {
    
}