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
    if(search != "all") {
        search = document.getElementById(search).value;
    }
    var http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        let valid = checkValidity(this);
        if(valid == "wait") return;
        else if(valid == "error") {
            console.log("Error!");
            return;
        }
        else if(this.responseText == "empty") {
            console.log("empty");
            return "empty";
        }

        createLists(JSON.parse(this.responseText));
    };
    http.open("GET", "/projects/mastermind/load_game.php?search=" + search, true);
    http.send();
}

function createLists(results) {
    let listParent = document.getElementById("game-list");
    while(listParent.firstChild) {
        listParent.removeChild(listParent.firstChild);
    }

    let headerDiv = document.createElement("div");
    headerDiv.style.borderBottom = "solid";
    headerDiv.className = "search-result-div";

    let labels = ["ID", "Name", "Round", "Status", "Repeat Pins", "Empty Pins"];

    for(s = 0; s < labels.length; s++) {
        let p = document.createElement("p");
        p.textContent = labels[s];
        headerDiv.appendChild(p);
    }

    listParent.appendChild(headerDiv);

    for(i = 0; i < results.length; i++) {
        (function() {
            let listDiv = document.createElement("div");
            listDiv.className = "search-result-div";
    
            for(j = 0; j < 6; j++) {
                let p = document.createElement("p");
                p.textContent = ""+results[i][j];
                listDiv.appendChild(p);
            }
    
            let joinButton = document.createElement("button");
            joinButton.textContent = "Join";
            joinButton.className = "btn btn-primary";
            joinButton.addEventListener("click", () => { 
                console.log(results[0]);
                joinLobby(results[i][0]); 
            });
            listDiv.appendChild(joinButton);
    
            listParent.appendChild(listDiv);
        })();
    }
}

function joinLobby(id) {
    loadGameFromDB(id);
    swapWindow("search-game-div", "pvp-setup-div");
    lockLobby();
    updateLobbyValues();
}

function lockLobby() {
    document.getElementById("check-mastermind").disabled = true;
    document.getElementById("game-name").readOnly = true;
    document.getElementById("check-repeat").disabled = true;
    document.getElementById("check-empty").disabled = true;
}

function updateLobbyValues() {
    document.getElementById("check-mastermind").checked = isMastermind;
    document.getElementById("game-name").value = name;
    document.getElementById("game-id").textContent = gameId;
    document.getElementById("check-repeat").checked = repeatPins;
    document.getElementById("check-empty").checked = emptyPins;
}

function loadGameFromDB(id) {
    var http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        let valid = checkValidity(this);
        if(valid == "wait") return;
        else if(valid == "error") {
            console.log("Error!");
            return;
        }
        else if(this.responseText == "empty") {
            console.log("empty");
            return "empty";
        }

        let arr = JSON.parse(this.responseText);
        gameId = arr[0][0];
        name = arr[0][1];
        turn = arr[0][2] == MASTERMIND_TURN;
        status = arr[0][3];
        round = arr[0][4];
        repeatPins = arr[0][5] == 1;
        emptyPins = arr[0][6] == 1;
        isMastermind = arr[0][7] == 1;
    };
    http.open("GET", "/projects/mastermind/load_game.php?search=" + id, true);
    http.send();
}

function checkValidity(http) {
    if(http.readyState != 4) return "wait";
    if(http.status != 200) return "error";
    return null;
}

function showLogin() {
    
}